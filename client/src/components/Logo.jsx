import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Logo({ className = '' }) {
  const location = useLocation();
  
  // Check if user is logged in by checking if we're in /app routes
  const isLoggedIn = location.pathname.startsWith('/app');
  
  // Navigate to dashboard if logged in, otherwise to landing page
  const logoLink = isLoggedIn ? '/app/dashboard' : '/';

  return (
    <Link to={logoLink} className={`flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-600 to-orange-500 text-white font-extrabold">
        <span className="text-xs leading-none">TB</span>
      </div>
      <span className="text-lg font-extrabold tracking-tight">
        <span className="text-slate-900">Travel</span>
        <span className="text-rose-600">BUDDY</span>
      </span>
    </Link>
  );
}
