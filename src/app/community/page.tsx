"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "../_components/community/SearchBar";
import { TCommunity } from "../types/community/community.types";
import { API_BASE_URL } from "@/config/api";
import useUserStore from "../_store/userSotre";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const tabs = [
  "공지사항",
  "자유게시판",
  "라운지",
  "서버홍보",
  "통합자료실",
  "링크",
];

interface LinkItem {
  id: number;
  title: string;
  url: string;
}

const POSTS_PER_PAGE = 10;

const queryClient = new QueryClient();

// API 호출 함수 분리
const fetchPosts = async (
  endpoint: string,
  page: number,
  limit: number,
  keyword: string,
  searchType: string,
  sort: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/${endpoint}?page=${page}&limit=${limit}&keyword=${keyword}&search-type=${searchType}&sort=${sort}`
  );
  return response.json();
};

const CommunityContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<TCommunity[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalPages, setTotalPages] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [linkItems, setLinkItems] = useState<LinkItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { accessToken, user } = useUserStore();

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentTab = Number(searchParams.get("tab")) || 0;
  const keyword = searchParams.get("keyword") || "";
  const searchType = searchParams.get("searchType") || "TITLE";
  const sort = searchParams.get("sort") || "RECENT";

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/integrated-links`);
        const result = await response.json();

        if (result.http_status === "OK") {
          setLinkItems(result.data);
        }
      } catch (error) {
        console.error("링크 목록 조회 실패:", error);
      }
    };

    fetchLinks();
  }, []);

  const getEndpoint = (tab: number) => {
    switch (tab) {
      case 0:
        return "announcements";
      case 1:
        return "frees";
      case 2:
        return "guides";
      case 3:
        return "promotions";
      case 4:
        return "datas";
      default:
        return "announcements";
    }
  };

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

  const endpoint = getEndpoint(currentTab);
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", endpoint, currentPage, keyword, searchType, sort],
    queryFn: () =>
      fetchPosts(
        endpoint,
        currentPage,
        POSTS_PER_PAGE,
        keyword,
        searchType,
        sort
      ),
    staleTime: 5000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.http_status === "OK") {
      // 공지사항을 최상단에 고정하기 위해 데이터 정렬
      const sortedPosts = [...data.data].sort((a, b) => {
        if (a.notice && !b.notice) return -1;
        if (!a.notice && b.notice) return 1;
        return 0;
      });
      setPosts(sortedPosts);

      // 데이터가 없고 현재 페이지가 1보다 크면 이전 페이지로 자동 이동
      if (sortedPosts.length === 0 && currentPage > 1) {
        router.push(
          `/community?tab=${currentTab}&page=${
            currentPage - 1
          }&keyword=${keyword}&search-type=${searchType}&sort=${sort}`
        );
      }

      setTotalPages(Math.ceil(data.data.length / POSTS_PER_PAGE));
    }
  }, [data, currentPage, currentTab, keyword, router, searchType, sort]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTabClick = (index: number) => {
    if (index === tabs.length - 1) {
      setShowDropdown(!showDropdown);
    } else {
      router.push(`/community?tab=${index}&page=1`);
      setShowDropdown(false);
    }
  };

  const handlePageChange = (page: number) => {
    router.push(
      `/community?tab=${currentTab}&page=${page}&keyword=${keyword}&search-type=${searchType}&sort=${sort}`
    );
  };

  const handleWriteClick = () => {
    if (!accessToken) {
      alert("로그인 후 이용해주세요.");
      router.push("/login");
      return;
    }

    if (currentTab === 0) {
      if (user?.member_role !== "ADMIN") {
        alert("공지사항은 관리자만 작성할 수 있습니다.");
        return;
      }
    }

    router.push(`/community/write?tab=${currentTab}`);
  };

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <div className="w-full">
      <div className="fixed top-[110px] left-0 right-0 bg-white z-10 border-b">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-0 font-semibold text-[20px] relative">
            {tabs.map((tab, index) => (
              <div
                key={tab}
                className="relative"
                ref={index === tabs.length - 1 ? dropdownRef : null}
              >
                <button
                  onClick={() => handleTabClick(index)}
                  className={`px-6 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 ${
                    currentTab === index && index !== tabs.length - 1
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : ""
                  }`}
                >
                  {tab}
                </button>
                {index === tabs.length - 1 && showDropdown && (
                  <div className="absolute top-full left-0 w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    {linkItems.map((item) => (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 hover:bg-gray-100 text-[16px] text-gray-700"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto pt-[200px] pb-[50px] min-h-[calc(100vh-132px)]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{tabs[currentTab]}</h1>
          <div className="flex items-center gap-4">
            <SearchBar currentTab={currentTab} />
            {(currentTab !== 0 ||
              (currentTab === 0 && user?.member_role === "ADMIN")) && (
              <button
                onClick={handleWriteClick}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                글쓰기
              </button>
            )}
          </div>
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

          {posts.map((post) => (
            <Link
              href={`/community/${post.id}?tab=${currentTab}&page=${currentPage}`}
              key={post.id}
              className={`flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 ${
                post.notice ? "bg-gray-50" : ""
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="w-[80px] text-center text-sm text-gray-500">
                  {post.notice ? "공지" : post.id}
                </span>
                <span className="flex-1">{post.title}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="w-[100px] text-center flex items-center justify-center gap-1">
                  <Image
                    src={getRoleImage(post.member_role)}
                    alt={post.member_role}
                    width={16}
                    height={16}
                    unoptimized
                  />
                  {post.nickname}
                </span>
                <span className="w-[100px] text-center">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                <span className="w-[80px] text-center">{post.hits}</span>
                <span className="w-[80px] text-center">
                  {post.count_of_comments}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-4 gap-1 items-center">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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

          {data?.data.length === POSTS_PER_PAGE && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {currentPage + 1}
            </button>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={data?.data.length < POSTS_PER_PAGE}
            className={`px-2 py-1 rounded ${
              data?.data.length < POSTS_PER_PAGE
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

const LoadingFallback = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
};

const CommunityPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingFallback />}>
        <CommunityContent />
      </Suspense>
    </QueryClientProvider>
  );
};

export default CommunityPage;
