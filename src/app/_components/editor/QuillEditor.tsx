"use client";

import { forwardRef, useState } from "react";
import dynamic from "next/dynamic";
import 'react-quill-new/dist/quill.snow.css';

const ReactQuillNew = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, false] }],
    [{ font: [] }],
    [{ size: ["small", "normal", "large", "huge"] }], // 기본 사이즈 옵션으로 변경
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
};

const formats = [
  "header", "font", "size", "bold", "italic", "underline", "strike", "color", "background",
  "script", "list", "indent", "align", "blockquote", "code-block", "link", "image", "video"
];

const QuillEditor = forwardRef(({ initialValue = "" }: { initialValue?: string }, ref: any) => {
  const [value, setValue] = useState<string>(initialValue);

  console.log("초기값 : ", initialValue);
  console.log("현재값 : ", value);

  // ref를 통해 외부에서 value에 접근할 수 있도록 설정
  if (ref) {
    ref.current = { value };
  }

  return (
    <div className="">
      <style>
        {`
          .ql-editor {
            min-height: 500px;
          }
        `}
      </style>
      <ReactQuillNew
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
        theme="snow"
      />
    </div>
  );
});

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;
