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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-2">
            <Users className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-center">RoommateMatch</CardTitle>
          <CardDescription className="text-center">
            Find your perfect roommate match
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-indigo-600 hover:underline"
              >
                Register
              </button>
            </p>
          </div>
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center mb-2">Demo accounts:</p>
            <p className="text-xs text-muted-foreground">Student: any email / any password</p>
            <p className="text-xs text-muted-foreground">Admin: admin@roommate.com / any password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
