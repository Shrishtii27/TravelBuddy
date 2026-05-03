import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapPin } from 'lucide-react';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const userParam = params.get('user');
    
    if (token) {
      sessionStorage.setItem('travys_token', token);
      sessionStorage.setItem('travys_auth', '1');
      
      // Store user data if provided
      if (userParam) {
        try {
          const userData = JSON.parse(decodeURIComponent(userParam));
          sessionStorage.setItem('travys_user', JSON.stringify(userData));
        } catch (error) {
          console.log('Could not parse user data:', error);
        }
      }
      
      toast.success(`🎉 Welcome to TravelBUDDY! Ready to explore the world?`, {
        duration: 5000,
        icon: '🌍',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      
      // Redirect to landing page (authenticated state)
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } else {
      toast.error('Google login failed. Please try again.');
      navigate('/', { replace: true });
    }
  }, [params, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-orange-400 to-pink-500 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <div className="bg-white rounded-2xl p-4 shadow-2xl animate-bounce">
          <MapPin className="w-12 h-12 text-rose-600" />
        </div>
        <div className="text-white text-2xl font-bold tracking-tight animate-pulse">
          Signing you in...
        </div>
        <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white animate-progress w-full"></div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 1.5s infinite linear;
        }
      `}} />
    </div>
  );
}
