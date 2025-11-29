import { useState, useEffect } from 'react';
import { User } from '../App';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Search, User as UserIcon, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { matchesApi } from '../services/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Textarea } from './ui/textarea';

interface SearchViewProps {
  currentUser: User;
}

interface SearchResult {
  student_id: string;
  full_name: string;
  bio: string;
  profile_picture_url?: string;
  compatibility_score: number;
  age_match: boolean;
  budget_match: boolean;
  gender_match: boolean;
}

export function SearchView({ currentUser }: SearchViewProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSearchResults();
  }, []);

  const loadSearchResults = async () => {
    try {
      setLoading(true);
      const response = await matchesApi.searchMatches(20);
      setResults(response.data.matches || []);
    } catch (error: any) {
      console.error('Failed to load search results:', error);
      toast.error('Failed to load potential matches');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedUser) return;

    try {
      await matchesApi.sendMatchRequest(selectedUser.student_id, message);
      toast.success('Match request sent successfully!');
      setSelectedUser(null);
      setMessage('');
    } catch (error: any) {
      console.error('Failed to send request:', error);
      toast.error(error.response?.data?.message || 'Failed to send match request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading potential matches...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Find Roommates</h2>
        <p className="text-gray-600 mt-1">
          Discover potential roommates based on your preferences
        </p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No Matches Found</h3>
          <p className="text-gray-500 mt-1">
            Update your preferences or check back later for new users
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((user) => (
            <Card key={user.student_id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <ImageWithFallback
                    src={user.profile_picture_url}
                    alt={user.full_name}
                    fallbackIcon={<UserIcon className="w-8 h-8" />}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <h3 className="font-semibold text-lg text-center">{user.full_name}</h3>
                  <Badge variant="secondary" className="mt-2">
                    {user.compatibility_score}% Match
                  </Badge>
                  
                  <div className="flex gap-2 mt-3">
                    {user.age_match && (
                      <Badge variant="outline" className="text-xs">Age ✓</Badge>
                    )}
                    {user.budget_match && (
                      <Badge variant="outline" className="text-xs">Budget ✓</Badge>
                    )}
                    {user.gender_match && (
                      <Badge variant="outline" className="text-xs">Gender ✓</Badge>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mt-4 text-center line-clamp-3">
                    {user.bio || 'No bio available'}
                  </p>

                  <Button
                    onClick={() => setSelectedUser(user)}
                    className="w-full mt-4"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Send Request Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Match Request</DialogTitle>
            <DialogDescription>
              Send a message to {selectedUser?.full_name} with your match request
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I saw your profile and think we would be great roommates..."
              className="mt-2"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleSendRequest}>
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
