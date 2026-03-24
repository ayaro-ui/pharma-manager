import axiosInstance from './axiosConfig';

/**
 * Récupère la liste des médicaments actifs.
 * @param {Object} params - Filtres (search, categorie)
 */
export const fetchMedicaments = async (params = {}) => {
  const response = await axiosInstance.get('/medicaments/', { params });
  return response.data;
};

export const fetchMedicamentById = async (id) => {
  const response = await axiosInstance.get(`/medicaments/${id}/`);
  return response.data;
};

export const createMedicament = async (data) => {
  const response = await axiosInstance.post('/medicaments/', data);
  return response.data;
};

export const updateMedicament = async (id, data) => {
  const response = await axiosInstance.patch(`/medicaments/${id}/`, data);
  return response.data;
};

export const deleteMedicament = async (id) => {
  const response = await axiosInstance.delete(`/medicaments/${id}/`);
  return response.data;
};

export const fetchAlertes = async () => {
  const response = await axiosInstance.get('/medicaments/alertes/');
  return response.data;
};