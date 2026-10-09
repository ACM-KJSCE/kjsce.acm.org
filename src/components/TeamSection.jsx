import { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";

const pastelColors = [
  "bg-pink-500 text-pink-300 border-pink-500/50",
  "bg-blue-500/20 text-blue-300 border-blue-500/50",
  "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
  "bg-purple-500/20 text-purple-300 border-purple-500/50",
  "bg-orange-500/20 text-orange-300 border-orange-500/50",
  "bg-red-500/20 text-red-300 border-red-500/50",
  "bg-teal-500/20 text-teal-300 border-teal-500/50",
  "bg-indigo-500/20 text-indigo-300 border-indigo-500/50",
  "bg-lime-500/20 text-lime-300 border-lime-500/50",
];

const scrollMobilePopupToCenter = (card) => {
  if (!card) return;

  const cardRect = card.getBoundingClientRect();
  const cardCenterY = cardRect.top + cardRect.height / 2;
  const viewport = window.visualViewport;
  const viewportMidpoint =
    (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight) / 2;
  const diff = cardCenterY - viewportMidpoint;

  if (Math.abs(diff) > 1) {
    window.scrollBy({
      top: diff,
      behavior: "smooth",
    });
  }
};

export default function TeamSection({
  team,
  hoveredMemberId,
  onHoverMember,
}) {
  const mobilePopupCardRef = useRef(null);
  const closeTimerRef = useRef(null);
  const [isPopupClosing, setIsPopupClosing] = useState(false);
  const selectedMember = hoveredMemberId
    ? team.members.find((m) => m.id === hoveredMemberId)
    : null;

  useEffect(
    () => () => {
      window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const handleMemberSelect = (memberId) => {
    window.clearTimeout(closeTimerRef.current);
    setIsPopupClosing(false);
    onHoverMember?.(memberId);

    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() =>
        scrollMobilePopupToCenter(mobilePopupCardRef.current),
      );
      return;
    }

    requestAnimationFrame(() => {
      const overlay = [...document.querySelectorAll(".popup-overlay")].find(
        (element) => window.getComputedStyle(element).display !== "none",
      );
      const card = overlay?.querySelector(".popup-card");

      if (!card) return;

      const cardRect = card.getBoundingClientRect();
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const viewport = window.visualViewport;
      const viewportMidpoint =
        (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight) / 2;
      const diff = cardCenterY - viewportMidpoint;

      if (Math.abs(diff) > 1) {
        window.scrollBy({
          top: diff,
          behavior: "smooth",
        });
      }
    });
  };

  const handleMemberClose = () => {
    if (isPopupClosing) return;

    setIsPopupClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      onHoverMember?.(null);
      setIsPopupClosing(false);
    }, 450);
  };

  return (
    <div className="w-full h-[90%] flex items-center justify-center p-4 md:p-8 md:h/full">
      {/* Desktop Layout - Centered member grid with popup detail card overlay */}
      <div className="hidden lg:flex max-w-7xl w-full justify-center items-center min-h-[500px] relative">
        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          {team.members.map((member, index) => (
            <div
              key={member.id}
              className="flex flex-col items-center text-center w-52"
            >
              <button
                onClick={() => handleMemberSelect(member.id)}
                className={`w-full h-72 rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-300 border-2 outline-none focus:outline-none ${
                  hoveredMemberId === member.id
                    ? "scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400 z-10 bg-cyan-900/40 border-cyan-400"
                    : `scale-100 opacity-100 ${pastelColors[index % pastelColors.length]}`
                }`}
                aria-label={`View ${member.name}'s details`}
                aria-pressed={hoveredMemberId === member.id}
                title={`${member.name}${member.role ? ` — ${member.role}` : ""}`}
              >
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-3xl font-bold">
                    {member.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                )}
              </button>
              <div className="mt-3 w-full">
                <p className="text-base font-semibold text-white">{member.name}</p>
                {member.role && <p className="text-sm text-gray-400">{member.role}</p>}
              </div>
            </div>
          ))}
        </div>

        {selectedMember && (
          <div
            className={`absolute inset-0 z-20 flex items-center justify-center bg-slate-950/55 backdrop-blur-sm p-4 popup-overlay ${isPopupClosing ? "popup-overlay-closing" : ""}`}
            onClick={handleMemberClose}
          >
            <div
              className={`flip-card popup-card ${isPopupClosing ? "popup-card-closing" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flip-card-inner is-flipped">
                <div className="flip-card-front">
                  <div className="w-full h-full bg-[#16182e] rounded-[28px] border border-white/10 shadow-2xl overflow-hidden">
                    <img
                      src={selectedMember.imageUrl}
                      alt={selectedMember.name}
                      className="w-full h-80 object-cover"
                    />
                    <div className="p-6 text-center">
                      <h3 className="text-3xl font-bold text-white">{selectedMember.name}</h3>
                      <p className="mt-2 text-xl text-cyan-400">{selectedMember.role}</p>
                    </div>
                  </div>
                </div>

                <div className="flip-card-back">
                  <div className="w-full h-full bg-[#16182e] rounded-[28px] border border-cyan-500/30 shadow-2xl p-6 relative overflow-hidden">
                    <button
                      className="absolute top-4 right-4 text-2xl text-white/80 hover:text-white"
                      onClick={handleMemberClose}
                      aria-label="Close member details"
                    >
                      &times;
                    </button>

                    <div className="flex justify-center mb-4">
                      <img
                        src={selectedMember.imageUrl}
                        alt={selectedMember.name}
                        className="w-28 h-28 rounded-2xl object-cover border-2 border-cyan-400/60"
                      />
                    </div>

                    <h3 className="text-3xl font-bold text-white text-center">{selectedMember.name}</h3>
                    <p className="text-lg text-cyan-400 text-center mt-2">{selectedMember.role}</p>

                    <blockquote className="mt-5 text-lg italic text-gray-200 text-center leading-relaxed">
                      &ldquo;{selectedMember.quote}&rdquo;
                    </blockquote>

                    {selectedMember.bio && (
                      <p className="mt-4 text-sm text-gray-300 text-center leading-relaxed">
                        {selectedMember.bio}
                      </p>
                    )}

                    {selectedMember.links && (
                      <div className="mt-6 flex justify-center gap-4 text-2xl">
                        {selectedMember.links.github && (
                          <a href={selectedMember.links.github} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-110">
                            <FaGithub />
                          </a>
                        )}
                        {selectedMember.links.linkedin && (
                          <a href={selectedMember.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:scale-110">
                            <FaLinkedin />
                          </a>
                        )}
                        {selectedMember.links.leetcode && (
                          <a href={selectedMember.links.leetcode} target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:text-yellow-400 transition-colors duration-300 hover:scale-110">
                            <SiLeetcode />
                          </a>
                        )}
                        {selectedMember.links.codeforces && (
                          <a href={selectedMember.links.codeforces} target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:scale-110">
                            <img src="/assets/cfc.svg" alt="CodeForces" className="w-7 h-7" />
                          </a>
                        )}
                        {selectedMember.links.codechef && (
                          <a href={selectedMember.links.codechef} target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:scale-110">
                            <img src="/assets/cc.jpeg" alt="CodeChef" className="w-7 h-7 rounded-full" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Layout - Team grid with overlay detail card popup */}
      <div className="lg:hidden max-w-7xl w-full flex flex-col gap-6 relative">
        <div className="flex justify-center items-center">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-lg mx-auto p-2 md:p-4">
            {team.members.map((member, index) => {
              const isSelected = hoveredMemberId === member.id;
              return (
                <div
                  key={member.id}
                  className="flex flex-col items-center text-center w-32 md:w-36"
                >
                  <button
                    onClick={() => handleMemberSelect(member.id)}
                    className={`w-full h-40 md:h-44 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 border-2 outline-none focus:outline-none ${
                      isSelected
                        ? "scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400 z-10 bg-cyan-900/40 border-cyan-400"
                        : `scale-100 opacity-100 ${pastelColors[index % pastelColors.length]}`
                    }`}
                    aria-label={`View ${member.name}'s details`}
                    aria-pressed={isSelected}
                    title={`${member.name}${member.role ? ` — ${member.role}` : ""}`}
                  >
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-base md:text-2xl font-bold">
                        {member.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </button>
                  <div className="mt-2 w-full">
                    <p
                      className={`text-[10px] md:text-sm font-semibold ${isSelected ? "text-white" : "text-gray-200"}`}
                    >
                      {member.name}
                    </p>
                    {member.role && (
                      <p className="text-[8px] md:text-xs text-gray-400">
                        {member.role}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedMember && (
          <div
            className={`absolute inset-0 z-20 flex items-center justify-center bg-slate-950/55 backdrop-blur-sm p-4 popup-overlay ${isPopupClosing ? "popup-overlay-closing" : ""}`}
            onClick={handleMemberClose}
          >
            <div
              ref={mobilePopupCardRef}
              className={`flip-card flip-card-mobile popup-card ${isPopupClosing ? "popup-card-closing" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flip-card-inner is-flipped">
                <div className="flip-card-front">
                  <div className="w-full h-full bg-[#16182e] rounded-[24px] border border-white/10 shadow-2xl overflow-hidden">
                    <img
                      src={selectedMember.imageUrl}
                      alt={selectedMember.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-5 text-center">
                      <h3 className="text-2xl font-bold text-white">{selectedMember.name}</h3>
                      <p className="mt-2 text-base text-cyan-400">{selectedMember.role}</p>
                    </div>
                  </div>
                </div>

                <div className="flip-card-back">
                  <div className="w-full h-full bg-[#16182e] rounded-[24px] border border-cyan-500/30 shadow-2xl p-5 relative overflow-hidden">
                    <button
                      className="absolute top-3 right-3 text-xl text-white/80 hover:text-white"
                      onClick={handleMemberClose}
                      aria-label="Close member details"
                    >
                      &times;
                    </button>

                    <div className="flex justify-center mb-3">
                      <img
                        src={selectedMember.imageUrl}
                        alt={selectedMember.name}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400/60"
                      />
                    </div>

                    <h3 className="text-2xl font-bold text-white text-center">{selectedMember.name}</h3>
                    <p className="text-base text-cyan-400 text-center mt-1">{selectedMember.role}</p>

                    <blockquote className="mt-4 text-base italic text-gray-200 text-center leading-relaxed">
                      &ldquo;{selectedMember.quote}&rdquo;
                    </blockquote>

                    {selectedMember.bio && (
                      <p className="mt-3 text-xs text-gray-300 text-center leading-relaxed">
                        {selectedMember.bio}
                      </p>
                    )}

                    {selectedMember.links && (
                      <div className="mt-4 flex justify-center gap-3 text-xl">
                        {selectedMember.links.github && (
                          <a href={selectedMember.links.github} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-110">
                            <FaGithub />
                          </a>
                        )}
                        {selectedMember.links.linkedin && (
                          <a href={selectedMember.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:scale-110">
                            <FaLinkedin />
                          </a>
                        )}
                        {selectedMember.links.leetcode && (
                          <a href={selectedMember.links.leetcode} target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:text-yellow-400 transition-colors duration-300 hover:scale-110">
                            <SiLeetcode />
                          </a>
                        )}
                        {selectedMember.links.codeforces && (
                          <a href={selectedMember.links.codeforces} target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:scale-110">
                            <img src="/assets/cfc.svg" alt="CodeForces" className="w-5 h-5" />
                          </a>
                        )}
                        {selectedMember.links.codechef && (
                          <a href={selectedMember.links.codechef} target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:scale-110">
                            <img src="/assets/cc.jpeg" alt="CodeChef" className="w-5 h-5 rounded-full" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .popup-overlay {
          animation: popupFadeIn 0.25s ease-out forwards;
        }
        .popup-overlay-closing {
          animation: popupFadeOut 0.45s ease-in forwards;
        }
        .popup-card {
          animation: popupFlipIn 1.15s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .popup-card-closing {
          animation: popupFlipOut 0.45s cubic-bezier(0.55, 0, 1, 0.45) forwards;
          pointer-events: none;
        }
        .flip-card {
          perspective: 2000px;
          width: min(90vw, 420px);
          height: 560px;
        }
        .flip-card-mobile {
          width: min(90vw, 360px);
          height: 500px;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s ease;
          transform-style: preserve-3d;
        }
        .flip-card-inner.is-flipped {
          transform: rotateY(180deg);
        }
        .flip-card-front,
        .flip-card-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 28px;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes popupFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes popupFadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        @keyframes popupFlipIn {
          0% {
            opacity: 0.3;
            transform: perspective(1400px) scale(0.82) rotateY(-105deg);
          }
          55% {
            opacity: 1;
            transform: perspective(1400px) scale(1.04) rotateY(16deg);
          }
          78% {
            transform: perspective(1400px) scale(0.99) rotateY(-7deg);
          }
          100% {
            opacity: 1;
            transform: perspective(1400px) scale(1) rotateY(0deg);
          }
        }
        @keyframes popupFlipOut {
          from {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
          to {
            opacity: 0;
            transform: scale(0.86) rotateY(90deg);
          }
        }
      `}</style>
    </div>
  );
}
