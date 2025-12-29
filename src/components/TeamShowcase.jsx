import React, { useState, useRef, useEffect } from 'react';
import teams from '../data/teams.json';
import TeamSection from './TeamSection';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TeamShowcase = () => {
    const containerRef = useRef(null);
    const sectionsRef = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        const ctx = gsap.context(() => {
            const sections = sectionsRef.current;
            const totalTeams = teams.length;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: `+=${totalTeams * 100}%`,
                    scrub: 1,
                    snap: {
                        snapTo: 1 / (totalTeams - 1),
                        duration: { min: 0.2, max: 0.8 },
                        delay: 0,
                        ease: "power1.inOut"
                    },
                    pin: true,
                    onUpdate: (self) => {
                        const idx = Math.min(
                            Math.floor(self.progress * totalTeams),
                            totalTeams - 1
                        );
                        setActiveIndex(idx);
                    }
                }
            });
            gsap.set(sections, { autoAlpha: 0, y: 10 });
            gsap.set(sections[0], { autoAlpha: 1, y: 0 });

            teams.forEach((_, i) => {
                if (i === teams.length - 1) return;

                const next = i + 1;
                tl.to(sections[i], {
                    autoAlpha: 0,
                    y: -10,
                    duration: 1,
                    ease: 'power2.inOut'
                })
                    .to(sections[next], {
                        autoAlpha: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power2.inOut'
                    }, "<");

            });

        }, containerRef);

        return () => ctx.revert();
    }, []);


    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen text-white rounded-lg font-sans selection:text-cyan-100 overflow-hidden mt-24 md:mt-20 p-4"
        >
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                {teams.map((team, index) => (
                    <div
                        key={team.teamId}
                        ref={(el) => (sectionsRef.current[index] = el)}
                        className={`absolute inset-0 w-full h-full opacity-0 ${index === activeIndex ? 'pointer-events-auto z-10' : 'pointer-events-none z-0'
                            }`}
                    >
                        <TeamSection team={team} isActive={index === activeIndex} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamShowcase;
