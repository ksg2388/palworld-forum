"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomAlert from "@/app/_components/common/CustomAlert";
import { API_BASE_URL } from "@/config/api";
import QuillView from "@/app/_components/editor/QuillView";

const ApplyPage = () => {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [ruleContent, setRuleContent] = useState("");
  const [serverLink, setServerLink] = useState("");
  const [chatLink, setChatLink] = useState("");

  useEffect(() => {
    const fetchRuleInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/rule`);
        const data = await response.json();

        if (data.http_status === "OK") {
          setRuleContent(data.data.content);
        }
      } catch (error) {
        console.error("서버 규칙을 불러오는데 실패했습니다:", error);
      }
    };

    const fetchLinks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/links`);
        const data = await response.json();

        if (data.http_status === "OK") {
          const server = data.data.find(
            (link: { link_type: string }) =>
              link.link_type === "KOFIQA_SERVER_OCCUPANCY_MESSAGE"
          );
          const chat = data.data.find(
            (link: { link_type: string }) =>
              link.link_type === "KOFIQA_OPEN_CHATTING_LINK"
          );
          if (server) {
            setServerLink(server.url);
          }
          if (chat) {
            setChatLink(chat.url);
          }
        }
      } catch (error) {
        console.error("링크를 불러오는데 실패했습니다:", error);
      }
    };

    fetchRuleInfo();
    fetchLinks();
  }, []);

  const handleAgree = () => {
    if (agreed) {
      setShowAlert(true);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    router.push("/");
  };

  const handleChatLinkClick = () => {
    window.open(chatLink, "_blank");
  };

  return (
    <div className="mt-[80px] lg:mt-[110px] max-w-[1200px] mx-auto p-8">
      <CustomAlert
        isOpen={showAlert}
        message={`서버 입주 신청이 완료되었습니다.\n${serverLink}\n`}
        onClose={handleAlertClose}
        additionalButton={{
          text: "오픈채팅 바로가기",
          onClick: handleChatLinkClick,
        }}
      />
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-6">서버 이용 약관</h1>
        <QuillView content={ruleContent} />
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="agree">위 약관에 동의합니다.</label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAgree}
              className={`px-4 py-2 rounded ${
                agreed
                  ? "bg-gray-800 text-white hover:bg-gray-900"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              입주 신청하기
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
