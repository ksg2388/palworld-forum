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
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<Attachment[]>([]);

  const fetchFooter = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/footer`);
      const data = await response.json();

      if (data.http_status === "OK") {
        setFooterMessage(data.data.content);
        setExistingImages(data.data.attachments);
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

  useEffect(() => {
    fetchFooter();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && (imagePreview.length + files.length) <= 3) {
      try {
        for (let i = 0; i < files.length; i++) {
          const formData = new FormData();
          formData.append("attachment", files[i]);

          const response = await makeAuthorizedRequest(
            `${API_BASE_URL}/admin/footer`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            await fetchFooter(); // 이미지 업로드 후 데이터 다시 조회
          }
        }
        alert("이미지가 업로드되었습니다.");
      } catch (error) {
        console.error("이미지 업로드 중 오류가 발생했습니다:", error);
        alert("이미지 업로드에 실패했습니다.");
      }
    }
  };

  const removeImage = async (index: number) => {
    try {
      const imageToDelete = existingImages[index];
      const response = await makeAuthorizedRequest(
        `${API_BASE_URL}/admin/footer/${imageToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchFooter(); // 이미지 삭제 후 데이터 다시 조회
        alert("이미지가 삭제되었습니다.");
      }
    } catch (error) {
      console.error("이미지 삭제 중 오류가 발생했습니다:", error);
      alert("이미지 삭제에 실패했습니다.");
    }
  };

  const handleSaveMessage = async () => {
    try {
      const response = await makeAuthorizedRequest(
        `${API_BASE_URL}/admin/footer`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: footerMessage,
          }),
        }
      );

      if (response.ok) {
        alert("메시지가 저장되었습니다.");
      } else {
        throw new Error("메시지 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("메시지 저장 중 오류가 발생했습니다:", error);
      alert("메시지 저장 중 오류가 발생했습니다.");
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
              onClick={handleSaveMessage}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
            >
              메시지 저장
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">제휴업체 이미지 관리</h2>
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            {imagePreview.map((image, index) => (
              <div key={existingImages[index].id} className="relative">
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
