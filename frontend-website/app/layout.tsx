import type { Metadata } from "next";
import { Unbounded, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import ChatWidget from "@/components/ChatWidget";
import { Toaster } from "sonner";

const evolventa = localFont({
  src: [
    {
      path: "../public/fonts/Evolventa-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Evolventa-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-evolventa",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

import Preloader from "@/components/Preloader";

export const metadata: Metadata = {
  title: "HESSA | Premium Textile Agency",
  description: "International Export Consulting Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${evolventa.variable} ${unbounded.variable} ${spaceGrotesk.variable} font-sans antialiased text-text-main`}
      >
        <Preloader />
        <SmoothScroll>
          <CustomCursor />
          <ConditionalNavbar />
          {children}
          <ChatWidget />
          <Toaster position="bottom-right" richColors expand={true} />
        </SmoothScroll>
      </body>
    </html>
  );
}
