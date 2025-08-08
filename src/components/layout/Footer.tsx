import React from 'react';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-8 w-8 text-sky-400" />
              <span className="text-lg sm:text-xl font-bold">OBA TOUR</span>
            </div>
            <p className="text-sm sm:text-base text-slate-300 mb-4 max-w-md">
              Discover the world's most beautiful destinations with our expert-guided tours. 
              From historic Zanzibar to thrilling safaris, we create unforgettable experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/trips" className="text-sm sm:text-base text-slate-300 hover:text-white transition-colors">
                  Browse Trips
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-sm sm:text-base text-slate-300 hover:text-white transition-colors">
                  My Bookings
                </a>
              </li>
              <li>
                <a href="#" className="text-sm sm:text-base text-slate-300 hover:text-white transition-colors">
                  Travel Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-sm sm:text-base text-slate-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm sm:text-base text-slate-300">
                <Mail className="h-4 w-4" />
                <span>info@obatour.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm sm:text-base text-slate-300">
                <Phone className="h-4 w-4" />
                <span>+255 123 456 789</span>
              </div>
              <div className="flex items-start space-x-2 text-sm sm:text-base text-slate-300">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>123 Safari Avenue<br />Dar es Salaam, Tanzania</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} OBA TOUR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}