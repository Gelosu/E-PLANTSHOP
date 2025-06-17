'use client';
import React, { useEffect, useState } from 'react';

export default function LoadingScreen2() {
  const [progress, setProgress] = useState(0);
  const [face, setFace] = useState('O = O');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Toggle pot face every 1 second
  useEffect(() => {
    const faceInterval = setInterval(() => {
      setFace((prev) => (prev === 'O = O' ? '- = -' : 'O = O'));
    }, 800);
    return () => clearInterval(faceInterval);
  }, []);

  const maxGrassHeight = 50;
  const grassCount = 5;
  const currentHeight = (progress / 100) * maxGrassHeight;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center flex-col z-50">
      <div className="relative w-40 h-48 flex items-end justify-center">
        {/* Grass Group */}
        <div className="absolute bottom-12 flex justify-center gap-1 z-0">
          {Array.from({ length: grassCount }).map((_, idx) => (
            <div
              key={idx}
              className="w-3 bg-green-400 transition-all duration-300 rounded"
              style={{
                height: `${currentHeight}px`,
              }}
            />
          ))}
        </div>

        {/* Smiley Pot */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-12 bg-[rgb(76,45,20)] rounded-b-xl flex items-center justify-center text-white text-lg font-mono">
            {face}
          </div>
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

     
      <p className="text-white mt-1 text-sm">Order on the way! {progress}%</p>
    </div>
  );
}
