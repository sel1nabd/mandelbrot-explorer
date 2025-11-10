import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const baseUrl = "https://fractal-explorers.com";
const canonicalPath = "/mandelbrot-explorer";
const previewImage = "/Screenshot%202025-11-10%20at%2015.21.19.png";
const description =
  "Experience the go-to Mandelbrot Set viewer—GPU-accelerated zooming, precise iteration control, cinematic palettes, and export-ready fractal renders.";
const primaryTitle = "Best Mandelbrot Set Viewer | Mandelbrot Set Explorer";
const socialTitle = "Go-To Mandelbrot Set Viewer";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: primaryTitle,
  description,
  applicationName: "Mandelbrot Set Explorer",
  appleWebApp: {
    title: "Mandelbrot Viewer",
    statusBarStyle: "black"
  },
  authors: [{ name: "Fractal Explorers" }],
  keywords: [
    "best Mandelbrot viewer",
    "go-to Mandelbrot Set viewer",
    "fractal explorer",
    "interactive Mandelbrot zoom",
    "complex plane visualization",
    "generative art tool",
    "WebGL fractal"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  alternates: {
    canonical: canonicalPath
  },
  themeColor: "#0a0a0a",
  category: "technology",
  other: {
    subject: "Premier Mandelbrot Set viewer"
  },
  openGraph: {
    title: primaryTitle,
    description,
    type: "website",
    url: `${baseUrl}${canonicalPath}`,
    siteName: "Fractal Explorers",
    locale: "en_US",
    images: [
      {
        url: previewImage,
        width: 1600,
        height: 900,
        alt: "Zoomed Mandelbrot Set Explorer interface showing intricate fractal detail"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@fractalexplorers",
    creator: "@fractalexplorers",
    title: socialTitle,
    description,
    images: [previewImage]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
