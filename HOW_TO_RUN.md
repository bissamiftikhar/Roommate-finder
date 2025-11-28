# How to Run the Project

## ✅ Project Status: RUNNING

Both servers are currently running and ready to use.

---

## 🚀 Servers Currently Active

### Backend Server
- **URL**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Base**: http://localhost:3000/api
- **Status**: ✅ Running

### Frontend Server
- **URL**: http://localhost:3001
- **Status**: ✅ Running
- **Access the app**: Open http://localhost:3001 in your browser

---

## 📝 How to Start the Servers

If you need to restart them, use these commands in **separate terminal windows**:

### Terminal 1 - Start Backend
```bash
cd /home/bissam-iftikhar/Downloads/"Roommate Matching Website"/backend
npm run dev
```
- Expected output: `🚀 Server running on http://localhost:3000`
- Node version warning is normal (can be ignored)

### Terminal 2 - Start Frontend
```bash
cd /home/bissam-iftikhar/Downloads/"Roommate Matching Website"/frontend
npm run dev
```
- Expected output: `VITE v6.3.5 ready in ... ms`
- Frontend URL will be shown (usually http://localhost:3001)

---

## 🧪 Testing the Application

### 1. Open the Frontend
```
http://localhost:3001
```

### 2. Register a New Account
- Click "Create an account"
- Enter email and password (6+ characters)
- Submit

### 3. Set Your Profile & Preferences
- Edit profile (age, bio, university, etc.)
- Set basic preferences (age range, budget, gender preference)
- Set lifestyle preferences (sleep schedule, cleanliness, etc.)

### 4. Search for Matches
- Go to Search view
- Browse compatible matches (sorted by compatibility %)
- Send match requests

### 5. View Matches & Chat
- Accept incoming match requests
- View active matches
- Send and receive messages

### 6. Admin Features
- Login with admin role to see admin panels
- View all users and reports

---

## 🔧 Configuration

### Backend Environment
File: `backend/.env`
```env
SUPABASE_URL=https://lwisbpaztsydloeinwmd.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
NODE_ENV=development
JWT_SECRET=change_this_jwt_secret_for_local_dev
```

### Frontend Environment
File: `frontend/.env.local`
```env
VITE_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SUPABASE_URL=https://lwisbpaztsydloeinwmd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `GET /api/preferences/basic` - Get basic preferences
- `PUT /api/preferences/basic` - Update preferences
- `GET /api/preferences/lifestyle` - Get lifestyle preferences
- `PUT /api/preferences/lifestyle` - Update lifestyle preferences

### Matching
- `GET /api/matches/search` - Find compatible matches
- `GET /api/matches` - Get active matches
- `POST /api/matches/request` - Send match request
- `PUT /api/matches/request/:id` - Accept/reject request

### Chat
- `GET /api/chat/:matchId` - Get messages
- `POST /api/chat/:matchId` - Send message
- `PUT /api/chat/message/:id/read` - Mark as read

### Notifications
- `GET /api/notifications` - Get all notifications
- `PUT /api/notifications/:id/read` - Mark as read

---

## ⚠️ Notes

### Node Version
- Current: Node 18.x
- Recommended: Node 20.x
- The app works on Node 18, but Supabase packages recommend upgrading to Node 20+

### Database
- Uses Supabase PostgreSQL (RLS disabled for local testing)
- Schema created from `backend/schema.txt`
- All data stored in Supabase

### Authentication
- JWT tokens with 7-day expiration
- Tokens stored in browser localStorage
- Bearer token automatically added to all API requests

---

## 🔒 Security (for Production)

**DO NOT USE CURRENT CREDENTIALS IN PRODUCTION**

For production deployment:
1. Generate a strong `JWT_SECRET`
2. Enable Row Level Security (RLS) in Supabase
3. Use a dedicated Supabase service role key
4. Store secrets in environment variables
5. Use HTTPS only
6. Update CORS settings for your domain

---

## 🐛 Troubleshooting

### Backend not responding
```bash
# Kill existing processes
pkill -f "npm run dev"
pkill -f "tsx"

# Restart backend
cd backend && npm run dev
```

### Frontend not loading
```bash
# Clear cache
rm -rf frontend/node_modules/.vite

# Restart frontend
cd frontend && npm run dev
```

### API calls failing
1. Check backend is running: `curl http://localhost:3000/health`
2. Check frontend .env.local has correct `VITE_API_URL`
3. Check browser console for error messages
4. Verify Supabase credentials are correct

### Database connection issues
1. Verify Supabase URL and keys in `backend/.env`
2. Check database schema is created: Run `backend/schema.txt` in Supabase SQL editor
3. Verify RLS policies allow reads/writes (currently disabled for testing)

---

## 📖 Documentation

- `README.md` - Project overview
- `QUICKSTART.md` - Fast setup guide
- `SETUP_GUIDE.md` - Detailed configuration
- `IMPLEMENTATION_CHECKLIST.md` - Step-by-step checklist
- `PROJECT_SUMMARY.md` - Completion status

---

**Happy coding! 🎉**
