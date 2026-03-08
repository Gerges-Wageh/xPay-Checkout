import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FailureMessage from '../FailureMessage';

describe('FailureMessage', () => {
  it('renders failure message', () => {
    const mockOnContinue = vi.fn();
    render(<FailureMessage onContinue={mockOnContinue} />);

    expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
  });

  it('renders failure icon', () => {
    const mockOnContinue = vi.fn();
    render(<FailureMessage onContinue={mockOnContinue} />);

    expect(screen.getByText('❌')).toBeInTheDocument();
  });

  it('renders Continue Shopping button', () => {
    const mockOnContinue = vi.fn();
    render(<FailureMessage onContinue={mockOnContinue} />);

    const button = screen.getByRole('button', { name: /continue shopping/i });
    expect(button).toBeInTheDocument();
  });

  it('renders Contact Support button', () => {
    render(<FailureMessage onContinue={vi.fn()} />);

    const link = screen.getByRole('link', { name: /contact support/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'mailto:support@xpay.com');
  });

  it('calls onContinue when Continue Shopping clicked', async () => {
    const mockOnContinue = vi.fn();
    const { user } = render(<FailureMessage onContinue={mockOnContinue} />);

    const button = screen.getByRole('button', { name: /continue shopping/i });
    await user.click(button);

    expect(mockOnContinue).toHaveBeenCalled();
  });

  it('displays retry instruction text', () => {
    render(<FailureMessage onContinue={vi.fn()} />);

    expect(
      screen.getByText(/please try again or contact support/i)
    ).toBeInTheDocument();
  });

  it('displays error message text', () => {
    render(<FailureMessage onContinue={vi.fn()} />);

    expect(screen.getByText(/your payment could not be processed/i)).toBeInTheDocument();
  });

  it('has proper styling classes', () => {
    const { container } = render(<FailureMessage onContinue={vi.fn()} />);

    const statusContainer = container.querySelector('.status-container');
    const statusContent = container.querySelector('.status-content');
    const statusTitle = container.querySelector('.status-title');

    expect(statusContainer).toBeInTheDocument();
    expect(statusContent).toBeInTheDocument();
    expect(statusTitle).toBeInTheDocument();
  });

  it('has buttons with correct styling', () => {
    render(<FailureMessage onContinue={vi.fn()} />);

    const continueBtn = screen.getByRole('button', { name: /continue shopping/i });
    const supportLink = screen.getByRole('link', { name: /contact support/i });

    expect(continueBtn).toHaveClass('btn-primary');
    expect(supportLink).toHaveClass('btn-secondary');
  });

  it('renders buttons in actions container', () => {
    const { container } = render(<FailureMessage onContinue={vi.fn()} />);

    const statusActions = container.querySelector('.status-actions');
    expect(statusActions).toBeInTheDocument();

    const buttons = statusActions.querySelectorAll('button, a');
    expect(buttons.length).toBe(2); // Continue and Contact Support
  });
});
