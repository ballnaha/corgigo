'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Tab,
  Tabs,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  Receipt,
  CreditCard,
  AccountBalance,
  TrendingDown,
  Timeline,
  PieChart,
  MonetizationOn,
  LocalAtm,
  Savings,
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
      id={`finance-tabpanel-${index}`}
      aria-labelledby={`finance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock data
const financeData = {
  todayRevenue: 8750,
  yesterdayRevenue: 7200,
  monthlyRevenue: 165000,
  totalOrders: 245,
  averageOrderValue: 180,
  expenses: 45000,
  profit: 120000,
  profitMargin: 72.7,
};

const recentTransactions = [
  {
    id: '1',
    type: 'income',
    description: 'ออเดอร์ #CG001 - ส้มตำไทย, ไก่ย่าง',
    amount: 180,
    method: 'เงินสด',
    time: '14:30',
    customer: 'คุณสมชาย'
  },
  {
    id: '2',
    type: 'income',
    description: 'ออเดอร์ #CG002 - แกงเขียวหวาน, ข้าวผัดปู',
    amount: 250,
    method: 'โอนเงิน',
    time: '14:15',
    customer: 'คุณสมหญิง'
  },
  {
    id: '3',
    type: 'expense',
    description: 'ซื้อวัตถุดิบ - ตลาดสด',
    amount: 1200,
    method: 'เงินสด',
    time: '09:00',
    customer: 'ร้านค้าปลีก'
  },
  {
    id: '4',
    type: 'income',
    description: 'ออเดอร์ #CG003 - ผัดไทย, ส้มตำปู',
    amount: 320,
    method: 'บัตรเครดิต',
    time: '13:45',
    customer: 'คุณดำรง'
  },
];

const weeklyData = [
  { day: 'จันทร์', revenue: 5400, orders: 32 },
  { day: 'อังคาร', revenue: 6600, orders: 38 },
  { day: 'พุธ', revenue: 7500, orders: 42 },
  { day: 'พฤหัสบดี', revenue: 6000, orders: 35 },
  { day: 'ศุกร์', revenue: 8400, orders: 48 },
  { day: 'เสาร์', revenue: 10500, orders: 58 },
  { day: 'อาทิตย์', revenue: 8750, orders: 52 },
];

const paymentMethods = [
  { method: 'เงินสด', amount: 45600, percentage: 52.3, color: vristoTheme.success },
  { method: 'โอนเงิน', amount: 28400, percentage: 32.6, color: vristoTheme.primary },
  { method: 'บัตรเครดิต', amount: 13200, percentage: 15.1, color: vristoTheme.warning },
];

export default function FinanceManagement() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
          การเงินและบัญชี
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: vristoTheme.text.secondary,
            fontFamily: vristoTheme.font.family,
          }}
        >
          ติดตามรายได้ รายจ่าย และการเงินของร้าน
        </Typography>
      </Box>

      {/* Financial Summary Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4,
        '& > *': { flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(25% - 18px)' } }
      }}>
        <Card sx={{ 
          boxShadow: vristoTheme.shadow.card,
          borderLeft: `4px solid ${vristoTheme.success}`,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: vristoTheme.success,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  ฿{financeData.todayRevenue.toLocaleString()}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: vristoTheme.text.secondary,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  รายได้วันนี้
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUp sx={{ fontSize: 16, color: vristoTheme.success, mr: 0.5 }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: vristoTheme.success,
                      fontFamily: vristoTheme.font.family,
                    }}
                  >
                    +21.5% จากเมื่อวาน
                  </Typography>
                </Box>
              </Box>
              <Avatar sx={{ bgcolor: `${vristoTheme.success}15`, color: vristoTheme.success }}>
                <AttachMoney />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          boxShadow: vristoTheme.shadow.card,
          borderLeft: `4px solid ${vristoTheme.primary}`,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: vristoTheme.primary,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  ฿{financeData.monthlyRevenue.toLocaleString()}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: vristoTheme.text.secondary,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  รายได้เดือนนี้
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: vristoTheme.text.secondary,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  จาก {financeData.totalOrders} ออเดอร์
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${vristoTheme.primary}15`, color: vristoTheme.primary }}>
                <MonetizationOn />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          boxShadow: vristoTheme.shadow.card,
          borderLeft: `4px solid ${vristoTheme.warning}`,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: vristoTheme.warning,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  ฿{financeData.averageOrderValue}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: vristoTheme.text.secondary,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  ยอดเฉลี่ยต่อออเดอร์
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: vristoTheme.text.secondary,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  ภายใน 30 วัน
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${vristoTheme.warning}15`, color: vristoTheme.warning }}>
                <Timeline />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          boxShadow: vristoTheme.shadow.card,
          borderLeft: `4px solid ${vristoTheme.info}`,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: vristoTheme.info,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  {financeData.profitMargin}%
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: vristoTheme.text.secondary,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  อัตรากำไร
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: vristoTheme.success,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  กำไรสุทธิ ฿{financeData.profit.toLocaleString()}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${vristoTheme.info}15`, color: vristoTheme.info }}>
                <Savings />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Box>

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
            <Tab label="ธุรกรรมล่าสุด" />
            <Tab label="รายงานสัปดาห์" />
            <Tab label="วิธีการชำระเงิน" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* Recent Transactions */}
          <CardContent>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 3,
                fontFamily: vristoTheme.font.family,
              }}
            >
              ธุรกรรมล่าสุด
            </Typography>
            <List>
              {recentTransactions.map((transaction, index) => (
                <Box key={transaction.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: transaction.type === 'income' 
                          ? `${vristoTheme.success}15` 
                          : `${vristoTheme.danger}15`,
                        color: transaction.type === 'income' 
                          ? vristoTheme.success 
                          : vristoTheme.danger
                      }}>
                        {transaction.type === 'income' ? <TrendingUp /> : <TrendingDown />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontFamily: vristoTheme.font.family, fontWeight: 600 }}>
                          {transaction.description}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: vristoTheme.text.secondary,
                              fontFamily: vristoTheme.font.family,
                            }}
                          >
                            {transaction.customer} • {transaction.method} • {transaction.time}
                          </Typography>
                        </Box>
                      }
                    />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: transaction.type === 'income' 
                          ? vristoTheme.success 
                          : vristoTheme.danger,
                        fontFamily: vristoTheme.font.family,
                      }}
                    >
                      {transaction.type === 'income' ? '+' : '-'}฿{transaction.amount.toLocaleString()}
                    </Typography>
                  </ListItem>
                  {index < recentTransactions.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </CardContent>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Weekly Report */}
          <CardContent>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 3,
                fontFamily: vristoTheme.font.family,
              }}
            >
              รายงานรายได้รายสัปดาห์
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: vristoTheme.font.family, fontWeight: 600 }}>
                      วัน
                    </TableCell>
                    <TableCell sx={{ fontFamily: vristoTheme.font.family, fontWeight: 600 }}>
                      รายได้
                    </TableCell>
                    <TableCell sx={{ fontFamily: vristoTheme.font.family, fontWeight: 600 }}>
                      ออเดอร์
                    </TableCell>
                    <TableCell sx={{ fontFamily: vristoTheme.font.family, fontWeight: 600 }}>
                      เฉลี่ยต่อออเดอร์
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weeklyData.map((day) => (
                    <TableRow key={day.day}>
                      <TableCell sx={{ fontFamily: vristoTheme.font.family }}>
                        {day.day}
                      </TableCell>
                      <TableCell sx={{ fontFamily: vristoTheme.font.family }}>
                        ฿{day.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ fontFamily: vristoTheme.font.family }}>
                        {day.orders} ออเดอร์
                      </TableCell>
                      <TableCell sx={{ fontFamily: vristoTheme.font.family }}>
                        ฿{Math.round(day.revenue / day.orders)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Payment Methods */}
          <CardContent>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 3,
                fontFamily: vristoTheme.font.family,
              }}
            >
              สัดส่วนวิธีการชำระเงิน
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3,
              '& > *': { flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }
            }}>
              {paymentMethods.map((method) => (
                <Card key={method.method} sx={{ 
                  boxShadow: vristoTheme.shadow.card,
                  border: `2px solid ${method.color}15`,
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ 
                      bgcolor: `${method.color}15`, 
                      color: method.color, 
                      mx: 'auto', 
                      mb: 2 
                    }}>
                      {method.method === 'เงินสด' && <LocalAtm />}
                      {method.method === 'โอนเงิน' && <AccountBalance />}
                      {method.method === 'บัตรเครดิต' && <CreditCard />}
                    </Avatar>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: method.color,
                        fontFamily: vristoTheme.font.family,
                        mb: 1,
                      }}
                    >
                      ฿{method.amount.toLocaleString()}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 600,
                        fontFamily: vristoTheme.font.family,
                        mb: 1,
                      }}
                    >
                      {method.method}
                    </Typography>
                    <Chip 
                      label={`${method.percentage}%`} 
                      size="small"
                      sx={{ 
                        bgcolor: `${method.color}15`,
                        color: method.color,
                        fontFamily: vristoTheme.font.family,
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </TabPanel>
      </Card>
    </Box>
  );
} 