import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  profile?: UserProfile;
}

export interface UserProfile {
  age: number;
  gender: string;
  bio: string;
  university: string;
  major: string;
  year: string;
  photoUrl?: string;
}

export interface Preferences {
  gender: string;
  ageRange: [number, number];
  sleepSchedule: string;
  cleanliness: string;
  smoking: boolean;
  pets: boolean;
  guests: string;
  budget: [number, number];
}

export interface Match {
  id: string;
  user: User;
  matchScore: number;
  compatibility: string[];
}

export interface MatchRequest {
  id: string;
  from: User;
  to: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  message?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'match_request' | 'match_accepted' | 'new_message' | 'admin_action';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Report {
  id: string;
  reportedUser: User;
  reportedBy: User;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'action_taken';
  createdAt: string;
}

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Mock login - replace with your backend API call
    // Example: fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    
    // Mock user data
    const mockUser: User = {
      id: email === 'admin@roommate.com' ? 'admin-1' : 'user-' + Date.now(),
      email,
      name: email === 'admin@roommate.com' ? 'Admin User' : email.split('@')[0],
      role: email === 'admin@roommate.com' ? 'admin' : 'student',
      profile: email !== 'admin@roommate.com' ? {
        age: 22,
        gender: 'Other',
        bio: 'Looking for a friendly roommate!',
        university: 'State University',
        major: 'Computer Science',
        year: 'Junior',
      } : undefined
    };

    setCurrentUser(mockUser);
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    setCurrentView('dashboard');
    toast.success('Welcome back!');
  };

  const handleRegister = (data: { name: string; email: string; password: string; role: 'student' | 'admin' }) => {
    // Mock registration - replace with your backend API call
    // Example: fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) })
    
    const newUser: User = {
      id: 'user-' + Date.now(),
      email: data.email,
      name: data.name,
      role: data.role,
    };

    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setCurrentView('dashboard');
    toast.success('Account created successfully!');
  };

  const handleLogout = () => {
    // Mock logout - replace with your backend API call
    // Example: fetch('/api/auth/logout', { method: 'POST' })
    
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentView('login');
    toast.success('Logged out successfully');
  };

  if (currentView === 'login') {
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          onSwitchToRegister={() => setCurrentView('register')}
        />
        <Toaster />
      </>
    );
  }

  if (currentView === 'register') {
    return (
      <>
        <RegisterPage
          onRegister={handleRegister}
          onSwitchToLogin={() => setCurrentView('login')}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Dashboard user={currentUser!} onLogout={handleLogout} />
      <Toaster />
    </>
  );
}

export default App;
