"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/config/api";
import { makeAuthorizedRequest } from "@/app/_utils/api";
interface Partner {
  id?: number;
  name: string;
  image: File | null;
  imagePreview?: string;
  link?: string;
  attachment?: {
    id: number;
    file_name: string;
    file_path: string;
  };
}

const PartnersTab = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/coalitions`);
        const data = await response.json();

        if (data.http_status === "OK") {
          const initialPartners = data.data.map((partner: Partner) => ({
            id: partner.id,
            name: partner.name,
            image: null,
            imagePreview: partner.attachment
              ? `${API_BASE_URL}/attachments/${partner.attachment.file_name}`
              : undefined,
            link: partner.attachment?.file_path || "",
            attachment: partner.attachment,
          }));
          setPartners(initialPartners);
        }
      } catch (error) {
        console.error("제휴 업체 목록을 불러오는데 실패했습니다:", error);
      }
    };

    fetchPartners();
  }, []);

  const addPartner = () => {
    setPartners([...partners, { name: "", image: null, link: "" }]);
  };

  const removePartner = async (id: number) => {
    try {
      const response = await makeAuthorizedRequest(
        `${API_BASE_URL}/admin/coalitions/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setPartners(partners.filter((partner) => partner.id !== id));
        alert("삭제되었습니다.");
      } else {
        throw new Error("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 중 오류가 발생했습니다:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleImageChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imagePreview = URL.createObjectURL(file);

      const newPartners = partners.map((p, i) =>
        i === index ? { ...p, image: file, imagePreview } : p
      );
      setPartners(newPartners);
    }
  };

  const handleSave = async (partner: Partner) => {
    if (!partner.name) {
      alert("업체명을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    const data: { name: string; id?: number; link?: string } = {
      name: partner.name,
      link: partner.link,
    };

    // 기존 업체 수정 시에만 id 포함
    if (partner.id) {
      data.id = partner.id;
    }

    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });

    formData.append("data", blob);

    if (partner.image) {
      formData.append("attachment", partner.image);
    }

    try {
      const response = await makeAuthorizedRequest(
        `${API_BASE_URL}/admin/coalitions`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (response.ok) {
        alert("저장되었습니다.");
      } else {
        throw new Error("저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("저장 중 오류가 발생했습니다:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">제휴업체 배너 관리</h2>
        <button
          onClick={addPartner}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
        >
          업체 추가
        </button>
      </div>

      <div className="grid gap-8">
        {partners.map((partner, index) => (
          <div
            key={partner.id || index}
            className="p-6 border border-gray-200 rounded-lg space-y-4"
          >
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                placeholder="업체명 입력"
                value={partner.name}
                onChange={(e) => {
                  const newPartners = partners.map((p, i) =>
                    i === index ? { ...p, name: e.target.value } : p
                  );
                  setPartners(newPartners);
                }}
              />
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                placeholder="파워링크 URL 입력"
                value={partner.link}
                onChange={(e) => {
                  const newPartners = partners.map((p, i) =>
                    i === index ? { ...p, link: e.target.value } : p
                  );
                  setPartners(newPartners);
                }}
              />
              <div className="flex-1">
                <label className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200">
                  이미지 선택
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e)}
                  />
                </label>
              </div>
            </div>

            {partner.imagePreview && (
              <div className="relative w-full h-[200px]">
                <Image
                  src={partner.imagePreview}
                  alt={partner.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <div className="flex justify-end gap-4">
              {partner.id && (
                <button
                  onClick={() => removePartner(partner.id!)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  삭제
                </button>
              )}
              <button
                onClick={() => handleSave(partner)}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
              >
                저장
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersTab;
