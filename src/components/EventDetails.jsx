import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, ExternalLink, Calendar, MapPin, Clock, Award } from "lucide-react";
import events from "../data/events.json";
import PageLayout from "./PageLayout";

function getInitials(name) {
  if (!name) return "SP";
  if (name.startsWith(".")) return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 3).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function splitTitle(title) {
  if (!title) return { line1: "", line2: "" };
  const upper = title.toUpperCase().trim();
  const words = upper.split(" ");
  if (words.length === 1) return { line1: words[0], line2: "" };
  if (words.length === 2) return { line1: words[0], line2: words[1] };
  if (words.length === 3) return { line1: `${words[0]} ${words[1]}`, line2: words[2] };
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(" "),
    line2: words.slice(mid).join(" ")
  };
}

export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const event = events.find((x) => x.code === params.eventName);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [params.eventName]);

  if (!event) {
    return (
      <PageLayout className="text-white flex items-center justify-center min-h-[70vh]">
        <div className="text-center p-10 space-y-4">
          <h2 className="text-3xl font-black text-cyan-400 uppercase">Event Not Found</h2>
          <p className="text-neutral-400 text-sm">The event you are looking for does not exist or has been moved.</p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500 text-black font-bold text-sm uppercase tracking-wider hover:bg-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const { line1, line2 } = splitTitle(event.title);
  const externalLink = event.description
    ? (event.description.match(/https?:\/\/[^\s]+/) || [])[0]
    : null;

  return (
    <PageLayout className="relative w-full text-white selection:bg-cyan-500 selection:text-black">
      {/* Subtle Background Glows matching ACM Site Theme */}
      <div className="h-72 w-32 bg-cyan-500/10 blur-[110px] absolute top-20 left-0 pointer-events-none" />
      <div className="h-72 w-32 bg-blue-600/10 blur-[110px] absolute top-80 right-0 pointer-events-none" />

      <div className="relative z-10 w-full min-h-screen px-4 sm:px-6 lg:px-12 py-8 max-w-[1400px] mx-auto font-sans">
        {/* Top Navigation Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/events")}
            className="group inline-flex items-center gap-2 text-neutral-400 hover:text-cyan-400 font-semibold text-xs tracking-[0.15em] uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1.5 transition-transform" />
            <span>Back to Events</span>
          </button>
        </div>

        {/* Top Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
          {/* Main Title matching Website Typography & Cyan Accents */}
          <div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-[0.92] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              {line1}
              {line2 && <span className="block mt-1 text-cyan-400">{line2}</span>}
            </h1>
          </div>

          {/* Right Header Metadata */}
          <div className="flex flex-col items-start lg:items-end text-left lg:text-right shrink-0">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.2em] mb-1.5">
              {event.headerCategory || event.theme || "FLAGSHIP EVENT"}
            </span>
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {event.headerDate || event.fullDate}
            </div>
            <div className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
              {event.headerVenue || (event.venue ? `${event.venue} · KJSSE Mumbai` : "KJSSE Mumbai")}
            </div>
          </div>
        </header>

        {/* Horizontal Full-Width Rule */}
        <div className="w-full border-b border-white/10 my-8 md:my-10" />

        {/* 3-Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* ========================================================= */}
          {/* COLUMN 1: Left Column (Sponsors & Duration)               */}
          {/* ========================================================= */}
          <aside className="lg:col-span-3 lg:border-r lg:border-white/10 lg:pr-8 space-y-8">
            {/* Sponsors Section */}
            <div>
              <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <span>Event Sponsors</span>
              </h2>

              {event.sponsors && event.sponsors.length > 0 ? (
                <div className="space-y-4">
                  {event.sponsors.map((sponsor, index) => (
                    <div key={index} className="flex items-center gap-3.5 group">
                      <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center p-1.5 shrink-0 overflow-hidden text-cyan-400 font-black text-xs uppercase shadow-inner group-hover:border-cyan-400 transition-colors">
                        {sponsor.url ? (
                          <img
                            src={sponsor.url}
                            alt={sponsor.name}
                            className="max-h-full max-w-full object-contain filter brightness-95 contrast-125"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextSibling) {
                                e.currentTarget.nextSibling.style.display = 'block';
                              }
                            }}
                          />
                        ) : null}
                        <span className={sponsor.url ? "hidden" : "block"}>
                          {getInitials(sponsor.name)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-200 group-hover:text-cyan-400 transition-colors truncate">
                          {sponsor.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-neutral-900/60 border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-cyan-400 font-black text-xs">
                    ACM
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-200">KJSCE ACM Chapter</p>
                    <p className="text-[11px] text-neutral-400">Official Student Wing</p>
                  </div>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="border-t border-white/10" />

            {/* Duration Section */}
            <div>
              <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-2">
                Duration
              </h2>
              <div className="text-3xl font-black text-white tracking-tight">
                {event.duration || event.time || "24 Hours"}
              </div>
              <p className="text-xs text-neutral-400 font-medium mt-1">
                {event.durationSub || "Continuous building"}
              </p>
            </div>

            {/* Venue / Campus Info */}
            {event.venue && (
              <>
                <div className="border-t border-white/10" />
                <div>
                  <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-2">
                    Venue
                  </h2>
                  <div className="text-base font-bold text-white">
                    {event.venue}
                  </div>
                  <p className="text-xs text-neutral-400 font-medium mt-0.5">
                    KJSSE Campus, Mumbai
                  </p>
                </div>
              </>
            )}
          </aside>

          {/* ========================================================= */}
          {/* COLUMN 2: Center Column (Status, Event Photo & About)     */}
          {/* ========================================================= */}
          <main className="lg:col-span-6 space-y-8">
            {/* Status / Announcement Box Card */}
            <section className="rounded-2xl p-6 sm:p-7 bg-neutral-900/60 border border-cyan-500/30 shadow-lg shadow-cyan-500/5 backdrop-blur-md relative overflow-hidden">
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.2em] mb-2.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>{event.statusTag || "EVENT COMPLETE"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3">
                {event.statusTitle || "THANK YOU FOR JOINING"}
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                {event.statusMessage ||
                  "The flagship event by KJSCE ACM Student Chapter has concluded. We hope you enjoyed the journey into sustainability-focused innovation."}
              </p>
            </section>

            {/* Event Photo / Gallery Frame */}
            <section className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-950">
              <div className="relative aspect-[16/10] w-full overflow-hidden group">
                <img
                  src={event.photoUrl || event.imageUrl || "/team.jpg"}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                  draggable={false}
                />
              </div>
              <div className="px-5 py-3.5 bg-black/60 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 font-medium">
                <span>{event.photoCaption || `${event.title} · The closing frame`}</span>
                <span className="text-cyan-400 font-semibold">{event.location || "Mumbai, India"}</span>
              </div>
            </section>

            {/* About Event Section */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em]">
                About Event
              </h2>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                {event.aboutTitle || `BUILDING BEYOND ${event.title.toUpperCase()}`}
              </h3>
              
              <div className="text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4">
                {event.aboutLead && (
                  <p className="text-neutral-200 font-medium">{event.aboutLead}</p>
                )}
                {event.aboutDetails && (
                  <p>{event.aboutDetails}</p>
                )}
                {!event.aboutLead && event.description && (
                  <div className="whitespace-pre-line text-neutral-300">
                    {event.description}
                  </div>
                )}
              </div>
            </section>

            {/* Additional Gallery if available */}
            {event.gallery && event.gallery.length > 0 && (
              <section className="pt-6 border-t border-white/10 space-y-4">
                <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em]">
                  Event Moments
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.gallery.map((img, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-white/10 shadow-lg group">
                      <img
                        src={img}
                        alt={`Event moment ${idx + 1}`}
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* ========================================================= */}
          {/* COLUMN 3: Right Column (Focus, Quote & Links)             */}
          {/* ========================================================= */}
          <aside className="lg:col-span-3 lg:border-l lg:border-white/10 lg:pl-8 space-y-8">
            {/* Event Focus Section */}
            <div>
              <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-3">
                Event Focus
              </h2>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-3">
                {event.focusTitle || event.theme || "THE REGENERATION ARC"}
              </h3>
              <div className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line space-y-3">
                {event.focusText || (
                  <p>
                    A challenge centered on rebuilding essential systems with resilience, adaptability, and long-term sustainability in mind.
                  </p>
                )}
              </div>
            </div>

            {/* Highlight Quote Box */}
            <div className="border-l-4 border-cyan-400 pl-4 py-3 bg-neutral-900/60 border-y border-r border-white/5 rounded-r-xl shadow-md">
              <p className="text-cyan-400 font-black text-base sm:text-lg uppercase tracking-tight leading-snug">
                {event.quote || "BUILD WHAT LASTS WHEN OLD SYSTEMS FAIL."}
              </p>
              <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold mt-2">
                {event.quoteSub || event.title.toUpperCase()}
              </p>
            </div>

            {/* External Links & Actions */}
            <div className="space-y-3 pt-2">
              {externalLink && (
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 border border-cyan-400/40 hover:border-cyan-400 text-cyan-300 hover:text-black font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md group"
                >
                  <span>Visit Official Site</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}

              <button
                onClick={() => navigate("/events")}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300"
              >
                <span>Explore All Events</span>
              </button>
            </div>
          </aside>

        </div>
      </div>
    </PageLayout>
  );
}
