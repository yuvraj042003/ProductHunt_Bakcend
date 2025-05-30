const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  tagline: {
    type: String,
    required: false,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+\..+/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    },
  },
  logo: {
    type: String, 
    required: false,
  },
  category: {
    type: String,
    required: true,
    enum: ['AI', 'SaaS', 'Devtools', 'coding', 'DevOps', 'System Design', 'Machine Learning', 'BlockChain',  'Other'], 
  },
  upvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);
