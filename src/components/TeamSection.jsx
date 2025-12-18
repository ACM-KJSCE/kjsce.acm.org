import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { SiLeetcode, SiCodeforces, SiCodechef } from 'react-icons/si';

const pastelColors = [
    'bg-pink-500/20 text-pink-300 border-pink-500/50',
    'bg-blue-500/20 text-blue-300 border-blue-500/50',
    'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    'bg-purple-500/20 text-purple-300 border-purple-500/50',
    'bg-orange-500/20 text-orange-300 border-orange-500/50',
    'bg-red-500/20 text-red-300 border-red-500/50',
    'bg-teal-500/20 text-teal-300 border-teal-500/50',
    'bg-indigo-500/20 text-indigo-300 border-indigo-500/50',
    'bg-lime-500/20 text-lime-300 border-lime-500/50',
];

const TeamSection = React.memo(({ team, isActive, direction }) => {
    const [selectedMember, setSelectedMember] = useState(null);
    useEffect(() => {
        if (isActive) {
            setSelectedMember(null);
        }
    }, [isActive]);
    return (
        <div className="w-full h-[90%] flex items-center justify-center p-8 md:h-full">
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="flex flex-col space-y-6 lg:pr-12 order-2 lg:order-1 text-left justify-center min-h-[300px] md:min-h-[400px]">

                    {!selectedMember ? (
                        <div className="animate-fade-in-up">
                            <div className="flex items-baseline space-x-2 mb-4">
                                <span className="text-sm font-bold tracking-widest uppercase text-cyan-500">Team Focus</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-none mb-4 md:mb-6 drop-shadow-2xl">
                                {team.teamName}
                            </h2>
                            <p className="text-lg md:text-2xl lg:text-3xl text-gray-300 font-light leading-relaxed border-l-4 border-cyan-500 pl-4 md:pl-6">
                                {team.description}
                            </p>
                        </div>
                    ) : (
                        <div key={selectedMember.id} className="animate-fade-in-up">
                            <div className="flex items-baseline space-x-2 mb-2">
                                <span className="text-sm font-bold tracking-widest uppercase text-gray-500 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => setSelectedMember(null)}>{team.teamName}</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-none mb-2 drop-shadow-lg">
                                {selectedMember.name}
                            </h2>
                            <p className="text-lg md:text-xl lg:text-2xl text-cyan-400 font-medium mb-6 md:mb-8">
                                {selectedMember.role}
                            </p>

                            <blockquote className="text-xl md:text-2xl lg:text-3xl font-serif italic text-gray-300 mb-6 leading-relaxed border-l-4 border-cyan-500 pl-4 md:pl-6">
                                "{selectedMember.quote}"
                            </blockquote>

                            <p className="text-gray-400 leading-relaxed text-base md:text-lg max-w-xl mb-6">
                                {selectedMember.bio}
                            </p>

                            {/* Social Links */}
                            {selectedMember.links && (
                                <div className="flex gap-5 text-2xl md:text-3xl">
                                    {selectedMember.links.github && (
                                        <a href={selectedMember.links.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110">
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
                                        <a href={selectedMember.links.codeforces} target="_blank" rel="noopener noreferrer" className=" transition-colors duration-300 hover:scale-110">
                                            <img src="./assets/cfc.svg" alt="CodeForces" className="w-8 h-8" />
                                        </a>
                                    )}
                                    {selectedMember.links.codechef && (
                                        <a href={selectedMember.links.codechef} target="_blank" rel="noopener noreferrer" className=" transition-colors duration-300 hover:scale-110">
                                            <img src="./assets/cc.jpeg" alt="CodeChef" className="w-8 h-8 rounded-full" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column: Dynamic Flex Layout */}
                <div className="order-1 lg:order-2 flex justify-center items-center">
                    <div className="flex flex-wrap justify-center gap-6 max-w-lg mx-auto p-4 md:m-16">
                        {team.members.map((member, index) => {
                            const isSelected = selectedMember?.id === member.id;
                            return (
                                <button
                                    key={member.id}
                                    onClick={() => setSelectedMember(member)}
                                    onMouseEnter={() => setSelectedMember(member)}
                                    className={`w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center text-xl md:text-3xl font-bold transition-all duration-300 transform outline-none focus:outline-none border-2 ${isSelected
                                        ? 'scale-110 shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400 z-10 bg-cyan-900/40 border-cyan-400'
                                        : `scale-100 hover:scale-105 hover:shadow-lg opacity-80 hover:opacity-100 ${pastelColors[index % pastelColors.length]}`
                                        }`}
                                    aria-label={`Select ${member.name}`}
                                >
                                    {isSelected ? (
                                        <img
                                            src={member.imageUrl}
                                            alt={member.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="opacity-60">{member.initials}</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

            </div>
            <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
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
      `}</style>
        </div>
    );
});

export default TeamSection;
