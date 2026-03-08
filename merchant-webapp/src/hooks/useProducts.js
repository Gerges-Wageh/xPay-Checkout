import { useState, useEffect } from 'react';
import productsData from '../data/products.json';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        
        if (!productsData || !productsData.products || !Array.isArray(productsData.products)) {
          throw new Error('Invalid product data format');
        }

        setProducts(productsData.products);
        setError(null);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, isLoading, error };
}
