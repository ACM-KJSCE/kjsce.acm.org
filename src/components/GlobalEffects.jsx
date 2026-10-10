import React from "react";
import ClickSpark from "./ui/ClickSpark";
import Starfield from "./Starfield";
import GlobalCursor from "./GlobalCursor";
import AvatarLoader from "./AvatarLoader";

const GlobalEffects = ({ children }) => {
  return (
    <ClickSpark
      sparkColor="#fff"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
        <Starfield
          stars={1200}
          speed={0.5}
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
      <GlobalCursor />
      <AvatarLoader />
      {children}
    </ClickSpark>
  );
};

export default GlobalEffects;
