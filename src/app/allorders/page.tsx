'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoadingScreen2 from '../components/loadingscreen2';

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
  image?: string;
};

function AllOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

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


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000); // simulate loading
    return () => clearTimeout(timer);
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

  const filtered = orders
    .filter((order) => {
      const query = searchQuery.toLowerCase();
      return (
        order.ref.toLowerCase().includes(query) ||
        order.name.toLowerCase().includes(query) ||
        order.total.toLowerCase().includes(query)
      );
    })
    .filter((order) => {
      if (statusFilter === 'all') return true;
      return order.status.toLowerCase() === statusFilter.toLowerCase();
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'recent' ? timeB - timeA : timeA - timeB;
    });

  const isScrollable =
    typeof window !== 'undefined' &&
    ((window.innerWidth < 768 && filtered.length > 5) || (window.innerWidth >= 768 && filtered.length > 3));


if (loading) return <LoadingScreen2 />;
  return (
    <div className="min-h-screen bg-green-600 px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-10 left-8 p-2 bg-white border border-green-700 rounded hover:bg-green-100 shadow z-50"
      >
        <img src="/icons/back.png" alt="Back" className="w-6 h-6" />
      </button>

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-700">📦 All Orders</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by Ref, Name, or Total"
            className="px-4 py-2 border rounded w-full md:w-64 text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded w-full md:w-56 text-black"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'recent' | 'oldest')}
          >
            <option value="recent">Recent to Oldest</option>
            <option value="oldest">Oldest to Recent</option>
          </select>
          <select
            className="px-4 py-2 border rounded w-full md:w-56 text-black"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Ordered">Ordered</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">Order not found.</p>
        ) : (
          <div className={`space-y-4 ${isScrollable ? 'max-h-[450px] overflow-y-auto pr-1' : ''}`}>
            {filtered.map((order, idx) => {
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

      {/* Modal */}
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
                className="px-4 py-2 border rounded hover:bg-gray-100 text-black"
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
