import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Cormorant_Garamond,
  Noto_Serif_Devanagari,
} from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",   // was --font-display
  display: "swap",
});

// For the HN (Hindi) toggle: Cormorant has no Devanagari glyphs
const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["500", "600", "700"],
  variable: "--font-display-hi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JNR",
  description:
    "From our location at the flower auction, we ensure every flower and plant reaches our customers in top condition.",
  icons: {
    icon: [
      { url: "/assets/jnr_flower_icon.png?v=3", type: "image/png" },
      { url: "/icon.svg?v=3", type: "image/svg+xml" },
    ],
    shortcut: "/assets/jnr_flower_icon.png?v=3",
    apple: "/assets/jnr_flower_icon.png?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${cormorant.variable} ${notoSerifDevanagari.variable}`}
    >
      <head>
        <link
          rel="icon"
          href="/assets/jnr_flower_icon.png?v=3"
          type="image/png"
          sizes="any"
        />
        <link rel="shortcut icon" href="/assets/jnr_flower_icon.png?v=3" />
        <link rel="apple-touch-icon" href="/assets/jnr_flower_icon.png?v=3" />
      </head>
      <body>{children}</body>
    </html>
  );
}