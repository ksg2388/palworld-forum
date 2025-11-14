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
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-[16px] focus:outline-none focus:border-gray-500 bg-white shrink-0"
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
        className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg flex-1 sm:w-[280px] lg:w-[380px] text-sm sm:text-[16px] focus:outline-none focus:border-gray-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-[16px] transition-colors shrink-0"
      >
        검색
      </button>
    </form>
  );
};

export default SearchBar;
