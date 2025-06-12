'use client';

import React, { useState } from 'react';
import ProductCard from './components/Productcard';
import products from './components/products';

function Main() {
  const [cartItems, setCartItems] = useState<{ name: string; price: number }[]>([]);
  const [showCart, setShowCart] = useState(false);

  const handleAddToCart = (product: { name: string; price: number }) => {
    setCartItems([...cartItems, product]);
  };

  return (
    <main className="p-6">
      <div>
        <h1 className="bg-green-500 text-center font-bold text-xl">WELCOME TO E-PLANT SHOP</h1>
        <p className="italic text-center mt-10 mb-10">A Virtual shop you can purchase plants with Ease!</p>

        <div className="grid grid-cols-3 gap-10 text-center">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              price={product.price}
              image={product.image}
              onaddtocart={() => handleAddToCart(product)}
            />
          ))}
        </div>

        <div className="text-right mt-10 text-lg">
          <button
            onClick={() => setShowCart(!showCart)}
            className="bg-green-800 hover:bg-green-500 px-4 py-2 rounded text-white"
          >
            🛒 Cart ({cartItems.length})
          </button>
        </div>

        {showCart && (
  <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg relative">
      <button
        onClick={() => setShowCart(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
      >
        &times;
      </button>
      <h2 className="text-xl text-black font-bold mb-4">🛒 Your Cart</h2>

          {cartItems.length === 0 ? (
            <p className='text-black'>Your cart is empty.</p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {cartItems.map((item, idx) => (
                <li key={idx} className="flex justify-between text-black">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </li>
              ))}
              <li className="text-black flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total:</span>
                <span>${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</span>
              </li>
                    </ul>
                  )}
                </div>
              </div>
            )}

      </div>
    </main>
  );
}

export default Main;
