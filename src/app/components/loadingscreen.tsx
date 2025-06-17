'use client';
import React, { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const plantHeight = Math.min(progress, 80);
  const showBud = progress > 40;
  const showLeaves = progress > 50;
  const showFlower = progress >= 100;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center flex-col z-50">
      <div className="relative w-24 h-48 flex items-end justify-center">
        {/* Stem */}
        <div
          className="absolute bottom-10 w-1 bg-green-500 z-0 transition-all duration-300"
          style={{ height: `${plantHeight}px` }}
        >
          {/* Leaves */}
          {showLeaves && (
            <>
              <div className="absolute left-[-14px] top-4 w-6 h-3 bg-green-400 rounded-full rotate-[30deg] origin-right transition-opacity duration-500" />
              <div className="absolute right-[-14px] top-4 w-6 h-3 bg-green-400 rounded-full -rotate-[30deg] origin-left transition-opacity duration-500" />
            </>
          )}

          {/* Bud */}
          {showBud && !showFlower && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-green-300" />
          )}

          {/* Flower */}
          {showFlower && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-400 rounded-full animate-spin-slow flex items-center justify-center text-[2.5rem] leading-none">
              🌸
            </div>
          )}
        </div>

        {/* Pot in front */}
        <div className="relative z-10">
          <div className="w-20 h-12 bg-[rgb(76,45,20)] rounded-b-xl" />
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-[rgb(58,32,14)] rounded-t-lg" />
        </div>
      </div>

      {/* Loading bar */}
      <div className="w-64 h-3 bg-gray-700 rounded mt-6 overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

    <p className="text-white mt-2 text-sm">Something special awaits for you!</p>
      {/* Loading text */}  

      <p className="text-white mt-2 text-sm">Loading... {progress}%</p>

      {/* Custom animation for slow spin */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: translateX(-50%) rotate(0deg);
          }
          100% {
            transform: translateX(-50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
