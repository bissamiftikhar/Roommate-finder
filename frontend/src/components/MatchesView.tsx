import { useState, useEffect } from 'react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { matchesApi } from '../services/api';

interface MatchesViewProps {
  currentUser: User;
}

interface Match {
  match_id: string;
  student1_id: string;
  student2_id: string;
  match_score: number;
  status: string;
  other_user_name: string;
  other_user_bio: string;
  other_user_profile_picture?: string;
  created_at: string;
}

export function MatchesView({ currentUser }: MatchesViewProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await matchesApi.getMatches();
      setMatches(response.data.matches || []);
    } catch (error: any) {
      console.error('Failed to load matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading matches...</div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Heart className="w-16 h-16 text-gray-300" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">No Matches Yet</h3>
          <p className="text-gray-500 mt-1">Start searching for potential roommates</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Matches</h2>
        <p className="text-gray-600 mt-1">
          You have {matches.length} active {matches.length === 1 ? 'match' : 'matches'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <Card key={match.match_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <ImageWithFallback
                  src={match.other_user_profile_picture}
                  alt={match.other_user_name}
                  fallbackIcon={<UserIcon className="w-6 h-6" />}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{match.other_user_name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {match.match_score}% Match
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {match.other_user_bio || 'No bio available'}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Matched on {formatDate(match.created_at)}</span>
                <Badge variant={match.status === 'active' ? 'default' : 'secondary'}>
                  {match.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
