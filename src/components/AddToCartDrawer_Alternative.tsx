'use client';

import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Chip,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Grow,
  Backdrop,
} from '@mui/material';
import {
  Close,
  Add,
  Remove,
  ShoppingCart,
  CheckCircle,
  Star,
  LocalFireDepartment,
  FitnessCenter,
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
}

interface AddToCartDrawerProps {
  open: boolean;
  onClose: () => void;
  item: MenuItem | null;
}

export default function AddToCartDrawerAlternative({ open, onClose, item }: AddToCartDrawerProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);

  if (!item) return null;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: item.restaurant.id,
      restaurantName: item.restaurant.name,
      type: 'MENU_ITEM',
      specialInstructions: specialInstructions || undefined,
    }, quantity);

    setSuccessOpen(true);
    onClose();
    
    // Reset form
    setTimeout(() => {
      setQuantity(1);
      setSpecialInstructions('');
    }, 300);
  };

  const totalPrice = item.price * quantity;
  const discountPercent = item.originalPrice 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
                 BackdropProps={{
           timeout: 400,
           sx: {
             backgroundColor: 'rgba(0, 0, 0, 0.8)',
             backdropFilter: 'blur(12px)',
             WebkitBackdropFilter: 'blur(12px)',
             transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1) !important',
           },
         }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
                 <Grow 
           in={open} 
           timeout={{
             enter: 400,
             exit: 300,
           }}
           style={{ 
             transformOrigin: 'center center',
             transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
           }}
         >
                     <Card
             sx={{
               width: '100%',
               maxWidth: 400,
               maxHeight: '95vh',
               overflow: 'hidden',
               borderRadius: 4,
               outline: 'none',
               position: 'relative',
               boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
               background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
               transform: 'translateZ(0)', // Force GPU acceleration
               willChange: 'transform, opacity', // Optimize for animation
             }}
           >
            {/* Header Image */}
            {item.image && (
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={item.image}
                  sx={{
                    width: '100%',
                    height: 240,
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 50%)',
                  }}
                />
                <IconButton
                  onClick={onClose}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            )}

            <CardContent sx={{ p: 3 }}>
              {/* Item Info */}
              <Typography sx={{
                fontWeight: 700,
                fontSize: '1.4rem',
                color: '#1F2937',
                fontFamily: 'Prompt, sans-serif',
                mb: 1,
                lineHeight: 1.2
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

              {/* Restaurant & Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{
                  fontSize: '0.85rem',
                  color: '#6B7280',
                  fontFamily: 'Prompt, sans-serif'
                }}>
                  {item.restaurant.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ fontSize: '1rem', color: '#F59E0B' }} />
                  <Typography sx={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#F59E0B',
                    fontFamily: 'Prompt, sans-serif'
                  }}>
                    {item.restaurant.rating}
                  </Typography>
                </Box>
              </Box>

              {/* Price */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography sx={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: '#10B981',
                  fontFamily: 'Prompt, sans-serif'
                }}>
                  ฿{item.price.toLocaleString()}
                </Typography>
                {item.originalPrice && (
                  <>
                    <Typography sx={{
                      fontSize: '1.1rem',
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
                        bgcolor: '#FEE2E2',
                        color: '#DC2626',
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }}
                    />
                  </>
                )}
              </Box>

              {/* Nutrition Pills */}
              {(item.calories || item.protein) && (
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  {item.calories && (
                    <Chip
                      icon={<LocalFireDepartment />}
                      label={`${item.calories} แคล`}
                      size="small"
                      sx={{
                        bgcolor: '#FEF3C7',
                        color: '#D97706',
                        fontSize: '0.75rem',
                        fontFamily: 'Prompt, sans-serif',
                        '& .MuiChip-icon': { color: '#D97706' }
                      }}
                    />
                  )}
                  {item.protein && (
                    <Chip
                      icon={<FitnessCenter />}
                      label={`${item.protein}g โปรตีน`}
                      size="small"
                      sx={{
                        bgcolor: '#EDE9FE',
                        color: '#7C3AED',
                        fontSize: '0.75rem',
                        fontFamily: 'Prompt, sans-serif',
                        '& .MuiChip-icon': { color: '#7C3AED' }
                      }}
                    />
                  )}
                </Box>
              )}

              {/* Quantity Selector */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                bgcolor: '#F9FAFB',
                borderRadius: 3,
                p: 2,
                mb: 3,
              }}>
                <Typography sx={{
                  fontWeight: 600,
                  color: '#1F2937',
                  fontFamily: 'Prompt, sans-serif'
                }}>
                  จำนวน
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    size="small"
                    sx={{
                      bgcolor: quantity <= 1 ? '#E5E7EB' : '#10B981',
                      color: quantity <= 1 ? '#9CA3AF' : 'white',
                      '&:hover': {
                        bgcolor: quantity <= 1 ? '#E5E7EB' : '#059669',
                      }
                    }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  
                  <Typography sx={{
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: '#1F2937',
                    fontFamily: 'Prompt, sans-serif',
                    minWidth: 24,
                    textAlign: 'center'
                  }}>
                    {quantity}
                  </Typography>
                  
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    size="small"
                    sx={{
                      bgcolor: '#10B981',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#059669',
                      }
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Special Instructions */}
              <TextField
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="คำสั่งพิเศษ (ถ้ามี)"
                multiline
                rows={2}
                fullWidth
                variant="outlined"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#F9FAFB',
                    '& fieldset': {
                      borderColor: '#E5E7EB',
                    },
                    '&:hover fieldset': {
                      borderColor: '#10B981',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#10B981',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'Prompt, sans-serif',
                    fontSize: '0.9rem',
                  },
                }}
              />

              {/* Add to Cart Button */}
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
                  fontWeight: 700,
                  py: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: '#059669',
                    boxShadow: '0 12px 32px rgba(16, 185, 129, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                  },
                }}
              >
                เพิ่มลงตะกร้า • ฿{totalPrice.toLocaleString()}
              </Button>
            </CardContent>
          </Card>
        </Grow>
      </Modal>

      {/* Success Notification */}
      <Snackbar
        open={successOpen}
        autoHideDuration={2500}
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
          เพิ่มลงตะกร้าแล้ว! 🎉
        </Alert>
      </Snackbar>
    </>
  );
} 