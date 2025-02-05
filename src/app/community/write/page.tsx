"use client";

import dynamic from "next/dynamic";
import { useRef, useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/config/api";
import useUserStore from "@/app/_store/userSotre";
import { makeAuthorizedRequest } from "@/app/_utils/api";

const QuillEditor = dynamic(
  () => import("@/app/_components/editor/QuillEditor"),
  {
    ssr: false,
  }
);

const WriteContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editorRef = useRef<any>(null);
  const [title, setTitle] = useState("");
  const currentTab = Number(searchParams.get("tab")) || 0;
  const { accessToken } = useUserStore();

  useEffect(() => {
    if (!accessToken) {
      alert("로그인 후 이용해주세요.");
      router.push("/login");
    }
  }, [router, accessToken]);

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
    }
  };

  const handleSubmit = async () => {
    const content = editorRef.current?.value;

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content?.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const endpoint = getEndpoint(currentTab);

      const response = await makeAuthorizedRequest(
        `${API_BASE_URL}/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            content: content,
          }),
        }
      );

      const data = await response.json();

      if (data.http_status === "CREATED") {
        alert("게시글이 등록되었습니다.");
        router.push(`/community?tab=${currentTab}&page=1`);
      } else {
        alert("게시글 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pt-[150px] pb-[50px]">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
          />
        </div>

        <div className="min-h-[500px]">
          <QuillEditor ref={editorRef} />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            등록
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

const WritePage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <WriteContent />
    </Suspense>
  );
};

export default WritePage;
