import express from 'express';
import Post from '../models/PostModel.js';
import User from '../models/UserModel.js';
import Itinerary from '../models/ItineraryModel.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all posts (community feed) with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const destination = req.query.destination;
    const tag = req.query.tag;
    const search = req.query.search;

    let query = {};

    // Filter by destination
    if (destination) {
      query.destination = new RegExp(destination, 'i');
    }

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Search in title, content, destination
    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasMore: skip + posts.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
});

// Get featured posts
router.get('/featured', async (req, res) => {
  try {
    const posts = await Post.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch featured posts' });
  }
});

// Get user's own posts
router.get('/my-posts', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch your posts' });
  }
});

// Get single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Increment view count
    post.viewCount += 1;
    await post.save();

    res.json({ success: true, post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch post' });
  }
});

// Create a new post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, destination, tags, images, itineraryId, tripId } = req.body;

    // Get user info
    const user = await User.findById(req.user.id).select('firstName lastName email profilePicture');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const post = new Post({
      userId: req.user.id,
      author: {
        name: `${user.firstName} ${user.lastName || ''}`.trim() || user.email,
        email: user.email,
        profilePicture: user.profilePicture
      },
      title,
      content,
      destination,
      tags: tags || [],
      images: images || [],
      itineraryId,
      tripId
    });

    await post.save();

    // Create notification for the user
    res.status(201).json({ 
      success: true, 
      post,
      message: 'Post created successfully!' 
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: 'Failed to create post' });
  }
});

// Update a post
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, destination, tags, images } = req.body;

    const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found or unauthorized' });
    }

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (destination !== undefined) post.destination = destination;
    if (tags !== undefined) post.tags = tags;
    if (images !== undefined) post.images = images;

    await post.save();

    res.json({ 
      success: true, 
      post,
      message: 'Post updated successfully!' 
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ success: false, message: 'Failed to update post' });
  }
});

// Delete a post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found or unauthorized' });
    }

    res.json({ 
      success: true, 
      message: 'Post deleted successfully!' 
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
});

// Like/Unlike a post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userIdStr = req.user.id.toString();
    const likeIndex = post.likes.findIndex(id => id.toString() === userIdStr);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
      await post.save();
      res.json({ 
        success: true, 
        liked: false, 
        likesCount: post.likes.length 
      });
    } else {
      // Like
      post.likes.push(req.user.id);
      await post.save();
      res.json({ 
        success: true, 
        liked: true, 
        likesCount: post.likes.length 
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle like' });
  }
});

// Add a comment to a post
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Get user info
    const user = await User.findById(req.user.id).select('firstName lastName profilePicture');

    const comment = {
      userId: req.user.id,
      userName: `${user.firstName} ${user.lastName || ''}`.trim() || 'User',
      userPhoto: user.profilePicture,
      content: content.trim()
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ 
      success: true, 
      comment: post.comments[post.comments.length - 1],
      message: 'Comment added successfully!' 
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
});

// Delete a comment
router.delete('/:postId/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check if user owns the comment or the post
    if (comment.userId.toString() !== req.user.id.toString() && 
        post.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    post.comments.pull(req.params.commentId);
    await post.save();

    res.json({ 
      success: true, 
      message: 'Comment deleted successfully!' 
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, message: 'Failed to delete comment' });
  }
});

export default router;
