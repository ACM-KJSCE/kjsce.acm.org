import React, { useState } from 'react';
import teams from '../data/teams.json';
import TeamSection from './TeamSection';

const TeamShowcase = () => {
  const [hoveredMemberId, setHoveredMemberId] = useState(null);

  return (
    <div className="relative w-full text-white shadow-lg rounded-lg font-sans selection:text-cyan-100 mt-16 md:mt-20 p-4">
      <div className="w-full flex flex-col gap-16">
        {teams.map((team) => (
          <div key={team.teamId} className="w-full">
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
