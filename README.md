# Roommate Matching Website

A full-stack web application for university students to find compatible roommates based on preferences, lifestyle habits, and compatibility scoring.

## 🎯 Features

### For Students
- **Profile Management**: Create detailed profiles with age, gender, bio, and contact info
- **Preference System**: Set preferences for age range, budget, location, gender
- **Lifestyle Matching**: Define sleep schedule, cleanliness level, smoking/pets policy, guest preferences
- **Smart Matching Algorithm**: AI-powered compatibility scoring (0-100) based on multiple factors
- **Match Requests**: Send and receive match requests with personalized messages
- **Real-time Messaging**: Chat with matched roommates
- **Notifications**: Get notified of new requests, acceptances, and messages
- **Block Users**: Block users you don't want to interact with
- **Report System**: Report inappropriate behavior or fake profiles

### For Admins
- **User Management**: View, suspend, activate, or delete user accounts
- **Reports Dashboard**: Review and manage user reports
- **Statistics**: View platform stats (total users, active matches, pending reports)
- **Moderation Tools**: Add notes to reports, update report status

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Axios** - HTTP client for API calls
- **Sonner** - Toast notifications

### Backend
- **Node.js 18+** with Express
- **TypeScript** - Type-safe development
- **Supabase** - PostgreSQL database with real-time features
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **Zod** - Schema validation

## 📊 Database Schema

### Tables
1. **student** - User accounts for students
2. **admin** - Admin accounts
3. **profile** - Student profile information
4. **basic_preference** - Age, gender, budget, location preferences
5. **lifestyle_preference** - Sleep, cleanliness, pets, smoking, guests
6. **match_request** - Sent/received match requests
7. **match** - Confirmed matches between students
8. **message** - Chat messages
9. **notification** - System notifications
10. **report** - User reports for moderation
11. **block** - Blocked user relationships

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account with project created

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bissamiftikhar/Roommate-finder.git
   cd "Roommate Matching Website"
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   PORT=3000
   JWT_SECRET=your_secret_key_here
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

   Create `.env.local` file:
   ```env
   VITE_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Setup Database**
   - Go to your Supabase project SQL Editor
   - Run the SQL from `backend/schema.txt`
   - Creates all tables, triggers, and indexes

5. **Create Admin Account**
   ```bash
   cd backend
   npm run seed
   ```
   Creates admin: `admin@roommate.com` / `password123`

### Running the Application

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Runs on http://localhost:3000

2. **Start Frontend** (new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Runs on http://localhost:3001

3. **Access Application**
   - Open http://localhost:3001
   - Register new student or login as admin

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register student
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Profile
- `GET/PUT /api/profile` - Profile CRUD
- `GET/PUT /api/profile/preferences/basic` - Basic preferences
- `GET/PUT /api/profile/preferences/lifestyle` - Lifestyle preferences

### Matching
- `GET /api/matches/search` - Find compatible matches
- `GET /api/matches` - Get confirmed matches
- `GET /api/matches/requests` - Get match requests
- `POST /api/matches/request` - Send request
- `PUT /api/matches/request/:id` - Accept/reject

### Messaging
- `GET /api/chat/:matchId` - Get messages
- `POST /api/chat/:matchId` - Send message
- `PUT /api/chat/message/:id/read` - Mark read

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - All users
- `PUT /api/admin/users/:id/status` - Suspend/activate
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/reports` - View reports
- `PUT /api/admin/reports/:id` - Update report

## 🧮 Matching Algorithm

Compatibility score (0-100) based on:
- Age Compatibility: 20%
- Budget Overlap: 20%
- Gender Preference: 15%
- Sleep Schedule: 10%
- Cleanliness: 10%
- Smoking/Pets: 10%
- Guest Policy: 5%

## 🐛 Troubleshooting

**Backend won't start:**
- Check port 3000: `lsof -i :3000`
- Verify `.env` file exists
- Run `npm install`

**Frontend infinite loading:**
- Ensure backend is running
- Check `.env.local` has `VITE_API_URL`
- Clear browser localStorage

**Database errors:**
- Verify Supabase credentials
- Run `backend/schema.txt` in SQL Editor
- Disable RLS for development

## 👥 Author

Bissam Iftikhar - [GitHub](https://github.com/bissamiftikhar)
