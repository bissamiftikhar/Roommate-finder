import { useState, useEffect } from 'react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, User as UserIcon, Send, Loader2, Flag } from 'lucide-react';
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
import { Label } from './ui/label';

interface MatchesViewProps {
  currentUser: User;
}

interface PotentialMatch {
  match_id: string;
  student1_id: string;
  student2_id: string;
  compatibility_score: number;
  status: string;
  profile: {
    student_id: string;
    age: number;
    gender: string;
    bio: string | null;
    profile_picture?: string;
  };
  student?: {
    student_id: string;
    student_email: string;
  };
  matched_at: string;
}

export function MatchesView({ currentUser }: MatchesViewProps) {
  const [potentialMatches, setPotentialMatches] = useState<PotentialMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingRequestId, setSendingRequestId] = useState<string | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportUserId, setReportUserId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await matchesApi.searchMatches(20);
      console.log('=== FULL Matches response ===', response);
      console.log('Response data:', response.data);
      console.log('Response data type:', typeof response.data);
      
      // Ensure we have valid data with compatibility_score
      const matches = Array.isArray(response.data) ? response.data : response.data?.matches || [];
      
      // Filter to show only high compatibility matches (>= 80%)
      const highCompatibilityMatches = matches.filter((match: any) => (match.compatibility_score || 0) >= 80);
      console.log('Processed high compatibility matches:', highCompatibilityMatches);
      console.log('First match:', highCompatibilityMatches[0]);
      console.log('First match compatibility_score:', highCompatibilityMatches[0]?.compatibility_score);
      
      setPotentialMatches(highCompatibilityMatches);
    } catch (error: any) {
      console.error('Failed to load matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (receiverId: string) => {
    try {
      setSendingRequestId(receiverId);
      await matchesApi.sendMatchRequest(receiverId, 'Hi! I think we could be great roommates!');
      toast.success('Match request sent!');
      // Remove the match from the list after sending request
      setPotentialMatches(potentialMatches.filter(m => m.student2_id !== receiverId));
    } catch (error: any) {
      console.error('Failed to send request:', error);
      toast.error(error?.response?.data?.error || 'Failed to send match request');
    } finally {
      setSendingRequestId(null);
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
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading potential matches...</p>
        </div>
      </div>
    );
  }

  if (potentialMatches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Heart className="w-16 h-16 text-gray-300" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">No High Compatibility Matches Yet</h3>
          <p className="text-gray-500 mt-1">You don't have any matches with 80% or higher compatibility. Check the search page to see all potential matches!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', background: 'linear-gradient(to right, #fff, #f0f4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>High Compatibility Matches (80%+)</h2>
          <p style={{ color: '#e0e7ff', marginTop: '0.5rem' }}>
            Found {potentialMatches.length} high compatibility {potentialMatches.length === 1 ? 'match' : 'matches'} for you
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {potentialMatches.map((match) => {
            const compatibilityScore = Math.round(match.compatibility_score || 0);
            const userEmail = match.student?.student_email || 'Unknown User';
            const userNameDisplay = userEmail.split('@')[0];
            
            console.log('Rendering match with score:', compatibilityScore, 'for', userNameDisplay);
            
            return (
              <div key={match.student2_id} style={{ display: 'flex', flexDirection: 'column', height: '100%', border: 'none', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', borderRadius: '1rem', overflow: 'hidden', backgroundColor: 'white', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                {/* Match Score Header - Enhanced */}
                <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.875rem', letterSpacing: '0.05em' }}>MATCH SCORE</span>
                  <span style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: '1' }}>{compatibilityScore}%</span>
                </div>
                
                {/* User Info */}
                <div style={{ padding: '1rem 1rem 0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', wordBreak: 'break-word', color: '#111827' }}>
                    {userNameDisplay || 'User'}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    {match.profile?.age || '?'} years old • {match.profile?.gender ? match.profile.gender.charAt(0).toUpperCase() + match.profile.gender.slice(1) : 'N/A'}
                  </p>
                </div>
                
                {/* Bio and Button */}
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {match.profile?.bio || 'No bio available'}
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                    <Button
                      onClick={() => handleSendRequest(match.student2_id)}
                      disabled={sendingRequestId === match.student2_id}
                      style={{ width: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: '600', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.3s ease', opacity: sendingRequestId === match.student2_id ? 0.7 : 1 }}
                    >
                      {sendingRequestId === match.student2_id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Request
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => openReportDialog(match.student2_id)}
                      variant="outline"
                      style={{ width: '100%', borderColor: '#fca5a5', color: '#dc2626', fontWeight: '600' }}
                      className="hover:bg-red-50"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Report User
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
