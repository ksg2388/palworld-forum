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
    <footer className="w-full min-w-[1000px] bg-gray-800 text-white">
      <div className="max-w-[1200px] mx-auto px-4 h-full flex flex-col justify-between py-8">
        <div className="flex items-start gap-12">
          <div className="flex-shrink-0">
            <Link href="/" className="w-[119px] h-[32px] relative">
              <div className="w-[140px] h-[38px] relative">
                <Image
                  src="/images/logo-palworld.webp"
                  alt="logo"
                  fill
                  className="brightness-0 invert"
                />
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-8 flex-1">
            <div className="flex flex-col gap-2">
              <p className="text-gray-400 text-sm max-w-[600px]">
                {footerMessage}
              </p>
              <p className="text-gray-400 text-sm max-w-[600px]">
                © 2024 Palworld Community. All rights reserved.
              </p>
            </div>
          </div>

          <div className="flex gap-4 flex-shrink-0">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="w-[190px] h-[50px] relative">
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
