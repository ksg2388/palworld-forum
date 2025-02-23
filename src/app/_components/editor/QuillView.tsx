"use client";

import dynamic from "next/dynamic";
import 'react-quill-new/dist/quill.bubble.css';

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

          /* Quill 기본 스타일 복원 */
          .ql-editor {
            padding: 12px 15px;
            font-size: 1rem;
            line-height: 1.5;
          }
          
          .ql-editor p {
            margin-bottom: 1em;
          }
          
          .ql-editor h1, .ql-editor h2, .ql-editor h3 {
            font-weight: bold;
            margin-bottom: 0.5em;
            margin-top: 1em;
          }
          
          .ql-editor h1 {
            font-size: 2em;
          }
          
          .ql-editor h2 {
            font-size: 1.5em;
          }
          
          .ql-editor h3 {
            font-size: 1.17em;
          }
          
          .ql-editor ul, .ql-editor ol {
            padding-left: 1.5em;
            margin-bottom: 1em;
          }
          
          .ql-editor ul > li {
            list-style-type: disc;
          }
          
          .ql-editor ol > li {
            list-style-type: decimal;
          }
          
          .ql-editor blockquote {
            border-left: 4px solid #ccc;
            margin-bottom: 1em;
            margin-top: 1em;
            padding-left: 16px;
          }
            .ql-code-block {
                white-space: pre !important;
                font-family: monospace;
                background-color: #f8f9fa;
                padding: 1em;
                border-radius: 4px;
                margin: 0.5em 0;
                tab-size: 4;
                -moz-tab-size: 4;
            }

            /* 코드 블록 내부 div 스타일 재정의 */
            .ql-editor .ql-code-block > div {
                white-space: pre !important;
                display: inline-block;
                min-width: 100%;
            }
        `}
      </style>
      <ReactQuillNew
        value={content}
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
