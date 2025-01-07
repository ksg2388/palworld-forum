"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const KakaoChatButton = () => {
  return (
    <Link
      href="https://open.kakao.com/o/gbPp3g9g"
      target="_blank"
      className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg hover:bg-yellow-500 transition-colors duration-200 z-50"
    >
      <div className="relative w-8 h-8">
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
