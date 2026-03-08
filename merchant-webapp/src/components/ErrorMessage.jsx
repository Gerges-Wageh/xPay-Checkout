function ErrorMessage({ error, onRetry, showRetry = true }) {
  return (
    <div className="message message-error" role="alert">
      <strong>Error:</strong> {error}
      {showRetry && onRetry && (
        <button
          className="btn btn-primary btn-small"
          onClick={onRetry}
          style={{ marginLeft: '1rem' }}
          aria-label="Retry action"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
