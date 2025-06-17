'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

type CartItem = {
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

interface CartModalProps {
  cartItems: CartItem[];
  setShowCart: (val: boolean) => void;
  onIncrease: (index: number) => void;
  onDecrease: (index: number) => void;
}

const CartModal: React.FC<CartModalProps> = ({
  cartItems,
  setShowCart,
  onIncrease,
  onDecrease,
}) => {
  const router = useRouter();

  const total = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const handleCheckout = () => {
    setShowCart(false);

    // Include image in the cart being sent
    const flatCart = cartItems.flatMap((item) =>
      Array.from({ length: item.quantity }, () => ({
        name: item.name,
        price: item.price,
        image: item.image ?? '', // fallback to empty string if undefined
      }))
    );

    try {
      const encodedCart = encodeURIComponent(JSON.stringify(flatCart));
      router.push(`/checkout?cart=${encodedCart}`);
    } catch (error) {
      console.error('Failed to encode cart items:', error);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        onClick={() => setShowCart(false)}
      ></div>

      <div
        className="fixed z-50 flex items-center justify-center w-full h-full top-0 left-0
        md:w-100 md:h-auto md:bottom-20 md:right-5 md:top-auto md:left-auto md:items-end md:justify-end"
      >
        <div className="bg-white border border-black p-6 rounded-lg w-[90%] max-w-md shadow-lg relative">
          <button
            onClick={() => setShowCart(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
            aria-label="Close Cart"
          >
            &times;
          </button>

          <h2 className="text-xl text-black font-bold mb-4 mt-2">🛒 Your Cart</h2>

          {cartItems.length === 0 ? (
            <p className="text-black">Your cart is empty.</p>
          ) : (
            <>
              <ul className="space-y-3 overflow-y-auto max-h-60 pr-1">
                {cartItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center text-black border-b pb-1"
                  >
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDecrease(idx)}
                        className="bg-red-100 px-2 rounded hover:bg-red-200"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => onIncrease(idx)}
                        className="bg-green-100 px-2 rounded hover:bg-green-200"
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-2 border-t font-bold text-black flex justify-between">
                <span>Total:</span>
                <span>${total}</span>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartModal;
