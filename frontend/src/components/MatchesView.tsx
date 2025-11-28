import { useState } from 'react';
import { User, Match } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, User as UserIcon, Send, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MatchesViewProps {
  currentUser: User;
}

// Mock matches with compatibility scores
const mockMatches: Match[] = [
  {
    id: '1',
    user: {
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
    matchScore: 95,
    compatibility: ['Same major', 'Similar age', 'Clean lifestyle', 'Quiet environment'],
  },
  {
    id: '2',
    user: {
      id: '6',
      email: 'lisa.park@university.edu',
      name: 'Lisa Park',
      role: 'student',
      profile: {
        age: 22,
        gender: 'Female',
        bio: 'Psychology major with a passion for mental health. Love reading and yoga.',
        university: 'State University',
        major: 'Psychology',
        year: 'Junior',
      },
    },
    matchScore: 88,
    compatibility: ['Similar age', 'Same year', 'Compatible schedule', 'No smoking'],
  },
  {
    id: '3',
    user: {
      id: '7',
      email: 'james.lee@university.edu',
      name: 'James Lee',
      role: 'student',
      profile: {
        age: 23,
        gender: 'Male',
        bio: 'Economics major and coffee enthusiast. Always up for good conversations.',
        university: 'State University',
        major: 'Economics',
        year: 'Senior',
      },
    },
    matchScore: 82,
    compatibility: ['Budget match', 'Similar interests', 'Flexible schedule'],
  },
];

export function MatchesView({ currentUser }: MatchesViewProps) {
  const [matches, setMatches] = useState<Match[]>(mockMatches);

  const handleSendRequest = (match: Match) => {
    // Mock API call - replace with your backend
    // fetch(`/api/match-requests`, { method: 'POST', body: JSON.stringify({ toUserId: match.user.id }) })
    
    toast.success(`Match request sent to ${match.user.name}!`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    return 'text-yellow-600';
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1>Suggested Matches</h1>
        <p className="text-muted-foreground">
          Based on your preferences, here are your top roommate matches
        </p>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No matches yet. Update your preferences to find compatible roommates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {matches.map((match) => (
            <Card key={match.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {match.user.profile?.photoUrl ? (
                      <ImageWithFallback
                        src={match.user.profile.photoUrl}
                        alt={match.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3>{match.user.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {match.user.profile?.age} years old • {match.user.profile?.gender}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`w-5 h-5 ${getScoreColor(match.matchScore)}`} />
                        <span className={`${getScoreColor(match.matchScore)}`}>
                          {match.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm">
                        {match.user.profile?.major} - {match.user.profile?.year}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {match.user.profile?.university}
                      </p>
                    </div>

                    <p className="text-sm mb-4">{match.user.profile?.bio}</p>

                    <div className="mb-4">
                      <p className="text-sm mb-2">Compatibility:</p>
                      <div className="flex flex-wrap gap-2">
                        {match.compatibility.map((item, index) => (
                          <Badge key={index} variant="secondary">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button onClick={() => handleSendRequest(match)}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Match Request
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
