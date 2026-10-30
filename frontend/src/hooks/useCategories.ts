import { useState, useEffect, useCallback, useRef } from 'react';
import { categoryService } from '../services/categoryService';
import { Category } from '../types/category';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCategories = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setIsOffline(false);

    try {
      const data = await categoryService.getCategories(controller.signal);
      setCategories(data || []);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setIsOffline(Boolean(err.isOffline));
      setError(err.message || 'Unable to retrieve collections.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCategories]);

  const isEmpty = !loading && !error && categories.length === 0;
  const isSuccess = !loading && !error;

  return {
    categories,
    loading,
    error,
    isOffline,
    isEmpty,
    isSuccess,
    refetch: fetchCategories,
  };
}
