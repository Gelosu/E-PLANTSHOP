'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function TransactionComplete() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get('name') || 'Customer';
  const address = searchParams.get('address') || 'Unknown address';
  const zip = searchParams.get('zip') || '00000';
  const card = searchParams.get('card') || '0000000000000000';
  const total = searchParams.get('total') || '0.00';
  const method = searchParams.get('paymentMethod') || 'card';
  const promo = searchParams.get('promo') || '';

  const maskedCard = '************' + card.slice(-4);

  const [estimatedDate, setEstimatedDate] = useState('');
  const [refNumber] = useState(() =>
    'REF-' + Math.floor(100000000 + Math.random() * 900000000)
  );

  useEffect(() => {
  const date = new Date();
  const est = new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000).toDateString();
  setEstimatedDate(est);

  const newOrder = {
    ref: refNumber,
    name,
    address,
    zip,
    card: maskedCard,
    total: parseFloat(total).toFixed(2),
    method,
    promo,
    status: 'Ordered',
    estimatedArrival: est,
    timestamp: new Date().toISOString(), // ⏱ Add order date here
  };

  const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  const updatedOrders = [...storedOrders, newOrder];
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
}, []);


  const handleCopy = () => {
    navigator.clipboard.writeText(refNumber);
    alert('Reference number copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-green-300 flex items-center justify-center px-4">
      <div className="bg-white p-6 max-w-xl w-full rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Order Confirmed ✅</h1>

        <div className="space-y-3 text-sm text-gray-700">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Shipping Address:</strong> {address}, {zip}</p>
          <p><strong>Estimated Delivery:</strong> {estimatedDate}</p>
          <p><strong>Payment Method:</strong> {method}</p>
          <p><strong>Promo Code:</strong> {promo || 'N/A'}</p>
          <p><strong>Card Charged:</strong> {maskedCard}</p>
          <p><strong>Total Charged:</strong> ${parseFloat(total).toFixed(2)}</p>

          <div className="flex items-center justify-between mt-3">
            <p><strong>Reference #:</strong> {refNumber}</p>
            <button
              onClick={handleCopy}
              className="text-green-600 border border-green-500 px-2 py-1 text-xs rounded hover:bg-green-100"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="mt-6 border rounded p-4 bg-gray-50">
          <h2 className="font-semibold mb-2 text-black">Order Progress</h2>
          <div className="text-sm text-black ">
            <p>Order placed ✅</p>
            <p>Preparing order...</p>
            <p>Tracking and delivery details will appear soon.</p>
          </div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <TransactionComplete />
    </Suspense>
  );
}
