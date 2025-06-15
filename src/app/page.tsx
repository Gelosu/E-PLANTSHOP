'use client';

import React, { useState } from 'react';
import ProductCard from './components/Productcard';
import products from './components/products';
import CartModal from './components/cartfunction';
import { Menu } from 'lucide-react';

function Main() {
  const [cartItems, setCartItems] = useState<{ name: string; price: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleAddToCart = (product: { name: string; price: number }) => {
    setCartItems([...cartItems, product]);
  };

  const handleRemoveFromCart = (indexToRemove: number) => {
    setCartItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || product.category === selectedCategory)
  );

  return (
    <main className="p-6 bg-black min-h-screen relative">
      {/* Sidebar Toggle Icon */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="text-white fixed top-6 left-9 z-50"
      >
        <Menu size={28} />
      </button>

      {/* Fullscreen Sidebar */}
      {sidebarOpen && (
        <div
          className={`fixed inset-0 bg-green-800 w-100 text-white z-50 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 flex flex-col h-full">
            {/* Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white text-right mb-4 self-end text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-6 text-center">Categories</h2>

            <ul className="flex flex-col gap-4">
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left hover:bg-green-600 p-3 rounded ${
                      selectedCategory === cat ? 'bg-green-700' : ''
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div>
        <h1 className="text-white bg-green-500 text-center font-bold text-xl">
          WELCOME TO E-PLANT SHOP
        </h1>
        <p className="text-white italic text-center mt-10 mb-10">
          A Virtual shop you can purchase plants with Ease!
        </p>

        {/* Search Bar */}
        <div className="text-center mb-6">
          <input
            type="text"
            placeholder="Search for a plant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md"
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
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

        {/* Cart Button */}
        <div className="fixed bottom-6 right-6 z-50 text-lg">
          <button
            onClick={() => setShowCart(!showCart)}
            className="bg-green-800 hover:bg-green-500 px-4 py-2 rounded text-white"
          >
            🛒 Cart ({cartItems.length})
          </button>
        </div>

        {/* Cart Modal */}
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
