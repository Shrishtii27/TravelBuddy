import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin, Calendar, Users, Trash2, Heart, Eye, Loader } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function MyItinerariesPage() {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await api.get('/api/itinerary/my-itineraries');
      if (response.data.success) {
        setItineraries(response.data.itineraries);
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      toast.error('Failed to load itineraries');
    } finally {
      setLoading(false);
    }
  };

  const deleteItinerary = async (id) => {
    if (!confirm('Are you sure you want to delete this itinerary?')) return;

    try {
      const response = await api.delete(`/api/itinerary/${id}`);
      if (response.data.success) {
        toast.success('Itinerary deleted');
        setItineraries(itineraries.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      toast.error('Failed to delete itinerary');
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const response = await api.patch(`/api/itinerary/${id}/favorite`);
      if (response.data.success) {
        setItineraries(itineraries.map(item => 
          item._id === id ? { ...item, isFavorite: response.data.isFavorite } : item
        ));
        toast.success(response.data.isFavorite ? 'Added to favorites' : 'Removed from favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite');
    }
  };

  const viewItinerary = (itinerary) => {
    navigate('/app/itinerary', { state: itinerary.itineraryData });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Itineraries</h1>
          <p className="text-slate-600 mt-1">View and manage your saved trip plans</p>
        </div>
        <Button 
          onClick={() => navigate('/app/plan-trip')}
          className="bg-gradient-to-r from-rose-600 to-orange-600 text-white"
        >
          + Create New Trip
        </Button>
      </div>

      {itineraries.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <MapPin className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Itineraries Yet</h3>
            <p className="text-slate-600 mb-6">Start planning your next adventure!</p>
            <Button 
              onClick={() => navigate('/app/plan-trip')}
              className="bg-rose-600 text-white"
            >
              Plan Your First Trip
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <Card key={itinerary._id} className="hover:shadow-lg transition-shadow relative">
              <button
                onClick={() => toggleFavorite(itinerary._id)}
                className="absolute top-4 right-4 z-10"
              >
                <Heart 
                  className={`w-6 h-6 ${
                    itinerary.isFavorite 
                      ? 'fill-rose-600 text-rose-600' 
                      : 'text-slate-400 hover:text-rose-600'
                  }`}
                />
              </button>

              <CardHeader className="bg-gradient-to-br from-rose-50 to-orange-50">
                <CardTitle className="text-xl">{itinerary.destination}</CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{itinerary.totalDays} days</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(itinerary.startDate).toLocaleDateString('en-IN')}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{itinerary.travelers} traveler{itinerary.travelers > 1 ? 's' : ''}</span>
                  </div>

                  <div className="text-xs text-slate-500">
                    Created {new Date(itinerary.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => viewItinerary(itinerary)}
                    className="flex-1 bg-rose-600 text-white hover:bg-rose-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => deleteItinerary(itinerary._id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
