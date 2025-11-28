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
    <div className="space-y-3 sm:space-y-0 sm:border-t-2 sm:border-gray-800">
      {news.length > 0 &&
        news.map((item) => (
          <Link
            href={`/kofiqa/notices/${item.id}`}
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:py-3 sm:px-0 bg-white sm:bg-transparent rounded-xl sm:rounded-none border border-gray-100 sm:border-0 sm:border-b sm:border-gray-200 shadow-sm sm:shadow-none hover:shadow-md sm:hover:shadow-none sm:hover:bg-gray-50 transition-all gap-3 sm:gap-0"
          >
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 min-w-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="shrink-0 text-center text-[10px] sm:text-xs font-medium text-white bg-gray-800 px-2 py-0.5 rounded">
                  공지
                </span>
                <span className="sm:hidden text-xs text-gray-400 ml-auto">
                  {formatDate(item.created_at)}
                </span>
              </div>
              <span className="text-[15px] sm:text-sm font-medium text-gray-900 sm:flex-1 break-all line-clamp-2 sm:line-clamp-1">
                {item.title}
              </span>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 text-xs sm:text-sm text-gray-500 pt-2 sm:pt-0 border-t border-gray-50 sm:border-0 mt-1 sm:mt-0">
              <div className="flex items-center gap-1.5 sm:hidden">
                <Image
                  src={getRoleImage(item.member_role)}
                  alt={item.member_role}
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 rounded"
                  unoptimized
                />
                <span className="font-medium text-gray-600">{item.nickname}</span>
              </div>
              <div className="flex items-center gap-1 sm:hidden">
                <span className="text-gray-400">조회</span>
                <span>{item.hits}</span>
              </div>

              {/* Desktop Layout */}
              <span className="hidden sm:flex min-w-[100px] items-center justify-center gap-1">
                <Image
                  src={getRoleImage(item.member_role)}
                  alt={item.member_role}
                  width={16}
                  height={16}
                  className="w-4 h-4 rounded"
                  unoptimized
                />
                <span className="truncate">{item.nickname}</span>
              </span>
              <span className="hidden sm:block min-w-[100px] text-center">
                {formatDate(item.created_at)}
              </span>
              <span className="hidden sm:block min-w-[60px] text-center">{item.hits}</span>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default KofiqaPreview;
