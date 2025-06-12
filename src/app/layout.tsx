import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CorgiGo - Food Delivery App",
  description: "ระบบสั่งอาหาร รวดเร็ว ปลอดภัย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={prompt.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
