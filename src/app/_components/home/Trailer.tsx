"use client";

import React from "react";
import YouTube from "react-youtube";

const Trailer = () => {
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
        <YouTube videoId="1GLXsjTq8Rc" opts={opts} className="w-full h-full" />
      </div>
    </section>
  );
};

export default Trailer;
