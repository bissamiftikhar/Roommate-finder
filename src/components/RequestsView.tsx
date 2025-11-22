import { useState } from 'react';
import { User, MatchRequest } from '../App';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Mail, User as UserIcon, Check, X, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface RequestsViewProps {
  currentUser: User;
}

// Mock match requests
const mockIncomingRequests: MatchRequest[] = [
  {
    id: '1',
    from: {
      id: '2',
      email: 'sarah.johnson@university.edu',
      name: 'Sarah Johnson',
      role: 'student',
      profile: {
        age: 21,
        gender: 'Female',
        bio: 'Computer Science major, love coding and hiking.',
        university: 'State University',
        major: 'Computer Science',
        year: 'Junior',
      },
    },
    to: {
      id: 'current',
      email: 'current@user.com',
      name: 'Current User',
      role: 'student',
    },
    status: 'pending',
    createdAt: '2024-01-20T10:00:00Z',
    message: 'Hi! I saw your profile and think we would be great roommates. I also love quiet study time and keeping things clean.',
  },
  {
    id: '2',
    from: {
      id: '6',
      email: 'lisa.park@university.edu',
      name: 'Lisa Park',
      role: 'student',
      profile: {
        age: 22,
        gender: 'Female',
        bio: 'Psychology major with a passion for mental health.',
        university: 'State University',
        major: 'Psychology',
        year: 'Junior',
      },
    },
    to: {
      id: 'current',
      email: 'current@user.com',
      name: 'Current User',
      role: 'student',
    },
    status: 'pending',
    createdAt: '2024-01-19T15:30:00Z',
  },
];

const mockOutgoingRequests: MatchRequest[] = [
  {
    id: '3',
    from: {
      id: 'current',
      email: 'current@user.com',
      name: 'Current User',
      role: 'student',
    },
    to: {
      id: '3',
      email: 'mike.chen@university.edu',
      name: 'Mike Chen',
      role: 'student',
      profile: {
        age: 22,
        gender: 'Male',
        bio: 'Business major and gym enthusiast.',
        university: 'State University',
        major: 'Business Administration',
        year: 'Senior',
      },
    },
    status: 'pending',
    createdAt: '2024-01-18T09:00:00Z',
  },
];

export function RequestsView({ currentUser }: RequestsViewProps) {
  const [incomingRequests, setIncomingRequests] = useState<MatchRequest[]>(mockIncomingRequests);
  const [outgoingRequests, setOutgoingRequests] = useState<MatchRequest[]>(mockOutgoingRequests);

  const handleAccept = (request: MatchRequest) => {
    // Mock API call - replace with your backend
    // fetch(`/api/match-requests/${request.id}/accept`, { method: 'POST' })
    
    setIncomingRequests(incomingRequests.filter((r) => r.id !== request.id));
    toast.success(`Accepted match request from ${request.from.name}!`);
  };

  const handleReject = (request: MatchRequest) => {
    // Mock API call - replace with your backend
    // fetch(`/api/match-requests/${request.id}/reject`, { method: 'POST' })
    
    setIncomingRequests(incomingRequests.filter((r) => r.id !== request.id));
    toast.success('Request rejected');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1>Match Requests</h1>
        <p className="text-muted-foreground">
          Manage incoming and outgoing match requests
        </p>
      </div>

      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="incoming">
            Incoming ({incomingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="outgoing">
            Outgoing ({outgoingRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-4 mt-6">
          {incomingRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Mail className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No incoming requests
                </p>
              </CardContent>
            </Card>
          ) : (
            incomingRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {request.from.profile?.photoUrl ? (
                        <ImageWithFallback
                          src={request.from.profile.photoUrl}
                          alt={request.from.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3>{request.from.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {request.from.profile?.major} - {request.from.profile?.year}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(request.createdAt)}
                        </span>
                      </div>

                      <p className="text-sm mb-4">{request.from.profile?.bio}</p>

                      {request.message && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">{request.message}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAccept(request)}
                          className="flex-1"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleReject(request)}
                          variant="outline"
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="outgoing" className="space-y-4 mt-6">
          {outgoingRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Send className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No outgoing requests
                </p>
              </CardContent>
            </Card>
          ) : (
            outgoingRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {request.to.profile?.photoUrl ? (
                        <ImageWithFallback
                          src={request.to.profile.photoUrl}
                          alt={request.to.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3>{request.to.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {request.to.profile?.major} - {request.to.profile?.year}
                          </p>
                        </div>
                        <Badge variant="secondary">{request.status}</Badge>
                      </div>

                      <p className="text-sm mb-4">{request.to.profile?.bio}</p>

                      <p className="text-xs text-muted-foreground">
                        Sent on {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
