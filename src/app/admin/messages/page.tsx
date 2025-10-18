'use client';

import { useState } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { MessageSquare, Send, Flag, Archive } from 'lucide-react';

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  isFlagged: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    from: 'Fatima Alaoui',
    subject: 'Question about venue availability',
    preview: 'Hi, I wanted to check if Palais des Congrès is available for June 15th...',
    timestamp: '2 hours ago',
    isRead: false,
    isFlagged: true,
  },
  {
    id: '2',
    from: 'Karim Bennani',
    subject: 'Catering menu inquiry',
    preview: 'Could you provide more details about the traditional Moroccan menu options?',
    timestamp: '4 hours ago',
    isRead: true,
    isFlagged: false,
  },
  {
    id: '3',
    from: 'Sofia Tazi',
    subject: 'Photography package questions',
    preview: 'I\'m interested in your premium photography package. Can we discuss the inclusions?',
    timestamp: '1 day ago',
    isRead: false,
    isFlagged: false,
  },
];

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messages, setMessages] = useState(mockMessages);
  const [filter, setFilter] = useState<'all' | 'unread' | 'flagged'>('all');

  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.isRead;
    if (filter === 'flagged') return message.isFlagged;
    return true;
  });

  const toggleFlag = (messageId: string) => {
    setMessages(messages.map(msg =>
      msg.id === messageId ? { ...msg, isFlagged: !msg.isFlagged } : msg
    ));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        subtitle="Customer inquiries and support conversations"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2">
          <div className="bg-wv.card rounded-xl shadow-card">
            {/* Filters */}
            <div className="p-4 border-b border-wv.line">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    filter === 'all'
                      ? 'bg-wv.lime text-wv.black'
                      : 'text-wv.sub hover:bg-wv.line'
                  }`}
                >
                  All ({messages.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    filter === 'unread'
                      ? 'bg-wv.lime text-wv.black'
                      : 'text-wv.sub hover:bg-wv.line'
                  }`}
                >
                  Unread ({messages.filter(m => !m.isRead).length})
                </button>
                <button
                  onClick={() => setFilter('flagged')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    filter === 'flagged'
                      ? 'bg-wv.lime text-wv.black'
                      : 'text-wv.sub hover:bg-wv.line'
                  }`}
                >
                  Flagged ({messages.filter(m => m.isFlagged).length})
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="divide-y divide-wv.line">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 cursor-pointer hover:bg-wv.line transition-colors ${
                    !message.isRead ? 'bg-blue-50/50' : ''
                  } ${selectedMessage?.id === message.id ? 'bg-wv.line' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium truncate ${
                          !message.isRead ? 'text-wv.text' : 'text-wv.sub'
                        }`}>
                          {message.from}
                        </h4>
                        {message.isFlagged && (
                          <Flag className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      <h5 className="font-medium text-wv.text mb-1">{message.subject}</h5>
                      <p className="text-sm text-wv.sub truncate">{message.preview}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs text-wv.sub whitespace-nowrap">
                        {message.timestamp}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFlag(message.id);
                        }}
                        className="p-1 hover:bg-wv.line rounded"
                        aria-label="Flag message"
                      >
                        <Flag className={`w-4 h-4 ${message.isFlagged ? 'text-yellow-500 fill-yellow-500' : 'text-wv.sub'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-1">
          {selectedMessage ? (
            <div className="bg-wv.card rounded-xl shadow-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-wv.text">{selectedMessage.from}</h3>
                  <p className="text-sm text-wv.sub">{selectedMessage.timestamp}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-wv.line rounded-lg">
                    <Archive size={16} />
                  </button>
                  <button className="p-2 hover:bg-wv.line rounded-lg">
                    <Flag size={16} />
                  </button>
                </div>
              </div>

              <h4 className="font-medium text-wv.text mb-4">{selectedMessage.subject}</h4>
              <p className="text-wv.sub mb-6">{selectedMessage.preview}</p>

              <div className="space-y-4">
                <textarea
                  placeholder="Type your reply..."
                  className="w-full p-3 bg-wv.bg border border-wv.line rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-wv.limeDark"
                  rows={4}
                />
                <button className="flex items-center gap-2 px-4 py-2 bg-wv.lime text-wv.black rounded-lg font-medium hover:bg-wv.limeDark">
                  <Send size={16} />
                  Send Reply
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-wv.card rounded-xl shadow-card p-6 flex items-center justify-center h-96">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-wv.sub mx-auto mb-4" />
                <p className="text-wv.sub">Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
