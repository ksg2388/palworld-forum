"use client";

import { makeAuthorizedRequest } from "@/app/_utils/api";
import { API_BASE_URL } from "@/config/api";
import { useEffect, useState } from "react";

type TMember = {
  id: number;
  email: string;
  nickname: string;
  member_role:
    | "ADMIN"
    | "PARTNER"
    | "NORMAL"
    | "LEGENDARY"
    | "HEROIC"
    | "RARE"
    | "EXTRA_ORDINARY";
};

const MembersTab = () => {
  const [members, setMembers] = useState<TMember[]>([]);

  const MEMBER_ROLES = [
    { value: "NORMAL", label: "일반" },
    { value: "EXTRA_ORDINARY", label: "비범" },
    { value: "RARE", label: "희귀" },
    { value: "HEROIC", label: "영웅" },
    { value: "LEGENDARY", label: "전설" },
    { value: "PARTNER", label: "파트너" },
    { value: "ADMIN", label: "운영자" },
  ];

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

  const handleRoleChange = async (
    memberId: number,
    newRole: TMember["member_role"]
  ) => {
    try {
      const response = await makeAuthorizedRequest(
        `${API_BASE_URL}/admin/members/${memberId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            member_role: newRole,
          }),
        }
      );

      if (response.ok) {
        setMembers(
          members.map((member) =>
            member.id === memberId
              ? { ...member, member_role: newRole }
              : member
          )
        );
        alert("등급이 성공적으로 변경되었습니다.");
      } else {
        alert("등급 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("등급 변경 실패:", error);
      alert("등급 변경 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (member: TMember) => {
    if (member.member_role === "ADMIN") {
      alert("운영자는 삭제할 수 없습니다.");
      return;
    }

    if (window.confirm("정말로 이 회원을 삭제하시겠습니까?")) {
      try {
        const response = await makeAuthorizedRequest(
          `${API_BASE_URL}/admin/members/${member.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setMembers(members.filter((m) => m.id !== member.id));
          alert("회원이 성공적으로 삭제되었습니다.");
        } else {
          alert("회원 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("회원 삭제 실패:", error);
        alert("회원 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await makeAuthorizedRequest(
          `${API_BASE_URL}/admin/members`,
          {
            method: "GET",
          }
        );
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
      
      {/* 모바일 카드 뷰 */}
      <div className="block sm:hidden space-y-4">
        {members.map((member) => (
          <div key={member.email} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm text-gray-500 mb-1">{member.email}</div>
                <div className="font-medium text-gray-900">{member.nickname}</div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                member.member_role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {getMemberRoleText(member.member_role)}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex-1 mr-4">
                {member.member_role !== "ADMIN" && (
                  <select
                    value={member.member_role}
                    onChange={(e) =>
                      handleRoleChange(
                        member.id,
                        e.target.value as TMember["member_role"]
                      )
                    }
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  >
                    {MEMBER_ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {member.member_role !== "ADMIN" && (
                <button
                  onClick={() => handleDelete(member)}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors whitespace-nowrap"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 데스크톱 테이블 뷰 */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                이메일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                닉네임
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                등급
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.email}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {member.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {member.nickname}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {member.member_role === "ADMIN" ? (
                    getMemberRoleText(member.member_role)
                  ) : (
                    <select
                      value={member.member_role}
                      onChange={(e) =>
                        handleRoleChange(
                          member.id,
                          e.target.value as TMember["member_role"]
                        )
                      }
                      className="border rounded px-2 py-1"
                    >
                      {MEMBER_ROLES.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {member.member_role !== "ADMIN" && (
                    <button
                      onClick={() => handleDelete(member)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      삭제
                    </button>
                  )}
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
