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
import { toast } from 'sonner@2.0.3';
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

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      loadMessages(selectedMatch.match_id);
    }
  }, [selectedMatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const response = await chatApi.getMessages(matchId);
      setMessages(response.data.messages || []);
    } catch (error: any) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch) return;

    try {
      const response = await chatApi.sendMessage(selectedMatch.match_id, newMessage);
      setMessages([...messages, response.data.message]);
      setNewMessage('');
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
    <div className="grid grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
      {/* Matches List */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-l-4 ${
                  selectedMatch?.match_id === match.match_id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={match.other_user_profile_picture}
                    alt={match.other_user_name}
                    fallbackIcon={<UserIcon className="w-4 h-4" />}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {match.other_user_name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
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
      <Card className="col-span-3 flex flex-col">
        {selectedMatch ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={selectedMatch.other_user_profile_picture}
                    alt={selectedMatch.other_user_name}
                    fallbackIcon={<UserIcon className="w-5 h-5" />}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{selectedMatch.other_user_name}</h3>
                    <p className="text-sm text-gray-500">Match Score: {selectedMatch.match_score}%</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
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
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => {
                  const isCurrentUser = message.sender_id === currentUser.student_id;
                  return (
                    <div
                      key={message.message_id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isCurrentUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTimestamp(message.sent_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a match to start chatting
          </div>
        )}
      </Card>
    </div>
  );
}
