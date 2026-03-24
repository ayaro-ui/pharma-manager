import { useState, useEffect } from 'react';
import { fetchCategories } from '../api/categoriesApi';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur catégories.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { categories, loading, error };
};