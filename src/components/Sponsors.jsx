import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function Sponsors({ sponsorList }) {
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const slider = sliderRef.current;
    let scrollSpeed = 1;
    let animationFrameId;

    const loop = () => {
      if (!isHovered && slider) {
        slider.scrollLeft += scrollSpeed;

        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return sponsorList ? (
    <div
      id="sponsors"
      className=" font-semibold text-1xl md:text-2xl text-white text-justify sm:pl-4"
    >
      <h1 className="mb-4">Event Sponsors</h1>
      <div className="overflow-hidden  w-full h-auto ml-1">
        <div
          className="relative flex w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex gap-4 overflow-hidden w-full"
            ref={sliderRef}
          >
            {[...sponsorList, ...sponsorList, ...sponsorList].map(
              (imgSrc, index) => (
                <div key={index} className="flex-shrink-0">
                  <img
                    src={imgSrc}
                    alt={`Slide ${index}`}
                    className="w-auto h-[60px] object-cover"
                  />
                </div>
              ),
            )}
          </motion.div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default Sponsors;
