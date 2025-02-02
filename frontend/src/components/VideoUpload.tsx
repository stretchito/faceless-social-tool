import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from './ui/button';

const VideoUpload = () => {
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const validateFiles = (files: FileList) => {
    const MAX_FILE_SIZE = 25 * 1024 * 1024;
    const SUPPORTED_FORMATS = ['video/mp4', 'video/webm', 'video/avi', 'video/mov'];
    
    const validFiles = Array.from(files).filter(file => 
      file.size <= MAX_FILE_SIZE && SUPPORTED_FORMATS.includes(file.type)
    );

    if (validFiles.length < files.length) {
      setError('Some files were skipped. Files must be under 25MB and in MP4, MOV, AVI, or WEBM format.');
    } else {
      setError('');
    }

    return validFiles;
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('videos', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError('Failed to upload files. Please try again.');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = validateFiles(e.dataTransfer.files);
    if (files.length > 0) {
      try {
        await uploadFiles(files);
      } catch (err) {
        console.error('Upload error:', err);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = validateFiles(e.target.files);
      if (files.length > 0) {
        try {
          await uploadFiles(files);
        } catch (err) {
          console.error('Upload error:', err);
        }
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragging ? 'bg-gray-50 border-blue-500' : 'hover:bg-gray-50'}
          ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => !isUploading && document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".mp4,.mov,.avi,.webm"
          multiple
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Uploading...</p>
          </div>
        ) : (
          <div>
            <p className="mb-2 text-lg">Drag and drop video files here, or click to select</p>
            <p className="text-sm text-gray-500">
              Maximum file size: 25MB<br/>
              Supported formats: MP4, MOV, AVI, WEBM
            </p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default VideoUpload;