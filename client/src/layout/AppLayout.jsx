import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { Home, Map, Sparkles, TrendingUp, Users, BookOpen, Menu, X, LogOut } from 'lucide-react';
import Logo from '../components/Logo';
import { AnimatePresence, motion } from 'framer-motion';

export default function AppLayout() {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    const userStr = sessionStorage.getItem('travys_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);
  
  // Listen for storage changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      const userStr = sessionStorage.getItem('travys_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
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
    sessionStorage.removeItem('travys_auth');
    sessionStorage.removeItem('travys_token');
    sessionStorage.removeItem('travys_user');
    toast.success('Logout successful!');
    window.location.replace('/');
  };

  const SidebarContent = () => (
    <>
      <div className="mb-8 flex items-center justify-between">
        <Logo />
        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1 space-y-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100 transition-all duration-200',
                isActive && 'bg-rose-50 text-rose-600 font-semibold shadow-sm'
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-6 border-t border-slate-100">
        {currentUser && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
            {currentUser.profilePicture ? (
              <img
                src={currentUser.profilePicture}
                alt={currentUser.firstName || 'User'}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-white font-semibold shadow-sm">
                {currentUser.firstName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {currentUser.firstName || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate font-medium">
                {currentUser.email}
              </p>
            </div>
          </div>
        )}
        <Button 
          variant="outline" 
          className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-bold rounded-xl py-6 h-auto" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-white md:bg-slate-50">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 z-40 md:hidden">
        <Logo />
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-80 flex-col border-r border-slate-200 bg-white p-8 shadow-sm md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white p-8 shadow-2xl z-50 flex flex-col md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 p-4 md:p-10 pt-24 md:pt-10 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
