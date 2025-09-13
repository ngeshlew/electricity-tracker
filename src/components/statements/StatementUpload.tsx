import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-simple';
import { Button } from '@/components/ui/button-simple';
import { 
  DocumentArrowUpIcon, 
  DocumentTextIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

interface StatementUploadProps {
  onFileUpload: (files: File[]) => Promise<void>;
  onFileRemove: (fileId: string) => void;
  uploadedFiles: UploadedFile[];
  isUploading: boolean;
  maxFiles?: number;
  acceptedFileTypes?: string[];
}

export const StatementUpload: React.FC<StatementUploadProps> = ({
  onFileUpload,
  onFileRemove,
  uploadedFiles,
  isUploading,
  maxFiles = 5,
  acceptedFileTypes = ['.pdf', '.csv', '.xlsx']
}) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles,
    disabled: isUploading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <DocumentTextIcon className="h-8 w-8 text-red-500" />;
      case 'csv':
        return <DocumentTextIcon className="h-8 w-8 text-green-500" />;
      case 'xlsx':
        return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
      default:
        return <DocumentTextIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'uploading':
        return <div className="h-5 w-5 border-2 border-electric-purple border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="lewis-card lewis-shadow-glow lewis-animation-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold lewis-text-gradient">
          Upload Energy Statements
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload your energy bills in PDF, CSV, or Excel format for automatic processing
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
            ${isDragActive || dragActive 
              ? 'border-electric-purple bg-electric-purple/10' 
              : 'border-muted-foreground/30 hover:border-electric-purple/50 hover:bg-electric-purple/5'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-electric-purple/20 rounded-full flex items-center justify-center">
              <DocumentArrowUpIcon className="h-8 w-8 text-electric-purple" />
            </div>
            
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>Supported formats: {acceptedFileTypes.join(', ')}</p>
              <p>Maximum {maxFiles} files, up to 10MB each</p>
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.file.size)}
                      </p>
                      {file.error && (
                        <p className="text-xs text-red-500 mt-1">
                          {file.error}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(file.status)}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onFileRemove(file.id)}
                      className="h-8 w-8 lewis-card-hover"
                      disabled={file.status === 'uploading'}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 border-2 border-electric-purple border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">
                Processing files...
              </span>
            </div>
            <div className="w-full bg-muted/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-electric-purple to-electric-pink h-2 rounded-full animate-pulse" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
