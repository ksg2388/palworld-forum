"use client";

import { makeAuthorizedRequest } from "@/app/_utils/api";
import { API_BASE_URL } from "@/config/api";
import { useEffect, useState } from "react";

type TLink = {
  link_type: "OPEN_CHAT_LINK" | "KOFIQA_OPEN_CHATTING_LINK" | "KOFIQA_SERVER_OCCUPANCY_MESSAGE" | "DISCORD" | "TRAILER_VIDEO";
  url: string;
};

type TBoardLink = {
  id: number;
  title: string;
  url: string;
};

const LinksTab = () => {
  const [boardLinks, setBoardLinks] = useState<TBoardLink[]>([]);
  const [links, setLinks] = useState<TLink[]>([]);

  const addBoardLink = async () => {
    const newLink: TBoardLink = {
      id: Date.now(), // 임시 ID로 타임스탬프 사용
      title: "",
      url: ""
    };
    setBoardLinks([...boardLinks, newLink]);
  };

  const saveBoardLink = async (id: number, title: string, url: string) => {
    try {
      await makeAuthorizedRequest(`${API_BASE_URL}/admin/integrated-links`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, title, url })
      });
    } catch (error) {
      console.error("통합게시판 링크 저장 실패:", error);
    }
  };

  const removeBoardLink = async (id: number) => {
    try {
      await makeAuthorizedRequest(`${API_BASE_URL}/admin/integrated-links/${id}`, {
        method: "DELETE"
      });
      setBoardLinks(boardLinks.filter((link) => link.id !== id));
    } catch (error) {
      console.error("통합게시판 링크 삭제 실패:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 일반 링크 데이터 가져오기
        const linksResponse = await makeAuthorizedRequest(`${API_BASE_URL}/admin/links`, {
          method: "GET"
        });
        const linksData = await linksResponse.json();
        setLinks(linksData.data);

        // 통합게시판 링크 데이터 가져오기
        const boardLinksResponse = await makeAuthorizedRequest(`${API_BASE_URL}/admin/integrated-links`, {
          method: "GET"
        });
        const boardLinksData = await boardLinksResponse.json();
        setBoardLinks(boardLinksData.data);
      } catch (error) {
        console.error("데이터 조회 실패:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">링크 관리</h2>
      <div className="grid gap-4">
        {[
          { label: "전체 오픈채팅 링크", type: "OPEN_CHAT_LINK" },
          { label: "KOFIQA 서버 입주 메시지", type: "KOFIQA_SERVER_OCCUPANCY_MESSAGE" },
          { label: "KOFIQA 오픈채팅 링크", type: "KOFIQA_OPEN_CHATTING_LINK" },
          { label: "디스코드 링크", type: "DISCORD" },
          { label: "트레일러 비디오", type: "TRAILER_VIDEO" },
        ].map(({ label, type }) => (
          <div key={label} className="flex items-center gap-4">
            <span className="min-w-[200px] text-sm font-medium">{label}</span>
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder={`${label} 입력`}
              value={links.find(link => link.link_type === type)?.url || ""}
            />
            <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
              저장
            </button>
          </div>
        ))}

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">통합게시판 링크</h3>
            <button
              onClick={addBoardLink}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
            >
              링크 추가
            </button>
          </div>
          {boardLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-4 mb-4">
              <input
                type="text"
                className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                placeholder="이름 입력"
                value={link.title}
                onChange={(e) => {
                  const newLinks = boardLinks.map((l) =>
                    l.id === link.id ? { ...l, title: e.target.value } : l
                  );
                  setBoardLinks(newLinks);
                }}
              />
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                placeholder="통합게시판 링크 입력"
                value={link.url}
                onChange={(e) => {
                  const newLinks = boardLinks.map((l) =>
                    l.id === link.id ? { ...l, url: e.target.value } : l
                  );
                  setBoardLinks(newLinks);
                }}
              />
              <button
                onClick={() => removeBoardLink(link.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                삭제
              </button>
              <button 
                onClick={() => saveBoardLink(link.id, link.title, link.url)}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
              >
                저장
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinksTab;
