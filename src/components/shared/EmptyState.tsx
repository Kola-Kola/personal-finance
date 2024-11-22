import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
      <div className="text-center">
        <div data-testid="empty-state-icon">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        </div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}