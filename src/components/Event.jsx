import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Award
} from 'lucide-react';
import { Link } from 'react-router';
import events from '../data/events.json';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

// Individual Event Card with Dynamic Viewport Scroll Expand & Zoom In/Out
function EventCard({ event, index, totalEvents, onEnterView }) {
  const cardRef = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const scrimRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!card || !frame || !media) return;

    let raf = 0;
    let currentP = 0;
    let targetP = 0;

    const read = () => {
      const rect = card.getBoundingClientRect();
      const H = window.innerHeight;
      const cardCenter = rect.top + rect.height / 2;
      const screenCenter = H / 2;

      // Distance from screen center (normalized by 55% of viewport height)
      const dist = Math.abs(cardCenter - screenCenter) / (H * 0.55);
      const rawP = clamp(1 - dist, 0, 1);
      const progress = smoothstep(0, 1, rawP);

      if (progress > 0.4 && onEnterView) {
        onEnterView(index);
      }

      return progress;
    };

    const update = (p) => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      const minW = isMobile ? 90 : isTablet ? 75 : 62; // %
      const maxW = isMobile ? 98 : isTablet ? 95 : 94; // %
      const minH = isMobile ? 440 : isTablet ? 480 : 500; // px
      const maxH = isMobile ? 540 : isTablet ? 580 : 600; // px
      const minR = 24; // px
      const maxR = isMobile ? 16 : 14; // px

      const w = minW + (maxW - minW) * p;
      const h = minH + (maxH - minH) * p;
      const r = minR + (maxR - minR) * p;
      const scale = 1.35 + (1.0 - 1.35) * p;

      frame.style.width = `${w}%`;
      frame.style.height = `${h}px`;
      frame.style.borderRadius = `${r}px`;
      media.style.transform = `scale(${scale})`;

      if (scrimRef.current) {
        scrimRef.current.style.opacity = `${0.35 + 0.3 * p}`;
      }

      if (titleRef.current) {
        // Resting title fades out as card expands
        const tOut = smoothstep(0.1, 0.45, p);
        titleRef.current.style.opacity = `${1 - tOut}`;
        titleRef.current.style.transform = `translate3d(0, ${-20 * tOut}px, 0)`;
      }

      if (overlayRef.current) {
        // Overlay details fade in as card expands
        const oIn = smoothstep(0.35, 0.75, p);
        overlayRef.current.style.opacity = `${oIn}`;
        overlayRef.current.style.transform = `translate3d(0, ${20 * (1 - oIn)}px, 0)`;
        overlayRef.current.style.pointerEvents = oIn > 0.5 ? 'auto' : 'none';
      }
    };

    const tick = () => {
      currentP += (targetP - currentP) * 0.12;
      update(currentP);
      if (Math.abs(targetP - currentP) > 0.0005) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      targetP = read();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    targetP = read();
    currentP = targetP;
    update(currentP);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [index, onEnterView]);

  const externalLink = event.description
    ? (event.description.match(/https?:\/\/[^\s]+/) || [])[0]
    : null;

  const eventNumberStr = (index + 1).toString().padStart(2, '0');
  const totalEventsStr = totalEvents.toString().padStart(2, '0');

  return (
    <div
      ref={cardRef}
      id={`event-card-${index}`}
      className="w-full flex justify-center items-center py-10 md:py-16"
    >
      {/* Dynamic Expanding / Contracting Frame */}
      <div
        ref={frameRef}
        className="relative overflow-hidden shadow-2xl transition-[width,height,border-radius] duration-75 ease-out border border-white/15 hover:border-cyan-400/50 bg-neutral-950 flex items-center justify-center group"
        style={{
          width: '62%',
          height: '500px',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 35px rgba(34, 211, 238, 0.15)'
        }}
      >
        {/* Background Image */}
        <img
          ref={mediaRef}
          src={event.imageUrl}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-75 ease-out origin-center select-none pointer-events-none"
          draggable={false}
        />

        {/* High-Contrast Gradient Scrim Overlay */}
        <div
          ref={scrimRef}
          className="absolute inset-0 pointer-events-none transition-opacity duration-150"
          style={{
            background:
              'linear-gradient(135deg, rgba(5, 8, 16, 0.82) 0%, rgba(5, 8, 16, 0.4) 50%, rgba(5, 8, 16, 0.8) 100%)',
            opacity: 0.4
          }}
        />

        {/* Resting Title & Cue (Visible when card is not expanded) */}
        <div
          ref={titleRef}
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none z-10"
        >
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/25 text-cyan-300 text-xs font-bold border border-cyan-400/40 uppercase tracking-widest mb-3 backdrop-blur-md shadow-lg">
            Event {eventNumberStr} of {totalEventsStr}
          </span>
          <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] max-w-xl">
            {event.title}
          </h3>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-200 font-medium tracking-wider uppercase bg-black/50 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-md">
            <span>Scroll to expand</span>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
          </div>
        </div>

        {/* Expanded Details Overlay (Left: Title & Details, Right: Big Plain Underlined Button & Sponsors) */}
        <div
          ref={overlayRef}
          className="absolute inset-0 flex items-center justify-center p-6 md:p-10 lg:p-14 z-20 opacity-0 pointer-events-none overflow-y-auto"
        >
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: Badges, Title, Metadata Chips */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Top Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-cyan-400/25 text-cyan-300 text-xs md:text-sm font-bold border border-cyan-400/50 tracking-wider uppercase backdrop-blur-md shadow-sm">
                  Event {eventNumberStr} / {totalEventsStr}
                </span>
                {event.day && (
                  <span className="px-3 py-1 rounded-full bg-black/50 text-white text-xs md:text-sm font-semibold border border-white/20 backdrop-blur-md">
                    {event.day}
                  </span>
                )}
              </div>

              {/* Main Event Title */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] leading-tight">
                {event.title}
              </h2>

              {/* Metadata Chips: Date, Time, Venue */}
              <div className="flex flex-col gap-2.5 w-full">
                {event.fullDate && (
                  <div className="flex items-center gap-2.5 bg-black/55 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white text-xs md:text-sm font-semibold shadow-md">
                    <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{event.fullDate}</span>
                  </div>
                )}
                {event.time && (
                  <div className="flex items-center gap-2.5 bg-black/55 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white text-xs md:text-sm font-semibold shadow-md">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.venue && (
                  <div className="flex items-center gap-2.5 bg-black/55 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white text-xs md:text-sm font-semibold shadow-md">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{event.venue}</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Big Plain Underlined Button & Sponsors */}
            <div className="lg:col-span-6 flex flex-col justify-center items-start lg:items-end gap-6 text-left lg:text-right">
              {/* Big Plain Underlined Button */}
              <div className="flex flex-col items-start lg:items-end gap-4 pointer-events-auto">
                <Link
                  to={`/events/${event.code}`}
                  className="group inline-flex items-center gap-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white hover:text-cyan-300 underline underline-offset-8 md:underline-offset-[12px] decoration-cyan-400 decoration-2 md:decoration-4 hover:decoration-cyan-300 transition-all duration-300 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-cyan-400 group-hover:translate-x-3 transition-transform duration-300 shrink-0" />
                </Link>

                {externalLink && (
                  <a
                    href={externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm sm:text-base md:text-lg font-bold text-neutral-300 hover:text-white underline underline-offset-4 decoration-white/40 hover:decoration-cyan-400 transition-all duration-300 drop-shadow-md"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </a>
                )}
              </div>

              {/* Sponsors Section */}
              {event.sponsors && event.sponsors.length > 0 && (
                <div className="bg-black/50 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl flex flex-wrap items-center gap-2.5 shadow-md pointer-events-auto mt-2">
                  <span className="text-neutral-200 text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 mr-1">
                    <Award className="w-3.5 h-3.5 text-cyan-400" /> Sponsors:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {event.sponsors.slice(0, 4).map((sponsor, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/15 flex items-center gap-2"
                      >
                        <img
                          src={sponsor.url}
                          alt={sponsor.name}
                          className="h-4 w-auto max-w-[55px] object-contain"
                          draggable={false}
                        />
                        <span className="text-xs text-white font-medium">{sponsor.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Event() {
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollToEvent = (index) => {
    const el = document.getElementById(`event-card-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div id="events" className="relative w-full text-white select-none">
      {/* Top Header Section */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-4 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-4xl font-black uppercase tracking-tight text-white mb-10">
          Our <span className="text-cyan-400">Events</span>
        </h1>

        {/* Quick Navigation Pills matching Team Showcase Style */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl mx-auto px-4">
          {events.map((ev, idx) => (
            <button
              key={idx}
              onClick={() => scrollToEvent(idx)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 border-2 ${activeIdx === idx
                  ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-transparent border-gray-500 text-gray-300 hover:border-cyan-400 hover:text-cyan-400'
                }`}
            >
              {ev.title}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Desktop Side Indicator Dock */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3 pointer-events-auto">
        <div className="bg-black/70 backdrop-blur-xl border border-white/15 p-3 rounded-2xl flex flex-col gap-3 shadow-2xl">
          {events.map((ev, idx) => (
            <button
              key={idx}
              onClick={() => scrollToEvent(idx)}
              className="group relative flex items-center justify-end"
              aria-label={`Jump to ${ev.title}`}
            >
              <span className="absolute right-8 px-3 py-1 bg-neutral-900/95 text-neutral-200 text-xs font-medium rounded-lg border border-white/15 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {ev.title} ({ev.fullDate?.split(',')[0] || ev.month})
              </span>
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIdx === idx
                    ? 'bg-cyan-400 scale-125 ring-4 ring-cyan-400/30'
                    : 'bg-white/20 hover:bg-white/50'
                  }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Render ALL 7 Events as Scroll Expand Cards */}
      <div className="relative w-full flex flex-col items-center">
        {events.map((event, idx) => (
          <EventCard
            key={event.code || idx}
            event={event}
            index={idx}
            totalEvents={events.length}
            onEnterView={setActiveIdx}
          />
        ))}
      </div>

      {/* Clean Plain Back to Top Button */}
      <div className="w-full flex justify-center items-center py-16">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="rounded-full px-6 py-2.5 text-sm font-semibold border-2 border-gray-500 bg-transparent text-gray-300 hover:text-white hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300"
        >
          Back to Top ↑
        </button>
      </div>
    </div>
  );
}

export default Event;