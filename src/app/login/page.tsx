"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TUser } from "../types/common/common.types";
import { API_ENDPOINTS } from "@/config/api";
import { API_BASE_URL } from "@/config/api"; 
import useUserStore from "../_store/userSotre";

interface LoginResponse {
  http_status: string;
  message: string;
  data: {
    email: string;
    nickname: string; 
    member_role: string;
    token: {
      refresh_token: string;
      access_token: string;
    }
  }
}

const LoginPage = () => {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "로그인에 실패했습니다.");
      }

      // Zustand store에 유저 정보와 토큰 저장
      const user: TUser = {
        email: data.data.email,
        nickname: data.data.nickname,
        member_role: data.data.member_role
      };
      login(user, data.data.token.access_token, data.data.token.refresh_token);

      // 홈페이지로 리다이렉트
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
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
          <h4 className="text-2xl font-bold text-gray-800">로그인</h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />

          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
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
