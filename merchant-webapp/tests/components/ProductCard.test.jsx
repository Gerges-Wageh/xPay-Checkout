import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '../ProductCard';

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const product = {
      id: 'prod_001',
      name: 'Test Widget',
      price: 99.99,
      description: 'A test widget product',
      image_url: 'https://example.com/image.jpg'
    };
    const mockOnBuyNow = vi.fn();

    render(<ProductCard product={product} onBuyNow={mockOnBuyNow} />);

    expect(screen.getByText('Test Widget')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('A test widget product')).toBeInTheDocument();
  });

  it('renders image with correct src', () => {
    const product = {
      id: 'prod_001',
      name: 'Test Widget',
      price: 99.99,
      description: 'A test widget product',
      image_url: 'https://example.com/image.jpg'
    };
    const mockOnBuyNow = vi.fn();

    render(<ProductCard product={product} onBuyNow={mockOnBuyNow} />);

    const image = screen.getByAltText('Test Widget');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders Buy Now button', () => {
    const product = {
      id: 'prod_001',
      name: 'Test Widget',
      price: 99.99,
      description: 'A test widget product',
      image_url: 'https://example.com/image.jpg'
    };
    const mockOnBuyNow = vi.fn();

    render(<ProductCard product={product} onBuyNow={mockOnBuyNow} />);

    const button = screen.getByRole('button', { name: /buy/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onBuyNow with product when button clicked', async () => {
    const product = {
      id: 'prod_001',
      name: 'Test Widget',
      price: 99.99,
      description: 'A test widget product',
      image_url: 'https://example.com/image.jpg'
    };
    const mockOnBuyNow = vi.fn();

    const { user } = render(<ProductCard product={product} onBuyNow={mockOnBuyNow} />);

    const button = screen.getByRole('button', { name: /buy/i });
    await user.click(button);

    expect(mockOnBuyNow).toHaveBeenCalledWith(product);
  });

  it('formats price with correct decimal places', () => {
    const product = {
      id: 'prod_001',
      name: 'Test Widget',
      price: 50,
      description: 'A test widget product',
      image_url: 'https://example.com/image.jpg'
    };
    const mockOnBuyNow = vi.fn();

    render(<ProductCard product={product} onBuyNow={mockOnBuyNow} />);

    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });
});
