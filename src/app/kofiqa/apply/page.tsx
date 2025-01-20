"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CustomAlert from "@/app/_components/common/CustomAlert";

const ApplyPage = () => {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleAgree = () => {
    if (agreed) {
      setShowAlert(true);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    router.push("/");
  };

  return (
    <div className="mt-[110px] max-w-[1200px] mx-auto p-8">
      <CustomAlert
        isOpen={showAlert}
        message="서버 입주 신청이 완료되었습니다."
        onClose={handleAlertClose}
      />
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-6">서버 이용 약관</h1>

        <div className="space-y-6 text-gray-700">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. 입주 규칙</h2>
            <p>
              1-1. 서버 이용자는 서버 규칙을 반드시 숙지하고 서버를 이용해야
              합니다.
            </p>
            <p>1-2. 모든 유저에게 공정한 게임 환경을 제공하고자 합니다.</p>
            <p>
              1-3. 다른 유저를 존중하고 예의바른 태도로 게임을 즐겨주시기
              바랍니다.
            </p>
            <p>1-4. 서버 내 채팅에서는 욕설이나 비하발언이 금지됩니다.</p>
            <p>1-5. 버그 악용이나 서버 해킹 시도는 엄격히 금지됩니다.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. 플레이어 규칙</h2>
            <p>
              2-1. 타 플레이어의 건축물이나 시설을 무단으로 파괴하는 행위는
              금지됩니다.
            </p>
            <p>2-2. 서버 내 거래는 지정된 거래소에서만 이루어져야 합니다.</p>
            <p>2-3. 게임 내 버그를 발견 시 즉시 관리자에게 보고해야 합니다.</p>
          </section>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="agree">위 약관에 동의합니다.</label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAgree}
              className={`px-4 py-2 rounded ${
                agreed
                  ? "bg-gray-800 text-white hover:bg-gray-900"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              입주 신청하기
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
