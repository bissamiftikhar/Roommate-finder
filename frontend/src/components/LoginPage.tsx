import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}

export function LoginPage({ onLogin, onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl rounded-2xl">
        <CardHeader className="space-y-1 flex flex-col items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-2xl py-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <CardTitle className="text-center text-2xl text-white">RoommateMatch</CardTitle>
          <CardDescription className="text-center font-semibold text-base" style={{ color: '#3b82f6' }}>
            Find your perfect roommate match
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-300 rounded-lg py-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-300 rounded-lg py-2"
              />
            </div>
            <div className="mt-6">
              <Button 
                type="submit"
                style={{
                  backgroundImage: 'linear-gradient(to right, rgb(79, 70, 229), rgb(147, 51, 234), rgb(236, 72, 153))',
                  color: 'white'
                }}
                className="w-full font-semibold py-3 text-lg rounded-lg shadow-lg transition-all duration-200"
              >
                Sign In
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-indigo-600 hover:text-indigo-700 font-semibold underline hover:no-underline transition"
              >
                Register
              </button>
            </p>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <p className="text-xs font-semibold text-indigo-700 text-center mb-3">📝 Demo Accounts:</p>
            <div className="space-y-2 text-xs text-gray-700">
              <p className="text-center"><span className="font-semibold">Student:</span> any email / any password</p>
              <p className="text-center"><span className="font-semibold">Admin:</span> admin@roommate.com / any password</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
