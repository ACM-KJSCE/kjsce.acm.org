import React, { useEffect } from "react";
import { useLocation } from "react-router";
import PageLayout from "./components/PageLayout";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import Clarity from "@microsoft/clarity";
import "./App.css";
import Sponsors from "./components/Sponsors";
import sponsors from "./data/sponsors.json";

function App() {
  const location = useLocation();
  const projectId = "pjgnnov8ie";
  Clarity.init(projectId);
  const sponsorList = sponsors.sponsors;

  useEffect(() => {
    const sectionMap = {
      "/about-us": "about-us",
      "/sponsors": "sponsors",
      "/contact-us": "contact-us",
      "/": "",
    };

    const targetId = sectionMap[location.pathname] ?? "";

    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="w-full h-full overflow-hidden">
        <div className="container mx-auto">
          <Hero />
          <AboutUs />
          <Sponsors sponsorList={sponsorList} />
        </div>
      </div>
    </PageLayout>
  );
}

export default App;

