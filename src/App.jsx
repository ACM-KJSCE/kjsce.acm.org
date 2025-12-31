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

function App() {
  const projectId = "pjgnnov8ie";
  Clarity.init(projectId);
  return (
    <>
      <Navbar />
      <div className="w-full h-full overflow-hidden ">
        <div className=" container mx-auto">
          <Hero />
          <AboutUs />
          <Event />
          <Sponsors />
          <Team2 />
          <TeamShowcase />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
