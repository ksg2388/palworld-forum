"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api";
import { makeAuthorizedRequest } from "@/app/_utils/api";
import dynamic from "next/dynamic";
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor as EditorType } from '@toast-ui/react-editor';
import useUserStore from "@/app/_store/userSotre";

const Editor = dynamic(() => import("@toast-ui/react-editor").then((mod) => mod.Editor), {
  ssr: false
});

const CommunityEditPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const currentTab = Number(searchParams.get("tab")) || 0;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const editorRef = React.useRef<EditorType>(null);
  const { user } = useUserStore();

  const getEndpoint = (tab: number) => {
    switch(tab) {
      case 0:
        return 'announcements';
      case 1:
        return 'frees';
      case 2:
        return 'guides';
      case 3:
        return 'promotions';
      case 4:
        return 'datas';
      default:
        return 'announcements';
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const endpoint = getEndpoint(currentTab);
        const response = await makeAuthorizedRequest(
          `${API_BASE_URL}/${endpoint}/${id}`,
          {
            method: 'GET'
          }
        );
        const result = await response.json();
        
        if (result.http_status === "OK") {
          if (!user || user.email !== result.data.author) {
            router.push('/');
            return;
          }
          setTitle(result.data.title);
          setContent(result.data.content);
          if (editorRef.current) {
            editorRef.current.getInstance().setMarkdown(result.data.content);
          }
        }
      } catch (error) {
        console.error("게시글 조회 중 오류 발생:", error);
      }
    };

    fetchPost();
  }, [id, currentTab, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editorRef.current) return;
    
    try {
      const endpoint = getEndpoint(currentTab);
      const markdownContent = editorRef.current.getInstance().getMarkdown();
      
      const response = await makeAuthorizedRequest(
        `${API_BASE_URL}/${endpoint}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content: markdownContent
          }),
        }
      );

      const result = await response.json();
      if (result.http_status === "OK") {
        router.push(`/community/${id}?tab=${currentTab}`);
      }
    } catch (error) {
      console.error("게시글 수정 중 오류 발생:", error);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 pt-[140px]">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full p-2 mb-4 border rounded"
        />
        
        <Editor
          ref={editorRef}
          initialValue={content}
          previewStyle="vertical"
          height="600px"
          initialEditType="markdown"
          useCommandShortcut={true}
        />

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

export default CommunityEditPage;