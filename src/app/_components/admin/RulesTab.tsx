"use client";

import { useState, useRef, useEffect } from 'react';
import QuillView from '../editor/QuillView';
import QuillEditor from '../editor/QuillEditor';
import { API_BASE_URL } from '@/config/api';
import { makeAuthorizedRequest } from '@/app/_utils/api';

const RulesTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await makeAuthorizedRequest(
          `${API_BASE_URL}/admin/rule`,
          {
            method: 'GET'
          }
        );
        const data = await response.json();
        if (data.http_status === "OK") {
          setContent(data.data.content);
        }
      } catch (error) {
        console.error("서버 규칙 조회 실패:", error);
      }
    };

    fetchContent();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const content = editorRef.current?.value;

    if (!content?.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const response = await makeAuthorizedRequest(
        `${API_BASE_URL}/admin/rule`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: content
          })
        }
      );

      const data = await response.json();

      if (data.http_status === "ACCEPTED") {
        alert("서버 규칙이 수정되었습니다.");
        setIsEditing(false);
        setContent(content);
      } else {
        alert("서버 규칙 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("서버 규칙 수정 실패:", error);
      alert("서버 규칙 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

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
            <QuillEditor ref={editorRef} initialValue={content} />
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
          <QuillView content={content} />
        )}
      </div>
    </div>
  );
};

export default RulesTab;