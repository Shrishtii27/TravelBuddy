import React, { useState, useEffect } from 'react';
import { Camera, Mail, User as UserIcon, Calendar, Save, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('travys_token');
      if (!token) {
        toast.error('Please login to view your profile');
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          email: data.user.email || '',
        });
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('travys_token');
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // Update localStorage
        localStorage.setItem('travys_user', JSON.stringify(data.user));
        
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        
        // Refresh the page to update sidebar
        window.location.reload();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-600">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-600">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-600 mt-1">Manage your account information and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Profile Header with Cover */}
        <div className="relative h-32 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.firstName || 'User'}
                  className="h-32 w-32 rounded-full object-cover ring-4 ring-white bg-white"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 ring-4 ring-white flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              {/* Camera icon for future profile picture upload */}
              {/* <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-slate-50">
                <Camera className="h-4 w-4 text-slate-600" />
              </button> */}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 pb-6 px-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {user.firstName} {user.lastName || ''}
              </h2>
              <p className="text-slate-600 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
            
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <Label htmlFor="firstName">First Name</Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="mt-1"
                />
              ) : (
                <div className="mt-1 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                  {user.firstName || 'Not set'}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className="mt-1"
                />
              ) : (
                <div className="mt-1 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                  {user.lastName || 'Not set'}
                </div>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="mt-1 px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 text-slate-600">
                {user.email}
              </div>
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Account Created */}
            <div>
              <Label>Member Since</Label>
              <div className="mt-1 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                {formatDate(user.createdAt)}
              </div>
            </div>

            {/* Login Method */}
            <div>
              <Label>Login Method</Label>
              <div className="mt-1 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                {user.googleId ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google Account
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-slate-400" />
                    Email & Password
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">0</div>
                <div className="text-sm text-blue-600 mt-1">Total Trips</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">0</div>
                <div className="text-sm text-green-600 mt-1">Itineraries Created</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-700">$0</div>
                <div className="text-sm text-purple-600 mt-1">Total Expenses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
