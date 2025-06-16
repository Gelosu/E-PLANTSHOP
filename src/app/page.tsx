'use client';

import React, { useState, useEffect, Suspense } from 'react';
import ProductCard from './components/Productcard';
import products from './components/products';
import CartModal from './components/cartfunction';
import { Menu } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

function Main() {
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const encoded = searchParams.get('cart');
    if (encoded) {
      try {
        const decoded = JSON.parse(decodeURIComponent(encoded));
        const grouped = new Map<string, CartItem>();
        decoded.forEach((item: { name: string; price: number }) => {
          if (grouped.has(item.name)) {
            grouped.get(item.name)!.quantity += 1;
          } else {
            grouped.set(item.name, { ...item, quantity: 1 });
          }
        });
        setCartItems(Array.from(grouped.values()));
      } catch (error) {
        console.error('Failed to parse cart from URL:', error);
      }
    }
  }, [searchParams]);

  const handleAddToCart = (product: { name: string; price: number }) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((item) => item.name === product.name);
      if (index !== -1) {
        updated[index].quantity += 1;
      } else {
        updated.push({ ...product, quantity: 1 });
      }
      return updated;
    });
  };

  const handleIncrease = (index: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity += 1;
      return updated;
    });
  };

  const handleDecrease = (index: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity -= 1;
      if (updated[index].quantity <= 0) {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || product.category === selectedCategory)
  );

  return (
    <main className="p-6 bg-black min-h-screen relative">
      <button onClick={() => setSidebarOpen(true)} className="text-white fixed top-6 left-9 z-50">
        <Menu size={28} />
      </button>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-green-800 w-100 text-white z-50">
          <div className="p-6 flex flex-col h-full">
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

      <h1 className="text-white bg-green-500 text-center font-bold text-xl">
        WELCOME TO E-PLANT SHOP
      </h1>
      <p className="text-white italic text-center mt-10 mb-10">
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

      <div className="fixed bottom-6 right-6 z-50 text-lg">
        <button
          onClick={() => setShowCart(!showCart)}
          className="bg-green-800 hover:bg-green-500 px-4 py-2 rounded text-white"
        >
          🛒 Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
        </button>
      </div>

      {showCart && (
        <CartModal
          cartItems={cartItems}
          setShowCart={setShowCart}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
      )}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <Main />
    </Suspense>
  );
}

