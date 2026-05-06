import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plane, MapPin, Sparkles, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import api from '../lib/api';
import { API_BASE_URL } from '../config';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/register', formData);
      const { token, user } = response.data;

      sessionStorage.setItem('travys_token', token);
      sessionStorage.setItem('travys_user', JSON.stringify(user));

      toast.success(`🎉 Welcome to TravelBUDDY, ${user.firstName}! Let's plan your first trip together.`, {
        duration: 6000,
        icon: '✈️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-orange-400 to-pink-500 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Decorative Icons */}
      <motion.div
        className="absolute top-20 right-20 text-white/20 hidden lg:block"
        variants={floating(20, 8)}
        animate="animate"
      >
        <Plane className="w-16 h-16" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-20 text-white/20 hidden lg:block"
        variants={floating(-15, 10)}
        animate="animate"
      >
        <MapPin className="w-20 h-20" />
      </motion.div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="bg-white rounded-xl p-2.5 shadow-xl transition-transform group-hover:scale-110">
              <MapPin className="w-8 h-8 text-rose-600" />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tight">TravelBUDDY</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/80 font-medium">Join our community of travelers today</p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-center text-2xl font-bold text-slate-900">Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-700 font-semibold ml-1">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="e.g. John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="h-12 border-slate-200 focus:border-rose-500 focus:ring-rose-500 rounded-xl bg-slate-50/50"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-semibold ml-1">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12 border-slate-200 focus:border-rose-500 focus:ring-rose-500 rounded-xl bg-slate-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-semibold ml-1">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-12 border-slate-200 focus:border-rose-500 focus:ring-rose-500 rounded-xl bg-slate-50/50"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Get Started <UserPlus className="w-5 h-5" />
                    </span>
                  )}
                </Button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/95 px-4 text-slate-400 font-medium tracking-wider">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 border-slate-100 hover:bg-slate-50 font-bold text-slate-700 rounded-xl transition-all flex items-center justify-center gap-3"
                  onClick={handleGoogleSignup}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p 
          className="text-center mt-8 text-white font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-200 font-bold hover:text-white transition-colors underline underline-offset-4 decoration-2">
            Log in here
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
