import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Mail,
  MapPin,
  Instagram,
  Linkedin,
  Copy,
  Check,
  Rocket,
  Terminal,
  Send,
  ArrowUp,
  ArrowUpRight,
} from "lucide-react";
import { TextHoverEffect } from "./ui/text-hover-effect";
import { SpotlightCard } from "./ui/Spotlight-Card.jsx";
import { OrbitingCircles } from "./ui/orbiting-circles";
import { Starfield } from "./ui/Starfield.jsx";

/* ================================================================== */
/*  Editable content                                                   */
/* ================================================================== */

const EMAIL = "acm-kjsce@somaiya.edu";

const CHANNELS = [
  {
    id: "email",
    icon: Mail,
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    accent: "text-cyan-300",
    copyable: true,
  },
  {
    id: "instagram",
    icon: Instagram,
    label: "Instagram",
    value: "@kjsse_acm",
    href: "https://www.instagram.com/kjsse_acm/",
    accent: "text-pink-400",
  },
  {
    id: "linkedin",
    icon: Linkedin,
    label: "LinkedIn",
    value: "KJSCE ACM Student Chapter",
    href: "https://in.linkedin.com/company/kjsce-acm-student-chapter",
    accent: "text-sky-400",
  },
  {
    id: "location",
    icon: MapPin,
    label: "Find us",
    value: "KJ Somaiya School of Engineering, B-413",
    href: "https://www.google.com/maps/search/?api=1&query=K.+J.+Somaiya+School+of+Engineering",
    accent: "text-violet-300",
  },
];

/* ================================================================== */
/*  Small pieces                                                       */
/* ================================================================== */

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping motion-reduce:animate-none" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
    </span>
  );
}

function ChannelCard({ icon: Icon, label, value, href, accent, copyable }) {
  const [copied, setCopied] = useState(false);
  const external = !href.startsWith("mailto:");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the mailto link still works */
    }
  };

  return (
    <SpotlightCard
      className="h-full rounded-2xl border border-white/10 bg-black/45 backdrop-blur-md"
      innerClassName="flex h-full items-center gap-3 p-4 md:p-5"
    >
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group/link flex min-w-0 flex-1 items-center gap-4 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 ${accent}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">{label}</span>
          <span className="block break-words text-sm font-semibold text-white md:text-[0.95rem]">{value}</span>
        </span>
        {!copyable && (
          <ArrowUpRight
            className="ml-auto h-4 w-4 shrink-0 text-slate-500 transition group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-cyan-300"
            aria-hidden="true"
          />
        )}
      </a>
      {copyable && (
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Email address copied" : "Copy email address"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
        </button>
      )}
    </SpotlightCard>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30";

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300/90">
        {label}
      </label>
      {children}
    </div>
  );
}

// No backend needed: this opens the visitor's email app with everything filled in.
function TransmissionForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [opened, setOpened] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const subject = `KJSSE ACM website: message from ${form.name}`;
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-300">
          <LiveDot />
          <span>{"// Open channel"}</span>
        </div>
        <h3 className="mt-3 text-2xl font-extrabold text-white md:text-3xl">Connect With Us</h3>
        <p className="mt-2 text-sm text-slate-300 md:text-base">
          Questions, collaborations, sponsorships, or just a hello? Mission control is listening.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field id="ct-name" label="Your name">
          <input
            id="ct-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={onChange}
            placeholder="Ada Lovelace"
            className={inputCls}
          />
        </Field>
        <Field id="ct-email" label="Your email">
          <input
            id="ct-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            placeholder="ada@somaiya.edu"
            className={inputCls}
          />
        </Field>
      </div>

      <Field id="ct-message" label="Message">
        <textarea
          id="ct-message"
          name="message"
          required
          rows={5}
          maxLength={1000}
          value={form.message}
          onChange={onChange}
          placeholder="Tell us what's on your mind…"
          className={`${inputCls} resize-y`}
        />
        <div className="mt-1 text-right font-mono text-[10px] tracking-[0.15em] text-slate-500">
          {form.message.length} / 1000
        </div>
      </Field>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-cyan-400 px-7 py-3 font-bold text-black shadow-[0_0_30px_-4px_rgba(34,211,238,0.7)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_0_44px_-2px_rgba(34,211,238,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Launch message
        </button>
        <p aria-live="polite" className="text-xs text-slate-400 md:text-sm">
          {opened ? (
            <>
              Your email app should open with the message ready. If it doesn't, write to{" "}
              <a href={`mailto:${EMAIL}`} className="text-cyan-300 underline underline-offset-2">
                {EMAIL}
              </a>
              .
            </>
          ) : (
            "This opens your email app with the message filled in."
          )}
        </p>
      </div>
    </form>
  );
}

/* ================================================================== */
/*  Section                                                            */
/* ================================================================== */

const Footer = () => {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  // 0 when the section starts entering the screen, 1 when you reach the very bottom.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.35, restDelta: 0.0005 });

  const horizonY = useTransform(p, [0.35, 1], ["112%", "92%"]); // Earth rises: touchdown
  const horizonO = useTransform(p, [0.3, 0.7], [0, 1]);
  const orbitScale = useTransform(p, [0.3, 0.75], [0.8, 1]);
  const orbitO = useTransform(p, [0.28, 0.6], [0, 1]);
  const wordY = useTransform(p, [0.5, 0.95], [70, 0]);
  const wordO = useTransform(p, [0.5, 0.85], [0, 1]);

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: reduce ? 0 : 0.6, delay: reduce ? 0 : delay, ease: "easeOut" },
  });

  const toTop = () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  return (
    <footer ref={ref} id="contact-us" className="relative isolate w-full overflow-hidden pt-24 text-white md:pt-32">
      {/* ---- background: stars that fade in from the site, Earth rising at the bottom ---- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="ct-fade-top absolute inset-0">
          <Starfield progress={reduce ? undefined : p} />
        </div>
        <motion.div
          style={reduce ? { y: "92%" } : { y: horizonY, opacity: horizonO }}
          className="ct-horizon"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">
        {/* Heading, same style as the other sections */}
        <motion.div {...reveal(0)} className="flex flex-col items-center text-center">
          <h2 className="border-b-2 border-cyan-400 px-8 pb-4 text-3xl font-black uppercase text-white md:text-4xl">
            Contact Us
          </h2>
        </motion.div>

        {/* Form + channels */}
        <div className="mt-12 grid gap-6 md:mt-16 md:gap-8 lg:grid-cols-5">
          <motion.div
            {...reveal(0.05)}
            className="relative rounded-3xl border border-white/10 bg-black/50 p-5 backdrop-blur-md md:p-8 lg:col-span-3"
          >
            <span aria-hidden="true" className="ct-beam" />
            <TransmissionForm />
          </motion.div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            {CHANNELS.map((c, i) => (
              <motion.div key={c.id} {...reveal(0.1 + i * 0.08)} className="flex-1">
                <ChannelCard {...c} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Orbit: logo with channels circling it (decorative) */}
        <motion.div
          style={reduce ? undefined : { scale: orbitScale, opacity: orbitO }}
          className="mx-auto mt-20 flex flex-col items-center text-center md:mt-28"
        >
          <div aria-hidden="true" className="relative h-[340px] w-[340px] scale-90 sm:scale-100">
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/25 blur-2xl animate-pulse motion-reduce:animate-none" />
            <img
              src="/logo_withoutbg.png"
              alt=""
              className="absolute left-1/2 top-1/2 h-20 -translate-x-1/2 -translate-y-1/2 object-contain md:h-24"
            />
            <OrbitingCircles radius={100} duration={22} iconSize={42}>
              <Mail className="h-5 w-5 text-cyan-300" />
              <Instagram className="h-5 w-5 text-pink-400" />
              <Linkedin className="h-5 w-5 text-sky-400" />
            </OrbitingCircles>
            <OrbitingCircles radius={146} duration={34} reverse iconSize={34}>
              <Rocket className="h-4 w-4 text-amber-300" />
              <Terminal className="h-4 w-4 text-violet-300" />
              <MapPin className="h-4 w-4 text-cyan-300" />
            </OrbitingCircles>
          </div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300 sm:text-[11px] sm:tracking-[0.28em]">
            {"// Signal received. See you in orbit."}
          </p>
        </motion.div>
      </div>

      {/* Wordmark: light follows your cursor */}
      <motion.div
        style={reduce ? undefined : { y: wordY, opacity: wordO }}
        className="relative z-10 mx-auto mt-14 max-w-6xl px-4 md:mt-20 md:px-8"
      >
        <TextHoverEffect text="KJSSE-ACM" />
      </motion.div>

      {/* Bottom bar */}
      <div className="relative z-10 mt-6 border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-6 text-center md:flex-row md:justify-between md:px-8 md:text-left">
          <div>
            <p className="text-sm font-semibold text-[#e6f2ff]">Made with ❤️ by KJSSE-ACM</p>
            <p className="mt-1 text-xs text-slate-400">© {new Date().getFullYear()} KJSSE-ACM. All rights reserved.</p>
          </div>
          <button
            type="button"
            onClick={toTop}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-black/40 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-200 backdrop-blur-sm transition hover:border-cyan-400/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            Back to launch pad
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;