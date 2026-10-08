import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "motion/react"

const DESKTOP_POINTER_QUERY = "(any-hover: hover) and (any-pointer: fine)"

function isTrackablePointer(pointerType) {
  return pointerType !== "touch"
}

const DefaultCursorSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={54}
      viewBox="0 0 50 54"
      fill="none"
      style={{ scale: 0.35 }}>
      <g filter="url(#filter0_d_91_7928)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="black" />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="white"
          strokeWidth={2.25825} />
      </g>
      <defs>
        <filter
          id="filter0_d_91_7928"
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha" />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

const PointerCursorSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28" height="28"
    viewBox="0 0 24 24"
    fill="black" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M9 11V4a2 2 0 0 1 4 0v7"/>
    <path d="M13 11V8a2 2 0 0 1 4 0v4"/>
    <path d="M17 12V9.5a2 2 0 0 1 4 0v4.5a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7v-6a2 2 0 0 1 4 0v5"/>
  </svg>
);

const TextCursorSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ filter: "drop-shadow(0px 0px 1px white)" }}
  >
    <path d="M10 3h4"/>
    <path d="M12 3v18"/>
    <path d="M10 21h4"/>
  </svg>
);

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,

  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  }
}) {
  const lastMousePos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const lastUpdateTime = useRef(Date.now())
  const previousAngle = useRef(0)
  const accumulatedRotation = useRef(0)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [cursorState, setCursorState] = useState("default")

  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 60,
    stiffness: 300,
  })
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 500,
    damping: 35,
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_POINTER_QUERY)

    const updateEnabled = () => {
      const nextIsEnabled = mediaQuery.matches
      setIsEnabled(nextIsEnabled)

      if (!nextIsEnabled) {
        setIsVisible(false)
      }
    }

    updateEnabled()
    mediaQuery.addEventListener("change", updateEnabled)

    // Global CSS to hide the native cursor when SmoothCursor is enabled
    const styleId = "__magicui-smooth-cursor-hide"
    let styleEl = document.getElementById(styleId)
    if (isEnabled && !styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = styleId
      styleEl.textContent = `
        @media (any-hover: hover) and (any-pointer: fine) {
          * { cursor: none !important; }
        }
      `
      document.head.appendChild(styleEl)
    } else if (!isEnabled && styleEl) {
      styleEl.remove()
    }

    return () => {
      mediaQuery.removeEventListener("change", updateEnabled)
      const el = document.getElementById(styleId)
      if (el) el.remove()
    };
  }, [isEnabled])

  useEffect(() => {
    if (!isEnabled) {
      return
    }

    let timeout = null

    const updateVelocity = (currentPos) => {
      const currentTime = Date.now()
      const deltaTime = currentTime - lastUpdateTime.current

      if (deltaTime > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        }
      }

      lastUpdateTime.current = currentTime
      lastMousePos.current = currentPos
    }

    const smoothPointerMove = (e) => {
      if (!isTrackablePointer(e.pointerType)) {
        return
      }

      setIsVisible(true)

      const currentPos = { x: e.clientX, y: e.clientY }
      updateVelocity(currentPos)
      
      const target = e.target;
      const isInteractive = target.closest("a, button, [role='button'], [role='link'], [tabindex], .cursor-pointer, .interactive");
      const isText = target.closest("input, textarea, select, [contenteditable]");
      
      let nextState = "default";
      if (isText) nextState = "text";
      else if (isInteractive) nextState = "interactive";

      setCursorState(nextState);

      const speed = Math.sqrt(Math.pow(velocity.current.x, 2) + Math.pow(velocity.current.y, 2))

      cursorX.set(currentPos.x)
      cursorY.set(currentPos.y)

      if (speed > 0.1) {
        const currentAngle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
          90

        let angleDiff = currentAngle - previousAngle.current
        if (angleDiff > 180) angleDiff -= 360
        if (angleDiff < -180) angleDiff += 360
        accumulatedRotation.current += angleDiff
        rotation.set(accumulatedRotation.current)
        previousAngle.current = currentAngle

        scale.set(0.95)

        if (timeout !== null) {
          clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
          scale.set(1)
        }, 150)
      }
    }

    let rafId = 0
    const throttledPointerMove = (e) => {
      if (!isTrackablePointer(e.pointerType)) {
        return
      }

      if (rafId) return

      rafId = requestAnimationFrame(() => {
        smoothPointerMove(e)
        rafId = 0
      })
    }

    document.body.style.cursor = "none"
    window.addEventListener("pointermove", throttledPointerMove, {
      passive: true,
    })

    return () => {
      window.removeEventListener("pointermove", throttledPointerMove)
      if (rafId) cancelAnimationFrame(rafId)
      if (timeout !== null) {
        clearTimeout(timeout)
      }
    };
  }, [cursorX, cursorY, rotation, scale, isEnabled])

  if (!isEnabled) {
    return null
  }

  return (
    <motion.div
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        rotate: rotation,
        scale: scale,
        zIndex: 100,
        pointerEvents: "none",
        willChange: "transform",
        opacity: isVisible ? 1 : 0,
        display: "grid",
        placeItems: "center"
      }}
      initial={false}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        // When in text state, cancel the rotation so the I-beam is upright
        rotate: cursorState === "text" ? 0 : rotation.get()
      }}
      transition={{
        duration: 0.15,
      }}>
      <motion.div
        animate={{ opacity: cursorState === "default" ? 1 : 0, scale: cursorState === "default" ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        style={{ gridArea: "1 / 1" }}
      >
        {cursor}
      </motion.div>

      <motion.div
        animate={{ opacity: cursorState === "interactive" ? 1 : 0, scale: cursorState === "interactive" ? 1 : 0.5 }}
        transition={{ duration: 0.2 }}
        style={{ gridArea: "1 / 1" }}
      >
        <PointerCursorSVG />
      </motion.div>

      <motion.div
        animate={{ opacity: cursorState === "text" ? 1 : 0, scale: cursorState === "text" ? 1 : 0.5 }}
        transition={{ duration: 0.2 }}
        style={{ gridArea: "1 / 1" }}
      >
        <TextCursorSVG />
      </motion.div>
    </motion.div>
  );
}
