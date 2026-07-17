import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoveGift - Presentes que Emocionam",
  description: "Crie páginas web interativas e personalizadas para seus presentes. Perfeito para casais, aniversários e momentos especiais.",
  keywords: ["presente", "nfc", "casal", "aniversário", "namoro", "amor", "página web"],
  openGraph: {
    title: "LoveGift - Presentes que Emocionam",
    description: "Crie páginas web interativas e personalizadas para seus presentes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
