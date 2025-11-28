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
      <div className="fixed top-[60px] lg:top-[110px] left-0 right-0 bg-white/90 backdrop-blur-md z-20 border-b border-gray-200/80 shadow-sm transition-all duration-300">
        <div className="max-w-[1200px] mx-auto overflow-x-auto scrollbar-hide sm:overflow-visible lg:px-8">
          <div className="flex items-center gap-3 px-4 lg:px-0 py-3 font-medium text-sm sm:text-base min-w-max sm:min-w-0">
            {tabs.map((tab, index) => (
              <div
                key={tab}
                className="relative"
                ref={index === tabs.length - 1 ? dropdownRef : null}
              >
                <button
                  onClick={() => handleTabClick(index)}
                  className={`px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap active:scale-95 ${
                    currentTab === index && index !== tabs.length - 1
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
                {index === tabs.length - 1 && showDropdown && (
                  <div className="fixed inset-0 sm:absolute sm:inset-auto sm:top-full sm:right-0 sm:mt-2 w-full sm:w-[200px] h-full sm:h-auto bg-black/50 sm:bg-white sm:border sm:border-gray-200 sm:rounded-xl sm:shadow-xl z-50 sm:z-30 flex items-end sm:block animate-in fade-in duration-200 sm:zoom-in">
                    {/* 모바일 닫기 영역 */}
                    <div className="absolute inset-0 sm:hidden" onClick={() => setShowDropdown(false)} />
                    
                    {/* 드롭다운 컨텐츠 */}
                    <div className="w-full bg-white rounded-t-2xl sm:rounded-none p-4 sm:p-1 space-y-1 sm:space-y-0 max-h-[80vh] overflow-y-auto">
                      <div className="flex items-center justify-between px-2 pb-4 mb-2 border-b border-gray-100 sm:hidden">
                        <span className="font-bold text-lg">링크 목록</span>
                        <button onClick={() => setShowDropdown(false)} className="p-2 -mr-2 text-gray-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      {linkItems.map((item) => (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-3.5 sm:py-3 hover:bg-gray-50 text-[16px] sm:text-[15px] text-gray-800 sm:text-gray-700 transition-colors rounded-xl sm:rounded-none font-medium sm:font-normal sm:border-b sm:border-gray-50 sm:last:border-0"
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-[140px] sm:pt-[150px] lg:pt-[190px] pb-[50px] min-h-[calc(100vh-132px)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">{tabs[currentTab]}</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <SearchBar currentTab={currentTab} />
            {(currentTab !== 0 ||
              (currentTab === 0 && user?.member_role === "ADMIN")) && (
              <button
                onClick={handleWriteClick}
                className="px-4 py-2 bg-gray-800 text-white text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-colors shrink-0"
              >
                글쓰기
              </button>
            )}
          </div>
        </div>

        <div className="bg-transparent sm:bg-white sm:border sm:border-gray-200 sm:rounded-lg sm:shadow-sm overflow-hidden space-y-3 sm:space-y-0">
          {/* 데스크톱 헤더 */}
          <div className="hidden sm:flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gray-50 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-2 sm:gap-4 flex-1">
              <span className="w-[60px] sm:w-[80px] text-center">번호</span>
              <span className="flex-1">제목</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="w-[80px] sm:w-[100px] text-center">작성자</span>
              <span className="w-[80px] sm:w-[100px] text-center">작성일</span>
              <span className="w-[50px] sm:w-[80px] text-center">조회</span>
              <span className="w-[50px] sm:w-[80px] text-center">댓글</span>
            </div>
          </div>

          {posts.map((post) => (
            <Link
              href={`/community/${post.id}?tab=${currentTab}&page=${currentPage}`}
              key={post.id}
              className={`block p-4 sm:p-4 bg-white border border-gray-100 sm:border-0 sm:border-b sm:border-gray-200 rounded-xl sm:rounded-none shadow-sm sm:shadow-none hover:shadow-md sm:hover:bg-gray-50 transition-all ${
                post.notice ? "bg-gray-50 border-gray-200" : ""
              }`}
            >
              {/* 모바일 뷰 */}
              <div className="flex flex-col sm:hidden gap-1.5">
                <div className="flex items-center">
                  {post.notice ? (
                    <span className="inline-block px-2 py-0.5 bg-white border border-gray-200 text-gray-600 text-[11px] rounded-full font-medium shadow-sm">
                      공지
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">{post.id}</span>
                  )}
                </div>

                <span className="text-[16px] font-medium text-gray-900 line-clamp-2 leading-snug my-0.5">
                  {post.title}
                </span>

                <div className="flex items-center gap-1.5 mb-1">
                  <Image
                    src={getRoleImage(post.member_role)}
                    alt={post.member_role}
                    width={16}
                    height={16}
                    className="w-4 h-4 rounded"
                    unoptimized
                  />
                  <span className="text-sm text-gray-700 font-medium">{post.nickname}</span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>{new Date(post.created_at).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })}</span>
                  
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{post.hits}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span>{post.count_of_comments}</span>
                  </div>
                </div>
              </div>

              {/* 데스크톱 뷰 */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className="w-[80px] text-center text-sm text-gray-500 shrink-0">
                    {post.notice ? (
                      <span className="inline-block px-2 py-0.5 bg-gray-800 text-white text-xs rounded">
                        공지
                      </span>
                    ) : (
                      post.id
                    )}
                  </span>
                  <span className="flex-1 text-base truncate font-medium">{post.title}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="w-[100px] text-center flex items-center justify-center gap-1 shrink-0">
                    <Image
                      src={getRoleImage(post.member_role)}
                      alt={post.member_role}
                      width={14}
                      height={14}
                      className="w-4 h-4"
                      unoptimized
                    />
                    <span className="truncate">{post.nickname}</span>
                  </span>
                  <span className="w-[100px] text-center shrink-0">
                    {new Date(post.created_at).toLocaleDateString("ko-KR", {
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                  <span className="w-[80px] text-center shrink-0">{post.hits}</span>
                  <span className="w-[80px] text-center shrink-0">
                    {post.count_of_comments}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-4 sm:mt-6 gap-1 sm:gap-2 items-center">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded text-sm sm:text-base ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            }`}
          >
            ◀
          </button>

          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm sm:text-base transition-colors"
            >
              {currentPage - 1}
            </button>
          )}

          <button className="px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-gray-800 text-white text-sm sm:text-base">
            {currentPage}
          </button>

          {data?.data.length === POSTS_PER_PAGE && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm sm:text-base transition-colors"
            >
              {currentPage + 1}
            </button>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={data?.data.length < POSTS_PER_PAGE}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded text-sm sm:text-base ${
              data?.data.length < POSTS_PER_PAGE
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
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
