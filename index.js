require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const path = require('path');

// Routers
const UserRouter = require('./router/UserRouter');
const ProductRouter = require('./router/productRoute');
const CommentRouter = require('./router/commentsRouter');

// DB Connection
const connectDB = require('./db/connct');

const app = express();

// ====== Security Middleware ======
app.use(express.json());
app.use(helmet());


// ====== CORS Configuration ======
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:4173', 'https://product-hunt-coral.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
};
app.use(cors(corsOptions));
 

// ====== Routes ======
app.use('/api/v1/user', UserRouter);
app.use('/api/v1/product', ProductRouter);
app.use('/api/v1/comment', CommentRouter);

// ====== Default Route ======
app.get('/', (req, res) => {
  res.send("✅ ProductHunt Backend API is running!");
});
// ====== Start Server ======
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

start();
