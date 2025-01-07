"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

const SupportPage = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  console.log(selectedFiles);

  return (
    <div className="mt-[110px] w-full max-w-[1200px] mx-auto p-8">
      <div className="w-full flex items-center justify-center mt-8 mb-8">
        <h2 className="text-[36px] font-bold">1:1문의/신고</h2>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-white border border-gray-200 p-6">
            <div className="mb-[8px] text-[17px] font-bold text-gray-900">
              제목
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="제목을 입력해주세요."
                className="w-full p-2 border border-gray-300"
              />
            </div>
            <div className="mb-[8px] text-[17px] text-gray-900 font-bold">
              내용
            </div>
            <div className="mb-4">
              <textarea
                placeholder={`1. 문의/신고 내용을 상세히 작성해주세요.
2. 신고의 경우 신고 대상자의 닉네임과 신고 사유를 구체적으로 작성해주세요.
3. 스크린샷이 있다면 첨부해주시면 더욱 빠른 처리가 가능합니다.
4. 부적절한 신고나 허위 신고는 제재 대상이 될 수 있습니다.`}
                className="w-full h-[400px] p-2 border border-gray-300 resize-none"
              />
            </div>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="flex flex-wrap gap-2 mb-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative w-[100px] h-[100px]">
                    <Image
                      src={preview}
                      alt={`Preview ${index}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-1 border border-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                첨부파일
              </button>
              <button className="px-4 py-1 bg-white text-gray-800 border border-gray-300 ml-auto">
                취소
              </button>
              <button className="px-4 py-1 bg-gray-800 text-white ml-[4px]">
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
