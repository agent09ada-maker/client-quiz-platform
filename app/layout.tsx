import "./globals.css";

export const metadata = {
  title: "Client Knowledge Quiz",
  description: "Internal client knowledge quiz platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
