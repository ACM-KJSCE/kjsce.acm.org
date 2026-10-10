import { motion, motionValue, useSpring, useTransform } from "framer-motion";

// Re-uses the .abt-anim / abt-twinkle rules from App.css (twinkle + reduced-motion).
const ZERO = motionValue(0);

function mulberry32(seed) {
    let a = seed;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// One seamless tile of random dots; it repeats to cover any size.
function makeLayer(seed, count, tile, radius, colors) {
    const rand = mulberry32(seed);
    const dots = [];
    for (let i = 0; i < count; i++) {
        const x = Math.round(rand() * tile);
        const y = Math.round(rand() * tile);
        const c = colors[Math.floor(rand() * colors.length)];
        dots.push(`radial-gradient(${radius}px ${radius}px at ${x}px ${y}px, ${c} 40%, transparent 100%)`);
    }
    return { backgroundImage: dots.join(","), backgroundSize: `${tile}px ${tile}px` };
}

const LAYERS = [
    { style: makeLayer(101, 30, 360, 1, ["#ffffff", "#dbeafe", "#bfdbfe"]), anim: "abt-twinkle 1200s ease-in-out infinite", drift: 10 },
    { style: makeLayer(131, 14, 560, 1.6, ["#a5f3fc", "#ffffff", "#c4b5fd", "#fde68a"]), anim: "abt-twinkle 1200s ease-in-out infinite", drift: 22 },
];

export function Starfield({ progress = ZERO }) {
    const easedProgress = useSpring(progress, { stiffness: 20, damping: 30, mass: 1 });
    const y0 = useTransform(easedProgress, [0, 1], [-LAYERS[0].drift, 0]);
    const y1 = useTransform(easedProgress, [0, 1], [-LAYERS[1].drift, 0]);
    const ys = [y0, y1];

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {LAYERS.map((layer, i) => (
                <motion.div key={i} style={{ y: ys[i] }} className="absolute inset-x-0 -bottom-32 -top-32 will-change-transform">
                    <div className="abt-anim absolute inset-0" style={{ ...layer.style, animation: layer.anim }} />
                </motion.div>
            ))}
        </div>
    );
}