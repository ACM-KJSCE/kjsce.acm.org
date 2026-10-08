import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AvatarCanvas from "./AvatarCanvas";
import MorphingInfinity from "./ui/MorphingInfinity";
import { MorphingText } from "./ui/morphing-text";
import Starfield from "./Starfield";

export default function AvatarLoader({ onComplete, durationMs = 12500 }) {
  const [isVisible, setIsVisible] = useState(true);

  // Lock scrollbar while avatar loading screen is active
  useEffect(() => {
    if (isVisible) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="fullscreen-avatar-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: "blur(12px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] w-full h-full bg-[#000000] overflow-hidden select-none touch-none cursor-default"
          onClick={() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }}
        >
          {/* Starfield Background */}
          <div className="absolute inset-0 z-0">
            <Starfield
              stars={1200}
              speed={3}
              spread={5}
              focal={1.5}
              twinkle={0.5}
              trail={0.7}
              size={2.8}
              fadeInRange={4}
              reverseFly={false}
              followCursor={true}
              background="#000000"
              starColor="#ffffff"
            />
          </div>

          {/* Morphing Text at top left */}
          <div className="absolute top-6 left-6 z-20 pointer-events-none w-[90vw] md:w-[60vw]">
            <MorphingText
              texts={["ACM", "Together We Strive.", "Together We Achieve!"]}
              className="text-xl md:text-2xl lg:text-3xl text-white/90 text-left mx-0 font-black tracking-tighter"
            />
          </div>

          {/* 3D Smooth Interactive Avatar: Centered in canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.34, 1.3, 0.64, 1],
            }}
            className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
          >
            <AvatarCanvas isFullScreen={true} />
          </motion.div>

          {/* Morphing Infinity Animation at the bottom right */}
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 pointer-events-none">
            <MorphingInfinity className="w-9 h-9 md:w-11 md:h-11 text-white/75 drop-shadow-md" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
