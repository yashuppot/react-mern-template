# MERN Authentication Boilerplate

A complete MERN stack authentication boilerplate with Google OAuth integration, Redux state management, and protected routes.

## Features

- 🔐 Google OAuth Authentication with Passport.js
- 🗄️ MongoDB with Mongoose for user data
- ⚛️ React with Redux Toolkit for state management
- 🛡️ Protected routes and session management
- 🎨 Modern, responsive UI design
- 📱 Mobile-friendly interface

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- Passport.js for authentication
- Express-session for session management
- CORS for cross-origin requests

### Frontend
- React 18
- Redux Toolkit for state management
- React Router for navigation
- Axios for API calls
- Modern CSS with responsive design

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Google Cloud Console account

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd mern-auth-boilerplate
   npm install
   cd client && npm install && cd ..
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration values.

3. **Set up Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (development)
     - `https://yourdomain.com/api/auth/google/callback` (production)

4. **Start the development servers:**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and React development server (port 3000).

## Google OAuth Setup Guide

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project" or select an existing project
3. Give your project a name (e.g., "MERN Auth App")

### Step 2: Enable Google+ API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google OAuth2 API" if available

### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)
6. Copy the Client ID and Client Secret

### Step 4: Update Environment Variables
Update your `.env` file with the credentials:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## Project Structure

```
mern-auth-boilerplate/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   └── App.js          # Main App component
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Configuration files
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── index.js            # Server entry point
├── package.json            # Root package.json
└── README.md
```

## API Endpoints

- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user
- `GET /api/test` - Test endpoint

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the React frontend
- `npm run build` - Build the React app for production

## Deployment

### Heroku Deployment
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect your GitHub repository
4. Enable automatic deploys

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
SESSION_SECRET=your_strong_session_secret
NODE_ENV=production
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
