"use client";

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";
import { useRouter } from "next/navigation";
import useUserStore from "@/app/_store/userSotre";

interface Notice {
  id: number;
  title: string;
  content: string;
  hits: number;
  created_at: string;
  nickname: string;
  author: string;
  member_role: string;
  notice: boolean;
}

// SearchBar 컴포넌트
interface SearchBarProps {
  onSearch: (value: string, searchType: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("TITLE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue, searchType);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <div className="flex gap-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-2 py-2 border border-gray-300 rounded-lg text-[14px] lg:text-[16px] focus:outline-none focus:border-gray-500"
        >
          <option value="TITLE">제목</option>
          <option value="CONTENT">내용</option>
        </select>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="px-4 py-2 border border-gray-300 rounded-lg flex-1 sm:w-[380px] text-[14px] lg:text-[16px] focus:outline-none focus:border-gray-500"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-[14px] lg:text-[16px]"
      >
        검색
      </button>
    </form>
  );
};

const NoticesPage = () => {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("TITLE");
  const { user } = useUserStore();
  const limit = 10;

  // 페이지네이션 로직 수정
  const handlePrevGroup = () => {
    if (currentPage > 1) {
      setCurrentPage(Math.max(1, currentPage - 1));
    }
  };

  const handleNextGroup = () => {
    if (notices.length === limit) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNoticeClick = (noticeId: number) => {
    router.push(`/kofiqa/notices/${noticeId}`);
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/kofiqa-announcements?page=${currentPage}&limit=${limit}&keyword=${keyword}&search-type=${searchType}`
        );
        const data = await response.json();

        if (data.http_status === "OK") {
          // 공지사항을 우선적으로 보이도록 정렬
          const sortedNotices = [...data.data].sort((a, b) => {
            if (a.notice && !b.notice) return -1;
            if (!a.notice && b.notice) return 1;
            return 0;
          });
          setNotices(sortedNotices);

          // 데이터가 없고 현재 페이지가 1보다 크면 이전 페이지로 자동 이동
          if (sortedNotices.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }
      } catch (error) {
        console.error("공지사항을 불러오는데 실패했습니다:", error);
      }
    };

    fetchNotices();
  }, [currentPage, keyword, searchType, limit]);

  return (
    <div className="mt-[60px] lg:mt-[110px] max-w-[1200px] mx-auto p-4 lg:p-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl lg:text-2xl font-bold">KOFIQA 공지사항</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <SearchBar
            onSearch={(value, type) => {
              setKeyword(value);
              setSearchType(type);
              setCurrentPage(1);
            }}
          />
          {user?.member_role === "ADMIN" && (
            <button
              onClick={() => router.push("/kofiqa/notices/write")}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-[14px] lg:text-[16px] w-full sm:w-auto"
            >
              글쓰기
            </button>
          )}
        </div>
      </div>

      <div className="bg-transparent lg:bg-white lg:border lg:border-gray-200 rounded-lg min-h-[calc(100vh-200px)] space-y-3 lg:space-y-0">
        {notices.length > 0 &&
          notices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => handleNoticeClick(notice.id)}
              className="p-4 bg-white border border-gray-100 lg:border-0 lg:border-b lg:border-gray-200 rounded-xl lg:rounded-none shadow-sm lg:shadow-none hover:shadow-md lg:hover:bg-gray-50 transition-all cursor-pointer flex flex-col lg:block gap-2"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 lg:gap-0">
                <h2 className="text-[15px] lg:text-lg font-medium lg:font-semibold break-all line-clamp-2 lg:line-clamp-1">
                  {notice.notice && (
                    <span className="inline-block px-2 py-0.5 lg:py-1 bg-gray-100 text-xs lg:text-sm rounded mr-2 align-middle">
                      공지
                    </span>
                  )}
                  {notice.title}
                </h2>
                <div className="flex items-center justify-between lg:justify-end gap-2 lg:gap-4 text-xs lg:text-sm text-gray-500 pt-2 border-t border-gray-50 lg:border-0 lg:pt-0 mt-1 lg:mt-0">
                  <span className="font-medium text-gray-600 lg:text-gray-500">{notice.nickname}</span>
                  <div className="flex items-center gap-2 lg:gap-4">
                    <span className="flex items-center gap-1">
                      <span className="lg:hidden">조회</span>
                      {notice.hits}
                    </span>
                    <span>
                      {new Date(notice.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-center mt-4 gap-1 items-center">
        <button
          onClick={handlePrevGroup}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          ◀
        </button>

        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {currentPage - 1}
          </button>
        )}

        <button className="px-3 py-1 rounded bg-gray-800 text-white">
          {currentPage}
        </button>

        {notices.length === limit && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {currentPage + 1}
          </button>
        )}

        <button
          onClick={handleNextGroup}
          disabled={notices.length < limit}
          className={`px-2 py-1 rounded ${
            notices.length < limit
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default NoticesPage;
