"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";

interface News {
  id: number;
  title: string;
  nickname: string;
  created_at: string;
  hits: number;
}

const PreviewNews = () => {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/announcements?page=1&size=4`, {
          method: "GET",
        });
        const data = await response.json();
        
        if (data.http_status === "OK") {
          setNews(data.data);
        } else {
          console.error("공지사항 조회 실패:", data.message);
        }
      } catch (error) {
        console.error("공지사항 조회 중 오류 발생:", error);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="border-t-2 border-gray-800">
      {news.length > 0 && news.map((item) => (
        <Link
          href={`/community/${item.id}`}
          key={item.id}
          className="flex items-center justify-between py-3 border-b border-gray-200 hover:bg-gray-50"
        >
          <div className="flex-1 flex items-center gap-4">
            <span className="min-w-[40px] text-center text-sm font-medium text-white bg-gray-800 px-2 py-1 rounded">
              공지
            </span>
            <span className="text-sm flex-1">{item.title}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="min-w-[80px] text-center">{item.nickname}</span>
            <span className="min-w-[100px] text-center">{formatDate(item.created_at)}</span>
            <span className="min-w-[60px] text-center">{item.hits}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PreviewNews;
