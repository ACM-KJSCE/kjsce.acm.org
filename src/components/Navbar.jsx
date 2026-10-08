import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const goToSection = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleContactClick = () => {
    const footer = document.getElementById("contact-us");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const redirect = () => {
    setIsRedirecting(true);
    window.open("https://acm-fyrep-2627.web.app/", "_blank", "noopener,noreferrer");
    setIsMenuOpen(false);
  };
  return (
    <>
      {/* Navbar */}
      <div className="flex justify-center w-full sticky top-0 z-50 px-4 py-4 mt-8 h-24">
        <div
          className={`flex justify-between items-center transition-all duration-300
            ${isScrolled
              ? "w-[90vw] bg-[#141517]/80 border border-[#26282b] shadow-xl shadow-black/20 rounded-2xl backdrop-blur-lg"
              : "w-[90vw] bg-[#141517]/40 border border-transparent rounded-2xl backdrop-blur-md"
            }
          `}
        >
          {/* Logo */}
          <div className="px-6 flex items-center">
            <img
              src="/logo_withoutbg.png"
              alt="Logo"
              className="object-contain cursor-pointer h-8 md:h-12 drop-shadow-sm opacity-90"
              onClick={handleHomeClick}
              draggable={false}
            />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 px-6 text-sm font-semibold text-gray-400">
            <li className="cursor-pointer hover:text-white transition-colors" onClick={handleHomeClick}>
              Home
            </li>
            <li className="cursor-pointer hover:text-white transition-colors" onClick={() => goToSection("/about-us")}>
              About Us
            </li>
            <li className="cursor-pointer hover:text-white transition-colors" onClick={() => goToSection("/events")}>
              Events
            </li>
            <li className="cursor-pointer hover:text-white transition-colors" onClick={() => goToSection("/our-team")}>
              Our Team
            </li>
            <li className="cursor-pointer hover:text-white transition-colors" onClick={() => goToSection("/sponsors")}>
              Sponsors
            </li>
            <li className="cursor-pointer hover:text-white transition-colors" onClick={handleContactClick}>
              Contact Us
            </li>
            <li
              className={`cursor-pointer ${!isRedirecting ? "hover:text-white" : ""}`}
              onClick={redirect}
            >
              Join Us
            </li>
          </ul>

          {/* Mobile Hamburger */}
          <div className="md:hidden px-6">
            <button
              className="text-2xl text-white focus:outline-none"
              onClick={() => setIsMenuOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          className="absolute top-6 right-6 text-3xl text-white focus:outline-none"
          onClick={() => setIsMenuOpen(false)}
        >
          ✕
        </button>

        <ul className="flex flex-col justify-center items-center h-full gap-8 text-2xl font-bold text-gray-400">
          <li className="cursor-pointer hover:text-white transition-colors" onClick={handleHomeClick}>Home</li>
          <li className="cursor-pointer hover:text-white transition-colors" onClick={() => goToSection("/about-us")}>About Us</li>
          <li className="cursor-pointer hover:text-white transition-colors" onClick={() => goToSection("/events")}>Events</li>
          <li className="cursor-pointer hover:text-white transition-colors" onClick={() => goToSection("/sponsors")}>Sponsors</li>
          <li className="cursor-pointer hover:text-white transition-colors" onClick={() => goToSection("/our-team")}>Our Team</li>
          <li className="cursor-pointer hover:text-white transition-colors" onClick={handleContactClick}>Contact Us</li>
          <li className={`cursor-pointer transition-colors ${!isRedirecting ? "hover:text-white" : ""}`}
            onClick={redirect}>
            Join Us
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
