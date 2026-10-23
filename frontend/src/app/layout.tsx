import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
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
      className={`${plusJakartaSans.variable} ${bebasNeue.variable}`}
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
