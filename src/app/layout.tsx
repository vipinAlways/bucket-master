import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provider from "@/components/Provider";
import { Toaster } from "@/components/ui/toaster";
import MobileNavigation from "@/components/MobileNav";
import BucketLabel from "@/components/BucketLabel";



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen bg-bggreen`}
      >
        <Provider>
          <main className="py-2 w-full pr-2 pl-1 max-sm:px-2">
          <MobileNavigation className=""/>
            <BucketLabel/>
            {children}
            </main>
          <Toaster/>
        </Provider>
      </body>
    </html>
  );
}
