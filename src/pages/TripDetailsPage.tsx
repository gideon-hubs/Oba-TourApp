import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Clock, CheckCircle, User, ArrowLeft } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { format } from 'date-fns';

export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { getTripById } = useBooking();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const trip = getTripById(id!);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Trip not found</h2>
          <Link to="/trips" className="text-sky-500 hover:text-sky-600">
            ← Back to trips
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <Link 
            to="/trips" 
            className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trips
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8">
              <div className="relative h-64 sm:h-80 lg:h-96">
                <img 
                  src={trip.images[activeImageIndex]} 
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                  <span className="bg-sky-500 text-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium">
                    {trip.category}
                  </span>
                </div>
              </div>
              
              {trip.images.length > 1 && (
                <div className="flex space-x-2 p-3 sm:p-4 overflow-x-auto">
                  {trip.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                        activeImageIndex === index ? 'border-sky-500' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${trip.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Trip Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">{trip.title}</h1>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center text-slate-600">
                  <MapPin className="h-5 w-5 mr-2 text-sky-500" />
                  <div>
                    <div className="text-xs sm:text-sm text-slate-500">Destination</div>
                    <div className="font-medium text-sm sm:text-base">{trip.destination}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-slate-600">
                  <Calendar className="h-5 w-5 mr-2 text-sky-500" />
                  <div>
                    <div className="text-xs sm:text-sm text-slate-500">Date</div>
                    <div className="font-medium text-sm sm:text-base">
                      {format(new Date(trip.startDate), 'MMM dd')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center text-slate-600">
                  <Clock className="h-5 w-5 mr-2 text-sky-500" />
                  <div>
                    <div className="text-xs sm:text-sm text-slate-500">Duration</div>
                    <div className="font-medium text-sm sm:text-base">{trip.duration} days</div>
                  </div>
                </div>
                
                <div className="flex items-center text-slate-600">
                  <Users className="h-5 w-5 mr-2 text-sky-500" />
                  <div>
                    <div className="text-xs sm:text-sm text-slate-500">Available</div>
                    <div className="font-medium text-sm sm:text-base">{trip.availableSlots} spots</div>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed">{trip.description}</p>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Daily Itinerary</h2>
              <div className="space-y-4">
                {trip.itinerary.map((day, index) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm sm:text-base text-slate-700">{day}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {trip.included.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm sm:text-base text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guide Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Your Guide</h2>
              <div className="flex items-start space-x-4">
                <img 
                  src={trip.guideInfo.avatar} 
                  alt={trip.guideInfo.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-800">{trip.guideInfo.name}</h3>
                  <p className="text-sm sm:text-base text-slate-600 mt-2">{trip.guideInfo.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 sticky top-4 sm:top-8">
              <div className="text-center mb-6">
                <div className="text-3xl sm:text-4xl font-bold text-slate-800">${trip.price}</div>
                <div className="text-sm sm:text-base text-slate-600">per person</div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Start Date:</span>
                  <span className="font-medium">{format(new Date(trip.startDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">End Date:</span>
                  <span className="font-medium">{format(new Date(trip.endDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Duration:</span>
                  <span className="font-medium">{trip.duration} days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Available Spots:</span>
                  <span className="font-medium text-green-600">{trip.availableSlots} left</span>
                </div>
              </div>
              
              <Link
                to={`/booking/${trip.id}`}
                className="w-full bg-sky-500 text-white py-3 sm:py-4 rounded-lg hover:bg-sky-600 transition-colors font-semibold text-center block text-base sm:text-lg"
              >
                Book This Trip
              </Link>
              
              <div className="mt-4 text-center">
                <p className="text-xs sm:text-sm text-slate-600">
                  Secure your spot with just 30% deposit
                </p>
              </div>
              
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2 sm:mb-3">Need help?</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-3">
                  Have questions about this trip? Our travel experts are here to help.
                </p>
                <button className="w-full border border-slate-300 text-slate-700 py-2 rounded-lg hover:bg-slate-50 transition-colors text-xs sm:text-sm">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}