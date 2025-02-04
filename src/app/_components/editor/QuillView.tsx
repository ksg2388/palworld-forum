"use client";

import dynamic from "next/dynamic";
import 'react-quill-new/dist/quill.snow.css';

const ReactQuillNew = dynamic(() => import("react-quill-new"), { ssr: false });

interface QuillViewProps {
  content: string;
}

const QuillView = ({ content }: QuillViewProps) => {
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
        value={content}
        readOnly={true} 
        theme="bubble"
        modules={{
          toolbar: false
        }}
      />
    </>
  );
};

export default QuillView;
