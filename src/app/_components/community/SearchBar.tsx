"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  currentTab: number;
}

const SearchBar = ({ currentTab }: SearchBarProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title"); // title, content, author

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(
        `/community?tab=${currentTab}&page=1&type=${searchType}&search=${encodeURIComponent(
          searchTerm
        )}`
      );
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="px-2 py-2 border border-gray-300 rounded-lg text-[16px] focus:outline-none focus:border-gray-500"
      >
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="author">작성자</option>
      </select>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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

export default SearchBar;
