'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function InformationPage() {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'promo'>('card');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    zipCode: '',
    promoCode: '',
  });

  
const searchParams = useSearchParams();
const cart = searchParams.get('cart');
const total = searchParams.get('total');
const cartItems = cart ? JSON.parse(decodeURIComponent(cart)) : [];
const totalPrice = total ? parseFloat(total) : 0;
const router = useRouter();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  

  const numericOnlyFields = {
    cardNumber: 13,
    cvv: 4,
    zipCode: 5
  };

  if (name in numericOnlyFields) {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');

    // Enforce max length
    if (numericValue.length > numericOnlyFields[name as keyof typeof numericOnlyFields]) return;

    setFormData(prev => ({ ...prev, [name]: numericValue }));
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
};

const isFormValid = () => {
  if (paymentMethod === 'card') {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.address &&
      formData.email &&
      formData.cardName &&
      formData.cardNumber &&
      formData.expiryMonth &&
      formData.expiryYear &&
      formData.cvv &&
      formData.zipCode
    );
  } else if (paymentMethod === 'promo') {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.address &&
      formData.email &&
      formData.promoCode
    );
  }
  return false;
};



const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const { firstName, lastName, address, cardNumber, promoCode } = formData;
  const fullName = `${firstName} ${lastName}`;
  const maskedCard = paymentMethod === 'card' ? cardNumber.slice(-4) : 'PROMO';

  router.push(
    `/transactioncom?name=${encodeURIComponent(fullName)}&address=${encodeURIComponent(address)}&zip=${formData.zipCode}&card=${maskedCard}&total=${totalPrice.toFixed(2)}&paymentMethod=${paymentMethod}&promo=${promoCode}
`
  );
};


  const isFormIncomplete = () => {
  if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
    return true;
  }

 


  if (paymentMethod === 'card') {
    return (
      !formData.cardName ||
      !formData.cardNumber ||
      !formData.expiryMonth ||
      !formData.expiryYear ||
      !formData.cvv ||
      !formData.zipCode
    );
  }

  if (paymentMethod === 'promo') {
    return !formData.promoCode;
  }

  return false;
};


  return (
    <div className="min-h-screen bg-green-500 flex items-center justify-center px-4">
    <div className="w-full max-w-lg mx-auto p-6 bg-white min-h-screen">

        <button
        type="button"
        onClick={() => router.back()} // or router.push('/checkout') if you have a specific route
         className="fixed top-4 left-4 p-2 bg-white border border-green-700 rounded hover:bg-green-100 shadow z-50"
        >
        <img src="/icons/back.png" alt="Back" className="w-6 h-6" />
        </button>

        
      <h1 className="text-2xl font-bold mb-6 text-center text-green-800">Checkout Information</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info - First and Last Name in a row */}
        <div className="flex gap-4">
        <div className="flex-1">
            <label className="block font-semibold text-gray-700 mb-1 text-sm">First Name</label>
            <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded text-sm text-black"
            />
        </div>

        <div className="flex-1">
            <label className="block font-semibold text-gray-700 mb-1 text-sm">Last Name</label>
            <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded text-sm text-black"
            />
        </div>
        </div>

        {/* Email Address */}
        <div>
        <label className="block font-semibold text-gray-700 mb-1 text-sm">Email Address</label>
        <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded text-sm text-black"
        />
        </div>

        {/* Shipping Address */}
        <div>
        <label className="block font-semibold text-gray-700 mb-1 text-sm">Shipping Address</label>
        <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded text-sm text-black"
        />
        </div>


        {/* Payment Method */}
        <div>
          <h2 className="font-bold mb-2 text-green-700">Payment Method</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-black">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              Credit/Debit Card
            </label>
            <label className="flex items-center gap-2 text-black">
              <input
                type="radio"
                name="paymentMethod"
                value="promo"
                checked={paymentMethod === 'promo'}
                onChange={() => setPaymentMethod('promo')}
              />
              Promo Code
            </label>
          </div>
        </div>

        {/* Card Form */}
        {paymentMethod === 'card' && (
          <>
            <div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Name on Card</label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded text-black"
              />
            </div>
              <label className="block font-semibold text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                maxLength={13}
                inputMode="numeric"
                pattern="\d*"
                className="w-full border px-3 py-2 rounded text-black"
                />

            </div>

            

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold text-gray-700 mb-1">Expiration Month</label>
                <select
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded text-black"
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block font-semibold text-gray-700 mb-1">Expiration Year</label>
                <select
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded text-black"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold text-gray-700 mb-1">CVV</label>
                <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                required
                maxLength={4}
                inputMode="numeric"
                pattern="\d*"
                className="w-full border px-3 py-2 rounded text-black"
                />

              </div>
              <div className="flex-1">
                <label className="block font-semibold text-gray-700 mb-1">ZIP Code</label>
                <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                maxLength={5}
                inputMode="numeric"
                pattern="\d*"
                className="w-full border px-3 py-2 rounded text-black"
                />

              </div>
            </div>
          </>
        )}

        {/* Promo Code */}
        {paymentMethod === 'promo' && (
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Promo Code</label>
            <input
              type="text"
              name="promoCode"
              maxLength={8}
              value={formData.promoCode}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-black"
            />
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="mt-4">
        <label className="block font-semibold text-gray-700 mb-1">Terms and Conditions</label>
        <div className="h-32 overflow-y-scroll border rounded p-2 text-sm bg-gray-50 text-gray-800">
        <p>
            Welcome to E-Plant Shop. By proceeding with your order, you authorize us to charge your provided
            credit/debit card or apply the promo code as payment. Your purchase indicates agreement to our terms,
            including accepting that all digital and physical products are non-refundable once processed.
            <br /><br />
            Ensure all your information is correct before proceeding. We are not responsible for any incorrect billing 
            or delivery issues due to inaccurate input.
            <br /><br />
            By clicking "Accept Terms and Conditions", you authorize E-Plant Shop to charge your credit/debit card 
            or promo code for the <strong>total amount of ${totalPrice.toFixed(2)}</strong>.
            
            <br /><br />
            Thank you for trusting E-Plant Shop!
        </p>
        </div>

        <div className="mt-2 flex items-center gap-2">
            <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(prev => !prev)}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">I accept the Terms and Conditions</label>
        </div>
        </div>


        {/* Submit */}
        <div className="pt-4">

          <button
        type="submit"
        disabled={!isFormValid() || !termsAccepted}
        className={`w-full font-bold py-2 px-4 rounded transition 
            ${!isFormValid() || !termsAccepted 
            ? 'bg-gray-400 cursor-not-allowed text-white' 
            : 'bg-green-700 hover:bg-green-800 text-white'}`}
        >
        Continue
        </button>


        </div>
      </form>
    </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <InformationPage />
    </Suspense>
  );
}
