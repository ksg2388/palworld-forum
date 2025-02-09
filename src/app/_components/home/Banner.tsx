"use client";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { API_BASE_URL } from "@/config/api";

interface BannerImage {
  id: number;
  file_name: string;
}

const Banner = () => {
  const [images, setImages] = useState<BannerImage[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/banner`);
        const data = await response.json();

        if (data.http_status === "OK") {
          setImages(data.data.attachments);
        }
      } catch (error) {
        console.error("배너 이미지 로딩 실패:", error);
      }
    };

    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3500,
  };

  return (
    <div className="relative w-full h-full">
      <Slider {...settings} className="w-full h-full">
        {images.map((image) => (
          <div key={image.id} className="w-full h-full relative">
            <Image
              src={`${API_BASE_URL}/attachments/${image.file_name}`}
              alt={`banner-${image.id}`}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        ))}
      </Slider>

      <style jsx global>{`
        .slick-prev,
        .slick-next {
          z-index: 10;
          width: 30px;
          height: 30px;
        }
        .slick-prev {
          left: 10px;
        }
        .slick-next {
          right: 10px;
        }
        .slick-prev:before,
        .slick-next:before {
          font-size: 30px;
        }
        .slick-list {
          height: 100%;
        }
        .slick-dots {
          bottom: 20px;
        }
        .slick-dots li button:before {
          font-size: 12px;
        }
        .slick-track {
          height: 100%;
        }
        .slick-slide {
          height: 100%;

          div {
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Banner;
