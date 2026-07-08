import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { fallbackDB } from '../config/fallbackDb.js';

// @desc    Fetch all products with optional filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      const { search, category, skinType } = req.query;
      const products = fallbackDB.products.find({ search, category, skinType });
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const { search, category, skinType, fragrance } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (skinType) {
      query.skinType = { $regex: skinType, $options: 'i' };
    }

    if (fragrance) {
      query.fragrance = { $regex: fragrance, $options: 'i' };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      const product = fallbackDB.products.findById(req.params.id);
      if (product) {
        return res.json(product);
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    return res.status(501).json({ message: 'Create product is only supported in MongoDB mode' });
  }

  try {
    const {
      name,
      shortName,
      category,
      skinType,
      fragrance,
      weight,
      stock,
      price,
      oldPrice,
      badge,
      keywords,
      description,
      about,
      benefits,
      howToUse,
      customerNote,
      images,
    } = req.body;

    const product = new Product({
      name,
      shortName,
      category,
      skinType,
      fragrance,
      weight: weight || '100g',
      stock: stock || 10,
      price,
      oldPrice,
      badge,
      keywords: keywords || [],
      description,
      about,
      benefits: benefits || [],
      howToUse: howToUse || [],
      customerNote,
      images: images || [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    return res.status(501).json({ message: 'Update product is only supported in MongoDB mode' });
  }

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.shortName = req.body.shortName || product.shortName;
      product.category = req.body.category || product.category;
      product.skinType = req.body.skinType || product.skinType;
      product.fragrance = req.body.fragrance || product.fragrance;
      product.weight = req.body.weight || product.weight;
      product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
      product.price = req.body.price || product.price;
      product.oldPrice = req.body.oldPrice !== undefined ? req.body.oldPrice : product.oldPrice;
      product.badge = req.body.badge || product.badge;
      product.keywords = req.body.keywords || product.keywords;
      product.description = req.body.description || product.description;
      product.about = req.body.about || product.about;
      product.benefits = req.body.benefits || product.benefits;
      product.howToUse = req.body.howToUse || product.howToUse;
      product.customerNote = req.body.customerNote || product.customerNote;
      product.images = req.body.images || product.images;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    return res.status(501).json({ message: 'Delete product is only supported in MongoDB mode' });
  }

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
