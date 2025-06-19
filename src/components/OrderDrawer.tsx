'use client';

import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Chip,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Avatar,
  Alert,
} from '@mui/material';
import {
  Close,
  Add,
  Remove,
  Schedule,
  LocationOn,
  CreditCard,
  LocalShipping,
  CheckCircle,
  Person,
  Phone,
  Note,
} from '@mui/icons-material';

interface MealPlanInfo {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  originalPrice?: number;
  duration: string;
  totalMeals: number;
  mealsPerDay: number;
  includesSnacks: boolean;
  restaurant: {
    name: string;
    rating: number;
    image?: string;
  };
}

interface OrderDrawerProps {
  open: boolean;
  onClose: () => void;
  mealPlan: MealPlanInfo | null;
  onOrderComplete?: (orderData: any) => void;
}

const steps = ['รายละเอียด', 'ที่อยู่', 'การชำระเงิน', 'ยืนยันคำสั่งซื้อ'];

export default function OrderDrawer({ open, onClose, mealPlan, onOrderComplete }: OrderDrawerProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('08:00-10:00');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  if (!mealPlan) return null;

  const subtotal = mealPlan.price * quantity;
  const deliveryFee = 50;
  const serviceFee = Math.round(subtotal * 0.02); // 2% service fee
  const total = subtotal + deliveryFee + serviceFee;

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleOrder = () => {
    const orderData = {
      mealPlanId: mealPlan.id,
      quantity,
      startDate,
      deliveryTime,
      address,
      contactName,
      contactPhone,
      specialInstructions,
      paymentMethod,
      subtotal,
      deliveryFee,
      serviceFee,
      total,
    };

    // Simulate order processing
    setTimeout(() => {
      onOrderComplete?.(orderData);
      onClose();
      setActiveStep(0);
    }, 2000);
  };

  const getDurationText = (duration: string) => {
    switch (duration) {
      case 'SEVEN_DAYS': return '7 วัน';
      case 'FOURTEEN_DAYS': return '14 วัน';
      case 'THIRTY_DAYS': return '30 วัน';
      default: return duration;
    }
  };

  const getDeliveryOptions = () => [
    { value: '08:00-10:00', label: '08:00-10:00 น.' },
    { value: '10:00-12:00', label: '10:00-12:00 น.' },
    { value: '12:00-14:00', label: '12:00-14:00 น.' },
    { value: '14:00-16:00', label: '14:00-16:00 น.' },
    { value: '16:00-18:00', label: '16:00-18:00 น.' },
  ];

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            {/* Meal Plan Info */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              {mealPlan.image && (
                <Box
                  component="img"
                  src={mealPlan.image}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    objectFit: 'cover'
                  }}
                />
              )}
              <Box sx={{ flex: 1 }}>
                <Typography sx={{
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  fontFamily: 'Prompt, sans-serif',
                  mb: 0.5
                }}>
                  {mealPlan.name}
                </Typography>
                <Typography sx={{
                  fontSize: '0.85rem',
                  color: '#6B7280',
                  fontFamily: 'Prompt, sans-serif',
                  mb: 1
                }}>
                  {mealPlan.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label={getDurationText(mealPlan.duration)} 
                    size="small" 
                    sx={{ bgcolor: '#F3F4F6', fontSize: '0.7rem' }}
                  />
                  <Chip 
                    label={`${mealPlan.totalMeals} มื้อ`} 
                    size="small" 
                    sx={{ bgcolor: '#F3F4F6', fontSize: '0.7rem' }}
                  />
                  <Chip 
                    label={`${mealPlan.mealsPerDay} มื้อ/วัน`} 
                    size="small" 
                    sx={{ bgcolor: '#F3F4F6', fontSize: '0.7rem' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#10B981',
                    fontFamily: 'Prompt, sans-serif'
                  }}>
                    ฿{mealPlan.price.toLocaleString()}
                  </Typography>
                  {mealPlan.originalPrice && (
                    <Typography sx={{
                      fontSize: '1rem',
                      color: '#9CA3AF',
                      textDecoration: 'line-through',
                      fontFamily: 'Prompt, sans-serif'
                    }}>
                      ฿{mealPlan.originalPrice.toLocaleString()}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Restaurant Info */}
            <Card sx={{ mb: 3, p: 2, bgcolor: '#F9FAFB' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={mealPlan.restaurant.image} sx={{ width: 40, height: 40 }}>
                  🏪
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontFamily: 'Prompt, sans-serif' }}>
                    {mealPlan.restaurant.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#F59E0B' }}>⭐</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#6B7280' }}>
                      {mealPlan.restaurant.rating}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>

            {/* Quantity & Start Date */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
              <Box>
                <Typography sx={{ 
                  fontWeight: 600, 
                  mb: 1, 
                  fontSize: '0.9rem',
                  fontFamily: 'Prompt, sans-serif' 
                }}>
                  จำนวน
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    size="small"
                    sx={{ border: '1px solid #E5E7EB' }}
                  >
                    <Remove />
                  </IconButton>
                  <Typography sx={{ 
                    minWidth: 40, 
                    textAlign: 'center', 
                    fontWeight: 600,
                    fontFamily: 'Prompt, sans-serif'
                  }}>
                    {quantity}
                  </Typography>
                  <IconButton 
                    onClick={() => setQuantity(quantity + 1)}
                    size="small"
                    sx={{ border: '1px solid #E5E7EB' }}
                  >
                    <Add />
                  </IconButton>
                </Box>
              </Box>

              <Box>
                <Typography sx={{ 
                  fontWeight: 600, 
                  mb: 1, 
                  fontSize: '0.9rem',
                  fontFamily: 'Prompt, sans-serif' 
                }}>
                  วันเริ่มต้น
                </Typography>
                <TextField
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  size="small"
                  fullWidth
                  InputProps={{
                    sx: { fontSize: '0.9rem' }
                  }}
                />
              </Box>
            </Box>

            {/* Delivery Time */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ 
                fontWeight: 600, 
                mb: 1, 
                fontSize: '0.9rem',
                fontFamily: 'Prompt, sans-serif' 
              }}>
                เวลาจัดส่ง (ทุกวัน)
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}
                >
                  {getDeliveryOptions().map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio size="small" />}
                      label={
                        <Typography sx={{ fontSize: '0.85rem', fontFamily: 'Prompt, sans-serif' }}>
                          {option.label}
                        </Typography>
                      }
                      sx={{ mr: 0 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography sx={{ 
              fontWeight: 600, 
              mb: 3, 
              fontSize: '1rem',
              fontFamily: 'Prompt, sans-serif' 
            }}>
              ข้อมูลการจัดส่ง
            </Typography>

            <TextField
              label="ชื่อผู้รับ"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              fullWidth
              margin="normal"
              size="small"
              InputProps={{
                startAdornment: <Person sx={{ color: '#6B7280', mr: 1 }} />,
              }}
            />

            <TextField
              label="เบอร์โทรศัพท์"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              fullWidth
              margin="normal"
              size="small"
              InputProps={{
                startAdornment: <Phone sx={{ color: '#6B7280', mr: 1 }} />,
              }}
            />

            <TextField
              label="ที่อยู่จัดส่ง"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              size="small"
              InputProps={{
                startAdornment: <LocationOn sx={{ color: '#6B7280', mr: 1, alignSelf: 'flex-start', mt: 0.5 }} />,
              }}
            />

            <TextField
              label="คำแนะนำพิเศษ (ไม่บังคับ)"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={2}
              size="small"
              placeholder="เช่น ไม่ใส่ผัก, ไม่เผ็ด, ฝากไว้หน้าบ้าน"
              InputProps={{
                startAdornment: <Note sx={{ color: '#6B7280', mr: 1, alignSelf: 'flex-start', mt: 0.5 }} />,
              }}
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography sx={{ 
              fontWeight: 600, 
              mb: 3, 
              fontSize: '1rem',
              fontFamily: 'Prompt, sans-serif' 
            }}>
              เลือกวิธีการชำระเงิน
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Card sx={{ mb: 2, border: paymentMethod === 'credit_card' ? '2px solid #10B981' : '1px solid #E5E7EB' }}>
                  <CardContent sx={{ p: 2 }}>
                    <FormControlLabel
                      value="credit_card"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CreditCard sx={{ color: '#6B7280' }} />
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontFamily: 'Prompt, sans-serif' }}>
                              บัตรเครดิต/เดบิต
                            </Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
                              Visa, Mastercard, JCB
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2, border: paymentMethod === 'promptpay' ? '2px solid #10B981' : '1px solid #E5E7EB' }}>
                  <CardContent sx={{ p: 2 }}>
                    <FormControlLabel
                      value="promptpay"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ fontSize: '1.5rem' }}>💳</Box>
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontFamily: 'Prompt, sans-serif' }}>
                              PromptPay
                            </Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
                              QR Code สแกนจ่าย
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </CardContent>
                </Card>

                <Card sx={{ border: paymentMethod === 'cash' ? '2px solid #10B981' : '1px solid #E5E7EB' }}>
                  <CardContent sx={{ p: 2 }}>
                    <FormControlLabel
                      value="cash"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ fontSize: '1.5rem' }}>💵</Box>
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontFamily: 'Prompt, sans-serif' }}>
                              เงินสด
                            </Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
                              ชำระเงินปลายทาง
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </CardContent>
                </Card>
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography sx={{ 
              fontWeight: 600, 
              mb: 3, 
              fontSize: '1rem',
              fontFamily: 'Prompt, sans-serif' 
            }}>
              สรุปคำสั่งซื้อ
            </Typography>

            {/* Order Summary */}
            <Card sx={{ mb: 3, p: 2, bgcolor: '#F9FAFB' }}>
              <Typography sx={{ fontWeight: 600, mb: 2, fontFamily: 'Prompt, sans-serif' }}>
                {mealPlan.name} x {quantity}
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, fontSize: '0.9rem' }}>
                <Typography>วันเริ่มต้น:</Typography>
                <Typography sx={{ fontWeight: 600 }}>{startDate}</Typography>
                
                <Typography>เวลาจัดส่ง:</Typography>
                <Typography sx={{ fontWeight: 600 }}>{deliveryTime} น.</Typography>
                
                <Typography>ที่อยู่:</Typography>
                <Typography sx={{ fontWeight: 600 }}>{address}</Typography>
                
                <Typography>ผู้รับ:</Typography>
                <Typography sx={{ fontWeight: 600 }}>{contactName} ({contactPhone})</Typography>
              </Box>
            </Card>

            {/* Price Breakdown */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>ราคาสินค้า ({quantity} คอร์ส)</Typography>
                <Typography>฿{subtotal.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>ค่าจัดส่ง</Typography>
                <Typography>฿{deliveryFee}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>ค่าบริการ</Typography>
                <Typography>฿{serviceFee}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.1rem' }}>
                <Typography sx={{ fontWeight: 600, fontFamily: 'Prompt, sans-serif' }}>รวมทั้งสิ้น</Typography>
                <Typography sx={{ fontWeight: 600, color: '#10B981', fontFamily: 'Prompt, sans-serif' }}>
                  ฿{total.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: '0.85rem', fontFamily: 'Prompt, sans-serif' }}>
                คำสั่งซื้อจะเริ่มจัดส่งในวันที่ {startDate} และจัดส่งต่อเนื่องตาม{getDurationText(mealPlan.duration)}
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      transitionDuration={400}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: '90vh',
          minHeight: '70vh',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }
      }}
      ModalProps={{
        sx: {
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important',
          },
        },
      }}
      SlideProps={{
        timeout: {
          enter: 400,
          exit: 350,
        },
        easing: {
          enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
          exit: 'cubic-bezier(0.4, 0, 0.6, 1)',
        },
      }}
    >
      <Box sx={{ p: 0, pb: 4, position: 'relative' }}>
        {/* Drag Handle */}
        <Box sx={{
          width: 40,
          height: 4,
          bgcolor: '#E5E7EB',
          borderRadius: 2,
          mx: 'auto',
          mt: 1.5,
          mb: 2,
          transition: 'all 0.2s ease',
          cursor: 'grab',
          '&:hover': {
            bgcolor: '#D1D5DB',
          },
        }} />
        
        <Box sx={{ px: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontFamily: 'Prompt, sans-serif', fontWeight: 600 }}>
            สั่งซื้อคอร์สอาหาร
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#6B7280' }}>
            <Close />
          </IconButton>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: '0.75rem',
                    fontFamily: 'Prompt, sans-serif',
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Box sx={{ mb: 4, minHeight: 300 }}>
          {renderStepContent()}
        </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                variant="outlined"
                sx={{
                  flex: 1,
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                ย้อนกลับ
              </Button>
            )}
            
            <Button
              onClick={activeStep === steps.length - 1 ? handleOrder : handleNext}
              variant="contained"
              disabled={
                (activeStep === 0 && !startDate) ||
                (activeStep === 1 && (!address || !contactName || !contactPhone)) ||
                (activeStep === 2 && !paymentMethod)
              }
              sx={{
                flex: 1,
                bgcolor: '#10B981',
                color: 'white',
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: '#059669',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                },
              }}
            >
              {activeStep === steps.length - 1 ? 'ยืนยันคำสั่งซื้อ' : 'ถัดไป'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
} 