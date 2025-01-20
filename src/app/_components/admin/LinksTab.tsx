"use client";

import { useState } from "react";

const LinksTab = () => {
  const [boardLinks, setBoardLinks] = useState([
    { id: 1, name: "", value: "" },
  ]);

  const addBoardLink = () => {
    setBoardLinks([...boardLinks, { id: Date.now(), name: "", value: "" }]);
  };

  const removeBoardLink = (id: number) => {
    setBoardLinks(boardLinks.filter((link) => link.id !== id));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">링크 관리</h2>
      <div className="grid gap-4">
        {[
          "전체 오픈채팅 링크",
          "KOFIQA 서버 입주 메시지",
          "KOFIQA 채팅 비밀번호",
          "디스코드 링크",
          "트레일러 비디오",
        ].map((item) => (
          <div key={item} className="flex items-center gap-4">
            <span className="min-w-[200px] text-sm font-medium">{item}</span>
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder={`${item} 입력`}
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
                value={link.name}
                onChange={(e) => {
                  const newLinks = boardLinks.map((l) =>
                    l.id === link.id ? { ...l, name: e.target.value } : l
                  );
                  setBoardLinks(newLinks);
                }}
              />
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                placeholder="통합게시판 링크 입력"
                value={link.value}
                onChange={(e) => {
                  const newLinks = boardLinks.map((l) =>
                    l.id === link.id ? { ...l, value: e.target.value } : l
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
              <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
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
