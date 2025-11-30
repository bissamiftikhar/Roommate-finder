import { useState, useEffect } from 'react';
import { User } from '../App';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Search, User as UserIcon, Send, X, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { matchesApi, blockApi } from '../services/api';
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
  name: string;
  bio: string;
  compatibility_score: number;
  age?: number;
  gender?: string;
}

export function SearchView({ currentUser }: SearchViewProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportUserId, setReportUserId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    loadSearchResults();
  }, []);

  // Filter results based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResults(results);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredResults(results.filter((user) => user.name.toLowerCase().includes(query)));
    }
  }, [searchQuery, results]);

  const loadSearchResults = async () => {
    try {
      setLoading(true);
      const response = await matchesApi.searchMatches(20);
      console.log('Search results response:', response.data);
      
      // Transform backend format to SearchResult format
      const matches = Array.isArray(response.data) ? response.data : (response.data?.matches || []);
      
      const transformedResults = matches.map((match: any) => ({
        student_id: match.student2_id || match.student_id,
        name: match.student?.student_email?.split('@')[0] || 'Unknown',
        bio: match.profile?.bio || 'No bio available',
        compatibility_score: match.compatibility_score || 50,
        age: match.profile?.age,
        gender: match.profile?.gender,
      }));
      
      console.log('Transformed results:', transformedResults);
      setResults(transformedResults);
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

  const handleReportUser = async () => {
    if (!reportUserId || !reportReason.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }

    try {
      await blockApi.reportUser(reportUserId, reportReason);
      toast.success('User reported successfully. Our team will review it.');
      setReportDialogOpen(false);
      setReportUserId(null);
      setReportReason('');
    } catch (error: any) {
      console.error('Failed to report user:', error);
      toast.error(error.response?.data?.error || 'Failed to report user');
    }
  };

  const openReportDialog = (userId: string) => {
    setReportUserId(userId);
    setReportDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading potential matches...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">Find Roommates</h2>
          <p className="text-lg font-semibold text-gray-700 mt-2">
            Discover all potential roommates - sorted by compatibility
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Label htmlFor="search" className="text-gray-700 mb-3 block font-semibold text-lg">Search by Name</Label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
            <Input
              id="search"
              placeholder="Search roommates by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300 bg-white shadow-md hover:shadow-lg transition-shadow"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

      {results.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No Matches Found</h3>
          <p className="text-gray-500 mt-1">
            Update your preferences or check back later for new users
          </p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="text-center py-16">
          <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-700">No users found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search query
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((user) => (
            <Card key={user.student_id} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <UserIcon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-center text-gray-800">{user.name}</h3>
                  <Badge className="mt-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-gray-800 font-semibold px-4 py-2">
                    {Math.round(user.compatibility_score)}% Match
                  </Badge>
                  
                  <div className="flex gap-2 mt-4 flex-wrap justify-center">
                    {user.age && (
                      <Badge variant="outline" className="text-sm font-medium border-cyan-300 text-cyan-700">Age {user.age}</Badge>
                    )}
                    {user.gender && (
                      <Badge variant="outline" className="text-sm font-medium border-blue-300 text-blue-700">{user.gender}</Badge>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mt-5 text-center line-clamp-3 leading-relaxed">
                    {user.bio}
                  </p>

                  <div className="w-full mt-6 space-y-2">
                    <Button
                      onClick={() => setSelectedUser(user)}
                      style={{
                        backgroundImage: 'linear-gradient(to right, rgb(6, 182, 212), rgb(59, 130, 246), rgb(99, 102, 241))',
                        color: 'white'
                      }}
                      className="w-full font-semibold py-2 rounded-lg shadow-md transition-all duration-300"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Request
                    </Button>
                    
                    <Button
                      onClick={() => openReportDialog(user.student_id)}
                      variant="outline"
                      className="w-full font-semibold py-2 rounded-lg border-red-200 text-red-600 hover:bg-red-50 transition-all duration-300"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Report User
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Send Request Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open: boolean) => !open && setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Match Request</DialogTitle>
            <DialogDescription>
              Send a message to {selectedUser?.name} with your match request
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

      {/* Report User Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report User</DialogTitle>
            <DialogDescription>
              Please provide a reason for reporting this user. Our moderation team will review it.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="report-reason">Reason for Reporting</Label>
            <Textarea
              id="report-reason"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="e.g., Inappropriate behavior, fake profile, spam, harassment..."
              className="mt-2"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setReportDialogOpen(false);
              setReportUserId(null);
              setReportReason('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleReportUser}
              style={{ backgroundColor: 'rgb(220, 38, 38)', color: 'white' }}
              className="hover:bg-red-700"
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}

