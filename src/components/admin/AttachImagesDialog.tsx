'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface AttachImagesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AttachImagesDialog({ isOpen, onClose, onSuccess }: AttachImagesDialogProps) {
  const [masterFolderLink, setMasterFolderLink] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const [attachResults, setAttachResults] = useState<{
    total: number;
    matched: number;
    processed: number;
    warnings: string[];
    results: Array<{ vendor: string; folder: string; status: string }>;
  } | null>(null);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isAttaching) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isAttaching, onClose]);

  const handleClose = () => {
    if (!isAttaching) {
      onClose();
    }
  };

  const handleAttachImages = async () => {
    if (!masterFolderLink.trim()) {
      toast.error('Please enter a folder link');
      return;
    }

    setIsAttaching(true);
    setAttachResults(null);

    try {
      const response = await fetch('/api/admin/vendors/attach-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderLink: masterFolderLink.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to attach images');
      }

      setAttachResults(result);
      toast.success(`Matched ${result.matched} vendors and processed ${result.processed} successfully`);
      
      if (result.warnings.length > 0) {
        toast.warning(`${result.warnings.length} warnings. Check details below.`);
      }

      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to attach images');
    } finally {
      setIsAttaching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop - clickable to close */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={handleClose}
        style={{ cursor: isAttaching ? 'not-allowed' : 'pointer' }}
      />
      {/* Dialog content - stops propagation */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto z-10"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Attach Images from Master Folder</h2>
            <p className="text-sm text-gray-600 mt-1">
              Paste your master Google Drive folder link to automatically attach images/videos to vendors
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isAttaching}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer z-10"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">How It Works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Paste your master Google Drive folder link below</li>
              <li>• The folder should contain subfolders named after your vendors</li>
              <li>• System will automatically match vendor names to folder names</li>
              <li>• First image in each folder = Profile Photo</li>
              <li>• Remaining images = Gallery (up to 10 images)</li>
              <li>• Videos will also be detected and stored</li>
            </ul>
          </div>

          {/* Folder Link Input */}
          <div>
            <label htmlFor="masterFolderLink" className="block text-sm font-medium text-gray-700 mb-2">
              Master Google Drive Folder Link
            </label>
            <input
              id="masterFolderLink"
              type="text"
              value={masterFolderLink}
              onChange={(e) => setMasterFolderLink(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/YOUR_FOLDER_ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              disabled={isAttaching}
            />
            <p className="mt-2 text-xs text-gray-500">
              This folder should contain subfolders named after your vendors (e.g., "Traiteur El Amane", "Dar Makhtara")
            </p>
          </div>

          {/* Attach Button */}
          <button
            onClick={handleAttachImages}
            disabled={isAttaching || !masterFolderLink.trim()}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAttaching ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Attaching Images...
              </>
            ) : (
              <>
                <ImageIcon size={20} />
                Attach Images from Folder
              </>
            )}
          </button>

          {/* Results */}
          {attachResults && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Attachment Results</h4>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{attachResults.matched}</div>
                  <div className="text-sm text-gray-600">Matched</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{attachResults.processed}</div>
                  <div className="text-sm text-gray-600">Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{attachResults.total}</div>
                  <div className="text-sm text-gray-600">Total Vendors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{(attachResults as any).foldersFound ?? 0}</div>
                  <div className="text-sm text-gray-600">Folders Found</div>
                </div>
              </div>
              {attachResults.matched === 0 && attachResults.total > 0 && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <strong>No matches found!</strong> Found {attachResults.total} vendors and {(attachResults as any).foldersFound ?? 0} folders, but no matches. 
                  Make sure folder names in Google Drive match vendor business names exactly (or closely).
                </div>
              )}

              {attachResults.warnings.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-yellow-700 mb-2">Warnings:</h5>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {attachResults.warnings.slice(0, 10).map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                      {attachResults.warnings.length > 10 && (
                        <li className="text-xs text-yellow-600">... and {attachResults.warnings.length - 10} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isAttaching}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

