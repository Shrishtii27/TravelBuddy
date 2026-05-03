import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Plane, MapPin, Sparkles, TrendingUp, Users, Shield, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const floating = (offset = 12, dur = 10) => ({
  animate: {
    y: [0, offset, 0],
    transition: {
      duration: dur,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
});

export default function HeroSection() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = () => {
    const token = sessionStorage.getItem('travys_token');
    const userStr = sessionStorage.getItem('travys_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setCurrentUser(user);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('travys_token');
    sessionStorage.removeItem('travys_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    toast.success('Logged out successfully!');
    window.location.reload(); // Reload to show guest navbar
  };

  const handleDashboardClick = () => {
    navigate('/app/dashboard');
  };

  return (
    <header className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-rose-500 via-orange-400 to-pink-500">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Decorative Icons */}
      <motion.div
        className="absolute top-20 left-20 text-white/20"
        variants={floating(20, 8)}
        animate="animate"
      >
        <Plane className="w-16 h-16" />
      </motion.div>
      <motion.div
        className="absolute bottom-40 right-32 text-white/20"
        variants={floating(-15, 10)}
        animate="animate"
      >
        <MapPin className="w-20 h-20" />
      </motion.div>

      {/* Top Navigation Bar */}
      <motion.nav 
        className="absolute top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-white rounded-xl p-2 shadow-lg transition-transform group-hover:scale-105">
                <MapPin className="w-6 h-6 text-rose-600" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">TravelBUDDY</span>
            </Link>
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white/90 font-medium hover:text-white transition-colors">Features</a>
              <a href="#popular" className="text-white/90 font-medium hover:text-white transition-colors">Destinations</a>
              <a href="#footer" className="text-white/90 font-medium hover:text-white transition-colors">About</a>
            </div>

            {/* Auth Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  {/* User Profile Pill */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    {currentUser?.profilePicture ? (
                      <img
                        src={currentUser.profilePicture}
                        alt={currentUser.firstName || 'User'}
                        className="h-7 w-7 rounded-full object-cover border border-white/50"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-rose-500 flex items-center justify-center border border-white/50">
                        <span className="text-white font-bold text-xs">
                          {currentUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-white font-medium text-sm">
                      {currentUser?.firstName || 'User'}
                    </span>
                  </div>

                  <Button 
                    onClick={handleDashboardClick}
                    className="bg-white text-rose-600 hover:bg-white/90 shadow-md font-semibold rounded-xl h-10 px-5"
                  >
                    Dashboard
                  </Button>

                  <Button 
                    onClick={handleLogout}
                    variant="ghost" 
                    className="text-white/80 hover:text-white hover:bg-white/10 font-medium h-10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login">
                    <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 font-medium">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-white text-rose-600 hover:bg-white/90 shadow-md font-semibold rounded-xl px-6">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Content */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/10 backdrop-blur-lg border-t border-white/20 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-white/90 font-medium hover:text-white py-2">Features</a>
                <a href="#popular" onClick={() => setIsMenuOpen(false)} className="text-white/90 font-medium hover:text-white py-2">Destinations</a>
                <a href="#footer" onClick={() => setIsMenuOpen(false)} className="text-white/90 font-medium hover:text-white py-2">About</a>
                
                <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl">
                        {currentUser?.profilePicture ? (
                          <img src={currentUser.profilePicture} className="h-8 w-8 rounded-full" alt="Profile" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-rose-500 flex items-center justify-center font-bold text-white text-xs">
                            {currentUser?.firstName?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <span className="text-white font-medium">{currentUser?.firstName}</span>
                      </div>
                      <Button onClick={handleDashboardClick} className="bg-white text-rose-600 w-full justify-center">
                        Dashboard
                      </Button>
                      <Button onClick={handleLogout} variant="ghost" className="text-white/80 w-full justify-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="text-white/80 w-full justify-center">Login</Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                        <Button className="bg-white text-rose-600 w-full justify-center">Get Started</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Hero Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Travel Planning</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white mb-6">
              Your Dream Trip
              <br />
              <span className="text-yellow-200">Starts Here</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Discover incredible destinations across India with AI-powered itineraries, 
              smart expense tracking, and a vibrant travel community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to={isLoggedIn ? "/app/dashboard" : "/signup"}>
                <Button size="lg" className="bg-white text-rose-600 hover:bg-white/90 shadow-2xl font-bold text-lg px-8 py-6 h-auto transition-transform hover:scale-105 active:scale-95">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Plan Your Trip Now
                </Button>
              </Link>
              <a href="#popular">
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-rose-600 font-bold text-lg px-8 py-6 h-auto">
                  Explore Destinations
                </Button>
              </a>
            </div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-wrap items-center gap-6 text-white/90"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">50,000+ Travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">₹10L+ Saved</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">100% Secure</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - India Destinations Collage */}
          <motion.div
            className="relative"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
              {/* Row 1 */}
              <div className="space-y-4">
                {/* Goa */}
                <div className="relative group overflow-hidden rounded-2xl shadow-xl cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80"
                    alt="Goa Beaches"
                    className="w-full h-48 object-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-bold text-lg">Goa</p>
                    <p className="text-white/90 text-sm">Beach Paradise</p>
                  </div>
                </div>

                {/* Kerala */}
                <div className="relative group overflow-hidden rounded-2xl shadow-xl cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80"
                    alt="Kerala Backwaters"
                    className="w-full h-64 object-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-bold text-lg">Kerala</p>
                    <p className="text-white/90 text-sm">Backwaters</p>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="space-y-4 md:pt-8">
                {/* Taj Mahal */}
                <div className="relative group overflow-hidden rounded-2xl shadow-xl cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80"
                    alt="Taj Mahal"
                    className="w-full h-56 object-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-bold text-lg">Taj Mahal</p>
                    <p className="text-white/90 text-sm">Agra</p>
                  </div>
                </div>

                {/* Ladakh */}
                <div className="relative group overflow-hidden rounded-2xl shadow-xl cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80"
                    alt="Ladakh Mountains"
                    className="w-full h-48 object-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-bold text-lg">Ladakh</p>
                    <p className="text-white/90 text-sm">Mountains</p>
                  </div>
                </div>

                {/* Jaipur */}
                <div className="relative group overflow-hidden rounded-2xl shadow-xl cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"
                    alt="Jaipur Hawa Mahal"
                    className="w-full h-52 object-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-bold text-lg">Jaipur</p>
                    <p className="text-white/90 text-sm">Pink City</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </header>
  );
}