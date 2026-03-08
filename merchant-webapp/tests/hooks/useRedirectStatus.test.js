import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRedirectStatus } from '../useRedirectStatus';

describe('useRedirectStatus', () => {
  it('returns null when no redirect status in URL', () => {
    const { result } = renderHook(() => useRedirectStatus());
    expect(result.current).toBeNull();
  });

  it('parses success=true from URL', () => {
    // Mock window.location.search
    delete window.location;
    window.location = { search: '?success=true' };

    const { result } = renderHook(() => useRedirectStatus());

    expect(result.current).not.toBeNull();
    expect(result.current.success).toBe(true);
  });

  it('parses success=false from URL', () => {
    delete window.location;
    window.location = { search: '?success=false' };

    const { result } = renderHook(() => useRedirectStatus());

    expect(result.current).not.toBeNull();
    expect(result.current.success).toBe(false);
  });

  it('parses session_id from URL', () => {
    delete window.location;
    window.location = { search: '?success=true&session_id=sess_123' };

    const { result } = renderHook(() => useRedirectStatus());

    expect(result.current.sessionId).toBe('sess_123');
  });

  it('parses message from URL', () => {
    delete window.location;
    window.location = { search: '?success=true&message=order_confirmed' };

    const { result } = renderHook(() => useRedirectStatus());

    expect(result.current.message).toBe('order_confirmed');
  });

  it('parses all parameters together', () => {
    delete window.location;
    window.location = {
      search: '?success=true&session_id=sess_456&message=thanks'
    };

    const { result } = renderHook(() => useRedirectStatus());

    expect(result.current.success).toBe(true);
    expect(result.current.sessionId).toBe('sess_456');
    expect(result.current.message).toBe('thanks');
  });

  it('handles URL with other parameters', () => {
    delete window.location;
    window.location = {
      search: '?utm_source=email&success=true&utm_medium=newsletter'
    };

    const { result } = renderHook(() => useRedirectStatus());

    expect(result.current.success).toBe(true);
  });

  it('handles empty URL search', () => {
    delete window.location;
    window.location = { search: '' };

    const { result } = renderHook(() => useRedirectStatus());

    expect(result.current).toBeNull();
  });
});
