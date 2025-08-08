import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Calendar, DollarSign, Users } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { format } from 'date-fns';

export default function TripsPage() {
  const { trips } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('price');

  const categories = ['All', ...Array.from(new Set(trips.map(trip => trip.category)))];

  const filteredTrips = useMemo(() => {
    let filtered = trips.filter(trip => {
      const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || trip.category === selectedCategory;
      const matchesPrice = trip.price >= priceRange[0] && trip.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort trips
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return a.duration - b.duration;
        case 'date':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [trips, searchTerm, selectedCategory, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-600 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Amazing Destinations
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto px-4">
            Choose from our carefully curated collection of unforgettable travel experiences.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Price Range */}
            <div className="flex items-center space-x-2 sm:col-span-2 lg:col-span-1">
              <DollarSign className="h-4 w-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="flex-1"
              />
              <span className="text-sm text-slate-600">${priceRange[1]}</span>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="price">Sort by Price</option>
              <option value="duration">Sort by Duration</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            {filteredTrips.length} Trip{filteredTrips.length !== 1 ? 's' : ''} Found
          </h2>
        </div>

        {/* Trip Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-40 sm:h-48">
                <img 
                  src={trip.images[0]} 
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-sky-500 text-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium">
                    {trip.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <span className="bg-white bg-opacity-90 text-slate-800 px-2 py-1 rounded text-xs sm:text-sm font-medium">
                    {trip.availableSlots} spots left
                  </span>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">{trip.title}</h3>
                
                <div className="flex items-center text-slate-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{trip.destination}</span>
                </div>
                
                <div className="flex items-center text-slate-600 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                
                <p className="text-sm sm:text-base text-slate-600 mb-4 line-clamp-2">{trip.description}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <div className="flex items-center text-slate-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">{trip.duration} days</span>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold text-slate-800">${trip.price}</div>
                    <div className="text-sm text-slate-600">per person</div>
                  </div>
                </div>
                
                <Link
                  to={`/trips/${trip.id}`}
                  className="w-full bg-sky-500 text-white py-2 sm:py-3 rounded-lg hover:bg-sky-600 transition-colors font-medium text-center block text-sm sm:text-base"
                >
                  View Details & Book
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">No trips found</h3>
            <p className="text-sm sm:text-base text-slate-600 px-4">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}