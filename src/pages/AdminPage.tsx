import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, DollarSign, Calendar, TrendingUp, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import TripForm from '../components/admin/TripForm';

export default function AdminPage() {
  const { trips, bookings, transactions, addTrip, updateTrip, deleteTrip, updateTransaction } = useBooking();
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'bookings' | 'transactions'>('overview');
  const [showTripForm, setShowTripForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<string | null>(null);

  // Analytics calculations
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.paidAmount, 0);
  const totalBookings = bookings.length;
  const activeTrips = trips.length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

  const handleDeleteTrip = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    const tripBookings = bookings.filter(b => b.tripId === tripId);
    
    if (tripBookings.length > 0) {
      toast.error('Cannot delete trip with existing bookings');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${trip?.title}"? This action cannot be undone.`)) {
      deleteTrip(tripId);
      toast.success('Trip deleted successfully');
    }
  };

  const handleEditTrip = (tripId: string) => {
    setEditingTrip(tripId);
    setShowTripForm(true);
  };

  const handleTripFormSubmit = (tripData: any) => {
    if (editingTrip) {
      updateTrip(editingTrip, tripData);
    } else {
      addTrip(tripData);
    }
    setShowTripForm(false);
    setEditingTrip(null);
  };

  const handleTripFormCancel = () => {
    setShowTripForm(false);
    setEditingTrip(null);
  };

  const handleTransactionAction = (transactionId: string, status: 'completed' | 'failed') => {
    updateTransaction(transactionId, { status });
    toast.success(`Transaction ${status === 'completed' ? 'approved' : 'rejected'} successfully`);
  };

  const currentTrip = editingTrip ? trips.find(t => t.id === editingTrip) : undefined;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage trips, bookings, and monitor business performance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-800">${totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Total Bookings</p>
                <p className="text-2xl font-bold text-slate-800">{totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Active Trips</p>
                <p className="text-2xl font-bold text-slate-800">{activeTrips}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Pending Transactions</p>
                <p className="text-2xl font-bold text-slate-800">{pendingTransactions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'trips', label: 'Manage Trips' },
                { key: 'bookings', label: 'Bookings' },
                { key: 'transactions', label: 'Transactions' },
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
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Bookings */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Bookings</h3>
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map((booking) => {
                        const trip = trips.find(t => t.id === booking.tripId);
                        return (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-800">{trip?.title}</p>
                              <p className="text-sm text-slate-600">{booking.travelers} travelers</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-slate-800">${booking.paidAmount}</p>
                              <p className="text-sm text-slate-600">{booking.status}</p>
                            </div>
                          </div>
                        );
                      })}
                      {bookings.length === 0 && (
                        <p className="text-slate-500 text-center py-4">No bookings yet</p>
                      )}
                    </div>
                  </div>

                  {/* Popular Trips */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Popular Trips</h3>
                    <div className="space-y-3">
                      {trips.slice(0, 5).map((trip) => {
                        const tripBookings = bookings.filter(b => b.tripId === trip.id);
                        return (
                          <div key={trip.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-800">{trip.title}</p>
                              <p className="text-sm text-slate-600">{trip.destination}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-slate-800">{tripBookings.length} bookings</p>
                              <p className="text-sm text-slate-600">{trip.availableSlots} spots left</p>
                            </div>
                          </div>
                        );
                      })}
                      {trips.length === 0 && (
                        <p className="text-slate-500 text-center py-4">No trips created yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trips Tab */}
            {activeTab === 'trips' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Manage Trips</h3>
                  <button
                    onClick={() => setShowTripForm(true)}
                    className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Trip
                  </button>
                </div>

                {trips.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">No trips yet</h3>
                    <p className="text-slate-600 mb-4">Create your first trip to start accepting bookings.</p>
                    <button
                      onClick={() => setShowTripForm(true)}
                      className="bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors flex items-center mx-auto"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Your First Trip
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => {
                      const tripBookings = bookings.filter(b => b.tripId === trip.id);
                      return (
                        <div key={trip.id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="relative">
                            <img 
                              src={trip.images[0]} 
                              alt={trip.title}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute top-2 left-2">
                              <span className="bg-sky-500 text-white px-2 py-1 rounded text-xs font-medium">
                                {trip.category}
                              </span>
                            </div>
                            <div className="absolute top-2 right-2">
                              <span className="bg-white bg-opacity-90 text-slate-800 px-2 py-1 rounded text-xs font-medium">
                                {trip.availableSlots} spots
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-slate-800 mb-1 line-clamp-1">{trip.title}</h4>
                            <p className="text-sm text-slate-600 mb-2 line-clamp-1">{trip.destination}</p>
                            <div className="flex justify-between items-center text-sm text-slate-600 mb-2">
                              <span>${trip.price}</span>
                              <span>{trip.duration} days</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-500 mb-3">
                              <span>{format(new Date(trip.startDate), 'MMM dd, yyyy')}</span>
                              <span>{tripBookings.length} bookings</span>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditTrip(trip.id)}
                                className="flex-1 bg-slate-100 text-slate-700 px-3 py-2 rounded text-sm hover:bg-slate-200 transition-colors flex items-center justify-center"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTrip(trip.id)}
                                className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors flex items-center justify-center"
                                disabled={tripBookings.length > 0}
                                title={tripBookings.length > 0 ? 'Cannot delete trip with bookings' : 'Delete trip'}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-6">All Bookings</h3>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">No bookings yet</h3>
                    <p className="text-slate-600">Bookings will appear here once customers start booking your trips.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Trip</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Customer</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Travelers</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => {
                          const trip = trips.find(t => t.id === booking.tripId);
                          return (
                            <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium text-slate-800">{trip?.title}</p>
                                  <p className="text-sm text-slate-600">{trip?.destination}</p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {booking.guestInfo ? (
                                  <div>
                                    <p className="font-medium text-slate-800">{booking.guestInfo.name}</p>
                                    <p className="text-sm text-slate-600">{booking.guestInfo.email}</p>
                                  </div>
                                ) : (
                                  <span className="text-slate-700">Customer #{booking.userId.slice(0, 8)}</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-slate-700">{booking.travelers}</td>
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium text-slate-800">${booking.totalAmount}</p>
                                  <p className="text-sm text-slate-600">Paid: ${booking.paidAmount}</p>
                                  {booking.paidAmount < booking.totalAmount && (
                                    <p className="text-sm text-orange-600">Balance: ${booking.totalAmount - booking.paidAmount}</p>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  booking.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {booking.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-700">
                                {format(new Date(booking.bookingDate), 'MMM dd, yyyy')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Transaction Management</h3>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">No transactions yet</h3>
                    <p className="text-slate-600">Payment transactions will appear here for verification.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Reference</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Customer</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Method</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Proof</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => {
                          const booking = bookings.find(b => b.id === transaction.bookingId);
                          return (
                            <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="py-3 px-4 text-slate-700">
                                {format(new Date(transaction.transactionDate), 'MMM dd, yyyy HH:mm')}
                              </td>
                              <td className="py-3 px-4 text-slate-700 font-mono text-sm">
                                {transaction.reference}
                              </td>
                              <td className="py-3 px-4">
                                {booking?.guestInfo ? (
                                  <div>
                                    <p className="font-medium text-slate-800">{booking.guestInfo.name}</p>
                                    <p className="text-sm text-slate-600">{booking.guestInfo.email}</p>
                                  </div>
                                ) : (
                                  <span className="text-slate-700">Customer #{transaction.userId.slice(0, 8)}</span>
                                )}
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
                                    className="text-sky-600 hover:text-sky-700 text-sm flex items-center"
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </a>
                                ) : (
                                  <span className="text-slate-400 text-sm">N/A</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                {transaction.status === 'pending' && (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleTransactionAction(transaction.id, 'completed')}
                                      className="text-green-600 hover:text-green-700 p-1"
                                      title="Approve"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleTransactionAction(transaction.id, 'failed')}
                                      className="text-red-600 hover:text-red-700 p-1"
                                      title="Reject"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trip Form Modal */}
      {showTripForm && (
        <TripForm
          trip={currentTrip}
          onSubmit={handleTripFormSubmit}
          onCancel={handleTripFormCancel}
          isEditing={!!editingTrip}
        />
      )}
    </div>
  );
}