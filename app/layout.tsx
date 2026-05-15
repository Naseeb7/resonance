import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Resonance",
    template: "%s | Resonance",
  },
  description:
    "A calm daily speech therapy experience focused on articulation confidence, guided practice, and emotionally supportive progression.",
  applicationName: "Resonance",
  keywords: [
    "speech therapy",
    "articulation practice",
    "daily speech practice",
    "supportive speech training",
    "mobile speech therapy",
  ],
  metadataBase: new URL("https://resonance.app"),
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Resonance",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    siteName: "Resonance",
    title: "Resonance",
    description:
      "A calm daily speech therapy experience focused on articulation confidence and emotionally supportive progression.",
    url: "/",
    images: [
      {
        url: "/icons/icon-512.svg",
        width: 512,
        height: 512,
        alt: "Resonance app icon",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Resonance",
    description:
      "A calm daily speech therapy experience focused on articulation confidence and supportive progression.",
    images: ["/icons/icon-512.svg"],
  },
  other: {
    "color-scheme": "light",
    "supported-color-schemes": "light",
  },
};

export const viewport: Viewport = {
  themeColor: "#eef3f3",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-app-base text-slate-700">{children}</body>
    </html>
  );
}
