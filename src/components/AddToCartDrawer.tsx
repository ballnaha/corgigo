'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Chip,
  Avatar,
  Divider,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Close,
  Add,
  Remove,
  LocalFireDepartment,
  FitnessCenter,
  ShoppingCart,
  CheckCircle,
  Star,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  calories?: number;
  protein?: number;
  tags?: string[];
  restaurant: {
    id: string;
    name: string;
    rating: number;
  };
  // เพิ่ม add-ons
  addOns?: Array<{
    id: string;
    name: string;
    price: number;
    description?: string;
  }>;
}

interface AddToCartDrawerProps {
  open: boolean;
  onClose: () => void;
  item: MenuItem | null;
}

export default function AddToCartDrawer({ open, onClose, item }: AddToCartDrawerProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      // เปิด modal ทันที แต่ให้ animation delay นิดหน่อย
      setIsVisible(true);
    } else {
      // ปิด modal หลัง animation เสร็จ
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!item) return null;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    const selectedAddOnsData = item.addOns?.filter(addOn => 
      selectedAddOns.includes(addOn.id)
    ) || [];

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: item.restaurant.id,
      restaurantName: item.restaurant.name,
      type: 'MENU_ITEM',
      specialInstructions: specialInstructions || undefined,
      addOns: selectedAddOnsData,
    }, quantity);

    setSuccessOpen(true);
    onClose();
    
    // Reset form
    setTimeout(() => {
      setQuantity(1);
      setSpecialInstructions('');
      setSelectedAddOns([]);
    }, 300);
  };

  const addOnsPrice = selectedAddOns.reduce((total, addOnId) => {
    const addOn = item.addOns?.find(a => a.id === addOnId);
    return total + (addOn?.price || 0);
  }, 0);

  const itemTotalPrice = (item.price + addOnsPrice) * quantity;
  const discountPercent = item.originalPrice 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  return (
    <>
      <Modal
        open={isVisible}
        onClose={onClose}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          p: 0,
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            opacity: open ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            bgcolor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            outline: 'none',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 -4px 40px rgba(0, 0, 0, 0.15)',
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            // Smooth animation using pure CSS
            transform: open 
              ? 'translateY(0px) scale(1)' 
              : 'translateY(100%) scale(0.98)',
            opacity: open ? 1 : 0,
            transition: open 
              ? 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' // เข้า: smooth และเป็นธรรมชาติ
              : 'all 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53)', // ออก: เร็วและ decisive
            transformOrigin: 'center bottom',
            willChange: 'transform, opacity',
          }}
        >
          {/* Pull Indicator */}
          <Box sx={{
            width: 36,
            height: 4,
            bgcolor: '#E5E7EB',
            borderRadius: 2,
            mx: 'auto',
            mt: 1.5,
            mb: 2,
            transition: 'background-color 0.2s ease',
          }} />
          
          {/* Header */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            pb: 2,
          }}>
            <Typography sx={{
              fontSize: '1.2rem',
              fontWeight: 600,
              fontFamily: 'Prompt, sans-serif',
              color: '#1F2937'
            }}>
              เพิ่มลงตะกร้า
            </Typography>
            <IconButton 
              onClick={onClose} 
              size="small"
              sx={{
                bgcolor: '#F3F4F6',
                '&:hover': { bgcolor: '#E5E7EB' },
                transition: 'all 0.2s ease',
              }}
            >
              <KeyboardArrowDown sx={{ color: '#6B7280' }} />
            </IconButton>
          </Box>

          {/* Content - Scrollable */}
          <Box sx={{ 
            flex: 1,
            overflowY: 'auto',
            px: 3,
            pb: 1,
            // คำนวณ height: 90vh - pull indicator - header - footer
            minHeight: 0, // สำคัญ: ให้ flex item สามารถหดได้
          }}>
            {/* Item Image & Info */}
            <Box sx={{ mb: 3 }}>
              {item.image && (
                <Box
                  component="img"
                  src={item.image}
                  sx={{
                    width: '100%',
                    height: 200,
                    borderRadius: 3,
                    objectFit: 'cover',
                    mb: 2,
                  }}
                />
              )}
              
              <Typography sx={{
                fontWeight: 600,
                fontSize: '1.3rem',
                color: '#1F2937',
                fontFamily: 'Prompt, sans-serif',
                mb: 1,
                lineHeight: 1.3
              }}>
                {item.name}
              </Typography>
              
              <Typography sx={{
                fontSize: '0.9rem',
                color: '#6B7280',
                fontFamily: 'Prompt, sans-serif',
                lineHeight: 1.5,
                mb: 2,
              }}>
                {item.description}
              </Typography>

              {/* Restaurant Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography sx={{
                  fontSize: '0.85rem',
                  color: '#6B7280',
                  fontFamily: 'Prompt, sans-serif'
                }}>
                  จาก {item.restaurant.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ fontSize: '0.9rem', color: '#F59E0B' }} />
                  <Typography sx={{
                    fontSize: '0.8rem',
                    color: '#6B7280',
                    fontFamily: 'Prompt, sans-serif'
                  }}>
                    {item.restaurant.rating}
                  </Typography>
                </Box>
              </Box>

              {/* Price */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography sx={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#10B981',
                  fontFamily: 'Prompt, sans-serif'
                }}>
                  ฿{item.price.toLocaleString()}
                </Typography>
                {item.originalPrice && (
                  <>
                    <Typography sx={{
                      fontSize: '1rem',
                      color: '#9CA3AF',
                      textDecoration: 'line-through',
                      fontFamily: 'Prompt, sans-serif'
                    }}>
                      ฿{item.originalPrice.toLocaleString()}
                    </Typography>
                    <Chip
                      label={`-${discountPercent}%`}
                      size="small"
                      sx={{
                        bgcolor: '#FEF3C7',
                        color: '#D97706',
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }}
                    />
                  </>
                )}
              </Box>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  {item.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.7rem',
                        fontFamily: 'Prompt, sans-serif',
                        borderColor: '#E5E7EB',
                        color: '#6B7280'
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Quantity Selector */}
            <Box sx={{
              mb: 3,
              bgcolor: '#F9FAFB',
              borderRadius: 3,
              p: 3,
            }}>
              <Typography sx={{
                fontWeight: 600,
                mb: 2,
                color: '#1F2937',
                fontFamily: 'Prompt, sans-serif'
              }}>
                จำนวน
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  sx={{
                    bgcolor: quantity <= 1 ? '#F3F4F6' : '#10B981',
                    color: quantity <= 1 ? '#9CA3AF' : 'white',
                    boxShadow: quantity <= 1 ? 'none' : '0 2px 8px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: quantity <= 1 ? '#F3F4F6' : '#059669',
                      boxShadow: quantity <= 1 ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.4)',
                      transform: quantity <= 1 ? 'none' : 'translateY(-1px)',
                    }
                  }}
                >
                  <Remove />
                </IconButton>
                
                <Typography sx={{
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  minWidth: 40,
                  textAlign: 'center',
                  fontFamily: 'Prompt, sans-serif'
                }}>
                  {quantity}
                </Typography>
                
                <IconButton
                  onClick={() => handleQuantityChange(1)}
                  sx={{
                    bgcolor: '#10B981',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#059669',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  <Add />
                </IconButton>
              </Box>
            </Box>

            {/* Add-ons */}
            {item.addOns && item.addOns.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: '#1F2937',
                  fontFamily: 'Prompt, sans-serif'
                }}>
                  เพิ่มเติม (ตัวเลือก)
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {item.addOns.map((addOn) => (
                    <Box
                      key={addOn.id}
                      onClick={() => {
                        setSelectedAddOns(prev => 
                          prev.includes(addOn.id)
                            ? prev.filter(id => id !== addOn.id)
                            : [...prev, addOn.id]
                        );
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: selectedAddOns.includes(addOn.id) ? '#F0FDF4' : '#F9FAFB',
                        border: selectedAddOns.includes(addOn.id) ? '2px solid #10B981' : '1px solid #E5E7EB',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: selectedAddOns.includes(addOn.id) ? '#ECFDF5' : '#F3F4F6',
                          borderColor: '#10B981',
                        }
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          color: '#1F2937',
                          fontFamily: 'Prompt, sans-serif',
                          mb: addOn.description ? 0.5 : 0,
                        }}>
                          {addOn.name}
                        </Typography>
                        {addOn.description && (
                          <Typography sx={{
                            fontSize: '0.8rem',
                            color: '#6B7280',
                            fontFamily: 'Prompt, sans-serif'
                          }}>
                            {addOn.description}
                          </Typography>
                        )}
                      </Box>
                      <Typography sx={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: '#10B981',
                        fontFamily: 'Prompt, sans-serif',
                        ml: 2,
                      }}>
                        +฿{addOn.price}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Special Instructions */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{
                fontWeight: 600,
                mb: 2,
                color: '#1F2937',
                fontFamily: 'Prompt, sans-serif'
              }}>
                คำสั่งพิเศษ (ไม่จำเป็น)
              </Typography>
              <TextField
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="เช่น ไม่ใส่ผัก, เผ็ดน้อย, ฯลฯ"
                multiline
                rows={1}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: '#F9FAFB',
                    fontFamily: 'Prompt, sans-serif',
                    fontSize: '0.95rem',
                    '& fieldset': {
                      borderColor: '#E5E7EB',
                    },
                    '&:hover fieldset': {
                      borderColor: '#10B981',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#10B981',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'Prompt, sans-serif',
                    padding: '16px !important',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    fontFamily: 'Prompt, sans-serif',
                    fontSize: '0.9rem',
                    color: '#9CA3AF',
                  }
                }}
              />
            </Box>

            {/* Nutrition Info */}
            {(item.calories || item.protein) && (
              <Box sx={{
                mb: 3,
                bgcolor: '#F9FAFB',
                borderRadius: 3,
                p: 3,
              }}>
                <Typography sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: '#1F2937',
                  fontFamily: 'Prompt, sans-serif'
                }}>
                  ข้อมูลโภชนาการ
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  {item.calories && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalFireDepartment sx={{ fontSize: '1.1rem', color: '#EF4444' }} />
                      <Typography sx={{
                        fontSize: '0.85rem',
                        fontFamily: 'Prompt, sans-serif'
                      }}>
                        {item.calories} แคล
                      </Typography>
                    </Box>
                  )}
                  {item.protein && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FitnessCenter sx={{ fontSize: '1.1rem', color: '#8B5CF6' }} />
                      <Typography sx={{
                        fontSize: '0.85rem',
                        fontFamily: 'Prompt, sans-serif'
                      }}>
                        {item.protein}g โปรตีน
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>

          {/* Footer - Fixed at bottom */}
          <Box sx={{
            flexShrink: 0, // ไม่ให้ footer หด
            p: 3,
            pb: 4,
            borderTop: '1px solid #F0F0F0',
            bgcolor: 'white',
            background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleAddToCart}
              startIcon={<ShoppingCart />}
              sx={{
                bgcolor: '#10B981',
                color: 'white',
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                py: 1.8,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem',
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
              เพิ่มลงตะกร้า - ฿{itemTotalPrice.toLocaleString()}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Success Notification */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccessOpen(false)} 
          severity="success" 
          sx={{ 
            width: '100%',
            fontFamily: 'Prompt, sans-serif',
            bgcolor: '#10B981',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
          icon={<CheckCircle />}
        >
          เพิ่ม {item.name} ลงตะกร้าแล้ว!
        </Alert>
      </Snackbar>
    </>
  );
} 