# ResumeSmash

## Live Application

ResumeSmash is a web application that allows users to upload, vote on, and deface resumes for fun and competition.  
Go check out the app for yourself!
(https://resumesmash.up.railway.app/)

## Features

- **Leaderboard**: See the top-rated resumes.
- **Voting**: Upvote or downvote resumes.
- **Upload**: Submit your own resumes (PDF/Image).
- **Authentication**: Google OAuth integration.
- **Deface**: Redact PII from resumes using AI.

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- Passport.js for authentication
- OpenAI API (for Defacer feature)
- Cloudinary (for file storage)

### Frontend
- React 18
- Redux Toolkit
- React Router

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB
- Google Cloud Console account
- Cloudinary account
- OpenAI API Key

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/yashuppot/Resume-Smash.git
   cd ResumeSmash
   npm install
   cd client && npm install && cd ..
   ```

2. **Set up environment variables:**
   Create `.env`

   ```bash
   NODE_ENV=production
   PORT=5000

   # MongoDB
   MONGODB_URI=your_mongodb_atlas_connection_string

   # Session
   SESSION_SECRET=your_session_secret_here

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=https://your-app.onrender.com/api/auth/google/callback

   # Frontend URL (for CORS)
   CLIENT_URL=https://your-app.onrender.com
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

## Deployment

Deployed on Railway.
