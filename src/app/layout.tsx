import type { Metadata, Viewport } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import ThemeProvider from "@/components/ThemeProvider";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CorgiGo - Food Delivery App",
  description: "ระบบสั่งอาหาร รวดเร็ว ปลอดภัย",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
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
              <NavigationProvider>
                <NotificationProvider>
            {children}
                </NotificationProvider>
              </NavigationProvider>
            </SnackbarProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
