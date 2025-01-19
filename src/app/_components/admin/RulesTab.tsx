"use client";

import { useState, useRef } from 'react';
import { Editor, Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

interface Rule {
  id: number;
  content: string;
}

const RulesTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [rules, setRules] = useState<Rule[]>([
    {
      id: 1,
      content: '<h3>1. 기본 규칙</h3><p>서버 내에서는 서로 존중하고 예의를 지켜주세요.</p>'
    },
    {
      id: 2,
      content: '<h3>2. 채팅 규칙</h3><p>욕설과 비하 발언은 금지됩니다.</p>'
    },
    {
      id: 3,
      content: '<h3>3. 게임 규칙</h3><p>다른 플레이어의 게임 플레이를 방해하지 마세요.</p>'
    }
  ]);
  const editorRef = useRef<Editor>(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const editorInstance = editorRef.current?.getInstance();
    if (editorInstance) {
      const content = editorInstance.getHTML();
      // 여기서 전체 규칙 내용을 저장하는 로직 구현
      setIsEditing(false);
    }
  };

  const combinedContent = rules.map(rule => rule.content).join('\n');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">서버 규칙 관리</h2>
        {!isEditing && (
          <button 
            onClick={handleEdit}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
          >
            수정
          </button>
        )}
      </div>
      
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        {isEditing ? (
          <div className="space-y-4">
            <Editor
              initialValue={combinedContent}
              height="500px"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
              ref={editorRef}
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsEditing(false)}
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
          <Viewer initialValue={combinedContent} />
        )}
      </div>
    </div>
  );
};

export default RulesTab;