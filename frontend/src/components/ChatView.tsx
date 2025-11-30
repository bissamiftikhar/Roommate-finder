import { useState, useRef, useEffect } from 'react';
import { User } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  MessageSquare, 
  User as UserIcon, 
  Send, 
  MoreVertical,
  AlertTriangle,
  Ban
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';
import { matchesApi, chatApi, blockApi } from '../services/api';

interface ChatViewProps {
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
}

interface Message {
  message_id: string;
  match_id: string;
  sender_id: string;
  content: string;
  sent_at: string;
  is_read: boolean;
}

export function ChatView({ currentUser }: ChatViewProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefreshInterval = useRef<NodeJS.Timeout | null>(null);
  const currentMatchIdRef = useRef<string | null>(null);
  const loadedMessageIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      // Clear previous match's messages and tracking
      currentMatchIdRef.current = selectedMatch.match_id;
      loadedMessageIdsRef.current = new Set();
      setMessages([]);
      
      loadMessages(selectedMatch.match_id);
      
      // Set up auto-refresh of messages every 3 seconds
      messageRefreshInterval.current = setInterval(() => {
        loadMessages(selectedMatch.match_id);
      }, 3000);
    }

    return () => {
      // Clear interval when changing match or unmounting
      if (messageRefreshInterval.current) {
        clearInterval(messageRefreshInterval.current);
      }
    };
  }, [selectedMatch]);

  // Only scroll to bottom when a NEW message is sent (not on refresh)
  const lastMessageCountRef = useRef(0);
  useEffect(() => {
    // Only scroll if we have NEW messages (count increased)
    if (messages.length > lastMessageCountRef.current) {
      scrollToBottom();
      lastMessageCountRef.current = messages.length;
    }
  }, [messages.length]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await matchesApi.getMatches();
      setMatches(response.data.matches || []);
      if (response.data.matches && response.data.matches.length > 0) {
        setSelectedMatch(response.data.matches[0]);
      }
    } catch (error: any) {
      console.error('Failed to load matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (matchId: string) => {
    try {
      console.log('Loading messages for match:', matchId);
      const response = await chatApi.getMessages(matchId);
      console.log('Messages response:', response.data);
      const messagesData = response.data.messages || [];
      console.log('Setting messages:', messagesData);
      
      // Only update if we're still looking at this match
      if (currentMatchIdRef.current !== matchId) {
        console.log('Match changed, ignoring old messages');
        return;
      }
      
      // Deduplicate within this match only
      setMessages((prevMessages) => {
        // Add message IDs that we've already loaded
        messagesData.forEach(m => loadedMessageIdsRef.current.add(m.message_id));
        
        // Filter out duplicates using loaded message IDs
        const newMessages = messagesData.filter(m => 
          !prevMessages.some(pm => pm.message_id === m.message_id)
        );
        
        const combined = [...prevMessages, ...newMessages];
        // Sort by sent_at to maintain order
        return combined.sort((a, b) => 
          new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
        );
      });
    } catch (error: any) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch) return;

    try {
      const messageText = newMessage;
      setNewMessage(''); // Clear input immediately for better UX
      
      console.log('Sending message:', messageText);
      const response = await chatApi.sendMessage(selectedMatch.match_id, messageText);
      console.log('Send message response:', response.data);
      
      // Get the message from response
      const sentMessage = response.data.message || response.data;
      console.log('Message to add:', sentMessage);
      
      // Add the message to the list immediately for sender to see
      if (sentMessage && sentMessage.message_id) {
        setMessages(prevMessages => [...prevMessages, sentMessage]);
        console.log('Message added to state');
      }
      
      toast.success('Message sent');
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleBlockUser = async () => {
    if (!selectedMatch) return;

    const otherUserId = selectedMatch.student1_id === currentUser.student_id
      ? selectedMatch.student2_id
      : selectedMatch.student1_id;

    try {
      await blockApi.blockUser(otherUserId);
      toast.success('User blocked successfully');
      await loadMatches();
      setSelectedMatch(null);
    } catch (error: any) {
      console.error('Failed to block user:', error);
      toast.error('Failed to block user');
    }
  };

  const handleReportUser = async () => {
    if (!selectedMatch) return;

    const otherUserId = selectedMatch.student1_id === currentUser.student_id
      ? selectedMatch.student2_id
      : selectedMatch.student1_id;

    const reason = prompt('Please provide a reason for reporting:');
    if (!reason) return;

    try {
      await blockApi.reportUser(otherUserId, reason);
      toast.success('User reported successfully');
    } catch (error: any) {
      console.error('Failed to report user:', error);
      toast.error('Failed to report user');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
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
        <MessageSquare className="w-16 h-16 text-gray-300" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">No Active Matches</h3>
          <p className="text-gray-500 mt-1">Connect with potential roommates to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-lg overflow-hidden flex gap-4 p-4">
      {/* Matches List */}
      <Card className="w-80 border-0 shadow-lg rounded-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-white">
            <MessageSquare className="w-5 h-5" />
            My Matches
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {matches.map((match) => (
              <button
                key={match.match_id}
                onClick={() => setSelectedMatch(match)}
                className={`w-full p-4 text-left transition-all duration-200 border-l-4 ${
                  selectedMatch?.match_id === match.match_id
                    ? 'border-emerald-600 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-md'
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold shadow-sm">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">
                      {match.other_user_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {match.other_user_bio}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="flex-1 flex flex-col border-0 shadow-lg rounded-lg overflow-hidden">
        {selectedMatch ? (
          <>
            {/* Chat Header */}
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-b-4 border-emerald-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{selectedMatch.other_user_name}</h3>
                    <p className="text-sm text-emerald-100">Match Score: {selectedMatch.match_score}%</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-white hover:bg-opacity-20 text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleReportUser} className="text-yellow-600">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Report User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBlockUser} className="text-red-600">
                      <Ban className="w-4 h-4 mr-2" />
                      Block User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <>
                  {console.log('Rendering messages:', messages)}
                  {messages.map((message) => {
                    const isCurrentUser = message.sender_id === currentUser.student_id;
                    console.log('Message:', message, 'isCurrentUser:', isCurrentUser);
                    return (
                      <div
                        key={message.message_id}
                        style={{
                          display: 'flex',
                          justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                          marginBottom: '16px'
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '70%',
                            background: isCurrentUser ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#f3f4f6',
                            color: isCurrentUser ? 'white' : '#111827',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word'
                          }}
                        >
                          <p style={{ margin: '0 0 8px 0', wordBreak: 'break-word' }}>{message.content}</p>
                          <p style={{
                            fontSize: '12px',
                            marginTop: '4px',
                            color: isCurrentUser ? '#bfdbfe' : '#6b7280'
                          }}>
                            {formatTimestamp(message.sent_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Message Input */}
            <div className="border-t-4 border-emerald-200 p-4 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex gap-3">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="border-2 border-emerald-300 focus:border-emerald-500 focus:ring-emerald-300 rounded-lg"
                />
                <Button 
                  onClick={handleSendMessage}
                  style={{
                    backgroundImage: 'linear-gradient(to right, rgb(16, 185, 129), rgb(20, 184, 166))',
                    color: 'white'
                  }}
                  className="font-semibold px-6 rounded-lg shadow-md transition-all duration-200"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 flex-col gap-4">
            <MessageSquare className="w-16 h-16 text-gray-300" />
            Select a match to start chatting
          </div>
        )}
      </Card>
    </div>
  );
}
