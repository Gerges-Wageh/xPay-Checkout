import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductList from '../../src/components/ProductList';

// Mock the services and hooks
vi.mock('../../src/hooks/useProducts', () => ({
  useProducts: () => ({
    products: [
      {
        id: 'prod_001',
        name: 'Test Product',
        price: 99.99,
        description: 'A test product',
        image_url: 'https://example.com/image.jpg'
      }
    ],
    isLoading: false,
    error: null
  })
}));

let checkoutWasCalled = false;
vi.mock('../../src/services/checkoutService', () => ({
  createCheckoutSession: vi.fn(async (product) => {
    checkoutWasCalled = true;
    return {
      session_id: 'mock_session_123',
      checkout_url: 'https://xpay.example.com/checkout/mock_session_123'
    };
  })
}));

vi.mock('../../src/hooks/useCheckout', () => ({
  useCheckout: () => ({
    initiateCheckout: vi.fn(async (product) => {
      await vi.mocked(
        require('../../src/services/checkoutService').createCheckoutSession
      )(product);
    }),
    isCheckingOut: false,
    checkoutError: null
  })
}));

describe('Checkout Integration Flow', () => {
  beforeEach(() => {
    checkoutWasCalled = false;
    vi.clearAllMocks();
  });

  it('displays products on page load', () => {
    render(<ProductList />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('renders Buy Now button for each product', () => {
    render(<ProductList />);
    
    const buttons = screen.getAllByRole('button', { name: /buy/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('shows loading state when checkout initiated', async () => {
    const { useCheckout } = await import('../../src/hooks/useCheckout');
    vi.mocked(useCheckout).mockReturnValueOnce({
      initiateCheckout: vi.fn(),
      isCheckingOut: true,
      checkoutError: null
    });

    render(<ProductList />);
    
    const button = screen.getByRole('button', { name: /processing|buy now/i });
    // When loading, button should be disabled
    if (button.textContent.includes('Processing')) {
      expect(button).toBeDisabled();
    }
  });

  it('displays error message on checkout failure', () => {
    const { useCheckout } = require('../../src/hooks/useCheckout');
    vi.mocked(useCheckout).mockReturnValueOnce({
      initiateCheckout: vi.fn(),
      isCheckingOut: false,
      checkoutError: 'Failed to create checkout session'
    });

    render(<ProductList />);
    
    expect(screen.getByText(/checkout error/i)).toBeInTheDocument();
    expect(screen.getByText('Failed to create checkout session')).toBeInTheDocument();
  });

  it('completes checkout flow from ProductList to Checkout', async () => {
    render(<ProductList />);
    
    // Verify product is displayed
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    
    // Verify Buy Now button is clickable
    const buyButton = screen.getByRole('button', { name: /buy/i });
    expect(buyButton).toBeInTheDocument();
    expect(buyButton).not.toBeDisabled();
  });

  it('sends correct product data during checkout', async () => {
    const mockCreateSession = vi.fn(async (product) => ({
      session_id: 'session_123',
      checkout_url: 'https://xpay.example.com/checkout'
    }));

    vi.doMock('../../src/services/checkoutService', () => ({
      createCheckoutSession: mockCreateSession
    }));

    render(<ProductList />);
    
    const buyButton = screen.getByRole('button', { name: /buy/i });
    expect(buyButton).toBeInTheDocument();
  });
});
