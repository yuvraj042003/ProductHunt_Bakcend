const Comment = require('../model/Comment');
const Product = require('../model/Product');
// 1 Create a comment
const createComment = async (req, res) => {
    const { content, productId } = req.body;

    if (!content || !productId) {
        return res.status(400).json({ error: 'Content and product ID are required' });
    }
    const userId = req.user.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const comment = await Comment.create({
            content,
            product: productId,
            user: req.user.userId,
            parentComment: null
        });
        res.status(201).json({ comment });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
// 2. Re[ly to a comment
const replyToComment = async (req, res) => {
  const { content, productId, parentCommentId } = req.body;
  const userId = req.user.userId;

  if (!content || !productId || !parentCommentId) {
    return res.status(400).json({ error: 'Content, Product ID, and Parent Comment ID are required' });
  }

  try {
    const parent = await Comment.findById(parentCommentId);
    if (!parent) {
      return res.status(404).json({ error: 'Parent comment not found' });
    }

    const reply = await Comment.create({
      content,
      product: productId,
      user: userId,
      parentComment: parentCommentId
    });

    res.status(201).json({ message: 'Reply created', reply });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
// 3. Get all comments for a product
const getComments = async (req, res) => {
  const { productId } = req.params;

  try {
    const comments = await Comment.find({ product: productId })
      .populate('user', 'name email')
      .sort({ createdAt: 1 })
      .lean();

    const grouped = comments.reduce((acc, comment) => {
      if (comment.parentComment) {
        const parent = acc.find(c => c._id.toString() === comment.parentComment.toString());
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(comment);
        }
      } else {
        acc.push({ ...comment, replies: [] });
      }
      return acc;
    }, []);

    res.status(200).json({ comments: grouped });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
// 4. Edit a comment
const editComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: 'You can only edit your own comment' });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({ message: 'Comment updated', comment });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
// 5. Delete a comment
const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId;
  const role = req.user.role;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user.toString() !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'You are not allowed to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);

    await Comment.deleteMany({ parentComment: commentId });

    return res.status(200).json({ message: 'Comment and any replies deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
module.exports = {
    createComment,
    replyToComment,
    getComments,
    editComment,
    deleteComment
};