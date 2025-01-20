import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full min-w-[1000px] bg-gray-800 text-white">
      <div className="max-w-[1200px] mx-auto px-4 h-full flex flex-col justify-between py-8">
        <div className="flex items-start gap-12">
          <div className="flex-shrink-0">
            <Link href="/" className="w-[119px] h-[32px] relative">
              <div className="w-[140px] h-[38px] relative">
                <Image
                  src="/images/logo-palworld.webp"
                  alt="logo"
                  fill
                  className="brightness-0 invert"
                />
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-8 flex-1">
            <div className="flex flex-col gap-2">
              <p className="text-gray-400 text-sm max-w-[600px]">
                {`팔월드 공식 커뮤니티 | 팔월드 유저들을 위한 공식 커뮤니티 사이트입니다. 게임 정보와 유저들간의 소통을 위한 공간을 제공합니다. 관계자 | 운영진: 팔월드 코리아 | 개발: 웹 개발팀 | 디자인: UI/UX팀\n\n`}
              </p>
              <p className="text-gray-400 text-sm max-w-[600px]">
                © 2024 Palworld Community. All rights reserved.
              </p>
            </div>
          </div>

          <div className="flex gap-4 flex-shrink-0">
            {[1, 2].map((num) => (
              <div key={num} className="w-[190px] h-[50px] relative">
                <Image
                  src={`/images/test-image.png`}
                  alt={`footer image ${num}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
