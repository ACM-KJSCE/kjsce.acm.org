import React from "react";
import { useState } from "react";
import TeamCard from "./TeamCard";
import team2024 from "../data/team2024";

const PreviousTeams = () => {
  const [isOpen, setIsOpen] = useState(false);
  const togglePreviousTeams = () => { setIsOpen(!isOpen); };

  return (
    <div className=" flex flex-col items-center justify-center m-16">
      <div className="w-96 flex justify-center text-center">
        <h1 className="text-4xl text-center uppercase font-black dark:text-white text-black md:px-8 mb-4 pb-4 md:mb-8 border-b-cyan-400 border-b-2">
          Previous Teams
        </h1>
      </div>

      <div className="w-1/2">
        <button
          onClick={togglePreviousTeams}
          className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-blue 500 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">
          2024-2025
        </button>
        {isOpen && (
          <div
            className="absolute z-10 mt-2 w-full rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bg-grey bg-opacity-70 backdrop-blur-sm p-4"
          >
            <div className="py-1" role="none">
              <h3 className="text-white font-semibold mb-2 text-center">KJSCE ACM 2024-2025</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousTeams;
