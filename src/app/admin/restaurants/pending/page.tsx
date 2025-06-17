'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Divider,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Block,
  Close,
  AttachFile,
  Person,
  LocationOn,
  Phone,
  AlternateEmail,
  Description,
  Schedule,
  InsertDriveFile,
  Visibility,
  Download,
  Restaurant,
  Assignment,
  Store,
  PendingActions,
} from '@mui/icons-material';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { formatThaiDateTime, formatThaiDate } from '@/lib/timezone';

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

export default function PendingRestaurantsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [approvalDialog, setApprovalDialog] = useState({ open: false, type: '', restaurantId: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [processingApproval, setProcessingApproval] = useState(false);
  const [pendingRestaurants, setPendingRestaurants] = useState<any[]>([]);

  // Fetch pending restaurants
  const fetchPendingRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/restaurants/pending');
      const data = await response.json();
      
      if (data.success) {
        setPendingRestaurants(data.restaurants);
      }
    } catch (error) {
      console.error('Error fetching pending restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle restaurant approval/rejection
  const handleApprovalAction = async (action: string, restaurantId: string, reason?: string) => {
    try {
      setProcessingApproval(true);
      
      const response = await fetch('/api/admin/restaurants/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId,
          action,
          rejectReason: reason,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh data
        await fetchPendingRestaurants();
        setApprovalDialog({ open: false, type: '', restaurantId: '' });
        setRejectReason('');
        setSelectedRestaurant(null);
        
        // Show success message
        alert(result.message);
      } else {
        alert(result.error || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      alert('เกิดข้อผิดพลาดในการดำเนินการ');
    } finally {
      setProcessingApproval(false);
    }
  };

  const openApprovalDialog = (type: string, restaurantId: string) => {
    setApprovalDialog({ open: true, type, restaurantId });
    setRejectReason('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    return '📁';
  };

  useEffect(() => {
    fetchPendingRestaurants();
  }, []);

  if (loading) {
    return (
      <Box>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          ร้านอาหารที่รอการอนุมัติ
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Typography variant="h6" fontWeight="600" gutterBottom>
        ร้านอาหารที่รอการอนุมัติ ({pendingRestaurants.length} ร้าน)
      </Typography>

      {selectedRestaurant ? (
        /* Restaurant Detail View */
        <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  รายละเอียดร้านอาหาร: {selectedRestaurant.name}
                </Typography>
                <Button
                  startIcon={<Close />}
                  onClick={() => setSelectedRestaurant(null)}
                  variant="outlined"
                  size="small"
                >
                  กลับ
                </Button>
              </Box>
            }
          />
          <CardContent>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' } }}>
              {/* Restaurant Information */}
              <Box>
                <Typography variant="h6" gutterBottom color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Restaurant color="primary" />
                  ข้อมูลร้านอาหาร
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Store sx={{ color: vristoTheme.text.secondary }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">ชื่อร้าน</Typography>
                      <Typography variant="body1" fontWeight="600">{selectedRestaurant.name}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Person sx={{ color: vristoTheme.text.secondary }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">เจ้าของร้าน</Typography>
                      <Typography variant="body1" fontWeight="600">{selectedRestaurant.owner}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AlternateEmail sx={{ color: vristoTheme.text.secondary }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">อีเมล</Typography>
                      <Typography variant="body1" fontWeight="600">{selectedRestaurant.email}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Phone sx={{ color: vristoTheme.text.secondary }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">เบอร์โทร</Typography>
                      <Typography variant="body1" fontWeight="600">{selectedRestaurant.phone}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <LocationOn sx={{ color: vristoTheme.text.secondary, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">ที่อยู่</Typography>
                      <Typography variant="body1" fontWeight="600">{selectedRestaurant.address}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Description sx={{ color: vristoTheme.text.secondary, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">รายละเอียด</Typography>
                      <Typography variant="body1" fontWeight="600">{selectedRestaurant.description}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Schedule sx={{ color: vristoTheme.text.secondary }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">วันที่ส่งคำขอ</Typography>
                      <Typography variant="body1" fontWeight="600">
                        {formatThaiDateTime(selectedRestaurant.submittedAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {/* Action Buttons */}
              <Box>
                <Typography variant="h6" gutterBottom color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assignment color="primary" />
                  การดำเนินการ
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    size="large"
                    startIcon={<CheckCircle />}
                    onClick={() => openApprovalDialog('approve', selectedRestaurant.id)}
                    disabled={processingApproval}
                  >
                    อนุมัติร้านอาหาร
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    size="large"
                    startIcon={<Block />}
                    onClick={() => openApprovalDialog('reject', selectedRestaurant.id)}
                    disabled={processingApproval}
                  >
                    ปฏิเสธคำขอ
                  </Button>
                </Stack>
              </Box>
            </Box>

            {/* Documents Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <AttachFile color="primary" />
                เอกสารแนบ ({selectedRestaurant.documents?.length || 0} ไฟล์)
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {selectedRestaurant.documents && selectedRestaurant.documents.length > 0 ? (
                <Box sx={{ 
                  display: 'grid', 
                  gap: 2, 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(2, 1fr)', 
                    md: 'repeat(3, 1fr)' 
                  } 
                }}>
                  {selectedRestaurant.documents.map((doc: any, index: number) => (
                    <Card variant="outlined" sx={{ p: 2 }} key={doc.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ fontSize: '2rem' }}>
                          {getFileIcon(doc.type)}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {doc.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(doc.size)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => window.open(doc.url, '_blank')}
                          sx={{ flex: 1 }}
                        >
                          ดู
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Download />}
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = doc.url;
                            link.download = doc.name;
                            link.click();
                          }}
                          sx={{ flex: 1 }}
                        >
                          ดาวน์โหลด
                        </Button>
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        อัปโหลดเมื่อ: {formatThaiDate(doc.createdAt)}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <InsertDriveFile sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography color="text.secondary">ไม่มีเอกสารแนบ</Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        /* Restaurant List View */
        <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
          <CardContent>
            {pendingRestaurants.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <PendingActions sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  ไม่มีร้านอาหารที่รอการอนุมัติ
                </Typography>
                <Typography color="text.secondary">
                  ร้านอาหารทั้งหมดได้รับการอนุมัติแล้ว
                </Typography>
              </Box>
            ) : (
              <Box sx={{ 
                display: 'grid', 
                gap: 3, 
                gridTemplateColumns: { 
                  xs: '1fr', 
                  md: 'repeat(2, 1fr)', 
                  lg: 'repeat(3, 1fr)' 
                } 
              }}>
                {pendingRestaurants.map((restaurant: any) => (
                  <Card 
                    key={restaurant.id}
                    variant="outlined" 
                    sx={{ 
                      height: '100%',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: vristoTheme.shadow.elevated,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                          {restaurant.name}
                        </Typography>
                        <Chip 
                          label="รอการอนุมัติ" 
                          size="small" 
                          color="warning"
                          sx={{ mb: 1 }}
                        />
                      </Box>

                      <Stack spacing={1.5} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {restaurant.owner}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {restaurant.address}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AttachFile sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {restaurant.documents?.length || 0} เอกสารแนบ
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatThaiDate(restaurant.submittedAt)}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          startIcon={<Visibility />}
                          onClick={() => setSelectedRestaurant(restaurant)}
                        >
                          ดูรายละเอียด
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => openApprovalDialog('approve', restaurant.id)}
                          disabled={processingApproval}
                        >
                          อนุมัติ
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => openApprovalDialog('reject', restaurant.id)}
                          disabled={processingApproval}
                        >
                          ปฏิเสธ
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Approval/Rejection Dialog */}
      <Dialog 
        open={approvalDialog.open} 
        onClose={() => !processingApproval && setApprovalDialog({ open: false, type: '', restaurantId: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {approvalDialog.type === 'approve' ? 'ยืนยันการอนุมัติร้านอาหาร' : 'ยืนยันการปฏิเสธคำขอ'}
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" gutterBottom>
            {approvalDialog.type === 'approve' 
              ? 'คุณต้องการอนุมัติร้านอาหารนี้หรือไม่? หลังจากอนุมัติแล้วร้านอาหารจะสามารถเริ่มขายได้ทันที'
              : 'คุณต้องการปฏิเสธคำขอนี้หรือไม่? กรุณาระบุเหตุผลในการปฏิเสธ'
            }
          </Typography>
          
          {approvalDialog.type === 'reject' && (
            <TextField
              autoFocus
              margin="dense"
              label="เหตุผลในการปฏิเสธ"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="กรุณาระบุเหตุผลในการปฏิเสธ..."
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setApprovalDialog({ open: false, type: '', restaurantId: '' })}
            disabled={processingApproval}
          >
            ยกเลิก
          </Button>
          <Button 
            onClick={() => {
              if (approvalDialog.type === 'reject' && !rejectReason.trim()) {
                alert('กรุณาระบุเหตุผลในการปฏิเสธ');
                return;
              }
              handleApprovalAction(approvalDialog.type, approvalDialog.restaurantId, rejectReason);
            }}
            variant="contained"
            color={approvalDialog.type === 'approve' ? 'success' : 'error'}
            disabled={processingApproval || (approvalDialog.type === 'reject' && !rejectReason.trim())}
          >
            {processingApproval ? 'กำลังดำเนินการ...' : 
              (approvalDialog.type === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ')
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 