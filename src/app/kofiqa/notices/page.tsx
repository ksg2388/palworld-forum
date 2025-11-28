"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
      <div className="relative flex items-center w-full sm:w-auto">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="h-[42px] pl-3 pr-8 border border-gray-300 rounded-l-lg border-r-0 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-pointer"
        >
          <option value="TITLE">제목</option>
          <option value="CONTENT">내용</option>
        </select>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="h-[42px] px-4 border border-gray-300 rounded-r-lg flex-1 sm:w-[280px] lg:w-[320px] text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 placeholder-gray-400"
        />
      </div>
      <button
        type="submit"
        className="h-[42px] px-5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 text-sm font-medium transition-all duration-200 shadow-sm shrink-0"
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
              className="p-4 bg-white border border-gray-100 lg:border-0 lg:border-b lg:border-gray-200 rounded-xl lg:rounded-none shadow-sm lg:shadow-none hover:shadow-md lg:hover:bg-gray-50 transition-all cursor-pointer flex flex-col lg:block"
            >
              {/* 모바일 뷰 */}
              <div className="flex flex-col lg:hidden gap-1.5">
                <div className="flex items-center">
                  {notice.notice ? (
                    <span className="inline-block px-2 py-0.5 bg-white border border-gray-200 text-gray-600 text-[11px] rounded-full font-medium shadow-sm">
                      공지
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">{notice.id}</span>
                  )}
                </div>

                <span className="text-[16px] font-medium text-gray-900 line-clamp-2 leading-snug my-0.5">
                  {notice.title}
                </span>

                <div className="flex items-center gap-1.5 mb-1">
                  <Image
                    src={getRoleImage(notice.member_role)}
                    alt={notice.member_role}
                    width={16}
                    height={16}
                    className="w-4 h-4 rounded"
                    unoptimized
                  />
                  <span className="text-sm text-gray-700 font-medium">{notice.nickname}</span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>{new Date(notice.created_at).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })}</span>
                  
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{notice.hits}</span>
                  </div>
                </div>
              </div>

              {/* 데스크톱 뷰 */}
              <div className="hidden lg:flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {notice.notice && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-sm rounded mr-2">
                      공지
                    </span>
                  )}
                  {notice.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={getRoleImage(notice.member_role)}
                      alt={notice.member_role}
                      width={16}
                      height={16}
                      className="w-4 h-4 rounded"
                      unoptimized
                    />
                    <span>{notice.nickname}</span>
                  </div>
                  <span>조회 {notice.hits}</span>
                  <span>
                    {new Date(notice.created_at).toLocaleDateString()}
                  </span>
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
