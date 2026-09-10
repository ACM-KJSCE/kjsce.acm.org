import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import Event from "./components/Event";
import Footer from "./components/Footer";
import Team2 from "./components/Team2";
import TeamShowcase from "./components/TeamShowcase";
import Clarity from "@microsoft/clarity";
import "./App.css";
import Sponsors from "./components/Sponsors";
import sponsors from "./data/sponsors.json";

function App() {
  const projectId = "pjgnnov8ie";
  Clarity.init(projectId);
  const sponsorList = sponsors.sponsors;

  return (
    <>
      <Navbar />
      <div className="w-full h-full overflow-hidden ">
        <div className=" container mx-auto">
          <Hero />
          <AboutUs />
          <Event />
          <Sponsors sponsorList={sponsorList} />
          <Team2 />
          <TeamShowcase />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
