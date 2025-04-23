'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { isLoggedIn, logout } from "../utils/auth";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [navLinks, setNavLinks] = useState([
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Profile", path: "/Profile" },
    { title: "LogIn", path: "/Login" },
  ]);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

 

  useEffect(() => {
   
    if (isClient) {
      setNavLinks([
        { title: "Home", path: "/" },
        { title: "About", path: "/about" },
        { title: "Profile", path: "/Profile" },
        ...(isLoggedIn() ? [] : [{ title: "LogIn", path: "/Login" }]),
      ]);
    }
  }, [isClient]);

  const handleLinkClick = (path) => {
    setActiveSection(path);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setActiveSection("/Login");
    router.push("/Login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 bg-white/30 backdrop-blur-sm shadow-lg rounded-b-md ${
          scrolled ? "bg-opacity-90" : "bg-opacity-100"
        } transition-all duration-300`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-3xl font-bold text-gray-700">Blog</h1>
          </Link>
          <nav className="hidden md:flex space-x-6 gap-4 items-center">
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
            {isClient && isLoggedIn() && (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="text-gray-700 hover:text-gray-200 transition duration-300"
                >
                  <User className="w-6 h-6" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
          <button
            className="md:hidden text-gray-700 hover:text-gray-200 transition duration-300"
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
        <div className="md:hidden bg-white/30 backdrop-blur-sm w-full fixed top-0 z-10 pt-16">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`text-gray-700 hover:text-gray-200 transition hover:font-bold duration-300 text-center border-b-2 ${
                  activeSection === link.path
                    ? "border-white"
                    : "border-transparent"
                }`}
              >
                {link.title}
              </Link>
            ))}
            {isClient && isLoggedIn() && (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="w-full text-gray-700 hover:text-gray-200 hover:font-bold transition duration-300 text-center flex justify-center items-center gap-2"
                >
                  <User className="w-6 h-6" />
                  User
                </button>
                {isDropdownOpen && (
                  <div className="mt-2 w-full bg-white shadow-lg rounded-md py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
};