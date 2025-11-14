"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useUserStore from "@/app/_store/userSotre";

const Header = () => {
  const { user, isLoggedIn, logout } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`w-full h-[110px] fixed top-0 left-0 z-50 transition-shadow duration-300 ease-in-out shadow-sm bg-gray-800 text-white`}
      >
        <div className="max-w-[1200px] h-full mx-auto px-4 flex items-center relative">
          {/* 모바일 햄버거 메뉴 버튼 */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="메뉴 열기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* 로고 - 데스크톱 */}
          <div className="hidden lg:block absolute left-4">
            <Link href="/" className="w-[119px] h-[32px] relative">
              <span className="absolute -bottom-6 left-5 text-[10px] font-medium whitespace-nowrap">
                Palworld Korea Forum
              </span>
              <div className="w-[140px] h-[38px] absolute -top-7 left-0">
                <Image src="/images/logo-palworld.webp" alt="logo" fill />
              </div>
            </Link>
          </div>

          {/* 로고 - 모바일 */}
          <div className="lg:hidden absolute left-16">
            <Link href="/" className="w-[119px] h-[32px] relative" onClick={closeMobileMenu}>
              <span className="absolute -bottom-6 left-5 text-[10px] font-medium whitespace-nowrap">
                Palworld Korea Forum
              </span>
              <div className="w-[140px] h-[38px] absolute -top-7 left-0">
                <Image src="/images/logo-palworld.webp" alt="logo" fill />
              </div>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex items-center gap-12 text-[19px] font-medium w-full justify-center">
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
              포럼 서버
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

          {/* 데스크톱 사용자 메뉴 */}
          <div className="hidden lg:flex items-center gap-4 justify-end mt-4 absolute right-4 top-0">
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <span className="text-[14px] font-medium text-gray-300">
                    {user?.nickname}님
                  </span>
                  <div className="w-[1px] h-3 bg-gray-600" />
                  <Link
                    href="/mypage"
                    className="text-[14px] font-medium text-gray-300 hover:text-white"
                  >
                    마이페이지
                  </Link>
                  <div className="w-[1px] h-3 bg-gray-600" />
                  <button
                    onClick={logout}
                    className="text-[14px] font-medium text-gray-300 hover:text-white"
                  >
                    로그아웃
                  </button>
                  {user?.member_role === "ADMIN" && (
                    <>
                      <div className="w-[1px] h-3 bg-gray-600" />
                      <Link
                        href="/admin"
                        className="text-[14px] font-medium text-gray-300 hover:text-white"
                      >
                        관리자
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* 모바일 메뉴 */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-[110px]">
          {/* 모바일 사용자 정보 */}
          <div className="px-6 py-4 border-b border-gray-700">
            {isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <span className="text-[16px] font-medium text-gray-300">
                  {user?.nickname}님
                </span>
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    href="/mypage"
                    className="text-[14px] font-medium text-gray-300 hover:text-white"
                    onClick={closeMobileMenu}
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="text-left text-[14px] font-medium text-gray-300 hover:text-white"
                  >
                    로그아웃
                  </button>
                  {user?.member_role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="text-[14px] font-medium text-gray-300 hover:text-white"
                      onClick={closeMobileMenu}
                    >
                      관리자
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="text-[14px] font-medium text-gray-300 hover:text-white"
                  onClick={closeMobileMenu}
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="text-[14px] font-medium text-gray-300 hover:text-white"
                  onClick={closeMobileMenu}
                >
                  회원가입
                </Link>
                <Link
                  href="/find"
                  className="text-[14px] font-medium text-gray-300 hover:text-white"
                  onClick={closeMobileMenu}
                >
                  비밀번호 찾기
                </Link>
              </div>
            )}
          </div>

          {/* 모바일 네비게이션 메뉴 */}
          <nav className="flex flex-col flex-1 px-6 py-4">
            <Link
              href="/"
              className="py-4 text-[18px] font-medium text-white hover:text-gray-300 transition-colors border-b border-gray-700"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/kofiqa"
              className="py-4 text-[18px] font-medium text-white hover:text-gray-300 transition-colors border-b border-gray-700"
              onClick={closeMobileMenu}
            >
              포럼 서버
            </Link>
            <Link
              href="/community"
              className="py-4 text-[18px] font-medium text-white hover:text-gray-300 transition-colors border-b border-gray-700"
              onClick={closeMobileMenu}
            >
              통합게시판
            </Link>
            <Link
              href="/support"
              className="py-4 text-[18px] font-medium text-white hover:text-gray-300 transition-colors border-b border-gray-700"
              onClick={closeMobileMenu}
            >
              1:1문의/신고
            </Link>
            <Link
              href="/company"
              className="py-4 text-[18px] font-medium text-white hover:text-gray-300 transition-colors border-b border-gray-700"
              onClick={closeMobileMenu}
            >
              제휴업체
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
