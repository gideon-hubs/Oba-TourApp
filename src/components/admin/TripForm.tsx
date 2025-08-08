import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { Trip } from '../../contexts/BookingContext';
import toast from 'react-hot-toast';

interface TripFormProps {
  trip?: Trip;
  onSubmit: (tripData: Omit<Trip, 'id'>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function TripForm({ trip, onSubmit, onCancel, isEditing = false }: TripFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    duration: 1,
    price: 0,
    description: '',
    itinerary: [''],
    included: [''],
    images: [''],
    startDate: '',
    endDate: '',
    availableSlots: 1,
    category: 'Cultural',
    guideInfo: {
      name: '',
      bio: '',
      avatar: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (trip) {
      setFormData({
        title: trip.title,
        destination: trip.destination,
        duration: trip.duration,
        price: trip.price,
        description: trip.description,
        itinerary: trip.itinerary,
        included: trip.included,
        images: trip.images,
        startDate: trip.startDate,
        endDate: trip.endDate,
        availableSlots: trip.availableSlots,
        category: trip.category,
        guideInfo: trip.guideInfo
      });
    }
  }, [trip]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('guideInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        guideInfo: {
          ...prev.guideInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'duration' || name === 'price' || name === 'availableSlots' 
          ? parseInt(value) || 0 
          : value
      }));
    }
  };

  const handleArrayChange = (index: number, value: string, field: 'itinerary' | 'included' | 'images') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'itinerary' | 'included' | 'images') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index: number, field: 'itinerary' | 'included' | 'images') => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.destination.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.price <= 0 || formData.duration <= 0 || formData.availableSlots <= 0) {
      toast.error('Price, duration, and available slots must be greater than 0');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    // Filter out empty items
    const cleanedData = {
      ...formData,
      itinerary: formData.itinerary.filter(item => item.trim()),
      included: formData.included.filter(item => item.trim()),
      images: formData.images.filter(item => item.trim())
    };

    if (cleanedData.itinerary.length === 0) {
      toast.error('Please add at least one itinerary item');
      return;
    }

    if (cleanedData.included.length === 0) {
      toast.error('Please add at least one included item');
      return;
    }

    if (cleanedData.images.length === 0) {
      toast.error('Please add at least one image URL');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(cleanedData);
      toast.success(isEditing ? 'Trip updated successfully!' : 'Trip created successfully!');
    } catch (error) {
      toast.error('Failed to save trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['Cultural', 'Adventure', 'Beach', 'Safari', 'Historical', 'Nature', 'City Tour'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            {isEditing ? 'Edit Trip' : 'Add New Trip'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trip Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="e.g., Historic Zanzibar Explorer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Destination *
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="e.g., Zanzibar, Tanzania"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duration (days) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price per Person ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Available Slots *
              </label>
              <input
                type="number"
                name="availableSlots"
                value={formData.availableSlots}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Describe the trip experience..."
              required
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Image URLs *
            </label>
            <div className="space-y-2">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'images')}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'images')}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('images')}
                className="flex items-center text-sky-600 hover:text-sky-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Image URL
              </button>
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Daily Itinerary *
            </label>
            <div className="space-y-2">
              {formData.itinerary.map((day, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={day}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'itinerary')}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder={`Day ${index + 1} activities...`}
                  />
                  {formData.itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'itinerary')}
                      className="text-red-500 hover:text-red-700 transition-colors mt-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('itinerary')}
                className="flex items-center text-sky-600 hover:text-sky-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Day
              </button>
            </div>
          </div>

          {/* What's Included */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              What's Included *
            </label>
            <div className="space-y-2">
              {formData.included.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'included')}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="e.g., Accommodation, Meals, Transport..."
                  />
                  {formData.included.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'included')}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('included')}
                className="flex items-center text-sky-600 hover:text-sky-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>
          </div>

          {/* Guide Information */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Guide Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Guide Name *
                </label>
                <input
                  type="text"
                  name="guideInfo.name"
                  value={formData.guideInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Guide's full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Guide Avatar URL *
                </label>
                <input
                  type="url"
                  name="guideInfo.avatar"
                  value={formData.guideInfo.avatar}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Guide Bio *
                </label>
                <textarea
                  name="guideInfo.bio"
                  value={formData.guideInfo.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Brief description of the guide's experience and expertise..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Trip' : 'Create Trip'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}