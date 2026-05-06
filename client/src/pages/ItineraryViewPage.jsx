import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  MapPin, Calendar, Wallet, Sun, Moon, Sunset, Hotel, 
  Utensils, Info, Download, Share2, ArrowLeft, ShieldCheck, 
  Wifi, Languages, AlertTriangle, Phone, Hospital, Zap
} from 'lucide-react';
import { exportToPDF } from '../lib/pdfExport';
import toast from 'react-hot-toast';

export default function ItineraryViewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const itinerary = location.state;
  const [activeTab, setActiveTab] = useState('itinerary');

  if (!itinerary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <MapPin className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">No Itinerary Data</h2>
        <p className="text-slate-600 mb-6">Start your journey by creating a new trip plan.</p>
        <Button onClick={() => navigate('/app/plan-trip')}>
          Create New Trip
        </Button>
      </div>
    );
  }

  const { trip_overview, daily_itinerary, budget_breakdown, packing_list, local_tips, weather_forecast } = itinerary;

  return (
    <div className="w-full max-w-none space-y-6 pb-12">
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-rose-600 transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Planner
        </button>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              toast.loading('Generating PDF...');
              setTimeout(() => {
                exportToPDF(itinerary);
                toast.dismiss();
                toast.success('PDF downloaded successfully!');
              }, 500);
            }}
          >
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard!');
            }}
          >
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </div>

      {/* Hero Summary */}
      <div className="bg-gradient-to-br from-rose-600 to-rose-500 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-white/80 font-bold tracking-wider text-xs uppercase">
            <MapPin className="w-4 h-4" />
            <span>{trip_overview?.destination}</span>
          </div>
          <h1 className="text-4xl font-bold">{trip_overview?.destination?.split('→')[0].trim()} Expedition</h1>
          
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/70" />
              <span className="font-medium">{trip_overview?.total_days || 0} Days</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-white/70" />
              <span className="font-medium">{trip_overview?.trip_theme}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-white/70" />
              <span className="font-medium">
                {trip_overview?.total_estimated_budget ? String(trip_overview.total_estimated_budget).split('|')[0].trim() : 'Budget TBD'}
              </span>
            </div>
          </div>
          <p className="max-w-3xl text-white/90 leading-relaxed italic border-l-2 border-white/30 pl-4 py-1">
            "{trip_overview?.travel_summary}"
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-200 pt-2 sticky top-0 bg-white z-10">
        {['itinerary', 'budget', 'packing', 'tips'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-1 font-bold text-sm uppercase tracking-widest transition-all ${
              activeTab === tab
                ? 'text-rose-600 border-b-2 border-rose-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'itinerary' && (
          <div className="space-y-8">
            {daily_itinerary?.map((day, index) => (
              <Card key={index} className="overflow-hidden border-slate-200">
                <CardHeader className="bg-slate-50 text-slate-900 border-b border-slate-200 p-6">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-rose-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg shadow-rose-200">
                        {day.day}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">{day.title}</CardTitle>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                          {day.date} • {day.theme}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Est. Spend</p>
                      <p className="text-lg font-bold text-rose-600">
                        {day.daily_estimated_cost ? String(day.daily_estimated_cost).split('(')[0] : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-8">
                  {/* Activity Slots */}
                  {[
                    { type: 'Morning', data: day.morning, icon: Sun, color: 'text-yellow-600', border: 'border-yellow-200' },
                    { type: 'Afternoon', data: day.afternoon, icon: Sunset, color: 'text-orange-600', border: 'border-orange-200' },
                    { type: 'Evening', data: day.evening, icon: Moon, color: 'text-indigo-600', border: 'border-indigo-200' }
                  ].map((slot, i) => slot.data && (
                    <div key={i} className={`border-l-4 ${slot.border} pl-6 py-1`}>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <slot.icon className={`w-5 h-5 ${slot.color}`} />
                        <h3 className="font-bold text-slate-900">{slot.type} — {slot.data.time}</h3>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          {slot.data.duration}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-slate-900">{slot.data.activity}</p>
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5" /> {slot.data.location} {slot.data.neighborhood && `• ${slot.data.neighborhood}`}
                      </p>
                      <p className="text-slate-600 mt-3 text-sm leading-relaxed">{slot.data.description}</p>
                      <div className="flex flex-wrap gap-4 mt-4">
                        {slot.data.entry_fee && <span className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">💰 Fee: {slot.data.entry_fee}</span>}
                        {slot.data.tips && <span className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg italic">💡 {slot.data.tips}</span>}
                      </div>
                    </div>
                  ))}

                  {/* Accommodation & Food */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {day.accommodation && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Hotel className="w-5 h-5 text-rose-600" />
                          <h3 className="font-bold text-sm uppercase tracking-wider">Stay</h3>
                        </div>
                        <p className="font-bold text-slate-900">{day.accommodation.hotel_name}</p>
                        <p className="text-sm text-slate-600 mt-1">{day.accommodation.area || day.accommodation.location}</p>
                        <p className="text-sm font-bold text-rose-600 mt-2">{day.accommodation.estimated_cost}</p>
                        {day.accommodation.amenities && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {day.accommodation.amenities.slice(0, 4).map((a, j) => (
                              <span key={j} className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 font-medium text-slate-500">{a}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {day.food_recommendations && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Utensils className="w-5 h-5 text-emerald-600" />
                          <h3 className="font-bold text-sm uppercase tracking-wider">Dining</h3>
                        </div>
                        {day.food_recommendations.slice(0, 2).map((food, idx) => (
                          <div key={idx} className="mb-4 last:mb-0">
                            <p className="text-sm font-bold text-slate-900">{food.meal_type}: {food.restaurant}</p>
                            <p className="text-xs text-slate-600">{food.cuisine_type} • {food.area}</p>
                            <p className="text-xs text-emerald-700 font-bold mt-1">Must try: {Array.isArray(food.must_order) ? food.must_order.join(', ') : food.must_order}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'budget' && budget_breakdown && (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Lodging', val: budget_breakdown.accommodation?.total, sub: `${budget_breakdown.accommodation?.per_day_avg}/day`, color: 'bg-blue-50 text-blue-600' },
                  { label: 'Food', val: budget_breakdown.food?.total, sub: `${budget_breakdown.food?.per_day_avg}/day`, color: 'bg-emerald-50 text-emerald-600' },
                  { label: 'Activities', val: budget_breakdown.activities_entry_fees?.total || budget_breakdown.activities?.total, sub: 'Entry fees & tours', color: 'bg-purple-50 text-purple-600' },
                  { label: 'Transport', val: budget_breakdown.transport?.local_total || budget_breakdown.transport?.local, sub: `Intercity: ${budget_breakdown.transport?.intercity_total || budget_breakdown.transport?.intercity}`, color: 'bg-orange-50 text-orange-600' }
                ].map((item, i) => (
                  <div key={i} className={`${item.color.split(' ')[0]} p-5 rounded-xl border border-slate-100`}>
                    <p className="text-xs font-bold uppercase opacity-70 mb-1">{item.label}</p>
                    <p className="text-2xl font-bold">{item.val}</p>
                    <p className="text-[10px] mt-1 font-bold opacity-60">{item.sub}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-rose-700 to-rose-600 text-white p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Wallet className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-bold text-rose-200 uppercase tracking-widest mb-1">Total Estimated Investment</p>
                  <p className="text-4xl font-bold text-white">{budget_breakdown.grand_total_budget_scenario || budget_breakdown.total_estimated}</p>
                  {budget_breakdown.grand_total_luxury_scenario && <p className="text-xs text-rose-100 mt-2 font-medium italic">Premium scenario estimated up to {budget_breakdown.grand_total_luxury_scenario}</p>}
                </div>
                <div className="relative z-10 text-center md:text-right space-y-1">
                  <p className="text-xs text-rose-200">Calculated for {trip_overview?.total_days} days</p>
                  <p className="text-xs text-rose-200">Source: AI Projected Rates 2024-25</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'packing' && packing_list && (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Expedition Gear List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(packing_list).map(([category, items]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 capitalize flex items-center gap-2">
                      <div className="w-1 h-4 bg-rose-600 rounded-full"></div>
                      {category}
                    </h3>
                    <ul className="space-y-3">
                      {Array.isArray(items) && items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span className="text-sm text-slate-600">{item}</span>
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Local Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2"><Languages className="w-4 h-4" /> Language Bridge</h3>
                    <div className="bg-rose-50/50 p-6 rounded-[2rem] border border-rose-100 shadow-sm">
                      <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3">Primary Dialect</p>
                      <p className="text-xl font-black text-slate-900 mb-6">{local_tips.primary_language || local_tips.language}</p>
                      <div className="space-y-4 border-t border-rose-200 pt-6">
                        {local_tips.useful_phrases?.map((ph, i) => (
                          <div key={i} className="flex justify-between items-center group">
                            <div>
                              <p className="text-rose-600 font-black text-lg group-hover:translate-x-1 transition-transform">"{ph.phrase}"</p>
                              <p className="text-xs font-bold text-slate-400 uppercase">{ph.meaning}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <Phone className="w-3 h-3 text-rose-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2"><Wifi className="w-4 h-4" /> Connectivity</h3>
                    <p className="text-xs text-slate-600">{local_tips.connectivity?.network_quality} • {local_tips.connectivity?.recommended_sim}</p>
                  </div>
                  {local_tips.scam_warnings && (
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                      <h3 className="font-bold text-sm text-amber-900 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Scam Awareness</h3>
                      <ul className="space-y-2">
                        {local_tips.scam_warnings.map((scam, idx) => (
                          <li key={idx} className="text-xs text-amber-800 leading-relaxed">• {scam}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-slate-200 bg-rose-50 border-rose-100">
                  <CardHeader>
                    <CardTitle className="text-lg text-rose-900">Emergency Contacts</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Police', val: local_tips.emergency_contacts?.police, icon: ShieldCheck },
                      { label: 'Medical', val: local_tips.emergency_contacts?.ambulance, icon: Hospital },
                      { label: 'Fire', val: local_tips.emergency_contacts?.fire, icon: Zap },
                      { label: 'Tourist', val: local_tips.emergency_contacts?.tourist_helpline, icon: Phone }
                    ].map((item, i) => item.val && (
                      <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-rose-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
                        <p className="text-lg font-bold text-rose-600">{item.val}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {weather_forecast && (
                  <Card className="border-none bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sun className="w-5 h-5" />
                        Meteorological Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                          <p className="text-[10px] font-bold text-indigo-200 uppercase">High/Low</p>
                          <p className="text-2xl font-bold">{weather_forecast.daytime_high || weather_forecast.average_temperature} / {weather_forecast.nighttime_low}</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                          <p className="text-[10px] font-bold text-indigo-200 uppercase">UV Index</p>
                          <p className="text-2xl font-bold text-rose-400">{weather_forecast.uv_index || 'Low'}</p>
                        </div>
                      </div>
                      <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold text-indigo-200 uppercase mb-1">Conditions</p>
                        <p className="text-sm font-medium">{weather_forecast.conditions}</p>
                      </div>
                      <div className="p-4 bg-black/20 rounded-2xl text-xs italic text-slate-100 border border-white/5 leading-relaxed">
                        "{weather_forecast.what_to_wear}. {weather_forecast.what_to_expect}"
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
