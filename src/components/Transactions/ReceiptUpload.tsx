import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadReceipt } from '../../services/transactionService';
import { ReceiptUploadResponse } from '../../types';

interface ReceiptUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onReceiptProcessed: (data: ReceiptUploadResponse) => void;
}

const ReceiptUpload: React.FC<ReceiptUploadProps> = ({ isOpen, onClose, onReceiptProcessed }) => {
  const { token } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !token) return;

    const file = files[0];
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Please upload an image or PDF file');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadReceipt(token, file);
      onReceiptProcessed(result);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to process receipt. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Upload Receipt
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader className="h-12 w-12 text-blue-600 animate-spin" />
                <p className="mt-4 text-sm text-gray-600">Processing receipt...</p>
              </div>
            ) : (
              <>
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Drag and drop your receipt here, or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      browse files
                    </button>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports images (PNG, JPG) and PDF files
                  </p>
                </div>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptUpload;