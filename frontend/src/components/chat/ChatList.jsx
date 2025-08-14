import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFirestore } from '../../hooks/useFirestore';
import socketService from '../../services/socket/socketService';
import { MessageCircle, Clock, Check, CheckCheck } from 'lucide-react';

const ChatList = ({ onChatSelect, selectedChatId }) => {
  const { user } = useAuth();
  const { data: chats, loading } = useFirestore('chats', {
    where: [
      ['participants', 'array-contains', user?.uid],
      ['status', '==', 'active']
    ],
    orderBy: ['lastMessageAt', 'desc']
  });

  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    if (!user) return;

    // Listen for online users
    socketService.on('user_online', (userId) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });

    socketService.on('user_offline', (userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    // Listen for typing indicators
    socketService.on('user_typing', ({ chatId, userId, isTyping }) => {
      setTypingUsers(prev => ({
        ...prev,
        [chatId]: isTyping ? userId : null
      }));
    });

    return () => {
      socketService.off('user_online');
      socketService.off('user_offline');
      socketService.off('user_typing');
    };
  }, [user]);

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p !== user?.uid);
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const getMessageStatus = (chat) => {
    if (!chat.lastMessage) return null;
    
    const lastMessage = chat.lastMessage;
    if (lastMessage.senderId !== user?.uid) return null;
    
    if (lastMessage.readBy?.length === chat.participants.length - 1) {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    }
    return <Check className="w-4 h-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!chats?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <MessageCircle className="w-12 h-12 mb-4 text-gray-300" />
        <p className="text-center">No conversations yet</p>
        <p className="text-sm text-gray-400 mt-2">Start a conversation with a service provider</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {chats.map((chat) => {
          const otherParticipant = getOtherParticipant(chat);
          const isOnline = onlineUsers.has(otherParticipant);
          const isTyping = typingUsers[chat.id] === otherParticipant;
          const isSelected = selectedChatId === chat.id;

          return (
            <div
              key={chat.id}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => onChatSelect(chat)}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {chat.otherUser?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chat.otherUser?.name || 'User'}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatLastMessageTime(chat.lastMessageAt)}
                    </span>
                  </div>
                  
                  <div className="mt-1 flex items-center space-x-1">
                    {isTyping ? (
                      <span className="text-sm text-blue-600 dark:text-blue-400 italic">
                        typing...
                      </span>
                    ) : (
                      <>
                        {getMessageStatus(chat)}
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {chat.lastMessage?.text || 'No messages yet'}
                        </p>
                      </>
                    )}
                  </div>
                  
                  {chat.unreadCount > 0 && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {chat.unreadCount} new
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
