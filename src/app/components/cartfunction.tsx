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
  const total = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        onClick={() => setShowCart(false)}
      ></div>

      <div
        className={`fixed z-50 flex items-center justify-center w-full h-full 
          top-0 left-0
          md:w-100 md:h-auto md:bottom-20 md:right-5 md:top-auto md:left-auto md:items-end md:justify-end`}
      >
        <div className="bg-white border border-black p-6 rounded-lg w-[90%] max-w-md shadow-lg relative">

          {/* Close Button */}
          <button
            onClick={() => setShowCart(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            &times;
          </button>

          <h2 className="text-xl text-black font-bold mb-4 mt-2">🛒 Your Cart</h2>

          {cartItems.length === 0 ? (
            <p className="text-black">Your cart is empty.</p>
          ) : (
            <>
              {/* Scrollable item list */}
              <ul className="
  space-y-2 
  overflow-y-auto 
  overflow-x-hidden 
  pr-1 
  flex-1
  md:max-h-[200px]  // ≈ height of 3 items on desktop
">
  {cartItems.map((item, idx) => (
    <li
      key={idx}
      className="flex justify-between items-center text-black border-b pb-1"
    >
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-gray-500">${item.price}</p>
      </div>
      <button
        onClick={() => handleremovefromcart(idx)}
        className="text-red-500 hover:text-red-700 text-lg font-bold ml-4"
        title="Remove item"
      >
        <img src="/icons/delete.png" width="24px" alt="Remove" />
      </button>
    </li>
  ))}
</ul>

              {/* Total section - fixed at the bottom */}
              <div className="mt-4 pt-2 border-t font-bold text-black flex justify-between">
                <span>Total:</span>
                <span>${total}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartModal;
