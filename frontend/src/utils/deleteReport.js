import api from '../utils/api';

// Delete a report by ID
export const deleteReport = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
  const res = await api.delete(`/reports/${id}`, config);
  return res.data;
};
