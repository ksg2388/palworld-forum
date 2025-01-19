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
            <h2 className="text-xl font-semibold">제 1조 (목적)</h2>
            <p>
              {`본 약관은 KOFIQA 서버(이하 "서버")의 이용과 관련하여 서버와
              이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.`}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">제 2조 (약관의 효력)</h2>
            <p>1. 본 약관은 서버 입주를 신청한 시점부터 효력이 발생합니다.</p>
            <p>
              2. 서버는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서버
              내 공지사항을 통해 고지합니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">제 3조 (이용자의 의무)</h2>
            <p>1. 이용자는 서버 규칙을 준수해야 합니다.</p>
            <p>2. 이용자는 다른 이용자의 게임 진행을 방해해서는 안 됩니다.</p>
            <p>3. 이용자는 서버 내 질서를 해치는 행위를 해서는 안 됩니다.</p>
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
