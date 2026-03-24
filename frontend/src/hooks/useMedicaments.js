import { useState, useEffect } from 'react';
import { fetchMedicaments, fetchAlertes } from '../api/medicamentsApi';

export const useMedicaments = (filters = {}) => {
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMedicaments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMedicaments(filters);
      setMedicaments(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicaments();
  }, []);

  return { medicaments, loading, error, refetch: loadMedicaments };
};

export const useAlertes = () => {
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchAlertes();
        setAlertes(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur alertes.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { alertes, loading, error };
};