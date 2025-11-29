import { useState, useEffect } from 'react';
import { User } from '../App';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Mail, User as UserIcon, Check, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { matchesApi } from '../services/api';

interface RequestsViewProps {
  currentUser: User;
}

interface MatchRequest {
  request_id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  message?: string;
  created_at: string;
  sender_name: string;
  sender_bio: string;
  sender_profile_picture?: string;
  receiver_name?: string;
  receiver_bio?: string;
  receiver_profile_picture?: string;
}

export function RequestsView({ currentUser }: RequestsViewProps) {
  const [requests, setRequests] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await matchesApi.getMatchRequests();
      setRequests(response.data.requests || []);
    } catch (error: any) {
      console.error('Failed to load requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await matchesApi.updateMatchRequest(requestId, 'accepted');
      toast.success('Match request accepted!');
      await loadRequests();
    } catch (error: any) {
      console.error('Failed to accept request:', error);
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await matchesApi.updateMatchRequest(requestId, 'rejected');
      toast.success('Match request rejected');
      await loadRequests();
    } catch (error: any) {
      console.error('Failed to reject request:', error);
      toast.error('Failed to reject request');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const incomingRequests = requests.filter(
    (req) => req.receiver_id === currentUser.student_id && req.status === 'pending'
  );

  const outgoingRequests = requests.filter(
    (req) => req.sender_id === currentUser.student_id
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading requests...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Match Requests</h2>
        <p className="text-gray-600 mt-1">
          Manage your incoming and outgoing match requests
        </p>
      </div>

      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="incoming">
            Incoming ({incomingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="outgoing">
            Outgoing ({outgoingRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-4 mt-6">
          {incomingRequests.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No Incoming Requests</h3>
              <p className="text-gray-500 mt-1">You'll see requests from other students here</p>
            </div>
          ) : (
            incomingRequests.map((request) => (
              <Card key={request.request_id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <ImageWithFallback
                      src={request.sender_profile_picture}
                      alt={request.sender_name}
                      fallbackIcon={<UserIcon className="w-6 h-6" />}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{request.sender_name}</h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {request.sender_bio || 'No bio available'}
                          </p>
                          {request.message && (
                            <p className="text-gray-700 mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                              "{request.message}"
                            </p>
                          )}
                          <p className="text-gray-500 text-sm mt-2">
                            Sent on {formatDate(request.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => handleAccept(request.request_id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleReject(request.request_id)}
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
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
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No Outgoing Requests</h3>
              <p className="text-gray-500 mt-1">Send requests to potential roommates from Search</p>
            </div>
          ) : (
            outgoingRequests.map((request) => (
              <Card key={request.request_id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <ImageWithFallback
                      src={request.receiver_profile_picture}
                      alt={request.receiver_name || 'Receiver'}
                      fallbackIcon={<UserIcon className="w-6 h-6" />}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{request.receiver_name}</h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {request.receiver_bio || 'No bio available'}
                          </p>
                          {request.message && (
                            <p className="text-gray-700 mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                              Your message: "{request.message}"
                            </p>
                          )}
                          <p className="text-gray-500 text-sm mt-2">
                            Sent on {formatDate(request.created_at)}
                          </p>
                        </div>
                        <Badge
                          variant={
                            request.status === 'accepted'
                              ? 'default'
                              : request.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
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
