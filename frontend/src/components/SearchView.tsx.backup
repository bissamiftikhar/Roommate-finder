import { useState } from 'react';
import { User } from '../App';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Search, MapPin, GraduationCap, User as UserIcon, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SearchViewProps {
  currentUser: User;
}

// Mock data for search results
const mockUsers: User[] = [
  {
    id: '2',
    email: 'sarah.johnson@university.edu',
    name: 'Sarah Johnson',
    role: 'student',
    profile: {
      age: 21,
      gender: 'Female',
      bio: 'Computer Science major, love coding and hiking. Looking for a clean and quiet roommate.',
      university: 'State University',
      major: 'Computer Science',
      year: 'Junior',
    },
  },
  {
    id: '3',
    email: 'mike.chen@university.edu',
    name: 'Mike Chen',
    role: 'student',
    profile: {
      age: 22,
      gender: 'Male',
      bio: 'Business major and gym enthusiast. Early bird who keeps things organized.',
      university: 'State University',
      major: 'Business Administration',
      year: 'Senior',
    },
  },
  {
    id: '4',
    email: 'emma.wilson@university.edu',
    name: 'Emma Wilson',
    role: 'student',
    profile: {
      age: 20,
      gender: 'Female',
      bio: 'Art student who loves music and cooking. Looking for a creative and friendly roommate.',
      university: 'State University',
      major: 'Fine Arts',
      year: 'Sophomore',
    },
  },
  {
    id: '5',
    email: 'alex.brown@university.edu',
    name: 'Alex Brown',
    role: 'student',
    profile: {
      age: 23,
      gender: 'Male',
      bio: 'Graduate student in Engineering. Night owl who values personal space.',
      university: 'State University',
      major: 'Mechanical Engineering',
      year: 'Graduate',
    },
  },
];

export function SearchView({ currentUser }: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('Any');
  const [filterYear, setFilterYear] = useState('Any');
  const [results, setResults] = useState<User[]>(mockUsers);

  const handleSearch = () => {
    // Mock search - replace with your backend API call
    // fetch(`/api/search?q=${searchQuery}&gender=${filterGender}&year=${filterYear}`)
    
    let filtered = mockUsers;

    if (searchQuery) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.profile?.major.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterGender !== 'Any') {
      filtered = filtered.filter((u) => u.profile?.gender === filterGender);
    }

    if (filterYear !== 'Any') {
      filtered = filtered.filter((u) => u.profile?.year === filterYear);
    }

    setResults(filtered);
  };

  const handleSendRequest = (user: User) => {
    // Mock API call - replace with your backend
    // fetch(`/api/match-requests`, { method: 'POST', body: JSON.stringify({ toUserId: user.id }) })
    
    toast.success(`Match request sent to ${user.name}!`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1>Search Roommates</h1>
        <p className="text-muted-foreground">
          Find potential roommates based on your criteria
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search by name or major</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="e.g. Computer Science, John..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Gender</Label>
                <Select value={filterGender} onValueChange={setFilterGender}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label>Year</Label>
                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="Freshman">Freshman</SelectItem>
                    <SelectItem value="Sophomore">Sophomore</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSearch} className="self-end">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {user.profile?.photoUrl ? (
                    <ImageWithFallback
                      src={user.profile.photoUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="truncate">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.profile?.age} years old • {user.profile?.gender}
                  </p>

                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">
                        {user.profile?.major} - {user.profile?.year}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">{user.profile?.university}</span>
                    </div>
                  </div>

                  <p className="text-sm mt-3 line-clamp-2">
                    {user.profile?.bio}
                  </p>

                  <Button
                    onClick={() => handleSendRequest(user)}
                    className="w-full mt-4"
                    size="sm"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Match Request
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No roommates found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}
