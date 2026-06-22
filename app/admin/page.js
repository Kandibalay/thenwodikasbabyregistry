import { getClaims } from "@/app/lib/store";
import { naira } from "@/app/items";
import { isAuthed } from "@/app/lib/auth";
import Login from "./Login";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function Admin() {
  if (!(await isAuthed())) {
    return <Login />;
  }

  const claims = await getClaims();
  const total = claims.reduce((s, c) => s + (c.amount || 0), 0);

  return (
    <main className="admin">
      <header className="ahead">
        <div>
          <h1>Who picked what</h1>
          <p>{claims.length} reservation{claims.length === 1 ? "" : "s"} &middot; {naira(total)} pledged</p>
        </div>
        <div className="aactions">
          <a className="dl" href="/api/claims/csv">Download CSV</a>
          <LogoutButton />
        </div>
      </header>

      {claims.length === 0 ? (
        <p className="empty">No reservations yet. Share your registry link to get started.</p>
      ) : (
        <div className="tablewrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Name</th><th>Phone</th><th>Item</th><th>Contribution</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {claims.slice().reverse().map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.at).toLocaleString("en-NG")}</td>
                  <td>{c.name}</td>
                  <td><a href={"tel:" + c.phone}>{c.phone}</a></td>
                  <td>{c.itemName}</td>
                  <td><span className="pill">{c.tierLabel}</span></td>
                  <td className="amt">{naira(c.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="back"><a href="/">&larr; Back to registry</a></p>
    </main>
  );
}
