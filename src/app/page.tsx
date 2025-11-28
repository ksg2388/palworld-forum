import React from "react";
import Banner from "./_components/home/Banner";
import PreviewNews from "./_components/home/PreviewNews";
import Trailer from "./_components/home/Trailer";

const Home = () => {
  return (
    <div className="w-full min-h-screen max-w-[1200px] mx-auto pt-[80px] lg:pt-[110px] pb-[60px] px-4 lg:px-0">
      <section className="w-full h-[200px] sm:h-[350px] lg:h-[450px] mt-[20px] sm:mt-[40px] lg:mt-[50px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-none">
        <Banner />
      </section>
      <section className="w-full mt-[30px] sm:mt-[50px]">
        <div className="flex items-center justify-between mb-3 sm:mb-5 px-1 sm:px-0">
          <h2 className="text-[20px] sm:text-2xl font-bold text-gray-900">News</h2>
        </div>
        <PreviewNews />
      </section>
      <Trailer />
    </div>
  );
};

export default Home;
