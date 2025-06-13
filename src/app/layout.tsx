import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import ThemeProvider from "@/components/ThemeProvider";
import { SnackbarProvider } from "@/contexts/SnackbarContext";

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
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body className={prompt.className}>
        <ThemeProvider>
          <SessionProvider>
            <SnackbarProvider>
            {children}
            </SnackbarProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
