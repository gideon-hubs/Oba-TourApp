import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, CreditCard, Shield, Calendar } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import GuestBookingForm from '../components/booking/GuestBookingForm';

export default function BookingPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { getTripById, createBooking, addTransaction } = useBooking();
  const { user } = useAuth();
  
  const [travelers, setTravelers] = useState(1);
  const [paymentPlan, setPaymentPlan] = useState<'full' | 'installment'>('installment');
  const [installmentPercentage, setInstallmentPercentage] = useState(30);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestInfo, setGuestInfo] = useState<{name: string; email: string; phone: string} | null>(null);

  const trip = getTripById(tripId!);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Trip not found</h2>
          <button onClick={() => navigate('/trips')} className="text-sky-500 hover:text-sky-600">
            ← Back to trips
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = trip.price * travelers;
  const depositAmount = paymentPlan === 'installment' 
    ? Math.round(totalAmount * (installmentPercentage / 100))
    : totalAmount;
  const remainingAmount = totalAmount - depositAmount;

  const handleInitialBooking = () => {
    if (!user && !guestInfo) {
      setShowGuestForm(true);
      return;
    }

    if (paymentPlan === 'installment' && !user) {
      // Redirect to auth for installment plans
      navigate('/auth');
      return;
    }

    processBooking();
  };

  const handleGuestInfoSubmit = (info: {name: string; email: string; phone: string}) => {
    setGuestInfo(info);
    setShowGuestForm(false);
    processBooking(info);
  };

  const handleCreateAccount = () => {
    navigate('/auth');
  };

  const processBooking = async (guestData?: {name: string; email: string; phone: string}) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bookingData = {
        tripId: trip.id,
        userId: user?.id || 'guest',
        travelers,
        totalAmount,
        paidAmount: depositAmount,
        paymentPlan,
        installmentPercentage: paymentPlan === 'installment' ? installmentPercentage : undefined,
        status: 'confirmed' as const,
        notes: notes || undefined,
        guestInfo: guestData || undefined,
      };

      const bookingId = createBooking(bookingData);

      // Create initial transaction
      addTransaction({
        bookingId,
        userId: user?.id || 'guest',
        amount: depositAmount,
        paymentMethod: 'card',
        status: 'completed',
        reference: `TXN-${Date.now()}`,
      });

      toast.success('Booking confirmed! Check your email for details.');
      
      if (user) {
        navigate('/dashboard');
      } else {
        // For guest bookings, show confirmation
        toast.success('Booking confirmation sent to your email!');
        navigate('/trips');
      }
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (showGuestForm) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={() => setShowGuestForm(false)}
            className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Booking
          </button>
          
          <GuestBookingForm
            onGuestInfoSubmit={handleGuestInfoSubmit}
            onCreateAccount={handleCreateAccount}
            paymentPlan={paymentPlan}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <button 
          onClick={() => navigate(`/trips/${trip.id}`)}
          className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Trip Details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Complete Your Booking</h1>
              
              <form onSubmit={(e) => { e.preventDefault(); handleInitialBooking(); }} className="space-y-6">
                {/* Trip Summary */}
                <div className="border border-slate-200 rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                    <img 
                      src={trip.images[0]} 
                      alt={trip.title}
                      className="w-full h-32 sm:w-20 sm:h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-800">{trip.title}</h3>
                      <p className="text-sm sm:text-base text-slate-600">{trip.destination}</p>
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-lg sm:text-xl font-bold text-slate-800">${trip.price}</div>
                      <div className="text-sm text-slate-600">per person</div>
                    </div>
                  </div>
                </div>

                {/* Number of Travelers */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Travelers
                  </label>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-slate-400" />
                    <select
                      value={travelers}
                      onChange={(e) => setTravelers(parseInt(e.target.value))}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      max={trip.availableSlots}
                    >
                      {Array.from({ length: Math.min(trip.availableSlots, 8) }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'Person' : 'People'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Plan */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Payment Plan
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 p-3 sm:p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input
                        type="radio"
                        name="paymentPlan"
                        value="full"
                        checked={paymentPlan === 'full'}
                        onChange={(e) => setPaymentPlan(e.target.value as 'full')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">Pay in Full</div>
                        <div className="text-xs sm:text-sm text-slate-600">
                          Pay the complete amount now and save on processing fees
                        </div>
                      </div>
                      <div className="text-base sm:text-lg font-bold text-slate-800">
                        ${totalAmount}
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-3 sm:p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input
                        type="radio"
                        name="paymentPlan"
                        value="installment"
                        checked={paymentPlan === 'installment'}
                        onChange={(e) => setPaymentPlan(e.target.value as 'installment')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">Pay in Installments</div>
                        <div className="text-xs sm:text-sm text-slate-600 mb-2">
                          Secure your spot with a deposit, pay the rest later
                        </div>
                        {paymentPlan === 'installment' && (
                          <div className="mt-3">
                            <label className="block text-xs text-slate-600 mb-1">
                              Deposit Percentage
                            </label>
                            <select
                              value={installmentPercentage}
                              onChange={(e) => setInstallmentPercentage(parseInt(e.target.value))}
                              className="w-32 px-3 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            >
                              <option value={25}>25%</option>
                              <option value={30}>30%</option>
                              <option value={50}>50%</option>
                            </select>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-base sm:text-lg font-bold text-slate-800">
                          ${depositAmount}
                        </div>
                        <div className="text-xs text-slate-600">now</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Special Requests or Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-sky-500 text-white py-3 sm:py-4 rounded-lg hover:bg-sky-600 transition-colors font-semibold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      {user ? `Confirm Booking & Pay $${depositAmount}` : 'Continue to Payment'}
                    </>
                  )}
                </button>

                {!user && (
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-slate-600">
                      Have an account?{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/auth')}
                        className="text-sky-600 hover:text-sky-700 font-medium"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sticky top-4 sm:top-8">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Booking Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Trip Price</span>
                  <span className="font-medium">${trip.price} × {travelers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Amount</span>
                  <span className="font-bold text-base sm:text-lg">${totalAmount}</span>
                </div>
                
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {paymentPlan === 'full' ? 'Amount Due Now' : 'Deposit Due Now'}
                    </span>
                    <span className="font-bold text-sky-600">${depositAmount}</span>
                  </div>
                  
                  {paymentPlan === 'installment' && remainingAmount > 0 && (
                    <div className="flex justify-between mt-2">
                      <span className="text-slate-600">Remaining Balance</span>
                      <span className="font-medium">${remainingAmount}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-start space-x-2 text-sm text-slate-600">
                  <Shield className="h-4 w-4 mt-0.5 text-green-500" />
                  <div>
                    <p className="font-medium text-slate-800 text-xs sm:text-sm">Secure Payment</p>
                    <p className="text-xs sm:text-sm">Your payment information is encrypted and secure.</p>
                  </div>
                </div>
              </div>
              
              {paymentPlan === 'installment' && (
                <div className="mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-blue-800">
                    <strong>Installment Plan:</strong> Pay remaining ${remainingAmount} 
                    at least 14 days before your trip departure.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}