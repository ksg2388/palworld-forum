"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api";
import useUserStore from "@/app/_store/userSotre";
import { makeAuthorizedRequest } from "@/app/_utils/api";
interface Attachment {
  id: number;
  file_name: string;
  file_path: string;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  created_at: string;
}

interface Notice {
  id: number;
  author: string;
  nickname: string;
  member_role: string;
  title: string;
  content: string;
  attachments: Attachment[];
  hits: number;
  count_of_comments: number;
  comments: Comment[];
  created_at: string;
  modified_at: string;
  notice: boolean;
}

const NoticeDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user } = useUserStore();

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

  const handleDelete = async () => {
    try {
      await makeAuthorizedRequest(`${API_BASE_URL}/kofiqa-announcements/${params.id}`, {
        method: "DELETE",
      });

      router.refresh();
      router.push("/kofiqa/notices");
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  const handleEdit = () => {
    router.push(`/kofiqa/notices/edit/${params.id}`);
  };

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
            <div className="flex items-center gap-2">
              {notice.notice && (
                <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                  공지사항
                </span>
              )}
              {user && user.email === notice.author && (
                <div className="relative">
                  <button
                    className="p-2"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <span className="sr-only">더보기</span>⋮
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg z-10">
                      <button
                        onClick={handleEdit}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          setShowDeleteConfirm(true);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
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

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold mb-4">게시글 삭제</h3>
            <p className="mb-4">정말로 이 게시글을 삭제하시겠습니까?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 rounded border"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDelete();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeDetailPage;
