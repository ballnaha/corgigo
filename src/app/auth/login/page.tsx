'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NoSSR from '@/components/NoSSR';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Divider,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  margin: '0 auto',
  marginTop: theme.spacing(8),
  padding: theme.spacing(2),
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
}));

const roles = [
  { value: 'CUSTOMER', label: 'ลูกค้า' },
  { value: 'RIDER', label: 'ไรเดอร์' },
  { value: 'RESTAURANT', label: 'เจ้าของร้าน' },
  { value: 'ADMIN', label: 'ผู้ดูแลระบบ' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        role,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Get session to check role and redirect accordingly
        const session = await getSession();
        if (session?.user) {
          switch (session.user.role) {
            case 'CUSTOMER':
              router.push('/');
              break;
            case 'RIDER':
              router.push('/rider/dashboard');
              break;
            case 'RESTAURANT':
              router.push('/restaurant/dashboard');
              break;
            case 'ADMIN':
              router.push('/admin/dashboard');
              break;
            default:
              router.push('/');
          }
        }
      }
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <NoSSR>
      <Container maxWidth="sm">
      <StyledCard>
        <CardContent>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              CorgiGo
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              เข้าสู่ระบบ
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="อีเมล"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="รหัสผ่าน"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>ประเภทผู้ใช้</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="ประเภทผู้ใช้"
              >
                {roles.map((roleOption) => (
                  <MenuItem key={roleOption.value} value={roleOption.value}>
                    {roleOption.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'เข้าสู่ระบบ'
              )}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                หรือ
              </Typography>
            </Divider>

            <Box textAlign="center">
              <Link href="/auth/register" underline="none">
                <Button variant="outlined" fullWidth sx={{ textTransform: 'none' }}>
                  สมัครสมาชิก
                </Button>
              </Link>
            </Box>

            <Box textAlign="center" mt={2}>
              <Link href="/auth/forgot-password" variant="body2">
                ลืมรหัสผ่าน?
              </Link>
            </Box>
          </Box>
        </CardContent>
      </StyledCard>
    </Container>
    </NoSSR>
  );
} 