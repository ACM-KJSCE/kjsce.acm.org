import { useParams, useNavigate } from "react-router";
import events from "../data/events.json";
import { MoveLeft, Calendar, MapPin, Clock, Tag } from "lucide-react";

export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const event = events.find((x) => x.code === params.eventName);

  if (!event)
    return <div className="text-white text-center p-10">Event not found</div>;

  return (
    <div className="min-h-screen bg-black/40 shadow-lg ring-1 ring-white/5 text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <BackButton navigate={navigate} />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-6">
          {/* Left Column - Sidebar */}
          <div className="w-full lg:w-[350px] shrink-0 space-y-8">
            {/* Event Poster */}
            <div className="w-full">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full rounded-xl shadow-lg border border-white/10"
                draggable={false}
              />
            </div>

            {/* Sponsors Section */}
            {event.sponsors && event.sponsors.length > 0 && (
              <div className="rounded-xl border border-white/5 shadow-inner">
                <h3 className="text-gray-400 font-bold mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
                  Proud Sponsors
                </h3>
                <div className="flex flex-col gap-3">
                  {event.sponsors.map((sponsor, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-all duration-300 border border-white/5 hover:border-white/20"
                    >
                      <div className="h-auto w-16 rounded-lg flex items-center justify-center">
                        <img
                          src={sponsor.url}
                          alt={sponsor.name}
                          className="max-h-full max-w-full object-contain"
                          draggable={false}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm group-hover:text-cyan-300 transition-colors">
                          {sponsor.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Main Content */}
          <div className="flex-1">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              {event.title}
            </h1>

            {/* Event Meta Data */}
            <div className="space-y-6 mb-10">
              {/* Date & Time */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-white/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <div className="font-semibold text-lg">{event.fullDate}</div>
                  <div className="text-gray-400">{event.time}</div>
                </div>
              </div>

              {/* Venue */}
              {event.venue && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-white/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-gray-200" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg flex items-center gap-2">
                      {event.venue}
                    </div>
                    <div className="text-gray-400">
                      KJSSE, Mumbai, Maharashtra
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status Card */}
            <div className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 border border-white/5 hover:border-white/20 flex flex-col items-center justify-center relative overflow-hidden mb-8">
              <h3 className="text-xl font-bold mb-1">Thank You for Joining</h3>
              <p className="text-gray-400 text-sm">
                We hope you enjoyed the event!
              </p>
            </div>

            {/* About Section */}
            <div>
              <h2 className="text-gray-400 font-semibold mb-4 text-sm uppercase tracking-wider">
                About Event
              </h2>
              <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
                <h3 className="text-xl font-semibold text-white mb-2 uppercase tracking-wide">
                  {event.title.toUpperCase()}
                </h3>
                {event.description}
              </div>
            </div>

            {/* Gallery Section if exists */}
            {event.gallery && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <h2 className="text-2xl font-bold mb-6">Event Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.gallery.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      className="rounded-lg hover:scale-105 transition-transform duration-300 border border-white/10"
                      alt="Gallery"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BackButton({ navigate }) {
  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
    >
      <div className="p-1 rounded-full group-hover:bg-white/10 transition-colors">
        <MoveLeft className="w-5 h-5" />
      </div>
      <span className="font-medium">Back to Events</span>
    </button>
  );
}
