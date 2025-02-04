"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import 'react-quill-new/dist/quill.snow.css';

const ReactQuillNew = dynamic(() => import("react-quill-new"), { ssr: false });

interface QuillViewProps {
  content: string;
}

const QuillView = ({ content }: QuillViewProps) => {
  const quillRef = useRef<any>(null);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.disable();
    }
  }, []);

  return (
    <ReactQuillNew
      ref={quillRef}
      value={content}
      readOnly={true} 
      theme="bubble"
      modules={{
        toolbar: false
      }}
    />
  );
};

export default QuillView;
