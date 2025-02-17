"use client";

import { useMemo, useRef } from "react";
import "react-quill-new/dist/quill.snow.css";
import { API_BASE_URL } from "@/config/api";
import { makeAuthorizedRequest } from "@/app/_utils/api";
import ReactQuill from "react-quill-new";

interface Props {
  style?: any;
  value: string;
  onChange: (value: string) => void;
}

const QuillEditor = ({ style, value, onChange }: Props) => {
  const quillRef = useRef<ReactQuill | null>(null);

  const imageHandler = async () => {
    if (!quillRef.current) return;

    const quillInstance = quillRef.current.getEditor();
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("attachment", file);

        // 서버 액션 호출
        const response = await makeAuthorizedRequest(
          `${API_BASE_URL}/attachments`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        const imgName = data.data.file_name;

        const range = quillInstance.getSelection(true);
        if (range) {
          quillInstance.insertEmbed(
            range.index,
            "image",
            `${API_BASE_URL}/attachments/${imgName}`
          );
        }
        quillInstance.setSelection(range.index + 1);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          [{ font: [] }],
          [{ size: ["small", "normal", "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="">
      <style>
        {`
          .ql-editor {
            min-height: 500px;
          }
        `}
      </style>
      <ReactQuill
        style={style}
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
      />
    </div>
  );
};

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;
