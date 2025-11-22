import { useState } from 'react';
import { User, UserProfile } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Edit2, Save, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ProfileViewProps {
  user: User;
}

export function ProfileView({ user }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(!user.profile);
  const [profile, setProfile] = useState<UserProfile>(
    user.profile || {
      age: 18,
      gender: '',
      bio: '',
      university: '',
      major: '',
      year: '',
      photoUrl: '',
    }
  );

  const handleSave = () => {
    // Mock API call - replace with your backend
    // fetch(`/api/users/${user.id}/profile`, { method: 'PUT', body: JSON.stringify(profile) })
    
    user.profile = profile;
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>
        {!isEditing && user.profile && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            {isEditing
              ? 'Update your profile details'
              : 'Your profile information'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {profile.photoUrl ? (
                <ImageWithFallback
                  src={profile.photoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            {isEditing && (
              <div className="flex-1">
                <Label htmlFor="photoUrl">Photo URL</Label>
                <Input
                  id="photoUrl"
                  placeholder="https://example.com/photo.jpg"
                  value={profile.photoUrl || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, photoUrl: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={user.name} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              {isEditing ? (
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({ ...profile, age: parseInt(e.target.value) })
                  }
                />
              ) : (
                <Input id="age" value={profile.age} disabled />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              {isEditing ? (
                <Select
                  value={profile.gender}
                  onValueChange={(val) =>
                    setProfile({ ...profile, gender: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input id="gender" value={profile.gender} disabled />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            {isEditing ? (
              <Input
                id="university"
                value={profile.university}
                onChange={(e) =>
                  setProfile({ ...profile, university: e.target.value })
                }
              />
            ) : (
              <Input id="university" value={profile.university} disabled />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="major">Major</Label>
              {isEditing ? (
                <Input
                  id="major"
                  value={profile.major}
                  onChange={(e) =>
                    setProfile({ ...profile, major: e.target.value })
                  }
                />
              ) : (
                <Input id="major" value={profile.major} disabled />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              {isEditing ? (
                <Select
                  value={profile.year}
                  onValueChange={(val) =>
                    setProfile({ ...profile, year: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Freshman">Freshman</SelectItem>
                    <SelectItem value="Sophomore">Sophomore</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input id="year" value={profile.year} disabled />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows={4}
              />
            ) : (
              <Textarea id="bio" value={profile.bio} disabled rows={4} />
            )}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              {user.profile && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setProfile(user.profile!);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
