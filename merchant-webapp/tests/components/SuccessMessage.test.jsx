import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuccessMessage from '../SuccessMessage';

describe('SuccessMessage', () => {
  it('renders success message', () => {
    const mockOnContinue = vi.fn();
    render(<SuccessMessage onContinue={mockOnContinue} />);

    expect(screen.getByText(/payment successful/i)).toBeInTheDocument();
  });

  it('renders success icon', () => {
    const mockOnContinue = vi.fn();
    render(<SuccessMessage onContinue={mockOnContinue} />);

    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('renders Continue Shopping button', () => {
    const mockOnContinue = vi.fn();
    render(<SuccessMessage onContinue={mockOnContinue} />);

    const button = screen.getByRole('button', { name: /continue shopping/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onContinue when button clicked', async () => {
    const mockOnContinue = vi.fn();
    const { user } = render(<SuccessMessage onContinue={mockOnContinue} />);

    const button = screen.getByRole('button', { name: /continue shopping/i });
    await user.click(button);

    expect(mockOnContinue).toHaveBeenCalled();
  });

  it('displays confirmation text', () => {
    const mockOnContinue = vi.fn();
    render(<SuccessMessage onContinue={mockOnContinue} />);

    expect(
      screen.getByText(/you will receive a confirmation email/i)
    ).toBeInTheDocument();
  });

  it('displays confirmation as primary button', () => {
    const mockOnContinue = vi.fn();
    render(<SuccessMessage onContinue={mockOnContinue} />);

    const button = screen.getByRole('button', { name: /continue shopping/i });
    expect(button).toHaveClass('btn-primary');
  });

  it('has proper styling classes', () => {
    const mockOnContinue = vi.fn();
    const { container } = render(<SuccessMessage onContinue={mockOnContinue} />);

    const statusContainer = container.querySelector('.status-container');
    const statusContent = container.querySelector('.status-content');
    const statusTitle = container.querySelector('.status-title');

    expect(statusContainer).toBeInTheDocument();
    expect(statusContent).toBeInTheDocument();
    expect(statusTitle).toBeInTheDocument();
  });
});
