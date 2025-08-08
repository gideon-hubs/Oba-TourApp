import React, { useState } from 'react';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';

interface GuestInfo {
  name: string;
  email: string;
  phone: string;
}

interface GuestBookingFormProps {
  onGuestInfoSubmit: (guestInfo: GuestInfo) => void;
  onCreateAccount: () => void;
  paymentPlan: 'full' | 'installment';
}

export default function GuestBookingForm({ onGuestInfoSubmit, onCreateAccount, paymentPlan }: GuestBookingFormProps) {
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentPlan === 'installment') {
      // For installment plans, require account creation
      onCreateAccount();
      return;
    }

    // For full payment, allow guest checkout
    onGuestInfoSubmit(guestInfo);
  };

  const isFormValid = guestInfo.name.trim() && guestInfo.email.trim() && guestInfo.phone.trim();

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        {paymentPlan === 'installment' ? 'Account Required' : 'Guest Information'}
      </h2>

      {paymentPlan === 'installment' ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-sky-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Account Required for Installments</h3>
          <p className="text-slate-600 mb-6">
            To use our installment payment plan, you need to create an account to track your payments and manage your bookings.
          </p>
          <button
            onClick={onCreateAccount}
            className="bg-sky-500 text-white px-8 py-3 rounded-lg hover:bg-sky-600 transition-colors font-medium flex items-center mx-auto"
          >
            Create Account & Continue
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={guestInfo.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={guestInfo.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={guestInfo.phone}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Guest Checkout:</strong> You're booking as a guest. You'll receive booking confirmation via email.
              For installment payments and account management, consider creating an account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 bg-sky-500 text-white py-3 rounded-lg hover:bg-sky-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue as Guest
            </button>
            <button
              type="button"
              onClick={onCreateAccount}
              className="flex-1 border border-sky-500 text-sky-500 py-3 rounded-lg hover:bg-sky-50 transition-colors font-medium"
            >
              Create Account Instead
            </button>
          </div>
        </form>
      )}
    </div>
  );
}