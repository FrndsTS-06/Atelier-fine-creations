import { useState, useEffect, useCallback, useRef } from 'react';
import { productService } from '../services/productService';
import { Product, ProductFilterState } from '../types/product';
import { useDebounce } from './useDebounce';

export interface UseProductsOptions extends Partial<ProductFilterState> {
  page?: number;
  limit?: number;
}

export function useProducts(initialOptions?: UseProductsOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(initialOptions?.page || 1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const [filters, setFilters] = useState<Partial<ProductFilterState>>({
    category: 'all',
    purity: 'all',
    search: '',
    sortBy: 'featured',
    ...initialOptions,
  });

  const debouncedSearch = useDebounce(filters.search, 300);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(async () => {
    // Abort any ongoing in-flight request to eliminate duplicate/stale responses
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setIsOffline(false);

    try {
      const res = await productService.getProducts(
        {
          ...filters,
          search: debouncedSearch,
        },
        controller.signal
      );

      setProducts(res.items || []);
      setTotal(res.pagination?.total || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request superseded by newer search keystroke; do not overwrite state with aborted error
        return;
      }
      setIsOffline(Boolean(err.isOffline));
      setError(err.message || 'Unable to load atelier inventory.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.purity, filters.sortBy, filters.minPrice, filters.maxPrice, debouncedSearch]);

  useEffect(() => {
    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  const isEmpty = !loading && !error && products.length === 0;
  const isSuccess = !loading && !error;

  return {
    products,
    total,
    totalPages,
    page,
    setPage,
    loading,
    error,
    isOffline,
    isEmpty,
    isSuccess,
    filters,
    setFilters,
    refetch: fetchProducts,
  };
}
