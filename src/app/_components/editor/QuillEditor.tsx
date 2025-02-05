"use client";

import { forwardRef, useState, useEffect, useMemo, useImperativeHandle, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { API_BASE_URL } from "@/config/api";
import { makeAuthorizedRequest } from "@/app/_utils/api";

const ReactQuillNew = dynamic(() => 
  import("react-quill-new").then((mod) => {
    const Component = mod.default;
    const ForwardedComponent = forwardRef((props: any, ref: any) => <Component {...props} forwardedRef={ref} />);
    ForwardedComponent.displayName = 'ForwardedReactQuill';
    return ForwardedComponent;
  }), 
  { ssr: false }
);

const QuillEditor = forwardRef(
  ({ initialValue = "" }: { initialValue?: string }, ref) => {
    const [value, setValue] = useState<string>(initialValue);
    const quillRef = useRef<any>(null); // Quill 인스턴스를 위한 ref

    useImperativeHandle(ref, () => ({
      getEditor: () => quillRef.current?.getEditor(),
    }));

    const imageHandler = async () => {
      try {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;

          const formData = new FormData();
          formData.append("attachment", file);

          const response = await makeAuthorizedRequest(
            `${API_BASE_URL}/attachments`,
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();
          if (data.http_status === "OK") {
            const filePath = data.data.file_name;
            const editor = quillRef.current?.getEditor();
            if (!editor) return;

            const range = editor.getSelection();
            editor.insertEmbed(
              range.index,
              "image",
              `${API_BASE_URL}/${filePath}`
            );
            console.log("이미지 경로 : ", `${API_BASE_URL}/${filePath}`);

            editor.setSelection(range.index + 1);
          } else {
            throw new Error("이미지 업로드에 실패했습니다.");
          }
        };
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      }
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

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <div>
        <style>
          {`
          .ql-editor {
            min-height: 500px;
          }
        `}
        </style>
        <ReactQuillNew
          ref={quillRef} // ReactQuillNew에 ref 전달
          value={value}
          onChange={setValue}
          modules={modules}
          formats={formats}
          theme="snow"
        />
      </div>
    );
  }
);

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;
