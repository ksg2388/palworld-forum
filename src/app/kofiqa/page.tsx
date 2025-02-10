"use client";

import React, { useRef, useState, useEffect } from "react";
import PreviewNews from "../_components/home/PreviewNews";
import { API_BASE_URL } from "@/config/api";
import Link from "next/link";

const tabs = ["공지사항", "서버규칙", "입주자신청", "서버접속방법"];

const KofiqaPage = () => {
  const serverInfoRef = useRef<HTMLDivElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const rulesRef = useRef<HTMLDivElement>(null);
  const applicationRef = useRef<HTMLDivElement>(null);
  const [connectionContent, setConnectionContent] = useState<string>("");
  const [ruleContent, setRuleContent] = useState<string>("");
  const [occupancyContent, setOccupancyContent] = useState<string>("");

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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">공지사항</h2>
              <Link
                href="/kofiqa/notices"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                더보기 &gt;
              </Link>
            </div>
            <PreviewNews />
          </div>

          <div
            ref={rulesRef}
            className="bg-white border border-gray-200 p-6 rounded-lg scroll-mt-[160px]"
          >
            <h2 className="text-2xl font-bold mb-4">서버규칙</h2>
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: ruleContent }}
            />
          </div>

          <div
            ref={applicationRef}
            className="bg-white border border-gray-200 p-6 rounded-lg scroll-mt-[160px]"
          >
            <h2 className="text-2xl font-bold mb-4">입주자 신청</h2>
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: occupancyContent }}
            />
            <div className="flex justify-center mt-6">
              <Link
                href="/kofiqa/apply"
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                입주 신청
              </Link>
            </div>
          </div>

          <div
            ref={serverInfoRef}
            className="bg-white border border-gray-200 p-6 rounded-lg scroll-mt-[160px]"
          >
            <h2 className="text-2xl font-bold mb-4">서버 접속 방법</h2>
            <div className="space-y-4">
              <div
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: connectionContent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KofiqaPage;
