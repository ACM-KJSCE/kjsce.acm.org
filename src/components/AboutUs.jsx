import { useEffect, useRef, useState } from "react";
import {
  motion,
  animate,
  motionValue,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import {
  Users,
  CalendarDays,
  Handshake,
  Timer,
  Rocket,
  GraduationCap,
  Puzzle,
  ChevronDown,
} from "lucide-react";

// Real numbers, pulled from the data files you already maintain.
import teams from "../data/teams-2025-2026.json";
import events from "../data/events.json";
import sponsors from "../data/sponsors.json";

/* ================================================================== */
/*  Editable content                                                   */
/* ================================================================== */

// Same link as the "Join Us" button in the Navbar.
const JOIN_URL = "https://acm-fyrep-2627.web.app/";

const crewCount = teams.teamdata.reduce((sum, t) => sum + t.members.length, 0);

const STATS = [
  { icon: Users, label: "Crew Members", value: crewCount, suffix: "" },
  { icon: CalendarDays, label: "Missions Flown", value: events.length, suffix: "" },
  { icon: Handshake, label: "Partners On Board", value: sponsors.sponsors.length, suffix: "" },
  { icon: Timer, label: "Hour Flagship Hackathon", value: 24, suffix: "H" },
];

const MODULES = [
  {
    icon: Rocket,
    title: "Hackathons",
    text: "AfterMath, our 24-hour flagship, and Artemis, the frontend mini-hackathon. Build fast, ship bold.",
  },
  {
    icon: GraduationCap,
    title: "Masterclasses & Seminars",
    text: "Into the Webverse code-alongs and Beyond the Classroom talks: real skills and guidance from people who've walked the path.",
  },
  {
    icon: Puzzle,
    title: "Brain-Bending Challenges",
    text: "Escape Sequence, our tech escape room, puts your logic, problem-solving and speed to the test.",
  },
];

const PARAGRAPH =
  "Welcome to KJSSE ACM, where caffeine fuels ideas, bugs are just happy accidents, and tech dreams take shape! We're the cool new kids on campus. From cracking code to cracking jokes, we're all about learning, growing, and making things happen. At KJSSE ACM, our mantra is simple: together we strive, together we achieve… and maybe have a little too much fun along the way!";
const PARA_WORDS = PARAGRAPH.split(" ");

const HEADLINE_LINES = [
  [{ w: "Together" }, { w: "We", glow: true }, { w: "Strive," }],
  [{ w: "Together" }, { w: "We", glow: true }, { w: "Achieve!" }],
];

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

// Constant "finished" / "not started" progress values.
// Passing ONE to a scroll-driven component renders its final, static state.
const ZERO = motionValue(0);
const ONE = motionValue(1);

function useSmoothProgress(ref, offset) {
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.35, restDelta: 0.0005 });
}

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

// One seamless tile of random dots; tile sizes differ per layer to hide repetition.
function makeStarLayer(seed, count, tile, radius, colors) {
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

const STAR_LAYERS = [
  { style: makeStarLayer(11, 26, 340, 1, ["#ffffff", "#dbeafe", "#bfdbfe"]), anim: "abt-twinkle 5s ease-in-out infinite" },
  { style: makeStarLayer(29, 14, 520, 1.5, ["#a5f3fc", "#ffffff", "#c4b5fd"]), anim: "abt-twinkle 7s ease-in-out -2s infinite" },
  { style: makeStarLayer(47, 6, 760, 2.2, ["#fde68a", "#ffffff", "#67e8f9"]), anim: "abt-twinkle 9s ease-in-out -4s infinite" },
];

const pad2 = (n) => String(n).padStart(2, "0");

/* ================================================================== */
/*  Small building blocks                                              */
/* ================================================================== */

function Tag({ children, className = "" }) {
  return (
    <div className={`font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-300 ${className}`}>
      {children}
    </div>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping motion-reduce:animate-none" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
    </span>
  );
}

function Brackets({ size = "w-4 h-4", color = "border-cyan-400/80", inset = "" }) {
  return (
    <>
      <span aria-hidden="true" className={`absolute top-0 left-0 ${size} ${inset} border-t-2 border-l-2 ${color} rounded-tl`} />
      <span aria-hidden="true" className={`absolute top-0 right-0 ${size} ${inset} border-t-2 border-r-2 ${color} rounded-tr`} />
      <span aria-hidden="true" className={`absolute bottom-0 left-0 ${size} ${inset} border-b-2 border-l-2 ${color} rounded-bl`} />
      <span aria-hidden="true" className={`absolute bottom-0 right-0 ${size} ${inset} border-b-2 border-r-2 ${color} rounded-br`} />
    </>
  );
}

function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {val}
        {suffix}
      </span>
      <span className="sr-only">
        {to}
        {suffix}
      </span>
    </span>
  );
}

// A word whose opacity is scrubbed by scroll progress.
function RevealWord({ children, p, range, className = "", rise = 10 }) {
  const opacity = useTransform(p, range, [0.12, 1]);
  const y = useTransform(p, range, [rise, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`inline-block ${className}`}>
      {children}
    </motion.span>
  );
}

/* ================================================================== */
/*  Scene layers                                                       */
/* ================================================================== */

// Everything that sits behind the text: nebula, zooming stars, planet, Earth horizon.
function Backdrop({ p = ZERO }) {
  const s1 = useTransform(p, [0, 1], [1, 2.2]);
  const s2 = useTransform(p, [0, 1], [1, 3.6]);
  const s3 = useTransform(p, [0, 1], [1, 7]);
  const scales = [s1, s2, s3];
  const o3 = useTransform(p, [0.55, 1], [1, 0.1]);

  const nebY = useTransform(p, [0, 1], ["0%", "-35%"]);
  const nebO = useTransform(p, [0, 0.5, 1], [0.55, 0.9, 0.6]);

  // ringed planet flying past
  const px = useTransform(p, [0, 0.62], ["36vw", "-32vw"]);
  const py = useTransform(p, [0, 0.62], ["20vh", "-26vh"]);
  const pScale = useTransform(p, [0, 0.62], [0.5, 1.6]);
  const pRot = useTransform(p, [0, 0.62], [0, -24]);
  const pOpacity = useTransform(p, [0.02, 0.14, 0.56, 0.74], [0, 0.75, 0.75, 0]);

  // Earth horizon we are leaving behind
  const hY = useTransform(p, [0, 0.34], ["90%", "125%"]);
  const hO = useTransform(p, [0, 0.3], [1, 0]);

  return (
    <div aria-hidden="true" className="abt-fade-y pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={{ y: nebY, opacity: nebO }}
        className="absolute -left-1/4 top-0 h-[75%] w-[75%] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.16),transparent)]"
      />
      <motion.div
        style={{ y: nebY, opacity: nebO }}
        className="absolute -right-1/4 top-1/4 h-[80%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.20),transparent)]"
      />

      {STAR_LAYERS.map((layer, i) => (
        <motion.div
          key={i}
          style={i === 2 ? { scale: scales[i], opacity: o3 } : { scale: scales[i] }}
          className="absolute inset-0 will-change-transform"
        >
          <div className="abt-anim absolute inset-0" style={{ ...layer.style, animation: layer.anim }} />
        </motion.div>
      ))}

      <span className="abt-shoot abt-anim" style={{ top: "12%", right: "24%" }} />
      <span className="abt-shoot abt-anim" style={{ top: "48%", right: "6%", animationDelay: "5s", animationDuration: "13s" }} />

      {/* ringed planet */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          style={{ x: px, y: py, scale: pScale, rotate: pRot, opacity: pOpacity }}
          className="relative h-36 w-36 md:h-60 md:w-60"
        >
          <div
            className="absolute left-1/2 top-1/2 h-[190%] w-[190%] rounded-full border border-cyan-300/30"
            style={{ transform: "translate(-50%, -50%) rotate(-18deg) scaleY(0.26)" }}
          />
          <div className="abt-planet absolute inset-0 rounded-full" />
          <div
            className="absolute left-1/2 top-1/2 h-[190%] w-[190%] rounded-full border border-cyan-300/60"
            style={{ transform: "translate(-50%, -50%) rotate(-18deg) scaleY(0.26)", clipPath: "inset(50% 0 0 0)" }}
          />
        </motion.div>
      </div>

      <motion.div style={{ y: hY, opacity: hO }} className="abt-horizon" />
    </div>
  );
}

// Bottom HUD: mission clock, progress bar, chapter name. All driven by scroll.
function SceneHud({ p }) {
  const met = useTransform(p, (v) => {
    const s = Math.round(v * 180);
    return `T+ ${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
  });
  const chapter = useTransform(p, (v) =>
    v < 0.42 ? "01 // Briefing" : v < 0.7 ? "02 // Transmission" : "03 // The Crew"
  );
  const bar = useTransform(p, [0, 1], [0, 1]);

  return (
    <div className="absolute inset-x-0 bottom-5 z-20 flex items-center gap-4 px-4 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/80 md:bottom-7 md:px-10 md:text-[11px]">
      <motion.span className="w-20 shrink-0 tabular-nums">{met}</motion.span>
      <div className="relative h-px flex-1 bg-white/10">
        <motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-cyan-400" />
      </div>
      <motion.span className="shrink-0 text-right">{chapter}</motion.span>
    </div>
  );
}

/* ================================================================== */
/*  Chapters                                                           */
/* ================================================================== */

function Headline({ p = ONE }) {
  let i = 0;
  return (
    <h2 className="mt-8 text-[1.7rem] font-extrabold leading-[1.15] text-white min-[400px]:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl md:mt-10">
      {HEADLINE_LINES.map((line, li) => (
        <span key={li} className="block">
          {line.map(({ w, glow }) => {
            const s = 0.06 + i * 0.05;
            i += 1;
            return (
              <RevealWord
                key={`${li}-${w}-${i}`}
                p={p}
                range={[s, s + 0.05]}
                className={`mx-[0.14em] ${glow ? "text-cyan-400 [text-shadow:0_0_28px_rgba(34,211,238,0.6)]" : ""}`}
              >
                {w}
              </RevealWord>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

function Transmission({ p = ONE }) {
  return (
    <div className="relative mx-auto max-w-3xl rounded-2xl border border-cyan-400/20 bg-black/40 p-5 backdrop-blur-md md:p-9">
      <Brackets />
      <div className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300/90">
        <span aria-hidden="true">&gt;</span>
        <span>incoming_transmission</span>
      </div>
      <p className="text-base leading-relaxed text-slate-100 md:text-xl md:leading-relaxed lg:text-2xl lg:leading-relaxed">
        {PARA_WORDS.map((w, i) => {
          const s = 0.5 + (i / PARA_WORDS.length) * 0.14;
          return (
            <RevealWord key={i} p={p} range={[s, s + 0.03]} rise={0} className="mr-[0.28em]">
              {w}
            </RevealWord>
          );
        })}
        <span
          aria-hidden="true"
          className="abt-anim abt-cursor ml-1 inline-block h-5 w-2 translate-y-1 bg-cyan-400"
        />
      </p>
    </div>
  );
}

// The crew photo. Opens like a porthole as progress runs from 0.72 to 0.94.
function PhotoPortal({ p = ONE }) {
  const clip = useTransform(p, [0.72, 0.94], ["circle(0% at 50% 50%)", "circle(74% at 50% 50%)"]);
  const scale = useTransform(p, [0.72, 0.95], [1.35, 1]);
  const glow = useTransform(p, [0.86, 0.97], [0, 1]);
  const detail = useTransform(p, [0.9, 0.98], [0, 1]);

  return (
    <figure
      className="group relative"
      style={{ width: "min(92vw, calc((100svh - 10rem) * 1.5), 60rem)" }}
    >
      <motion.div
        aria-hidden="true"
        style={{ opacity: glow }}
        className="absolute -inset-px rounded-[1.15rem] bg-gradient-to-br from-cyan-400/70 via-violet-500/40 to-cyan-400/10 blur-[2px]"
      />
      <motion.div style={{ clipPath: clip, scale }} className="relative overflow-hidden rounded-2xl bg-black">
        <img
          src="/acm_2025-26.jpeg"
          alt="The KJSSE ACM team in matching white jackets, standing and seated on stage with faculty"
          width="1280"
          height="853"
          loading="lazy"
          draggable={false}
          className="block h-auto w-full"
        />
        <div aria-hidden="true" className="abt-scanlines pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="abt-anim abt-beam pointer-events-none" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_62%,rgba(2,3,10,0.55)_100%)]"
        />
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-cyan-400/30 bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200 backdrop-blur-sm md:left-5 md:top-5 md:text-[11px]">
          <LiveDot />
          Live feed
        </div>
        <div className="absolute bottom-3 left-3 rounded-md border border-white/15 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm md:bottom-5 md:left-5 md:text-xs">
          Crew {teams.year} <span className="text-cyan-400">{"//"}</span> KJSSE ACM
        </div>
      </motion.div>
      <motion.div style={{ opacity: detail }} aria-hidden="true">
        <Brackets size="w-5 h-5 md:w-7 md:h-7" inset="-m-2 md:-m-3" color="border-cyan-300" />
      </motion.div>
    </figure>
  );
}

/* ================================================================== */
/*  1. Pinned cinematic scene                                          */
/* ================================================================== */

function CinematicScene() {
  const ref = useRef(null);
  const p = useSmoothProgress(ref, ["start start", "end end"]);

  // Chapter A: title + headline
  const aOpacity = useTransform(p, [0.36, 0.44], [1, 0]);
  const aY = useTransform(p, [0.36, 0.46], [0, -70]);
  const aScale = useTransform(p, [0.36, 0.46], [1, 0.93]);
  const hint = useTransform(p, [0, 0.05], [1, 0]);

  // Chapter B: transmission
  const bOpacity = useTransform(p, [0.45, 0.52, 0.66, 0.72], [0, 1, 1, 0]);
  const bY = useTransform(p, [0.45, 0.52, 0.66, 0.72], [60, 0, 0, -60]);

  // Chapter C: crew photo
  const cOpacity = useTransform(p, [0.72, 0.76], [0, 1]);

  return (
    <div ref={ref} className="relative h-[350vh]">
      <div className="abt-bleed sticky top-0 h-svh overflow-hidden">
        <Backdrop p={p} />

        <div className="relative z-10 mx-auto h-full max-w-7xl">
          <motion.div
            style={{ opacity: aOpacity, y: aY, scale: aScale }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-24 text-center"
          >
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-300">
              <LiveDot />
              <span>{"// Mission Briefing"}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-black uppercase tracking-tight text-white mb-3">
              About <span className="text-cyan-400">Us</span>
            </h1>
            <Headline p={p} />
            <motion.div
              style={{ opacity: hint }}
              className="mt-10 flex flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400"
            >
              Scroll to launch
              <ChevronDown className="h-4 w-4 animate-bounce text-cyan-300 motion-reduce:animate-none" aria-hidden="true" />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ opacity: bOpacity, y: bY }}
            className="absolute inset-0 flex items-center justify-center px-4 pt-20"
          >
            <Transmission p={p} />
          </motion.div>

          <motion.div
            style={{ opacity: cOpacity }}
            className="absolute inset-0 flex items-center justify-center px-4 pt-20"
          >
            <PhotoPortal p={p} />
          </motion.div>
        </div>

        <SceneHud p={p} />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  2. Telemetry stats: parallax columns                               */
/* ================================================================== */

function StatCard({ icon: Icon, label, value, suffix, i, p }) {
  const animated = Boolean(p);
  const prog = p ?? ONE;
  const from = i % 2 === 0 ? 70 : 140;
  const to = i % 2 === 0 ? -30 : -60;
  const y = useTransform(prog, [0, 1], [from, to]);
  const opacity = useTransform(prog, [0, 0.25], [0, 1]);
  const fill = useTransform(prog, [0.15, 0.65], [0, 1]);

  return (
    <motion.div
      style={animated ? { y, opacity } : undefined}
      className="relative overflow-hidden rounded-xl border border-cyan-400/15 bg-black/40 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-cyan-400/40 md:p-6"
    >
      <Icon className="h-5 w-5 text-cyan-300" aria-hidden="true" />
      <div className="mt-3 text-4xl font-black tabular-nums text-white md:text-5xl">
        <CountUp to={value} suffix={suffix} />
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400 md:text-[11px]">
        {label}
      </div>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10" />
      <motion.span
        aria-hidden="true"
        style={animated ? { scaleX: fill } : undefined}
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
      />
    </motion.div>
  );
}

function Telemetry({ animated }) {
  const ref = useRef(null);
  const p = useSmoothProgress(ref, ["start end", "end start"]);
  return (
    <div ref={ref} className="mx-auto max-w-7xl px-4 pb-24 pt-10 md:px-8 md:pb-40 md:pt-20">
      <Tag className="text-center">{"// Mission Telemetry"}</Tag>
      <div className="mt-10 grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <StatCard key={s.label} {...s} i={i} p={animated ? p : undefined} />
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  3. What We Do: pinned horizontal track                             */
/* ================================================================== */

function ModuleCard({ icon: Icon, title, text, index, p, wide }) {
  const spin = useTransform(p, [0, 1], [0, 220 + index * 110]);
  return (
    <article
      className={`relative shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur-sm md:p-10 ${wide
          ? "h-[52svh] min-h-[21rem] w-[82vw] sm:w-[30rem] md:w-[42rem] lg:w-[46rem]"
          : "min-h-[18rem]"
        }`}
    >
      <Brackets size="w-5 h-5" color="border-cyan-400/50" />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-2 text-7xl font-black text-transparent [-webkit-text-stroke:1px_rgba(103,232,249,0.35)] md:text-9xl"
      >
        {pad2(index + 1)}
      </span>

      {/* concentric orbit art, rotated by scroll */}
      <motion.div
        aria-hidden="true"
        style={{ rotate: spin }}
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 md:-bottom-28 md:-right-28 md:h-96 md:w-96"
      >
        <div className="absolute inset-0 rounded-full border border-cyan-400/25" />
        <div className="absolute inset-[14%] rounded-full border border-dashed border-violet-400/30" />
        <div className="absolute inset-[30%] rounded-full border border-cyan-400/20" />
        <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
        <span className="absolute bottom-[14%] left-[14%] h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_14px_rgba(196,181,253,0.9)]" />
      </motion.div>

      <div className="relative flex h-full flex-col justify-end">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.25)]">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-extrabold text-white md:text-4xl">{title}</h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300 md:text-lg">{text}</p>
      </div>
    </article>
  );
}

function ModuleTrack() {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const p = useSmoothProgress(ref, ["start start", "end end"]);
  const [dist, setDist] = useState(0);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setDist(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    window.addEventListener("resize", measure);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, []);

  const x = useTransform(p, [0.06, 0.94], [0, -dist]);
  const bar = useTransform(p, [0, 1], [0, 1]);
  useMotionValueEvent(p, "change", (v) =>
    setCurrent(Math.min(MODULES.length, Math.max(1, Math.floor(v * MODULES.length) + 1)))
  );

  return (
    <div ref={ref} className="abt-bleed relative h-[260vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pb-14 pt-24">
        <div className="mb-6 flex flex-col items-center px-4 text-center md:mb-10">
          <Tag>{"// Mission Modules"}</Tag>
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-black uppercase tracking-tight text-white mb-3">
            What <span className="text-cyan-400">We Do</span>
          </h2>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-5 px-[6vw] md:gap-8">
          {MODULES.map((m, i) => (
            <ModuleCard key={m.title} {...m} index={i} p={p} wide />
          ))}
        </motion.div>

        <div className="absolute inset-x-0 bottom-5 flex items-center gap-4 px-4 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/80 md:bottom-7 md:px-10 md:text-[11px]">
          <span className="tabular-nums">
            {pad2(current)} / {pad2(MODULES.length)}
          </span>
          <div className="relative h-px flex-1 bg-white/10">
            <motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-cyan-400" />
          </div>
          <span>Keep scrolling</span>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  4. Launch: scroll-linked countdown                                 */
/* ================================================================== */

function Launch({ animated }) {
  const ref = useRef(null);
  const p = useSmoothProgress(ref, ["start 90%", "end 60%"]);
  const [step, setStep] = useState(animated ? 3 : 0);

  useMotionValueEvent(p, "change", (v) => {
    if (!animated) return;
    setStep(v < 0.22 ? 3 : v < 0.44 ? 2 : v < 0.66 ? 1 : 0);
  });

  const rocketY = useTransform(p, [0.66, 1], [0, -80]);
  const flame = useTransform(p, [0.5, 0.7, 1], [0.15, 1, 1.7]);
  const lifted = step === 0;

  return (
    <div ref={ref} className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-24 pt-6 text-center md:pb-40">
      <motion.div style={animated ? { y: rocketY } : undefined} className="relative flex flex-col items-center">
        <Rocket className="h-14 w-14 -rotate-45 text-cyan-300 drop-shadow-[0_0_18px_rgba(34,211,238,0.7)]" aria-hidden="true" />
        <motion.span
          aria-hidden="true"
          style={animated ? { scaleY: flame } : { scaleY: 1 }}
          className="-mt-1 h-10 w-3 origin-top rounded-b-full bg-gradient-to-b from-amber-200 via-orange-400 to-transparent blur-[1px]"
        />
      </motion.div>

      <div
        aria-live="polite"
        className={`mt-6 font-mono text-5xl font-black tracking-[0.2em] md:text-7xl ${lifted ? "text-cyan-300 [text-shadow:0_0_30px_rgba(34,211,238,0.8)]" : "text-white/90"
          }`}
      >
        {lifted ? "LIFTOFF" : `T-${step}`}
      </div>

      <p className="mt-8 text-2xl font-bold text-white md:text-3xl">Ready for launch?</p>
      <p className="mt-2 max-w-md text-sm text-slate-300 md:text-base">
        There's always room on the crew for someone curious.
      </p>
      <a
        href={JOIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-8 py-3 font-bold text-black shadow-[0_0_30px_-4px_rgba(34,211,238,0.7)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_0_44px_-2px_rgba(34,211,238,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
      >
        <Rocket className="h-5 w-5" aria-hidden="true" />
        Join the crew
      </a>
    </div>
  );
}

/* ================================================================== */
/*  Reduced-motion version: same content, stacked, nothing pinned      */
/* ================================================================== */

function StaticScene() {
  return (
    <div className="relative">
      <div className="abt-bleed absolute inset-y-0">
        <Backdrop p={ZERO} />
      </div>
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-14 px-4 py-16 text-center md:px-8">
        <div className="flex flex-col items-center">
          <Tag>{"// Mission Briefing"}</Tag>
          <h1 className="mt-4 border-b-2 border-cyan-400 px-8 pb-4 text-4xl font-black uppercase text-white">About Us</h1>
          <Headline />
        </div>
        <div className="text-left">
          <Transmission />
        </div>
        <PhotoPortal />
      </div>
    </div>
  );
}

function StaticModules() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <Tag>{"// Mission Modules"}</Tag>
        <h2 className="mt-4 border-b-2 border-cyan-400 px-8 pb-4 text-3xl font-black uppercase text-white md:text-4xl">
          What We Do
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {MODULES.map((m, i) => (
          <ModuleCard key={m.title} {...m} index={i} p={ZERO} />
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Export                                                             */
/* ================================================================== */

function AboutUs() {
  const reduce = useReducedMotion();

  return (
    <section id="about-us" className="relative mt-12 md:mt-16">
      {reduce ? <StaticScene /> : <CinematicScene />}
      <Telemetry animated={!reduce} />
      {reduce ? <StaticModules /> : <ModuleTrack />}
      <Launch animated={!reduce} />
    </section>
  );
}

export default AboutUs;