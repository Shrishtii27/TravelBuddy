import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Sparkles, MapPin, Calendar, Users, Wallet, Compass, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

// Predefined options
const DESTINATIONS = [
  { value: 'goa', label: 'Goa', description: 'Beaches & Nightlife' },
  { value: 'kerala', label: 'Kerala', description: 'Backwaters & Nature' },
  { value: 'rajasthan', label: 'Rajasthan', description: 'Forts & Heritage' },
  { value: 'kashmir', label: 'Kashmir', description: 'Mountains & Lakes' },
  { value: 'himachal', label: 'Himachal Pradesh', description: 'Hill Stations' },
  { value: 'uttarakhand', label: 'Uttarakhand', description: 'Spiritual & Adventure' },
  { value: 'tamil-nadu', label: 'Tamil Nadu', description: 'Temples & Culture' },
  { value: 'karnataka', label: 'Karnataka', description: 'Mix of Everything' },
  { value: 'andaman', label: 'Andaman & Nicobar', description: 'Islands & Beaches' },
  { value: 'sikkim', label: 'Sikkim', description: 'Mountains & Monasteries' },
  { value: 'meghalaya', label: 'Meghalaya', description: 'Waterfalls & Caves' },
  { value: 'ladakh', label: 'Ladakh', description: 'High Altitude Desert' },
];

const THEMES = [
  { value: 'adventure', label: 'Adventure', icon: '🏔️' },
  { value: 'beach', label: 'Beach & Relaxation', icon: '🏖️' },
  { value: 'culture', label: 'Culture & Heritage', icon: '🏛️' },
  { value: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
  { value: 'spiritual', label: 'Spiritual & Yoga', icon: '🧘' },
  { value: 'food', label: 'Food & Culinary', icon: '🍛' },
  { value: 'photography', label: 'Photography', icon: '📸' },
  { value: 'romantic', label: 'Romantic Getaway', icon: '💑' },
  { value: 'family', label: 'Family Friendly', icon: '👨‍👩‍👧‍👦' },
  { value: 'offbeat', label: 'Offbeat & Unexplored', icon: '🗺️' },
];

const PACE_OPTIONS = [
  { value: 'relaxed', label: 'Relaxed', description: '1-2 activities per day, lots of free time' },
  { value: 'balanced', label: 'Balanced', description: '2-3 activities per day, moderate pace' },
  { value: 'intense', label: 'Intense', description: '4+ activities per day, packed schedule' },
];

const ACCOMMODATION_OPTIONS = [
  { value: 'budget', label: 'Budget', description: 'Hostels, budget hotels (₹500-1500/night)', icon: '🏨' },
  { value: 'mid-range', label: 'Mid-Range', description: '3-star hotels (₹2000-4000/night)', icon: '🏨' },
  { value: 'luxury', label: 'Luxury', description: '4-5 star hotels, resorts (₹5000+/night)', icon: '🏨' },
  { value: 'homestay', label: 'Homestay', description: 'Local homes, authentic experience', icon: '🏡' },
  { value: 'resort', label: 'Resort', description: 'All-inclusive resorts', icon: '🏝️' },
  { value: 'camping', label: 'Camping', description: 'Tents, outdoor stays', icon: '⛺' },
];

const FOOD_PREFERENCES = [
  { value: 'all', label: 'All Types', icon: '🍽️' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
  { value: 'vegan', label: 'Vegan', icon: '🌱' },
  { value: 'jain', label: 'Jain Food', icon: '🍛' },
  { value: 'non-veg', label: 'Non-Vegetarian', icon: '🍗' },
  { value: 'seafood', label: 'Seafood Lover', icon: '🦐' },
  { value: 'street-food', label: 'Street Food Explorer', icon: '🍜' },
];

const TRANSPORT_OPTIONS = [
  { value: 'flight', label: 'Flights', description: 'Fast & convenient', icon: '✈️' },
  { value: 'train', label: 'Trains', description: 'Scenic & economical', icon: '🚂' },
  { value: 'bus', label: 'Bus', description: 'Budget friendly', icon: '🚌' },
  { value: 'car', label: 'Self-Drive Car', description: 'Flexibility', icon: '🚗' },
  { value: 'bike', label: 'Bike/Motorcycle', description: 'Adventure', icon: '🏍️' },
  { value: 'mixed', label: 'Mixed Transport', description: 'Combination', icon: '🚇' },
];

const BUDGET_RANGES = [
  { value: '10000-20000', label: '₹10,000 - ₹20,000', description: 'Budget trip' },
  { value: '20000-35000', label: '₹20,000 - ₹35,000', description: 'Moderate' },
  { value: '35000-50000', label: '₹35,000 - ₹50,000', description: 'Comfortable' },
  { value: '50000-75000', label: '₹50,000 - ₹75,000', description: 'Premium' },
  { value: '75000-100000', label: '₹75,000 - ₹1,00,000', description: 'Luxury' },
  { value: '100000+', label: '₹1,00,000+', description: 'Ultra luxury' },
];

export default function PlanTripPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    startingCity: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: '',
    themes: [],
    pace: 'balanced',
    accommodation: [],
    food: [],
    transport: [],
    additional: ''
  });

  const totalSteps = 5;

  const toggleArrayItem = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleGenerate = async () => {
    // Enhanced validation
    if (!formData.destination) {
      toast.error('Please select a destination');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select travel dates');
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate <= startDate) {
      toast.error('End date must be after start date');
      return;
    }

    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    if (daysDiff > 30) {
      toast.error('Trip duration cannot exceed 30 days');
      return;
    }

    if (formData.themes.length === 0) {
      toast.error('Please select at least one travel theme');
      return;
    }

    setLoading(true);

    try {
      // Check if user is logged in
      const token = localStorage.getItem('travys_token');
      if (!token) {
        toast.error('Please log in to generate itinerary');
        navigate('/login');
        return;
      }

      const payload = {
        startingCity: formData.startingCity || 'Delhi',
        destination: DESTINATIONS.find(d => d.value === formData.destination)?.label || formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalDays: daysDiff,
        travelers: formData.travelers,
        budget: formData.budget || '₹20,000 - ₹35,000',
        themes: formData.themes.map(t => THEMES.find(th => th.value === t)?.label || t).join(', '),
        pace: formData.pace,
        accommodation: formData.accommodation.map(a => ACCOMMODATION_OPTIONS.find(ao => ao.value === a)?.label || a).join(', ') || 'Mid-Range',
        food: formData.food.map(f => FOOD_PREFERENCES.find(fp => fp.value === f)?.label || f).join(', ') || 'All Types',
        transport: formData.transport.map(t => TRANSPORT_OPTIONS.find(to => to.value === t)?.label || t).join(', ') || 'Mixed',
        weather: 'Any',
        additional: formData.additional
      };

      console.log('📤 Sending payload to /api/itinerary/generate:', payload);

      const response = await api.post('/api/itinerary/generate', payload);

      console.log('📥 Received response:', response.data);

      if (response.data.success) {
        toast.success('Itinerary generated successfully!');
        navigate('/app/itinerary', { state: response.data.data });
      } else {
        toast.error(response.data.error || 'Failed to generate itinerary');
      }
    } catch (error) {
      console.error('❌ Full error:', error);
      console.error('❌ Error response:', error.response);
      
      let errorMsg = 'Failed to generate itinerary';
      
      if (error.response) {
        // Server responded with error
        errorMsg = error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`;
        
        if (error.response.status === 401) {
          errorMsg = 'Session expired. Please log in again.';
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.response.status === 404) {
          errorMsg = 'API endpoint not found. Please check server is running.';
        }
      } else if (error.request) {
        // Request made but no response
        errorMsg = 'Cannot connect to server. Please check if server is running.';
      } else {
        // Error in request setup
        errorMsg = error.message;
      }
      
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.destination) {
      toast.error('Please select a destination');
      return;
    }
    if (currentStep === 2 && (!formData.startDate || !formData.endDate)) {
      toast.error('Please select travel dates');
      return;
    }
    if (currentStep === 3 && formData.themes.length === 0) {
      toast.error('Please select at least one theme');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-rose-600" />
        <h1 className="text-3xl font-bold">AI Trip Planner</h1>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4, 5].map(step => (
          <div key={step} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
              step <= currentStep ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {step < currentStep ? <Check className="w-5 h-5" /> : step}
            </div>
            {step < 5 && (
              <div className={`flex-1 h-1 mx-2 ${
                step < currentStep ? 'bg-rose-600' : 'bg-slate-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && 'Step 1: Choose Your Destination'}
            {currentStep === 2 && 'Step 2: Travel Dates & Group'}
            {currentStep === 3 && 'Step 3: Select Your Interests'}
            {currentStep === 4 && 'Step 4: Trip Preferences'}
            {currentStep === 5 && 'Step 5: Final Details'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Step 1: Destination */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label>Where do you want to go?</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {DESTINATIONS.map(dest => (
                    <button
                      key={dest.value}
                      onClick={() => setFormData({...formData, destination: dest.value})}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        formData.destination === dest.value
                          ? 'border-rose-600 bg-rose-50'
                          : 'border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      <p className="font-bold">{dest.label}</p>
                      <p className="text-xs text-slate-600">{dest.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Starting From (Optional)</Label>
                <Input
                  placeholder="e.g., Delhi, Mumbai, Bangalore"
                  value={formData.startingCity}
                  onChange={(e) => setFormData({...formData, startingCity: e.target.value})}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* Step 2: Dates & Travelers */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Start Date *
                  </Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="mt-2"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    End Date *
                  </Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="mt-2"
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Number of Travelers
                </Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      onClick={() => setFormData({...formData, travelers: num})}
                      className={`px-4 py-2 border-2 rounded-lg font-medium ${
                        formData.travelers === num
                          ? 'border-rose-600 bg-rose-600 text-white'
                          : 'border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Budget Range (per person)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {BUDGET_RANGES.map(budget => (
                    <button
                      key={budget.value}
                      onClick={() => setFormData({...formData, budget: budget.label})}
                      className={`p-3 border-2 rounded-lg text-left ${
                        formData.budget === budget.label
                          ? 'border-rose-600 bg-rose-50'
                          : 'border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      <p className="font-bold text-sm">{budget.label}</p>
                      <p className="text-xs text-slate-600">{budget.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Themes */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">Select one or more themes for your trip</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {THEMES.map(theme => (
                  <button
                    key={theme.value}
                    onClick={() => toggleArrayItem('themes', theme.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.themes.includes(theme.value)
                        ? 'border-rose-600 bg-rose-50'
                        : 'border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{theme.icon}</span>
                    <p className="font-bold text-sm">{theme.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label>Travel Pace</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  {PACE_OPTIONS.map(pace => (
                    <button
                      key={pace.value}
                      onClick={() => setFormData({...formData, pace: pace.value})}
                      className={`p-4 border-2 rounded-lg text-left ${
                        formData.pace === pace.value
                          ? 'border-rose-600 bg-rose-50'
                          : 'border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      <p className="font-bold">{pace.label}</p>
                      <p className="text-xs text-slate-600">{pace.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Accommodation Type (Select multiple)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {ACCOMMODATION_OPTIONS.map(acc => (
                    <button
                      key={acc.value}
                      onClick={() => toggleArrayItem('accommodation', acc.value)}
                      className={`p-3 border-2 rounded-lg text-left ${
                        formData.accommodation.includes(acc.value)
                          ? 'border-rose-600 bg-rose-50'
                          : 'border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      <span className="text-xl">{acc.icon}</span>
                      <p className="font-bold text-sm mt-1">{acc.label}</p>
                      <p className="text-xs text-slate-600">{acc.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Food Preference (Select multiple)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {FOOD_PREFERENCES.map(food => (
                    <button
                      key={food.value}
                      onClick={() => toggleArrayItem('food', food.value)}
                      className={`p-3 border-2 rounded-lg text-center ${
                        formData.food.includes(food.value)
                          ? 'border-rose-600 bg-rose-50'
                          : 'border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{food.icon}</span>
                      <p className="font-bold text-xs">{food.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Transport & Additional */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <Label>Transport Preference (Select multiple)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {TRANSPORT_OPTIONS.map(transport => (
                    <button
                      key={transport.value}
                      onClick={() => toggleArrayItem('transport', transport.value)}
                      className={`p-3 border-2 rounded-lg text-left ${
                        formData.transport.includes(transport.value)
                          ? 'border-rose-600 bg-rose-50'
                          : 'border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      <span className="text-xl">{transport.icon}</span>
                      <p className="font-bold text-sm mt-1">{transport.label}</p>
                      <p className="text-xs text-slate-600">{transport.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Additional Preferences (Optional)</Label>
                <textarea
                  className="w-full min-h-[100px] rounded-md border border-slate-300 px-3 py-2 text-sm mt-2"
                  placeholder="Any special requirements? Mention specific places you want to visit, activities you want to do, dietary restrictions, accessibility needs, etc."
                  value={formData.additional}
                  onChange={(e) => setFormData({...formData, additional: e.target.value})}
                />
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="font-bold mb-2">Trip Summary:</h3>
                <div className="text-sm space-y-1 text-slate-700">
                  <p><strong>Destination:</strong> {DESTINATIONS.find(d => d.value === formData.destination)?.label}</p>
                  <p><strong>Duration:</strong> {formData.startDate && formData.endDate ? 
                    `${Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + 1} days` : 'Not set'}</p>
                  <p><strong>Travelers:</strong> {formData.travelers}</p>
                  <p><strong>Budget:</strong> {formData.budget || 'Not set'}</p>
                  <p><strong>Themes:</strong> {formData.themes.map(t => THEMES.find(th => th.value === t)?.label).join(', ') || 'None'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            <div className="flex-1" />
            {currentStep < totalSteps ? (
              <Button onClick={nextStep} className="bg-rose-600 text-white">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-gradient-to-r from-rose-600 to-orange-600 text-white px-8"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Generating Your Perfect Trip...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate AI Itinerary
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
