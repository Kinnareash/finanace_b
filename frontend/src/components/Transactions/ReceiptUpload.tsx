import { useState, useRef } from 'react';
import { X, FileText, Loader, CheckCircle, IndianRupee, Calendar, Building2 } from 'lucide-react';
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
  const [analysisResult, setAnalysisResult] = useState<ReceiptUploadResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !token) return;

    const file = files[0];
    
    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    
    if (!isImage && !isPdf) {
      alert('Please upload an image file (JPG, PNG, etc.) or PDF file');
      return;
    }

    // Validate file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadReceipt(token, file);
      
      if (result.success) {
        setAnalysisResult(result);
        // Don't close modal yet, show results first
      } else {
        alert(result.message || 'Failed to process receipt. Please try again.');
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      
      // Show specific error message if available
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to process receipt. Please ensure the file contains readable text and try again.';
      
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUseResults = () => {
    if (analysisResult) {
      onReceiptProcessed(analysisResult);
      onClose();
      setAnalysisResult(null);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-white/10 rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {analysisResult ? 'Receipt Analysis Results' : 'Upload Receipt'}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 transition-colors duration-150"
            >
              <X className="h-5 w-5 text-white/70" />
            </button>
          </div>

          {analysisResult ? (
            <div className="space-y-4">
              <div className="flex items-center text-green-400 mb-4">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Receipt processed successfully!</span>
                {analysisResult.confidence && (
                  <span className="ml-2 text-xs text-white/50">
                    Confidence: {Math.round(analysisResult.confidence * 100)}%
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 text-white/70 mr-2" />
                    <div>
                      <p className="text-xs text-white/50">Merchant</p>
                      <p className="font-medium text-white">{analysisResult.merchant || 'Unknown'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <IndianRupee className="h-4 w-4 text-white/70 mr-2" />
                    <div>
                      <p className="text-xs text-white/50">Amount</p>
                      <p className="font-medium text-white">₹{analysisResult.amount?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-white/70 mr-2" />
                    <div>
                      <p className="text-xs text-white/50">Date</p>
                      <p className="font-medium text-white">
                        {analysisResult.date ? 
                          new Date(analysisResult.date).toLocaleDateString() : 
                          'Today'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-white/70 mr-2" />
                    <div>
                      <p className="text-xs text-white/50">Category</p>
                      <p className="font-medium text-white">{analysisResult.suggestedCategory || 'Other'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-white/50 mb-2">Extracted Text</p>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 max-h-32 overflow-y-auto backdrop-blur-sm">
                    <p className="text-xs text-white/70 whitespace-pre-wrap">
                      {analysisResult.extractedText || 'No text extracted'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2 px-4 border border-white/20 rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 backdrop-blur-sm"
                >
                  Try Another
                </button>
                <button
                  type="button"
                  onClick={handleUseResults}
                  className="py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 shadow-lg"
                >
                  Use These Results
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-500/10' 
                    : 'border-white/20 hover:border-white/30'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader className="h-12 w-12 text-blue-400 animate-spin" />
                    <p className="mt-4 text-sm text-white/70">
                      Analyzing receipt with AI...
                    </p>
                  </div>
                ) : (
                  <>
                    <FileText className="mx-auto h-12 w-12 text-white/40" />
                    <div className="mt-4">
                      <p className="text-sm text-white/70">
                        Drag and drop your receipt here, or{' '}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          browse files
                        </button>
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        Supports images (PNG, JPG) and PDF files. AI-powered analysis included!
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
                  className="py-2 px-4 border border-white/20 rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 transition-all duration-200 backdrop-blur-sm"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptUpload;