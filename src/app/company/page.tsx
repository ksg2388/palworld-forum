"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";

interface Attachment {
  id: number;
  author: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
}

interface Partner {
  id: number;
  name: string;
  url: string;
  attachment: Attachment;
}

interface ApiResponse {
  http_status: string;
  message: string;
  data: Partner[];
}

const CompanyPage = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/coalitions`);
        const data: ApiResponse = await response.json();

        if (data.http_status === "OK") {
          setPartners(data.data);
        }
      } catch (error) {
        console.error("제휴 업체 목록을 불러오는데 실패했습니다:", error);
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className="mt-[80px] lg:mt-[110px] w-full">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:p-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">제휴 파트너사</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {partners.map((partner) => (
            <Link
              key={partner.id}
              href={partner.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 sm:p-5 lg:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 hover:border-gray-300"
            >
              <div className="aspect-video relative mb-3 sm:mb-4">
                <Image
                  src={`${API_BASE_URL}/attachments/${partner.attachment.file_name}`}
                  alt={`${partner.name} 로고`}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-center">
                {partner.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
