"use client";

import React from "react";
import Link from "next/link";

const PreviewNews = () => {
  const dummyNews = [
    {
      id: 1,
      category: "공지",
      title: "포럼 리뉴얼 <베이직>스킨팩 적용 완료! 현재 서비스 정상",
      author: "admin",
      date: "2023.05.08",
      views: 308,
    },
    {
      id: 2,
      category: "공지",
      title: "Epic Games 업데이트를 통한 서버가 업데이트되었습니다",
      author: "admin",
      date: "2023.05.04",
      views: 1025,
    },
    {
      id: 3,
      category: "공지",
      title: "포럼 리뉴얼 <베이직>스킨팩 적용 완료! 현재 서비스 정상",
      author: "admin",
      date: "2023.05.08",
      views: 308,
    },
    {
      id: 4,
      category: "공지",
      title: "Epic Games 업데이트를 통한 서버가 업데이트되었습니다",
      author: "admin",
      date: "2023.05.04",
      views: 1055,
    },
  ];

  return (
    <div className="border-t-2 border-gray-800">
      {dummyNews.map((news) => (
        <Link
          href={`/news/${news.id}`}
          key={news.id}
          className="flex items-center justify-between py-3 border-b border-gray-200 hover:bg-gray-50"
        >
          <div className="flex-1 flex items-center gap-4">
            <span className="min-w-[40px] text-center text-sm font-medium text-white bg-gray-800 px-2 py-1 rounded">
              {news.category}
            </span>
            <span className="text-sm flex-1">{news.title}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="min-w-[80px] text-center">{news.author}</span>
            <span className="min-w-[100px] text-center">{news.date}</span>
            <span className="min-w-[60px] text-center">{news.views}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PreviewNews;
