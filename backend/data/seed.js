import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Feedback from '../models/Feedback.js';

dotenv.config();

const seedProducts = [
  {
    name: 'Neem Acne Loofah Soap',
    shortName: 'Neem Soap',
    category: 'Face Care',
    skinType: 'Oily / Acne Prone Skin',
    fragrance: 'Neem Fresh',
    weight: '100g',
    stock: 12,
    price: 299,
    oldPrice: 399,
    rating: 4.6,
    reviews: 456,
    badge: 'BESTSELLER • ACNE CARE',
    keywords: ['neem', 'acne', 'face', 'soap', 'fresh', 'oil-control'],
    description: 'A refreshing neem-based loofah soap made for gentle exfoliation and deep daily cleansing.',
    about: 'Formulated with organic neem leaf extract and cold-pressed neem oil, this soap is embedded with natural loofah fibers that help exfoliate dead cells while fighting acne-causing bacteria. Perfect for restoring a clear, healthy skin barrier.',
    benefits: [
      'Gentle natural exfoliation with real loofah',
      'Helps dry up active acne and control excess sebum',
      'Purifies skin without stripping natural moisture',
      'Refreshing herbal aroma'
    ],
    howToUse: [
      'Wet the soap and your skin with lukewarm water.',
      'Gently rub the loofah soap in circular motions over your face, avoiding the eye area.',
      'Allow the lather to sit on the skin for 30 seconds to let the herbal properties absorb.',
      'Rinse thoroughly and pat dry. Use twice daily.'
    ],
    customerNote: 'Best for acne care and oily skin users.',
    images: ['/assets/neem-soap.png'],
  },
  {
    name: 'Rose Milk Loofah Soap',
    shortName: 'Rose Milk Soap',
    category: 'Body Care',
    skinType: 'Dry / Sensitive Skin',
    fragrance: 'Rose Floral',
    weight: '100g',
    stock: 8,
    price: 329,
    oldPrice: 449,
    rating: 4.7,
    reviews: 322,
    badge: 'PREMIUM • DEEP HYDRATION',
    keywords: ['rose', 'milk', 'soap', 'body', 'dry', 'moisturizing', 'floral'],
    description: 'A rich, moisturizing rose milk loofah soap that nourishes and softens dry skin.',
    about: 'Indulge in a luxurious bathing experience. Infused with pure rose absolute, creamy coconut milk, and skin-softening vitamin E, this soap combines luxurious lather with a gentle loofah texture to leave your skin feeling velvety smooth and hydrated.',
    benefits: [
      'Deep hydration from plant-based milk fats',
      'Mild exfoliation restores natural glow to dull skin',
      'Rich floral scent relieves stress and tension',
      'Rich in vitamins A, C, and E'
    ],
    howToUse: [
      'Wet your body in the shower.',
      'Lather the soap in your hands or rub the loofah side directly on dry patches like elbows and knees.',
      'Massage gently to boost local blood circulation.',
      'Rinse with warm water and lock in hydration with a body lotion.'
    ],
    customerNote: 'Best for soft skin enthusiasts.',
    images: ['/assets/rose-milk-soap.png'],
  },
  {
    name: 'Mint Foot Loofah Soap',
    shortName: 'Mint Foot Soap',
    category: 'Foot Care',
    skinType: 'All Skin Types',
    fragrance: 'Mint Cool',
    weight: '100g',
    stock: 15,
    price: 249,
    oldPrice: 349,
    rating: 4.5,
    reviews: 210,
    badge: 'FOOT CARE • EXTREME FRESH',
    keywords: ['mint', 'cool', 'foot', 'soap', 'fresh', 'peppermint', 'rough skin'],
    description: 'A cooling peppermint loofah soap designed to smooth rough heels and refresh tired feet.',
    about: 'Your search for the perfect pedicure bar ends here. With a concentrated blend of peppermint oil, tea tree oil, and a dense natural loofah core, this foot care soap sloughs off hard calluses and neutralizes odors, leaving feet cool and tingling.',
    benefits: [
      'Intense exfoliation targets rough heels and calluses',
      'Antiseptic tea tree oil prevents fungal irritation',
      'Menthol active cooling effect relieves foot fatigue',
      'Eliminates foot odor completely'
    ],
    howToUse: [
      'Soak your feet in warm water for 5 minutes to soften calluses.',
      'Wet the Mint Foot Loofah Soap.',
      'Use firm, circular pressure with the loofah side on the soles, heels, and edges of feet.',
      'Rinse thoroughly and pat dry. For best results, use daily.'
    ],
    customerNote: 'Ideal for soothing tired feet after long days.',
    images: ['/assets/mint-foot-soap.png'],
  },
  {
    name: 'Sandal Calm Soap',
    shortName: 'Sandal Soap',
    category: 'Body Care',
    skinType: 'Sensitive Skin',
    fragrance: 'Sandalwood Warm',
    weight: '100g',
    stock: 20,
    price: 249,
    oldPrice: 299,
    rating: 4.8,
    reviews: 180,
    badge: 'AYURVEDIC • CALMING',
    keywords: ['sandalwood', 'calm', 'sensitive', 'ayurvedic', 'turmeric', 'warm'],
    description: 'Traditional soothing sandalwood soap with a calm, warm, skin-healing feel.',
    about: 'Bringing the ancient Indian rituals to your bathroom. Formulated with authentic red sandalwood paste and almond oil, this mild exfoliating soap calms redness, reduces tanning, and wraps you in a warm, meditative woody fragrance.',
    benefits: [
      'Reduces skin tan and evens out tone',
      'Anti-inflammatory properties calm itchy or irritated skin',
      'Rich woody aromatherapy relaxes the nervous system',
      'Extremely mild and safe for highly sensitive skin'
    ],
    howToUse: [
      'Wet skin and rub the soap bar to create a rich creamy lather.',
      'Apply lather all over body and face, massaging gently.',
      'Leave on for 1 minute for cooling, soothing action.',
      'Wash off with cool or lukewarm water.'
    ],
    customerNote: 'Excellent for standard body care and tan removal.',
    images: ['/assets/sandal-calm-soap.png'],
  },
  {
    name: 'Turmeric Care Soap',
    shortName: 'Turmeric Soap',
    category: 'Face Care',
    skinType: 'Normal / Dull Skin',
    fragrance: 'Turmeric Herbal',
    weight: '100g',
    stock: 14,
    price: 219,
    oldPrice: 279,
    rating: 4.4,
    reviews: 145,
    badge: 'GLOW RECIPE • TONING',
    keywords: ['turmeric', 'haldi', 'glow', 'brightening', 'toning', 'herbaceous'],
    description: 'An antioxidant-rich turmeric soap that brightens dull skin and balances tone.',
    about: 'Packed with pure turmeric root extract, saffron threads, and citrus peel extracts, this soap works to naturally brighten complexion, target hyperpigmentation, and add a luminous glow to your daily facial routine.',
    benefits: [
      'Powerful turmeric antioxidants brighten dull complexions',
      'Reduces dark spots, blemishes, and scars',
      'Provides a natural skin glow without chemical brighteners',
      'Aromatic blend refreshes the senses'
    ],
    howToUse: [
      'Moisten face with warm water.',
      'Create lather using the soap and apply using fingertips in upward strokes.',
      'Focus on pigmented zones around nose and chin.',
      'Rinse off and apply toner immediately.'
    ],
    customerNote: 'Ideal for restoring brightness to tired, sun-exposed skin.',
    images: ['/assets/turmeric-care-soap.png'],
  }
];

const seedData = async () => {
  try {
    const success = await connectDB();
    if (!success) {
      console.log('Skipping database seed because MongoDB is not connected.');
      process.exit(0);
    }

    // Clear old data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Feedback.deleteMany();

    console.log('Old records cleared.');

    // Seed default admin user
    const adminEmail = 'rekhavishwakarma400212@gmail.com';
    const adminPassword = 'adminpassword123'; // Securely hashed pre-save hook
    await User.create({
      name: 'Admin User',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      address: {
        fullName: 'Admin User',
        address1: 'Vegan Soap HQ',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '9876543210',
      }
    });

    console.log('Admin user seeded successfully!');

    // Seed default products
    await Product.insertMany(seedProducts);
    console.log('Soap products seeded successfully!');

    // Seed a couple of mock feedbacks
    await Feedback.create([
      {
        name: 'Aarav Sharma',
        email: 'aarav@gmail.com',
        rating: 5,
        feedback: 'Neem Acne soap is amazing! It completely dried out my forehead pimples in less than a week. The loofah is great for scrubbing away blackheads.',
        category: 'Product Feedback',
      },
      {
        name: 'Priya Patel',
        email: 'priya@gmail.com',
        rating: 4,
        feedback: 'The Rose Milk soap smells divine. It does not leave my skin dry like other soap bars. Highly recommend it to dry skin users!',
        category: 'General Review',
      }
    ]);
    console.log('Mock feedbacks seeded successfully!');

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
