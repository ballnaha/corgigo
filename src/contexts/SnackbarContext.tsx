'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Snackbar from '@/components/Snackbar';

interface SnackbarState {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface SnackbarContextType {
  showSnackbar: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    type: 'success'
  });

  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({
      open: true,
      message,
      type
    });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={hideSnackbar}
      />
    </SnackbarContext.Provider>
  );
}; 