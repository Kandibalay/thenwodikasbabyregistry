"use client";

export default function LogoutButton() {
  async function logout() {
    await fetch("/api/admin-auth", { method: "DELETE" });
    window.location.href = "/";
  }
  return <button className="logout" onClick={logout}>Log out</button>;
}
