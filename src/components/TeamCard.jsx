import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import LinkedinIcon from "/assets/linkedin.svg";
import CodechefIcon from "/assets/cc.jpeg";
import CodeforcesIcon from "/assets/cfc.svg";
import LeetcodeIcon from "/assets/leetcode.svg";
import GithubIcon from "/assets/github.svg";

const TeamCard = ({ team }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (selectedMember) {
      gsap.from(modalRef.current, {
        scale: 0,
        duration: 0.2,
        ease: "power1.out",
      });
    }
  }, [selectedMember]);

  const parseUsername = (url) => {
    if (!url) return "";
    const segments = url.split("/");
    return segments[segments.length - 1] || "";
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  return (
    <div className="relative flex flex-col items-center w-full justify-center md:px-16">

      {team.teamName!=="CORES" && <div className="text-4xl w-fit text-center uppercase font-black dark:text-white text-white px-8 py-4 mb-4 md:mb-8 border-b-cyan-400 border-b-2">{team.teamName}</div>}
      
      

      <div className="box w-full flex flex-wrap justify-around gap-8 mt-5">
        {team.members.map((member, index) => (
          <div key={index} className="text-center cursor-pointer relative w-64 group" onClick={() => handleMemberClick(member)}>
            <img src={member.img} alt={member.firstName} className="rounded-xl h-64 aspect-square transition-transform duration-300"  />
            <div className="absolute top-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-black text-white px-2 py-1">
                Click to know more
              </span>
            </div>
            <div className="mt-2">
              <p className="text-white text-lg">{member.firstName} {member.lastName}</p>
              <p className="text-white text-sm">{member.info.role}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedMember && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-[1000] h-screen">
          <div ref={modalRef} className="bg-[#16182e] text-white p-6 rounded-lg shadow-lg relative max-w-96 w-full justify-center items-center">
            <button className="absolute top-4 right-4 text-white text-xl" onClick={closeModal}>&times;</button>
            <div className="flex justify-center flex-col items-center">
              <img src={selectedMember.img} alt={selectedMember.firstName} className="rounded-xl h-64 aspect-square"/>
              <h2 className="text-2xl font-bold py-2">{selectedMember.firstName} {selectedMember.lastName}</h2>
              <p className="text-lg mb-4">{selectedMember.info.role}</p>
              <div className="space-y-2">
                <p><a href={selectedMember.info.github} className="flex justify-between items-center gap-4"><img src={GithubIcon} alt="GithubIcon" className="h-12" /> @{parseUsername(selectedMember.info.github)}</a></p>
                <p><a href={selectedMember.info.codechef} className="flex justify-between items-center gap-4"><img src={CodechefIcon} alt="CodechefIcon" className="h-12 rounded-full" /> @{parseUsername(selectedMember.info.codechef)}</a></p>
                <p><a href={selectedMember.info.codeforces} className="flex justify-between items-center gap-4"><img src={CodeforcesIcon} alt="CodeForcesIcon" className="h-12" /> @{parseUsername(selectedMember.info.codeforces)}</a></p>
                <p><a href={selectedMember.info.leetcode} className="flex justify-between items-center gap-4"><img src={LeetcodeIcon} alt="LeetcodeIcon" className="h-12" /> @{parseUsername(selectedMember.info.leetcode)}</a></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard;


