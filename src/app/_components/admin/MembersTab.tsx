"use client";

import { makeAuthorizedRequest } from "@/app/_utils/api";
import { API_BASE_URL } from "@/config/api";
import { useEffect, useState } from "react";

type TMember = {
  email: string;
  nickname: string;
  member_role: "ADMIN" | "PARTNER" | "NORMAL" | "LEGENDARY" | "HEROIC" | "RARE" | "EXTRA_ORDINARY";
};

const MembersTab = () => {
  const [members, setMembers] = useState<TMember[]>([]);

  const getMemberRoleText = (role: TMember["member_role"]) => {
    switch (role) {
      case "ADMIN":
        return "운영자";
      case "PARTNER":
        return "파트너";
      case "LEGENDARY":
        return "전설";
      case "HEROIC":
        return "영웅";
      case "RARE":
        return "희귀";
      case "EXTRA_ORDINARY":
        return "비범";
      case "NORMAL":
        return "일반";
      default:
        return role;
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await makeAuthorizedRequest(`${API_BASE_URL}/admin/members`, {
          method: "GET"
        });
        const data = await response.json();
        setMembers(data.data);
      } catch (error) {
        console.error("회원 목록 조회 실패:", error);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">회원 관리</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">닉네임</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">등급</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.email}>
                <td className="px-6 py-4 text-sm text-gray-900">{member.email}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{member.nickname}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{getMemberRoleText(member.member_role)}</td>
                <td className="px-6 py-4 text-sm">
                  <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersTab;