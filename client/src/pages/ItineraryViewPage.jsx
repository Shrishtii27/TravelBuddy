import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin, Calendar, Wallet, Sun, Moon, Sunset, Hotel, Utensils, Info, Download, Share2 } from 'lucide-react';
import { exportToPDF } from '../lib/pdfExport';
import toast from 'react-hot-toast';

export default function ItineraryViewPage() {
  const location = useLocation();
  const itinerary = location.state;
  const [activeTab, setActiveTab] = useState('itinerary');

  if (!itinerary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-slate-600 mb-4">No itinerary data found</p>
          <Button onClick={() => window.location.href = '/app/plan-trip'}>
            Create New Trip
          </Button>
        </div>
      </div>
    );
  }

  const { trip_overview, daily_itinerary, budget_breakdown, packing_list, local_tips, weather_forecast } = itinerary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">{trip_overview?.destination || 'Your Trip'}</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {trip_overview?.total_days || 0} Days
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {trip_overview?.starting_city || 'India'}
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            {trip_overview?.total_estimated_budget || 'Budget'}
          </div>
        </div>
        <p className="mt-3 text-sm opacity-90">{trip_overview?.travel_summary || ''}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => {
            toast.loading('Generating PDF...');
            setTimeout(() => {
              exportToPDF(itinerary);
              toast.dismiss();
              toast.success('PDF downloaded successfully!');
            }, 500);
          }}
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
          }}
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          {['itinerary', 'budget', 'packing', 'tips'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          {daily_itinerary?.map((day, index) => (
            <Card key={index}>
              <CardHeader className="bg-slate-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Day {day.day} - {day.title}</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">{day.theme}</p>
                    <p className="text-xs text-slate-500 mt-1">{day.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-600">Daily Cost</p>
                    <p className="text-lg font-bold text-rose-600">{day.daily_estimated_cost}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Morning */}
                {day.morning && (
                  <div className="border-l-4 border-yellow-400 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-bold">Morning - {day.morning.time}</h3>
                    </div>
                    <p className="font-medium text-slate-900">{day.morning.activity}</p>
                    <p className="text-sm text-slate-600 mt-1">📍 {day.morning.location}</p>
                    <p className="text-sm text-slate-700 mt-2">{day.morning.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-slate-600">
                      <span>⏱️ {day.morning.duration}</span>
                      <span>💰 {day.morning.estimated_cost}</span>
                    </div>
                    {day.morning.tips && (
                      <p className="text-xs text-blue-600 mt-2">💡 {day.morning.tips}</p>
                    )}
                  </div>
                )}

                {/* Afternoon */}
                {day.afternoon && (
                  <div className="border-l-4 border-orange-400 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sunset className="w-5 h-5 text-orange-600" />
                      <h3 className="font-bold">Afternoon - {day.afternoon.time}</h3>
                    </div>
                    <p className="font-medium text-slate-900">{day.afternoon.activity}</p>
                    <p className="text-sm text-slate-600 mt-1">📍 {day.afternoon.location}</p>
                    <p className="text-sm text-slate-700 mt-2">{day.afternoon.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-slate-600">
                      <span>⏱️ {day.afternoon.duration}</span>
                      <span>💰 {day.afternoon.estimated_cost}</span>
                    </div>
                    {day.afternoon.tips && (
                      <p className="text-xs text-blue-600 mt-2">💡 {day.afternoon.tips}</p>
                    )}
                  </div>
                )}

                {/* Evening */}
                {day.evening && (
                  <div className="border-l-4 border-indigo-400 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Moon className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-bold">Evening - {day.evening.time}</h3>
                    </div>
                    <p className="font-medium text-slate-900">{day.evening.activity}</p>
                    <p className="text-sm text-slate-600 mt-1">📍 {day.evening.location}</p>
                    <p className="text-sm text-slate-700 mt-2">{day.evening.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-slate-600">
                      <span>⏱️ {day.evening.duration}</span>
                      <span>💰 {day.evening.estimated_cost}</span>
                    </div>
                    {day.evening.tips && (
                      <p className="text-xs text-blue-600 mt-2">💡 {day.evening.tips}</p>
                    )}
                  </div>
                )}

                {/* Accommodation */}
                {day.accommodation && (
                  <div className="bg-blue-50 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Hotel className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold">Accommodation</h3>
                    </div>
                    <p className="font-medium">{day.accommodation.hotel_name}</p>
                    <p className="text-sm text-slate-600">📍 {day.accommodation.location}</p>
                    <p className="text-sm text-slate-900 mt-1">💰 {day.accommodation.estimated_cost} - {day.accommodation.category}</p>
                    {day.accommodation.amenities && (
                      <p className="text-xs text-slate-600 mt-1">
                        Amenities: {day.accommodation.amenities.join(', ')}
                      </p>
                    )}
                  </div>
                )}

                {/* Food Recommendations */}
                {day.food_recommendations && day.food_recommendations.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Utensils className="w-5 h-5 text-green-600" />
                      <h3 className="font-bold">Food Recommendations</h3>
                    </div>
                    {day.food_recommendations.map((food, idx) => (
                      <div key={idx} className="mb-2 last:mb-0">
                        <p className="text-sm font-medium">{food.meal_type} - {food.restaurant}</p>
                        <p className="text-xs text-slate-600">
                          {food.dishes.join(', ')} • {food.estimated_cost} • 📍 {food.location}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Travel Notes */}
                {day.travel_notes && (
                  <div className="bg-amber-50 rounded-lg p-3 mt-4">
                    <p className="text-sm text-amber-900">
                      <Info className="w-4 h-4 inline mr-1" />
                      {day.travel_notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'budget' && budget_breakdown && (
        <Card>
          <CardHeader>
            <CardTitle>Budget Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">Accommodation</p>
                <p className="text-2xl font-bold text-blue-600">{budget_breakdown.accommodation?.total}</p>
                <p className="text-xs text-slate-500">Avg: {budget_breakdown.accommodation?.per_day_avg}/day</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">Food</p>
                <p className="text-2xl font-bold text-green-600">{budget_breakdown.food?.total}</p>
                <p className="text-xs text-slate-500">Avg: {budget_breakdown.food?.per_day_avg}/day</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">Activities</p>
                <p className="text-2xl font-bold text-purple-600">{budget_breakdown.activities?.total}</p>
                <p className="text-xs text-slate-500">Avg: {budget_breakdown.activities?.per_day_avg}/day</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">Transport</p>
                <p className="text-2xl font-bold text-orange-600">
                  {parseInt(budget_breakdown.transport?.intercity?.replace(/[^0-9]/g, '') || 0) + 
                   parseInt(budget_breakdown.transport?.local?.replace(/[^0-9]/g, '') || 0)}
                </p>
                <p className="text-xs text-slate-500">
                  Intercity: {budget_breakdown.transport?.intercity} • Local: {budget_breakdown.transport?.local}
                </p>
              </div>
            </div>
            <div className="bg-rose-50 p-6 rounded-lg mt-4">
              <p className="text-sm text-slate-600">Total Estimated Budget</p>
              <p className="text-3xl font-bold text-rose-600">{budget_breakdown.total_estimated}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'packing' && packing_list && (
        <Card>
          <CardHeader>
            <CardTitle>Packing List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(packing_list).map(([category, items]) => (
                <div key={category}>
                  <h3 className="font-bold text-lg mb-3 capitalize">{category}</h3>
                  <ul className="space-y-2">
                    {items?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'tips' && local_tips && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Local Tips & Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">Language</h3>
                <p className="text-sm text-slate-700">{local_tips.language}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Best Transport</h3>
                <p className="text-sm text-slate-700">{local_tips.best_transport}</p>
              </div>
              {local_tips.safety_tips && (
                <div>
                  <h3 className="font-bold mb-2">Safety Tips</h3>
                  <ul className="space-y-1">
                    {local_tips.safety_tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-slate-700">• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
              {local_tips.cultural_notes && (
                <div>
                  <h3 className="font-bold mb-2">Cultural Notes</h3>
                  <ul className="space-y-1">
                    {local_tips.cultural_notes.map((note, idx) => (
                      <li key={idx} className="text-sm text-slate-700">• {note}</li>
                    ))}
                  </ul>
                </div>
              )}
              {local_tips.emergency_contacts && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-red-900">Emergency Contacts</h3>
                  <div className="space-y-1 text-sm">
                    <p>Police: {local_tips.emergency_contacts.police}</p>
                    <p>Ambulance: {local_tips.emergency_contacts.ambulance}</p>
                    <p>Tourist Helpline: {local_tips.emergency_contacts.tourist_helpline}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {weather_forecast && (
            <Card>
              <CardHeader>
                <CardTitle>Weather Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm"><strong>Temperature:</strong> {weather_forecast.average_temperature}</p>
                <p className="text-sm mt-1"><strong>Conditions:</strong> {weather_forecast.conditions}</p>
                <p className="text-sm mt-1"><strong>What to Expect:</strong> {weather_forecast.what_to_expect}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
