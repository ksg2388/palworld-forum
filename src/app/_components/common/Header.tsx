"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header
      className={`w-full min-w-[1000px] h-[110px] fixed top-0 left-0 z-50 transition-shadow duration-300 ease-in-out shadow-sm bg-gray-800 text-white `}
    >
      <div className="max-w-[1200px] h-full mx-auto px-4 flex items-center relative">
        <div className="flex items-center gap-4 justify-end mt-4 absolute right-4 top-0">
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-[14px] font-medium text-gray-300 hover:text-white"
            >
              로그인
            </Link>
            <div className="w-[1px] h-3 bg-gray-600" />
            <Link
              href="/signup"
              className="text-[14px] font-medium text-gray-300 hover:text-white"
            >
              회원가입
            </Link>
            <div className="w-[1px] h-3 bg-gray-600" />
            <Link
              href="/find"
              className="text-[14px] font-medium text-gray-300 hover:text-white"
            >
              비밀번호 찾기
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/" className="w-[119px] h-[32px] relative">
            <span className="absolute -bottom-6 left-0 text-[10px] font-medium whitespace-nowrap">
              Plaworld Korea Official Forum (Quality Assurance)
            </span>
            <div className="w-[125px] h-[34px] absolute -top-1 left-0">
              <Image src="/images/logo-palworld.webp" alt="logo" fill />
            </div>
          </Link>
          <div className="text-[19px] font-semibold mr-8">팰월드 한국포럼</div>
          <nav className="flex items-center gap-12 text-[19px] font-medium">
            <Link
              href="/"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/kofiqa"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              KOFIQA 서버
            </Link>
            <Link
              href="/community"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              통합게시판
            </Link>
            <Link
              href="/support"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              1:1문의/신고
            </Link>
            <Link
              href="/company"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              제휴업체
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
