/**
 * Baby Registry — Google Sheets backend
 * Paste this into Extensions ▸ Apps Script in your Google Sheet,
 * then Deploy ▸ New deployment ▸ Web app.
 *
 * IMPORTANT: set SECRET below to a private string, and use the SAME
 * value for SHEETS_SECRET in your app's environment variables.
 */

const SECRET = "change-this-to-a-private-string";
const SHEET_NAME = "Reservations";
const HEADERS = ["Date", "Name", "Phone", "Item", "Contribution", "Amount (NGN)", "id"];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

// Add a reservation (called by the website).
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    if (body.secret !== SECRET) return json_({ ok: false, error: "Unauthorized" });

    const r = body.record || {};
    const sh = sheet_();
    sh.appendRow([
      new Date(r.at || Date.now()),
      r.name || "",
      "'" + (r.phone || ""), // leading quote keeps long numbers as text
      r.itemName || "",
      r.tierLabel || "",
      r.amount || 0,
      r.id || "",
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// List reservations (called by your private /admin dashboard).
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.secret !== SECRET) return json_({ ok: false, error: "Unauthorized" });
  if (p.action !== "list") return json_({ ok: true });

  const sh = sheet_();
  const rows = sh.getDataRange().getValues();
  rows.shift(); // drop header
  const claims = rows.filter(function (row) { return row[1]; }).map(function (row) {
    return {
      at: row[0],
      name: row[1],
      phone: String(row[2]).replace(/^'/, ""),
      itemName: row[3],
      tierLabel: row[4],
      amount: Number(row[5]) || 0,
      id: row[6],
    };
  });
  return json_(claims);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
