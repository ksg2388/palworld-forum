"use client";

import { useRef } from "react";
import { Editor, Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";

interface ContentEditorProps {
  isEditing: boolean;
  content: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

const ContentEditor = ({
  isEditing,
  content,
  onSave,
  onCancel,
}: ContentEditorProps) => {
  const editorRef = useRef<Editor>(null);

  const handleSave = () => {
    const editorInstance = editorRef.current?.getInstance();
    if (editorInstance) {
      const newContent = editorInstance.getHTML();
      onSave(newContent);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      {isEditing ? (
        <div className="space-y-4">
          <Editor
            initialValue={content}
            height="500px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            ref={editorRef}
            // plugins={[colorSyntax]}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <Viewer initialValue={content} />
      )}
    </div>
  );
};

export default ContentEditor;
