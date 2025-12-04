import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface RegisterPageProps {
  onRegister: (data: { name: string; email: string; password: string; role: 'student' | 'admin' }) => void;
  onSwitchToLogin: () => void;
}

export function RegisterPage({ onRegister, onSwitchToLogin }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onRegister({ name, email, password, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl rounded-2xl">
        <CardHeader className="space-y-1 flex flex-col items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-2xl py-8">
          <img src="/logo.png" alt="Management Logo" className="h-12 w-auto mb-4 drop-shadow-md" />
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <CardTitle className="text-center text-2xl text-white">Create Account</CardTitle>
          <CardDescription className="text-center text-indigo-100">
            Join RoommateMatch today
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold text-gray-700">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-2 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-300 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-300 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="font-semibold text-gray-700">Role</Label>
              <Select value={role} onValueChange={(val) => setRole(val as 'student' | 'admin')}>
                <SelectTrigger className="border-2 border-indigo-200 focus:border-indigo-500 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
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
                className="border-2 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-300 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-semibold text-gray-700">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border-2 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-300 rounded-lg"
              />
            </div>
            <Button 
              type="submit"
              style={{
                backgroundImage: 'linear-gradient(to right, rgb(79, 70, 229), rgb(147, 51, 234), rgb(236, 72, 153))',
                color: 'white'
              }}
              className="w-full font-semibold py-3 text-lg rounded-lg shadow-lg transition-all duration-200 mt-6"
            >
              Create Account
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-indigo-600 hover:text-indigo-700 font-semibold underline hover:no-underline transition"
              >
                Sign In
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
