'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface SnackbarProps {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Snackbar: React.FC<SnackbarProps> = ({ 
  open, 
  message, 
  type, 
  onClose, 
  duration = 3000 
}) => {
  const [show, setShow] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(true);
      setTimeout(() => setAnimate(true), 10); // Small delay for animation
      
      // Auto hide after duration
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      setTimeout(() => setShow(false), 300); // Wait for animation
    }
  }, [open, duration]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      setShow(false);
      onClose();
    }, 300);
  };

  if (!show) return null;

  // Get colors based on type
  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: '#10B981',
          icon: '✓',
          border: '#059669'
        };
      case 'error':
        return {
          bg: '#EF4444',
          icon: '✕',
          border: '#DC2626'
        };
      case 'info':
        return {
          bg: '#3B82F6',
          icon: 'ℹ',
          border: '#2563EB'
        };
      default:
        return {
          bg: '#6B7280',
          icon: '•',
          border: '#4B5563'
        };
    }
  };

  const colors = getColors();

  const snackbarContent = (
    <div
      style={{
        position: 'fixed',
        top: '50px',
        left: '0px',
        right: '0px',
        zIndex: 999999,
        padding: '16px',
        paddingTop: `max(16px, env(safe-area-inset-top, 0px))`, // รองรับ safe area
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div
        onClick={handleClose}
        style={{
          backgroundColor: colors.bg,
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          fontFamily: 'Prompt, sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '280px',
          maxWidth: '90vw',
          cursor: 'pointer',
          pointerEvents: 'auto',
          border: `2px solid ${colors.border}`,
          transform: animate ? 'translateY(0px)' : 'translateY(-100px)',
          opacity: animate ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <span
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            minWidth: '20px',
            textAlign: 'center',
          }}
        >
          {colors.icon}
        </span>
        <span style={{ flex: 1 }}>{message}</span>
        <span
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            opacity: 0.7,
            marginLeft: '8px',
          }}
        >
          ×
        </span>
      </div>
    </div>
  );

  // ใช้ Portal เพื่อ render ที่ body โดยตรง
  if (typeof window !== 'undefined') {
    return createPortal(snackbarContent, document.body);
  }

  return null;
};

export default Snackbar; 