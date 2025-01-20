"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const handleSendVerification = (e: React.MouseEvent) => {
    e.preventDefault();
    if (email) {
      // 이메일 인증 코드 전송 로직
      setShowVerification(true);
    }
  };

  const handleVerifyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    if (verificationCode) {
      // 인증 코드 확인 로직
      setIsEmailVerified(true);
    }
  };

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
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              disabled={isEmailVerified}
            />
            <button
              onClick={handleSendVerification}
              disabled={isEmailVerified}
              className="px-4 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors disabled:bg-gray-400"
            >
              인증
            </button>
          </div>

          {showVerification && !isEmailVerified && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="인증번호 입력"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <button
                onClick={handleVerifyCode}
                className="px-4 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
              >
                확인
              </button>
            </div>
          )}

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
            className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors disabled:bg-gray-400"
            onClick={(e) => e.preventDefault()}
            disabled={!isEmailVerified}
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
