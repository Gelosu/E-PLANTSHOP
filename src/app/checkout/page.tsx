// src/app/checkout/page.tsx
import React, { Suspense } from 'react';
import Checkout from './checkoutpage';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <Checkout />
    </Suspense>
  );
}
