import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { authApi } from './services/api';

export interface User {
  student_id?: string;
  student_email?: string;
  admin_id?: string;
  admin_email?: string;
  status?: string;
  created_at?: string;
  last_login?: string | null;
}

export interface Profile {
  profile_id: string;
  student_id: string;
  age: number;
  gender: string;
  personal_email?: string;
  bio?: string;
  phone?: string;
  updated_at: string;
}

export interface BasicPreference {
  preference_id: string;
  student_id: string;
  gender_preference: string;
  age_min: number;
  age_max: number;
  budget_min: number;
  budget_max: number;
  location_preference?: string;
}

export interface LifestylePreference {
  lifestyle_id: string;
  student_id: string;
  sleep_schedule: string;
  cleanliness: string;
  guest_policy: string;
  smoking: boolean;
  pets: boolean;
  noise_tolerance: string;
  study_habits: string;
}

export interface Match {
  match_id: string;
  student1_id: string;
  student2_id: string;
  compatibility_score: number;
  matched_at: string;
  otherStudent?: Profile;
}

export interface MatchRequest {
  request_id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  message?: string;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export interface Message {
  message_id: string;
  match_id: string;
  sender_id: string;
  content: string;
  sent_at: string;
  is_read: boolean;
}

export interface Notification {
  notification_id: string;
  student_id: string;
  type: 'match_request' | 'message' | 'system' | 'report_update';
  content?: string;
  is_read: boolean;
  created_at: string;
}

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authApi.getMe();
          setCurrentUser(response.data.user);
          setCurrentView('dashboard');
        } catch (error) {
          localStorage.removeItem('authToken');
          toast.error('Session expired, please login again');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem('authToken', response.data.access_token);
      setCurrentUser(response.data.user);
      setCurrentView('dashboard');
      toast.success('Welcome back!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
    }
  };

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      const response = await authApi.register(data.email, data.password);
      localStorage.setItem('authToken', response.data.access_token);
      setCurrentUser(response.data.user);
      setCurrentView('dashboard');
      toast.success('Account created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setCurrentView('login');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
