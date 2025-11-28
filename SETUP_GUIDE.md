# Roommate Matcher - Setup & Configuration Guide

## 🚀 What's Been Completed

### Backend (Complete)
✅ Express.js server with TypeScript
✅ Authentication API (register/login)
✅ Profile & Preferences CRUD endpoints
✅ Matching algorithm with compatibility scoring
✅ Messages & Notifications API
✅ Match request system
✅ Database integration with Supabase
✅ Middleware for JWT authentication
✅ Password hashing with bcrypt

**Dependencies installed**: All backend packages ready

### Frontend (Partially Updated)
✅ Updated App.tsx to use backend API
✅ Updated ProfileView to connect to database
✅ Updated package.json with dependencies
✅ Created API service layer (services/api.ts)
✅ LoginPage ready to work with backend
✅ Type definitions aligned with backend

## 📋 Manual Configuration Needed

### Step 1: Setup Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL schema from `backend/schema.txt` in the SQL editor
4. Get your API credentials:
   - **Project URL** (SUPABASE_URL)
   - **Anon Key** (SUPABASE_KEY)
   - **Service Role Key** (SUPABASE_SERVICE_KEY)

### Step 2: Configure Backend Environment

Create `.env` file in `/backend` directory:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (use a strong random string)
JWT_SECRET=your-jwt-secret-key-change-this-in-production
```

### Step 3: Configure Frontend Environment

Create `.env.local` file in `/frontend` directory:

```bash
REACT_APP_API_URL=http://localhost:3000/api
```

## 🔧 Running the Project

### Start Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3000`

Check health: `http://localhost:3000/health`

### Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The app will typically start on `http://localhost:5173`

## 📝 Remaining Frontend Components to Update

### 1. **PreferencesView.tsx** - Update with database connection

```typescript
import { useEffect, useState } from 'react';
import { User, BasicPreference, LifestylePreference } from '../App';
import { profileApi } from '../services/api';
import { toast } from 'sonner';

// Fetch preferences on load
const fetchPreferences = async () => {
  const basicRes = await profileApi.getBasicPreferences();
  const lifestyleRes = await profileApi.getLifestylePreferences();
  // Update state with responses
};

// Save preferences
const handleSave = async () => {
  await profileApi.updateBasicPreferences(basicData);
  await profileApi.updateLifestylePreferences(lifestyleData);
  toast.success('Preferences updated!');
};
```

### 2. **MatchesView.tsx** - Show confirmed matches

```typescript
import { matchesApi } from '../services/api';

const fetchMatches = async () => {
  const response = await matchesApi.getMatches();
  setMatches(response.data); // Array of Match objects
};
```

### 3. **RequestsView.tsx** - Show match requests

```typescript
import { matchesApi } from '../services/api';

const fetchRequests = async () => {
  const response = await matchesApi.getMatchRequests();
  setRequests(response.data); // Array of MatchRequest objects
};

const handleAccept = async (requestId: string) => {
  await matchesApi.updateMatchRequest(requestId, 'accepted');
};

const handleReject = async (requestId: string) => {
  await matchesApi.updateMatchRequest(requestId, 'rejected');
};
```

### 4. **ChatView.tsx** - Real-time messaging

```typescript
import { chatApi } from '../services/api';

const fetchMessages = async (matchId: string) => {
  const response = await chatApi.getMessages(matchId);
  setMessages(response.data);
};

const sendMessage = async (matchId: string, content: string) => {
  await chatApi.sendMessage(matchId, content);
  // Refetch messages or add to state
};
```

### 5. **NotificationsView.tsx** - User notifications

```typescript
import { notificationsApi } from '../services/api';

const fetchNotifications = async () => {
  const response = await notificationsApi.getNotifications();
  setNotifications(response.data);
};

const markAsRead = async (notificationId: string) => {
  await notificationsApi.markAsRead(notificationId);
};
```

### 6. **SearchView.tsx** - Already has basic structure, just needs minor updates

Change from mock data to:
```typescript
const fetchMatches = async () => {
  const response = await matchesApi.searchMatches(50);
  setProfiles(response.data);
};
```

### 7. **AdminReportsView.tsx** & **AdminUsersView.tsx** 

Create admin routes in backend first, then connect frontend.

## 🔌 Backend API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login student
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile
- `GET /api/profile/preferences/basic` - Get basic preferences
- `PUT /api/profile/preferences/basic` - Update basic preferences
- `GET /api/profile/preferences/lifestyle` - Get lifestyle preferences
- `PUT /api/profile/preferences/lifestyle` - Update lifestyle preferences

### Matching
- `GET /api/matches/search` - Find potential matches
- `GET /api/matches` - Get confirmed matches
- `GET /api/matches/requests` - Get match requests
- `POST /api/matches/request` - Send match request
- `PUT /api/matches/request/:requestId` - Accept/reject request

### Chat
- `GET /api/chat/:matchId` - Get messages
- `POST /api/chat/:matchId` - Send message
- `PUT /api/chat/message/:messageId/read` - Mark as read

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:notificationId/read` - Mark as read

## 🎯 Testing the System

1. **Register a new account** - Try the registration page
2. **Set up profile** - Fill in personal information
3. **Add preferences** - Set matching preferences
4. **Find matches** - Browse potential matches
5. **Send requests** - Send match requests
6. **Chat** - Message with matched users

## 🚨 Common Issues & Solutions

### "Cannot connect to Supabase"
- Check `.env` file has correct credentials
- Verify SUPABASE_URL format (should be https://...)
- Ensure Supabase project is running

### "Port 3000 already in use"
- Change PORT in `.env` to another port like 3001
- Or kill process: `lsof -i :3000` then `kill -9 <PID>`

### Frontend can't reach backend
- Ensure backend is running on port 3000
- Check REACT_APP_API_URL in `.env.local`
- Verify CORS is enabled in backend

### Authentication not working
- Check JWT_SECRET is set in `.env`
- Verify tokens are being stored in localStorage
- Check browser console for auth errors

## 📦 Project Structure

```
backend/
├── src/
│   ├── index.ts              # Main server file
│   ├── middleware/           # Auth middleware
│   ├── routes/              # API endpoints
│   ├── services/            # Business logic (auth, matching, db)
│   └── types/               # TypeScript interfaces
├── package.json
├── tsconfig.json
└── .env.example

frontend/
├── src/
│   ├── App.tsx              # Main app component
│   ├── components/          # All UI components
│   ├── services/            # API client (api.ts)
│   └── styles/
├── package.json
├── vite.config.ts
└── .env.local (create this)
```

## ✨ Next Steps

1. **Setup Supabase** - Create project and run schema
2. **Configure .env files** - Add credentials
3. **Run backend** - `npm run dev` in backend/
4. **Run frontend** - `npm run dev` in frontend/
5. **Test authentication** - Register and login
6. **Update remaining components** - Use API endpoints provided above
7. **Add admin features** - Create report system
8. **Deploy** - When ready for production

## 💡 Tips

- Use VS Code REST Client extension for testing APIs
- Keep browser DevTools open to debug API calls
- Check backend console for error messages
- Test each component individually before integration
- Use toast notifications for user feedback

---

**Last Updated**: November 28, 2025
