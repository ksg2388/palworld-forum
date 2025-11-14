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
        className={`w-full h-[80px] lg:h-[110px] fixed top-0 left-0 z-50 transition-shadow duration-300 ease-in-out shadow-sm bg-gray-800 text-white`}
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
            <Link href="/" className="flex flex-col items-center">
              <div className="w-[140px] h-[38px] relative">
                <Image src="/images/logo-palworld.webp" alt="logo" fill />
              </div>
              <span className="text-[10px] font-medium whitespace-nowrap">
                Palworld Korea Forum
              </span>
            </Link>
          </div>

          {/* 로고 - 모바일 */}
          <div className="lg:hidden absolute left-16">
            <Link href="/" className="flex flex-col items-center" onClick={closeMobileMenu}>
              <div className="w-[90px] h-[24px] relative">
                <Image src="/images/logo-palworld.webp" alt="logo" fill />
              </div>
              <span className="text-[8px] font-medium whitespace-nowrap">
                Palworld Korea Forum
              </span>
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
        className={`fixed top-0 left-0 h-full w-[280px] bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 사이드바 상단 헤더 (로고 + 닫기 버튼) */}
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <Link href="/" className="flex flex-col items-start" onClick={closeMobileMenu}>
              <div className="flex flex-col items-center">
                <div className="w-[100px] h-[28px] relative">
                  <Image src="/images/logo-palworld.webp" alt="logo" fill />
                </div>
                <span className="text-[8px] font-medium whitespace-nowrap mt-0.5 text-gray-400">
                  Palworld Korea Forum
                </span>
              </div>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="메뉴 닫기"
            >
              <svg
                className="w-5 h-5 text-gray-400 hover:text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 모바일 사용자 정보 */}
          {isLoggedIn && (
            <div className="px-5 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-300">
                    {user?.nickname?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-[15px] font-medium text-white">
                  {user?.nickname}님
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Link
                  href="/mypage"
                  className="text-[14px] text-gray-400 hover:text-white transition-colors py-1.5"
                  onClick={closeMobileMenu}
                >
                  마이페이지
                </Link>
                {user?.member_role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-[14px] text-gray-400 hover:text-white transition-colors py-1.5"
                    onClick={closeMobileMenu}
                  >
                    관리자
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="text-left text-[14px] text-gray-400 hover:text-white transition-colors py-1.5"
                >
                  로그아웃
                </button>
              </div>
            </div>
          )}

          {/* 모바일 네비게이션 메뉴 */}
          <nav className="flex flex-col flex-1 px-5 py-4 overflow-y-auto">
            <div className="space-y-1">
              <Link
                href="/"
                className="block py-3 text-[16px] font-medium text-white hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-800 px-3"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                href="/kofiqa"
                className="block py-3 text-[16px] font-medium text-white hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-800 px-3"
                onClick={closeMobileMenu}
              >
                포럼 서버
              </Link>
              <Link
                href="/community"
                className="block py-3 text-[16px] font-medium text-white hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-800 px-3"
                onClick={closeMobileMenu}
              >
                통합게시판
              </Link>
              <Link
                href="/support"
                className="block py-3 text-[16px] font-medium text-white hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-800 px-3"
                onClick={closeMobileMenu}
              >
                1:1문의/신고
              </Link>
              <Link
                href="/company"
                className="block py-3 text-[16px] font-medium text-white hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-800 px-3"
                onClick={closeMobileMenu}
              >
                제휴업체
              </Link>
            </div>
          </nav>

          {/* 사이드바 하단 인증 메뉴 */}
          {!isLoggedIn && (
            <div className="px-5 py-4 border-t border-gray-800">
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="text-[13px] text-gray-400 hover:text-white transition-colors"
                  onClick={closeMobileMenu}
                >
                  로그인
                </Link>
                <div className="w-[1px] h-3 bg-gray-700" />
                <Link
                  href="/signup"
                  className="text-[13px] text-gray-400 hover:text-white transition-colors"
                  onClick={closeMobileMenu}
                >
                  회원가입
                </Link>
                <div className="w-[1px] h-3 bg-gray-700" />
                <Link
                  href="/find"
                  className="text-[13px] text-gray-400 hover:text-white transition-colors"
                  onClick={closeMobileMenu}
                >
                  비밀번호 찾기
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
