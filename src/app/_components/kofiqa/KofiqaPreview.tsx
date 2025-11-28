"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "@/config/api";

interface News {
  id: number;
  title: string;
  nickname: string;
  member_role: string;
  created_at: string;
  hits: number;
}

const KofiqaPreview = () => {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/kofiqa-announcements/top5`,
          {
            method: "GET",
          }
        );
        const data = await response.json();

        if (data.http_status === "OK") {
          setNews(data.data);
        } else {
          console.error("공지사항 조회 실패:", data.message);
          setNews([]); // 실패시 빈 배열로 초기화
        }
      } catch (error) {
        console.error("공지사항 조회 중 오류 발생:", error);
        setNews([]); // 에러 발생시 빈 배열로 초기화
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const getRoleImage = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "/images/admin.gif";
      case "PARTNER":
        return "/images/partner.gif";
      case "NORMAL":
        return "/images/normal.png";
      case "LEGENDARY":
        return "/images/legend.gif";
      case "HEROIC":
        return "/images/hero.png";
      case "RARE":
        return "/images/rare.png";
      case "EXTRA_ORDINARY":
        return "/images/uncommon.png";
      default:
        return "/images/normal.png";
    }
  };

  // news가 undefined일 경우를 대비해 기본값으로 빈 배열 사용
  return (
    <div className="border-t-2 border-gray-800">
      {news.length > 0 &&
        news.map((item) => (
          <Link
            href={`/kofiqa/notices/${item.id}`}
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors gap-1 sm:gap-0"
          >
            <div className="flex-1 flex items-center gap-2 sm:gap-4 min-w-0">
              <span className="shrink-0 text-center text-xs sm:text-sm font-medium text-white bg-gray-800 px-2 py-0.5 rounded">
                공지
              </span>
              <span className="text-sm sm:text-sm flex-1 truncate text-gray-800 font-medium sm:font-normal">
                {item.title}
              </span>
            </div>
            <div className="flex items-center justify-end sm:justify-start gap-2 sm:gap-2 text-xs sm:text-sm text-gray-500 pl-8 sm:pl-0">
              <span className="flex items-center gap-1 min-w-[60px] sm:min-w-[80px] justify-end sm:justify-center truncate">
                {item.nickname}
              </span>
              <span className="min-w-[80px] sm:min-w-[100px] text-center">
                {formatDate(item.created_at)}
              </span>
              <div className="flex items-center justify-center gap-1 min-w-[40px] sm:min-w-[60px]">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{item.hits}</span>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default KofiqaPreview;
