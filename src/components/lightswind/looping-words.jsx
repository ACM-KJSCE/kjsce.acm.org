"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "../../lib/utils";

export function LoopingWords({ words, className }) {
  const controls = useAnimationControls();
  const wordsRef = useRef([]);
  const [selectorWidth, setSelectorWidth] = useState(0);

  // Duplicate the words array to create a seamless infinite loop
  const duplicatedWords = [...words, ...words];
  const totalOriginal = words.length;

  useEffect(() => {
    // Initial width setup
    updateWidth(1);

    let index = 0;
    const interval = setInterval(async () => {
      index++;
      updateWidth((index % totalOriginal) + 1);

      await controls.start({
        y: `-${(index * 100) / duplicatedWords.length}%`,
        transition: { duration: 1.2, ease: [0.175, 0.885, 0.32, 1.15] },
      });

      // If we've scrolled past the first full set, snap back to the start seamlessly
      if (index === totalOriginal) {
        index = 0;
        controls.set({ y: "0%" });
      }
    }, 2200);

    return () => clearInterval(interval);
  }, [controls, totalOriginal, duplicatedWords.length]);

  const updateWidth = (index) => {
    const el = wordsRef.current[index];
    if (el) {
      setSelectorWidth(el.offsetWidth);
    }
  };

  return (
    <div className={cn("inline-flex items-center justify-start", className)}>
      <div 
        className="relative h-[1.3em] px-[0.1em] leading-[1.3] font-black tracking-tight whitespace-nowrap overflow-hidden"
        style={{
          maskImage: "linear-gradient(180deg, transparent 0%, black 30%, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 30%, black 70%, transparent 100%)",
        }}
      >
        
        {/* List of words */}
        <motion.ul
          className="flex flex-col items-center justify-start m-0 p-0 list-none"
          animate={controls}
          initial={{ y: "0%" }}
        >
          {duplicatedWords.map((word, i) => (
            <li
              key={i}
              ref={(el) => {
                wordsRef.current[i] = el;
              }}
              className="text-cyan-400 tracking-tight"
            >
              <p className="m-0 leading-none py-[0.15em]">{word}</p>
            </li>
          ))}
        </motion.ul>

        {/* Selector Edge Boxes */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[0.9em] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
          animate={{ width: selectorWidth }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Top Left */}
          <div className="absolute top-0 left-0 w-[0.25em] h-[0.25em] border-t-[0.05em] border-l-[0.05em] border-white/50" />
          {/* Top Right */}
          <div className="absolute top-0 right-0 w-[0.25em] h-[0.25em] border-t-[0.05em] border-r-[0.05em] border-white/50" />
          {/* Bottom Left */}
          <div className="absolute bottom-0 left-0 w-[0.25em] h-[0.25em] border-b-[0.05em] border-l-[0.05em] border-white/50" />
          {/* Bottom Right */}
          <div className="absolute bottom-0 right-0 w-[0.25em] h-[0.25em] border-b-[0.05em] border-r-[0.05em] border-white/50" />
        </motion.div>
      </div>
    </div>
  );
}
