"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api";
import { API_ENDPOINTS } from "@/config/api";

const SignupPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const handleSendVerification = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SEND_VERIFICATION}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        
        if (data.http_status === "CREATED") {
          setShowVerification(true);
          alert(data.message);
        }
      } catch (error) {
        console.error("인증번호 발송 실패:", error);
        alert("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleVerifyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (verificationCode) {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.VERIFY_CODE}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            email,
            verification_code: verificationCode 
          }),
        });

        const data = await response.json();
        
        if (data.http_status === "ACCEPTED") {
          setIsEmailVerified(true);
          alert(data.message);
        }
      } catch (error) {
        console.error("인증번호 확인 실패:", error);
        alert("인증번호 확인에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          nickname,
        }),
      });

      const data = await response.json();

      if (data.http_status === "CREATED") {
        alert(data.message);
        router.push("/login");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
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

        <form className="space-y-4" onSubmit={handleSignup}>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />

          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors disabled:bg-gray-400"
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
