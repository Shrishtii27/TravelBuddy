import express from 'express';
import pool from '../config/postgres.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all posts (community feed) with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const destination = req.query.destination;
    const tag = req.query.tag;
    const search = req.query.search;

    let queryText = 'SELECT p.*, u.first_name, u.last_name, u.profile_picture, u.email as author_email, ' +
                    '(SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count, ' +
                    '(SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count ' +
                    'FROM posts p JOIN users u ON p.user_id = u.id WHERE 1=1';
    let queryParams = [];

    if (destination) {
      queryParams.push(`%${destination}%`);
      queryText += ` AND p.destination ILIKE $${queryParams.length}`;
    }

    if (tag) {
      queryParams.push(tag);
      queryText += ` AND p.tags @> jsonb_build_array(CAST($${queryParams.length} AS text))`;
    }

    if (search) {
      queryParams.push(`%${search}%`);
      queryText += ` AND (p.title ILIKE $${queryParams.length} OR p.content ILIKE $${queryParams.length} OR p.destination ILIKE $${queryParams.length})`;
    }

    queryText += ` ORDER BY p.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const result = await pool.query(queryText, queryParams);
    const posts = result.rows.map(post => ({
      ...post,
      author: {
        name: `${post.first_name} ${post.last_name || ''}`.trim() || post.author_email,
        email: post.author_email,
        profilePicture: post.profile_picture
      },
      likesCount: parseInt(post.likes_count),
      commentsCount: parseInt(post.comments_count)
    }));

    const totalResult = await pool.query('SELECT COUNT(*) FROM posts');
    const total = parseInt(totalResult.rows[0].count);

    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasMore: offset + posts.length < total
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
    const result = await pool.query(
      'SELECT p.*, u.first_name, u.last_name, u.profile_picture, u.email as author_email FROM posts p JOIN users u ON p.user_id = u.id WHERE p.featured = true ORDER BY p.created_at DESC LIMIT 5'
    );
    
    const posts = result.rows.map(post => ({
      ...post,
      author: {
        name: `${post.first_name} ${post.last_name || ''}`.trim() || post.author_email,
        email: post.author_email,
        profilePicture: post.profile_picture
      }
    }));

    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch featured posts' });
  }
});

// Get user's own posts
router.get('/my-posts', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT p.*, u.first_name, u.last_name, u.profile_picture, u.email as author_email FROM posts p JOIN users u ON p.user_id = u.id WHERE p.user_id = $1 ORDER BY p.created_at DESC',
      [req.user.id]
    );

    const posts = result.rows.map(post => ({
      ...post,
      author: {
        name: `${post.first_name} ${post.last_name || ''}`.trim() || post.author_email,
        email: post.author_email,
        profilePicture: post.profile_picture
      }
    }));

    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch your posts' });
  }
});

// Get single post by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT p.*, u.first_name, u.last_name, u.profile_picture, u.email as author_email FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = $1',
      [req.params.id]
    );

    const post = result.rows[0];
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Increment view count
    await pool.query('UPDATE posts SET view_count = view_count + 1 WHERE id = $1', [post.id]);

    // Fetch comments
    const commentsResult = await pool.query(
      'SELECT c.*, u.first_name, u.last_name, u.profile_picture FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at ASC',
      [post.id]
    );

    res.json({ 
      success: true, 
      post: {
        ...post,
        author: {
          name: `${post.first_name} ${post.last_name || ''}`.trim() || post.author_email,
          email: post.author_email,
          profilePicture: post.profile_picture
        },
        comments: commentsResult.rows.map(c => ({
          id: c.id,
          userId: c.user_id,
          userName: `${c.first_name} ${c.last_name || ''}`.trim(),
          userPhoto: c.profile_picture,
          content: c.content,
          createdAt: c.created_at
        }))
      } 
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch post' });
  }
});

// Create a new post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, destination, tags, images, itineraryId, tripId } = req.body;

    const result = await pool.query(
      'INSERT INTO posts (user_id, title, content, destination, tags, images, itinerary_id, trip_id) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [req.user.id, title, content, destination, JSON.stringify(tags || []), JSON.stringify(images || []), itineraryId || null, tripId || null]
    );

    res.status(201).json({ 
      success: true, 
      post: result.rows[0],
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

    const result = await pool.query(
      'UPDATE posts SET title = COALESCE($1, title), content = COALESCE($2, content), ' +
      'destination = COALESCE($3, destination), tags = COALESCE($4, tags), images = COALESCE($5, images), ' +
      'updated_at = CURRENT_TIMESTAMP WHERE id = $6 AND user_id = $7 RETURNING *',
      [title, content, destination, tags ? JSON.stringify(tags) : null, images ? JSON.stringify(images) : null, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found or unauthorized' });
    }

    res.json({ 
      success: true, 
      post: result.rows[0],
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
    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found or unauthorized' });
    }

    res.json({ success: true, message: 'Post deleted successfully!' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
});

// Like/Unlike a post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const checkResult = await pool.query(
      'SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (checkResult.rows.length > 0) {
      // Unlike
      await pool.query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [req.params.id, req.user.id]);
      const countResult = await pool.query('SELECT COUNT(*) FROM post_likes WHERE post_id = $1', [req.params.id]);
      res.json({ success: true, liked: false, likesCount: parseInt(countResult.rows[0].count) });
    } else {
      // Like
      await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)', [req.params.id, req.user.id]);
      const countResult = await pool.query('SELECT COUNT(*) FROM post_likes WHERE post_id = $1', [req.params.id]);
      res.json({ success: true, liked: true, likesCount: parseInt(countResult.rows[0].count) });
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

    const result = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [req.params.id, req.user.id, content.trim()]
    );

    const userResult = await pool.query('SELECT first_name, last_name, profile_picture FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    res.status(201).json({ 
      success: true, 
      comment: {
        ...result.rows[0],
        userName: `${user.first_name} ${user.last_name || ''}`.trim(),
        userPhoto: user.profile_picture
      },
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
    const result = await pool.query(
      'DELETE FROM comments WHERE id = $1 AND (user_id = $2 OR post_id IN (SELECT id FROM posts WHERE user_id = $2)) RETURNING id',
      [req.params.commentId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Comment not found or unauthorized' });
    }

    res.json({ success: true, message: 'Comment deleted successfully!' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, message: 'Failed to delete comment' });
  }
});

export default router;
