import "./globals.css";

export const metadata = {
  title: "Baby Registry",
  description: "Pick a gift for our little one.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
