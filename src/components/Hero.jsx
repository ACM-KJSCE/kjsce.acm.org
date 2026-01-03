import React, { Suspense } from "react";
import sampleArcs from "../data/SampleArcs";
import globeConfig from "../data/GlobeConfig";
import "./styles/Hero.css";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { WavyBackgroundDemo } from "./WavyBackground";

const World = React.lazy(() => import("./ui/globe"));

function Hero() {
  return (
    <section className="w-full flex justify-center px-4 md:px-4 lg:px-4">
      {/* Rounded Gradient Section */}
      {/* <WavyBackgroundDemo/> */}
      <div className="relative w-full max-w-7xl h-[85vh] rounded-3xl overflow-hidden">
        {/* Shader Gradient */}
        <ShaderGradientCanvas
          style={{ width: "100%", height: "100%" }}
          pixelDensity={1}
          pointerEvents="auto"
        >
          <ShaderGradient
            animate="on"
            type="sphere"
            shader="defaults"
            uSpeed={0.3}
            uStrength={0.3}
            uDensity={0.8}
            uFrequency={5.5}
            uAmplitude={3.2}
            positionX={-0.1}
            rotationY={130}
            rotationZ={70}
            color1="#000000"
            color2="#1e3c72"
            color3="#000000"
            reflection={0.4}
            brightness={0.8}
            envPreset="city"
            grain="on"
            cDistance={0.5}
            cameraZoom={15.1}
          />
        </ShaderGradientCanvas>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full items-center">
            {/* LEFT — TEXT */}
            <div className="text-white text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <img
                  src="/logo_withoutbg.png"
                  alt="KJSCE ACM"
                  className="w-36 md:w-44 h-34 bg-black rounded-xl p-2"
                  draggable={false}
                />
              </div>

              <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold mt-8">
                We are KJSSE –<span className="text-blue-300"> ACM</span>
              </h1>

              <p className="mt-6 text-xl md:text-2xl text-gray-200">
                Curious to find out what we do?
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Scroll down to see :)
              </p>
            </div>

            {/* RIGHT — GLOBE */}
            <div className="relative h-[18rem] md:h-[28rem] lg:h-[34rem] w-full flex justify-center items-center">
              <Suspense fallback={<div className="text-white">Loading...</div>}>
                <World data={sampleArcs} globeConfig={globeConfig} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
