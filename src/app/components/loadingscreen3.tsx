'use client';
import React, { useEffect, useState } from 'react';

export default function LoadingScreen3() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 40); // Faster since this is for "submitting"
    return () => clearInterval(interval);
  }, []);

  const flowerCount = 5;
  const flowerScale = progress >= 10 ? 'animate-bloom' : '';

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center flex-col z-50">
      <div className="relative w-40 h-52 flex items-end justify-center">
        {/* Flower Group */}
        <div className="absolute bottom-12 flex gap-2 z-0">
          {Array.from({ length: flowerCount }).map((_, idx) => (
            <div
              key={idx}
              className={`text-3xl transition-all duration-300 ${flowerScale}`}
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              🌸
            </div>
          ))}
        </div>

        
      </div>

      {/* Loading bar */}
      <div className="w-64 h-3 bg-gray-700 rounded mt-6 overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-white mt-2 text-sm">
        {progress >= 100 ? 'Payment Successful!' : 'Submitting your order...'}
      </p>
      <p className="text-white mt-1 text-sm">Loading... {progress}%</p>

      {/* Bloom animation */}
      <style jsx>{`
        @keyframes bloom {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }

        .animate-bloom {
          animation: bloom 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
