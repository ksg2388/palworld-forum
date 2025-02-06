"use client";

import React from "react";
import QuillEditor from "../_components/editor/QuillEditor";

// const QuillEditor = dynamic(
//   () => import("@/app/_components/editor/QuillEditor"),
//   { ssr: false }
// );

const Page = () => {
  return (
    <div className="mt-[140px] min-h-screen">
      <img
        src="https://backend.palworldkorea.co.kr/attachments/9b1c890b-397e-48e0-800b-895400c66e1f.png"
        alt=""
      />
      <QuillEditor />
    </div>
  );
};

export default Page;
