"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import useUserStore from "@/app/_store/userSotre";
import { TCommunity } from "@/app/types/community/community.types";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";
import { formatDate } from "@/app/_utils/date";
import { makeAuthorizedRequest } from "@/app/_utils/api";
import QuillView from "@/app/_components/editor/QuillView";

const CommunityDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const currentTab = Number(searchParams.get("tab")) || 0;
  const [post, setPost] = useState<TCommunity | null>(null);
  const { user } = useUserStore();
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(
    null
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const communityTabs = ["전체"];

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const endpoint = getEndpoint(currentTab);
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`);
        const result = await response.json();

        if (result.http_status === "OK") {
          setPost(result.data);
          console.log(result.data);
        } else {
          console.error("게시글 조회 실패:", result.message);
        }
      } catch (error) {
        console.error("게시글 조회 중 오류 발생:", error);
      }
    };

    fetchPost();
  }, [id, currentTab]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const endpoint = getEndpoint(currentTab);
      const response = await makeAuthorizedRequest(
        `${API_BASE_URL}/${endpoint}/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: commentText,
          }),
        }
      );

      const result = await response.json();
      if (result.http_status === "OK") {
        // 댓글 작성 성공 시 게시글 새로고침
        const endpoint = getEndpoint(currentTab);
        const postResponse = await fetch(`${API_BASE_URL}/${endpoint}/${id}`);
        const postResult = await postResponse.json();

        if (postResult.http_status === "OK") {
          setPost(postResult.data);
        }
        setCommentText("");
      }
    } catch (error) {
      console.error("댓글 작성 중 오류 발생:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const endpoint = getEndpoint(currentTab);
      await makeAuthorizedRequest(`${API_BASE_URL}/${endpoint}/${id}`, {
        method: "DELETE",
      });
      router.push("/community");
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/community/edit/${id}?tab=${currentTab}`);
  };

  if (!post) return <div>로딩중...</div>;

  return (
    <div className="max-w-[1200px] mx-auto p-4 pt-[140px]">
      {/* 상단 탭 */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div className="flex gap-4">
          {communityTabs.map((tab, index) => (
            <Link
              key={index}
              href={`/community?tab=${currentTab}`}
              className="text-gray-600 hover:text-gray-900"
            >
              {tab}
            </Link>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="p-2">
            <span className="sr-only">북마크</span>
            🔖
          </button>
          <button className="p-2">
            <span className="sr-only">공유</span>
            🔗
          </button>
          {user && user.email === post.author && (
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

      {/* 게시글 내용 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold">{post.author}</span>
          <span className="text-gray-500 text-sm">
            {formatDate(post.created_at)}
          </span>
          <span className="text-gray-500 text-sm">조회 {post.hits}</span>
        </div>
        <h1 className="text-xl font-bold mb-4">{post.title}</h1>
        <div className="whitespace-pre-line mb-4">
          <QuillView content={post.content} />
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2>댓글</h2>
          <span className="text-gray-500">{post.count_of_comments}</span>
        </div>

        {post.comments.map((comment) => (
          <div key={comment.id} className="border-t py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold">{comment.author}</span>
                {/* <span className="text-gray-500 text-sm">방금 전</span> */}
              </div>
            </div>
            <p className="mb-2">{comment.content}</p>

            {selectedCommentId === comment.id && user && (
              <div className="ml-8 mt-4">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-2 border rounded resize-none"
                  rows={2}
                  placeholder="답글을 입력하세요"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setSelectedCommentId(null)}
                    className="px-3 py-1 text-gray-600 rounded"
                  >
                    취소
                  </button>
                  <button
                    // onClick={() => handleReplySubmit(comment.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    등록
                  </button>
                </div>
              </div>
            )}

            {comment.child_comments.map((reply) => (
              <div
                key={reply.id}
                className="ml-8 mt-4 border-l-2 border-gray-200 pl-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold">{reply.author}</span>
                  <span className="text-gray-500 text-sm">방금 전</span>
                </div>
                <p>{reply.content}</p>
              </div>
            ))}
          </div>
        ))}

        {user && (
          <div className="border-t pt-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-2 border rounded resize-none"
              rows={4}
              placeholder="댓글을 입력하세요"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleCommentSubmit}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                등록
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;
