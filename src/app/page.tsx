import React from "react";
import Banner from "./_components/home/Banner";
import PreviewNews from "./_components/home/PreviewNews";
import Trailer from "./_components/home/Trailer";

const Home = () => {
  return (
    <div className="w-full h-full max-w-[1200px] mx-auto pt-[110px] pb-[50px]">
      <section className="w-full h-[450px] mt-[50px] font-bold text-white text-[40px]">
        <Banner />
      </section>
      <section className="w-full mt-[50px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">News</h2>
        </div>
        {/* <PreviewNews /> */}
      </section>
      {/* <Trailer /> */}
    </div>
  );
};

export default Home;
