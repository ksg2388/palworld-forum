"use client";

import dynamic from "next/dynamic";
import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notice, setNotice] = useState(false);
  const { accessToken, user } = useUserStore();

  useEffect(() => {
    if (!accessToken) {
      alert("로그인 후 이용해주세요.");
      router.push("/login");
    }
    if (user?.member_role !== "ADMIN") {
      alert("관리자만 이용할 수 있습니다.");
      router.push("/kofiqa/notices");
    }
  }, [router, accessToken, user]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content?.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const response = await makeAuthorizedRequest(
        `${API_BASE_URL}/kofiqa-announcements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            content: content,
            notice: notice,
          }),
        }
      );

      const data = await response.json();

      if (data.http_status === "CREATED") {
        alert("공지사항이 등록되었습니다.");
        router.push("/kofiqa/notices");
      } else {
        alert("공지사항 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("공지사항 등록 실패:", error);
      alert("공지사항 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pt-[150px] pb-[50px]">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="notice"
              checked={notice}
              onChange={(e) => setNotice(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="notice" className="text-sm text-gray-700">
              상단 고정
            </label>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
          />
        </div>

        <div className="min-h-[500px]">
          <QuillEditor value={content} onChange={setContent} />
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
