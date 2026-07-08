import express from 'express';
import {
  submitFeedback,
  getFeedback,
  deleteFeedback,
  clearAllFeedback,
} from '../controllers/feedbackController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(submitFeedback)
  .get(getFeedback)
  .delete(protect, admin, clearAllFeedback);

router.route('/:id').delete(protect, admin, deleteFeedback);

export default router;
