import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  Chip,
  alpha,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Stack,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  GetApp,
  PictureAsPdf,
  InsertDriveFile,
  Add,
} from '@mui/icons-material';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  createdAt?: string;
  file?: File;
  status?: 'uploading' | 'success' | 'error';
}

interface FileDropzoneProps {
  files: UploadedFile[];
  onFilesChange: (files: File[]) => void;
  onRemoveFile?: (fileId: string) => void;
  onDownloadFile?: (file: UploadedFile) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedFileTypes?: string[];
  loading?: boolean;
  disabled?: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  files,
  onFilesChange,
  onRemoveFile,
  onDownloadFile,
  maxFiles = 10,
  maxSize = 15 * 1024 * 1024,
  acceptedFileTypes = [
    'image/jpeg',
    'image/png', 
    'image/jpg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  loading = false,
  disabled = false,
}) => {
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      console.warn('Rejected files:', rejectedFiles);
    }
    
    if (acceptedFiles.length > 0) {
      onFilesChange(acceptedFiles);
    }
  }, [onFilesChange]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    maxFiles: maxFiles - files.length,
    disabled: disabled || loading,
    multiple: true,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: UploadedFile) => {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    const isWord = file.type === 'application/msword' || 
                   file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const isExcel = file.type === 'application/vnd.ms-excel' || 
                    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    if (isImage && file.url) {
      return (
        <Box
          component="img"
          src={file.url}
          alt={file.name}
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            objectFit: 'cover',
            border: `1px solid ${alpha('#F8A66E', 0.3)}`,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            WebkitUserDrag: 'none',
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div style="
                  width: 40px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: ${alpha('#F8A66E', 0.1)};
                  border-radius: 4px;
                  border: 1px solid ${alpha('#F8A66E', 0.3)};
                ">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="${alpha('#F8A66E', 0.7)}">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
              `;
            }
          }}
        />
      );
    }

    if (isPdf) {
      return <PictureAsPdf sx={{ color: '#F35C76', fontSize: 24 }} />;
    }

    if (isWord) {
      return (
        <Box
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#2B579A',
            borderRadius: 1,
            color: 'white',
            fontSize: '8px',
            fontWeight: 'bold',
          }}
        >
          DOC
        </Box>
      );
    }

    if (isExcel) {
      return (
        <Box
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#217346',
            borderRadius: 1,
            color: 'white',
            fontSize: '8px',
            fontWeight: 'bold',
          }}
        >
          XLS
        </Box>
      );
    }

    return <InsertDriveFile sx={{ color: '#F8A66E', fontSize: 24 }} />;
  };

  const getDropzoneColor = () => {
    if (isDragAccept) return '#4CAF50';
    if (isDragReject) return '#F35C76';
    if (isDragActive) return '#F8A66E';
    return '#E0E0E0';
  };

  const getDropzoneBackground = () => {
    if (isDragAccept) return alpha('#4CAF50', 0.02);
    if (isDragReject) return alpha('#F35C76', 0.02);
    if (isDragActive) return alpha('#F8A66E', 0.02);
    return '#FAFAFA';
  };

  return (
    <Box>
      {/* Minimal Dropzone */}
      <Paper
        {...getRootProps()}
        elevation={0}
        sx={{
          p: 2,
          textAlign: 'center',
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          border: `1px dashed ${getDropzoneColor()}`,
          backgroundColor: getDropzoneBackground(),
          borderRadius: 1,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: disabled || loading ? getDropzoneColor() : '#F8A66E',
            backgroundColor: disabled || loading ? getDropzoneBackground() : alpha('#F8A66E', 0.01),
          },
          '@media (max-width: 600px)': {
            p: 1.5,
          },
        }}
      >
        <input {...getInputProps()} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          {loading ? (
            <CircularProgress sx={{ color: '#F8A66E' }} size={20} />
          ) : (
            <Add sx={{ fontSize: 20, color: getDropzoneColor() }} />
          )}
          
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 400,
              color: '#666',
            }}
          >
            {loading ? 'กำลังอัปโหลด...' : 
             isDragActive ? 'วางไฟล์ที่นี่' : 
             'เลือกไฟล์หรือลากมาวาง'}
          </Typography>
        </Box>

        {files.length > 0 && (
          <Chip
            label={`${files.length}/${maxFiles}`}
            size="small"
            sx={{
              mt: 1,
              bgcolor: alpha('#F8A66E', 0.1),
              color: '#F8A66E',
              fontFamily: 'Prompt, sans-serif',
              fontSize: '0.75rem',
              height: 20,
            }}
          />
        )}
      </Paper>

      {/* File List - Minimal Design */}
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <List dense sx={{ p: 0 }}>
            {files.map((file) => {
              const isImage = file.type.startsWith('image/');
              const isPdf = file.type === 'application/pdf';
              const isWord = file.type === 'application/msword' || 
                           file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
              const isExcel = file.type === 'application/vnd.ms-excel' || 
                            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
              
              return (
                <ListItem 
                  key={file.id}
                  sx={{
                    bgcolor: '#FAFAFA',
                    borderRadius: 1,
                    mb: 1,
                    border: `1px solid #F0F0F0`,
                    py: 1,
                    px: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: 56,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <ListItemIcon sx={{ minWidth: 48, mr: 1 }}>
                      {getFileIcon(file)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'Prompt, sans-serif',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            color: '#333',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {file.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontFamily: 'Prompt, sans-serif',
                              color: '#999',
                              fontSize: '0.75rem',
                            }}
                          >
                            {formatFileSize(file.size)}
                          </Typography>
                          {isImage && (
                            <Chip
                              label="รูปภาพ"
                              size="small"
                              sx={{
                                height: 16,
                                fontSize: '0.65rem',
                                bgcolor: alpha('#4CAF50', 0.1),
                                color: '#4CAF50',
                                fontFamily: 'Prompt, sans-serif',
                              }}
                            />
                          )}
                          {isPdf && (
                            <Chip
                              label="PDF"
                              size="small"
                              sx={{
                                height: 16,
                                fontSize: '0.65rem',
                                bgcolor: alpha('#F35C76', 0.1),
                                color: '#F35C76',
                                fontFamily: 'Prompt, sans-serif',
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </Box>
                  
                  <Stack direction="row" spacing={0.5}>
                    {onDownloadFile && file.url && (
                      <IconButton
                        size="small"
                        onClick={() => onDownloadFile(file)}
                        sx={{ 
                          color: '#999',
                          '&:hover': { 
                            color: '#4CAF50',
                            bgcolor: alpha('#4CAF50', 0.1) 
                          }
                        }}
                      >
                        <GetApp fontSize="small" />
                      </IconButton>
                    )}
                    {onRemoveFile && (
                      <IconButton
                        size="small"
                        onClick={() => onRemoveFile(file.id)}
                        sx={{ 
                          color: '#999',
                          '&:hover': { 
                            color: '#F35C76',
                            bgcolor: alpha('#F35C76', 0.1) 
                          }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                </ListItem>
              );
            })}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default FileDropzone; 