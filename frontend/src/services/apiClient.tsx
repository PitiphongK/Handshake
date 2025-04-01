import axios from 'axios';

// Set CSRF defaults for Axios
axios.defaults.xsrfCookieName = 'csrftoken';  // Name of the CSRF cookie
axios.defaults.xsrfHeaderName = 'X-CSRFToken';  // Header name for CSRF token

const authToken = localStorage.getItem('authToken');

const apiClient = axios.create({
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export default apiClient;