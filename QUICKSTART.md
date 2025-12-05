# 🚀 Quick Start

Get the application running in 3 steps!

## 1. Install Dependencies
```bash
# Install backend
cd backend
npm install

# Install frontend (new terminal)
cd frontend
npm install
```

## 2. Seed Database
```bash
cd backend
npm run seed
```
✅ Creates admin account: `admin@livisync.com` / `admin123`

## 3. Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Access Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Admin Panel**: Login with `admin@livisync.com`

### Demo Accounts
- Student: `harisfayyaz@gmail.com` / `haris123`
- Admin: `admin@livisync.com` / `admin123`

## Next Steps
1. Register your first student account
2. Complete profile and preferences
3. Register a second student
4. Test the matching algorithm!

### Branding
- Place your logo at `frontend/public/logo.png` (used on Login, Register, and Sidebar).

### Notifications (Admin)
- `GET /api/notifications` returns notifications for the authenticated user.
- `POST /api/notifications/test-self` inserts a test notification for the current user (for debugging).

📖 Full documentation in `README.md`
