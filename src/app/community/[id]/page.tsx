"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useUserStore from "@/app/_store/userSotre";
import { TCommunity } from "@/app/types/community/community.types";
import Link from "next/link";

const CommunityDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<TCommunity | null>(null);
  const { user } = useUserStore();
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);

  const communityTabs = [
    "전체",
    "이벤트", 
    "다음글"
  ];

  useEffect(() => {
    const dummyPost: TCommunity = {
      id: Number(id),
      dtype: "자유게시판",
      author: "작성자",
      title: "포용여간 밸패 메일올듯이 비싸지?",
      content: "스커지 밸패 50000\n니브루 밸패 20000\n\n도시락 마다해 이 되어 버리면..",
      attachments: [],
      hits: 100,
      count_of_comments: 2,
      comments: [
        {
          id: 1,
          author: "리브로",
          content: "도시락 마다와 다이어리 하실..?",
          child_comments: []
        },
        {
          id: 2,
          author: "블루",
          content: "제소 고마워 잘먹겠음",
          child_comments: []
        }
      ],
      created_at: "2024.01.31 17:15",
      modified_at: "2024.01.31 17:15"
    };
    setPost(dummyPost);
  }, [id]);

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    // 댓글 등록 로직 구현
    setCommentText("");
  };

  const handleReplySubmit = (commentId: number) => {
    if (!replyText.trim()) return;
    // 답글 등록 로직 구현
    setReplyText("");
    setSelectedCommentId(null);
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
              href={`/community?tab=${index}`}
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
          <button className="p-2">
            <span className="sr-only">더보기</span>
            ⋮
          </button>
        </div>
      </div>

      {/* 게시글 내용 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold">{post.author}</span>
          <span className="text-gray-500 text-sm">{post.created_at}</span>
          <span className="text-gray-500 text-sm">조회 {post.hits}</span>
        </div>
        <h1 className="text-xl font-bold mb-4">{post.title}</h1>
        <div className="whitespace-pre-line mb-4">
          {post.content}
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
                <span className="text-gray-500 text-sm">방금 전</span>
              </div>
              {user && (
                <button 
                  onClick={() => setSelectedCommentId(comment.id)}
                  className="text-gray-500 text-sm hover:text-gray-700"
                >
                  답글달기
                </button>
              )}
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
                    onClick={() => handleReplySubmit(comment.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    등록
                  </button>
                </div>
              </div>
            )}

            {comment.child_comments.map((reply) => (
              <div key={reply.id} className="ml-8 mt-4 border-l-2 border-gray-200 pl-4">
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
