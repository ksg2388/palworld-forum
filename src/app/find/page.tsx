"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";
import { useRouter } from "next/navigation";

const FindPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSendVerification = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/send-verification-code-for-find-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.http_status === "CREATED") {
        setShowVerification(true);
        alert("인증번호가 발송되었습니다. 최대 30초 정도 소요될 수 있습니다.");
      } else {
        alert(data.message || "인증번호 발송에 실패했습니다.");
      }
    } catch (error) {
      console.error("인증번호 발송 실패:", error);
      alert("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          verification_code: verificationCode,
        }),
      });

      const data = await response.json();

      if (data.http_status === "ACCEPTED") {
        setIsEmailVerified(true);
        alert("이메일 인증이 완료되었습니다.");
      } else {
        alert(data.message || "인증번호 확인에 실패했습니다.");
      }
    } catch (error) {
      console.error("인증번호 확인 실패:", error);
      alert("인증번호 확인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const validatePassword = (password: string) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    return (
      password.length >= 8 &&
      password.length <= 16 &&
      specialCharRegex.test(password)
    );
  };

  // todo: 비밀번호 요청 api 엔드포인트 수정
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      alert(
        "비밀번호는 8~16자리이며, 특수문자를 최소 하나 이상 포함해야 합니다."
      );
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          new_password: password,
        }),
      });

      const data = await response.json();

      if (data.http_status === "OK") {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        router.push("/login");
      } else {
        alert(data.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[400px] bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/logo-palworld-black.png"
            width={125}
            height={34}
            alt="logo"
            className="mb-4 bg-white"
          />
          <h4 className="text-2xl font-bold text-gray-800 mb-2">
            비밀번호 찾기
          </h4>
          <p className="text-gray-600 text-sm">
            가입하신 이메일을 입력해주세요.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleResetPassword}>
          {!isEmailVerified ? (
            <>
              <div className="flex gap-2 min-w-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="가입시 등록한 이메일"
                  className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
                <button
                  onClick={handleSendVerification}
                  disabled={isLoading}
                  className="whitespace-nowrap px-4 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors disabled:bg-gray-400"
                >
                  {isLoading ? "발송중..." : "인증번호 발송"}
                </button>
              </div>

              {showVerification && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="인증번호 입력"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                  <button
                    onClick={handleVerifyCode}
                    className="whitespace-nowrap px-4 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
                  >
                    확인
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="새 비밀번호 (8~16자, 특수문자 포함)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="새 비밀번호 확인"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
              >
                비밀번호 변경
              </button>
            </>
          )}
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
