import { useState } from 'react';
import { createCheckoutSession } from '../services/checkoutService';
import { ERROR_MESSAGES } from '../constants';

export function useCheckout() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const initiateCheckout = async (product) => {
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      // Call checkout service
      const sessionData = await createCheckoutSession(product);

      // Redirect to checkout
      window.location.href = sessionData.checkout_url;
    } catch (err) {
      let errorMessage = ERROR_MESSAGES.SESSION_CREATION_FAILED;

      // Use error message from service or fallback
      if (err.message) {
        errorMessage = err.message;
      }

      console.error('Checkout initiation failed:', err);
      setCheckoutError(errorMessage);
      setIsCheckingOut(false);
    }
  };

  return { initiateCheckout, isCheckingOut, checkoutError };
}
