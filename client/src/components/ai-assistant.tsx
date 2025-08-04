
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { type AuthUser } from '@/lib/auth';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface AIAssistantProps {
  user: AuthUser;
}

export function AIAssistant({ user }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getRoleSpecificWelcome = () => {
    switch (user.role) {
      case 'donor':
        return `Hello ${user.name}! I'm your AI assistant for blood donation. I can help you schedule donations, check your donation history, view your assigned patients, and answer questions about the donation process. How can I help you today?`;
      case 'patient':
        return `Hello ${user.name}! I'm your AI assistant for transfusion management. I can help you schedule transfusions, view your upcoming appointments, check your health metrics, and connect you with your donor family. How can I help you today?`;
      case 'healthcare_provider':
        return `Hello ${user.name}! I'm your AI assistant for healthcare management. I can help you manage patient appointments, track blood inventory, coordinate between donors and patients, and generate reports for your facility. How can I help you today?`;
      default:
        return `Hello ${user.name}! I'm your AI assistant. How can I help you today?`;
    }
  };

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: '1',
      content: getRoleSpecificWelcome(),
      role: 'assistant',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [user.name, user.role]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          userId: user.id,
          userRole: user.role,
          userName: user.name,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Card className="h-[700px] flex flex-col shadow-xl border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-blue-100" />
            <span className="text-lg font-semibold">AI Assistant</span>
            <span className="text-blue-100 text-sm ml-auto">
              {user.role === 'donor' && '🩸 Donor'}
              {user.role === 'patient' && '🏥 Patient'}
              {user.role === 'healthcare_provider' && '👨‍⚕️ Provider'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4 p-6">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl shadow-md ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.role === 'assistant' && (
                        <Bot className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
                      )}
                      {message.role === 'user' && (
                        <User className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-100" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 p-4 rounded-2xl shadow-md border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Bot className="w-5 h-5 text-blue-600" />
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about blood donation, scheduling, or your records..."
              disabled={isLoading}
              className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
