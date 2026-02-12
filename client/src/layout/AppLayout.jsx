import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { Home, PlaneTakeoff, Map, NotebookText, Wallet, User, Sparkles, TrendingUp, Users, BookOpen } from 'lucide-react';
import Logo from '../components/Logo';

export default function AppLayout() {
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem('travys_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('Current user data:', user); // Debug log
        setCurrentUser(user);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);
  
  // Listen for storage changes (when user logs in)
  React.useEffect(() => {
    const handleStorageChange = () => {
      const userStr = localStorage.getItem('travys_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          console.log('User data updated:', user); // Debug log
          setCurrentUser(user);
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const nav = [
    { to: '/app/dashboard', label: 'Dashboard', icon: Home },
    { to: '/app/plan-trip', label: 'AI Trip Planner', icon: Sparkles },
    { to: '/app/my-itineraries', label: 'My Itineraries', icon: Map },
    { to: '/app/expense-tracker', label: 'Expense Tracker', icon: TrendingUp },
    { to: '/app/journal', label: 'Journal', icon: BookOpen },
    { to: '/app/community', label: 'Community', icon: Users },
  ];

  const handleLogout = () => {
    localStorage.removeItem('travys_auth');
    localStorage.removeItem('travys_token');
    localStorage.removeItem('travys_user');
    toast.success('Logout successful!');
    window.location.replace('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-slate-200 bg-white p-6 shadow-soft md:flex">
        <div className="mb-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100',
                  isActive && 'bg-blue-50 text-blue-700'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-200">
          {currentUser && (
            <div className="mb-4 flex items-center gap-3 px-3 py-2">
              {currentUser.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  alt={currentUser.firstName || 'User'}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-white font-semibold">
                  {currentUser.firstName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {currentUser.firstName || 'User'}
                </p>
                <p className="text-xs text-slate-600 truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>
          )}
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
