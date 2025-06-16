'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Chat,
  AccountCircle,
} from '@mui/icons-material';
import { isLineUser, getLineDisplayInfo } from '@/utils/userUtils';

// Mock data for testing
const mockLineUser = {
  id: '1',
  email: 'line_U123456789@line.temp',
  name: 'ผู้ใช้ LINE Test',
  firstName: 'ผู้ใช้',
  lastName: 'LINE Test',
  phone: '0812345678',
  avatar: null,
};

const mockNormalUser = {
  id: '2',  
  email: 'test@example.com',
  name: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  phone: '0887654321',
  avatar: null,
};

export default function TestLineProfilePage() {
  const [currentUser, setCurrentUser] = useState<'line' | 'normal'>('line');
  
  const user = currentUser === 'line' ? mockLineUser : mockNormalUser;
  const isUserFromLine = isLineUser(user.email);
  const displayInfo = getLineDisplayInfo(user);

  const ProfileField = ({ 
    icon, 
    label, 
    value, 
    hidden = false 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    value: string; 
    hidden?: boolean;
  }) => {
    if (hidden) return null;
    
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 3, 
        borderBottom: '1px solid #F5F5F5',
      }}>
        <Box sx={{ 
          width: 40, 
          height: 40, 
          borderRadius: '50%', 
          bgcolor: '#E3F2FD', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mr: 3,
        }}>
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              fontFamily: 'Prompt, sans-serif',
              color: '#999',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              mb: 0.5,
            }}
          >
            {label}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: 'Prompt, sans-serif',
              color: '#1A1A1A',
              fontWeight: 500,
            }}
          >
            {value}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontFamily: 'Prompt, sans-serif',
          fontWeight: 700,
          color: '#1A1A1A',
          mb: 3,
          textAlign: 'center',
        }}
      >
        🧪 ทดสอบ Profile UI
      </Typography>

      {/* User Type Selector */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Prompt, sans-serif' }}>
          เลือกประเภทผู้ใช้:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant={currentUser === 'line' ? 'contained' : 'outlined'}
            onClick={() => setCurrentUser('line')}
            startIcon={<Chat />}
            sx={{
              bgcolor: currentUser === 'line' ? '#00C300' : 'transparent',
              color: currentUser === 'line' ? 'white' : '#00C300',
              borderColor: '#00C300',
              '&:hover': {
                bgcolor: currentUser === 'line' ? '#00A300' : '#00C30010',
              },
            }}
          >
            LINE User
          </Button>
          <Button
            variant={currentUser === 'normal' ? 'contained' : 'outlined'}
            onClick={() => setCurrentUser('normal')}
            startIcon={<AccountCircle />}
            sx={{
              bgcolor: currentUser === 'normal' ? '#F8A66E' : 'transparent',
              color: currentUser === 'normal' ? 'white' : '#F8A66E',
              borderColor: '#F8A66E',
              '&:hover': {
                bgcolor: currentUser === 'normal' ? '#E8956E' : '#F8A66E10',
              },
            }}
          >
            Normal User
          </Button>
        </Box>
      </Box>

      {/* User Info Summary */}
      <Card sx={{ mb: 3, bgcolor: isUserFromLine ? '#F0FFF0' : '#F8F9FA' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: isUserFromLine ? '#00C300' : '#F8A66E' }}>
              {isUserFromLine ? <Chat /> : <Person />}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: 'Prompt, sans-serif' }}>
                {user.name}
              </Typography>
              <Chip
                label={displayInfo.userType === 'line' ? 'LINE User' : 'Normal User'}
                color={displayInfo.userType === 'line' ? 'success' : 'primary'}
                size="small"
              />
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            <strong>isLineUser():</strong> {isUserFromLine ? 'true' : 'false'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>shouldHideEmail:</strong> {displayInfo.shouldHideEmail ? 'true' : 'false'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>displayName:</strong> {displayInfo.displayName}
          </Typography>
        </CardContent>
      </Card>

      {/* Profile Fields Display */}
      <Card sx={{ bgcolor: '#FFFFFF', borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              p: 3, 
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600,
              borderBottom: '1px solid #F5F5F5',
            }}
          >
            ข้อมูลโปรไฟล์
          </Typography>

          {/* Full Name */}
          <ProfileField
            icon={<Person sx={{ color: '#F8A66E', fontSize: 20 }} />}
            label="FULL NAME"
            value={`${user.firstName} ${user.lastName}`}
          />

          {/* Email - Hidden for LINE users */}
          <ProfileField
            icon={<Email sx={{ color: '#2196F3', fontSize: 20 }} />}
            label="EMAIL"
            value={user.email}
            hidden={isUserFromLine}
          />

          {/* Phone Number */}
          <ProfileField
            icon={<Phone sx={{ color: '#4CAF50', fontSize: 20 }} />}
            label="PHONE NUMBER"
            value={user.phone}
          />

          {/* Address */}
          <ProfileField
            icon={<LocationOn sx={{ color: '#FF9800', fontSize: 20 }} />}
            label="ADDRESS"
            value="123 ถนนทดสอบ แขวงทดสอบ เขตทดสอบ กรุงเทพมหานคร 10110"
          />
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card sx={{ mt: 3, bgcolor: '#F5F5F5' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Prompt, sans-serif' }}>
            🐛 Debug Info
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
            <strong>User Email:</strong> {user.email}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
            <strong>isLineUser(email):</strong> {isUserFromLine.toString()}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
            <strong>Email Field Display:</strong> {isUserFromLine ? 'HIDDEN' : 'VISIBLE'}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            <strong>Sidebar Display:</strong> {isUserFromLine ? 'ผู้ใช้ LINE' : user.email}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
} 