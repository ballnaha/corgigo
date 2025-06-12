'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Avatar,
  Fade,
  CircularProgress,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Person as PersonIcon,
  Moped as MopedIcon,
  Restaurant as RestaurantIcon,
  ArrowBack as ArrowBackIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import NoSSR from '@/components/NoSSR';

// Minimal Professional Theme
const theme = {
  primary: '#000000', // Pure Black
  secondary: '#FFFFFF', // Pure White  
  accent: '#FFD700', // Gold accent
  background: '#FAFAFA', // Very light gray
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E5E5E5',
  success: '#10B981',
};

const StyledContainer = styled(Container)(() => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem 1rem',
  background: `linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)`,
}));

const StyledCard = styled(Card)(() => ({
  maxWidth: 480,
  width: '100%',
  borderRadius: 12,
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  border: `1px solid ${theme.border}`,
  background: theme.surface,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
  },
}));

const RoleCard = styled(Card)<{ selected?: boolean }>(({ selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: selected ? `2px solid ${theme.primary}` : `1px solid ${theme.border}`,
  background: selected ? '#FAFAFA' : theme.surface,
  borderRadius: 8,
  '&:hover': {
    borderColor: selected ? theme.primary : theme.text,
  },
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    fontSize: '0.95rem',
    fontFamily: 'Prompt, sans-serif',
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: '#E8E8E8',
      borderWidth: 1.5,
    },
    '&:hover fieldset': {
      borderColor: '#D0D0D0',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.primary,
      borderWidth: 2,
      boxShadow: `0 0 0 3px rgba(0, 0, 0, 0.05)`,
    },
    '&.Mui-focused': {
      backgroundColor: theme.surface,
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Prompt, sans-serif',
    fontWeight: 400,
    color: theme.textSecondary,
    '&.Mui-focused': {
      color: theme.primary,
      fontWeight: 500,
    },
  },
  '& .MuiInputBase-input': {
    fontFamily: 'Prompt, sans-serif',
    '&::placeholder': {
      fontFamily: 'Prompt, sans-serif',
      opacity: 0.6,
    },
  },
});

const StyledButton = styled(Button)({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '1rem',
  fontFamily: 'Prompt, sans-serif',
  padding: '16px 32px',
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
});

const roles = [
  {
    value: 'CUSTOMER',
    label: 'ลูกค้า',
    description: 'สั่งอาหารออนไลน์',
    icon: PersonIcon,
  },
  {
    value: 'RIDER',
    label: 'ไรเดอร์',
    description: 'ส่งอาหาร รับรายได้',
    icon: MopedIcon,
  },
  {
    value: 'RESTAURANT',
    label: 'เจ้าของร้าน',
    description: 'ขายอาหารออนไลน์',
    icon: RestaurantIcon,
  },
];

const vehicleTypes = [
  'รถจักรยานยนต์',
  'รถยนต์',
  'จักรยาน',
];

const steps = ['เลือกประเภท', 'ข้อมูลส่วนตัว', 'ข้อมูลเพิ่มเติม'];

// Validation Schemas
const phoneRegex = /^(\+66[\s]?[6-9][\s]?[0-9]{4}[\s]?[0-9]{4}|0[6-9][0-9][\-\s]?[0-9]{3}[\-\s]?[0-9]{4})$/;

const baseObjectSchema = z.object({
  firstName: z.string()
    .min(1, 'กรุณากรอกชื่อ')
    .min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(50, 'ชื่อต้องไม่เกิน 50 ตัวอักษร'),
  lastName: z.string()
    .min(1, 'กรุณากรอกนามสกุล')
    .min(2, 'นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(50, 'นามสกุลต้องไม่เกิน 50 ตัวอักษร'),
  email: z.string()
    .min(1, 'กรุณากรอกอีเมล')
    .email('รูปแบบอีเมลไม่ถูกต้อง'),
  phone: z.string()
    .regex(phoneRegex, 'รูปแบบเบอร์โทรไม่ถูกต้อง (ตัวอย่าง: 0812345678)'),
  password: z.string()
    .min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
    .max(100, 'รหัสผ่านต้องไม่เกิน 100 ตัวอักษร'),
  confirmPassword: z.string()
    .min(1, 'กรุณายืนยันรหัสผ่าน'),
});

const baseSchema = baseObjectSchema.refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

const riderObjectSchema = baseObjectSchema.extend({
  licenseNumber: z.string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: "เลขที่ใบขับขี่ต้องมีอย่างน้อย 8 ตัวอักษร"
    }),
  vehicleType: z.string().optional(),
  vehicleNumber: z.string()
    .optional()
    .refine((val) => !val || /^[ก-ฮ0-9\s-]+$/.test(val), {
      message: "รูปแบบทะเบียนรถไม่ถูกต้อง"
    }),
  bankName: z.string().optional(),
  bankAccount: z.string()
    .optional()
    .refine((val) => !val || /^[0-9]{10,15}$/.test(val), {
      message: "เลขที่บัญชีต้องเป็นตัวเลข 10-15 หลัก"
    }),
});

const riderSchema = riderObjectSchema.refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

const restaurantObjectSchema = baseObjectSchema.extend({
  restaurantName: z.string()
    .min(1, 'กรุณากรอกชื่อร้าน')
    .min(2, 'ชื่อร้านต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(100, 'ชื่อร้านต้องไม่เกิน 100 ตัวอักษร'),
  restaurantDescription: z.string()
    .max(500, 'คำอธิบายต้องไม่เกิน 500 ตัวอักษร')
    .optional(),
  restaurantAddress: z.string()
    .min(1, 'กรุณากรอกที่อยู่ร้าน')
    .min(10, 'ที่อยู่ต้องมีอย่างน้อย 10 ตัวอักษร')
    .max(200, 'ที่อยู่ต้องไม่เกิน 200 ตัวอักษร'),
  restaurantPhone: z.string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: "รูปแบบเบอร์โทรร้านไม่ถูกต้อง"
    }),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
});

const restaurantSchema = restaurantObjectSchema.refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

// Helper functions
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Handle different patterns
  if (digits.startsWith('66')) {
    // +66 format
    const number = digits.substring(2);
    if (number.length <= 1) return '+66';
    if (number.length <= 2) return `+66 ${number}`;
    if (number.length <= 5) return `+66 ${number.substring(0, 1)} ${number.substring(1)}`;
    if (number.length <= 8) return `+66 ${number.substring(0, 1)} ${number.substring(1, 5)} ${number.substring(5)}`;
    return `+66 ${number.substring(0, 1)} ${number.substring(1, 5)} ${number.substring(5, 9)}`;
  } else if (digits.startsWith('0')) {
    // 0 format
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.substring(0, 3)}-${digits.substring(3)}`;
    if (digits.length <= 10) return `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6)}`;
    return `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
  } else {
    // Other formats
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.substring(0, 3)}-${digits.substring(3)}`;
    return `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
  }
};

export default function RegisterClient() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Restaurant fields
    restaurantName: '',
    restaurantDescription: '',
    restaurantAddress: '',
    restaurantPhone: '',
    openTime: '',
    closeTime: '',
    // Rider fields
    licenseNumber: '',
    vehicleType: '',
    vehicleNumber: '',
    bankAccount: '',
    bankName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setActiveStep(1);
  };

  const handleChange = (field: string) => (e: any) => {
    let value = e.target.value;
    
    // Format phone numbers
    if (field === 'phone' || field === 'restaurantPhone') {
      value = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateCurrentStep = () => {
    let schema;
    
    if (activeStep === 1) {
      schema = baseSchema;
    } else if (activeStep === 2) {
      if (selectedRole === 'RIDER') {
        schema = riderSchema;
      } else if (selectedRole === 'RESTAURANT') {
        schema = restaurantSchema;
      } else {
        schema = baseSchema;
      }
    }
    
    if (!schema) return true;
    
    try {
      schema.parse(formData);
      setValidationErrors({});
      setError('');
      return true;
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {};
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path[0];
          if (field && !fieldErrors[field]) {
            fieldErrors[field] = err.message;
          }
        });
      }
      
      setValidationErrors(fieldErrors);
      setError('');
      return false;
    }
  };

  const handleNext = () => {
    if (activeStep === 1) {
      if (!validateCurrentStep()) {
        return;
      }
      
      if (selectedRole === 'CUSTOMER') {
        handleSubmit();
      } else {
        setActiveStep(2);
      }
    } else if (activeStep === 2) {
      if (!validateCurrentStep()) {
        return;
      }
      handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    setError('');
  };

  const handleSubmit = async () => {
    // Validate data before submission
    if (!validateCurrentStep()) {
      setLoading(false);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาด');
      }

      // Success - redirect to success page
      const params = new URLSearchParams({
        role: selectedRole,
        firstName: formData.firstName,
      });
      router.push(`/auth/success?${params.toString()}`);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <Fade in={activeStep === 0}>
      <Box>
        <Box textAlign="center" mb={5}>
          <Typography 
            variant="h2" 
            fontWeight="400" 
            color={theme.text} 
            mb={1}
            sx={{ 
              letterSpacing: '-0.03em',
              fontFamily: 'Prompt, sans-serif',
              fontSize: { xs: '2rem', sm: '2.5rem' }
            }}
          >
            CorgiGo
          </Typography>
          <Typography 
            variant="h6" 
            color={theme.textSecondary}
            sx={{ 
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 300,
              fontSize: '1.1rem'
            }}
          >
            เลือกประเภทของคุณ
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap={1.5}>
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <RoleCard
                key={role.value}
                selected={selectedRole === role.value}
                onClick={() => handleRoleSelect(role.value)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={3}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: selectedRole === role.value ? theme.primary : '#F5F5F5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        border: selectedRole === role.value ? 'none' : '1px solid #E8E8E8',
                      }}
                    >
                      <IconComponent 
                        sx={{ 
                          fontSize: 24,
                          color: selectedRole === role.value ? theme.secondary : theme.text,
                        }} 
                      />
                    </Box>
                    <Box flex={1}>
                      <Typography 
                        variant="h6" 
                        fontWeight="500" 
                        mb={0.5}
                        sx={{ 
                          fontFamily: 'Prompt, sans-serif',
                          fontSize: '1.1rem'
                        }}
                      >
                        {role.label}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color={theme.textSecondary}
                        sx={{ 
                          fontFamily: 'Prompt, sans-serif',
                          fontSize: '0.9rem'
                        }}
                      >
                        {role.description}
                      </Typography>
                    </Box>
                    {selectedRole === role.value && (
                      <CheckIcon 
                        sx={{ 
                          fontSize: 24, 
                          color: theme.success,
                          fontWeight: 'bold'
                        }} 
                      />
                    )}
                  </Box>
                </CardContent>
              </RoleCard>
            );
          })}
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box textAlign="center">
          <Typography variant="body2" color={theme.textSecondary} sx={{fontFamily:'Prompt, sans-serif'}}>
            มีบัญชีอยู่แล้ว?{' '}
            <Link 
              href="/auth/simple-login" 
              sx={{ 
                color: theme.primary,
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              เข้าสู่ระบบ
            </Link>
          </Typography>
        </Box>
      </Box>
    </Fade>
  );

  const renderPersonalInfo = () => (
    <Fade in={activeStep === 1}>
      <Box>
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton 
            onClick={handleBack} 
            sx={{ 
              mr: 2,
              p: 1,
              '&:hover': { backgroundColor: theme.background }
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Box flex={1}>
            <Typography variant="h5" fontWeight="400" color={theme.text} sx={{fontFamily:'Prompt, sans-serif'}}>
              ข้อมูลส่วนตัว
            </Typography>
            <Typography variant="body2" color={theme.textSecondary} sx={{fontFamily:'Prompt, sans-serif'}}>
              กรอกข้อมูลพื้นฐาน
            </Typography>
          </Box>
          
          {/* แสดงประเภทที่เลือก */}
          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.8,
              backgroundColor: theme.primary,
              color: theme.secondary,
              borderRadius: 6,
              fontSize: '0.8rem',
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 500,
            }}
          >
            {(() => {
              const role = roles.find(r => r.value === selectedRole);
              if (!role) return null;
              const IconComponent = role.icon;
              return (
                <>
                  <IconComponent sx={{ fontSize: 16 }} />
                  <span>{role.label}</span>
                </>
              );
            })()}
          </Box>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 1,
              border: '1px solid #FEE2E2',
              backgroundColor: '#FEF2F2'
            }}
          >
            {error}
          </Alert>
        )}

                <StyledTextField
          fullWidth
          label="ชื่อ"
          value={formData.firstName}
          onChange={handleChange('firstName')}
          required
          size="medium"
          sx={{ mb: 3 }}
          error={!!validationErrors.firstName}
          helperText={validationErrors.firstName}
        />

        <StyledTextField
          fullWidth
          label="นามสกุล"
          value={formData.lastName}
          onChange={handleChange('lastName')}
          required
          size="medium"
          sx={{ mb: 3 }}
          error={!!validationErrors.lastName}
          helperText={validationErrors.lastName}
        />

        <StyledTextField
          fullWidth
          label="อีเมล"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          sx={{ mb: 3 }}
          required
          size="medium"
          error={!!validationErrors.email}
          helperText={validationErrors.email}
        />

        <StyledTextField
          fullWidth
          label="เบอร์โทรศัพท์"
          value={formData.phone}
          onChange={handleChange('phone')}
          sx={{ mb: 3 }}
          required
          size="medium"
          error={!!validationErrors.phone}
          helperText={validationErrors.phone || 'ตัวอย่าง: 081-234-5678'}
          placeholder="081-234-5678"
        />

        <StyledTextField
          fullWidth
          label="รหัสผ่าน"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange('password')}
          required
          size="medium"
          sx={{ mb: 3 }}
          error={!!validationErrors.password}
          helperText={validationErrors.password || 'อย่างน้อย 6 ตัวอักษร'}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ p: 1 }}
              >
                {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
              </IconButton>
            ),
          }}
        />
        
        <StyledTextField
          fullWidth
          label="ยืนยันรหัสผ่าน"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          required
          size="medium"
          sx={{ mb: 4 }}
          error={!!validationErrors.confirmPassword}
          helperText={validationErrors.confirmPassword}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
                sx={{ p: 1 }}
              >
                {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
              </IconButton>
            ),
          }}
        />

        <StyledButton
          fullWidth
          variant="contained"
          onClick={handleNext}
          sx={{
            bgcolor: theme.primary,
            color: theme.secondary,
            '&:hover': {
              bgcolor: '#333333',
            },
          }}
        >
          {selectedRole === 'CUSTOMER' ? 'สมัครสมาชิก' : 'ต่อไป'}
        </StyledButton>
      </Box>
    </Fade>
  );

  const renderAdditionalInfo = () => (
    <Fade in={activeStep === 2}>
      <Box>
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton 
            onClick={handleBack} 
            sx={{ 
              mr: 2,
              p: 1,
              '&:hover': { backgroundColor: theme.background }
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Box flex={1}>
            <Typography variant="h5" fontWeight="400" color={theme.text} sx={{fontFamily:'Prompt, sans-serif'}}>
              ข้อมูลเพิ่มเติม
            </Typography>
            <Typography variant="body2" color={theme.textSecondary} sx={{fontFamily:'Prompt, sans-serif'}}>
              {selectedRole === 'RESTAURANT' ? 'ข้อมูลร้านอาหาร' : 'ข้อมูลไรเดอร์'}
            </Typography>
          </Box>
          
          {/* แสดงประเภทที่เลือก */}
          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.8,
              backgroundColor: theme.primary,
              color: theme.secondary,
              borderRadius: 6,
              fontSize: '0.8rem',
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 500,
            }}
          >
            {(() => {
              const role = roles.find(r => r.value === selectedRole);
              if (!role) return null;
              const IconComponent = role.icon;
              return (
                <>
                  <IconComponent sx={{ fontSize: 16 }} />
                  <span>{role.label}</span>
                </>
              );
            })()}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {selectedRole === 'RESTAURANT' && (
          <Box>
            <StyledTextField
              fullWidth
              label="ชื่อร้าน"
              value={formData.restaurantName}
              onChange={handleChange('restaurantName')}
              sx={{ mb: 2 }}
              required
              error={!!validationErrors.restaurantName}
              helperText={validationErrors.restaurantName}
            />
            <StyledTextField
              fullWidth
              label="คำอธิบายร้าน"
              value={formData.restaurantDescription}
              onChange={handleChange('restaurantDescription')}
              multiline
              rows={3}
              sx={{ mb: 2 }}
              error={!!validationErrors.restaurantDescription}
              helperText={validationErrors.restaurantDescription || 'อธิบายประเภทอาหารและจุดเด่นของร้าน'}
            />
            <StyledTextField
              fullWidth
              label="ที่อยู่ร้าน"
              value={formData.restaurantAddress}
              onChange={handleChange('restaurantAddress')}
              multiline
              rows={2}
              sx={{ mb: 2 }}
              required
              error={!!validationErrors.restaurantAddress}
              helperText={validationErrors.restaurantAddress}
            />
            <StyledTextField
              fullWidth
              label="เบอร์โทรร้าน (ถ้าต่างจากเบอร์ส่วนตัว)"
              value={formData.restaurantPhone}
              onChange={handleChange('restaurantPhone')}
              sx={{ mb: 2 }}
              error={!!validationErrors.restaurantPhone}
              helperText={validationErrors.restaurantPhone || 'เว้นว่างไว้หากใช้เบอร์เดียวกัน'}
              placeholder="081-234-5678"
            />
            
            <StyledTextField
              fullWidth
              label="เวลาเปิด (เช่น 08:00)"
              type="time"
              value={formData.openTime}
              onChange={handleChange('openTime')}
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            
            <StyledTextField
              fullWidth
              label="เวลาปิด (เช่น 22:00)"
              type="time"
              value={formData.closeTime}
              onChange={handleChange('closeTime')}
              sx={{ mb: 3 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        )}

        {selectedRole === 'RIDER' && (
          <Box>
            <StyledTextField
              fullWidth
              label="เลขที่ใบขับขี่"
              value={formData.licenseNumber}
              onChange={handleChange('licenseNumber')}
              sx={{ mb: 2 }}
              error={!!validationErrors.licenseNumber}
              helperText={validationErrors.licenseNumber || 'เว้นว่างไว้หากยังไม่มี'}
              placeholder="12345678"
            />
            
            <Typography variant="body2" color={theme.textSecondary} mb={2}>
              ประเภทยานพาหนะ
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              {vehicleTypes.map((vehicle) => (
                <Chip
                  key={vehicle}
                  label={vehicle}
                  clickable
                  variant="outlined"
                  onClick={() => setFormData(prev => ({ ...prev, vehicleType: vehicle }))}
                  sx={{
                    borderColor: formData.vehicleType === vehicle ? theme.primary : theme.border,
                    backgroundColor: formData.vehicleType === vehicle ? theme.primary : 'transparent',
                    color: formData.vehicleType === vehicle ? theme.secondary : theme.text,
                    borderWidth: 1,
                    '&:hover': {
                      borderColor: theme.primary,
                      backgroundColor: formData.vehicleType === vehicle ? '#333333' : theme.background,
                    },
                    '&:focus': {
                      backgroundColor: formData.vehicleType === vehicle ? theme.primary : theme.background,
                    },
                  }}
                />
              ))}
            </Box>
            
            <StyledTextField
              fullWidth
              label="หมายเลขทะเบียน"
              value={formData.vehicleNumber}
              onChange={handleChange('vehicleNumber')}
              sx={{ mb: 2 }}
              error={!!validationErrors.vehicleNumber}
              helperText={validationErrors.vehicleNumber || 'เว้นว่างไว้หากยังไม่มี'}
              placeholder="1กก 1234"
            />
            
            <StyledTextField
              fullWidth
              label="ชื่อธนาคาร"
              value={formData.bankName}
              onChange={handleChange('bankName')}
              sx={{ mb: 2 }}
              error={!!validationErrors.bankName}
              helperText={validationErrors.bankName || 'เว้นว่างไว้หากยังไม่มี'}
              placeholder="ธนาคารกสิกรไทย"
            />
            
            <StyledTextField
              fullWidth
              label="เลขที่บัญชี"
              value={formData.bankAccount}
              onChange={handleChange('bankAccount')}
              sx={{ mb: 3 }}
              error={!!validationErrors.bankAccount}
              helperText={validationErrors.bankAccount || 'เว้นว่างไว้หากยังไม่มี'}
              placeholder="1234567890"
            />
          </Box>
        )}

        <StyledButton
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            bgcolor: theme.primary,
            color: theme.secondary,
            '&:hover': {
              bgcolor: '#333333',
            },
            '&:disabled': {
              bgcolor: theme.border,
              color: theme.textSecondary,
            },
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'สมัครสมาชิก'
          )}
        </StyledButton>
      </Box>
    </Fade>
  );

  return (
    <NoSSR>
      <StyledContainer maxWidth="sm">
        <StyledCard>
          <CardContent sx={{ p: { xs: 4, sm: 5 }, '&:last-child': { pb: { xs: 4, sm: 5 } } }}>
            {/* Progress Stepper */}
            {activeStep > 0 && (
              <Box sx={{ mb: 4 }}>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  {steps.slice(1).map((label, index) => (
                    <Typography 
                      key={label}
                      variant="caption" 
                      color={index === activeStep - 1 ? theme.primary : theme.textSecondary}
                      sx={{ 
                        fontWeight: index === activeStep - 1 ? 500 : 400,
                        fontFamily: 'Prompt, sans-serif',
                      }}
                    >
                      {label}
                    </Typography>
                  ))}
                </Box>
                <Box 
                  sx={{ 
                    height: 2, 
                    backgroundColor: theme.border,
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <Box 
                    sx={{ 
                      height: '100%',
                      backgroundColor: theme.primary,
                      width: `${((activeStep - 1) / (steps.length - 2)) * 100}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Step Content */}
            {activeStep === 0 && renderRoleSelection()}
            {activeStep === 1 && renderPersonalInfo()}
            {activeStep === 2 && renderAdditionalInfo()}
          </CardContent>
        </StyledCard>
      </StyledContainer>
    </NoSSR>
  );
} 