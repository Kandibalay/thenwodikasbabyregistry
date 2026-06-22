// Storage backed by a Google Sheet via a Google Apps Script web app.
// Set SHEETS_WEBHOOK_URL in your environment (.env.local locally,
// or Vercel project settings when deployed).

const URL = process.env.SHEETS_WEBHOOK_URL;
const SECRET = process.env.SHEETS_SECRET || "";

export async function addClaim(claim) {
  const record = { id: Date.now(), at: new Date().toISOString(), ...claim };

  if (!URL) {
    throw new Error("SHEETS_WEBHOOK_URL is not set.");
  }

  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: SECRET, action: "add", record }),
    // Apps Script redirects (302) to its content; follow it.
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error("Sheet write failed (" + res.status + ").");
  }
  // Apps Script returns JSON {ok:true}. If parsing fails, still treat 200 as success.
  try {
    const data = await res.json();
    if (data && data.ok === false) throw new Error(data.error || "Sheet rejected the write.");
  } catch (_) { /* non-JSON 200 is fine */ }

  return record;
}

// Read all claims back from the sheet (used by the admin dashboard).
export async function getClaims() {
  if (!URL) return [];
  try {
    const res = await fetch(URL + (URL.includes("?") ? "&" : "?") +
      "action=list&secret=" + encodeURIComponent(SECRET), { redirect: "follow" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.claims || []);
  } catch (_) {
    return [];
  }
}
