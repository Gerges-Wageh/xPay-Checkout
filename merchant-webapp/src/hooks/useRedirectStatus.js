import { useState, useEffect } from 'react';

export function useRedirectStatus() {
  const [redirectStatus, setRedirectStatus] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const sessionId = params.get('session_id');
    const message = params.get('message');

    if (success !== null) {
      setRedirectStatus({
        success: success === 'true',
        sessionId,
        message
      });
    }
  }, []);

  return redirectStatus;
}
