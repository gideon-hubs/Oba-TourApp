import React, { createContext, useContext, useState } from 'react';

export interface Trip {
  id: string;
  title: string;
  destination: string;
  duration: number;
  price: number;
  description: string;
  itinerary: string[];
  included: string[];
  images: string[];
  startDate: string;
  endDate: string;
  availableSlots: number;
  category: string;
  guideInfo: {
    name: string;
    bio: string;
    avatar: string;
  };
}

export interface Transaction {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  paymentMethod: 'card' | 'bank_transfer' | 'mobile_money';
  status: 'pending' | 'completed' | 'failed';
  transactionDate: string;
  reference: string;
  proofOfPayment?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  tripId: string;
  userId: string;
  travelers: number;
  totalAmount: number;
  paidAmount: number;
  paymentPlan: 'full' | 'installment';
  installmentPercentage?: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  bookingDate: string;
  notes?: string;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

interface BookingContextType {
  trips: Trip[];
  bookings: Booking[];
  transactions: Transaction[];
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'bookingDate'>) => string;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  getUserBookings: (userId: string) => Booking[];
  getTripById: (id: string) => Trip | undefined;
  getBookingById: (id: string) => Booking | undefined;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'transactionDate'>) => string;
  getBookingTransactions: (bookingId: string) => Transaction[];
  getUserTransactions: (userId: string) => Transaction[];
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Mock data
const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Historic Zanzibar Explorer',
    destination: 'Zanzibar, Tanzania',
    duration: 7,
    price: 1200,
    description: 'Discover the rich history and culture of Zanzibar with our expert guides. Explore Stone Town, pristine beaches, and spice plantations.',
    itinerary: [
      'Day 1: Arrival and Stone Town orientation',
      'Day 2: Spice plantation tour',
      'Day 3: Prison Island and snorkeling',
      'Day 4: Jozani Forest and Red Colobus monkeys',
      'Day 5: Traditional dhow cruise',
      'Day 6: Beach relaxation and water sports',
      'Day 7: Cultural tour and departure'
    ],
    included: ['Accommodation', 'All meals', 'Local transport', 'Tour guide', 'Entry fees'],
    images: [
      'https://images.pexels.com/photos/3250364/pexels-photo-3250364.jpeg',
      'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg',
      'https://images.pexels.com/photos/3652898/pexels-photo-3652898.jpeg'
    ],
    startDate: '2024-03-15',
    endDate: '2024-03-22',
    availableSlots: 12,
    category: 'Cultural',
    guideInfo: {
      name: 'Amara Hassan',
      bio: 'Expert local guide with 8+ years of experience in Zanzibar history and culture.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    }
  },
  {
    id: '2',
    title: 'Serengeti Safari Adventure',
    destination: 'Serengeti, Tanzania',
    duration: 5,
    price: 2800,
    description: 'Experience the ultimate African safari in the world-renowned Serengeti National Park. Witness the Great Migration and Big Five.',
    itinerary: [
      'Day 1: Arrival in Arusha, transfer to Serengeti',
      'Day 2: Full day game drive - Central Serengeti',
      'Day 3: Game drive and hot air balloon safari',
      'Day 4: Western Serengeti - Great Migration',
      'Day 5: Final game drive and departure'
    ],
    included: ['Luxury tented accommodation', 'All meals', '4WD safari vehicle', 'Professional guide', 'Park fees'],
    images: [
      'https://images.pexels.com/photos/3493777/pexels-photo-3493777.jpeg',
      'https://images.pexels.com/photos/1320995/pexels-photo-1320995.jpeg',
      'https://images.pexels.com/photos/2901376/pexels-photo-2901376.jpeg'
    ],
    startDate: '2024-04-10',
    endDate: '2024-04-15',
    availableSlots: 8,
    category: 'Adventure',
    guideInfo: {
      name: 'David Kimani',
      bio: 'Wildlife expert and photographer with over 10 years of safari guiding experience.',
      avatar: 'https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg'
    }
  },
  {
    id: '3',
    title: 'Kilimanjaro Base Camp Trek',
    destination: 'Kilimanjaro, Tanzania',
    duration: 6,
    price: 1800,
    description: 'Challenge yourself with a trek to the base of Africa\'s highest peak. Perfect for adventure seekers and nature lovers.',
    itinerary: [
      'Day 1: Machame Gate to Machame Camp',
      'Day 2: Machame Camp to Shira Camp',
      'Day 3: Shira Camp to Barranco Camp',
      'Day 4: Barranco to Karanga Camp',
      'Day 5: Karanga to Barafu Camp',
      'Day 6: Summit attempt and descent'
    ],
    included: ['Mountain guide', 'Porters', 'Camping equipment', 'All meals', 'Park fees'],
    images: [
      'https://images.pexels.com/photos/917510/pexels-photo-917510.jpeg',
      'https://images.pexels.com/photos/2529159/pexels-photo-2529159.jpeg',
      'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg'
    ],
    startDate: '2024-05-20',
    endDate: '2024-05-26',
    availableSlots: 15,
    category: 'Adventure',
    guideInfo: {
      name: 'Emmanuel Mollel',
      bio: 'Certified mountain guide with 15+ successful Kilimanjaro expeditions.',
      avatar: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg'
    }
  }
];

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip = {
      ...trip,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTrips(prev => [...prev, newTrip]);
  };

  const updateTrip = (id: string, updatedTrip: Partial<Trip>) => {
    setTrips(prev => prev.map(trip => 
      trip.id === id ? { ...trip, ...updatedTrip } : trip
    ));
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
  };

  const createBooking = (booking: Omit<Booking, 'id' | 'bookingDate'>) => {
    const newBooking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      bookingDate: new Date().toISOString(),
    };
    setBookings(prev => [...prev, newBooking]);
    return newBooking.id;
  };

  const updateBooking = (id: string, updatedBooking: Partial<Booking>) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, ...updatedBooking } : booking
    ));
  };

  const getUserBookings = (userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const getTripById = (id: string) => {
    return trips.find(trip => trip.id === id);
  };

  const getBookingById = (id: string) => {
    return bookings.find(booking => booking.id === id);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'transactionDate'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      transactionDate: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);

    // Update booking paid amount if transaction is completed
    if (transaction.status === 'completed') {
      const booking = bookings.find(b => b.id === transaction.bookingId);
      if (booking) {
        const newPaidAmount = booking.paidAmount + transaction.amount;
        const newStatus = newPaidAmount >= booking.totalAmount ? 'paid' : 'confirmed';
        updateBooking(booking.id, { 
          paidAmount: newPaidAmount,
          status: newStatus
        });
      }
    }

    return newTransaction.id;
  };

  const getBookingTransactions = (bookingId: string) => {
    return transactions.filter(transaction => transaction.bookingId === bookingId);
  };

  const getUserTransactions = (userId: string) => {
    return transactions.filter(transaction => transaction.userId === userId);
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
    ));

    // Update booking if transaction status changed to completed
    if (updatedTransaction.status === 'completed') {
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        const booking = bookings.find(b => b.id === transaction.bookingId);
        if (booking) {
          const newPaidAmount = booking.paidAmount + transaction.amount;
          const newStatus = newPaidAmount >= booking.totalAmount ? 'paid' : 'confirmed';
          updateBooking(booking.id, { 
            paidAmount: newPaidAmount,
            status: newStatus
          });
        }
      }
    }
  };

  return (
    <BookingContext.Provider value={{
      trips,
      bookings,
      transactions,
      addTrip,
      updateTrip,
      deleteTrip,
      createBooking,
      updateBooking,
      getUserBookings,
      getTripById,
      getBookingById,
      addTransaction,
      getBookingTransactions,
      getUserTransactions,
      updateTransaction,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}