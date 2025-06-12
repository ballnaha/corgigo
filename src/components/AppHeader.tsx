'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';

export default function AppHeader() {
  return (
    <AppBar position="fixed" sx={{ bgcolor: 'primary.main', color: 'secondary.main' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'secondary.main' }}>
          🐕 CorgiGo
        </Typography>
        <Button sx={{ color: 'secondary.main', mr: 1 }}>
          เข้าสู่ระบบ
        </Button>
        <Button variant="outlined" sx={{ color: 'secondary.main', borderColor: 'secondary.main' }}>
          สมัครสมาชิก
        </Button>
      </Toolbar>
    </AppBar>
  );
} 