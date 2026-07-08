import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve('data/db.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// Seed data template
const initialProducts = [
  {
    _id: "p1",
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
    _id: "p2",
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
    _id: "p3",
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
    _id: "p4",
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
    _id: "p5",
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

const readData = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      // Seed default file-db
      const adminEmail = 'rekhavishwakarma400212@gmail.com';
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync('adminpassword123', salt);
      const initialUsers = [
        {
          _id: "u_admin",
          name: 'Admin User',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
          address: {
            fullName: 'Admin User',
            address1: 'Vegan Soap HQ',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            phone: '9876543210',
          },
          createdAt: new Date().toISOString()
        }
      ];

      const initialFeedbacks = [
        {
          _id: "f1",
          name: 'Aarav Sharma',
          email: 'aarav@gmail.com',
          rating: 5,
          feedback: 'Neem Acne soap is amazing! It completely dried out my forehead pimples in less than a week. The loofah is great for scrubbing away blackheads.',
          category: 'Product Feedback',
          createdAt: new Date().toISOString()
        },
        {
          _id: "f2",
          name: 'Priya Patel',
          email: 'priya@gmail.com',
          rating: 4,
          feedback: 'The Rose Milk soap smells divine. It does not leave my skin dry like other soap bars. Highly recommend it to dry skin users!',
          category: 'General Review',
          createdAt: new Date().toISOString()
        }
      ];

      const seedData = {
        users: initialUsers,
        products: initialProducts,
        orders: [],
        feedbacks: initialFeedbacks,
      };

      fs.writeFileSync(dbPath, JSON.stringify(seedData, null, 2));
      return seedData;
    }

    const content = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading file DB:', err);
    return { users: [], products: [], orders: [], feedbacks: [] };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing file DB:', err);
  }
};

// Fallback services
export const fallbackDB = {
  users: {
    find: () => {
      const data = readData();
      return data.users;
    },
    findOne: (query) => {
      const data = readData();
      return data.users.find(u => {
        if (query.email) return u.email.toLowerCase() === query.email.toLowerCase();
        if (query._id) return u._id === query._id;
        return false;
      });
    },
    findById: (id) => {
      const data = readData();
      return data.users.find(u => u._id === id);
    },
    create: (user) => {
      const data = readData();
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(user.password, salt);
      const newUser = {
        _id: 'u_' + Math.random().toString(36).substr(2, 9),
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role || 'user',
        address: user.address || {},
        createdAt: new Date().toISOString(),
      };
      data.users.push(newUser);
      writeData(data);
      return newUser;
    },
    update: (id, updates) => {
      const data = readData();
      const idx = data.users.findIndex(u => u._id === id);
      if (idx > -1) {
        if (updates.name) data.users[idx].name = updates.name;
        if (updates.password) {
          const salt = bcrypt.genSaltSync(10);
          data.users[idx].password = bcrypt.hashSync(updates.password, salt);
        }
        if (updates.address) {
          data.users[idx].address = {
            ...data.users[idx].address,
            ...updates.address
          };
        }
        if (updates.resetPasswordCode !== undefined) {
          data.users[idx].resetPasswordCode = updates.resetPasswordCode;
        }
        if (updates.resetPasswordExpire !== undefined) {
          data.users[idx].resetPasswordExpire = updates.resetPasswordExpire;
        }
        writeData(data);
        return data.users[idx];
      }
      return null;
    }
  },

  products: {
    find: (filter = {}) => {
      const data = readData();
      let res = data.products;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        res = res.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) || 
          (p.keywords || []).some(k => k.toLowerCase().includes(q))
        );
      }
      if (filter.category) {
        res = res.filter(p => p.category === filter.category);
      }
      if (filter.skinType) {
        res = res.filter(p => p.skinType.toLowerCase().includes(filter.skinType.toLowerCase()));
      }
      return res;
    },
    findById: (id) => {
      const data = readData();
      return data.products.find(p => p._id === id);
    },
    updateStock: (id, qtyChange) => {
      const data = readData();
      const idx = data.products.findIndex(p => p._id === id);
      if (idx > -1) {
        data.products[idx].stock = Math.max(0, data.products[idx].stock - qtyChange);
        writeData(data);
        return data.products[idx];
      }
    }
  },

  orders: {
    find: (query = {}) => {
      const data = readData();
      let res = data.orders;
      
      // Populate user field
      res = res.map(order => ({
        ...order,
        user: data.users.find(u => u._id === order.user) || { name: 'Guest', email: 'guest@vegansoap.com' }
      }));

      if (query.user) {
        res = res.filter(o => o.user._id === query.user);
      }
      return res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    findById: (id) => {
      const data = readData();
      const order = data.orders.find(o => o._id === id);
      if (order) {
        return {
          ...order,
          user: data.users.find(u => u._id === order.user) || { name: 'Guest', email: 'guest@vegansoap.com' }
        };
      }
      return null;
    },
    create: (order) => {
      const data = readData();
      const newOrder = {
        _id: 'o_' + Math.random().toString(36).substr(2, 9),
        user: order.user,
        orderItems: order.orderItems,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        itemsPrice: order.itemsPrice,
        deliveryPrice: order.deliveryPrice,
        totalPrice: order.totalPrice,
        orderId: order.orderId,
        isPaid: order.isPaid,
        orderStatus: 'Processing',
        createdAt: new Date().toISOString(),
      };
      
      data.orders.push(newOrder);
      writeData(data);
      return newOrder;
    },
    updateStatus: (id, status) => {
      const data = readData();
      const idx = data.orders.findIndex(o => o._id === id);
      if (idx > -1) {
        data.orders[idx].orderStatus = status;
        if (status === 'Delivered') {
          data.orders[idx].isPaid = true;
        }
        writeData(data);
        return data.orders[idx];
      }
      return null;
    },
    clearAll: () => {
      const data = readData();
      data.orders = [];
      writeData(data);
      return true;
    }
  },

  feedbacks: {
    find: () => {
      const data = readData();
      return data.feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    create: (fb) => {
      const data = readData();
      const newFb = {
        _id: 'f_' + Math.random().toString(36).substr(2, 9),
        name: fb.name || 'Anonymous',
        email: fb.email || 'anonymous@vegansoap.com',
        rating: fb.rating || 5,
        feedback: fb.feedback,
        category: fb.category || 'General Review',
        createdAt: new Date().toISOString(),
      };
      data.feedbacks.push(newFb);
      writeData(data);
      return newFb;
    },
    deleteOne: (id) => {
      const data = readData();
      data.feedbacks = data.feedbacks.filter(f => f._id !== id);
      writeData(data);
      return true;
    },
    clearAll: () => {
      const data = readData();
      data.feedbacks = [];
      writeData(data);
      return true;
    }
  }
};
