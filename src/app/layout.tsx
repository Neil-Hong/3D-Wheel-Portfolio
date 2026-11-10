import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

// Self-hosted at build time by next/font; exposed as --font-inter for CSS.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const defaultTitle = `${siteName} - Web3 & Full-stack Developer`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: defaultTitle,
    description: siteDescription,
    siteName,
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The inline script adds a `js` class before first paint so CSS can keep
    // GSAP-animated elements hidden until their entrance runs (no flash of
    // content that then disappears). suppressHydrationWarning covers that
    // class, which React did not render.
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
