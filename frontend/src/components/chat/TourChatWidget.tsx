'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { chatApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { Tour } from '@/lib/api';

interface TourChatWidgetProps {
  tour: Tour;
  variant?: 'button' | 'icon';
}

export default function TourChatWidget({ tour, variant = 'button' }: TourChatWidgetProps) {
  const router = useRouter();
  const locale = useLocale();
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ id: string; content: string; sender: string; timestamp: string }[]>([]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    if (!isAuthenticated) {
      const fallbackResponse = {
        id: Date.now().toString(),
        content: `Please sign in to chat about "${tour.title}".`,
        sender: 'System',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackResponse]);
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'You',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Create or get room for this tour
      const room = await chatApi.createRoom({
        name: `Tour: ${tour.title}`,
        tourId: tour.id,
      });

      // Send the message
      const sentMessage = await chatApi.sendMessage(room.id, message);

      // Add bot response (simplified for now)
      const botResponse = {
        id: (Date.now() + 1).toString(),
        content: `Thanks for your interest in "${tour.title}"! Our team will get back to you shortly. In the meantime, you can check the tour details or make a booking.`,
        sender: 'Support',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      console.error('Failed to send message:', err);
      // Still show a helpful response even if API fails
      const fallbackResponse = {
        id: (Date.now() + 1).toString(),
        content: `Thanks for your interest in "${tour.title}"! Our team will get back to you shortly.`,
        sender: 'Support',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all"
        title="Chat about this tour"
      >
        <MessageCircle className="h-5 w-5 text-primary-700" />
      </button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Chat about this tour
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <Card className="border-0 shadow-none">
              <CardHeader className="bg-gradient-to-r from-primary-700 to-primary-800 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">{tour.title}</CardTitle>
                      <p className="text-xs text-primary-100">Tour Support Chat</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="h-8 w-8 text-primary-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Ask questions about this tour
                      </p>
                      <p className="text-xs text-gray-400">
                        Our team typically responds within minutes
                      </p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          msg.sender === 'You'
                            ? 'bg-primary-700 text-white rounded-br-md'
                            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === 'You' ? 'text-primary-200' : 'text-gray-400'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isLoading}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
