'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton,
  Card,
  CardContent,
  Chip,
  Avatar,
  CircularProgress
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { 
  ArrowBack, 
  ShoppingCart, 
  Add,
  Remove,
  Delete
} from '@mui/icons-material';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { items: cartItems, itemCount, totalPrice, updateQuantity, removeItem, isLoaded } = useCart();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'white',
        borderBottom: '1px solid #F0F0F0',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        <IconButton 
          onClick={() => router.back()}
          sx={{ color: '#1A1A1A' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Prompt, sans-serif',
            fontWeight: 600,
            color: '#1A1A1A',
            flex: 1
          }}
        >
          ตะกร้าสินค้า
        </Typography>
        {cartItems.length > 0 && (
          <Chip 
            label={`${itemCount} รายการ`}
            size="small"
            sx={{
              bgcolor: '#F8A66E',
              color: 'white',
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 500
            }}
          />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        bgcolor: '#F8F9FA',
        '&::-webkit-scrollbar': { display: 'none' },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none'
      }}>
        {!isLoaded ? (
          // Loading State
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            px: 3,
            textAlign: 'center'
          }}>
            <CircularProgress 
              size={48} 
              sx={{ color: '#F8A66E', mb: 2 }} 
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                color: '#666',
                mb: 1,
              }}
            >
              กำลังโหลดตะกร้าสินค้า...
            </Typography>
          </Box>
        ) : cartItems.length === 0 ? (
          // Empty Cart
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            px: 3,
            textAlign: 'center'
          }}>
            <Box sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: '#F0F0F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}>
              <ShoppingCart sx={{ fontSize: 60, color: '#BDBDBD' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                color: '#666',
                mb: 1,
              }}
            >
              ตะกร้าสินค้าว่างเปล่า
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Prompt, sans-serif',
                color: '#999',
                mb: 4,
                lineHeight: 1.6
              }}
            >
              เพิ่มอาหารที่คุณต้องการ{'\n'}ลงในตะกร้าเพื่อสั่งซื้อ
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/')}
              sx={{
                bgcolor: '#10B981',
                color: 'white',
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#059669',
                },
              }}
            >
              เลือกอาหาร
            </Button>
          </Box>
        ) : (
          // Cart Items
          <Box sx={{ p: 2 }}>
            {cartItems.map((item) => (
              <Card key={item.id} sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Item Image */}
                    <Avatar
                      src={item.image}
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: 2,
                        bgcolor: '#F0F0F0'
                      }}
                    >
                      🍽️
                    </Avatar>

                    {/* Item Details */}
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{
                        fontFamily: 'Prompt, sans-serif',
                        fontWeight: 600,
                        color: '#1F2937',
                        fontSize: '0.95rem',
                        mb: 0.5
                      }}>
                        {item.name}
                      </Typography>
                      <Typography sx={{
                        fontFamily: 'Prompt, sans-serif',
                        color: '#6B7280',
                        fontSize: '0.8rem',
                        mb: 1
                      }}>
                        {item.restaurantName}
                      </Typography>

                      {/* Add-ons */}
                      {item.addOns && item.addOns.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                          {item.addOns.map((addOn, index) => (
                            <Typography
                              key={addOn.id}
                              sx={{
                                fontFamily: 'Prompt, sans-serif',
                                fontSize: '0.75rem',
                                color: '#10B981',
                                fontWeight: 500,
                              }}
                            >
                              + {addOn.name} (+฿{addOn.price})
                            </Typography>
                          ))}
                        </Box>
                      )}

                      {/* Special Instructions */}
                      {item.specialInstructions && (
                        <Typography sx={{
                          fontFamily: 'Prompt, sans-serif',
                          fontSize: '0.75rem',
                          color: '#F59E0B',
                          fontStyle: 'italic',
                          mb: 1
                        }}>
                          หมายเหตุ: {item.specialInstructions}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{
                          fontFamily: 'Prompt, sans-serif',
                          fontWeight: 600,
                          color: '#10B981',
                          fontSize: '0.9rem'
                        }}>
                          ฿{(() => {
                            const basePrice = item.price;
                            const addOnsPrice = item.addOns?.reduce((sum, addOn) => sum + addOn.price, 0) || 0;
                            const totalItemPrice = (basePrice + addOnsPrice) * item.quantity;
                            return totalItemPrice.toLocaleString();
                          })()}
                        </Typography>
                        
                        {/* Quantity Controls */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton 
                            size="small"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            sx={{ 
                              bgcolor: '#F3F4F6',
                              '&:hover': { bgcolor: '#E5E7EB' }
                            }}
                          >
                            <Remove sx={{ fontSize: 16 }} />
                          </IconButton>
                          <Typography sx={{
                            fontFamily: 'Prompt, sans-serif',
                            fontWeight: 600,
                            minWidth: 24,
                            textAlign: 'center'
                          }}>
                            {item.quantity}
                          </Typography>
                          <IconButton 
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            sx={{ 
                              bgcolor: '#F3F4F6',
                              '&:hover': { bgcolor: '#E5E7EB' }
                            }}
                          >
                            <Add sx={{ fontSize: 16 }} />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={() => removeItem(item.id)}
                            sx={{ 
                              color: '#EF4444',
                              ml: 1,
                              '&:hover': { bgcolor: '#FEF2F2' }
                            }}
                          >
                            <Delete sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}

            {/* Summary */}
            <Card sx={{ 
              mt: 3, 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #10B981'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography sx={{
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: '#1F2937'
                  }}>
                    ยอดรวมทั้งหมด
                  </Typography>
                  <Typography sx={{
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    color: '#10B981'
                  }}>
                    ฿{totalPrice.toLocaleString()}
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: '#10B981',
                    color: 'white',
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 600,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      bgcolor: '#059669',
                    },
                  }}
                  onClick={() => {
                    // TODO: Navigate to checkout
                    console.log('Proceed to checkout');
                  }}
                >
                  สั่งซื้อทันที ({itemCount} รายการ)
                </Button>
              </CardContent>
            </Card>

            {/* Bottom Spacing */}
            <Box sx={{ height: 20 }} />
          </Box>
        )}
      </Box>
    </Box>
  );
} 