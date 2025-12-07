const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Only configure Google Strategy if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // Build callback URL - MUST be full URL in production
  let callbackURL;
  
  if (process.env.GOOGLE_CALLBACK_URL) {
    // Use explicitly set callback URL
    callbackURL = process.env.GOOGLE_CALLBACK_URL;
  } else if (process.env.NODE_ENV === 'production') {
    // In production, construct from SERVER_URL
    const serverUrl = process.env.SERVER_URL || process.env.CLIENT_URL;
    if (!serverUrl) {
      console.error('ERROR: SERVER_URL or CLIENT_URL must be set in production for Google OAuth callback!');
      callbackURL = '/api/auth/google/callback'; // Fallback, but will likely fail
    } else {
      // Ensure it's a full URL (add https:// if missing, remove trailing slash)
      const baseUrl = serverUrl.replace(/\/$/, '');
      callbackURL = `${baseUrl}/api/auth/google/callback`;
    }
  } else {
    // Development - use relative URL
    callbackURL = '/api/auth/google/callback';
  }

  console.log(`Google OAuth callback URL configured: ${callbackURL}`);

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let existingUser = await User.findOne({ googleId: profile.id });
    
    if (existingUser) {
      return done(null, existingUser);
    }
    
    // Create new user
    const newUser = new User({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      avatar: profile.photos[0].value
    });
    
    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    return done(error, null);
  }
  }));
} else {
  console.log('Google OAuth credentials not found. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
