'use client';
import { useEffect } from "react";

export default function About() {
  // Animation on scroll
  useEffect(() => {
    document.querySelectorAll('[data-animate]').forEach((el) => {
      const element = el;
      if (element.style) {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "all 0.5s ease";
        setTimeout(() => {
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        }, 100);
      }
    });
  }, []);

  return (
    <div className="min-h-screen text-gray-800 py-16 px-4">
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-8 xl:p-10 mb-16 max-w-5xl">
        {/* About Us Section */}
        <div
          className=" bg-white/30 backdrop-blur-sm bg-opacity-10 bg-gradient-to-br from-white/20 to-white/10  border border-white/30 rounded-lg p-6 mb-8 shadow-xl hover:bg-opacity-20 hover:shadow-2xl transition-all duration-300"
          data-animate
        >
          <h1 className="text-3xl font-bold mb-4 text-center relative">
            <span className="text-orange-500">About Us</span>
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-orange-500"></span>
          </h1>
          <p className="text-lg text-gray-700 text-center mx-auto max-w-3xl">
            Welcome to our blog! We are passionate about sharing insights and stories
            that inspire and inform. Our mission is to provide high-quality content
            that helps readers grow both personally and professionally.
          </p>
        </div>

        {/* Our Story Section */}
        <div
          className="bg-white/30 backdrop-blur-sm bg-opacity-10 bg-gradient-to-br from-white/20 to-white/10  border border-white/30 rounded-lg p-6 mb-8 shadow-xl hover:bg-opacity-20 hover:shadow-2xl transition-all duration-300"
          data-animate
        >
          <h2 className="text-2xl font-bold mb-4 text-center relative">
            <span className="text-orange-500">Our Story</span>
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-orange-500"></span>
          </h2>
          <p className="text-lg text-gray-700 text-center mx-auto max-w-3xl">
            We started this blog because we believe in the power of storytelling and
            knowledge sharing. With years of experience in our field, we aim to
            bring valuable perspectives and expertise to our readers.
          </p>
        </div>

        {/* Image Section */}
        <div
          className=" flex justify-center"
          data-animate
        >
          <img
            src="/img/aboutimg.png"
            alt="About Image"
            className="w-full max-w-md h-64 object-contain rounded-md"
          />
        </div>

        {/* Thank You Section */}
        <div
          className="bg-white/30 backdrop-blur-sm bg-opacity-10 bg-gradient-to-br from-white/20 to-white/10  border border-white/30 rounded-lg p-6 text-center shadow-xl hover:bg-opacity-20 hover:shadow-2xl transition-all duration-300"
          data-animate
        >
          <p className="text-lg text-gray-700 mx-auto max-w-3xl">
            Thank you for visiting our blog! We look forward to connecting with you.
          </p>
        </div>
      </div>
    </div>
  );
}