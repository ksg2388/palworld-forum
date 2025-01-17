import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./_components/common/Header";
import KakaoChatButton from "./_components/common/KakaoChatButton";
import DiscordButton from "./_components/common/DiscordButton";
import Footer from "./_components/common/Footer";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
});

export const metadata: Metadata = {
  title: "팰월드 공식포럼",
  description: "팰월드 한국 공식 포럼입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pretendard.className} antialiased xl:overflow-x-auto overflow-y-scroll`}
      >
        <Header />
        {children}
        <DiscordButton />
        <KakaoChatButton />
        <Footer />
      </body>
    </html>
  );
}
