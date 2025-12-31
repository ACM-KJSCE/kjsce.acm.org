import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <div className="flex justify-center w-full sticky top-0 z-50 px-4 py-4 mt-8 h-24">
        <div
          className={`flex justify-between items-center transition-all duration-200
            ${
              isScrolled
                ? "w-[90vw] bg-black border border-neutral-800 shadow-lg rounded-lg"
                : "w-[90vw] rounded-lg bg-black/80 backdrop-blur-md"
            }
          `}
        >
          {/* Logo */}
          <div className="px-6 flex items-center">
            <img
              src="/logo_withoutbg.png"
              alt="Logo"
              className="object-contain cursor-pointer h-8 md:h-12"
              onClick={handleHomeClick}
            />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-6 px-6 text-sm font-semibold text-neutral-400">
            <li className="cursor-pointer hover:text-white" onClick={handleHomeClick}>
              Home
            </li>
            <li className="cursor-pointer hover:text-white" onClick={() => handleScrollTo("about-us")}>
              About Us
            </li>
            <li className="cursor-pointer hover:text-white" onClick={() => handleScrollTo("events")}>
              Events
            </li>
            <li className="cursor-pointer hover:text-white" onClick={() => handleScrollTo("sponsors")}>
              Sponsors
            </li>
            <li className="cursor-pointer hover:text-white" onClick={() => handleScrollTo("our-team")}>
              Our Team
            </li>
            <li className="cursor-pointer hover:text-white" onClick={() => handleScrollTo("contact-us")}>
              Contact Us
            </li>
          </ul>

          {/* Mobile Hamburger */}
          <div className="md:hidden px-6">
            <button
              className="text-2xl text-neutral-400"
              onClick={() => setIsMenuOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`fixed inset-0 z-[999] bg-black/95 backdrop-blur-md transition-transform duration-300
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          className="absolute top-6 right-6 text-2xl text-neutral-400"
          onClick={() => setIsMenuOpen(false)}
        >
          ✕
        </button>

        <ul className="flex flex-col justify-center items-center h-full gap-6 text-lg font-semibold text-neutral-400">
          <li className="cursor-pointer hover:text-white" onClick={handleHomeClick}>Home</li>
          <li className="cursor-pointer hover:text-white" onClick={() => handleScrollTo("about-us")}>About Us</li>
          <li className="cursor-pointer hover:text-white" onClick={() => handleScrollTo("events")}>Events</li>
          <li className="cursor-pointer hover:text-white" onClick={() => handleScrollTo("sponsors")}>Sponsors</li>
          <li className="cursor-pointer hover:text-white" onClick={() => handleScrollTo("our-team")}>Our Team</li>
          <li className="cursor-pointer hover:text-white" onClick={() => handleScrollTo("contact-us")}>Contact Us</li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
