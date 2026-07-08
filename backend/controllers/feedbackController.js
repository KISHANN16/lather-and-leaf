import Feedback from '../models/Feedback.js';
import mongoose from 'mongoose';
import { fallbackDB } from '../config/fallbackDb.js';

// @desc    Submit feedback/review
// @route   POST /api/feedback
// @access  Public
const submitFeedback = async (req, res) => {
  const { name, email, rating, feedback, category } = req.body;

  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      const createdFeedback = fallbackDB.feedbacks.create({
        name,
        email,
        rating,
        feedback,
        category,
      });
      return res.status(201).json(createdFeedback);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const feedbackDoc = new Feedback({
      user: req.user ? req.user._id : undefined, // Logged in user or anonymous
      name: name || 'Anonymous',
      email: email || 'anonymous@vegansoap.com',
      rating: Number(rating) || 5,
      feedback,
      category: category || 'General Review',
    });

    const createdFeedback = await feedbackDoc.save();
    res.status(201).json(createdFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all feedback reviews
// @route   GET /api/feedback
// @access  Public
const getFeedback = async (req, res) => {
  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      const feedbackList = fallbackDB.feedbacks.find();
      return res.json(feedbackList);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const feedbackList = await Feedback.find({}).sort({ createdAt: -1 });
    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete single feedback review
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
const deleteFeedback = async (req, res) => {
  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      fallbackDB.feedbacks.deleteOne(req.params.id);
      return res.json({ message: 'Feedback review removed' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const feedback = await Feedback.findById(req.params.id);

    if (feedback) {
      await Feedback.deleteOne({ _id: req.params.id });
      res.json({ message: 'Feedback review removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear all feedback reviews
// @route   DELETE /api/feedback
// @access  Private/Admin
const clearAllFeedback = async (req, res) => {
  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      fallbackDB.feedbacks.clearAll();
      return res.json({ message: 'All feedback reviews cleared' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    await Feedback.deleteMany({});
    res.json({ message: 'All feedback reviews cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  submitFeedback,
  getFeedback,
  deleteFeedback,
  clearAllFeedback,
};
