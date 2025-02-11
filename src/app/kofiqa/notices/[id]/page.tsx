"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api";

interface Notice {
  id: number;
  author: string;
  nickname: string;
  member_role: string;
  title: string;
  content: string;
  attachments: any[];
  hits: number;
  count_of_comments: number;
  comments: any[];
  created_at: string;
  modified_at: string;
  notice: boolean;
}

const NoticeDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/kofiqa-announcements/${params.id}`
        );
        const data = await response.json();

        if (data.http_status === "OK") {
          setNotice(data.data);
        } else {
          alert("게시글을 불러오는데 실패했습니다.");
          router.push("/kofiqa/notices");
        }
      } catch (error) {
        console.error("게시글 조회 실패:", error);
        alert("게시글을 불러오는데 실패했습니다.");
        router.push("/kofiqa/notices");
      }
    };

    if (params.id) {
      fetchNoticeDetail();
    }
  }, [params.id, router]);

  if (!notice) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="mt-[110px] max-w-[1200px] mx-auto p-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{notice.title}</h1>
            {notice.notice && (
              <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                공지사항
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>{notice.nickname}</span>
              <span>
                {new Date(notice.created_at).toLocaleDateString()}{" "}
                {new Date(notice.created_at).toLocaleTimeString()}
              </span>
            </div>
            <span>조회 {notice.hits}</span>
          </div>
        </div>

        <div
          className="py-8 min-h-[400px]"
          dangerouslySetInnerHTML={{ __html: notice.content }}
        />

        <div className="flex justify-end gap-2 mt-4 border-t border-gray-200 pt-4">
          <button
            onClick={() => router.push("/kofiqa/notices")}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            목록
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailPage;
