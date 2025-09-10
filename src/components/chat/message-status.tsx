'use client';

import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'error';

interface MessageStatusIndicatorProps {
  status: MessageStatus;
  timestamp?: Date;
  className?: string;
}

export function MessageStatusIndicator({ 
  status, 
  timestamp, 
  className = '' 
}: MessageStatusIndicatorProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400 animate-pulse" />;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-sky-500" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'sending':
        return 'Sending...';
      case 'sent':
        return 'Sent';
      case 'delivered':
        return 'Delivered';
      case 'error':
        return 'Failed to send';
      default:
        return '';
    }
  };

  return (
    <div className={`flex items-center gap-1 text-xs opacity-60 ${className}`}>
      {getStatusIcon()}
      <span className="text-xs">
        {timestamp ? timestamp.toLocaleTimeString() : getStatusText()}
      </span>
    </div>
  );
}
