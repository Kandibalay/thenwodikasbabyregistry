import { getClaims } from "@/app/lib/store";
import { naira } from "@/app/items";
import { isAuthed } from "@/app/lib/auth";

export async function GET() {
  if (!(await isAuthed())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const claims = await getClaims();
  const head = ["Date", "Name", "Phone", "Item", "Contribution", "Amount (NGN)"];
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = claims.map((c) =>
    [new Date(c.at).toLocaleString("en-NG"), c.name, c.phone, c.itemName, c.tierLabel, c.amount]
      .map(esc).join(",")
  );
  const csv = [head.map(esc).join(","), ...rows].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="baby-registry-claims.csv"',
    },
  });
}
