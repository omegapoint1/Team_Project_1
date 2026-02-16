
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const INTERVENTIONS_ENDPOINT = '/interventions';
const STORAGE_KEY = 'interventions';

// Helper
const fetchAPI = async (url, options = {}) => {
    
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
const convertInterventionFromAPI = (data) => ({
    id: data.id,
    name: data.name,
    category: data.category,
    description: data.description,
    cost: data.cost,                    
    impact: data.impact,                 
    feasibility: data.feasibility,
    tags: data.tags || [],
    created_at: data.created_at
});

const convertInterventionToAPI = (data) => ({
    id: data.id,
    name: data.name,
    category: data.category,
    description: data.description,
    cost: data.cost || [data.costRange?.min, data.costRange?.max],
    impact: data.impact || [data.impactRange?.min, data.impactRange?.max],
    feasibility: data.feasibility,
    tags: data.tags,
    created_at: data.created_at || data.createdAt
});

export const interventionServerService = {
    // get all interventions
    getAll: async (filters = {}) => {
        const queryString = new URLSearchParams(filters).toString();
        const url = `${API_URL}${INTERVENTIONS_ENDPOINT}${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetchAPI(url);
        return Array.isArray(response) ? response.map(convertInterventionFromAPI) : [];
    },
    create: async (interventionData) => {
        const response = await fetchAPI(`${API_URL}${INTERVENTIONS_ENDPOINT}`, {
            method: 'POST',
            body: JSON.stringify(convertInterventionToAPI(interventionData))
        });
        return convertInterventionFromAPI(response);
    },


    update: async (updatedIntervention) => {
        const response = await fetchAPI(`${API_URL}${INTERVENTIONS_ENDPOINT}/${updatedIntervention.id}`, {
            method: 'PUT',
            body: JSON.stringify(convertInterventionToAPI(updatedIntervention))
        });
        return convertInterventionFromAPI(response);
    },

    delete: async (interventionId) => {
        return await fetchAPI(`${API_URL}${INTERVENTIONS_ENDPOINT}/${interventionId}`, {
            method: 'DELETE'
        });
    },



};
export const interventionLocalService = {
    getAll: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.log('Error reading interventions:', error);
            return [];
        }
    },

    saveAll: (interventions) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(interventions));
            return true;
        } catch (error) {
            console.log('Error saving interventions:', error);
            return false;
        }
    },

    create: (intervention) => {
        const interventions = interventionLocalService.getAll();
        const newIntervention = {
            ...intervention,
            id: intervention.id || generateId()
        };
        interventions.push(newIntervention);
        interventionLocalService.saveAll(interventions);
        return newIntervention;
    },

    update: (updatedIntervention) => {
        const interventions = interventionLocalService.getAll();
        const index = interventions.findIndex(i => i.id === updatedIntervention.id);
        if (index === -1) return null;
        
        interventions[index] = updatedIntervention;
        interventionLocalService.saveAll(interventions);
        return updatedIntervention;
    },

    delete: (id) => {
        const interventions = interventionLocalService.getAll();
        const filtered = interventions.filter(i => i.id !== id);
        interventionLocalService.saveAll(filtered);
        return true;
    }
};