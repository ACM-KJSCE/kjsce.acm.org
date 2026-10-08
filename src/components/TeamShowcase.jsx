import { useState, useMemo, useEffect, useRef } from "react";
import teams2025_2026 from "../data/teams-2025-2026.json";
import teams2024_2025 from "../data/teams-2024-2025.json";
import teams2026_2027 from "../data/teams-2026-2027.json";
import TeamSection from "./TeamSection";

// Combine the separate year files into a single array
const teamsData = [teams2026_2027, teams2025_2026, teams2024_2025];

const TeamShowcase = () => {
  const [hoveredMemberId, setHoveredMemberId] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [selectedTeamName, setSelectedTeamName] = useState("All teams");
  const sectionRefs = useRef({});

  // Get available years from the data
  const availableYears = useMemo(() => teamsData.map((item) => item.year), []);
  const [selectedYear, setSelectedYear] = useState(availableYears[0] || "");

  // Get teams for the selected year
  const teams = useMemo(() => {
    const selectedYearData = teamsData.find(
      (item) => item.year === selectedYear,
    );
    return selectedYearData?.teamdata || [];
  }, [selectedYear]);

  const visibleTeams = useMemo(() => {
    if (!selectedTeamName || selectedTeamName === "All teams") return teams;
    return teams.filter((team) => team.teamName === selectedTeamName);
  }, [selectedTeamName, teams]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedTeamName("All teams");
    setHoveredMemberId(null);
    setActiveSection(null);
    sectionRefs.current = {};
  };

  // Intersection Observer to track which section is most visible
  useEffect(() => {
    const visibilityMap = new Map();

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        visibilityMap.set(entry.target.id, entry.intersectionRatio);
      });

      // Find the section with the highest visibility ratio
      let maxRatio = 0;
      let mostVisibleId = null;

      visibilityMap.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisibleId = id;
        }
      });

      if (mostVisibleId && maxRatio > 0.2) {
        setActiveSection(mostVisibleId);
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -10% 0px",
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions,
    );

    // Small delay to ensure refs are set
    const timeoutId = setTimeout(() => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) {
          observer.observe(ref);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      visibilityMap.clear();
    };
  }, [teams, selectedYear, visibleTeams]);

  return (
    <div className="relative w-full text-white shadow-lg rounded-lg font-sans selection:text-cyan-100 mt-16 md:mt-20 p-4">
      {/* Year Selection Buttons */}
      <div className="flex justify-center gap-3 flex-wrap mb-6 px-4">
        {availableYears.map((year) => (
          <button
            key={year}
            onClick={() => handleYearChange(year)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${
              selectedYear === year
                ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                : "bg-transparent border-gray-500 text-gray-300 hover:border-cyan-400 hover:text-cyan-400"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Team Selection Buttons */}
      <div className="flex justify-start gap-3 flex-nowrap overflow-x-auto mb-8 px-4 pb-2 snap-x snap-mandatory md:justify-center md:flex-wrap md:overflow-visible md:pb-0">
        <button
          onClick={() => setSelectedTeamName("All teams")}
          aria-pressed={selectedTeamName === "All teams"}
          className={`shrink-0 snap-start rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 border-2 ${
            selectedTeamName === "All teams"
              ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/30"
              : "bg-transparent border-gray-500 text-gray-300 hover:border-cyan-400 hover:text-cyan-400"
          }`}
        >
          All teams
        </button>
        {teams.map((team) => (
          <button
            key={team.teamName}
            onClick={() => setSelectedTeamName(team.teamName)}
            aria-pressed={selectedTeamName === team.teamName}
            className={`shrink-0 snap-start rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 border-2 ${
              selectedTeamName === team.teamName
                ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                : "bg-transparent border-gray-500 text-gray-300 hover:border-cyan-400 hover:text-cyan-400"
            }`}
          >
            {team.teamName}
          </button>
        ))}
      </div>

      {/* Team Sections */}
      <div className="w-full flex flex-col gap-16">
        {visibleTeams.map((team) => (
          <div
            key={team.teamId}
            id={`team-${team.teamId}`}
            ref={(el) => (sectionRefs.current[`team-${team.teamId}`] = el)}
            className="w-full transition-all duration-500 ease-out scale-100 opacity-100"
          >
            <div className="mb-6 text-center">
              <span className="mb-2 block text-xs font-bold tracking-widest uppercase text-cyan-500">
                KJSSE ACM {selectedYear}
              </span>
              <div className="flex justify-center">
                <h3 className="text-2xl md:text-4xl font-black tracking-tight uppercase text-cyan-400 border-b-2 border-cyan-500 pb-2 px-4">
                  {team.teamName}
                </h3>
              </div>
              {team.description && (
                <p className="mx-auto mt-3 max-w-3xl text-sm md:text-lg text-gray-300 font-light leading-relaxed">
                  {team.description}
                </p>
              )}
            </div>
            <TeamSection
              team={team}
              hoveredMemberId={hoveredMemberId}
              onHoverMember={(id) => setHoveredMemberId(id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamShowcase;
