"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface Post {
  id: number;
  category: string;
  title: string;
  author: string;
  date: string;
  views: number;
  comments: number;
}

const tabs = [
  "공지사항",
  "자유게시판",
  "거래소",
  "서버홍보",
  "자료실",
  "스크린샷/영상",
];

const generateDummyPosts = () => {
  return Array.from({ length: 105 }, (_, i) => ({
    id: 105 - i,
    category: ["스크린샷", "자료", "홍보", "거래", "질문", "자유"][i % 6],
    title: `게시글 제목 ${105 - i}`,
    author: `작성자${105 - i}`,
    date: "2024.01.20",
    views: 100 + i,
    comments: 10 + (i % 20),
  }));
};

const POSTS_PER_PAGE = 10;

const CommunityPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dummyPosts, setDummyPosts] = useState<Post[]>([]);

  useEffect(() => {
    setDummyPosts(generateDummyPosts());
  }, []);

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentTab = Number(searchParams.get("tab")) || 0;

  const totalPages = Math.ceil(dummyPosts.length / POSTS_PER_PAGE);
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = dummyPosts.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지네이션 로직
  const pageGroupSize = 10;
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(currentGroup * pageGroupSize, totalPages);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handlePrevGroup = () => {
    if (startPage > 1) {
      router.push(
        `/community?tab=${currentTab}&page=${startPage - pageGroupSize}`
      );
    }
  };

  const handleNextGroup = () => {
    if (endPage < totalPages) {
      router.push(
        `/community?tab=${currentTab}&page=${startPage + pageGroupSize}`
      );
    }
  };

  const handleTabChange = (index: number) => {
    router.push(`/community?tab=${index}&page=1`);
  };

  const handlePageChange = (page: number) => {
    router.push(`/community?tab=${currentTab}&page=${page}`);
  };

  return (
    <div className="w-full">
      <div className="fixed top-[110px] left-0 right-0 bg-white z-10 border-b">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-0 font-semibold text-[20px]">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => handleTabChange(index)}
                className={`px-6 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 ${
                  currentTab === index
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto pt-[200px] pb-[50px]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{tabs[currentTab]}</h1>
          <Link
            href={`/community/write?tab=${currentTab}`}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            글쓰기
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <div className="flex items-center gap-4 flex-1">
              <span className="w-[80px] text-center">번호</span>
              <span className="flex-1">제목</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-[100px] text-center">작성자</span>
              <span className="w-[100px] text-center">작성일</span>
              <span className="w-[80px] text-center">조회</span>
              <span className="w-[80px] text-center">댓글</span>
            </div>
          </div>

          {currentPosts.map((post) => (
            <Link
              href={`/community/${post.id}?tab=${currentTab}&page=${currentPage}`}
              key={post.id}
              className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="w-[80px] text-center text-sm text-gray-500">
                  {post.id}
                </span>
                <span className="flex-1">{post.title}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="w-[100px] text-center">{post.author}</span>
                <span className="w-[100px] text-center">{post.date}</span>
                <span className="w-[80px] text-center">{post.views}</span>
                <span className="w-[80px] text-center">{post.comments}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-4 gap-1 items-center">
          <button
            onClick={handlePrevGroup}
            disabled={startPage === 1}
            className={`px-2 py-1 rounded ${
              startPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ◀
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={handleNextGroup}
            disabled={endPage === totalPages}
            className={`px-2 py-1 rounded ${
              endPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
