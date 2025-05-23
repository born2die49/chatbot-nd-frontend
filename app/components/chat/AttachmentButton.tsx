'use client';

import { useRef } from 'react';
import apiService from '@/app/services/apiService';

interface AttachmentButtonProps {
  onUploadSuccess?: (document: any) => void; // Callback with uploaded document data
  onUploadError?: (error: any) => void;
}

const AttachmentButton = ({ onUploadSuccess, onUploadError }: AttachmentButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('Files selected:', files);
      // Handle file upload logic here
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);

      try {
        const response = await apiService.post('/api/documents/', formData, true);
        if (onUploadSuccess) {
          onUploadSuccess(response);
        } 
      } catch (error) {
        console.error('File upload failed:', error);
        // useToast({ title: "Upload failed", description: error.message, variant: "destructive" });
        if (onUploadError) {
          onUploadError(error);
        }
      } finally {
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAttachmentClick}
        className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Attach file"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
        </svg>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
    </>
  );
};

export default AttachmentButton;