"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  currentTab: number;
}

const SearchBar = ({ currentTab }: SearchBarProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("TITLE"); // TITLE, CONTENT, AUTHOR로 변경

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색어 유무와 관계없이 항상 라우팅하도록 수정
    router.push(
      `/community?tab=${currentTab}&page=1&searchType=${searchType}&keyword=${encodeURIComponent(
        searchTerm.trim()
      )}`
    );
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <div className="relative flex items-center w-full sm:w-auto">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="h-[42px] pl-3 pr-8 border border-gray-300 rounded-l-lg border-r-0 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-pointer"
        >
          <option value="TITLE">제목</option>
          <option value="CONTENT">내용</option>
          <option value="NICKNAME">작성자</option>
        </select>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

export default SearchBar;
