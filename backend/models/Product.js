import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shortName: String,
  category: {
    type: String,
    required: true,
  },
  skinType: {
    type: String,
    required: true,
  },
  fragrance: String,
  weight: {
    type: String,
    default: '100g',
  },
  stock: {
    type: Number,
    default: 10,
  },
  price: {
    type: Number,
    required: true,
  },
  oldPrice: Number,
  rating: {
    type: Number,
    default: 4.5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  badge: String,
  keywords: [String],
  description: String,
  about: String,
  benefits: [String],
  howToUse: [String],
  customerNote: String,
  trust: {
    type: [String],
    default: ['🚚 Fast Delivery', '💳 UPI + COD', '🔒 Secure Order'],
  },
  images: [String],
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
export default Product;
