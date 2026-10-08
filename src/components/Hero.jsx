import React, { Suspense } from "react";
import "./styles/Hero.css";
import AvatarCanvas from "./AvatarCanvas";
import { MorphingText } from "./ui/morphing-text";

function Hero() {
  const words = [
    "ACM",
    "Together We Strive.",
    "Together We Achieve!"
  ];

  return (
    <section className="w-full flex justify-center px-4 md:px-4 lg:px-4">
      <div className="relative w-full max-w-7xl h-[85vh] rounded-3xl overflow-hidden">

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full items-center -mt-16 lg:-mt-24">
            {/* LEFT — TEXT */}
            <div className="text-white text-center lg:text-left z-20">

              <div className="mt-8 mb-4 flex flex-col items-center lg:items-start justify-center lg:justify-start">
                <div className="w-full max-w-xl md:max-w-3xl lg:max-w-[40rem] h-[120px] md:h-[160px] lg:h-[220px] relative">
                  <MorphingText
                    texts={words}
                    className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-white/90 text-center lg:text-left h-full mx-0 w-full leading-none"
                  />
                </div>
              </div>


            </div>

            {/* RIGHT — AVATAR */}
            <div className="relative h-[18rem] md:h-[28rem] lg:h-[34rem] w-full flex justify-center items-center pointer-events-auto">
              <Suspense fallback={<div className="text-neutral-200">Loading Avatar...</div>}>
                <AvatarCanvas isFullScreen={false} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
