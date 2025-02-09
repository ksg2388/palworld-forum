"use client";

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";
import { useRouter } from "next/navigation";

interface Notice {
  id: number;
  title: string;
  content: string;
  hits: number;
  created_at: string;
}

// SearchBar 컴포넌트
interface SearchBarProps {
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("TITLE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="px-2 py-2 border border-gray-300 rounded-lg text-[16px] focus:outline-none focus:border-gray-500"
      >
        <option value="TITLE">제목</option>
        <option value="CONTENT">내용</option>
      </select>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="px-4 py-2 border border-gray-300 rounded-lg w-[380px] text-[16px] focus:outline-none focus:border-gray-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-[16px]"
      >
        검색
      </button>
    </form>
  );
};

// Pagination 컴포넌트
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex gap-2">
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`px-3 py-1 rounded-lg transition-colors ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : typeof page === "number"
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "text-gray-700"
          }`}
          disabled={typeof page !== "number"}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

const NoticesPage = () => {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const limit = 10;

  useEffect(() => {
    const fetchNotices = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/kofiqa-announcements?page=${currentPage}&limit=${limit}&keyword=${keyword}`
          );
          const data = await response.json();
    
          if (data.http_status === "OK") {
            setNotices(data.data.items);
            setTotalPages(Math.ceil(data.data.total / limit));
          }
        } catch (error) {
          console.error("공지사항을 불러오는데 실패했습니다:", error);
        }
      };

    fetchNotices();
  }, [currentPage, setNotices, keyword]);

  return (
    <div className="mt-[110px] max-w-[1200px] mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">KOFIQA 공지사항</h1>
        <div className="flex items-center gap-2">
          <SearchBar
            onSearch={(value) => {
              setKeyword(value);
              setCurrentPage(1);
            }}
          />
          <button
            onClick={() => router.push('/kofiqa/notices/write')}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-[16px]"
          >
            글쓰기
          </button>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{notice.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>조회 {notice.hits}</span>
                <span>{new Date(notice.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <p className="mt-2 text-gray-600">{notice.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default NoticesPage; 