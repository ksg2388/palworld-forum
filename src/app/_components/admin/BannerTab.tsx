"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { makeAuthorizedRequest } from "@/app/_utils/api";
import { API_BASE_URL } from "@/config/api";

interface BannerImage {
  imageUrl: string;
  link: string;
  file?: File;
}

const BannerTab = () => {
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [tempLink, setTempLink] = useState("");

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await makeAuthorizedRequest(
          `${API_BASE_URL}/admin/banner`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (data.http_status === "OK") {
          setBannerImages(data.data.content.map((banner: any) => ({
            imageUrl: `${API_BASE_URL}/${banner.imageUrl}`,
            link: banner.link
          })));
        }
      } catch (error) {
        console.error("배너 이미지 조회 실패:", error);
      }
    };

    fetchBanners();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => ({
        imageUrl: URL.createObjectURL(file),
        link: tempLink,
        file: file
      }));
      setBannerImages([...bannerImages, ...newImages]);
      setTempLink("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      const newImages = imageFiles.map(file => ({
        imageUrl: URL.createObjectURL(file),
        link: tempLink,
        file: file
      }));
      setBannerImages([...bannerImages, ...newImages]);
      setTempLink("");
    }
  };

  const removeBannerImage = (index: number) => {
    setBannerImages(bannerImages.filter((_, i) => i !== index));
  };

  const updateBannerLink = (index: number, newLink: string) => {
    const updatedBanners = [...bannerImages];
    updatedBanners[index] = {
      ...updatedBanners[index],
      link: newLink,
    };
    setBannerImages(updatedBanners);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(bannerImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBannerImages(items);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      
      const content = bannerImages.map(banner => ({
        link: banner.link
      }));
      
      formData.append('content', JSON.stringify(content));
      
      bannerImages.forEach((banner, index) => {
        if (banner.file) {
          formData.append('attachments', banner.file);
        }
      });

      const response = await makeAuthorizedRequest(`${API_BASE_URL}/admin/banner`, {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();

      if (data.http_status === "ACCEPTED") {
        alert("배너 이미지가 성공적으로 저장되었습니다.");
      } else {
        alert("배너 이미지 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("배너 이미지 저장 실패:", error);
      alert("배너 이미지 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">배너 이미지 관리</h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          저장
        </button>
      </div>
      <div
        className={`mb-4 p-8 border-2 border-dashed rounded-lg text-center ${
          isDragging ? "border-gray-800 bg-gray-100" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-gray-600 mb-4">이미지를 드래그하여 업로드하거나</p>
        <div className="mb-4">
          <input
            type="text"
            value={tempLink}
            onChange={(e) => setTempLink(e.target.value)}
            placeholder="배너 클릭시 이동할 링크를 입력하세요"
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
          />
        </div>
        <label className="inline-block px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 cursor-pointer">
          이미지 업로드
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="bannerImages" direction="horizontal">
          {(provided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {bannerImages.map((banner, index) => (
                <Draggable
                  key={banner.imageUrl}
                  draggableId={banner.imageUrl}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative group space-y-2 ${
                        snapshot.isDragging ? "opacity-50" : ""
                      }`}
                    >
                      <Image
                        src={banner.imageUrl}
                        alt={`배너 이미지 ${index + 1}`}
                        width={400}
                        height={192}
                        className="w-full h-48 object-cover rounded-lg cursor-move"
                      />
                      <div className="mt-2">
                        <input
                          type="text"
                          value={banner.link}
                          onChange={(e) =>
                            updateBannerLink(index, e.target.value)
                          }
                          placeholder="링크 입력"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <button
                        onClick={() => removeBannerImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default BannerTab;
