'use client';

import React, { useState } from 'react';
import ProductCard from './components/Productcard';
import products from './components/products';
import CartModal from './components/cartfunction';

function Main() {
  const [cartItems, setCartItems] = useState<{ name: string; price: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddToCart = (product: { name: string; price: number }) => {
    setCartItems([...cartItems, product]);
  };

  const handleRemoveFromCart = (indexToRemove: number) => {
    setCartItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
  };

  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-6">
      <div>
        <h1 className="bg-green-500 text-center font-bold text-xl">WELCOME TO E-PLANT SHOP</h1>
        <p className="italic text-center mt-10 mb-10">
          A Virtual shop you can purchase plants with Ease!
        </p>

        
        <div className="text-center mb-6">
          <input
            type="text"
            placeholder="Search for a plant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md"
          />
        </div>

        
        <div className="grid grid-cols-3 gap-10 text-center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard
                key={index}
                name={product.name}
                price={product.price}
                image={product.image}
                onaddtocart={() => handleAddToCart(product)}
              />
            ))
          ) : (
            <p className="col-span-3 text-gray-500 italic">No products found.</p>
          )}
        </div>

        <div className="fixed bottom-6 right-6 z-50 text-lg">
          <button
            onClick={() => setShowCart(!showCart)}
            className="bg-green-800 hover:bg-green-500 px-4 py-2 rounded text-white"
          >
            🛒 Cart ({cartItems.length})
          </button>
        </div>

        {showCart && (
          <CartModal
            cartItems={cartItems}
            setShowCart={setShowCart}
            handleremovefromcart={handleRemoveFromCart}
          />
        )}
      </div>
    </main>
  );
}

export default Main;
