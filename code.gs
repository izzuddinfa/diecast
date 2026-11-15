// Diecast API: tempel di Google Sheets > Ekstensi > Apps Script
const TOKEN = 'GANTI_DENGAN_TOKEN_RAHASIA_ANDA'; // samakan dengan token di aplikasi
const SHEET = 'items';
const FOLDER = 'Diecast Foto';

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(SHEET);
  if (!s) {
    s = ss.insertSheet(SHEET);
    s.appendRow(['id', 'updated', 'deleted', 'nama', 'merek', 'json']);
    s.setFrozenRows(1);
  }
  return s;
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Folder foto dibuat di folder yang sama dengan spreadsheet ini
function folder_() {
  const parents = DriveApp.getFileById(SpreadsheetApp.getActive().getId()).getParents();
  const base = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
  const it = base.getFoldersByName(FOLDER);
  return it.hasNext() ? it.next() : base.createFolder(FOLDER);
}

function photo_(id, data) {
  const m = data.match(/^data:(image\/[\w+.-]+);base64,(.+)$/);
  if (!m) return '';
  const folder = folder_();
  const f = folder.createFile(Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], id + '.jpg'));
  f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return 'https://drive.google.com/thumbnail?id=' + f.getId() + '&sz=w480';
}

// Unggah semua foto (data:image) milik tiap pcs ke Drive, lalu isi ulang foto sampul
function conv_(it) {
  (it.ps || []).forEach((p, pi) => {
    p.ph = (p.ph || []).map((u, k) =>
      typeof u === 'string' && u.indexOf('data:image/') === 0 ? photo_(it.id + '-' + pi + '-' + k + '-' + Date.now(), u) : u);
  });
  const cp = (it.ps || []).find(p => p.ph && p.ph.length);
  it.photo = cp ? cp.ph[Math.min(cp.th || 0, cp.ph.length - 1)] : '';
}

function doGet() {
  return out_({ ok: true, msg: 'Diecast API aktif' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const b = JSON.parse(e.postData.contents);
    if (b.token !== TOKEN) return out_({ ok: false, error: 'Token salah' });
    if (b.get) { // ambil satu foto (untuk fitur unduh foto)
      const bl = DriveApp.getFileById(b.get).getBlob();
      return out_({ ok: true, data: 'data:' + bl.getContentType() + ';base64,' + Utilities.base64Encode(bl.getBytes()) });
    }
    const s = sheet_();
    const n = s.getLastRow() - 1;
    const rows = n > 0 ? s.getRange(2, 1, n, 6).getValues() : [];
    const pos = {};
    rows.forEach((r, i) => { pos[r[0]] = i + 2; });
    const now = Date.now(), since = Number(b.since) || 0;

    (b.items || []).forEach(it => {
      conv_(it);
      const row = [it.id, now, 0, it.name || '', it.brand || '', JSON.stringify(it)];
      if (pos[it.id]) {
        s.getRange(pos[it.id], 1, 1, 6).setValues([row]);
      } else {
        s.appendRow(row);
        pos[it.id] = s.getLastRow();
      }
    });
    (b.del || []).forEach(id => {
      if (pos[id]) s.getRange(pos[id], 2, 1, 2).setValues([[now, 1]]);
    });
    SpreadsheetApp.flush();

    const m = s.getLastRow() - 1;
    const all = m > 0 ? s.getRange(2, 1, m, 6).getValues() : [];
    const items = all.filter(r => r[1] > since).map(r => r[2] ? { id: r[0], del: true } : JSON.parse(r[5]));
    return out_({ ok: true, now: now, items: items });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
