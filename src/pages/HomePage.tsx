import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Users, Shield, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

export default function HomePage() {
  const { trips } = useBooking();
  const featuredTrips = trips.slice(0, 3);
  
  // Carousel images with different travel destinations
  const carouselImages = [
    {
      url: 'https://images.pexels.com/photos/1320995/pexels-photo-1320995.jpeg',
      title: 'Discover Amazing Journeys',
      subtitle: 'From the historic streets of Zanzibar to thrilling safari adventures'
    },
    {
      url: 'https://images.pexels.com/photos/3250364/pexels-photo-3250364.jpeg',
      title: 'Historic Zanzibar Awaits',
      subtitle: 'Explore ancient Stone Town and pristine beaches'
    },
    {
      url: 'https://images.pexels.com/photos/3493777/pexels-photo-3493777.jpeg',
      title: 'Safari Adventures',
      subtitle: 'Witness the Great Migration and Big Five in their natural habitat'
    },
    {
      url: 'https://images.pexels.com/photos/917510/pexels-photo-917510.jpeg',
      title: 'Mountain Expeditions',
      subtitle: 'Challenge yourself with breathtaking mountain treks'
    },
    {
      url: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg',
      title: 'Cultural Experiences',
      subtitle: 'Immerse yourself in rich local traditions and heritage'
    }
  ];
  
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [carouselImages.length]);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
        {/* Carousel Container */}
        <div className="relative h-full">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-700/60 z-10" />
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${image.url})` }}
              />
            </div>
          ))}
          
          {/* Content Overlay */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-white max-w-3xl w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6 animate-fade-in">
                {carouselImages[currentSlide].title.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? 'text-sky-400' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-6 sm:mb-8 leading-relaxed animate-fade-in-delay">
                {carouselImages[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-delay-2">
                <Link
                  to="/trips"
                  className="bg-sky-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-sky-600 transition-all duration-300 flex items-center justify-center group shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Explore Trips
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-white hover:text-slate-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  Watch Video
                </button>
              </div>
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          {/* Dots Indicator */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2 sm:space-x-3">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-sky-400 scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
            <div 
              className="h-full bg-sky-400 transition-all duration-300 ease-linear"
              style={{ 
                width: `${((currentSlide + 1) / carouselImages.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">Why Choose OBA TOUR?</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              We make travel dreams come true with our expert planning, flexible payments, and unforgettable experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 sm:p-8 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users className="h-8 w-8 text-sky-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3 sm:mb-4">Expert Guides</h3>
              <p className="text-sm sm:text-base text-slate-600">
                Our local experts provide insider knowledge and authentic experiences you won't find anywhere else.
              </p>
            </div>
            
            <div className="text-center p-6 sm:p-8 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3 sm:mb-4">Flexible Payments</h3>
              <p className="text-sm sm:text-base text-slate-600">
                Pay with easy installments. Secure your spot with just a deposit and pay the rest before your trip.
              </p>
            </div>
            
            <div className="text-center p-6 sm:p-8 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Star className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3 sm:mb-4">Curated Experiences</h3>
              <p className="text-sm sm:text-base text-slate-600">
                Every trip is carefully planned to showcase the best of each destination's culture, history, and natural beauty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trips */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">Featured Destinations</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Discover our most popular trips and start planning your next adventure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredTrips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">{trip.title}</h3>
                  <div className="flex items-center text-slate-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{trip.destination}</span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 mb-4 line-clamp-2">{trip.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <span className="text-xl sm:text-2xl font-bold text-slate-800">${trip.price}</span>
                      <span className="text-slate-600 text-sm ml-1">/ {trip.duration} days</span>
                    </div>
                    <Link
                      to={`/trips/${trip.id}`}
                      className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors text-center text-sm sm:text-base"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/trips"
              className="bg-slate-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-slate-700 transition-colors inline-flex items-center"
            >
              View All Trips
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-sky-500 to-sky-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">Ready for Your Next Adventure?</h2>
          <p className="text-lg sm:text-xl text-sky-100 mb-6 sm:mb-8 px-4">
            Join thousands of travelers who have discovered amazing destinations with OBA TOUR. 
            Book your dream trip today with flexible payment options.
          </p>
          <Link
            to="/trips"
            className="bg-white text-sky-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-slate-50 transition-colors inline-flex items-center"
          >
            Start Your Journey
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}