"use client";

import { useState, useRef } from 'react';
import { Editor, Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

interface Connection {
  id: number;
  content: string;
}

const ConnectionTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: 1,
      content: '<h3>서버 접속 방법</h3><p>다음 단계를 따라 서버에 접속하실 수 있습니다.</p>'
    },
    {
      id: 2,
      content: '<h3>서버 주소</h3><p>play.example.com</p>'
    },
    {
      id: 3,
      content: '<h3>필수 모드</h3><p>서버 접속에 필요한 모드 목록과 설치 방법입니다.</p>'
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
      // 여기서 전체 연결 방법 내용을 저장하는 로직 구현
      setIsEditing(false);
    }
  };

  const combinedContent = connections.map(conn => conn.content).join('\n');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">서버 연결 방법 관리</h2>
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

export default ConnectionTab; 