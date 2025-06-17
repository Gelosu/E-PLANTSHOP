'use client';

import { useEffect, useState, Suspense} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


type OrderData = {
  ref: string;
  name: string;
  address: string;
  zip: string;
  total: string;
  card: string;
  method: string;
  promo?: string;
  status: string;
  estimatedArrival: string;
  timestamp: string;
  cancelReason?: string;

};

function AllOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const stored = localStorage.getItem('orders');
    const parsed: OrderData[] = stored ? JSON.parse(stored) : [];
    parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const uniqueOrdersMap = new Map<string, OrderData>();
    for (const order of parsed) {
      if (!uniqueOrdersMap.has(order.ref)) {
        uniqueOrdersMap.set(order.ref, order);
      }
    }

    setOrders(Array.from(uniqueOrdersMap.values()));
  }, []);

  const openCancelModal = (index: number) => {
    setSelectedOrderIndex(index);
    setSelectedReason('');
    setIsModalOpen(true);
  };

  const confirmCancel = () => {
  if (selectedOrderIndex === null || !selectedReason) return;

  const updatedOrders = [...orders];
  updatedOrders[selectedOrderIndex] = {
    ...updatedOrders[selectedOrderIndex],
    status: 'Cancelled',
    cancelReason: selectedReason, 
  };

  setOrders(updatedOrders);
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
  setIsModalOpen(false);
};


  return (
    
    <div className="min-h-screen bg-green-300 px-4 py-6">
        <button
        onClick={() => router.push('/')}
        className="fixed top-10 left-8 p-2 bg-white border border-green-700 rounded hover:bg-green-100 shadow z-50"
        >
        <img src="/icons/back.png" alt="Back" className="w-6 h-6" />
        </button>

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-700">📦 All Orders</h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => {
              const canCancel = order.status === 'Ordered';

              return (
                <div
                  key={order.ref}
                  className="p-4 border rounded shadow-sm bg-white hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h2 className="font-semibold text-green-600">Ref #: {order.ref}</h2>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        order.status === 'Delivered'
                          ? 'bg-green-200 text-green-800'
                          : order.status === 'Cancelled'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong> {order.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Total:</strong> ${order.total}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Ordered At:</strong>{' '}
                    {new Date(order.timestamp).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <Link
                      href={`/ordercheck?ref=${order.ref}`}
                      className="text-sm text-green-700 hover:underline"
                    >
                      View Tracking →
                    </Link>
                    <button
                      onClick={() => openCancelModal(idx)}
                      disabled={!canCancel}
                      title={
                        canCancel
                          ? ''
                          : 'Orders cannot be canceled as they will be shipped to your address shortly.'
                      }
                      className={`text-sm px-3 py-1 rounded border transition ${
                        canCancel
                          ? 'text-red-600 border-red-500 hover:bg-red-50'
                          : 'text-gray-400 border-gray-300 cursor-not-allowed'
                      }`}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-96 p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-black">Cancel Order</h2>
            <p className="mb-3 text-sm text-gray-600">Please select a reason for cancellation:</p>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4 text-black"
            >
              <option value="">-- Choose Reason --</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Found a better price">Found a better price</option>
              <option value="Changed my mind">Changed my mind</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100 text-block"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancel}
                disabled={!selectedReason}
                className={`px-4 py-2 rounded text-white ${
                  selectedReason
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-300 cursor-not-allowed'
                }`}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <AllOrdersPage />
    </Suspense>
  );
}
