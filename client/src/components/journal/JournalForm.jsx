import React, { useState } from 'react';
import { Upload, Calendar, MapPin, Lock, Globe, Loader2, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function JournalForm({ onJournalCreated }) {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    if (images.length + files.length > 10) {
      toast.error(`Maximum 10 images allowed. You have ${images.length} already.`);
      return;
    }

    setUploadingImages(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('travys_token');
      const response = await fetch(`${API_URL}/api/journal/upload-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const fullUrls = data.images.map(url => `${API_URL}${url}`);
        setImages([...images, ...fullUrls]);
        toast.success(`${files.length} image(s) uploaded!`);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
      e.target.value = null;
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error('Trip title is required');
      return;
    }

    if (!destination.trim()) {
      toast.error('Destination is required');
      return;
    }

    if (!tripDate) {
      toast.error('Trip date is required');
      return;
    }

    if (!notes.trim()) {
      toast.error('Notes are required');
      return;
    }

    if (images.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('travys_token');
      const response = await fetch(`${API_URL}/api/journal/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          destination: destination.trim(),
          tripDate,
          notes: notes.trim(),
          images,
          isPublic
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Journal created successfully!');
        
        // Reset form
        setTitle('');
        setDestination('');
        setTripDate('');
        setNotes('');
        setImages([]);
        setIsPublic(false);
        
        if (onJournalCreated) {
          onJournalCreated(data.journal);
        }
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to create journal');
      }
    } catch (error) {
      console.error('Error creating journal:', error);
      toast.error('Failed to create journal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Journal Entry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <Label htmlFor="title">Trip Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Amazing Weekend in Paris"
            className="mt-1"
            maxLength={200}
            required
          />
        </div>

        {/* Destination */}
        <div>
          <Label htmlFor="destination">Destination *</Label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Paris, France"
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Trip Date */}
        <div>
          <Label htmlFor="tripDate">Trip Date *</Label>
          <div className="relative mt-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="tripDate"
              type="date"
              value={tripDate}
              onChange={(e) => setTripDate(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <Label htmlFor="images">Upload Images * (Max 10)</Label>
          <div className="mt-1">
            <label 
              htmlFor="file-upload" 
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                images.length >= 10 || uploadingImages
                  ? 'border-slate-200 bg-slate-50 cursor-not-allowed text-slate-400'
                  : 'border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700'
              )}
            >
              <Upload className="h-6 w-6" />
              <div className="text-center">
                <span className="text-sm font-medium block">
                  {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                </span>
                <span className="text-xs text-slate-500">
                  {images.length}/10 images • Max 5MB per file
                </span>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={images.length >= 10 || uploadingImages}
                className="hidden"
              />
            </label>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square group">
                  <img
                    src={img}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">Notes *</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share your memories, experiences, and thoughts about this trip..."
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[150px] resize-y"
            maxLength={10000}
            required
          />
          <p className="text-xs text-slate-500 mt-1">{notes.length}/10000</p>
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            {isPublic ? (
              <Globe className="h-5 w-5 text-blue-600" />
            ) : (
              <Lock className="h-5 w-5 text-slate-600" />
            )}
            <div>
              <p className="font-medium text-slate-900">
                {isPublic ? 'Public Journal' : 'Private Journal'}
              </p>
              <p className="text-sm text-slate-600">
                {isPublic 
                  ? 'Visible to everyone in the community' 
                  : 'Only visible to you'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              isPublic ? 'bg-blue-600' : 'bg-slate-300'
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                isPublic ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || uploadingImages}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving Journal...
            </>
          ) : (
            'Save Journal'
          )}
        </Button>
      </form>
    </div>
  );
}
