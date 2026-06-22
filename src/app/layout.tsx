import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neil Hong  - Web3 & Full-stack Developer",
  description:
    "A portfolio for Web3, full-stack development, creative coding, 3D interfaces and interactive digital work.",
  openGraph: {
    title: "Neil Hong - Web3 & Full-stack Developer",
    description:
      "A portfolio for Web3, full-stack development, creative coding, 3D interfaces and interactive digital work.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
