"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showShadow = scrollPosition > 0;

  return (
    <header
      className={`w-full min-w-[1000px] h-[110px] bg-white fixed top-0 left-0 z-50 transition-shadow duration-300 ease-in-out ${
        showShadow ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-[1200px] h-full mx-auto px-4 flex items-center relative">
        <div className="flex items-center gap-4 justify-end mt-4 absolute right-4 top-0">
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-[14px] font-medium text-gray-700 hover:text-gray-900"
            >
              로그인
            </Link>
            <div className="w-[1px] h-3 bg-gray-300" />
            <Link
              href="/signup"
              className="text-[14px] font-medium text-gray-700 hover:text-gray-900"
            >
              회원가입
            </Link>
            <div className="w-[1px] h-3 bg-gray-300" />
            <Link
              href="/find"
              className="text-[14px] font-medium text-gray-700 hover:text-gray-900"
            >
              ID/PW 찾기
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/" className="bg-red-400 w-[90px] h-[44px] relative">
            <span className="absolute -bottom-6 left-0 text-[10px] font-medium whitespace-nowrap">
              Plaworld Korea Official Forum (Quality Assurance)
            </span>
            로고
          </Link>
          <div className="text-[19px] font-semibold mr-8">팰월드 한국포럼</div>
          <nav className="flex items-center gap-12 text-[19px] font-medium">
            <Link href="/" className="hover:text-gray-600">
              Home
            </Link>
            <Link href="/kofgm" className="hover:text-gray-600">
              KOFIQA 서버
            </Link>
            <Link href="/notice" className="hover:text-gray-600">
              통합게시판
            </Link>
            <Link href="/customer" className="hover:text-gray-600">
              1:1문의/신고
            </Link>
            <Link href="/community" className="hover:text-gray-600">
              제휴업체
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
