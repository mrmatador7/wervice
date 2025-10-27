'use client';

import { Sparkles, Copy, RefreshCw } from 'lucide-react';
import VendorCard from './VendorCard';

interface MessageBubbleProps {
  type: 'user' | 'ai';
  content: string;
  vendors?: any[];
  onCopy?: () => void;
  onRegenerate?: () => void;
}

export default function MessageBubble({ type, content, vendors, onCopy, onRegenerate }: MessageBubbleProps) {
  if (type === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%]">
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <p className="text-gray-900 text-sm">{content}</p>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            {onCopy && (
              <button
                onClick={onCopy}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0B0F0A] flex items-center justify-center p-1">
        <img 
          src="/Wervice AI.svg" 
          alt="Wervice AI" 
          className="w-full h-full"
        />
      </div>

      {/* Message Content */}
      <div className="flex-1 max-w-[80%]">
        <div className="bg-[#EBF8EE] rounded-2xl px-4 py-3">
          <p className="text-gray-900 text-sm leading-relaxed">{content}</p>
        </div>

        {/* Vendor Cards */}
        {vendors && vendors.length > 0 && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          {onCopy && (
            <button
              onClick={onCopy}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          )}
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Regenerate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

