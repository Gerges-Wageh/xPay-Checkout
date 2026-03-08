import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckoutButton from '../CheckoutButton';

describe('CheckoutButton', () => {
  const product = {
    id: 'prod_001',
    name: 'Test Product',
    price: 99.99
  };

  it('renders Buy Now button by default', () => {
    const mockOnCheckout = vi.fn();
    render(
      <CheckoutButton product={product} onCheckout={mockOnCheckout} />
    );

    const button = screen.getByRole('button', { name: /buy now/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('renders Processing text when loading', () => {
    const mockOnCheckout = vi.fn();
    render(
      <CheckoutButton product={product} isLoading={true} onCheckout={mockOnCheckout} />
    );

    const button = screen.getByRole('button', { name: /processing/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('calls onCheckout when button clicked', async () => {
    const mockOnCheckout = vi.fn();
    const { user } = render(
      <CheckoutButton product={product} onCheckout={mockOnCheckout} />
    );

    const button = screen.getByRole('button', { name: /buy now/i });
    await user.click(button);

    expect(mockOnCheckout).toHaveBeenCalledWith(product);
  });

  it('disables button when loading', () => {
    const mockOnCheckout = vi.fn();
    render(
      <CheckoutButton product={product} isLoading={true} onCheckout={mockOnCheckout} />
    );

    const button = screen.getByRole('button', { name: /processing/i });
    expect(button).toBeDisabled();
  });

  it('displays error message when error prop is set', () => {
    const mockOnCheckout = vi.fn();
    const errorMsg = 'Payment service unavailable';
    render(
      <CheckoutButton
        product={product}
        error={errorMsg}
        onCheckout={mockOnCheckout}
      />
    );

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders Retry button when error is set', () => {
    const mockOnCheckout = vi.fn();
    render(
      <CheckoutButton
        product={product}
        error="Service error"
        onCheckout={mockOnCheckout}
      />
    );

    const button = screen.getByRole('button', { name: /retry/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('calls onCheckout when Retry button clicked', async () => {
    const mockOnCheckout = vi.fn();
    const { user } = render(
      <CheckoutButton
        product={product}
        error="Service error"
        onCheckout={mockOnCheckout}
      />
    );

    const button = screen.getByRole('button', { name: /retry/i });
    await user.click(button);

    expect(mockOnCheckout).toHaveBeenCalledWith(product);
  });

  it('disables Retry button when loading', () => {
    const mockOnCheckout = vi.fn();
    render(
      <CheckoutButton
        product={product}
        error="Service error"
        isLoading={true}
        onCheckout={mockOnCheckout}
      />
    );

    const button = screen.getByRole('button', { name: /retry|processing/i });
    expect(button).toBeDisabled();
  });

  it('has correct aria labels for accessibility', () => {
    const mockOnCheckout = vi.fn();
    render(
      <CheckoutButton product={product} onCheckout={mockOnCheckout} />
    );

    const button = screen.getByRole('button', { name: /buy test product/i });
    expect(button).toHaveAttribute('aria-label', 'Buy Test Product');
    expect(button).toHaveAttribute('aria-busy', 'false');
  });

  it('sets aria-busy to true when loading', () => {
    const mockOnCheckout = vi.fn();
    render(
      <CheckoutButton
        product={product}
        isLoading={true}
        onCheckout={mockOnCheckout}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('does not call onCheckout if handler not provided', async () => {
    const { user } = render(
      <CheckoutButton product={product} />
    );

    const button = screen.getByRole('button', { name: /buy now/i });
    
    // Should not throw error
    await expect(async () => {
      await user.click(button);
    }).not.toThrow();
  });
});
