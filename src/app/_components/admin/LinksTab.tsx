"use client";

import { makeAuthorizedRequest } from "@/app/_utils/api";
import { API_BASE_URL } from "@/config/api";
import { useEffect, useState } from "react";

type TLink = {
  link_type: "OPEN_CHAT_LINK" | "KOFIQA_OPEN_CHATTING_LINK" | "KOFIQA_SERVER_OCCUPANCY_MESSAGE" | "DISCORD" | "TRAILER_VIDEO";
  url: string;
};

type TBoardLink = {
  id: number | null;
  title: string;
  url: string;
};

const LinksTab = () => {
  const [boardLinks, setBoardLinks] = useState<TBoardLink[]>([]);
  const [links, setLinks] = useState<TLink[]>([]);

  const addBoardLink = async () => {
    const newLink: TBoardLink = {
      id: null,
      title: "",
      url: ""
    };
    setBoardLinks([...boardLinks, newLink]);
  };

  const updateLink = async (type: string, url: string) => {
    try {
      await makeAuthorizedRequest(`${API_BASE_URL}/admin/links`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ link_type: type, url })
      });

      const newLinks = links.map(link => 
        link.link_type === type ? { ...link, url } : link
      );
      setLinks(newLinks);
      alert("링크가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("링크 수정 실패:", error);
      alert("링크 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const saveBoardLink = async (id: number | null, title: string, url: string) => {
    try {
      const requestBody = id ? { id, title, url } : { title, url };
      
      await makeAuthorizedRequest(`${API_BASE_URL}/admin/integrated-links`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      alert("통합게시판 링크가 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("통합게시판 링크 저장 실패:", error);
      alert("통합게시판 링크 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const removeBoardLink = async (id: number | null) => {
    if (!id) {
      setBoardLinks(boardLinks.filter((link) => link.id !== id));
      return;
    }
    
    try {
      await makeAuthorizedRequest(`${API_BASE_URL}/admin/integrated-links/${id}`, {
        method: "DELETE"
      });
      setBoardLinks(boardLinks.filter((link) => link.id !== id));
      alert("통합게시판 링크가 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("통합게시판 링크 삭제 실패:", error);
      alert("통합게시판 링크 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const linksResponse = await makeAuthorizedRequest(`${API_BASE_URL}/admin/links`, {
          method: "GET"
        });
        const linksData = await linksResponse.json();
        setLinks(linksData.data);

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
          { label: "전체 오픈채팅 링크", type: "OPEN_CHATTING_LINK" },
          { label: "KOFIQA 서버 입주 메시지", type: "KOFIQA_SERVER_OCCUPANCY_MESSAGE" },
          { label: "KOFIQA 오픈채팅 링크", type: "KOFIQA_OPEN_CHATTING_LINK" },
          { label: "디스코드 링크", type: "DISCORD" },
          { label: "트레일러 비디오", type: "TRAILER_VIDEO" },
        ].map(({ label, type }) => {
          const link = links.find(link => link.link_type === type);
          return (
            <div key={label} className="flex items-center gap-4">
              <span className="min-w-[200px] text-sm font-medium">{label}</span>
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                placeholder={`${label} 입력`}
                value={link?.url || ""}
                onChange={(e) => {
                  const newLinks = links.map(l => 
                    l.link_type === type ? { ...l, url: e.target.value } : l
                  );
                  setLinks(newLinks);
                }}
              />
              <button 
                onClick={() => updateLink(type, link?.url || "")}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
              >
                저장
              </button>
            </div>
          );
        })}

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
