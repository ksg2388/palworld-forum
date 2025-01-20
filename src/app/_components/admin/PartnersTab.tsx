"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";

interface Partner {
  id: number;
  name: string;
  image: File | null;
  imagePreview?: string;
}

const PartnersTab = () => {
  const [partners, setPartners] = useState<Partner[]>([
    { id: 1, name: "", image: null },
  ]);

  const addPartner = () => {
    setPartners([...partners, { id: Date.now(), name: "", image: null }]);
  };

  const removePartner = (id: number) => {
    setPartners(partners.filter((partner) => partner.id !== id));
  };

  const handleImageChange = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imagePreview = URL.createObjectURL(file);

      const newPartners = partners.map((p) =>
        p.id === id ? { ...p, image: file, imagePreview } : p
      );
      setPartners(newPartners);
    }
  };

  const handleSave = async (partner: Partner) => {
    if (!partner.image || !partner.name) {
      alert("업체명과 이미지를 모두 입력해주세요.");
      return;
    }

    // TODO: API 연동 - FormData를 사용하여 이미지와 데이터 전송
    const formData = new FormData();
    formData.append("name", partner.name);
    formData.append("image", partner.image);

    try {
      // const response = await fetch("/api/partners", {
      //   method: "POST",
      //   body: formData,
      // });
      alert("저장되었습니다.");
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
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="p-6 border border-gray-200 rounded-lg space-y-4"
          >
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                placeholder="업체명 입력"
                value={partner.name}
                onChange={(e) => {
                  const newPartners = partners.map((p) =>
                    p.id === partner.id ? { ...p, name: e.target.value } : p
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
                    onChange={(e) => handleImageChange(partner.id, e)}
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
              <button
                onClick={() => removePartner(partner.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                삭제
              </button>
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
