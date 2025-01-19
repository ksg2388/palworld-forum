"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const SignupPage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[400px] bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/images/logo-palworld-black.png"
            width={125}
            height={34}
            alt="logo"
            className="mb-2 bg-white"
          />
          <h4 className="text-2xl font-bold text-gray-800">회원가입</h4>
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
          <input
            type="password"
            placeholder="비밀번호 확인"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
          <input
            type="text"
            placeholder="닉네임"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />

          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            회원가입
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-gray-800 hover:underline">
            이미 계정이 있으신가요? 로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
