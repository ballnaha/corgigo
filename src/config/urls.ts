// URL Configuration
export const getBaseUrl = () => {
  // ใช้ environment variable หรือ default เป็น production URL
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://corgigo.treetelu.com';
};

export const getApiUrl = (endpoint: string) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// URLs สำหรับ LINE Login
export const getLineRedirectUri = () => {
  return getApiUrl('/api/auth/line-callback');
};

// URLs สำหรับ LIFF
export const getLiffUrl = () => {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID || '2007547134-GD56wM6Z';
  return `https://liff.line.me/${liffId}`;
};

export const getLiffLoginUrl = () => {
  return getApiUrl('/liff-login');
};

// Environment checking
export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

// Debug info
export const getUrlInfo = () => {
  return {
    baseUrl: getBaseUrl(),
    lineRedirectUri: getLineRedirectUri(),
    liffUrl: getLiffUrl(),
    liffLoginUrl: getLiffLoginUrl(),
    isProduction: isProduction(),
    isDevelopment: isDevelopment(),
  };
}; 