
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const INCIDENTS_ENDPOINT = '/incidents';

// Helpers
const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            }
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw {
                status: response.status,
                message: error.message || response.statusText,
                data: error
            };
        }

        if (response.status === 204) return null;
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

// 
const convertIncidentFromAPI = (data) => ({
    id: data.id,
    title: data.title,
    description: data.description,
    location: data.location,
    zone: data.zone,
    severity: data.severity,
    status: data.status,
    reportedAt: data.reported_at,
    attachments: data.attachments || []

});

const convertIncidentToAPI = (data) => ({
    ...data
});

export const incidentService = {
    // get all incidents
    getAll: async (filters = {}) => {
        const queryString = new URLSearchParams(filters).toString();
        const url = `${API_URL}${INCIDENTS_ENDPOINT}${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetchWithAuth(url);
        return Array.isArray(response) ? response.map(convertIncidentFromAPI) : [];
    },

    /*// get a single incident
    getById: async (incidentId) => {
        const response = await fetchWithAuth(`${API_URL}${INCIDENTS_ENDPOINT}/${incidentId}`);
        return convertIncidentFromAPI(response);
    },/=*/


    // update incident
    update: async (incidentId, updates) => {
        const response = await fetchWithAuth(`${API_URL}${INCIDENTS_ENDPOINT}/${incidentId}`, {
            method: 'PATCH',
            body: JSON.stringify(convertIncidentToAPI({
                ...updates,
            }))
        });
        return convertIncidentFromAPI(response);
    },

    // update incident status
    updateStatus: async (incidentId, status) => {
        const response = await fetchWithAuth(`${API_URL}${INCIDENTS_ENDPOINT}/${incidentId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ 
                status,
            })
        });
        return convertIncidentFromAPI(response);
    },



    // delete incident
    delete: async (incidentId) => {
        return await fetchWithAuth(`${API_URL}${INCIDENTS_ENDPOINT}/${incidentId}`, {
            method: 'DELETE'
        });
    },

    // get incidents by zone
    getByZone: async (zone) => {
        return incidentService.getAll({ zone });
    },

    // get incidents by status
    getByStatus: async (status) => {
        return incidentService.getAll({ status });
    },


};