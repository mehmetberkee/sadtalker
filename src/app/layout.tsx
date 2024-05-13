import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./options/authOptions";
import "./globals.css";
import Head from "next/head";
import { title } from "./options/text";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: title,
  description: "raygun",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="android-chrome-192x192"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="android-chrome-512x512"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />
        <title>RAYGUN</title>
      </Head>
      <body className={`bg-[#171a21] ${inter.className} w-full h-screen`}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
