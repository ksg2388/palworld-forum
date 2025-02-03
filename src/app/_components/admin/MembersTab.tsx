"use client";

import { makeAuthorizedRequest } from "@/app/_utils/api";
import { useEffect, useState } from "react";


const MembersTab = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await makeAuthorizedRequest("/admin/members", {
          method: "GET"
        });
        const data = await response.json();
        console.log("회원 목록 조회 결과:", data);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가입일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* 회원 목록이 여기에 들어갑니다 */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersTab;