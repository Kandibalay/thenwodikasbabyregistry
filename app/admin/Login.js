"use client";
import { useState } from "react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setErr(""); setBusy(true);
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { window.location.reload(); }
      else { const d = await res.json().catch(() => ({})); setErr(d.error || "Wrong password."); }
    } catch { setErr("Something went wrong. Try again."); }
    finally { setBusy(false); }
  }

  return (
    <main className="login">
      <div className="loginbox">
        <div className="lock">&#128274;</div>
        <h1>Registry owner</h1>
        <p>Enter your password to view reservations.</p>
        <input
          className="field" type="password" placeholder="Password" autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        {err && <p className="err">{err}</p>}
        <button className="confirm" disabled={busy} onClick={submit}>
          {busy ? "Checking\u2026" : "Sign in"}
        </button>
        <p className="back"><a href="/">&larr; Back to registry</a></p>
      </div>
    </main>
  );
}
