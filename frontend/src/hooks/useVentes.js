import { useState, useEffect } from 'react';
import { fetchVentes } from '../api/ventesApi';

export const useVentes = () => {
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadVentes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVentes();
      setVentes(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVentes();
  }, []);

  return { ventes, loading, error, refetch: loadVentes };
};