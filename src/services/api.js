import toast from 'react-hot-toast';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        
        // Handle 401 Unauthorized
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
        }

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.detail || 'Something went wrong';
            throw new Error(errorMsg);
        }

        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        toast.error(error.message || 'Network error occurred');
        throw error;
    }
};

const api = {
    get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
    
    // Special case for login (OAuth2PasswordRequestForm)
    auth: async (credentials) => {
        const form = new URLSearchParams();
        form.append('username', credentials.email);
        form.append('password', credentials.password);

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: form.toString()
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Login failed');
            return data;
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    },

    // Forgot Password flow
    forgotPassword: (email) => apiRequest('/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (token, newPassword) => apiRequest('/reset-password', { method: 'POST', body: JSON.stringify({ token, new_password: newPassword }) }),

    // Special case for multipart/form-data (disease detection)
    upload: async (endpoint, formData) => {
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                throw new Error('Session expired');
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Upload failed');
            return data;
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    }
};

export default api;
