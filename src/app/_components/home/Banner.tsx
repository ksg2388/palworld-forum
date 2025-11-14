"use client";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";

interface BannerImage {
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

const Banner = () => {
  const [images, setImages] = useState<BannerImage[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/banners`);
        const data = await response.json();

        if (data.http_status === "OK") {
          setImages(data.data);
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
            <Link
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <Image
                src={`${API_BASE_URL}/attachments/${image.attachment?.file_name}`}
                alt={`banner-${image.id}`}
                fill
                className="object-contain cursor-pointer"
                sizes="100vw"
                priority
              />
            </Link>
          </div>
        ))}
      </Slider>

      <style jsx global>{`
        .slick-prev,
        .slick-next {
          z-index: 10;
          width: 24px;
          height: 24px;
        }
        @media (min-width: 640px) {
          .slick-prev,
          .slick-next {
            width: 30px;
            height: 30px;
          }
        }
        .slick-prev {
          left: 5px;
        }
        @media (min-width: 640px) {
          .slick-prev {
            left: 10px;
          }
        }
        .slick-next {
          right: 5px;
        }
        @media (min-width: 640px) {
          .slick-next {
            right: 10px;
          }
        }
        .slick-prev:before,
        .slick-next:before {
          font-size: 24px;
        }
        @media (min-width: 640px) {
          .slick-prev:before,
          .slick-next:before {
            font-size: 30px;
          }
        }
        .slick-list {
          height: 100%;
        }
        .slick-dots {
          bottom: 10px;
        }
        @media (min-width: 640px) {
          .slick-dots {
            bottom: 20px;
          }
        }
        .slick-dots li button:before {
          font-size: 10px;
        }
        @media (min-width: 640px) {
          .slick-dots li button:before {
            font-size: 12px;
          }
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
