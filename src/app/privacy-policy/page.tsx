"use client";

import React from "react";
import Image from "next/image";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center mb-8">
          <Image
            src="/images/logo-palworld-black.png"
            width={125}
            height={34}
            alt="logo"
            className="bg-white"
          />
        </div>

        <h1 className="text-3xl font-bold text-center mb-8">
          개인정보처리방침
        </h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">
              1. 개인정보의 처리 목적
            </h2>
            <p className="mb-2">
              회사는 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의
              목적 이외의 용도로는 이용하지 않습니다.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>회원 가입 및 관리</li>
              <li>서비스 제공 및 운영</li>
              <li>고객 상담 및 문의 응대</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              2. 개인정보의 처리 및 보유기간
            </h2>
            <p className="mb-2">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
              개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
              개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                회원 탈퇴 시까지 (단, 관계법령에 따라 보존이 필요한 경우 해당
                기간까지)
              </li>
              <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              3. 개인정보의 제3자 제공
            </h2>
            <p>
              회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서
              명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정
              등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를
              제3자에게 제공합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              4. 정보주체의 권리·의무 및 그 행사방법
            </h2>
            <p className="mb-2">
              이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>개인정보 열람요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제요구</li>
              <li>처리정지 요구</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              5. 개인정보의 안전성 확보 조치
            </h2>
            <p className="mb-2">
              회사는 개인정보보호법 제29조에 따라 다음과 같은 안전성 확보 조치를
              취하고 있습니다.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>개인정보의 암호화</li>
              <li>해킹 등에 대비한 기술적 대책</li>
              <li>개인정보에 대한 접근 제한</li>
              <li>개인정보를 취급하는 직원의 최소화 및 교육</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              6. 개인정보 보호책임자
            </h2>
            <div className="p-4 bg-gray-50 rounded">
              <p>
                <strong>개인정보 보호책임자</strong>
              </p>
              <p className="mt-1">성명: 관리자</p>
              <p>연락처: kofiqa001@gmail.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              7. 개인정보처리방침의 변경
            </h2>
            <p>
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
              변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
              전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              8. 개인정보의 열람청구를 접수·처리하는 부서
            </h2>
            <div className="p-4 bg-gray-50 rounded">
              <p>
                <strong>개인정보 열람청구 접수·처리부서</strong>
              </p>
              <p className="mt-1">부서명: 고객지원팀</p>
              <p>연락처: kofiqa001@gmail.com</p>
            </div>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              본 방침은 2024년 1월 1일부터 적용됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
