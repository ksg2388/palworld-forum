"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.bubble.css";

const ReactQuillNew = dynamic(() => import("react-quill-new"), { ssr: false });

interface QuillViewProps {
  content: string;
}

const QuillView = ({ content }: QuillViewProps) => {
  const convertCodeblock = (content: string) => {
    return content
      .replace(
        /<div class="ql-code-block-container"/g,
        '<pre class="ql-code-block-container"'
      )
      .replace(/<div class="ql-code-block"/g, '<pre class="ql-code-block"')
      .replace(/<\/div>/g, "</pre>");
  };

  return (
    <>
      <style>
        {`
          .ql-video {
            width: 100%;
            aspect-ratio: 16/9;
          }
        `}
      </style>
      <ReactQuillNew
        value={convertCodeblock(content)}
        readOnly={true}
        theme="bubble"
        modules={{
          toolbar: false,
        }}
      />
    </>
  );
};

export default QuillView;
