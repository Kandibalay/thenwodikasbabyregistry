import { NextResponse } from "next/server";
import { getClaims, addClaim } from "@/app/lib/store";
import { items, tiers } from "@/app/items";
import { isAuthed } from "@/app/lib/auth";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const claims = await getClaims();
  return NextResponse.json(claims);
}

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return bad("Invalid request."); }

  const { itemId, tier, name, phone } = body || {};
  const item = items.find((i) => i.id === Number(itemId));
  const t = tiers.find((x) => x.key === tier);

  if (!item) return bad("Pick a valid item.");
  if (!t) return bad("Pick a contribution amount.");
  if (!name || !name.trim()) return bad("Your name is required.");
  if (!phone || !/[0-9]{7,}/.test(phone.replace(/\D/g, "")))
    return bad("Enter a valid phone number.");

  const record = await addClaim({
    itemId: item.id,
    itemName: item.name,
    itemPrice: item.price,
    tier: t.key,
    tierLabel: t.label,
    amount: Math.round(item.price * t.fraction),
    name: name.trim(),
    phone: phone.trim(),
  });

  return NextResponse.json({ ok: true, record });
}

function bad(error) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}
