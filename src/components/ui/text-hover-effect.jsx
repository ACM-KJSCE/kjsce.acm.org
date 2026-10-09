import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Outlined wordmark whose gradient stroke is revealed under the cursor.
 * Pattern: Aceternity UI "Text Hover Effect" (MIT), rewritten without a
 * re-render on every mouse move. The light position is set straight on the
 * SVG gradient. On touch screens (no hover) the light sweeps by itself, and
 * it only runs while the wordmark is on screen.
 */
export function TextHoverEffect({ text, className = "" }) {
    const uid = useId().replace(/:/g, "");
    const svgRef = useRef(null);
    const maskRef = useRef(null);
    const [hovered, setHovered] = useState(false);
    const [auto, setAuto] = useState(false);
    const reduce = useReducedMotion();

    const moveMask = (x, y) => {
        const g = maskRef.current;
        if (!g) return;
        g.setAttribute("cx", `${x}%`);
        g.setAttribute("cy", `${y}%`);
    };

    useEffect(() => {
        if (reduce) return;
        if (window.matchMedia("(hover: hover)").matches) return;

        setAuto(true);
        let raf = 0;
        const t0 = performance.now();
        const tick = (now) => {
            moveMask(50 + 42 * Math.sin((now - t0) / 1600), 50);
            raf = requestAnimationFrame(tick);
        };
        const io = new IntersectionObserver(([entry]) => {
            cancelAnimationFrame(raf);
            if (entry.isIntersecting) raf = requestAnimationFrame(tick);
        });
        io.observe(svgRef.current);

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
        };
    }, [reduce]);

    const showGradient = hovered || auto || reduce;

    const common = {
        x: "50%",
        y: "53%",
        textAnchor: "middle",
        dominantBaseline: "middle",
        fontSize: 108,
        fontWeight: 800,
        fontFamily: "Helvetica, Arial, sans-serif",
        textLength: 610,
        lengthAdjust: "spacingAndGlyphs",
    };

    return (
        <svg
            ref={svgRef}
            viewBox="0 0 640 150"
            role="img"
            aria-label={text}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={(e) => {
                const r = svgRef.current.getBoundingClientRect();
                moveMask(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
            }}
            className={`h-auto w-full select-none ${className}`}
        >
            <defs>
                <linearGradient id={`${uid}-g`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="640" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="35%" stopColor="#3b82f6" />
                    <stop offset="65%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <radialGradient id={`${uid}-r`} ref={maskRef} gradientUnits="userSpaceOnUse" r="22%" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="black" />
                </radialGradient>
                <mask id={`${uid}-m`}>
                    <rect x="0" y="0" width="100%" height="100%" fill={`url(#${uid}-r)`} />
                </mask>
            </defs>

            {/* faint fill so the word is never invisible */}
            <text {...common} fill="rgba(34,211,238,0.04)" stroke="none">
                {text}
            </text>

            {/* outline that draws itself in once */}
            <motion.text
                {...common}
                fill="transparent"
                stroke="rgba(103,232,249,0.4)"
                strokeWidth={1.2}
                initial={reduce ? false : { strokeDashoffset: 4000, strokeDasharray: 4000 }}
                whileInView={{ strokeDashoffset: 0, strokeDasharray: 4000 }}
                viewport={{ once: true }}
                transition={{ duration: 3.2, ease: "easeInOut" }}
            >
                {text}
            </motion.text>

            {/* gradient stroke, revealed by the moving mask */}
            <text
                {...common}
                fill="transparent"
                stroke={`url(#${uid}-g)`}
                strokeWidth={2.4}
                mask={`url(#${uid}-m)`}
                style={{ opacity: showGradient ? 1 : 0, transition: "opacity 0.35s ease" }}
            >
                {text}
            </text>
        </svg>
    );
}