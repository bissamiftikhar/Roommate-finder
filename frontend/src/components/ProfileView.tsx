import { useState, useEffect } from 'react';
import { User, Profile } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Edit2, Save, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { profileApi } from '../services/api';

interface ProfileViewProps {
  user: User;
}

export function ProfileView({ user }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    age: 18,
    gender: '',
    personal_email: '',
    bio: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileApi.getProfile();
      setProfile(response.data.profile);
      if (response.data.profile) {
        setFormData({
          age: response.data.profile.age || 18,
          gender: response.data.profile.gender || '',
          personal_email: response.data.profile.personal_email || '',
          bio: response.data.profile.bio || '',
          phone: response.data.profile.phone || '',
        });
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await profileApi.updateProfile(formData);
      setProfile({ ...profile, ...formData } as Profile);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">My Profile</h1>
            <p className="text-lg font-semibold text-gray-700 mt-2">Manage your personal information</p>
          </div>
          {!isEditing && (
            <Button 
              onClick={() => setIsEditing(true)}
              style={{
                backgroundImage: 'linear-gradient(to right, rgb(249, 115, 22), rgb(217, 119, 6))',
                color: 'white'
              }}
              className="font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-white rounded-t-lg border-b border-orange-200">
            <CardTitle className="text-xl font-bold text-gray-800">Personal Information</CardTitle>
            <CardDescription className="text-base font-semibold text-gray-600">
              {isEditing ? 'Update your profile details' : 'Your profile information'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center overflow-hidden shadow-lg">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
                <Input id="email" value={user.student_email} disabled className="bg-gray-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="font-semibold">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="font-semibold">Gender</Label>
                {isEditing ? (
                  <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id="gender" value={formData.gender || 'Not specified'} disabled />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-semibold">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personal_email" className="font-semibold">Personal Email</Label>
              <Input
                id="personal_email"
                type="email"
                placeholder="personal@example.com"
                value={formData.personal_email}
                onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="font-semibold">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                rows={4}
              />
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSave}
                  style={{
                    backgroundImage: 'linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))',
                    color: 'white'
                  }}
                  className="flex-1 font-semibold py-2 rounded-lg shadow-md transition-all duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  style={{ backgroundColor: 'rgb(209, 213, 219)', color: 'rgb(31, 41, 55)' }}
                  className="flex-1 font-semibold py-2 rounded-lg shadow-md transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
