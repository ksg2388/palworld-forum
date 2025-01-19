"use client";

import Image from "next/image";
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const BannerTab = () => {
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setBannerImages([...bannerImages, ...newImages]);
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
      const newImages = imageFiles.map(file => URL.createObjectURL(file));
      setBannerImages([...bannerImages, ...newImages]);
    }
  };

  const removeBannerImage = (index: number) => {
    setBannerImages(bannerImages.filter((_, i) => i !== index));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(bannerImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBannerImages(items);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">배너 이미지 관리</h2>
      <div 
        className={`mb-4 p-8 border-2 border-dashed rounded-lg text-center ${
          isDragging ? 'border-gray-800 bg-gray-100' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-gray-600 mb-4">이미지를 드래그하여 업로드하거나</p>
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
              {bannerImages.map((image, index) => (
                <Draggable key={image} draggableId={image} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative group ${snapshot.isDragging ? 'opacity-50' : ''}`}
                    >
                      <Image
                        src={image}
                        alt={`배너 이미지 ${index + 1}`}
                        width={400}
                        height={192}
                        className="w-full h-48 object-cover rounded-lg cursor-move"
                      />
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