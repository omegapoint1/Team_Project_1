
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const INTERVENTIONS_ENDPOINT = '/interventions';

// Helper
const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');//upon reconsideration may not be necessary 
    //given previous authentication
    
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

        return await response.json();
    } catch (error) {
        console.error('Intervention API Error:', error);
        throw error;
    }
};

const convertInterventionFromAPI = (data) => ({
    id: data.id,
    name: data.name,
    category: data.category,
    description: data.description,
    costRange: {
        min: data.cost_min,
        max: data.cost_max
    },
    impactRange: {
        min: data.impact_min,
        max: data.impact_max
    },
    feasibility: data.feasibility,

    tags: data.tags || [],
    createdAt: data.created_at,
});

const convertInterventionToAPI = (data) => ({
    ...data,
    cost_min: data.costRange?.min,
    cost_max: data.costRange?.max,
    impact_min: data.impactRange?.min,
    impact_max: data.impactRange?.max,

    created_at: data.createdAt,
});

export const interventionService = {
    // get all interventions
    getAll: async (filters = {}) => {
        const queryString = new URLSearchParams(filters).toString();
        const url = `${API_URL}${INTERVENTIONS_ENDPOINT}${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetchWithAuth(url);
        return Array.isArray(response) ? response.map(convertInterventionFromAPI) : [];
    },



    // update intervention
    update: async (interventionId, updates) => {
        const response = await fetchWithAuth(`${API_URL}${INTERVENTIONS_ENDPOINT}/${interventionId}`, {
            method: 'PATCH',
            body: JSON.stringify(convertInterventionToAPI({
                ...updates,
                updatedAt: new Date().toISOString()
            }))
        });
        return convertInterventionFromAPI(response);
    },



};