"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api";
import useUserStore from "../_store/userSotre";
import { makeAuthorizedRequest } from "../_utils/api";

interface UpdateResponse {
  http_status: string;
  message: string;
  data: {
    email: string;
    nickname: string;
    member_role: string;
  }
}

const MyPage = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("현재닉네임");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const {  user, setUser, logout } = useUserStore();

  const dummyPosts = [
    { id: 1, title: "게시글 제목 1", date: "2024.01.20", views: 100 },
    { id: 2, title: "게시글 제목 2", date: "2024.01.19", views: 85 },
    { id: 3, title: "게시글 제목 3", date: "2024.01.18", views: 120 },
  ];

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await makeAuthorizedRequest(`${API_BASE_URL}/members`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
          nickname: ""
        })
      });

      const data: UpdateResponse = await response.json();

      setUser({
        email: data.data.email,
        nickname: data.data.nickname,
        member_role: data.data.member_role
      });

      alert("비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "비밀번호 변경에 실패했습니다.");
    }
  };

  const handleNicknameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await makeAuthorizedRequest(`${API_BASE_URL}/members`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "",
          nickname: nickname
        })
      });

      const data: UpdateResponse = await response.json();

      setUser({
        email: data.data.email,
        nickname: data.data.nickname,
        member_role: data.data.member_role
      });

      alert("닉네임이 변경되었습니다.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "닉네임 변경에 실패했습니다.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("정말로 탈퇴하시겠습니까?")) {
      try {
        await makeAuthorizedRequest(`${API_BASE_URL}/members`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          }
        });

        alert("회원 탈퇴가 완료되었습니다.");
        logout();
        router.push("/");
      } catch (err) {
        alert(err instanceof Error ? err.message : "회원 탈퇴에 실패했습니다.");
      }
    }
  };

  useEffect(() => {
    setNickname(user?.nickname || "");
  }, [user]);

  // 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = dummyPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(dummyPosts.length / postsPerPage);

  return (
    <div className="min-h-[calc(100vh-262px)] mt-[110px] max-w-[1200px] mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">비밀번호 변경</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="password"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
              <button
                type="submit"
                className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                변경하기
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">닉네임 변경</h2>
            <form onSubmit={handleNicknameChange} className="space-y-4">
              <input
                type="text"
                placeholder="새 닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
              <button
                type="submit"
                className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                변경하기
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow h-[306px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">작성한 게시글</h2>
            <div className="space-y-2">
              {currentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                >
                  <span className="flex-1 truncate">{post.title}</span>
                  <span className="text-sm text-gray-500 ml-4">
                    {post.date}
                  </span>
                  <span className="text-sm text-gray-500 ml-4">
                    조회 {post.views}
                  </span>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow h-[190px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">회원 탈퇴</h2>
            <p className="text-gray-600 mb-4">
              탈퇴하시면 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
