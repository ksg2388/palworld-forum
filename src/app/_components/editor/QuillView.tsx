"use client";

import { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

interface QuillViewProps {
  content: string;
}

const QuillView = ({ content }: QuillViewProps) => {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.disable();
    }
  }, []);

  return (
    <ReactQuill
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
