import React, { useState } from 'react';
import { Heart, MessageCircle, Eye, MapPin, Calendar, MoreVertical, Trash2, Edit, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function PostCard({ post, onLike, onComment, onDelete, currentUserId }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localPost, setLocalPost] = useState(post);
  const [showMenu, setShowMenu] = useState(false);

  const isLiked = localPost.likes?.includes(currentUserId);
  const isOwner = localPost.userId === currentUserId;

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('travys_token');
      const response = await fetch(`${API_URL}/api/posts/${localPost._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLocalPost(prev => ({
          ...prev,
          likes: data.liked 
            ? [...(prev.likes || []), currentUserId]
            : (prev.likes || []).filter(id => id !== currentUserId)
        }));
        if (onLike) onLike(localPost._id, data.liked);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('travys_token');
      const response = await fetch(`${API_URL}/api/posts/${localPost._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText })
      });

      if (response.ok) {
        const data = await response.json();
        setLocalPost(prev => ({
          ...prev,
          comments: [...(prev.comments || []), data.comment]
        }));
        setCommentText('');
        toast.success('Comment added!');
        if (onComment) onComment(localPost._id, data.comment);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('travys_token');
      const response = await fetch(`${API_URL}/api/posts/${localPost._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Post deleted!');
        if (onDelete) onDelete(localPost._id);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {localPost.author?.profilePicture ? (
            <img
              src={localPost.author.profilePicture}
              alt={localPost.author.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {localPost.author?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-slate-900">{localPost.author?.name || 'Anonymous'}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{formatDate(localPost.createdAt)}</span>
              {localPost.destination && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {localPost.destination}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-slate-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <div className="px-4 pb-3">
        <h3 className="text-lg font-bold text-slate-900 mb-2">{localPost.title}</h3>
        <p className="text-slate-700 whitespace-pre-wrap">{localPost.content}</p>
      </div>

      {/* Tags */}
      {localPost.tags && localPost.tags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {localPost.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Images */}
      {localPost.images && localPost.images.length > 0 && (
        <div className={cn(
          "grid gap-1 px-4 pb-3",
          localPost.images.length === 1 && "grid-cols-1",
          localPost.images.length === 2 && "grid-cols-2",
          localPost.images.length >= 3 && "grid-cols-3"
        )}>
          {localPost.images.slice(0, 6).map((img, idx) => (
            <div key={idx} className="relative aspect-square overflow-hidden rounded-lg">
              <img
                src={img.url}
                alt={img.caption || `Image ${idx + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
              />
              {idx === 5 && localPost.images.length > 6 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">+{localPost.images.length - 6}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600">
        <div className="flex items-center gap-4">
          <span>{localPost.likes?.length || 0} likes</span>
          <span>{localPost.comments?.length || 0} comments</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{localPost.viewCount || 0}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            "flex-1",
            isLiked && "text-red-600 hover:text-red-700"
          )}
        >
          <Heart className={cn("h-4 w-4 mr-2", isLiked && "fill-current")} />
          {isLiked ? 'Liked' : 'Like'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex-1"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Comment
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied!');
          }}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-slate-100">
          {/* Comment Form */}
          <form onSubmit={handleComment} className="mt-3 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !commentText.trim()}
            >
              Post
            </Button>
          </form>

          {/* Comments List */}
          {localPost.comments && localPost.comments.length > 0 && (
            <div className="mt-3 space-y-3">
              {localPost.comments.map((comment) => (
                <div key={comment._id} className="flex gap-2">
                  {comment.userPhoto ? (
                    <img
                      src={comment.userPhoto}
                      alt={comment.userName}
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">
                        {comment.userName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="bg-slate-50 rounded-lg px-3 py-2">
                      <p className="font-semibold text-sm text-slate-900">{comment.userName}</p>
                      <p className="text-sm text-slate-700 mt-0.5">{comment.content}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 ml-3">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
