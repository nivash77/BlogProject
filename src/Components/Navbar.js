'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { title: "About", path: "/about" },
  { title: "Profile", path: "/Profile" },
  { title: "LogIn", path: "/Login" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

 
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (path) => {
    setActiveSection(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full  z-50 bg-white/30 backdrop-blur-sm shadow-lg rounded-b-md ${
          scrolled ? "bg-opacity-90" : "bg-opacity-100"
        } transition-all duration-300`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-3xl font-bold text-gray-700">Blog</h1>
          </Link>
          <nav className="hidden md:flex space-x-6 gap-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`text-gray-700 hover:text-gray-200 transition duration-300 border-b-2 ${
                  activeSection === link.path
                    ? "border-white"
                    : "border-transparent"
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>
          <button
            className="md:hidden text-white hover:text-gray-200 transition duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-orange-500 w-full fixed top-0 z-10 pt-16">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`text-white hover:text-gray-100 transition hover:font-bold  duration-300 text-center border-b-2 ${
                  activeSection === link.path
                    ? "border-white"
                    : "border-transparent"
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};