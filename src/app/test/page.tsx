'use client';

import React from "react";
import QuillEditor from "../_components/editor/QuillEditor";

// const QuillEditor = dynamic(
//   () => import("@/app/_components/editor/QuillEditor"),
//   { ssr: false }
// );

const Page = () => {
  return (
    <div className="mt-[140px] min-h-screen">
      <QuillEditor />
    </div>
  );
};

export default Page;
