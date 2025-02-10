"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/config/api";
import { makeAuthorizedRequest } from "@/app/_utils/api";

interface Attachment {
  id: number;
  file_name: string;
  file_path: string;
}

const FooterTab = () => {
  const [footerMessage, setFooterMessage] = useState("");
  const [partnerImages, setPartnerImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/footer`);
        const data = await response.json();

        if (data.http_status === "OK") {
          setFooterMessage(data.data.content);
          const previews = data.data.attachments.map(
            (attachment: Attachment) =>
              `${API_BASE_URL}/attachments/${attachment.file_name}`
          );
          setImagePreview(previews);
        }
      } catch (error) {
        console.error("푸터 정보를 불러오는데 실패했습니다:", error);
      }
    };

    fetchFooter();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && partnerImages.length < 3) {
      const newFiles = Array.from(files).slice(0, 3 - partnerImages.length);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      setPartnerImages([...partnerImages, ...newFiles]);
      setImagePreview([...imagePreview, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setPartnerImages(partnerImages.filter((_, i) => i !== index));
    setImagePreview(imagePreview.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      const data = {
        content: footerMessage,
      };

      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });

      formData.append("data", blob);

      partnerImages.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await makeAuthorizedRequest(
        `${API_BASE_URL}/admin/footer`,
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
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">푸터 메시지 관리</h2>
        <div className="space-y-4">
          <textarea
            value={footerMessage}
            onChange={(e) => {
              if (e.target.value.length <= 200) {
                setFooterMessage(e.target.value);
              }
            }}
            placeholder="푸터에 표시할 메시지를 입력해주세요 (200자 이내)"
            className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none"
            maxLength={200}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {footerMessage.length}/200자
            </span>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
            >
              저장
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">제휴업체 이미지 관리</h2>
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            {imagePreview.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image}
                  alt={`제휴업체 이미지 ${index + 1}`}
                  width={200}
                  height={100}
                  className="rounded-md object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {imagePreview.length < 3 && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="partner-image-upload"
              />
              <label
                htmlFor="partner-image-upload"
                className="inline-block px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 cursor-pointer"
              >
                이미지 추가 ({imagePreview.length}/3)
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FooterTab;
