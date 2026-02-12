import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import api from '../lib/api'

export default function AuthModal({ triggerLabel = 'Login / Get Started' }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: ''
  });

 const handleGoogle = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  console.log("ENV VALUE:", BASE_URL);

  if (!BASE_URL) {
    alert("API URL is not configured in Vercel!");
    return;
  }

  window.location.href = `${BASE_URL}/api/auth/google`;
};


  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.token) {
        localStorage.setItem('travys_token', response.data.token);
        localStorage.setItem('travys_user', JSON.stringify(response.data.user));
        localStorage.setItem('travys_auth', '1');
        toast.success('Login successful!');
        setOpen(false);
        window.location.href = '/app/dashboard';
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.firstName) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/register', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName
      });

      if (response.data.token) {
        localStorage.setItem('travys_token', response.data.token);
        localStorage.setItem('travys_user', JSON.stringify(response.data.user));
        localStorage.setItem('travys_auth', '1');
        toast.success('Account created successfully!');
        setOpen(false);
        window.location.href = '/app/dashboard';
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to TravelBUDDY</DialogTitle>
        </DialogHeader>

        <Tabs.Root defaultValue="login">
          <Tabs.List aria-label="Auth tabs" className="mb-4 flex gap-2 rounded-lg border border-slate-200 p-1">
            <Tabs.Trigger
              className="flex-1 rounded-md py-2 text-sm data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700"
              value="login"
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              className="flex-1 rounded-md py-2 text-sm data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700"
              value="signup"
            >
              Sign Up
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  autoFocus 
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <Button className="w-full bg-rose-600 hover:bg-rose-700" type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Or continue with</span>
                </div>
              </div>
              <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </form>
          </Tabs.Content>

          <Tabs.Content value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName"
                  type="text" 
                  placeholder="Your first name" 
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required 
                  autoFocus 
                />
              </div>
              <div>
                <Label htmlFor="email2">Email</Label>
                <Input 
                  id="email2" 
                  name="email"
                  type="email" 
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="password2">Password</Label>
                <Input 
                  id="password2" 
                  name="password"
                  type="password" 
                  placeholder="Create a password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <Button className="w-full bg-rose-600 hover:bg-rose-700" type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Or continue with</span>
                </div>
              </div>
              <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </form>
          </Tabs.Content>
        </Tabs.Root>
      </DialogContent>
    </Dialog>
  );
}
