"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/config/api";
import { makeAuthorizedRequest } from "@/app/_utils/api";

interface Banner {
  id?: number;
  name: string;
  image: File | null;
  imagePreview?: string;
  url: string;
  attachment?: {
    id: number;
    file_name: string;
    file_path: string;
  };
}

const BannerTab = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/banners`);
        const data = await response.json();

        if (data.http_status === "OK") {
          setBanners(data.data);
        }
      } catch (error) {
        console.error("배너 목록을 불러오는데 실패했습니다:", error);
      }
    };

    fetchBanners();
  }, []);

  const addBanner = () => {
    setBanners([...banners, { name: "", image: null, url: "" }]);
  };

  const removeBanner = async (id: number) => {
    try {
      const response = await makeAuthorizedRequest(
        `${API_BASE_URL}/admin/banners/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setBanners(banners.filter((banner) => banner.id !== id));
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

      const newBanners = banners.map((b, i) =>
        i === index ? { ...b, image: file, imagePreview } : b
      );
      setBanners(newBanners);
    }
  };

  const handleSave = async (banner: Banner) => {
    if (!banner.name) {
      alert("배너명을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    const data: { name: string; id?: number; url?: string } = {
      name: banner.name,
      url: banner.url,
    };

    if (banner.id) {
      data.id = banner.id;
    }

    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });

    formData.append("data", blob);

    if (banner.image) {
      formData.append("attachment", banner.image);
    }

    try {
      const response = await makeAuthorizedRequest(
        `${API_BASE_URL}/admin/banners`,
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
        <h2 className="text-xl font-bold">배너 이미지 관리</h2>
        <button
          onClick={addBanner}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
        >
          배너 추가
        </button>
      </div>

      <div className="grid gap-8">
        {banners.map((banner, index) => (
          <div
            key={banner.id || index}
            className="p-6 border border-gray-200 rounded-lg space-y-4"
          >
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                placeholder="배너명 입력"
                value={banner.name}
                onChange={(e) => {
                  const newBanners = banners.map((b, i) =>
                    i === index ? { ...b, name: e.target.value } : b
                  );
                  setBanners(newBanners);
                }}
              />
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                placeholder="배너 URL 입력"
                value={banner.url}
                onChange={(e) => {
                  const newBanners = banners.map((b, i) =>
                    i === index ? { ...b, url: e.target.value } : b
                  );
                  setBanners(newBanners);
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

            {banner.imagePreview && (
              <div className="relative w-full h-[200px]">
                <Image
                  src={banner.imagePreview}
                  alt={banner.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <div className="flex justify-end gap-4">
              {banner.id && (
                <button
                  onClick={() => removeBanner(banner.id!)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  삭제
                </button>
              )}
              <button
                onClick={() => handleSave(banner)}
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

export default BannerTab;
