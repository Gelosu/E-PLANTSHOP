// components/CartModal.tsx
import React from 'react';

type CartItem = {
  name: string;
  price: number;
};

interface CartModalProps {
  cartItems: CartItem[];
  setShowCart: (val: boolean) => void;
  handleremovefromcart: (index: number) => void;
}

const CartModal: React.FC<CartModalProps> = ({
  cartItems,
  setShowCart,
  handleremovefromcart,
}) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg relative">
        <button
          onClick={() => setShowCart(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl text-black font-bold mb-4">🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-black">Your cart is empty.</p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {cartItems.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center text-black border-b pb-1">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">${item.price}</p>
                </div>
                <button
                  onClick={() => handleremovefromcart(idx)}
                  className="text-red-500 hover:text-red-700 text-lg font-bold ml-4"
                  title="Remove item"
                >
                  🗑️
                </button>
              </li>
            ))}

            <li className="text-black flex justify-between font-bold border-t pt-2 mt-2">
              <span>Total:</span>
              <span>
                ${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}
              </span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default CartModal;
