"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api";
import { makeAuthorizedRequest } from "@/app/_utils/api";
import dynamic from "next/dynamic";
import useUserStore from "@/app/_store/userSotre";

const QuillEditor = dynamic(
  () => import("@/app/_components/editor/QuillEditor"),
  {
    ssr: false,
  }
);

const NoticeEditPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isNotice, setIsNotice] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await makeAuthorizedRequest(
          `${API_BASE_URL}/kofiqa-announcements/${id}`,
          {
            method: "GET",
          }
        );
        const result = await response.json();

        if (result.http_status === "OK") {
          setTitle(result.data.title);
          setContent(result.data.content);
          setIsNotice(result.data.notice);
        }
      } catch (error) {
        console.error("게시글 조회 중 오류 발생:", error);
      }
    };

    fetchNotice();
  }, [id, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content?.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const response = await makeAuthorizedRequest(
        `${API_BASE_URL}/kofiqa-announcements/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            content: content,
            notice: isNotice,
          }),
        }
      );

      const result = await response.json();
      if (result.http_status === "OK") {
        router.push(`/kofiqa/notices/${id}`);
      }
    } catch (error) {
      console.error("게시글 수정 중 오류 발생:", error);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 pt-[140px]">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isNotice}
              onChange={(e) => setIsNotice(e.target.checked)}
              className="form-checkbox"
            />
            <span>공지사항으로 등록</span>
          </label>
        </div>

        <div className="min-h-[500px]">
          <QuillEditor value={content} onChange={setContent} />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 rounded border"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeEditPage;
