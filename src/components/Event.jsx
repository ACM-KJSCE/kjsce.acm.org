import React from "react";
import events from "../data/events.json";
import Sponsors from "./Sponsors";

function Event() {
  return (
    <div
      id="events"
      className="flex flex-col justify-center items-center p-8 md:mt-8 mt-4"
    >
      <h1 className="text-4xl uppercase font-black dark:text-white text-black md:px-8 mb-4 pb-4 md:mb-8 border-b-cyan-400 border-b-2">
        Our Events
      </h1>
      {events.map((event, index) => (
        <div
          key={index}
          className="flex flex-col lg:flex-row rounded-2xl w-full mb-8 "
        >
          <img
            src={event.imageUrl}
            alt="Event"
            className={`xl:w-1/2 lg:w-1/3 w-full h-[100%] mt-auto mb-auto rounded-2xl ${index % 2 !== 0 ? "lg:order-2" : ""}`}
          />
          <div className="h-64 md:w-20 w-10  bg-blue-600 blur-[90px] absolute top-[145rem] mt-96 left-0"></div>
          <div className="h-64 md:w-20 w-10 bg-blue-600 blur-[90px] absolute md:top-[115rem] top-[100rem] mt-96 right-0"></div>
          <div className="flex flex-col justify-center items-start lg:w-2/3 sm:p-5 py-0">
            <div className="md:text-6xl sm:text-3xl text-2xl text-left dark:text-white text-white font-bold sm:p-4 pt-4 pb-1">
              {event.title}
            </div>
            <p className="text-1xl md:text-2xl text-white text-justify sm:pl-4">
              Date: {event.date}
            </p>
            <p className="text-1xl md:text-2xl text-white text-justify sm:p-4 pt-4 ">
              {event.description}
            </p>
            <div>
              {event.sponsors ? <Sponsors sponsorList={event.sponsors} /> : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Event;
