
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const INTERVENTIONS_ENDPOINT = '/intervention';
const STORAGE_KEY = 'intervention';

// Helper
const fetchAPI = async (url, options = {}) => {
    
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
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
                const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            const text = await response.text();
            return { success: true, message: text, id: Date.now().toString() };
        }
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
    cost: data.cost,
    impact: data.impact ,
    feasibility: data.feasibility,
    tags: data.tags,
    created_at: data.created_at || data.createdAt
});

export const interventionServerService = {
    // get all interventions
    getAll: async (filters = {}) => {
        try {
            const url = `${API_URL}${INTERVENTIONS_ENDPOINT}/get`;
            const response = await fetchAPI(url);
            return response.map(convertInterventionFromAPI);
        } catch (error) {
            console.error('Error fetching interventions:', error);
            return [];
        }
    },
    create: async (interventionData) => {
        try {
            const response = await fetchAPI(`${API_URL}${INTERVENTIONS_ENDPOINT}/store`, {
                method: 'POST',
                body: JSON.stringify(convertInterventionToAPI(interventionData))
            });
            return convertInterventionFromAPI(response);
        } catch (error) {
            console.error('Error creating intervention:', error);
        }
    },


    update: async (updatedIntervention) => {
        try {
            const response = await fetchAPI(`${API_URL}${INTERVENTIONS_ENDPOINT}/store`, {
                method: 'POST',
                body: JSON.stringify(convertInterventionToAPI(updatedIntervention))
            });
            return convertInterventionFromAPI(response);
        } catch (error) {
            console.error('Error updating intervention:', error);
        }
    },

    delete: async (interventionId) => {
        try {
            return await fetchAPI(`${API_URL}${INTERVENTIONS_ENDPOINT}/delete`, {
                method: 'POST',
                body: JSON.stringify({id:interventionId})

            });
        } catch (error) {
            console.log('Error deleting intervention:', error);
        }
    }



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