import React from 'react';
import { MapPin, Calendar, Lock, Globe, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export default function JournalCard({ journal, onView, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateNotes = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        {journal.images && journal.images.length > 0 ? (
          <img
            src={journal.images[0]}
            alt={journal.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No Image
          </div>
        )}
        
        {/* Privacy Badge */}
        <div className="absolute top-3 right-3">
          {journal.isPublic ? (
            <span className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full shadow-lg">
              <Globe className="h-3 w-3" />
              Public
            </span>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-full shadow-lg">
              <Lock className="h-3 w-3" />
              Private
            </span>
          )}
        </div>

        {/* Image Count Badge */}
        {journal.images && journal.images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
            +{journal.images.length - 1} more
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
          {journal.title}
        </h3>

        {/* Destination & Date */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{journal.destination}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(journal.tripDate)}</span>
          </div>
        </div>

        {/* Notes Preview */}
        <p className="text-slate-700 text-sm mb-4 line-clamp-3">
          {truncateNotes(journal.notes)}
        </p>

        {/* Created Date */}
        <p className="text-xs text-slate-500 mb-4">
          Created on {formatDate(journal.createdAt)}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => onView(journal)}
            className="flex-1"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button
            onClick={() => onEdit(journal)}
            variant="outline"
            size="sm"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onDelete(journal._id)}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
