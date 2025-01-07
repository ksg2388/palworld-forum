"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const FindPage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[400px] bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/logo-palworld.webp"
            width={125}
            height={34}
            alt="logo"
            className="mb-4 bg-white"
          />
          <h4 className="text-2xl font-bold text-gray-800 mb-2">
            비밀번호 찾기
          </h4>
          <p className="text-gray-600 text-sm">
            가입하신 이메일로 임시 비밀번호를 발송해드립니다.
          </p>
        </div>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="가입시 등록한 이메일"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />

          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            비밀번호 찾기
          </button>
        </form>

        <div className="mt-4 text-center flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-800 hover:underline ml-3"
          >
            로그인
          </Link>
          <div className="w-[1px] h-3 bg-gray-300" />
          <Link
            href="/signup"
            className="text-sm text-gray-800 hover:underline"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FindPage;
