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
      <div className="relative flex items-center w-full sm:w-auto group">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="h-[42px] pl-4 pr-8 border border-gray-200 rounded-l-full border-r-0 bg-gray-50 text-sm text-gray-600 focus:outline-none focus:ring-0 cursor-pointer hover:bg-gray-100 transition-colors appearance-none"
          style={{ backgroundImage: 'none' }}
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
          className="h-[42px] pl-2 pr-12 border border-gray-200 rounded-r-full flex-1 sm:w-[280px] lg:w-[320px] text-sm bg-gray-50 text-gray-900 focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 placeholder-gray-400 transition-all"
        />
        <button
          type="submit"
          className="absolute right-1 top-1 h-[34px] w-[34px] flex items-center justify-center bg-gray-900 text-white rounded-full hover:bg-gray-800 active:scale-95 transition-all duration-200 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
