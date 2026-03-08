// Configuration constants
export const XPAY_BACKEND_URL = import.meta.env.VITE_XPAY_BACKEND_URL || 'http://localhost:3001';
export const API_TIMEOUT = 10000; // 10 seconds
export const API_ENDPOINTS = {
  CREATE_SESSION: '/checkout/session'
};

// UI Constants
export const CURRENCY_SYMBOL = '$';
export const CURRENCY_DECIMAL_PLACES = 2;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to payment service. Check your internet.',
  TIMEOUT: 'Payment service is taking too long. Please try again.',
  SERVER_ERROR: 'Payment service encountered an error. Please try again.',
  INVALID_REQUEST: 'Invalid request. Please try again.',
  SESSION_CREATION_FAILED: 'Failed to create checkout session. Please try again.',
  INVALID_RESPONSE: 'Invalid response from payment service. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PAYMENT_SUCCESS: 'Payment successful. Thank you for your purchase!',
  PAYMENT_FAILED: 'Payment failed. Please try again.'
};
