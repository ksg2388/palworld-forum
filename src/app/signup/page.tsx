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
  const [passwordError, setPasswordError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);

  const validatePassword = (password: string) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (password.length < 8 || password.length > 16) {
      return "비밀번호는 8~16자리여야 합니다.";
    }
    if (!specialCharRegex.test(password)) {
      return "비밀번호는 최소 1개의 특수문자를 포함해야 합니다.";
    }
    return "";
  };

  const validateNickname = (nickname: string) => {
    if (nickname.length < 3 || nickname.length > 8) {
      return "닉네임은 3자 이상 8자 이하여야 합니다.";
    }
    return "";
  };

  const handleSendVerification = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (email) {
      setIsVerificationLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.SEND_VERIFICATION}`,
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
          alert(
            "인증번호가 발송되었습니다. 최대 30초 정도 소요될 수 있습니다."
          );
        } else {
          alert(data.message || "인증번호 발송에 실패했습니다.");
        }
      } catch (error) {
        console.error("인증번호 발송 실패:", error);
        alert("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsVerificationLoading(false);
      }
    }
  };

  const handleVerifyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (verificationCode) {
      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.VERIFY_CODE}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              verification_code: verificationCode,
            }),
          }
        );

        const data = await response.json();

        if (data.http_status === "ACCEPTED") {
          setIsEmailVerified(true);
          alert(data.message);
        } else {
          alert(data.message || "인증번호 확인에 실패했습니다.");
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

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      alert(passwordValidationError);
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const nicknameValidationError = validateNickname(nickname);
    if (nicknameValidationError) {
      alert(nicknameValidationError);
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
      } else {
        alert(data.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    setNicknameError(validateNickname(newNickname));
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
              className="flex-1 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              disabled={isEmailVerified}
            />
            <button
              onClick={handleSendVerification}
              disabled={isEmailVerified || isVerificationLoading}
              className="px-3 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors disabled:bg-gray-400"
            >
              {isVerificationLoading ? "발송중..." : "인증"}
            </button>
          </div>

          {showVerification && !isEmailVerified && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="인증번호 입력"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="flex-1 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <button
                onClick={handleVerifyCode}
                className="px-3 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
              >
                확인
              </button>
            </div>
          )}

          <div>
            <input
              type="password"
              placeholder="비밀번호 (8~16자리, 특수문자 포함)"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-500">{passwordError}</p>
            )}
          </div>
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
          <div>
            <input
              type="text"
              placeholder="닉네임 (3~8자)"
              value={nickname}
              onChange={handleNicknameChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {nicknameError && (
              <p className="mt-1 text-sm text-red-500">{nicknameError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors disabled:bg-gray-400"
            disabled={!isEmailVerified || !!passwordError || !!nicknameError}
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
