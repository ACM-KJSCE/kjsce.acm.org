import React, { useState, useEffect } from "react";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            // Adjust this value to control when the navbar changes
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className="z-[999] flex justify-center items-center fixed top-0 left-0 right-0">
                <div
                    className={`
                    z-20 
                    h-[65px] 
                    ${isScrolled
                            ? 'md:w-[70vw]' 
                            : 'md:w-[90vw] '} 
                    w-[90vw]
                    backdrop-filter 
                    backdrop-blur-md 
                    bg-[rgba(255, 255, 255, 0.2)] 
                    border-2 
                    border-solid 
                    shadow-2xl 
                    border-white 
                    border-opacity-10 
                    rounded-xl 
                    flex 
                    justify-between 
                    items-center 
                    mt-7
                    transition-all 
                    duration-300 
                    ease-in-out
                `}
                >
                    {/* Logo */}
                    <div className={`
                    image 
                    transition-all 
                    duration-300 
                    ease-in-out 
                `}>
                        <img
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="h-14 m-5 cursor-pointer origin-left"
                            src="../logo_withoutbg.png"
                            alt="logo"
                        />
                    </div>

                    {/* Menu for larger screens */}
                    <div className="hidden md:flex">
                        <ul className="flex gap-3 m-5 text-sm font-semibold whitespace-nowrap text-neutral-400">
                            <li className="cursor-pointer hover:text-blue-500 hover:scale-110 transition-transform duration-300"  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</li>
                            <li className="cursor-pointer" onClick={() => handleScrollTo("about-us")}>About us</li>
                            <li className="cursor-pointer" onClick={() => handleScrollTo("events")}>Events</li>
                            <li className="cursor-pointer" onClick={() => handleScrollTo("sponsors")}>Sponsors</li>
                            <li className="cursor-pointer" onClick={() => handleScrollTo("our-team")}>Our Team</li>
                            <li className="cursor-pointer" onClick={() => handleScrollTo("contact-us")}>Contact Us</li>
                        </ul>
                    </div>

                    {/* Hamburger menu for mobile */}
                    <div className="md:hidden m-5">
                        <button
                            className="text-neutral-400 text-xl"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {/* Fullscreen Drawer */}
                <div
                    className={`fixed inset-0 bg-[rgba(255, 255, 255, 0.9)] backdrop-blur-md z-[1000] transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <button
                        className="absolute top-5 right-5 text-xl text-neutral-400"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        ✕
                    </button>
                    <ul className="flex flex-col justify-center items-center h-full gap-5 text-lg font-semibold text-neutral-400">
                        <li className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</li>
                        <li className="cursor-pointer" onClick={() => handleScrollTo("about-us")}>About us</li>
                        <li className="cursor-pointer" onClick={() => handleScrollTo("events")}>Events</li>
                        <li className="cursor-pointer" onClick={() => handleScrollTo("sponsors")}>Sponsors</li>
                        <li className="cursor-pointer" onClick={() => handleScrollTo("our-team")}>Our Team</li>
                        <li className="cursor-pointer" onClick={() => handleScrollTo("contact-us")}>Contact Us</li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;