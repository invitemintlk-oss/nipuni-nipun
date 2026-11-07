/**
 * Nipuni & Nipun – wedding invitation backend.
 * Saves RSVPs and wishes to Google Sheets and serves approved wishes back to the site.
 *
 * Sheet: https://docs.google.com/spreadsheets/d/1BkEj4knXmH_H2v_ca9XjGOIW0HTztQRm3Ie8G9lQVYA
 */
const SPREADSHEET_ID = '1BkEj4knXmH_H2v_ca9XjGOIW0HTztQRm3Ie8G9lQVYA';

const RSVP_SHEET = 'RSVP';
const WISH_SHEET = 'WISH';

const RSVP_HEADERS = ['Timestamp', 'Full Name', 'Guests', 'Dietary Notes', 'Event', 'Language'];
// "Show" column: wishes appear on the site while it says YES. Change a row to NO to hide it.
const WISH_HEADERS = ['Timestamp', 'Name', 'Message', 'Event', 'Language', 'Show'];

const MAX_FIELD_LENGTH = 1000;
const MAX_WISHES_RETURNED = 100;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const payload = parsePayload_(e);
    const sheetKey = String(payload.sheet || '').toUpperCase();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (sheetKey === RSVP_SHEET) {
      const fullName = clean_(payload.fullName);
      if (!fullName) return jsonResponse_({ ok: false, error: 'Name is required.' });

      const sheet = getSheet_(ss, RSVP_SHEET, RSVP_HEADERS);
      sheet.appendRow([
        new Date(),
        fullName,
        clean_(payload.guests),
        clean_(payload.dietaryNotes),
        clean_(payload.event),
        clean_(payload.lang),
      ]);
      return jsonResponse_({ ok: true });
    }

    if (sheetKey === WISH_SHEET) {
      const name = clean_(payload.name);
      const message = clean_(payload.message);
      if (!name || !message) return jsonResponse_({ ok: false, error: 'Name and message are required.' });

      const sheet = getSheet_(ss, WISH_SHEET, WISH_HEADERS);
      sheet.appendRow([new Date(), name, message, clean_(payload.event), clean_(payload.lang), 'YES']);
      return jsonResponse_({ ok: true });
    }

    return jsonResponse_({ ok: false, error: 'Invalid sheet. Use RSVP or WISH.' });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error && error.message ? error.message : error) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * GET ?action=wishes  -> latest wishes (newest first) where Show = YES
 * GET (no action)     -> health check
 */
function doGet(e) {
  const action = e && e.parameter ? String(e.parameter.action || '') : '';

  if (action === 'wishes') {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getSheet_(ss, WISH_SHEET, WISH_HEADERS);
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return jsonResponse_({ ok: true, wishes: [] });

    const rows = sheet.getRange(2, 1, lastRow - 1, WISH_HEADERS.length).getValues();
    const wishes = rows
      .filter(function (r) { return r[1] && r[2] && String(r[5] || 'YES').toUpperCase() !== 'NO'; })
      .map(function (r, i) {
        const ts = r[0] instanceof Date ? r[0] : new Date(r[0]);
        return {
          id: String(i + 2),
          name: String(r[1]),
          message: String(r[2]),
          createdAt: isNaN(ts.getTime()) ? null : ts.toISOString(),
        };
      })
      .reverse()
      .slice(0, MAX_WISHES_RETURNED);

    return jsonResponse_({ ok: true, wishes: wishes });
  }

  return jsonResponse_({ ok: true, message: 'Nipuni & Nipun wedding endpoint is running.' });
}

/** Run once from the editor (select setup ▸ Run) to create both tabs with headers. */
function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  getSheet_(ss, RSVP_SHEET, RSVP_HEADERS);
  getSheet_(ss, WISH_SHEET, WISH_HEADERS);
}

// ---------------- helpers ----------------

function parsePayload_(e) {
  const params = e && e.parameter ? e.parameter : {};
  if (Object.keys(params).length > 0) return params;

  const contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) return {};

  try {
    return JSON.parse(contents);
  } catch (_error) {
    return {};
  }
}

function clean_(value) {
  let s = String(value == null ? '' : value).trim().slice(0, MAX_FIELD_LENGTH);
  // Stop values being treated as spreadsheet formulas.
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function getSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
