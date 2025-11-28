"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";

type TLink = {
  link_type: string;
  url: string;
};

const KakaoChatButton = () => {
  const [kakaoLink, setKakaoLink] = useState<TLink | null>(null);

  useEffect(() => {
    const fetchKakaoLink = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/links`);
        const data = await response.json();

        if (data.http_status === "OK") {
          const kakao = data.data.find(
            (link: TLink) => link.link_type === "OPEN_CHATTING_LINK"
          );
          if (kakao) {
            setKakaoLink(kakao);
          }
        }
      } catch (error) {
        console.error("카카오톡 링크를 불러오는데 실패했습니다:", error);
      }
    };

    fetchKakaoLink();
  }, []);

  if (!kakaoLink) return null;

  return (
    <Link
      href={kakaoLink.url}
      target="_blank"
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-10 h-10 md:w-14 md:h-14 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg hover:bg-yellow-500 transition-all duration-200 z-40 hover:scale-105 active:scale-95"
    >
      <div className="relative w-6 h-6 md:w-8 md:h-8">
        <Image
          src="/images/ic-kakao-talk.png"
          alt="카카오톡 채팅 문의"
          fill
          className="object-contain"
        />
      </div>
    </Link>
  );
};

export default KakaoChatButton;
