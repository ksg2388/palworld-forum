"use client";

import React, { useRef } from "react";
import PreviewNews from "../_components/home/PreviewNews";

const tabs = ["공지사항", "서버규칙", "입주자신청", "서버접속방법"];

const KofiqaPage = () => {
  const serverInfoRef = useRef<HTMLDivElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const rulesRef = useRef<HTMLDivElement>(null);
  const applicationRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    const headerOffset = 180;
    const elementPosition = ref.current?.getBoundingClientRect().top;
    const offsetPosition = elementPosition! + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-[110px] w-full">
      <div className="fixed top-[110px] left-0 right-0 bg-white z-10 border-b">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-0 font-semibold text-[20px]">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => {
                  switch (index) {
                    case 0:
                      scrollToSection(noticeRef);
                      break;
                    case 1:
                      scrollToSection(rulesRef);
                      break;
                    case 2:
                      scrollToSection(applicationRef);
                      break;
                    case 3:
                      scrollToSection(serverInfoRef);
                      break;
                  }
                }}
                className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto p-8 pt-[80px]">
        <div className="flex flex-col gap-8">
          <div
            ref={noticeRef}
            className="bg-white border border-gray-200 p-6 rounded-lg scroll-mt-[160px]"
          >
            <h2 className="text-2xl font-bold mb-4">공지사항</h2>
            <PreviewNews />
          </div>

          <div
            ref={rulesRef}
            className="bg-white border border-gray-200 p-6 rounded-lg scroll-mt-[160px]"
          >
            <h2 className="text-2xl font-bold mb-4">서버규칙</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-2">1. 입주 규칙</h3>
                <ul className="pl-5 space-y-1 text-gray-700">
                  <li>
                    1-1. 서버 이용자는 서버 규칙을 반드시 숙지하고 서버를
                    이용해야 합니다.
                  </li>
                  <li>
                    1-2. 모든 유저에게 공정한 게임 환경을 제공하고자 합니다.
                  </li>
                  <li>
                    1-3. 다른 유저를 존중하고 예의바른 태도로 게임을 즐겨주시기
                    바랍니다.
                  </li>
                  <li>
                    1-4. 서버 내 채팅에서는 욕설이나 비하발언이 금지됩니다.
                  </li>
                  <li>
                    1-5. 버그 악용이나 서버 해킹 시도는 엄격히 금지됩니다.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">2. 플레이어 규칙</h3>
                <ul className="pl-5 space-y-1 text-gray-700">
                  <li>
                    2-1. 타 플레이어의 건축물이나 시설을 무단으로 파괴하는
                    행위는 금지됩니다.
                  </li>
                  <li>
                    2-2. 서버 내 거래는 지정된 거래소에서만 이루어져야 합니다.
                  </li>
                  <li>
                    2-3. 게임 내 버그를 발견 시 즉시 관리자에게 보고해야 합니다.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div
            ref={applicationRef}
            className="bg-white border border-gray-200 p-6 rounded-lg scroll-mt-[160px]"
          >
            <h2 className="text-2xl font-bold mb-4">입주자 신청</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                KOFIQA 서버의 입주자가 되기 위한 절차입니다:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>아래 카카오톡 오픈채팅방에 입장합니다.</li>
                <li>입주자 신청 양식을 작성하여 제출합니다.</li>
                <li>관리자의 승인 후 서버에 입주할 수 있습니다.</li>
              </ol>
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="https://open.kakao.com/o/KOFIQA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white font-medium rounded hover:bg-gray-900 transition-colors"
                >
                  입주 신청하러 가기
                </a>
                <span className="text-sm text-gray-500">
                  * 운영시간: 평일 10:00 ~ 18:00
                </span>
              </div>
            </div>
          </div>

          <div
            ref={serverInfoRef}
            className="bg-white border border-gray-200 p-6 rounded-lg scroll-mt-[160px]"
          >
            <h2 className="text-2xl font-bold mb-4">서버 접속 방법</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                서버 접속을 위해 아래 절차를 따라주세요:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>Steam에서 Palworld 게임을 실행합니다.</li>
                <li>멀티플레이어 모드를 선택합니다.</li>
                <li>{"서버 검색에서 'KOFIQA'를 검색합니다."}</li>
                <li>서버에 접속하여 즐거운 시간 보내세요!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KofiqaPage;
