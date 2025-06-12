'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import NoSSR from '@/components/NoSSR';
import { Box, Typography, Button, Alert, Container, Card, CardContent } from '@mui/material';

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [apiTest, setApiTest] = useState('');
  const [authTest, setAuthTest] = useState('');

  const testHealthAPI = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setApiTest(`✅ API Works: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setApiTest(`❌ API Error: ${error}`);
    }
  };

  const testAuthAPI = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      setAuthTest(`✅ Auth API Works: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setAuthTest(`❌ Auth API Error: ${error}`);
    }
  };

  useEffect(() => {
    testHealthAPI();
    testAuthAPI();
  }, []);

  return (
    <NoSSR>
      <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          🔍 Debug NextAuth
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Session Status
            </Typography>
            <Typography>Status: {status}</Typography>
            <Typography>User: {session?.user?.email || 'Not signed in'}</Typography>
            <Typography>Role: {session?.user?.role || 'N/A'}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🌐 API Tests
            </Typography>
            <Box mb={2}>
              <Button onClick={testHealthAPI} variant="outlined" sx={{ mr: 2 }}>
                Test Health API
              </Button>
              <Button onClick={testAuthAPI} variant="outlined">
                Test Auth API
              </Button>
            </Box>
            
            {apiTest && (
              <Alert severity={apiTest.includes('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>
                <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>{apiTest}</pre>
              </Alert>
            )}

            {authTest && (
              <Alert severity={authTest.includes('✅') ? 'success' : 'error'}>
                <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>{authTest}</pre>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ⚙️ Environment Check
            </Typography>
            <Typography>Next.js Version: {process.env.NEXT_PUBLIC_VERCEL_ENV || 'development'}</Typography>
            <Typography>Base URL: {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
    </NoSSR>
  );
} 