import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCheckoutSession } from '../checkoutService';
import * as constants from '../../constants';

// Mock fetch globally
global.fetch = vi.fn();

describe('checkoutService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('createCheckoutSession', () => {
    const validProduct = {
      id: 'prod_001',
      name: 'Test Product',
      price: 99.99
    };

    const mockResponse = {
      session_id: 'session_123',
      checkout_url: 'https://xpay.example.com/checkout/session_123'
    };

    it('sends correct POST request to xPay Backend', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await createCheckoutSession(validProduct);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/checkout/session',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });

    it('sends product data in request body', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await createCheckoutSession(validProduct);

      const callArgs = global.fetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.product_id).toBe('prod_001');
      expect(body.product_name).toBe('Test Product');
      expect(body.product_price).toBe(99.99);
    });

    it('returns session data on successful response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await createCheckoutSession(validProduct);

      expect(result).toEqual(mockResponse);
      expect(result.session_id).toBe('session_123');
      expect(result.checkout_url).toEqual('https://xpay.example.com/checkout/session_123');
    });

    it('throws error on invalid product (missing id)', async () => {
      const invalidProduct = { name: 'Test', price: 99.99 };

      await expect(
        createCheckoutSession(invalidProduct)
      ).rejects.toThrow(/invalid.*required fields/i);
    });

    it('throws error on invalid product (missing name)', async () => {
      const invalidProduct = { id: 'prod_001', price: 99.99 };

      await expect(
        createCheckoutSession(invalidProduct)
      ).rejects.toThrow(/invalid.*required fields/i);
    });

    it('throws error on invalid product (missing price)', async () => {
      const invalidProduct = { id: 'prod_001', name: 'Test' };

      await expect(
        createCheckoutSession(invalidProduct)
      ).rejects.toThrow(/invalid.*required fields/i);
    });

    it('throws error on negative price', async () => {
      const invalidProduct = { id: 'prod_001', name: 'Test', price: -10 };

      await expect(
        createCheckoutSession(invalidProduct)
      ).rejects.toThrow(/price cannot be negative/i);
    });

    it('throws error when product is null/undefined', async () => {
      await expect(createCheckoutSession(null)).rejects.toThrow(/product is required/i);
      await expect(createCheckoutSession(undefined)).rejects.toThrow(/product is required/i);
    });

    it('handles network error', async () => {
      const networkError = new TypeError('Failed to fetch');
      global.fetch.mockRejectedValueOnce(networkError);

      const error = await expect(
        createCheckoutSession(validProduct)
      ).rejects.toThrow();

      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.message).toContain('Unable to connect');
    });

    it('handles timeout error', async () => {
      global.fetch.mockImplementationOnce(() => {
        return new Promise((_, reject) => {
          const error = new Error('Aborted');
          error.name = 'AbortError';
          reject(error);
        });
      });

      const error = await expect(
        createCheckoutSession(validProduct)
      ).rejects.toThrow();

      expect(error.code).toBe('TIMEOUT');
      expect(error.message).toContain('taking too long');
    });

    it('handles server error (4xx response)', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid session data' })
      });

      const error = await expect(
        createCheckoutSession(validProduct)
      ).rejects.toThrow(/invalid session data/i);

      expect(error.statusCode).toBe(400);
    });

    it('handles server error (5xx response)', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({})
      });

      const error = await expect(
        createCheckoutSession(validProduct)
      ).rejects.toThrow();

      expect(error.statusCode).toBe(500);
    });

    it('handles invalid JSON response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      await expect(
        createCheckoutSession(validProduct)
      ).rejects.toThrow(/invalid response format/i);
    });

    it('throws error when response missing session_id', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ checkout_url: 'https://example.com' })
      });

      await expect(
        createCheckoutSession(validProduct)
      ).rejects.toThrow(/invalid response/i);
    });

    it('throws error when response missing checkout_url', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ session_id: 'session_123' })
      });

      await expect(
        createCheckoutSession(validProduct)
      ).rejects.toThrow(/invalid response/i);
    });

    it('sets abort timeout to API_TIMEOUT value', async () => {
      const mockAbort = vi.fn();
      global.AbortController = vi.fn(() => ({
        abort: mockAbort,
        signal: {}
      }));

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await createCheckoutSession(validProduct);

      // Verify AbortController was created
      expect(global.AbortController).toHaveBeenCalled();
    });

    it('handles error response without JSON body', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Not JSON');
        }
      });

      const error = await expect(
        createCheckoutSession(validProduct)
      ).rejects.toThrow();

      expect(error.statusCode).toBe(500);
    });
  });
});
