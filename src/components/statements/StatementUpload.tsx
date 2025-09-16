import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, X } from "lucide-react";

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


  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Statement</CardTitle>
        <CardDescription>
          Upload your electricity bill statement (PDF or CSV)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed  p-8 text-center transition-colors
            ${isDragActive || dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <div className="mt-2">
            <p className="text-xs ">
              {isDragActive ? 'Drop your file here' : 'Drop your file here or click to browse'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supported formats: {acceptedFileTypes.join(', ')}
            </p>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((file) => (
              <Alert key={file.id}>
                <FileText className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{file.file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFileRemove(file.id)}
                    disabled={file.status === 'uploading'}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
        
        {isUploading && (
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 border-2 border-primary border-t-transparent  animate-spin" />
              <span className="text-xs text-muted-foreground">
                Processing files...
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
