import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router';
import events from "../data/events.json";

function Event() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div id="events" className="relative w-full py-12 px-4 md:px-8 mt-8">
      <div className="max-w-7xl mx-auto flex flex-col justify-center items-center">
        <h1 className="text-4xl uppercase font-black text-center dark:text-white text-black mb-12 border-b-cyan-400 border-b-2 inline-block mx-auto pb-4">
          Our Events
        </h1>

        <div className="relative h-[500px] w-full max-w-4xl aspect-[5/3] rounded-2xl overflow-hidden shadow-2xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}  
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 w-full h-full"
            >
              <div
                className="absolute inset-0 bg-cover bg-top"
                style={{ backgroundImage: `url(${events[currentIndex].imageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2035] via-[#1a2035]/60 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col items-start gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 text-white font-bold uppercase tracking-wider bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 sm:flex hidden"
                >
                  <Calendar className="w-4 h-4" />
                  {events[currentIndex].fullDate}
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-black text-white leading-tight max-w-3xl"
                >
                  {events[currentIndex].title}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to={`/events/${events[currentIndex].code}`}
                    className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/20 flex flex-col items-center justify-center relative overflow-hidden mb-8"
                  >
                    View Details
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicators */}
          <div className="absolute bottom-8 right-8 flex gap-2">
            {events.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-cyan-400 w-8' : 'bg-white/30 hover:bg-white/50'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Event;