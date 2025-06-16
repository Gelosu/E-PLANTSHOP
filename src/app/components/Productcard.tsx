'use client';

import React from 'react';

type ProductProps = {
  name: string;
  price: number;
  image?: string;
  onaddtocart: () => void;
};

export default function ProductCard({ name, price, image, onaddtocart }: ProductProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onaddtocart(); // ensure this is only called once
  };

  return (
    <div className="border p-4 rounded-md shadow bg-white hover:scale-105 transition-transform">
      {image && (
        <img
          src={image}
          alt={name}
          className="w-full h-40 object-cover rounded mb-2"
        />
      )}
      <h2 className="text-black">{name}</h2>
      <p className="text-black">${price}</p>
      <button
        onClick={handleClick}
        className="bg-transparent hover:scale-110 px-4 py-2 rounded"
      >
        <img src="/icons/add.png" alt="Add to Cart" className="w-8 h-8 mx-auto" />
      </button>
    </div>
  );
}
