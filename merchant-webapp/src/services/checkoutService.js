import { XPAY_BACKEND_URL, API_TIMEOUT, API_ENDPOINTS, ERROR_MESSAGES } from '../constants';

/**
 * Creates a checkout session with the xPay Backend
 * @param {Object} product - Product object { id, name, price }
 * @returns {Promise<{ session_id: string, checkout_url: string }>}
 * @throws {Error} If validation fails, network error, timeout, or server error
 */
export async function createCheckoutSession(product) {
  // Validate input
  if (!product) {
    throw new Error('Product is required');
  }

  if (!product.id || !product.name || product.price === undefined) {
    throw new Error('Invalid product: missing required fields (id, name, price)');
  }

  if (product.price < 0) {
    throw new Error('Invalid product: price cannot be negative');
  }

  // Prepare request
  const requestBody = {
    product_id: product.id,
    product_name: product.name,
    product_price: product.price
  };

  const url = `${XPAY_BACKEND_URL}${API_ENDPOINTS.CREATE_SESSION}`;

  try {
    // Setup timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    // Make request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    // Clear timeout
    clearTimeout(timeoutId);

    // Handle non-OK responses
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        // Response is not JSON, use generic error
      }

      const errorMessage = errorData.message || ERROR_MESSAGES.SERVER_ERROR;
      const error = new Error(errorMessage);
      error.statusCode = response.status;
      error.response = errorData;
      throw error;
    }

    // Parse success response
    let sessionData;
    try {
      sessionData = await response.json();
    } catch (err) {
      throw new Error('Invalid response format from checkout service');
    }

    // Validate response
    if (!sessionData.session_id || !sessionData.checkout_url) {
      throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
    }

    return {
      session_id: sessionData.session_id,
      checkout_url: sessionData.checkout_url
    };
  } catch (err) {
    // Handle specific error types
    if (err.name === 'AbortError') {
      const timeoutError = new Error(ERROR_MESSAGES.TIMEOUT);
      timeoutError.code = 'TIMEOUT';
      throw timeoutError;
    }

    if (err instanceof TypeError) {
      const networkError = new Error(ERROR_MESSAGES.NETWORK_ERROR);
      networkError.code = 'NETWORK_ERROR';
      throw networkError;
    }

    // Re-throw other errors (already wrapped)
    throw err;
  }
}
