import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, TrendingUp, Globe, MapPin, Hash, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    // Get current user
    const userStr = localStorage.getItem('travys_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    fetchPosts();
  }, []);

  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(`${API_URL}/api/posts?page=${pageNum}&limit=10`);

      if (response.ok) {
        const data = await response.json();
        if (append) {
          setPosts(prev => [...prev, ...data.posts]);
        } else {
          setPosts(data.posts);
        }
        setHasMore(data.pagination.hasMore);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    fetchPosts(page + 1, true);
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.destination?.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'my-posts') {
      return matchesSearch && post.userId === currentUser?.id;
    }

    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Globe className="h-8 w-8 text-rose-500" />
              Travel Community
            </h1>
            <p className="text-slate-600 mt-1">Share your adventures and inspire fellow travelers</p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            Share Your Story
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts, destinations, or experiences..."
                className="pl-10"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('all')}
                size="sm"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                All Posts
              </Button>
              {currentUser && (
                <Button
                  variant={selectedFilter === 'my-posts' ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter('my-posts')}
                  size="sm"
                >
                  My Posts
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Stories</p>
              <p className="text-3xl font-bold mt-1">{posts.length}</p>
            </div>
            <Globe className="h-12 w-12 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Destinations</p>
              <p className="text-3xl font-bold mt-1">
                {new Set(posts.map(p => p.destination).filter(Boolean)).size}
              </p>
            </div>
            <MapPin className="h-12 w-12 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium">Total Engagement</p>
              <p className="text-3xl font-bold mt-1">
                {posts.reduce((sum, p) => sum + (p.likes?.length || 0) + (p.comments?.length || 0), 0)}
              </p>
            </div>
            <TrendingUp className="h-12 w-12 opacity-20" />
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-rose-500 animate-spin mb-4" />
          <p className="text-slate-600">Loading amazing travel stories...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Globe className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {searchQuery ? 'No posts found' : 'No stories yet'}
          </h3>
          <p className="text-slate-600 mb-6">
            {searchQuery 
              ? 'Try adjusting your search or filters'
              : 'Be the first to share your travel experience!'
            }
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Share Your Story
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUser?.id}
              onDelete={handlePostDeleted}
            />
          ))}

          {/* Load More Button */}
          {hasMore && !searchQuery && selectedFilter === 'all' && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Stories'
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
