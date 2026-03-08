import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useCheckout } from '../hooks/useCheckout';
import { useProducts } from '../hooks/useProducts';

function ProductList() {
  const { products, isLoading, error: loadError } = useProducts();
  const { initiateCheckout, isCheckingOut, checkoutError } = useCheckout();
  const [activeProductId, setActiveProductId] = useState(null);

  const handleBuyNow = async (product) => {
    setActiveProductId(product.id);
    await initiateCheckout(product);
    setActiveProductId(null);
  };

  if (loadError) {
    return (
      <div className="message message-error">
        <strong>Error loading products:</strong> {loadError}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-list empty">
        <p>No products available</p>
      </div>
    );
  }

  return (
    <>
      {checkoutError && (
        <div className="message message-error">
          <strong>Checkout Error:</strong> {checkoutError}
        </div>
      )}
      
      <div className="product-list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuyNow={handleBuyNow}
            isLoading={isCheckingOut && activeProductId === product.id}
          />
        ))}
      </div>
    </>
  );
}

export default ProductList;
