import React, { useState } from 'react';
import { Calendar, CreditCard, MapPin, Clock, CheckCircle, AlertCircle, XCircle, Plus, Receipt } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { format } from 'date-fns';
import PaymentModal from '../components/payment/PaymentModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const { getUserBookings, getTripById, getBookingTransactions, getUserTransactions } = useBooking();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled' | 'transactions'>('upcoming');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const bookings = getUserBookings(user?.id || '');
  const transactions = getUserTransactions(user?.id || '');
  
  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'confirmed' || booking.status === 'pending'
  );
  const completedBookings = bookings.filter(booking => booking.status === 'paid');
  const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'paid':
        return 'Fully Paid';
      case 'pending':
        return 'Pending Payment';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getCurrentBookings = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingBookings;
      case 'completed':
        return completedBookings;
      case 'cancelled':
        return cancelledBookings;
      default:
        return upcomingBookings;
    }
  };

  const handleMakePayment = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh data or show success message
    setShowPaymentModal(false);
    setSelectedBookingId(null);
  };

  const totalSpent = bookings.reduce((sum, booking) => sum + booking.paidAmount, 0);
  const totalPending = bookings.reduce((sum, booking) => 
    sum + (booking.totalAmount - booking.paidAmount), 0
  );

  const selectedBooking = selectedBookingId ? bookings.find(b => b.id === selectedBookingId) : null;
  const remainingAmount = selectedBooking ? selectedBooking.totalAmount - selectedBooking.paidAmount : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user?.name}!</h1>
          <p className="text-slate-600 mt-2">Manage your bookings and track your travel adventures.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-sky-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Total Bookings</p>
                <p className="text-2xl font-bold text-slate-800">{bookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Total Spent</p>
                <p className="text-2xl font-bold text-slate-800">${totalSpent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Pending Payment</p>
                <p className="text-2xl font-bold text-slate-800">${totalPending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Receipt className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Transactions</p>
                <p className="text-2xl font-bold text-slate-800">{transactions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'upcoming', label: 'Upcoming Trips', count: upcomingBookings.length },
                { key: 'completed', label: 'Completed', count: completedBookings.length },
                { key: 'cancelled', label: 'Cancelled', count: cancelledBookings.length },
                { key: 'transactions', label: 'Transactions', count: transactions.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Transaction History</h3>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">No transactions yet</h3>
                    <p className="text-slate-600">Your payment history will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Reference</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Method</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Proof</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4 text-slate-700">
                              {format(new Date(transaction.transactionDate), 'MMM dd, yyyy HH:mm')}
                            </td>
                            <td className="py-3 px-4 text-slate-700 font-mono text-sm">
                              {transaction.reference}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-800">
                              ${transaction.amount}
                            </td>
                            <td className="py-3 px-4 text-slate-700 capitalize">
                              {transaction.paymentMethod.replace('_', ' ')}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {transaction.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {transaction.proofOfPayment ? (
                                <a
                                  href={transaction.proofOfPayment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sky-600 hover:text-sky-700 text-sm"
                                >
                                  View Proof
                                </a>
                              ) : (
                                <span className="text-slate-400 text-sm">N/A</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Booking Lists */}
            {activeTab !== 'transactions' && (
              <>
                {getCurrentBookings().length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">
                      No {activeTab} trips
                    </h3>
                    <p className="text-slate-600">
                      {activeTab === 'upcoming' 
                        ? "You don't have any upcoming trips. Start exploring!" 
                        : `No ${activeTab} trips found.`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getCurrentBookings().map((booking) => {
                      const trip = getTripById(booking.tripId);
                      const bookingTransactions = getBookingTransactions(booking.id);
                      if (!trip) return null;

                      return (
                        <div key={booking.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <img 
                                src={trip.images[0]} 
                                alt={trip.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-800">{trip.title}</h3>
                                <div className="flex items-center text-slate-600 mt-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span className="text-sm">{trip.destination}</span>
                                </div>
                                <div className="flex items-center text-slate-600 mt-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span className="text-sm">
                                    {format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
                                  </span>
                                </div>
                                <div className="flex items-center mt-2">
                                  {getStatusIcon(booking.status)}
                                  <span className="ml-2 text-sm font-medium">
                                    {getStatusText(booking.status)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-bold text-slate-800">
                                ${booking.totalAmount}
                              </div>
                              <div className="text-sm text-slate-600">
                                {booking.travelers} {booking.travelers === 1 ? 'traveler' : 'travelers'}
                              </div>
                              
                              <div className="mt-2 space-y-1">
                                <div className="text-sm text-green-600 font-medium">
                                  Paid: ${booking.paidAmount}
                                </div>
                                {booking.paidAmount < booking.totalAmount && (
                                  <div className="text-sm text-orange-600 font-medium">
                                    Balance: ${booking.totalAmount - booking.paidAmount}
                                  </div>
                                )}
                              </div>
                              
                              {booking.paidAmount < booking.totalAmount && (
                                <button 
                                  onClick={() => handleMakePayment(booking.id)}
                                  className="mt-3 bg-sky-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-sky-600 transition-colors flex items-center"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Make Payment
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {/* Transaction History for this booking */}
                          {bookingTransactions.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                              <h4 className="text-sm font-medium text-slate-700 mb-2">Payment History</h4>
                              <div className="space-y-2">
                                {bookingTransactions.map((transaction) => (
                                  <div key={transaction.id} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-slate-600">
                                        {format(new Date(transaction.transactionDate), 'MMM dd, yyyy')}
                                      </span>
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        {transaction.status}
                                      </span>
                                    </div>
                                    <span className="font-medium text-slate-800">${transaction.amount}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {booking.notes && (
                            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                              <p className="text-sm text-slate-700">
                                <strong>Notes:</strong> {booking.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBookingId && (
        <PaymentModal
          bookingId={selectedBookingId}
          remainingAmount={remainingAmount}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}