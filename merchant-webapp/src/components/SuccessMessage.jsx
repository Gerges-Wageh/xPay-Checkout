import { SUCCESS_MESSAGES } from '../constants';

function SuccessMessage({ onContinue }) {
  return (
    <div className="status-container">
      <div className="status-content">
        <div className="status-icon">✅</div>
        <h2 className="status-title">Payment Successful!</h2>
        <p className="status-message">
          {SUCCESS_MESSAGES.PAYMENT_SUCCESS}
        </p>
        <p style={{ fontSize: '0.9rem', color: '#999' }}>
          Your order has been confirmed. You will receive a confirmation email shortly.
        </p>
        <div className="status-actions">
          <button className="btn btn-primary" onClick={onContinue}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessMessage;
