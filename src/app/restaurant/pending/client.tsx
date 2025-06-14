'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Stack,
  CircularProgress,
  Chip,
  Button,
  alpha,
  Alert,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  HourglassEmpty,
  CheckCircle,
  Cancel,
  ArrowBack,
  Refresh,
  Edit,
  Schedule,
  Email,
  Phone,
  RestaurantMenu,
  Assignment,
  Security,
  LocationOn,
  Business,
} from '@mui/icons-material';
import AppLayout from '@/components/AppLayout';

interface RestaurantStatus {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  submittedAt: string;
  submittedAtThai?: string;
  approvedAt?: string;
  approvedAtThai?: string;
  rejectedAt?: string;
  rejectedAtThai?: string;
  rejectReason?: string;
}

export default function RestaurantPendingClient() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [restaurant, setRestaurant] = useState<RestaurantStatus | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [formattedApprovedDate, setFormattedApprovedDate] = useState<string>('');
  const [formattedRejectedDate, setFormattedRejectedDate] = useState<string>('');
  const [estimatedTime, setEstimatedTime] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const loadRestaurantStatus = async () => {
    try {
      setError('');
      
      const response = await fetch('/api/restaurant/status');
        const result = await response.json();
      
      if (response.ok && result.success) {
          setRestaurant(result.restaurant);
          
          // ใช้เวลาไทยที่ส่งมาจาก API
          if (result.restaurant.submittedAtThai) {
            // แปลงจาก yyyy-MM-dd HH:mm:ss เป็นรูปแบบไทย
            const [datePart, timePart] = result.restaurant.submittedAtThai.split(' ');
            const [year, month, day] = datePart.split('-');
            const [hour, minute] = timePart.split(':');
            
            const thaiDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
            const formatted = thaiDate.toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            setFormattedDate(formatted);
          
          // คำนวณเวลาที่ผ่านไปและเวลาที่เหลือ
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - thaiDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // คำนวณ progress bar
          const progressPercentage = Math.min((diffDays / 3) * 100, 100);
          setProgress(progressPercentage);
          
          if (diffDays <= 3) {
            const remainingDays = 3 - diffDays;
            if (remainingDays > 0) {
              setEstimatedTime(`อีก ${remainingDays} วัน (โดยประมาณ)`);
            } else {
              setEstimatedTime('กำลังตรวจสอบ...');
            }
          } else {
            setEstimatedTime('กำลังตรวจสอบ...');
          }
        } else {
          setEstimatedTime('2-3 วันทำการ');
          setProgress(0);
        }
        
        // Format approved date - ใช้เวลาไทยจาก API
        if (result.restaurant.approvedAtThai) {
          const [datePart, timePart] = result.restaurant.approvedAtThai.split(' ');
          const [year, month, day] = datePart.split('-');
          const [hour, minute] = timePart.split(':');
          
          const thaiApprovedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
          const formattedApproved = thaiApprovedDate.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
          setFormattedApprovedDate(formattedApproved);
        }
        
        // Format rejected date - ใช้เวลาไทยจาก API
        if (result.restaurant.rejectedAtThai) {
          const [datePart, timePart] = result.restaurant.rejectedAtThai.split(' ');
          const [year, month, day] = datePart.split('-');
          const [hour, minute] = timePart.split(':');
          
          const thaiRejectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
          const formattedRejected = thaiRejectedDate.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
          setFormattedRejectedDate(formattedRejected);
          }
          
          // ถ้าได้รับการอนุมัติแล้ว ให้ไปหน้าร้านอาหาร
          if (result.restaurant.status === 'APPROVED') {
            router.push('/restaurant');
            return;
          }
      } else {
        // ถ้าไม่พบข้อมูลร้านอาหาร แสดงว่ายังไม่ได้สมัคร
        if (response.status === 404) {
          router.push('/restaurant/register');
          return;
        }
        setError(result.error || 'ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (error) {
      console.error('Error loading restaurant status:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // รอให้ session โหลดเสร็จก่อน
    if (sessionStatus === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/login');
      return;
    }

    // ตรวจสอบว่าผู้ใช้มี restaurant role หรือไม่
    const userRoles = session.user.roles || [];
    if (!userRoles.includes('RESTAURANT')) {
      router.push('/restaurant/register');
      return;
    }

      loadRestaurantStatus();
  }, [session, sessionStatus, router]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRestaurantStatus();
  };

  const handleEditApplication = () => {
    router.push('/restaurant/register?edit=true');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <HourglassEmpty sx={{ fontSize: 64, color: '#F8A66E' }} />;
      case 'APPROVED':
        return <CheckCircle sx={{ fontSize: 64, color: '#4CAF50' }} />;
      case 'REJECTED':
        return <Cancel sx={{ fontSize: 64, color: '#F35C76' }} />;
      default:
        return <HourglassEmpty sx={{ fontSize: 64, color: '#999' }} />;
    }
  };

  const getStatusChip = (status: string) => {
    const config = {
      PENDING: { label: 'รอการตรวจสอบ', color: '#F8A66E', bgColor: alpha('#F8A66E', 0.1) },
      APPROVED: { label: 'อนุมัติแล้ว', color: '#4CAF50', bgColor: alpha('#4CAF50', 0.1) },
      REJECTED: { label: 'ไม่อนุมัติ', color: '#F35C76', bgColor: alpha('#F35C76', 0.1) },
      SUSPENDED: { label: 'ระงับการใช้งาน', color: '#999', bgColor: alpha('#999', 0.1) },
    };

    const statusConfig = config[status as keyof typeof config] || config.PENDING;

    return (
      <Chip
        label={statusConfig.label}
        size="small"
        sx={{
          bgcolor: statusConfig.bgColor,
          color: statusConfig.color,
          fontFamily: 'Prompt, sans-serif',
          fontWeight: 500,
          height: 28,
          '& .MuiChip-icon': { color: statusConfig.color },
          border: `1px solid ${alpha(statusConfig.color, 0.2)}`,
        }}
      />
    );
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'เรากำลังตรวจสอบข้อมูลร้านของคุณอย่างละเอียด จะแจ้งผลภายใน 2-3 วันทำการ';
      case 'APPROVED':
        return 'ยินดีด้วย! ร้านของคุณได้รับการอนุมัติแล้ว สามารถเริ่มรับออเดอร์ได้เลย';
      case 'REJECTED':
        return 'ขออภัย ร้านของคุณไม่ผ่านการตรวจสอบ กรุณาตรวจสอบเหตุผลและแก้ไข';
      case 'SUSPENDED':
        return 'ร้านของคุณถูกระงับการใช้งาน กรุณาติดต่อฝ่ายสนับสนุน';
      default:
        return 'ไม่สามารถโหลดสถานะได้';
    }
  };

  // แสดง loading ขณะรอ session
  if (sessionStatus === 'loading' || loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#FAFAFA',
      }}>
        <CircularProgress sx={{ color: '#F8A66E' }} size={40} />
      </Box>
    );
  }

  // แสดง error ถ้ามี
  if (error) {
    return (
      <AppLayout 
        showBackOnly 
        backTitle="สถานะการสมัคร"
        contentSx={{ py: 4, px: 3 }}
      >
        <Box sx={{ maxWidth: 'sm', mx: 'auto' }}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              fontFamily: 'Prompt, sans-serif',
            }}
          >
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => router.push('/restaurant/register')}
            sx={{ 
              bgcolor: '#F8A66E',
              borderRadius: 2,
              py: 1,
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#E8956E',
              },
            }}
          >
            สมัครเปิดร้านอาหาร
          </Button>
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      showBackOnly 
      backTitle="สถานะการสมัคร"
      hideFooter
      contentSx={{ 
        fontFamily: 'Prompt, sans-serif',
      }}
    >
      {/* Header Section - Full Width */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
          pt: 3,
          pb: 2,
          px: 2,
          textAlign: 'center',
          position: 'relative',
          width: '100%',
        }}
      >

          {/* Status Icon */}
          <Box sx={{ mb: 2 }}>
            {restaurant && getStatusIcon(restaurant.status)}
          </Box>

          {/* Restaurant Name */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600, 
              color: '#1A1A1A', 
              mb: 0.5, 
            }}
          >
            {restaurant?.name || 'ร้านของคุณ'}
          </Typography>

          {/* Status Message */}
          <Typography 
            variant="body2" 
            sx={{
              fontFamily: 'Prompt, sans-serif',
              color: '#666', 
              mb: 2,
              lineHeight: 1.5,
            }}
          >
            {restaurant && getStatusMessage(restaurant.status)}
          </Typography>
          
          {/* Status Chip */}
          {restaurant && getStatusChip(restaurant.status)}

          {/* Progress Bar for Pending Status */}
          {restaurant?.status === 'PENDING' && (
            <Box sx={{ mt: 2, maxWidth: '300px', mx: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#666', fontSize: '0.75rem', fontFamily: 'Prompt, sans-serif' }}>
                  ความคืบหน้า
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#F8A66E', fontSize: '0.75rem', fontFamily: 'Prompt, sans-serif' }}>
                  {Math.round(progress)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha('#F8A66E', 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    bgcolor: '#F8A66E',
                  }
                }}
              />
            </Box>
          )}
        </Box>

        {/* Content Section - Full Width */}
        <Box sx={{ px: 2, pb: 2 }}>
          {/* Date Information */}
          {(formattedDate || formattedApprovedDate || formattedRejectedDate) && (
        <Card
          elevation={0}
          sx={{ 
            borderRadius: { xs: 0, sm: 3 }, // Mobile: ไม่มี border radius, Desktop: มี border radius
            border: { xs: 'none', sm: '1px solid #E8E8E8' }, // Mobile: ไม่มี border, Desktop: มี border
            borderTop: { xs: '1px solid #E8E8E8', sm: 'none' }, // Mobile: มี border ด้านบนเท่านั้น
            borderBottom: { xs: '1px solid #E8E8E8', sm: 'none' }, // Mobile: มี border ด้านล่างเท่านั้น
            bgcolor: '#FFFFFF',
            mb: { xs: 0, sm: 2 }, // Mobile: ไม่มี margin bottom, Desktop: มี margin
            mx: { xs: 0, sm: 'auto' }, // Mobile: ไม่มี margin horizontal
          }}
        >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}> {/* Mobile: padding น้อยกว่า, Desktop: padding ปกติ */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
                  <Schedule sx={{ color: '#666', mr: 1.5, fontSize: 20 }} />
              <Typography 
                    variant="subtitle1" 
                sx={{ 
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600,
                  color: '#1A1A1A',
                    }}
                  >
                    ข้อมูลวันที่
                  </Typography>
                </Box>
                
                <Stack spacing={{ xs: 2, sm: 2.5 }} > {/* Mobile: spacing น้อยกว่า */}
                  {formattedDate && (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 , fontFamily: 'Prompt, sans-serif'}}>
                        วันที่สมัคร
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1A1A1A' , fontFamily: 'Prompt, sans-serif'}}>
                        {formattedDate}
                      </Typography>
                    </Box>
                  )}

                  {formattedApprovedDate && (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 , fontFamily: 'Prompt, sans-serif'}}>
                        วันที่อนุมัติ
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#4CAF50' , fontFamily: 'Prompt, sans-serif'}}>
                        {formattedApprovedDate}
              </Typography>
                    </Box>
            )}

                  {formattedRejectedDate && (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 , fontFamily: 'Prompt, sans-serif'}}>
                        วันที่ปฏิเสธ
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#F35C76' , fontFamily: 'Prompt, sans-serif'}}>
                        {formattedRejectedDate}
                      </Typography>
              </Box>
            )}

                  {restaurant?.status === 'PENDING' && estimatedTime && (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500, fontFamily: 'Prompt, sans-serif'}}>
                        เวลาตรวจสอบโดยประมาณ
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#F8A66E' , fontFamily: 'Prompt, sans-serif'}}>
                        {estimatedTime}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Restaurant Information */}
          {restaurant && (
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: '1px solid #E8E8E8',
                bgcolor: '#FFFFFF',
                mb: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <RestaurantMenu sx={{ color: '#666', mr: 1.5, fontSize: 20 }} />
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                fontFamily: 'Prompt, sans-serif',
                      fontWeight: 600, 
                      color: '#1A1A1A', 
                    }}
                  >
                    ข้อมูลร้านอาหาร
                  </Typography>
                </Box>
                
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500, fontFamily: 'Prompt, sans-serif' }}>
                      ชื่อร้าน
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1A1A1A', fontFamily: 'Prompt, sans-serif' }}>
                      {restaurant.name}
                    </Typography>
                  </Box>
                  
                  {restaurant.description && (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500, fontFamily: 'Prompt, sans-serif' }}>
                        คำอธิบาย
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1A1A1A', lineHeight: 1.5, fontFamily: 'Prompt, sans-serif' }}>
                        {restaurant.description}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500, fontFamily: 'Prompt, sans-serif' }}>
                      ที่อยู่
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#1A1A1A', lineHeight: 1.5, fontFamily: 'Prompt, sans-serif' }}>
                      {restaurant.address}
            </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500, fontFamily: 'Prompt, sans-serif' }}>
                      เบอร์โทรศัพท์
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1A1A1A', fontFamily: 'Prompt, sans-serif' }}>
                      {restaurant.phone}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

            {/* Reject Reason */}
            {restaurant?.status === 'REJECTED' && restaurant.rejectReason && (
            <Card 
              elevation={0}
                sx={{ 
                borderRadius: 3,
                border: '1px solid #F35C76',
                bgcolor: alpha('#F35C76', 0.05),
                mb: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Cancel sx={{ color: '#F35C76', mr: 1.5, fontSize: 20 }} />
                <Typography 
                    variant="subtitle1" 
                  sx={{ 
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 600,
                      color: '#F35C76', 
                  }}
                >
                    เหตุผลในการปฏิเสธ
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#1A1A1A', lineHeight: 1.5, fontFamily: 'Prompt, sans-serif' }}>
                  {restaurant.rejectReason}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Review Process Information */}
          {restaurant?.status === 'PENDING' && (
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: '1px solid #E8E8E8',
                bgcolor: '#FFFFFF',
                mb: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Assignment sx={{ color: '#666', mr: 1.5, fontSize: 20 }} />
                <Typography 
                    variant="subtitle1" 
                  sx={{ 
                    fontFamily: 'Prompt, sans-serif',
                      fontWeight: 600, 
                      color: '#1A1A1A', 
                  }}
                >
                    สิ่งที่เรากำลังตรวจสอบ
                  </Typography>
                </Box>
                
                <Stack spacing={2}>
                  {[
                    { icon: <Security />, title: 'ความถูกต้องของข้อมูลร้านอาหาร' },
                    { icon: <Assignment />, title: 'เอกสารประกอบการสมัคร' },
                    
                  ].map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        color: '#F8A66E', 
                        mr: 2,
                        p: 0.5,
                        borderRadius: 1,
                        bgcolor: alpha('#F8A66E', 0.1),
                      }}>
                        {item.icon}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#666', fontFamily: 'Prompt, sans-serif' }}>
                        {item.title}
                </Typography>
              </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
            )}

 
            {/* Action Buttons */}
          {(restaurant?.status === 'PENDING' || restaurant?.status === 'REJECTED') && (
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditApplication}
                fullWidth
                sx={{
                  bgcolor: '#F8A66E',
                  color: '#FFFFFF',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 500,
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#E8956E',
                  },
                }}
              >
                {restaurant?.status === 'REJECTED' ? 'แก้ไขและส่งใหม่' : 'แก้ไขใบสมัคร'}
              </Button>
            </Box>
              )}
        </Box>
    </AppLayout>
  );
} 