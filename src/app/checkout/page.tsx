'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';

type CartItem = {
  name: string;
  price: number;
  image?: string;
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [zipCode, setZipCode] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [calculatedTax, setCalculatedTax] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const router = useRouter();

  const cartItems: CartItem[] = useMemo(() => {
    const encoded = searchParams.get('cart');
    if (!encoded) return [];
    try {
      return JSON.parse(decodeURIComponent(encoded));
    } catch (err) {
      console.error('Invalid cart data', err);
      return [];
    }
  }, [searchParams]);

  const groupedItems = useMemo(() => {
    const map = new Map<string, { name: string; price: number; quantity: number; image?: string }>();

    cartItems.forEach((item) => {
      if (map.has(item.name)) {
        const existing = map.get(item.name)!;
        existing.quantity += 1;
      } else {
        map.set(item.name, { ...item, quantity: 1 });
      }
    });

    return Array.from(map.values());
  }, [cartItems]);

  const handleBack = () => {
    const encodedCart = encodeURIComponent(JSON.stringify(cartItems));
    router.push(`/?cart=${encodedCart}`);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const fetchTaxRateByZip = (zip: string) => {
    if (zip.startsWith('9')) return 0.09;
    if (zip.startsWith('1')) return 0.07;
    if (zip.startsWith('7')) return 0.06;
    return 0.05;
  };

  return (
    <div className="min-h-screen bg-green-500 flex items-center justify-center px-4">
      <div className="text-black p-6 max-w-lg w-full bg-white rounded-lg shadow-lg">

        <button
          onClick={handleBack}
          className="fixed top-4 left-4 p-2 bg-white border border-green-700 rounded hover:bg-green-100 shadow z-50"
        >
          <img src="/icons/back.png" alt="Back" className="w-6 h-6" />
        </button>


        <h1 className="text-2xl font-bold mb-4">Checkout Summary</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty or data wasn't passed correctly.</p>
        ) : (
          <>
            <div className={`border-b pb-4 ${cartItems.length > 8 ? 'max-h-64 overflow-y-auto pr-1' : ''}`}>
              <ul className="space-y-2">
                {groupedItems.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <span>{item.name}</span>
                    {item.quantity > 1 && (
                      <span className="text-sm text-gray-500"> × {item.quantity}</span>
                    )}
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>

                ))}
              </ul>
            </div>

            <div className="flex justify-between mt-4 font-semibold">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Enter ZIP Code:</label>
              <input
                type="text"
                value={zipCode}
                maxLength={5}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setZipCode(value);
                    if (value.length === 5) {
                      const rate = fetchTaxRateByZip(value);
                      setTaxRate(rate);
                      const tax = subtotal * rate;
                      setCalculatedTax(tax);
                      setFinalTotal(subtotal + tax);
                    } else {
                      setCalculatedTax(0);
                      setFinalTotal(subtotal);
                    }
                  }
                }}
                className="w-full border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 90210"
              />
            </div>

            {zipCode.length === 5 && (
              <>
                <div className="flex justify-between mt-3">
                  <span>Estimated Tax ({(taxRate * 100).toFixed(1)}%):</span>
                  <span>${calculatedTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between mt-2 font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </>
            )}

            <button
              disabled={zipCode.length !== 5}
              onClick={() => {
                const encodedCart = encodeURIComponent(JSON.stringify(cartItems));
                router.push(`/information?cart=${encodedCart}&total=${finalTotal.toFixed(2)}`);
              }}
              className={`mt-6 w-full py-2 px-4 rounded transition 
                ${zipCode.length !== 5 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ✅ This is the only thing you wrap
export default function Page() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
