import axiosInstance from './axiosConfig';

export const fetchCategories = async () => {
  const response = await axiosInstance.get('/categories/');
  return response.data;
};

export const createCategorie = async (data) => {
  const response = await axiosInstance.post('/categories/', data);
  return response.data;
};