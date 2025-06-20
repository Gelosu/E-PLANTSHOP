'use client';

import React, { useState, useEffect, Suspense } from 'react';
import ProductCard from './components/Productcard';
import products from './components/products';
import CartModal from './components/cartfunction';
import { Menu } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import LoadingScreen from './components/loadingscreen';

type CartItem = {
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

function Main() {
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const encoded = searchParams.get('cart');
    if (encoded) {
      try {
        const decoded = JSON.parse(decodeURIComponent(encoded));
        const grouped = new Map<string, CartItem>();
        decoded.forEach((item: { name: string; price: number; image: string }) => {
          if (grouped.has(item.name)) {
            grouped.get(item.name)!.quantity += 1;
          } else {
            grouped.set(item.name, {
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: 1,
            });
          }
        });
        setCartItems(Array.from(grouped.values()));
      } catch (error) {
        console.error('Failed to parse cart from URL:', error);
      }
    }
  }, [searchParams]);

  const handleAddToCart = (product: { name: string; price: number; image: string }) => {
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

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || product.category === selectedCategory)
  );

  if (loading) return <LoadingScreen />;

  return (
    <main className="p-6 bg-black min-h-screen relative">

  {/* Header with Button and Title */}
  <div className="bg-green-500 text-white flex items-center justify-between px-4 py-3 rounded">
    <button onClick={() => setSidebarOpen(true)} className="text-white">
      <Menu size={28} />
    </button>
    <h1 className="text-center font-bold text-sm flex-1">WELCOME TO E-PLANT SHOP</h1>
    <div className="w-[28px]" /> {/* Empty space for alignment with Menu icon */}
  </div>

  {/* Sidebar */}
  {sidebarOpen && (
    <div className="fixed inset-0 bg-green-800 text-white z-50 overflow-y-auto scrollbar-hide md:w-64">
      <div className="p-6 flex flex-col h-full">
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-white text-right mb-4 self-end text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-6 text-center">Categories</h2>
        <ul className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-150px)] scrollbar-hide">
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

  {/* Tagline */}
  <p className="text-white italic text-center mt-10 mb-10">
    A Virtual shop you can purchase plants with Ease!
  </p>

      <div className="text-center mb-6">
        <input
          type="text"
          placeholder="Search for a plant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md text-white"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-8 gap-4 text-center">
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
          <p className="col-span-3 text-white italic ">No products found.</p>
        )}
      </div>

      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3
          ${sidebarOpen ? 'hidden md:flex' : 'flex'}`}
      >
        {/* Orders Button */}
        <button
          onClick={() => router.push( `/allorders?cart=${encodeURIComponent(JSON.stringify(cartItems))}`)}
          className="bg-green-800 hover:bg-green-600 px-4 py-2 rounded text-white shadow-lg"
        >
          📦 Orders
        </button>

        {/* Cart Button */}
        <button
          onClick={() => setShowCart(!showCart)}
          className="bg-green-800 hover:bg-green-500 px-4 py-2 rounded text-white shadow-lg"
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

