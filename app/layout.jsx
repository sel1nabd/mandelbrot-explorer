import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata = {
  title: "Mandelbrot Set Explorer",
  description: "An elegant exploration of infinite complexity",
  openGraph: {
    title: "Mandelbrot Set Explorer",
    description: "An elegant exploration of infinite complexity",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mandelbrot Set Explorer",
    description: "An elegant exploration of infinite complexity"
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
