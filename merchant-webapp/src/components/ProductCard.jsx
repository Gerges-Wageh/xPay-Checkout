import { CURRENCY_SYMBOL, CURRENCY_DECIMAL_PLACES } from '../constants';

function ProductCard({ product, onBuyNow, isLoading = false }) {
  const formattedPrice = (product.price).toFixed(CURRENCY_DECIMAL_PLACES);

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect fill="%23f0f0f0" width="300" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="%23999">Image unavailable</text></svg>';
  };

  return (
    <div className="product-card">
      <img
        src={product.image_url}
        alt={product.name}
        className="product-image"
        onError={handleImageError}
        loading="lazy"
      />
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          {CURRENCY_SYMBOL}{formattedPrice}
        </div>
        <p className="product-description">{product.description}</p>
        <div className="product-actions">
          <button
            className={`btn btn-primary btn-block ${isLoading ? 'loading' : ''}`}
            onClick={() => onBuyNow(product)}
            disabled={isLoading}
            aria-label={`Buy ${product.name}`}
            aria-busy={isLoading}
          >
            {isLoading ? 'Processing...' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
