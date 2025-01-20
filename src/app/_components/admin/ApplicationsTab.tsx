"use client";

import { useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import ContentEditor from "../common/ContentEditor";

interface Application {
  id: number;
  content: string;
}

const ApplicationsTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      content:
        "<h3>서버 입주 신청 방법</h3><p>서버 입주를 원하시는 분들은 다음 절차를 따라주세요.</p>",
    },
    {
      id: 2,
      content: "<h3>신청 자격</h3><p>만 18세 이상의 마인크래프트 정품 유저</p>",
    },
    {
      id: 3,
      content:
        "<h3>신청서 작성</h3><p>디스코드 채널에서 신청서 양식을 작성해 주세요.</p>",
    },
  ]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (content: string) => {
    // 여기서 전체 입주신청 내용을 저장하는 로직 구현
    setIsEditing(false);
  };

  const combinedContent = applications.map((app) => app.content).join("\n");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">서버 입주신청 관리</h2>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
          >
            수정
          </button>
        )}
      </div>

      <ContentEditor
        isEditing={isEditing}
        content={combinedContent}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    </div>
  );
};

export default ApplicationsTab;
