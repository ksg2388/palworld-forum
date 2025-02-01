export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:18080';

export const API_ENDPOINTS = {
  SEND_VERIFICATION: '/auth/send-verification-code',
  VERIFY_CODE: '/auth/verify-code',
  SIGNUP: '/members',
  LOGIN: '/auth/login',
} as const; 