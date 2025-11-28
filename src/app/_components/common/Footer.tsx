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
    <footer className="w-full bg-gray-800 text-white border-t border-gray-700">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-4 h-full flex flex-col justify-between py-10 sm:py-12 lg:py-10">
        <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-10 lg:gap-12 text-left">
          <div className="flex-shrink-0">
            <Link href="/" className="block w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] relative opacity-80 hover:opacity-100 transition-opacity">
              <Image
                src="/images/ic-footer-logo.png"
                alt="logo"
                fill
                className="brightness-0 invert object-contain"
              />
            </Link>
          </div>

          <div className="flex flex-col gap-6 flex-1 min-w-0 w-full">
            <div className="flex flex-col gap-1.5 items-start">
              <p className="text-gray-400 text-[13px] sm:text-sm leading-relaxed break-keep">
                {footerMessage}
              </p>
              <p className="text-gray-500 text-[11px] sm:text-xs font-light mt-2">
                COPYRIGHT © 2024 Palworld Community. ALL RIGHTS RESERVED.
              </p>
            </div>

            <div className="flex flex-wrap justify-start gap-3 w-full">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="w-[120px] h-[35px] sm:w-[140px] sm:h-[40px] relative grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <Image
                    src={`${API_BASE_URL}/attachments/${attachment.file_name}`}
                    alt={`footer image ${attachment.id}`}
                    fill
                    className="object-contain object-left"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
