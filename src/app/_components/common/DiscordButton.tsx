"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";

type TLink = {
  link_type: string;
  url: string;
};

const DiscordButton = () => {
  const [discordLink, setDiscordLink] = useState<TLink | null>(null);

  useEffect(() => {
    const fetchDiscordLink = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/links`);
        const data = await response.json();

        if (data.http_status === "OK") {
          const discord = data.data.find(
            (link: TLink) => link.link_type === "DISCORD"
          );
          if (discord) {
            setDiscordLink(discord);
          }
        }
      } catch (error) {
        console.error("디스코드 링크를 불러오는데 실패했습니다:", error);
      }
    };

    fetchDiscordLink();
  }, []);

  if (!discordLink) return null;

  return (
    <Link
      href={discordLink.url}
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
