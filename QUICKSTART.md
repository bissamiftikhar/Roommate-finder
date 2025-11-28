# ⚡ QUICK START (Copy-Paste Instructions)

## 1️⃣ CREATE SUPABASE PROJECT

Go to https://supabase.com → Click "New Project"
- Database name: roommate-matcher
- Password: (create strong password)
- Region: Choose closest to you
- Click "Create new project"
- Wait 5 minutes for database to start

## 2️⃣ RUN SQL SCHEMA

In Supabase Dashboard:
1. Click "SQL Editor" (left sidebar)
2. Click "New Query"
3. Copy everything from `/backend/schema.txt`
4. Paste into the query editor
5. Click "Run" button
6. Wait for success message

## 3️⃣ GET YOUR CREDENTIALS

In Supabase Dashboard:
1. Click "Settings" (left sidebar)
2. Click "API" 
3. You'll see:
   - **Project URL** → Copy this
   - **Anon (public)** key → Copy this
   - **Service Role** key → Copy this

## 4️⃣ CREATE BACKEND .ENV FILE

Open terminal and navigate to backend folder:
```bash
cd backend
```

Create file `.env` (note the dot at the start):
```
SUPABASE_URL=https://YOUR_PROJECT_URL.supabase.co
SUPABASE_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
PORT=3000
NODE_ENV=development
JWT_SECRET=my-secret-key-12345
```

Replace the values with your credentials from step 3.

## 5️⃣ CREATE FRONTEND .ENV.LOCAL FILE

Open terminal and navigate to frontend folder:
```bash
cd frontend
```

Create file `.env.local` (note the dot at the start):
```
REACT_APP_API_URL=http://localhost:3000/api
```

## 6️⃣ START BACKEND SERVER

In backend folder, run:
```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3000
```

**LEAVE THIS TERMINAL RUNNING**

## 7️⃣ START FRONTEND SERVER

Open a NEW terminal in frontend folder:
```bash
cd frontend
npm run dev
```

You should see something like:
```
Local: http://localhost:5173
```

## 8️⃣ OPEN APP IN BROWSER

Go to: http://localhost:5173

You should see the login page.

## 9️⃣ UPDATE COMPONENTS

The app works but 6 components need their code updated.

Open file: `/FRONTEND_COMPONENTS.ts`

For each component listed below:
1. Find the section in FRONTEND_COMPONENTS.ts (look for `// FILE: ComponentName.tsx`)
2. Copy ALL the code for that component
3. Open `frontend/src/components/ComponentName.tsx`
4. Select all code (Ctrl+A)
5. Paste new code (Ctrl+V)
6. Save (Ctrl+S)

**Components to update:**
- [ ] PreferencesView.tsx
- [ ] SearchView.tsx
- [ ] MatchesView.tsx
- [ ] RequestsView.tsx
- [ ] ChatView.tsx
- [ ] NotificationsView.tsx

## 🔟 TEST THE APP

Now refresh the browser.

1. **Register**
   - Click "Register"
   - Email: test@test.com
   - Password: password123
   - Click Register

2. **Setup Profile**
   - Go to "My Profile"
   - Click "Edit Profile"
   - Fill in: Age, Gender, Bio
   - Click "Save Changes"

3. **Setup Preferences**
   - Go to "Preferences"
   - Fill in both tabs
   - Click "Save Changes"

4. **Test Search**
   - Create another account (repeat step 1 with different email)
   - Login as first account
   - Click "Find Your Roommate"
   - Should see second account

5. **Send Request**
   - Click "Send Request"
   - See success message

6. **Accept Request**
   - Logout (click account menu)
   - Login as second account
   - Click "Requests"
   - Click check mark to accept

7. **Chat**
   - Go to "Chats" or "Matches"
   - Click on the match
   - Send a message
   - See message appear

## ✅ DONE!

The app is now fully working! 🎉

---

## 🆘 IF SOMETHING GOES WRONG

### "Cannot connect to Supabase"
- Check .env file
- Make sure SUPABASE_URL starts with `https://`
- Restart backend: Ctrl+C then `npm run dev`

### "Port 3000 already in use"
- Change PORT in .env to 3001
- Restart backend

### "Frontend can't reach backend"
- Make sure backend is running
- Check REACT_APP_API_URL in .env.local
- Restart frontend: Ctrl+C then `npm run dev`

### "Login fails"
- Make sure you registered first
- Check spelling of email/password
- Try a different email

### "Search shows no results"
- Make sure you created two accounts
- Make sure both have profiles
- Make sure both have preferences
- Check age ranges overlap

---

## 📊 WHAT'S RUNNING

- **Backend**: http://localhost:3000 ← API server
- **Frontend**: http://localhost:5173 ← Web app
- **Database**: supabase.com ← Your database

All connected and working! ✅

---

**That's it! Enjoy your Roommate Matcher app!** 🏠
