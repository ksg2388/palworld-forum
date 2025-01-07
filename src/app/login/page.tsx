"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[400px] bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/images/logo-palworld.webp"
            width={125}
            height={34}
            alt="logo"
            className="mb-2 bg-white"
          />
          <h4 className="text-2xl font-bold text-gray-800">로그인</h4>
        </div>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />

          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            로그인
          </button>
        </form>

        <div className="mt-4 text-center flex items-center justify-center gap-3">
          <Link href="/find" className="text-sm text-gray-800 hover:underline">
            비밀번호 찾기
          </Link>
          <div className="w-[1px] h-3 bg-gray-300" />
          <Link
            href="/signup"
            className="text-sm text-gray-800 hover:underline mr-6"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
