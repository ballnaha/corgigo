'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Tab,
  Tabs,
  Divider,
  Alert,
  Stack,
  TimePicker,
  Chip,
  IconButton,
  Avatar,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Settings,
  Restaurant,
  Schedule,
  Notifications,
  PhotoCamera,
  Save,
  Edit,
  Add,
  Delete,
  LocationOn,
  Phone,
  Email,
  Public,
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
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock data
const restaurantInfo = {
  name: 'ร้านส้มตำป้าแดง',
  description: 'ร้านอาหารอีสานแท้ๆ รสชาติต้นตำรับ',
  address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตวัฒนา กรุงเทพฯ 10110',
  phone: '089-123-4567',
  email: 'contact@somtampadaeng.com',
  website: 'www.somtampadaeng.com',
  logo: '/images/restaurant-logo.jpg',
  coverImage: '/images/restaurant-cover.jpg',
};

const operatingHours = {
  monday: { open: '09:00', close: '21:00', isOpen: true },
  tuesday: { open: '09:00', close: '21:00', isOpen: true },
  wednesday: { open: '09:00', close: '21:00', isOpen: true },
  thursday: { open: '09:00', close: '21:00', isOpen: true },
  friday: { open: '09:00', close: '21:00', isOpen: true },
  saturday: { open: '09:00', close: '22:00', isOpen: true },
  sunday: { open: '10:00', close: '20:00', isOpen: true },
};

const notificationSettings = {
  newOrders: true,
  orderUpdates: true,
  reviews: true,
  promotions: false,
  inventory: true,
  financial: true,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
};

const dayNames = {
  monday: 'จันทร์',
  tuesday: 'อังคาร', 
  wednesday: 'พุธ',
  thursday: 'พฤหัสบดี',
  friday: 'ศุกร์',
  saturday: 'เสาร์',
  sunday: 'อาทิตย์',
};

export default function SettingsManagement() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Form states
  const [restaurantData, setRestaurantData] = useState(restaurantInfo);
  const [hoursData, setHoursData] = useState(operatingHours);
  const [notificationsData, setNotificationsData] = useState(notificationSettings);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    // Simulate save operation
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleRestaurantInfoChange = (field: string, value: string) => {
    setRestaurantData(prev => ({ ...prev, [field]: value }));
  };

  const handleHoursChange = (day: string, field: string, value: any) => {
    setHoursData(prev => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], [field]: value }
    }));
  };

  const handleNotificationChange = (setting: string, value: boolean) => {
    setNotificationsData(prev => ({ ...prev, [setting]: value }));
  };

  if (!mounted) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontFamily: vristoTheme.font.family,
      }}>
        <Typography variant="h6">กำลังโหลด...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold', 
            color: vristoTheme.text.primary,
            fontFamily: vristoTheme.font.family,
            mb: 1,
          }}
        >
          การตั้งค่าร้าน
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: vristoTheme.text.secondary,
            fontFamily: vristoTheme.font.family,
          }}
        >
          จัดการข้อมูลร้าน เวลาเปิด-ปิด และการแจ้งเตือน
        </Typography>
      </Box>

      {/* Success Message */}
      {showSuccessMessage && (
        <Alert 
          severity="success" 
          sx={{ mb: 3, fontFamily: vristoTheme.font.family }}
        >
          บันทึกการตั้งค่าเรียบร้อยแล้ว
        </Alert>
      )}

      {/* Tabs */}
      <Card sx={{ boxShadow: vristoTheme.shadow.card }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontFamily: vristoTheme.font.family,
                textTransform: 'none',
                fontWeight: 600,
              }
            }}
          >
            <Tab 
              icon={<Restaurant />} 
              label="ข้อมูลร้าน" 
              iconPosition="start"
            />
            <Tab 
              icon={<Schedule />} 
              label="เวลาเปิด-ปิด" 
              iconPosition="start"
            />
            <Tab 
              icon={<Notifications />} 
              label="การแจ้งเตือน" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* Restaurant Information */}
          <CardContent>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 3,
                fontFamily: vristoTheme.font.family,
              }}
            >
              ข้อมูลร้านอาหาร
            </Typography>

            {/* Restaurant Images */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  fontFamily: vristoTheme.font.family,
                }}
              >
                รูปภาพร้าน
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 3,
                '& > *': { flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }
              }}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      mb: 2,
                      fontFamily: vristoTheme.font.family,
                    }}
                  >
                    โลโก้ร้าน
                  </Typography>
                  <Avatar 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mx: 'auto', 
                      mb: 2,
                      bgcolor: vristoTheme.light,
                    }}
                  >
                    <Restaurant sx={{ fontSize: 40, color: vristoTheme.text.secondary }} />
                  </Avatar>
                  <Button
                    variant="outlined"
                    startIcon={<PhotoCamera />}
                    sx={{ fontFamily: vristoTheme.font.family }}
                  >
                    เปลี่ยนโลโก้
                  </Button>
                </Paper>

                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      mb: 2,
                      fontFamily: vristoTheme.font.family,
                    }}
                  >
                    รูปปกร้าน
                  </Typography>
                  <Box sx={{ 
                    width: '100%', 
                    height: 100, 
                    bgcolor: vristoTheme.light,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}>
                    <PhotoCamera sx={{ fontSize: 40, color: vristoTheme.text.secondary }} />
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<PhotoCamera />}
                    sx={{ fontFamily: vristoTheme.font.family }}
                  >
                    เปลี่ยนรูปปก
                  </Button>
                </Paper>
              </Box>
            </Box>

            {/* Restaurant Details Form */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3,
              '& > *': { flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }
            }}>
              <TextField
                fullWidth
                label="ชื่อร้าน"
                value={restaurantData.name}
                onChange={(e) => handleRestaurantInfoChange('name', e.target.value)}
                sx={{ '& input, & label': { fontFamily: vristoTheme.font.family } }}
              />

              <TextField
                fullWidth
                label="เบอร์โทรศัพท์"
                value={restaurantData.phone}
                onChange={(e) => handleRestaurantInfoChange('phone', e.target.value)}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: vristoTheme.text.secondary }} />
                }}
                sx={{ '& input, & label': { fontFamily: vristoTheme.font.family } }}
              />

              <TextField
                fullWidth
                label="อีเมล"
                type="email"
                value={restaurantData.email}
                onChange={(e) => handleRestaurantInfoChange('email', e.target.value)}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: vristoTheme.text.secondary }} />
                }}
                sx={{ '& input, & label': { fontFamily: vristoTheme.font.family } }}
              />

              <TextField
                fullWidth
                label="เว็บไซต์"
                value={restaurantData.website}
                onChange={(e) => handleRestaurantInfoChange('website', e.target.value)}
                InputProps={{
                  startAdornment: <Public sx={{ mr: 1, color: vristoTheme.text.secondary }} />
                }}
                sx={{ '& input, & label': { fontFamily: vristoTheme.font.family } }}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="คำอธิบายร้าน"
                value={restaurantData.description}
                onChange={(e) => handleRestaurantInfoChange('description', e.target.value)}
                sx={{ '& textarea, & label': { fontFamily: vristoTheme.font.family } }}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="ที่อยู่"
                value={restaurantData.address}
                onChange={(e) => handleRestaurantInfoChange('address', e.target.value)}
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, mt: 1, color: vristoTheme.text.secondary }} />
                }}
                sx={{ '& textarea, & label': { fontFamily: vristoTheme.font.family } }}
              />
            </Box>

            <Box sx={{ mt: 4, textAlign: 'right' }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ 
                  bgcolor: vristoTheme.primary,
                  fontFamily: vristoTheme.font.family,
                }}
              >
                บันทึกข้อมูล
              </Button>
            </Box>
          </CardContent>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Operating Hours */}
          <CardContent>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 3,
                fontFamily: vristoTheme.font.family,
              }}
            >
              เวลาเปิด-ปิดร้าน
            </Typography>

            <Stack spacing={3}>
              {Object.entries(hoursData).map(([day, hours]) => (
                <Card key={day} sx={{ p: 2, bgcolor: vristoTheme.light }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={hours.isOpen}
                            onChange={(e) => handleHoursChange(day, 'isOpen', e.target.checked)}
                          />
                        }
                        label={
                          <Typography sx={{ fontFamily: vristoTheme.font.family, fontWeight: 600 }}>
                            {dayNames[day as keyof typeof dayNames]}
                          </Typography>
                        }
                      />
                    </Box>

                    {hours.isOpen ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                          type="time"
                          label="เปิด"
                          value={hours.open}
                          onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                          size="small"
                          sx={{ '& input, & label': { fontFamily: vristoTheme.font.family } }}
                        />
                        <Typography sx={{ fontFamily: vristoTheme.font.family }}>ถึง</Typography>
                        <TextField
                          type="time"
                          label="ปิด"
                          value={hours.close}
                          onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                          size="small"
                          sx={{ '& input, & label': { fontFamily: vristoTheme.font.family } }}
                        />
                      </Box>
                    ) : (
                      <Chip 
                        label="ปิด" 
                        color="error" 
                        sx={{ fontFamily: vristoTheme.font.family }}
                      />
                    )}
                  </Box>
                </Card>
              ))}
            </Stack>

            <Box sx={{ mt: 4, textAlign: 'right' }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ 
                  bgcolor: vristoTheme.primary,
                  fontFamily: vristoTheme.font.family,
                }}
              >
                บันทึกเวลา
              </Button>
            </Box>
          </CardContent>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Notification Settings */}
          <CardContent>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 3,
                fontFamily: vristoTheme.font.family,
              }}
            >
              การตั้งค่าการแจ้งเตือน
            </Typography>

            <Stack spacing={3}>
              {/* Order Notifications */}
              <Card sx={{ p: 3 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  การแจ้งเตือนออเดอร์
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationsData.newOrders}
                        onChange={(e) => handleNotificationChange('newOrders', e.target.checked)}
                      />
                    }
                    label={
                      <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                        ออเดอร์ใหม่
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationsData.orderUpdates}
                        onChange={(e) => handleNotificationChange('orderUpdates', e.target.checked)}
                      />
                    }
                    label={
                      <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                        อัพเดตสถานะออเดอร์
                      </Typography>
                    }
                  />
                </Stack>
              </Card>

              {/* Business Notifications */}
              <Card sx={{ p: 3 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  การแจ้งเตือนธุรกิจ
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationsData.reviews}
                        onChange={(e) => handleNotificationChange('reviews', e.target.checked)}
                      />
                    }
                    label={
                      <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                        รีวิวใหม่
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationsData.inventory}
                        onChange={(e) => handleNotificationChange('inventory', e.target.checked)}
                      />
                    }
                    label={
                      <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                        สต็อกสินค้าเหลือน้อย
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationsData.financial}
                        onChange={(e) => handleNotificationChange('financial', e.target.checked)}
                      />
                    }
                    label={
                      <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                        รายงานการเงิน
                      </Typography>
                    }
                  />
                </Stack>
              </Card>

              {/* Notification Methods */}
              <Card sx={{ p: 3 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  วิธีการแจ้งเตือน
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationsData.pushNotifications}
                        onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                      />
                    }
                    label={
                      <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                        การแจ้งเตือนผ่านแอป
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationsData.emailNotifications}
                        onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label={
                      <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                        การแจ้งเตือนผ่านอีเมล
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationsData.smsNotifications}
                        onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                      />
                    }
                    label={
                      <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                        การแจ้งเตือนผ่าน SMS
                      </Typography>
                    }
                  />
                </Stack>
              </Card>
            </Stack>

            <Box sx={{ mt: 4, textAlign: 'right' }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ 
                  bgcolor: vristoTheme.primary,
                  fontFamily: vristoTheme.font.family,
                }}
              >
                บันทึกการตั้งค่า
              </Button>
            </Box>
          </CardContent>
        </TabPanel>
      </Card>
    </Box>
  );
} 