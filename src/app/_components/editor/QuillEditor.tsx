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
        // 이미지 압축 처리
        const compressedFile = await compressImage(file);
        const formData = new FormData();
        formData.append("attachment", compressedFile);

        // 임시 이미지 플레이스홀더 삽입
        const range = quillInstance.getSelection(true);
        const tempId = "temp-" + Date.now();
        quillInstance.insertEmbed(
          range.index,
          "image",
          "/loading-placeholder.gif"
        );
        const tempPosition = range.index;

        // 서버 업로드
        const response = await makeAuthorizedRequest(
          `${API_BASE_URL}/attachments`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        const imgName = data.data.file_name;

        // 플레이스홀더를 실제 이미지로 교체
        quillInstance.deleteText(tempPosition, 1);
        quillInstance.insertEmbed(
          tempPosition,
          "image",
          `${API_BASE_URL}/attachments/${imgName}`
        );
        quillInstance.setSelection(tempPosition + 1);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
      }
    };
  };

  // 이미지 압축 유틸리티 함수
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;

          // 최대 너비/높이 설정 (필요에 따라 조정)
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(
                  new File([blob], file.name, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  })
                );
              }
            },
            "image/jpeg",
            0.7
          ); // 품질 0.7로 압축
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
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
