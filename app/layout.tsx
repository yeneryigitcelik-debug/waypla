import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "waypla - Teknolojini Sigortala",
    template: `%s | waypla`,
  },
  description: "Elektronik cihaz sigortası platformu. Cihazını güvenceye al, anında teklif al.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "waypla",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-display antialiased bg-background-light dark:bg-background-dark text-[#111418] dark:text-white`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
