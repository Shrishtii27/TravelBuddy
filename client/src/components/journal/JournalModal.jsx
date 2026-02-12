import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Lock, Globe, ChevronLeft, ChevronRight, Edit, Save, Loader2, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function JournalModal({ journal, isOpen, onClose, onUpdate, mode = 'view' }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState([]);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (journal) {
      setTitle(journal.title || '');
      setDestination(journal.destination || '');
      setTripDate(journal.tripDate ? new Date(journal.tripDate).toISOString().split('T')[0] : '');
      setNotes(journal.notes || '');
      setImages(journal.images || []);
      setIsPublic(journal.isPublic || false);
      setCurrentImageIndex(0);
    }
  }, [journal]);

  useEffect(() => {
    setIsEditing(mode === 'edit');
  }, [mode]);

  if (!isOpen || !journal) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

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
    if (currentImageIndex >= images.length - 1) {
      setCurrentImageIndex(Math.max(0, images.length - 2));
    }
  };

  const handleUpdate = async () => {
    if (!title.trim() || !destination.trim() || !tripDate || !notes.trim()) {
      toast.error('All fields are required');
      return;
    }

    if (images.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('travys_token');
      const response = await fetch(`${API_URL}/api/journal/${journal._id}`, {
        method: 'PUT',
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
        toast.success('Journal updated successfully!');
        setIsEditing(false);
        if (onUpdate) {
          onUpdate(data.journal);
        }
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update journal');
      }
    } catch (error) {
      console.error('Error updating journal:', error);
      toast.error('Failed to update journal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? 'Edit Journal' : 'View Journal'}
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {isEditing && (
              <>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    // Reset to original values
                    setTitle(journal.title);
                    setDestination(journal.destination);
                    setTripDate(new Date(journal.tripDate).toISOString().split('T')[0]);
                    setNotes(journal.notes);
                    setImages(journal.images);
                    setIsPublic(journal.isPublic);
                  }}
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image Gallery */}
          <div className="relative">
            {images.length > 0 ? (
              <>
                <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
                  <img
                    src={images[currentImageIndex]}
                    alt={`Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={cn(
                          "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                          idx === currentImageIndex
                            ? 'border-rose-500 scale-105'
                            : 'border-slate-200 opacity-60 hover:opacity-100'
                        )}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {isEditing && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                No images
              </div>
            )}

            {/* Add more images in edit mode */}
            {isEditing && images.length < 10 && (
              <div className="mt-3">
                <label 
                  htmlFor="add-images" 
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {uploadingImages ? 'Uploading...' : 'Add More Images'}
                  </span>
                  <input
                    id="add-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            {isEditing ? (
              <>
                <Label htmlFor="edit-title">Trip Title</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                  maxLength={200}
                />
              </>
            ) : (
              <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            )}
          </div>

          {/* Destination & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {isEditing ? (
                <>
                  <Label htmlFor="edit-destination">Destination</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="edit-destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <span className="font-medium">{destination}</span>
                </div>
              )}
            </div>

            <div>
              {isEditing ? (
                <>
                  <Label htmlFor="edit-date">Trip Date</Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="edit-date"
                      type="date"
                      value={tripDate}
                      onChange={(e) => setTripDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <span className="font-medium">{formatDate(journal.tripDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Privacy Status */}
          <div>
            {isEditing ? (
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
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2" 
                   style={{ 
                     borderColor: isPublic ? '#2563eb' : '#475569',
                     backgroundColor: isPublic ? '#eff6ff' : '#f1f5f9'
                   }}>
                {isPublic ? (
                  <>
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Public Journal</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 text-slate-700" />
                    <span className="font-medium text-slate-900">Private Journal</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Notes</h3>
            {isEditing ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[200px] resize-y"
                maxLength={10000}
              />
            ) : (
              <p className="text-slate-700 whitespace-pre-wrap">{notes}</p>
            )}
          </div>

          {/* Metadata */}
          {!isEditing && (
            <div className="pt-4 border-t border-slate-200 text-sm text-slate-600">
              <p>Created on {formatDate(journal.createdAt)}</p>
              {journal.updatedAt && journal.updatedAt !== journal.createdAt && (
                <p>Last updated on {formatDate(journal.updatedAt)}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
