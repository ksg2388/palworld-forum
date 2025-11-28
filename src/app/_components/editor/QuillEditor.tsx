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
        quillInstance.insertEmbed(range.index, "image", "/images/loading.gif");
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
    // GIF 파일인 경우 압축하지 않고 원본 반환
    if (file.type === "image/gif") {
      return file;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;

          // 이미지 최대 크기를 더 크게 설정
          const MAX_WIDTH = 2048;
          const MAX_HEIGHT = 2048;

          let width = img.width;
          let height = img.height;

          // 원본 크기가 최대 크기보다 큰 경우에만 리사이징
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
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
          }

          canvas.width = width;
          canvas.height = height;

          // 이미지 렌더링 품질 개선
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // 파일 크기가 2MB 이하면 원본 품질 유지
          const maxFileSize = 2 * 1024 * 1024; // 2MB
          let quality = 0.92; // 초기 품질값 상향 조정

          canvas.toBlob(
            (blob) => {
              if (blob) {
                // 파일 크기가 2MB 이하면 현재 품질로 저장
                if (blob.size <= maxFileSize) {
                  resolve(
                    new File([blob], file.name, {
                      type: "image/jpeg",
                      lastModified: Date.now(),
                    })
                  );
                } else {
                  // 2MB 초과시에만 품질 조정
                  quality = Math.min(maxFileSize / blob.size, 0.9);
                  canvas.toBlob(
                    (compressedBlob) => {
                      if (compressedBlob) {
                        resolve(
                          new File([compressedBlob], file.name, {
                            type: "image/jpeg",
                            lastModified: Date.now(),
                          })
                        );
                      }
                    },
                    "image/jpeg",
                    quality
                  );
                }
              }
            },
            "image/jpeg",
            quality
          );
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
          [{ size: ["small", false, "large", "huge"] }],
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
          .ql-code-block {
            white-space: pre;
            font-family: monospace;
          }
          .ql-toolbar {
            position: sticky;
            top: 80px;
            z-index: 30;
            background-color: white;
            border-bottom: 1px solid #ccc;
            transition: top 0.3s;
          }
          @media (min-width: 1024px) {
            .ql-toolbar {
              top: 110px;
            }
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
