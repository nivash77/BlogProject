'use client';
import { useState, useEffect } from 'react';

export default function ClientLayout({ children }) {
  const [backgroundImage, setBackgroundImage] = useState('');

  // Array of background images (replace with your own URLs or local assets)
  const backgroundImages = [
    'https://ik.imagekit.io/qd01l9yk3p/ProjectMern%20image/seaimage.jpg?updatedAt=1745261187018',
    
     'https://ik.imagekit.io/qd01l9yk3p/ProjectMern%20image/8761e21a-860c-4389-9343-fc837c91cb25_large.webp?updatedAt=1745261577349',
     'https://ik.imagekit.io/qd01l9yk3p/ProjectMern%20image/seasea.png?updatedAt=1745261577330',
    
  ];

  // Select random background image on mount
  useEffect(() => {
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    setBackgroundImage(randomImage);
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-100 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgroundImage})`,
      }}
    >
      {children}
    </div>
  );
}