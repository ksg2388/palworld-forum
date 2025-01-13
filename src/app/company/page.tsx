"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const partners = [
  {
    id: 1,
    name: "넥슨",
    logo: "/images/partners/logo-nexon.svg",
    url: "https://www.nexon.com",
  },
  {
    id: 2,
    name: "NC소프트",
    logo: "/images/partners/logo-nc.svg",
    url: "https://www.ncsoft.com",
  },
  {
    id: 3,
    name: "넷마블",
    logo: "/images/partners/logo-netmarble.svg",
    url: "https://www.netmarble.com",
  },
  {
    id: 4,
    name: "카카오게임즈",
    logo: "/images/partners/logo-kakaogames.jpg",
    url: "https://www.kakaogames.com",
  },
  {
    id: 5,
    name: "스마일게이트",
    logo: "/images/partners/logo-smilegate.png",
    url: "https://www.smilegate.com",
  },
  {
    id: 6,
    name: "펄어비스",
    logo: "/images/partners/logo-pearlabyss.jpg",
    url: "https://www.pearlabyss.com",
  },
  {
    id: 7,
    name: "컴투스",
    logo: "/images/partners/logo-com2us.png",
    url: "https://www.com2us.com",
  },
  {
    id: 8,
    name: "네오위즈",
    logo: "/images/partners/logo-neowiz.svg",
    url: "https://www.neowiz.com",
  },
  {
    id: 9,
    name: "웹젠",
    logo: "/images/partners/logo-webzen.jpg",
    url: "https://www.webzen.com",
  },
  {
    id: 10,
    name: "위메이드",
    logo: "/images/partners/logo-wemade.jpg",
    url: "https://www.wemade.com",
  },
];

const CompanyPage = () => {
  return (
    <div className="mt-[110px] w-full">
      <div className="max-w-[1200px] mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 mt-1">제휴 파트너사</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner) => (
            <Link
              href={partner.url}
              key={partner.id}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-video relative mb-4">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} 로고`}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-xl font-semibold text-center">
                {partner.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
