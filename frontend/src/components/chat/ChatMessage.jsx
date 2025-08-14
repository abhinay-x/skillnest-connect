import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

const ChatMessage = ({ message, isLastMessage }) => {
  const { user } = useAuth();
  const isCurrentUser = message.senderId === user?.uid;

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
  };

  const getMessageStatus = () => {
    if (!isCurrentUser) return null;
    
    if (message.readBy?.length > 0) {
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    }
    return <Check className="w-3 h-3 text-gray-400" />;
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isCurrentUser ? 'ml-12' : 'mr-12'}`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            isCurrentUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          <p className="text-sm break-words">{message.text}</p>
          
          {message.imageUrl && (
            <div className="mt-2">
              <img
                src={message.imageUrl}
                alt="Shared image"
                className="rounded-lg max-w-full h-auto"
                onClick={() => window.open(message.imageUrl, '_blank')}
              />
            </div>
          )}
          
          {message.location && (
            <div className="mt-2 p-2 bg-white/10 rounded-lg">
              <p className="text-xs font-medium mb-1">📍 Location</p>
              <p className="text-xs">{message.location.address}</p>
            </div>
          )}
          
          <div className="flex items-center justify-end mt-1 space-x-1">
            <span className={`text-xs ${
              isCurrentUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {formatMessageTime(message.createdAt)}
            </span>
            {getMessageStatus()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
