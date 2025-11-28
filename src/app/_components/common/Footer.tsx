"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "@/config/api";

interface Attachment {
  id: number;
  file_name: string;
  file_path: string;
}

const Footer = () => {
  const [footerMessage, setFooterMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/footer`);
        const data = await response.json();

        if (data.http_status === "OK") {
          setFooterMessage(data.data.content);
          setAttachments(data.data.attachments);
        }
      } catch (error) {
        console.error("푸터 정보를 불러오는데 실패했습니다:", error);
      }
    };

    fetchFooter();
  }, []);

  return (
    <footer className="w-full bg-gray-800 text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-4 h-full flex flex-col justify-between py-8 sm:py-10 lg:py-8">
        <div className="flex flex-col lg:flex-row items-end lg:items-start gap-8 sm:gap-10 lg:gap-12 text-right lg:text-left">
          <div className="flex-shrink-0">
            <Link href="/" className="w-[119px] h-[32px] relative block">
              <div className="w-[80px] h-[80px] relative ml-auto lg:mx-0">
                <Image
                  src="/images/ic-footer-logo.png"
                  alt="logo"
                  fill
                  className="brightness-0 invert object-contain"
                />
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 flex-1 min-w-0 w-full">
            <div className="flex flex-col gap-2 items-end lg:items-start">
              <p className="text-gray-400 text-sm max-w-full lg:max-w-[600px] leading-relaxed">
                {footerMessage}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm max-w-full lg:max-w-[600px]">
                © 2024 Palworld Community. All rights reserved.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-end lg:justify-start gap-3 sm:gap-4 flex-shrink-0 w-full lg:w-auto">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="w-[140px] h-[40px] sm:w-[160px] sm:h-[45px] lg:w-[190px] lg:h-[50px] relative grayscale hover:grayscale-0 transition-all duration-300">
                <Image
                  src={`${API_BASE_URL}/attachments/${attachment.file_name}`}
                  alt={`footer image ${attachment.id}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
