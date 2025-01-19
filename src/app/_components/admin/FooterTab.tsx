"use client";

import { useState } from 'react';
import Image from 'next/image';

const FooterTab = () => {
  const [footerMessage, setFooterMessage] = useState('');
  const [partnerImages, setPartnerImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && partnerImages.length < 3) {
      const newImages = Array.from(files).slice(0, 3 - partnerImages.length).map(file => URL.createObjectURL(file));
      setPartnerImages([...partnerImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setPartnerImages(partnerImages.filter((_, i) => i !== index));
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
            <span className="text-sm text-gray-500">{footerMessage.length}/200자</span>
            <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
              저장
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">제휴업체 이미지 관리</h2>
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            {partnerImages.map((image, index) => (
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
          {partnerImages.length < 3 && (
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
                이미지 추가 ({partnerImages.length}/3)
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FooterTab;