const Product = require('../model/Product');
const streamUpload = require('../utils/profilePic');
const createProduct = async (req, res) => {
    const { name,tagline, description, category, websiteUrl, logo} = req.body;
    const file = req.file;
    if (!name || !tagline || !description|| !category || !websiteUrl || !logo) {
         return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const defaultPicture = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fdefault-avatar&psig=AOvVaw27ryX9kSh16ta_SyLqJKel&ust=1748629004319000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCIDqn-mkyY0DFQAAAAAdAAAAABAL'; 
        let logoUrl = defaultPicture;
        if (file) {
            logoUrl = await streamUpload(file.buffer, 'product-logos');
        }
        const product = await  Product.create({
            name,
            tagline,
            description,
            category,
            websiteUrl,
            submittedBy: req.user.userId,
            logo: logoUrl,
        });
        console.log(product);
        console.log(req.user.userId);
        res.status(201).json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('submittedBy', 'name profilePicture').lean();
        if (!products) {
            return res.status(404).json({ error: 'No products found' });
        }
        const productsWithVotes = products.map(product => ({
            ...product,
            upvoteCount: product.upvotes.length,
        }));
        res.status(200).json({ products: productsWithVotes });
    } catch (error) {
        
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get Single Product
const getSingleProduct = async (req, res) => {
    const { id: productId } = req.params;
    try {
        const product = await Product.findById(productId).populate('submittedBy', 'name profilePicture').lean();
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        product.upvoteCount = product.upvotes.length;
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Upvote a product
const upVote = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const userId = req.user.userId;
        if (product.upvotes.includes(userId)) {
            return res.status(400).json({ error: 'You have already upvoted this product' });
        }
        else {
            product.upvotes.push(userId)
         }
        await product.save();
        res.status(200).json({ message: 'Product upvoted successfully', upvoteCount: product.upvotes.length });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
// Downvote a product
const downVote = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const userId = req.user.userId;
        if (!product.upvotes.includes(userId)) {
            return res.status(400).json({ error: 'You have not upvoted this product' });
        }
        product.upvotes = product.upvotes.filter(id => id.toString() !== userId);
        await product.save();
        res.status(200).json({ message: 'Product downvoted successfully', upvoteCount: product.upvotes.length });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
//  Edit Product
const editProduct = async (req, res) => {
  const { name, tagline, description, category, websiteUrl, logo } = req.body;
  const userId = req.user.userId;
  const role = req.user.role;

  try {
    const productId = req.params.id; 
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.submittedBy.toString() !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to edit this product' });
    }

    if (name) product.name = name;
    if (tagline) product.tagline = tagline;
    if (description) product.description = description;
    if (category) product.category = category;
    if (websiteUrl) product.websiteUrl = websiteUrl;
    if (logo) product.logo = logo;

    await product.save();

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Edit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Delete a product With corresponding user
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (product.submittedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  upVote,
  downVote,
  deleteProduct,
  editProduct
};
