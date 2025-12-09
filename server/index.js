const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// Import passport configuration
require('./config/passport');

const app = express();

// Middleware
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? (process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [])
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Trust proxy for Railway/Heroku/etc (required for cookies to work behind proxy)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Session configuration
const clientUrl = process.env.CLIENT_URL || '';
const serverUrl = process.env.SERVER_URL || process.env.CLIENT_URL || '';
const isCrossDomain = process.env.NODE_ENV === 'production' && 
  clientUrl && serverUrl && 
  new URL(clientUrl).hostname !== new URL(serverUrl).hostname;

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isCrossDomain ? 'none' : 'lax',
    path: '/'
  }
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Log all requests - moved before routes for better debugging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api/deface', require('./routes/defacer'));
// Removed static uploads route - files are now served from Cloudinary

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
      // Catch-all for React routes - but skip API routes
      app.get('*', (req, res, next) => {
        // Skip API routes
        if (req.path.startsWith('/api/')) {
          return next(); // Let Express handle 404 for unmatched API routes
        }
        // Only serve React app for non-API routes
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
      });
}

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
