import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductList from '../ProductList';

// Mock the useProducts hook
vi.mock('../../hooks/useProducts', () => ({
  useProducts: () => ({
    products: [
      {
        id: 'prod_001',
        name: 'Widget A',
        price: 49.99,
        description: 'Widget A description',
        image_url: 'https://example.com/a.jpg'
      },
      {
        id: 'prod_002',
        name: 'Widget B',
        price: 99.99,
        description: 'Widget B description',
        image_url: 'https://example.com/b.jpg'
      }
    ],
    isLoading: false,
    error: null
  })
}));

// Mock the useCheckout hook
vi.mock('../../hooks/useCheckout', () => ({
  useCheckout: () => ({
    initiateCheckout: vi.fn(),
    isCheckingOut: false,
    checkoutError: null
  })
}));

describe('ProductList', () => {
  it('renders list of products', () => {
    render(<ProductList />);

    expect(screen.getByText('Widget A')).toBeInTheDocument();
    expect(screen.getByText('Widget B')).toBeInTheDocument();
  });

  it('renders correct number of product cards', () => {
    render(<ProductList />);

    const buttons = screen.getAllByRole('button', { name: /buy/i });
    expect(buttons).toHaveLength(2);
  });

  it('displays product prices', () => {
    render(<ProductList />);

    expect(screen.getByText('$49.99')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('shows loading state while loading', () => {
    vi.mocked(useProducts).mockReturnValue({
      products: [],
      isLoading: true,
      error: null
    });

    render(<ProductList />);

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it('shows error message on load error', () => {
    vi.mocked(useProducts).mockReturnValue({
      products: [],
      isLoading: false,
      error: 'Failed to load products'
    });

    render(<ProductList />);

    expect(screen.getByText(/error loading products/i)).toBeInTheDocument();
  });

  it('shows empty message when no products', () => {
    vi.mocked(useProducts).mockReturnValue({
      products: [],
      isLoading: false,
      error: null
    });

    render(<ProductList />);

    expect(screen.getByText(/no products available/i)).toBeInTheDocument();
  });

  it('displays product descriptions', () => {
    render(<ProductList />);

    expect(screen.getByText('Widget A description')).toBeInTheDocument();
    expect(screen.getByText('Widget B description')).toBeInTheDocument();
  });
});
