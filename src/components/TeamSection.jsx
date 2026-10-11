import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import MemberCard from "./MemberCard";

export default function TeamSection({
  team,
  year,
  hoveredMemberId,
  onHoverMember,
}) {
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

  useEffect(() => {
    if (!selectedMember) return undefined;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [selectedMember]);

  const handleMemberSelect = (memberId) => {
    window.clearTimeout(closeTimerRef.current);
    setIsPopupClosing(false);
    onHoverMember?.(memberId);
  };

  const handleMemberClose = () => {
    if (isPopupClosing) return;

    setIsPopupClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      onHoverMember?.(null);
      setIsPopupClosing(false);
    }, 450);
  };

  useEffect(() => {
    if (!selectedMember) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleMemberClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMember, isPopupClosing]);

  return (
    <div className="w-full h-[90%] flex items-center justify-center p-4 md:p-8 md:h/full">
      {/* Desktop Layout - Centered member grid with popup detail card overlay */}
      <div className="hidden lg:flex max-w-7xl w-full justify-center items-center relative">
        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          {team.members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center text-center w-52"
            >
              <button
                onClick={() => handleMemberSelect(member.id)}
                className={`member-card-border relative w-full h-72 rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-300 outline-none focus:outline-none ${
                  hoveredMemberId === member.id
                    ? "scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400 z-10 bg-cyan-900/40"
                    : "scale-100 opacity-100 bg-slate-900/80 text-gray-200"
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

      </div>

      {/* Mobile Layout - Team grid with overlay detail card popup */}
      <div className="lg:hidden max-w-7xl w-full flex flex-col gap-6 relative">
        <div className="flex justify-center items-center">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-lg mx-auto p-2 md:p-4">
            {team.members.map((member) => {
              const isSelected = hoveredMemberId === member.id;
              return (
                <div
                  key={member.id}
                  className="flex flex-col items-center text-center w-32 md:w-36"
                >
                  <button
                    onClick={() => handleMemberSelect(member.id)}
                    className={`member-card-border relative w-full h-40 md:h-44 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 outline-none focus:outline-none ${
                      isSelected
                        ? "scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400 z-10 bg-cyan-900/40"
                        : "scale-100 opacity-100 bg-slate-900/80 text-gray-200"
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

      </div>

      {selectedMember &&
        createPortal(
          <div
            className={`fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/55 backdrop-blur-sm p-4 popup-overlay ${isPopupClosing ? "popup-overlay-closing" : ""}`}
            onClick={handleMemberClose}
          >
            <div
              className={`flip-card popup-card ${isPopupClosing ? "popup-card-closing" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <MemberCard member={selectedMember} year={year} />
            </div>
          </div>,
          document.body,
        )}

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
          /* card is 2:3, so height = 1.5 x width; keep it inside the viewport */
          width: min(90vw, 420px, 62vh);
        }
        @media (max-width: 1023px) {
          .flip-card {
            width: min(90vw, 360px, 60vh);
          }
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
