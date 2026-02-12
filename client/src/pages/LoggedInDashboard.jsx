import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { 
  MapPin, User, Settings, Search, Sparkles, TrendingUp, 
  Map, Camera, Users, Calendar, ArrowRight, Plus, Star, Trophy
} from 'lucide-react';
import Footer from '../components/sections/Footer';
export default function LoggedInDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('travys_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const handleLogout = () => {
    localStorage.removeItem('travys_token');
    localStorage.removeItem('travys_user');
    localStorage.removeItem('travys_auth');
    toast.success('Logout successful!');
    window.location.href = '/';
  };

  const handleViewAllDestinations = () => {
    navigate('/app/enhanced-map');
  };

  const handlePlanTripForDestination = (destinationName) => {
    navigate('/app/ai-itinerary', { state: { destination: destinationName } });
  };

  const features = [
    {
      title: "AI Trip Planner",
      description: "Create intelligent itineraries for any Indian destination",
      icon: Sparkles,
      link: "/app/ai-itinerary",
      color: "bg-purple-500 hover:bg-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      stats: "Plan your perfect trip in minutes"
    },
    {
      title: "Expense Tracker", 
      description: "Track your travel expenses in ₹ with detailed insights",
      icon: TrendingUp,
      link: "/app/expense-tracker",
      color: "bg-green-500 hover:bg-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      stats: "Save up to ₹10,000 per trip"
    },
    {
      title: "Travel Journal",
      description: "Document your journeys with photos and memories",
      icon: Camera,
      link: "/app/journal",
      color: "bg-rose-500 hover:bg-rose-600",
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
      stats: "Share with community"
    },
    {
      title: "Travel Community",
      description: "Connect with fellow Indian travelers and get tips",
      icon: Users,
      link: "/app/community",
      color: "bg-orange-500 hover:bg-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      stats: "50,000+ travelers"
    },
    {
      title: "My Profile",
      description: "Customize your travel preferences and settings",
      icon: User,
      link: "/app/profile",
      color: "bg-indigo-500 hover:bg-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      stats: "Personalize experience"
    }
  ];


  const recentDestinations = [
    {
      name: "Goa",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=300&q=80",
      trending: true
    },
    {
      name: "Rajasthan", 
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=300&q=80",
      trending: true
    },
    {
      name: "Kerala",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=300&q=80",
      trending: false
    },
    {
      name: "Kashmir",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&q=80",
      trending: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      {/* Top Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/app/dashboard" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl p-2.5 shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900">TravelBUDDY</span>
            </Link>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <Link to="/app/plan-trip" className="px-4 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-white rounded-lg font-medium transition-all flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Planner
              </Link>
              <Link to="/app/expense-tracker" className="px-4 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-white rounded-lg font-medium transition-all flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Expenses
              </Link>
              <Link to="/app/journal" className="px-4 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-white rounded-lg font-medium transition-all flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Journal
              </Link>
              <Link to="/app/community" className="px-4 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-white rounded-lg font-medium transition-all flex items-center gap-2">
                <Users className="w-4 h-4" />
                Community
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <Link to="/app/profile">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 rounded-xl p-2 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-white text-base font-bold shadow-md">
                    {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-semibold text-slate-900 hidden sm:block">{user?.firstName || 'User'}</span>
                </div>
              </Link>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-slate-600 hover:text-rose-600 hover:bg-rose-50 font-medium"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-pink-500 rounded-3xl p-10 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <Star className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold">Premium Member</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                  Welcome back, {user?.firstName || 'Traveler'}! 👋
                </h1>
                <p className="text-white/90 text-xl mb-8 max-w-2xl">
                  Ready to plan your next incredible Indian adventure? Let's turn your travel dreams into reality!
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/app/plan-trip">
                    <Button size="lg" className="bg-white text-rose-600 hover:bg-yellow-200 hover:text-rose-700 shadow-xl font-bold h-14 px-8">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create AI Itinerary
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
            
            {/* Background Decorative Elements */}
            <div className="absolute right-0 top-0 w-80 h-80 opacity-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              >
                <MapPin className="w-full h-full" />
              </motion.div>
            </div>
            <div className="absolute left-10 bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute right-20 top-20 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl" />
          </div>
        </motion.div>


        {/* Main Features Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Explore All Features</h2>
              <p className="text-slate-600 text-lg">Everything you need for the perfect trip</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={feature.title} to={feature.link}>
                <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer border-2 border-transparent hover:border-rose-200 bg-white">
                  <CardContent className="p-8">
                    <div className={`${feature.bgColor} rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                      <feature.icon className={`w-8 h-8 ${feature.textColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">{feature.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-sm font-medium text-slate-500">{feature.stats}</span>
                      <div className="bg-rose-50 rounded-full p-2 group-hover:bg-rose-100 transition-colors">
                        <ArrowRight className="w-5 h-5 text-rose-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Trending Destinations */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Trending Indian Destinations</h2>
              <p className="text-slate-600 text-lg">Popular places travelers are exploring right now</p>
            </div>
            <Link to="/app/enhanced-map">
              <Button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {recentDestinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer hover:-translate-y-2 border-2 border-transparent hover:border-rose-200"
                >
                  <div className="relative">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    {destination.trending && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-lg">
                        <Trophy className="w-3 h-3" />
                        Trending
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-bold text-white text-lg mb-1">{destination.name}</h3>
                      <Button size="sm" className="bg-white/90 text-slate-900 hover:bg-white text-xs font-semibold">
                        Plan Trip
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-0 shadow-xl">
            <CardContent className="p-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Your Travel Journey</h2>
                <p className="text-slate-600 text-lg">Track your progress and unlock achievements</p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8">
                <motion.div 
                  className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-4xl font-extrabold text-blue-600 mb-2">0</div>
                  <div className="text-slate-600 font-medium">Trips Planned</div>
                  <div className="text-xs text-slate-500 mt-2">Start planning your first trip!</div>
                </motion.div>
                <motion.div 
                  className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-4xl font-extrabold text-green-600 mb-2">₹0</div>
                  <div className="text-slate-600 font-medium">Money Saved</div>
                  <div className="text-xs text-slate-500 mt-2">Save with smart budgeting</div>
                </motion.div>
                <motion.div 
                  className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-4xl font-extrabold text-purple-600 mb-2">0</div>
                  <div className="text-slate-600 font-medium">States Visited</div>
                  <div className="text-xs text-slate-500 mt-2">Explore all 28 states!</div>
                </motion.div>
                <motion.div 
                  className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-4xl font-extrabold text-orange-600 mb-2">0</div>
                  <div className="text-slate-600 font-medium">Memories Created</div>
                  <div className="text-xs text-slate-500 mt-2">Share your journey</div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}