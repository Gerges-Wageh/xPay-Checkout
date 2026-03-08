import { SUCCESS_MESSAGES } from '../constants';

function FailureMessage({ onContinue }) {
  return (
    <div className="status-container">
      <div className="status-content">
        <div className="status-icon">❌</div>
        <h2 className="status-title">Payment Failed</h2>
        <p className="status-message">
          {SUCCESS_MESSAGES.PAYMENT_FAILED}
        </p>
        <p style={{ fontSize: '0.9rem', color: '#999' }}>
          Your payment could not be processed. Please try again or contact support.
        </p>
        <div className="status-actions">
          <button className="btn btn-primary" onClick={onContinue}>
            Continue Shopping
          </button>
          <a href="mailto:support@xpay.com" className="btn btn-secondary">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

export default FailureMessage;
