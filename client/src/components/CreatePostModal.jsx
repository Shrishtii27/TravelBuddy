import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, MapPin, Hash, Loader2, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [destination, setDestination] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUserTrips();
    }
  }, [isOpen]);

  const fetchUserTrips = async () => {
    try {
      const token = localStorage.getItem('travys_token');
      const response = await fetch(`${API_URL}/api/trips`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserTrips(data.trips || []);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (imageUrlInput.trim() && imageUrls.length < 6) {
      setImageUrls([...imageUrls, { url: imageUrlInput.trim(), caption: '' }]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls(imageUrls.filter((_, idx) => idx !== index));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check total images limit
    if (imageUrls.length + files.length > 6) {
      toast.error(`You can only upload up to 6 images. You have ${imageUrls.length} already.`);
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('travys_token');
      const response = await fetch(`${API_URL}/api/upload/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const newImages = data.images.map(img => ({
          url: `${API_URL}${img.url}`,
          caption: ''
        }));
        setImageUrls([...imageUrls, ...newImages]);
        toast.success(`${files.length} image(s) uploaded successfully!`);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImage(false);
      // Reset file input
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('travys_token');
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          destination: destination.trim() || undefined,
          tags,
          images: imageUrls,
          tripId: selectedTrip || undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Post created successfully!');
        
        // Reset form
        setTitle('');
        setContent('');
        setDestination('');
        setTags([]);
        setImageUrls([]);
        setSelectedTrip('');
        
        if (onPostCreated) {
          onPostCreated(data.post);
        }
        
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Share Your Travel Story</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a catchy title..."
              className="mt-1"
              maxLength={200}
              required
            />
            <p className="text-xs text-slate-500 mt-1">{title.length}/200</p>
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Your Story *</Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your travel experience, tips, and memories..."
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[150px] resize-y"
              maxLength={5000}
              required
            />
            <p className="text-xs text-slate-500 mt-1">{content.length}/5000</p>
          </div>

          {/* Destination */}
          <div>
            <Label htmlFor="destination">Destination</Label>
            <div className="mt-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Paris, France"
                className="pl-10"
              />
            </div>
          </div>

          {/* Link to Trip (Optional) */}
          {userTrips.length > 0 && (
            <div>
              <Label htmlFor="trip">Link to Your Trip (Optional)</Label>
              <select
                id="trip"
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">No trip selected</option>
                {userTrips.map((trip) => (
                  <option key={trip._id} value={trip._id}>
                    {trip.name} - {trip.destination}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags (up to 5)</Label>
            <div className="mt-1 flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                  placeholder="e.g., adventure, foodie, budget"
                  className="pl-10"
                  disabled={tags.length >= 5}
                />
              </div>
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
                variant="outline"
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm flex items-center gap-2 border border-blue-200"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <Label htmlFor="images">Images (up to 6)</Label>
            
            {/* File Upload Button */}
            <div className="mt-1 flex gap-2">
              <label 
                htmlFor="file-upload" 
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  imageUrls.length >= 6 || uploadingImage
                    ? 'border-slate-200 bg-slate-50 cursor-not-allowed text-slate-400'
                    : 'border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700'
                }`}
              >
                <Upload className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {uploadingImage ? 'Uploading...' : 'Upload from Device'}
                </span>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={imageUrls.length >= 6 || uploadingImage}
                  className="hidden"
                />
              </label>
            </div>

            {/* Or divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="text-xs text-slate-500 font-medium">OR</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            {/* URL Input */}
            <div className="flex gap-2">
              <Input
                id="images"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddImageUrl(e)}
                placeholder="Paste image URL (e.g., https://...)"
                disabled={imageUrls.length >= 6}
              />
              <Button
                type="button"
                onClick={handleAddImageUrl}
                disabled={!imageUrlInput.trim() || imageUrls.length >= 6}
                variant="outline"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              📸 Upload images directly from your device or paste image URLs
            </p>
            
            {imageUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {imageUrls.map((img, idx) => (
                  <div key={idx} className="relative aspect-square group">
                    <img
                      src={img.url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                'Share Post'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
