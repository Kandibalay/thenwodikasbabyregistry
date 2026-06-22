"use client";
import { useState } from "react";
import { items, tiers, naira, payment } from "./items";

export default function Home() {
  const [active, setActive] = useState(null);
  const [tier, setTier] = useState("full");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);
  const [copied, setCopied] = useState(false);
  const [farewell, setFarewell] = useState(null);

  function open(item) {
    setActive(item); setTier("full"); setName(""); setPhone(""); setErr(""); setDone(null);
  }
  function close() { setActive(null); }

  function finish() {
    const guestName = done?.name;
    setActive(null);
    if (guestName) {
      setFarewell(guestName);
      setTimeout(() => setFarewell(null), 4000);
    }
  }

  function copyAccount() {
    navigator.clipboard?.writeText(payment.accountNumber).then(
      () => { setCopied(true); setTimeout(() => setCopied(false), 1800); },
      () => {}
    );
  }

  async function submit() {
    setErr(""); setBusy(true);
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: active.id, tier, name, phone }),
      });
      const data = await res.json();
      if (!data.ok) { setErr(data.error || "Something went wrong."); }
      else { setDone(data.record); }
    } catch { setErr("Network error. Try again."); }
    finally { setBusy(false); }
  }

  const tierFraction = tiers.find((t) => t.key === tier)?.fraction ?? 1;

  return (
    <main>
      <header className="hero">
        <img src="/baby3.jpg" alt="" className="baby" />
        <p className="eyebrow">A gift registry</p>
        <h1>Welcome, Baby Nwodika.</h1>
        <p className="sub">
          Help us get ready for our little one. Pick a gift below and choose how much
          you'd love to contribute &mdash; all of it, three quarters, half, or a quarter.
        </p>
      </header>

      <section className="grid">
        {items.map((item) => (
          <article key={item.id} className="card">
            <div className="thumb"><img src={item.img} alt={item.name} /></div>
            <div className="body">
              <h3>{item.name}</h3>
              <p className="price">{naira(item.price)}</p>
              <button className="pick" onClick={() => open(item)}>Pick this gift</button>
            </div>
          </article>
        ))}
      </section>

      <footer className="foot">Made with love &middot; <a href="/admin">Roy & Zee Nwodika</a></footer>

      {active && (
        <div className="overlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {!done ? (
              <>
                <button className="x" onClick={close} aria-label="Close">&times;</button>
                <div className="mthumb"><img src={active.img} alt="" /></div>
                <h2>{active.name}</h2>
                <p className="mprice">{naira(active.price)}</p>

                <label className="lbl">How much would you like to give?</label>
                <div className="tiers">
                  {tiers.map((t) => (
                    <button
                      key={t.key}
                      className={"tier" + (tier === t.key ? " on" : "")}
                      onClick={() => setTier(t.key)}
                    >
                      <span>{t.label}</span>
                      <small>{naira(active.price * t.fraction)}</small>
                    </button>
                  ))}
                </div>

                <input className="field" placeholder="Your name"
                  value={name} onChange={(e) => setName(e.target.value)} />
                <input className="field" placeholder="Phone number" inputMode="tel"
                  value={phone} onChange={(e) => setPhone(e.target.value)} />

                {err && <p className="err">{err}</p>}

                <button className="confirm" disabled={busy} onClick={submit}>
                  {busy ? "Reserving\u2026" : "Reserve \u00b7 " + naira(active.price * tierFraction)}
                </button>
              </>
            ) : (
              <div className="thanks">
                <div className="check">&#10003;</div>
                <h2>Thank you, {done.name}!</h2>
                <p>You&apos;ve reserved <strong>{done.itemName}</strong> at the <strong>{done.tierLabel}</strong> amount.</p>

                <div className="pay">
                  <p className="payto">Please send <strong>{naira(done.amount)}</strong> to:</p>
                  <div className="payrow"><span>Bank</span><strong>{payment.bank}</strong></div>
                  <div className="payrow">
                    <span>Account number</span>
                    <strong className="acct">{payment.accountNumber}
                      <button className="copy" onClick={copyAccount}>{copied ? "Copied" : "Copy"}</button>
                    </strong>
                  </div>
                  <div className="payrow"><span>Account name</span><strong>{payment.accountName}</strong></div>
                </div>

                <p className="paynote">After your transfer, the parents will confirm and reach out. Thank you for your kindness!</p>
                <button className="confirm" onClick={finish}>Back to registry</button>
              </div>
            )}
          </div>
        </div>
      )}

      {farewell && (
        <div className="overlay farewell-overlay">
          <div className="farewell" role="status">
            <div className="hearts">&#128150;</div>
            <h2>Thank you, {farewell}</h2>
            <p>for being a part of our journey.</p>
          </div>
        </div>
      )}
    </main>
  );
}
