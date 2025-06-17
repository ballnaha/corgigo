'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Stack,
  Alert,
  Tab,
  Tabs,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Settings,
  Notifications,
  Security,
  Payment,
  LocalShipping,
  StoreMallDirectory,
  Save,
  Refresh,
  Edit,
} from '@mui/icons-material';

const vristoTheme = {
  primary: '#4361ee',
  secondary: '#f39c12',
  success: '#1abc9c',
  danger: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
  light: '#f8f9fa',
  dark: '#2c3e50',
  background: {
    main: '#f8fafc',
    paper: '#ffffff',
    sidebar: '#ffffff',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
  },
  shadow: {
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    elevated: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  font: {
    family: '"Prompt", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'CorgiGo',
    siteDescription: 'แพลตฟอร์มสั่งอาหารออนไลน์',
    maintenanceMode: false,
    allowRegistration: true,
    
    // Delivery Settings
    defaultDeliveryFee: 25,
    freeDeliveryThreshold: 300,
    maxDeliveryRadius: 10,
    estimatedDeliveryTime: 30,
    
    // Commission Settings
    restaurantCommission: 15,
    riderCommission: 10,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Payment Settings
    allowCashPayment: true,
    allowCreditCard: true,
    allowBankTransfer: true,
    
    // Security Settings
    passwordMinLength: 8,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save to API
    console.log('Saving settings:', settings);
    // Show success message
  };

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        การตั้งค่าระบบ
      </Typography>

      <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
            <Tab 
              icon={<Settings />} 
              label="ทั่วไป" 
              id="settings-tab-0"
              aria-controls="settings-tabpanel-0"
            />
            <Tab 
              icon={<LocalShipping />} 
              label="การจัดส่ง" 
              id="settings-tab-1"
              aria-controls="settings-tabpanel-1"
            />
            <Tab 
              icon={<Payment />} 
              label="การชำระเงิน" 
              id="settings-tab-2"
              aria-controls="settings-tabpanel-2"
            />
            <Tab 
              icon={<Notifications />} 
              label="การแจ้งเตือน" 
              id="settings-tab-3"
              aria-controls="settings-tabpanel-3"
            />
            <Tab 
              icon={<Security />} 
              label="ความปลอดภัย" 
              id="settings-tab-4"
              aria-controls="settings-tabpanel-4"
            />
          </Tabs>
        </Box>

        <CardContent>
          {/* General Settings */}
          <TabPanel value={tabValue} index={0}>
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight="600">การตั้งค่าทั่วไป</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ชื่อเว็บไซต์"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="คำอธิบายเว็บไซต์"
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  />
                </Grid>
              </Grid>

              <Divider />

              <Box>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  การจัดการระบบ
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                      />
                    }
                    label="โหมดปิดปรับปรุงระบบ"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.allowRegistration}
                        onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                      />
                    }
                    label="อนุญาตให้สมัครสมาชิกใหม่"
                  />
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  ค่าคอมมิชชั่น
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="คอมมิชชั่นร้านอาหาร (%)"
                      type="number"
                      value={settings.restaurantCommission}
                      onChange={(e) => handleSettingChange('restaurantCommission', parseInt(e.target.value))}
                      InputProps={{ inputProps: { min: 0, max: 50 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="คอมมิชชั่นไรเดอร์ (%)"
                      type="number"
                      value={settings.riderCommission}
                      onChange={(e) => handleSettingChange('riderCommission', parseInt(e.target.value))}
                      InputProps={{ inputProps: { min: 0, max: 50 } }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </TabPanel>

          {/* Delivery Settings */}
          <TabPanel value={tabValue} index={1}>
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight="600">การตั้งค่าการจัดส่ง</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ค่าส่งมาตรฐาน (บาท)"
                    type="number"
                    value={settings.defaultDeliveryFee}
                    onChange={(e) => handleSettingChange('defaultDeliveryFee', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ยอดสั่งซื้อขั้นต่ำสำหรับฟรีค่าส่ง (บาท)"
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) => handleSettingChange('freeDeliveryThreshold', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="รัศมีการจัดส่งสูงสุด (กิโลเมตร)"
                    type="number"
                    value={settings.maxDeliveryRadius}
                    onChange={(e) => handleSettingChange('maxDeliveryRadius', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 1, max: 50 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="เวลาจัดส่งโดยประมาณ (นาที)"
                    type="number"
                    value={settings.estimatedDeliveryTime}
                    onChange={(e) => handleSettingChange('estimatedDeliveryTime', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 15, max: 120 } }}
                  />
                </Grid>
              </Grid>

              <Alert severity="info">
                การเปลี่ยนแปลงการตั้งค่าการจัดส่งจะมีผลกับออเดอร์ใหม่เท่านั้น
              </Alert>
            </Stack>
          </TabPanel>

          {/* Payment Settings */}
          <TabPanel value={tabValue} index={2}>
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight="600">การตั้งค่าการชำระเงิน</Typography>
              
              <Box>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  ช่องทางการชำระเงิน
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.allowCashPayment}
                        onChange={(e) => handleSettingChange('allowCashPayment', e.target.checked)}
                      />
                    }
                    label="เงินสดปลายทาง"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.allowCreditCard}
                        onChange={(e) => handleSettingChange('allowCreditCard', e.target.checked)}
                      />
                    }
                    label="บัตรเครดิต/เดบิต"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.allowBankTransfer}
                        onChange={(e) => handleSettingChange('allowBankTransfer', e.target.checked)}
                      />
                    }
                    label="โอนเงินผ่านธนาคาร"
                  />
                </Stack>
              </Box>

              <Alert severity="warning">
                ต้องเปิดใช้งานช่องทางการชำระเงินอย่างน้อย 1 ช่องทาง
              </Alert>
            </Stack>
          </TabPanel>

          {/* Notification Settings */}
          <TabPanel value={tabValue} index={3}>
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight="600">การตั้งค่าการแจ้งเตือน</Typography>
              
              <Box>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  ประเภทการแจ้งเตือน
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label="การแจ้งเตือนทางอีเมล"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.smsNotifications}
                        onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                      />
                    }
                    label="การแจ้งเตือนทาง SMS"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                      />
                    }
                    label="การแจ้งเตือนแบบ Push Notification"
                  />
                </Stack>
              </Box>
            </Stack>
          </TabPanel>

          {/* Security Settings */}
          <TabPanel value={tabValue} index={4}>
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight="600">การตั้งค่าความปลอดภัย</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="ความยาวรหัสผ่านขั้นต่ำ"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 6, max: 20 } }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="เวลาหมดอายุของเซสชั่น (นาที)"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 15, max: 1440 } }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="จำนวนครั้งสูงสุดที่เข้าสู่ระบบผิด"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 3, max: 10 } }}
                  />
                </Grid>
              </Grid>

              <Alert severity="info">
                การเปลี่ยนแปลงการตั้งค่าความปลอดภัยจะมีผลทันทีกับผู้ใช้ทั้งหมด
              </Alert>
            </Stack>
          </TabPanel>

          {/* Save Button */}
          <Box sx={{ pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'right' }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              sx={{ mr: 2 }}
            >
              รีเซ็ต
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveSettings}
              sx={{ bgcolor: vristoTheme.primary }}
            >
              บันทึกการตั้งค่า
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 