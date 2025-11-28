"use client";

import React, { useRef, useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useUserStore from "@/app/_store/userSotre";
import CustomAlert from "@/app/_components/common/CustomAlert";
import QuillView from "../_components/editor/QuillView";
import KofiqaPreview from "../_components/kofiqa/KofiqaPreview";

const tabs = ["공지사항", "서버규칙", "입주자신청", "서버접속방법"];

const KofiqaPage = () => {
  const router = useRouter();
  const { isLoggedIn } = useUserStore();
  const serverInfoRef = useRef<HTMLDivElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const rulesRef = useRef<HTMLDivElement>(null);
  const applicationRef = useRef<HTMLDivElement>(null);
  const [connectionContent, setConnectionContent] = useState<string>("");
  const [ruleContent, setRuleContent] = useState<string>("");
  const [occupancyContent, setOccupancyContent] = useState<string>("");
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    const fetchConnectionInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/connection`);
        const data = await response.json();

        if (data.http_status === "OK") {
          setConnectionContent(data.data.content);
        }
      } catch (error) {
        console.error("서버 접속 정보를 불러오는데 실패했습니다:", error);
      }
    };

    const fetchRuleInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/rule`);
        const data = await response.json();

        if (data.http_status === "OK") {
          setRuleContent(data.data.content);
        }
      } catch (error) {
        console.error("서버 규칙을 불러오는데 실패했습니다:", error);
      }
    };

    const fetchOccupancyInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/occupancy`);
        const data = await response.json();

        if (data.http_status === "OK") {
          setOccupancyContent(data.data.content);
        }
      } catch (error) {
        console.error("입주자 신청 정보를 불러오는데 실패했습니다:", error);
      }
    };

    fetchConnectionInfo();
    fetchRuleInfo();
    fetchOccupancyInfo();
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    // 헤더 높이(60px/110px) + 네비게이션 바 높이(50px) + 여유분(10px)
    const headerOffset = typeof window !== "undefined" && window.innerWidth >= 1024 ? 170 : 120;
    const elementPosition = ref.current?.getBoundingClientRect().top;
    const offsetPosition = elementPosition! + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  const handleApplyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowLoginAlert(true);
    }
  };

  const handleLoginAlertClose = () => {
    setShowLoginAlert(false);
    router.push("/login");
  };

  return (
    <>
      <CustomAlert
        isOpen={showLoginAlert}
        message="로그인이 필요합니다."
        onClose={handleLoginAlertClose}
      />
      <div className="mt-[70px] lg:mt-[110px] w-full">
      <div className="fixed top-[60px] lg:top-[110px] left-0 right-0 bg-white/90 backdrop-blur-md z-20 border-b border-gray-200/80 shadow-sm transition-all duration-300">
        <div className="max-w-[1200px] mx-auto overflow-x-auto scrollbar-hide lg:px-8">
          <div className="flex items-center gap-3 px-4 lg:px-0 py-3 font-medium text-sm sm:text-base min-w-max sm:min-w-0">
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
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 active:bg-gray-300 active:scale-95 transition-all duration-200 whitespace-nowrap"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 pt-[60px] sm:pt-[70px] lg:pt-[80px]">
        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
          <div
            ref={noticeRef}
            className="bg-white border border-gray-200 p-4 sm:p-5 lg:p-6 rounded-lg shadow-sm scroll-mt-[140px] sm:scroll-mt-[150px] lg:scroll-mt-[160px]"
          >
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">공지사항</h2>
              <Link
                href="/kofiqa/notices"
                className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm shrink-0 ml-2"
              >
                더보기 &gt;
              </Link>
            </div>
            <KofiqaPreview />
          </div>

          <div
            ref={rulesRef}
            className="bg-white border border-gray-200 p-4 sm:p-5 lg:p-6 rounded-lg shadow-sm scroll-mt-[140px] sm:scroll-mt-[150px] lg:scroll-mt-[160px]"
          >
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">서버규칙</h2>
            <QuillView content={ruleContent} />
          </div>

          <div
            ref={applicationRef}
            className="bg-white border border-gray-200 p-4 sm:p-5 lg:p-6 rounded-lg shadow-sm scroll-mt-[140px] sm:scroll-mt-[150px] lg:scroll-mt-[160px]"
          >
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">입주자 신청</h2>
            <QuillView content={occupancyContent} />
            <div className="flex justify-center mt-4 sm:mt-5 lg:mt-6">
              <Link
                href="/kofiqa/apply"
                onClick={handleApplyClick}
                className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-gray-800 text-white text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                입주 신청
              </Link>
            </div>
          </div>

          <div
            ref={serverInfoRef}
            className="bg-white border border-gray-200 p-4 sm:p-5 lg:p-6 rounded-lg shadow-sm scroll-mt-[140px] sm:scroll-mt-[150px] lg:scroll-mt-[160px]"
          >
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">서버 접속 방법</h2>
            <QuillView content={connectionContent} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default KofiqaPage;
