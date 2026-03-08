function CheckoutButton({ product, isLoading = false, error = null, onCheckout }) {
  const handleClick = async () => {
    if (onCheckout) {
      await onCheckout(product);
    }
  };

  if (error) {
    return (
      <div className="checkout-button-container">
        <div className="message message-error">
          <strong>Checkout Error:</strong> {error}
        </div>
        <button
          className="btn btn-primary btn-block"
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <button
      className={`btn btn-primary btn-block ${isLoading ? 'loading' : ''}`}
      onClick={handleClick}
      disabled={isLoading}
      aria-label={`Buy ${product.name}`}
      aria-busy={isLoading}
    >
      {isLoading ? 'Processing...' : 'Buy Now'}
    </button>
  );
}

export default CheckoutButton;
