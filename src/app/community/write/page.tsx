"use client";

import { useRef, useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useRouter, useSearchParams } from "next/navigation";

const WritePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editorRef = useRef<Editor>(null);
  const [title, setTitle] = useState("");
  const currentTab = Number(searchParams.get("tab")) || 0;

  const handleSubmit = () => {
    const content = editorRef.current?.getInstance().getMarkdown();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content?.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    // TODO: API 연동
    console.log({ title, content });

    // 임시로 목록으로 돌아가기
    router.push(`/community?tab=${currentTab}&page=1`);
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
          <Editor
            ref={editorRef}
            initialValue=""
            previewStyle="vertical"
            height="500px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            hideModeSwitch={true}
          />
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

export default WritePage;
