import { useState, useEffect } from 'react';
import { User } from '../App';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Mail, User as UserIcon, Check, X } from 'lucide-react';
import { toast } from 'sonner';
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
  sender_name?: string;
  sender_bio?: string;
  receiver_name?: string;
  receiver_bio?: string;
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
      console.log('Raw requests response:', response.data);
      
      // Backend returns array directly, handle both cases
      const requestsData = Array.isArray(response.data) ? response.data : (response.data?.requests || []);
      console.log('Processed requests array:', requestsData);
      console.log('Current user student_id:', currentUser.student_id);
      
      // Transform the data to match the MatchRequest interface
      const transformedRequests = requestsData.map((req: any) => {
        console.log('Transforming request:', {
          request_id: req.request_id,
          sender_id: req.sender_id,
          receiver_id: req.receiver_id,
          status: req.status,
          sender_email: req.sender?.student_email,
          receiver_email: req.receiver?.student_email,
        });
        return {
          request_id: req.request_id,
          sender_id: req.sender_id,
          receiver_id: req.receiver_id,
          status: req.status,
          message: req.message,
          created_at: req.created_at,
          sender_name: req.sender?.student_email?.split('@')[0],
          sender_bio: req.sender?.bio,
          receiver_name: req.receiver?.student_email?.split('@')[0],
          receiver_bio: req.receiver?.bio,
        };
      });
      
      console.log('Final transformed requests:', transformedRequests);
      setRequests(transformedRequests);
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

  const incomingRequests = requests.filter((req) => {
    const isIncoming = req.receiver_id === currentUser.student_id && req.status === 'pending';
    console.log(`Request ${req.request_id}: incoming=${isIncoming}, receiver_id=${req.receiver_id}, current_user=${currentUser.student_id}, status=${req.status}`);
    return isIncoming;
  });

  const outgoingRequests = requests.filter(
    (req) => req.sender_id === currentUser.student_id
  );

  console.log('All requests:', requests);
  console.log('Incoming requests:', incomingRequests);
  console.log('Outgoing requests:', outgoingRequests);
  console.log('Current user ID:', currentUser.student_id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">Match Requests</h2>
          <p className="text-lg font-semibold text-gray-700 mt-2">
            Manage your incoming and outgoing match requests
          </p>
        </div>

        <Tabs defaultValue="incoming" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-white border-2 border-pink-200">
            <TabsTrigger value="incoming" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              Incoming ({incomingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="outgoing" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              Outgoing ({outgoingRequests.length})
            </TabsTrigger>
          </TabsList>

        <TabsContent value="incoming" className="space-y-4 mt-6">
          {incomingRequests.length === 0 ? (
            <div className="text-center py-16">
              <Mail className="w-20 h-20 text-pink-200 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700">No Incoming Requests</h3>
              <p className="text-gray-500 mt-2">You'll see requests from other students here</p>
            </div>
          ) : (
            incomingRequests.map((request) => (
              <Card key={request.request_id} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full flex-shrink-0 bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-md">
                        <UserIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-800">{request.sender_name}</h3>
                        {request.sender_bio && (
                          <p className="text-gray-600 text-sm mt-1">{request.sender_bio}</p>
                        )}
                        {request.message && (
                          <p className="text-gray-700 mt-3 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg text-sm border border-rose-100">
                            "{request.message}"
                          </p>
                        )}
                        <p className="text-gray-500 text-sm mt-2">
                          Sent on {formatDate(request.created_at)}
                        </p>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      paddingTop: '12px',
                      borderTop: '2px solid #fce7f3',
                      marginTop: '12px'
                    }}>
                      <Button
                        onClick={() => handleAccept(request.request_id)}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          flex: 1,
                          padding: '10px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleReject(request.request_id)}
                        style={{
                          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                          color: 'white',
                          flex: 1,
                          padding: '10px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="outgoing" className="space-y-4 mt-6">
          {outgoingRequests.length === 0 ? (
            <div className="text-center py-16">
              <Mail className="w-20 h-20 text-pink-200 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700">No Outgoing Requests</h3>
              <p className="text-gray-500 mt-2">Send requests to potential roommates from Search</p>
            </div>
          ) : (
            outgoingRequests.map((request) => (
              <Card key={request.request_id} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full flex-shrink-0 bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-md">
                        <UserIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800">{request.receiver_name}</h3>
                            {request.receiver_bio && (
                              <p className="text-gray-600 text-sm mt-1">{request.receiver_bio}</p>
                            )}
                          </div>
                          <Badge
                            className={`flex-shrink-0 font-semibold ${
                              request.status === 'accepted'
                                ? 'bg-green-500 text-white'
                                : request.status === 'rejected'
                                ? 'bg-red-500 text-white'
                                : 'bg-yellow-500 text-white'
                            }`}
                          >
                            {request.status}
                          </Badge>
                        </div>
                        {request.message && (
                          <p className="text-gray-700 mt-3 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg text-sm border border-rose-100">
                            Your message: "{request.message}"
                          </p>
                        )}
                        <p className="text-gray-500 text-sm mt-2">
                          Sent on {formatDate(request.created_at)}
                        </p>
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
    </div>
  );
}
