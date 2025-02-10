"use client";

import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import { API_BASE_URL } from "@/config/api";

const Trailer = () => {
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    const fetchVideoLink = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/links`);
        const data = await response.json();

        if (data.http_status === "OK") {
          const palworld = data.data.find(
            (link: { link_type: string }) => link.link_type === "TRAILER_VIDEO"
          );
          if (palworld) {
            // YouTube URL에서 videoId 추출
            const url = new URL(palworld.url);
            const id = url.searchParams.get("v");
            if (id) setVideoId(id);
          }
        }
      } catch (error) {
        console.error("동영상 링크를 불러오는데 실패했습니다:", error);
      }
    };

    fetchVideoLink();
  }, []);

  const opts = {
    width: "100%",
    height: "675",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <section className="w-full mt-[50px]">
      <div className="w-full aspect-video">
        {videoId && (
          <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
        )}
      </div>
    </section>
  );
};

export default Trailer;
