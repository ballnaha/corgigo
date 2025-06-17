'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Tab,
  Tabs,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Star,
  Reply,
  ThumbUp,
  Flag,
  TrendingUp,
  TrendingDown,
  Comment,
  Person,
  Restaurant,
  Close,
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

interface Review {
  id: string;
  customer: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  orderItems: string[];
  helpful: number;
  replied: boolean;
  reply?: string;
  replyDate?: string;
}

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
      id={`reviews-tabpanel-${index}`}
      aria-labelledby={`reviews-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock data
const reviewStats = {
  averageRating: 4.6,
  totalReviews: 234,
  ratingDistribution: [
    { stars: 5, count: 156, percentage: 66.7 },
    { stars: 4, count: 52, percentage: 22.2 },
    { stars: 3, count: 18, percentage: 7.7 },
    { stars: 2, count: 5, percentage: 2.1 },
    { stars: 1, count: 3, percentage: 1.3 },
  ],
  monthlyTrend: +12.5,
};

const mockReviews: Review[] = [
  {
    id: '1',
    customer: 'สมชาย ใจดี',
    avatar: '/uploads/avatars/user1.jpg',
    rating: 5,
    comment: 'อาหารอร่อยมาก ส้มตำเผ็ดๆ ถูกใจ ไก่ย่างหอมกรุ่น บริการดีมาก จะสั่งอีกแน่นอน',
    date: '2 ชั่วโมงที่แล้ว',
    orderItems: ['ส้มตำไทย', 'ไก่ย่าง'],
    helpful: 8,
    replied: true,
    reply: 'ขอบคุณมากครับ ยินดีที่ได้รับใช้ รอต้อนรับครั้งต่อไปนะครับ',
    replyDate: '1 ชั่วโมงที่แล้ว'
  },
  {
    id: '2',
    customer: 'สมหญิง รักดี',
    avatar: '/uploads/avatars/user2.jpg',
    rating: 4,
    comment: 'แกงเขียวหวานรสชาติดี แต่อยากให้เผ็ดหน่อย ข้าวผัดปูอร่อยมาก',
    date: '5 ชั่วโมงที่แล้ว',
    orderItems: ['แกงเขียวหวานไก่', 'ข้าวผัดปู'],
    helpful: 5,
    replied: false,
  },
  {
    id: '3',
    customer: 'ดำรง ทำดี',
    avatar: '/uploads/avatars/user3.jpg',
    rating: 5,
    comment: 'ผัดไทยรสชาติเป็นเอกลักษณ์ ส้มตำปูสดใหม่ ส่งเร็วด้วย บริการดีเยี่ยม',
    date: '1 วันที่แล้ว',
    orderItems: ['ผัดไทย', 'ส้มตำปู'],
    helpful: 12,
    replied: true,
    reply: 'ขอบคุณครับ เรายินดีมากที่คุณชอบ',
    replyDate: '22 ชั่วโมงที่แล้ว'
  },
  {
    id: '4',
    customer: 'ศิริ ดีใจ',
    avatar: '/uploads/avatars/user4.jpg',
    rating: 3,
    comment: 'รสชาติโอเค แต่รอนานไปหน่อย อยากให้ปรับปรุงเรื่องความเร็วในการส่ง',
    date: '2 วันที่แล้ว',
    orderItems: ['ต้มยำกุ้ง', 'ข้าวเหนียวหวาน'],
    helpful: 3,
    replied: false,
  },
];

export default function ReviewsManagement() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReply = (review: Review) => {
    setSelectedReview(review);
    setReplyText('');
    setOpenReplyDialog(true);
  };

  const handleSubmitReply = () => {
    if (selectedReview && replyText.trim()) {
      setReviews(prev => prev.map(review => 
        review.id === selectedReview.id 
          ? { 
              ...review, 
              replied: true, 
              reply: replyText.trim(),
              replyDate: 'เมื่อสักครู่'
            }
          : review
      ));
      setOpenReplyDialog(false);
      setSelectedReview(null);
      setReplyText('');
    }
  };

  const getFilteredReviews = () => {
    switch (tabValue) {
      case 1: // รีวิวใหม่
        return reviews.filter(review => !review.replied);
      case 2: // รีวิวที่ตอบแล้ว
        return reviews.filter(review => review.replied);
      case 3: // รีวิวต่ำ
        return reviews.filter(review => review.rating <= 3);
      default: // ทั้งหมด
        return reviews;
    }
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
          รีวิวและคะแนน
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: vristoTheme.text.secondary,
            fontFamily: vristoTheme.font.family,
          }}
        >
          จัดการรีวิวและความคิดเห็นจากลูกค้า
        </Typography>
      </Box>

      {/* Review Stats */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4,
        '& > *': { flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' } }
      }}>
        <Card sx={{ 
          boxShadow: vristoTheme.shadow.card,
          borderLeft: `4px solid ${vristoTheme.warning}`,
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold', 
                color: vristoTheme.warning,
                fontFamily: vristoTheme.font.family,
                mb: 1,
              }}
            >
              {reviewStats.averageRating}
            </Typography>
            <Rating 
              value={reviewStats.averageRating} 
              readOnly 
              precision={0.1}
              size="large"
              sx={{ mb: 1 }}
            />
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 600,
                fontFamily: vristoTheme.font.family,
                mb: 1,
              }}
            >
              คะแนนเฉลี่ย
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: vristoTheme.text.secondary,
                fontFamily: vristoTheme.font.family,
              }}
            >
              จาก {reviewStats.totalReviews} รีวิว
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: vristoTheme.shadow.card }}>
          <CardContent>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                fontFamily: vristoTheme.font.family,
                mb: 2,
              }}
            >
              การแจกแจงคะแนน
            </Typography>
            {reviewStats.ratingDistribution.map((item) => (
              <Box key={item.stars} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography 
                  sx={{ 
                    minWidth: 20,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  {item.stars}
                </Typography>
                <Star sx={{ color: vristoTheme.warning, fontSize: 16, mx: 0.5 }} />
                <Box sx={{ 
                  flexGrow: 1, 
                  bgcolor: vristoTheme.light, 
                  height: 8, 
                  borderRadius: 1, 
                  mx: 1 
                }}>
                  <Box sx={{ 
                    width: `${item.percentage}%`, 
                    height: '100%', 
                    bgcolor: vristoTheme.warning, 
                    borderRadius: 1 
                  }} />
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    minWidth: 40,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  {item.count}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>

        <Card sx={{ 
          boxShadow: vristoTheme.shadow.card,
          borderLeft: `4px solid ${vristoTheme.success}`,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  fontFamily: vristoTheme.font.family,
                }}
              >
                แนวโน้มเดือนนี้
              </Typography>
              <TrendingUp sx={{ color: vristoTheme.success }} />
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: vristoTheme.success,
                fontFamily: vristoTheme.font.family,
                mb: 1,
              }}
            >
              +{reviewStats.monthlyTrend}%
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: vristoTheme.text.secondary,
                fontFamily: vristoTheme.font.family,
              }}
            >
              เปรียบเทียบกับเดือนที่แล้ว
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: vristoTheme.success,
                  fontFamily: vristoTheme.font.family,
                }}
              >
                • รีวิว 5 ดาวเพิ่มขึ้น 18%
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: vristoTheme.success,
                  fontFamily: vristoTheme.font.family,
                }}
              >
                • ความพึงพอใจโดยรวมดีขึ้น
              </Typography>
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
            <Tab label={`ทั้งหมด (${reviews.length})`} />
            <Tab label={`รีวิวใหม่ (${reviews.filter(r => !r.replied).length})`} />
            <Tab label={`ตอบแล้ว (${reviews.filter(r => r.replied).length})`} />
            <Tab label={`รีวิวต่ำ (${reviews.filter(r => r.rating <= 3).length})`} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <ReviewsList reviews={getFilteredReviews()} onReply={handleReply} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ReviewsList reviews={getFilteredReviews()} onReply={handleReply} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <ReviewsList reviews={getFilteredReviews()} onReply={handleReply} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <ReviewsList reviews={getFilteredReviews()} onReply={handleReply} />
        </TabPanel>
      </Card>

      {/* Reply Dialog */}
      <Dialog 
        open={openReplyDialog} 
        onClose={() => setOpenReplyDialog(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isXsScreen}
        PaperProps={{
          sx: {
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100vh', sm: 'none' },
            borderRadius: { xs: 0, sm: 2 },
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: vristoTheme.font.family,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-start' },
        }}>
          ตอบกลับรีวิว
          <IconButton
            onClick={() => setOpenReplyDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: vristoTheme.text.secondary,
              display: { xs: 'block', sm: 'none' },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography sx={{ fontFamily: vristoTheme.font.family, fontWeight: 600 }}>
                    {selectedReview.customer}
                  </Typography>
                  <Rating value={selectedReview.rating} readOnly size="small" />
                </Box>
              </Box>
              <Typography 
                sx={{ 
                  bgcolor: vristoTheme.light, 
                  p: 2, 
                  borderRadius: 1, 
                  mb: 2,
                  fontFamily: vristoTheme.font.family,
                }}
              >
                {selectedReview.comment}
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="ข้อความตอบกลับ"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="เขียนข้อความตอบกลับที่สุภาพและเป็นมิตร..."
            sx={{ '& textarea, & label': { fontFamily: vristoTheme.font.family } }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenReplyDialog(false)}
            sx={{ fontFamily: vristoTheme.font.family }}
          >
            ยกเลิก
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitReply}
            disabled={!replyText.trim()}
            sx={{ 
              bgcolor: vristoTheme.primary,
              fontFamily: vristoTheme.font.family,
            }}
          >
            ส่งการตอบกลับ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Reviews List Component
function ReviewsList({ reviews, onReply }: { reviews: Review[], onReply: (review: Review) => void }) {
  return (
    <CardContent>
      {reviews.length > 0 ? (
        <List>
          {reviews.map((review, index) => (
            <Box key={review.id}>
              <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography 
                          sx={{ 
                            fontFamily: vristoTheme.font.family, 
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          {review.customer}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: vristoTheme.text.secondary,
                              fontFamily: vristoTheme.font.family,
                            }}
                          >
                            {review.date}
                          </Typography>
                        </Box>
                      </Box>
                      {!review.replied && (
                        <Button
                          size="small"
                          startIcon={<Reply />}
                          onClick={() => onReply(review)}
                          sx={{ fontFamily: vristoTheme.font.family }}
                        >
                          ตอบกลับ
                        </Button>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography 
                        sx={{ 
                          fontFamily: vristoTheme.font.family,
                          mb: 1,
                        }}
                      >
                        {review.comment}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        {review.orderItems.map((item) => (
                          <Chip 
                            key={item} 
                            label={item} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontFamily: vristoTheme.font.family }}
                          />
                        ))}
                      </Box>
                      {review.replied && review.reply && (
                        <Paper sx={{ 
                          p: 2, 
                          mt: 2, 
                          bgcolor: vristoTheme.light,
                          borderLeft: `3px solid ${vristoTheme.primary}`
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Restaurant sx={{ mr: 1, color: vristoTheme.primary, fontSize: 18 }} />
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 600,
                                color: vristoTheme.primary,
                                fontFamily: vristoTheme.font.family,
                              }}
                            >
                              เจ้าของร้านตอบกลับ
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                ml: 'auto',
                                color: vristoTheme.text.secondary,
                                fontFamily: vristoTheme.font.family,
                              }}
                            >
                              {review.replyDate}
                            </Typography>
                          </Box>
                          <Typography 
                            sx={{ fontFamily: vristoTheme.font.family }}
                          >
                            {review.reply}
                          </Typography>
                        </Paper>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <IconButton size="small">
                          <ThumbUp fontSize="small" />
                        </IconButton>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: vristoTheme.text.secondary,
                            fontFamily: vristoTheme.font.family,
                          }}
                        >
                          {review.helpful} คนพบว่ามีประโยชน์
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              {index < reviews.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: vristoTheme.text.secondary,
              fontFamily: vristoTheme.font.family,
            }}
          >
            ไม่มีรีวิวในหมวดนี้
          </Typography>
        </Box>
      )}
    </CardContent>
  );
} 