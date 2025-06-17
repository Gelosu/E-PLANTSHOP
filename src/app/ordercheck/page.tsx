'use client';

import { useSearchParams,useRouter } from 'next/navigation';
import { useEffect, useState,Suspense } from 'react';

type OrderStatus = 'Ordered' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

type OrderData = {
  ref: string;
  name: string;
  address: string;
  zip: string;
  total: string;
  card: string;
  method: string;
  status: OrderStatus;
  estimatedArrival: string;
  timestamp: string;
  cancelReason?: string;

};

function OrderCheckout() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const router = useRouter();

  const statusSteps: OrderStatus[] = ['Ordered', 'Packed', 'Shipped', 'Delivered'];

  useEffect(() => {
    if (ref) {
      const stored = localStorage.getItem('orders');
      const parsed: OrderData[] = stored ? JSON.parse(stored) : [];
      const found = parsed.find((o) => o.ref === ref);
      if (found) {
        setOrderData(found);
      }
    }
  }, [ref]);

  const updateStatus = (newStatus: OrderStatus) => {
    if (!orderData || orderData.status === 'Cancelled') return;

    const updatedOrder: OrderData = { ...orderData, status: newStatus };
    setOrderData(updatedOrder);

    const stored = localStorage.getItem('orders');
    const parsed: OrderData[] = stored ? JSON.parse(stored) : [];

    const updatedList = parsed.map((order) =>
      order.ref === updatedOrder.ref ? updatedOrder : order
    );

    localStorage.setItem('orders', JSON.stringify(updatedList));
  };

  const getStepStyle = (idx: number) => {
    if (!orderData) return 'bg-gray-300';
    if (orderData.status === 'Cancelled') return 'bg-red-500';
    const currentIdx = statusSteps.indexOf(orderData.status);
    return currentIdx >= idx ? 'bg-green-600' : 'bg-gray-300';
  };

  return (
    <div className="min-h-screen bg-green-300 px-4 py-6">
      <button
        onClick={() => router.push('/allorders')} 
        className= "fixed top-6 left-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow z-50"
      >
        ← Back
      </button>
      <div className="max-w-xl mx-auto p-6 border shadow rounded bg-white">
        

        <h1 className="text-2xl font-bold mb-4 text-center text-green-700">Order Tracker</h1>

        {!ref ? (
          <p className="text-center text-red-500">No reference provided.</p>
        ) : !orderData ? (
          <p className="text-center text-gray-500">Order not found.</p>
        ) : (
          <>
            <div className="mb-4 text-sm space-y-1 text-black">
              <p><strong>Reference Number:</strong> {orderData.ref}</p>
              <p><strong>Name:</strong> {orderData.name}</p>
              <p><strong>Address:</strong> {orderData.address}, {orderData.zip}</p>
              <p><strong>Estimated Arrival:</strong> {orderData.estimatedArrival}</p>
              <p><strong>Payment Method:</strong> {orderData.method}</p>
              <p><strong>Card Used:</strong> {orderData.card}</p>
              <p><strong>Total Charged:</strong> ${orderData.total}</p>
              <p>
                <strong>Time Ordered:</strong>{' '}
                {new Date(orderData.timestamp).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>

            {/* Cancelled Message */}
            {orderData.status === 'Cancelled' && (
            <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p>
                This order has been <strong>cancelled</strong> and will not proceed.
              </p>
              {orderData.cancelReason && (
                <p className="mt-1 text-sm text-red-600">
                  <strong>Reason:</strong> {orderData.cancelReason}
                </p>
              )}
            </div>
          )}


            {/* Order Status Progress Bar */}
            <div className="my-6">
              <h2 className="text-lg font-semibold text-green-600 mb-3">Order Status</h2>
              <div className="flex justify-between items-center relative">
                {orderData.status === 'Cancelled' ? (
                  <div className="w-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold mx-auto">
                        ✘
                      </div>
                      <p className="mt-2 text-sm text-red-600 font-medium">Cancelled</p>
                    </div>
                  </div>
                ) : (
                  statusSteps.map((step, idx) => {
                    const isActive = statusSteps.indexOf(orderData.status) >= idx;
                    return (
                      <div key={step} className="flex-1 text-center relative">
                        <div
                          className={`w-8 h-8 mx-auto rounded-full text-white text-sm font-bold flex items-center justify-center ${getStepStyle(idx)}`}
                        >
                          {idx + 1}
                        </div>
                        <p className="mt-2 text-xs text-black">{step}</p>
                        {idx < statusSteps.length - 1 && (
                          <div
                            className={`absolute top-4 left-full w-full h-1 ${
                              statusSteps.indexOf(orderData.status) > idx
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          ></div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Status Selector */}
            {orderData.status !== 'Cancelled' && (
            <div className="mt-6">
            <label htmlFor="status" className="text-sm font-medium text-black">
              Update Status:
            </label>
            <select
              id="status"
              value={orderData.status}
              onChange={(e) => updateStatus(e.target.value as OrderStatus)}
              className="block w-full mt-2 border rounded px-3 py-2 text-black"
            >
              {statusSteps.map((step) => (
                <option key={step} value={step}>
                  {step}
                </option>
              ))}
            </select>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}


export default function Page() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <OrderCheckout />
    </Suspense>
  );
}