import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  feedback: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Product Feedback', 'Customer Support', 'General Review'],
    default: 'General Review',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }
}, {
  timestamps: true,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
