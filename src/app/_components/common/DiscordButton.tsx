"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const DiscordButton = () => {
  return (
    <Link
      href="https://discord.gg/yourDiscordLink"
      target="_blank"
      className="fixed bottom-24 right-8 w-14 h-14 rounded-full bg-[#5865F2] flex items-center justify-center shadow-lg hover:bg-[#4752C4] transition-colors duration-200 z-50"
    >
      <div className="relative w-8 h-8">
        <Image
          src="/images/ic-discord.png"
          alt="디스코드 채널 접속"
          fill
          className="object-contain"
        />
      </div>
    </Link>
  );
};

export default DiscordButton;
