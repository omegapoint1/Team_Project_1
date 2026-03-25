const API_URL =import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const INTERVENTIONS_ENDPOINT = '/intervention';
const STORAGE_KEY = 'intervention';

const fetchAPI = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            method: options.method || 'GET',
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
        console.error('fetchAPI error:', error);
        // FIX: rethrow so callers can actually detect failure instead of
        // silently falling through to stale local data
        throw error;
    }
};

const convertInterventionFromAPI = (data) => ({
    id: String(data.id),
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
    id: String(data.id),
    name: data.name,
    category: data.category,
    description: data.description,
    cost: data.cost,
    impact: data.impact,
    feasibility: data.feasibility,
    tags: data.tags,
    created_at: data.created_at || data.createdAt
});

export const interventionServerService = {
    getAll: async () => {
        try {
            const url = `${API_URL}${INTERVENTIONS_ENDPOINT}/get`;
            const response = await fetchAPI(url);
            if (!response) return [];
            const interventionsArray = Array.isArray(response)
                ? response
                : (response.data ? response.data : []);
            return interventionsArray.map(convertInterventionFromAPI);
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
            return response ? convertInterventionFromAPI(response) : null;
        } catch (error) {
            console.error('Error creating intervention:', error);
            return null;
        }
    },

    update: async (updatedIntervention) => {
        const id = String(updatedIntervention.id);
        try {
  
            await fetchAPI(`${API_URL}${INTERVENTIONS_ENDPOINT}/store`, {
                method: 'POST',
                body: JSON.stringify(convertInterventionToAPI({ ...updatedIntervention, id }))
            });
            return { ...updatedIntervention, id, _synced: true };
        } catch (error) {
            console.error('Error updating intervention:', error);
            return null;
        }
    },

    delete: async (interventionId) => {
        try {
            return await fetchAPI(`${API_URL}${INTERVENTIONS_ENDPOINT}/delete`, {
                method: 'POST',
                body: JSON.stringify({ id: interventionId })
            });
        } catch (error) {
            console.error('Error deleting intervention:', error);
            throw error;
        }
    }
};

export const interventionLocalService = {
    getAll: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading interventions:', error);
            return [];
        }
    },

    saveAll: (interventions) => {
        try {
            // Deduplicate by ID, 
            const uniqueMap = new Map();
            interventions.forEach(i => {
                uniqueMap.set(String(i.id), { ...i, id: String(i.id) });
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(uniqueMap.values())));
            return true;
        } catch (error) {
            console.error('Error saving interventions:', error);
            return false;
        }
    },

    create: (intervention) => {
        const interventions = interventionLocalService.getAll();
        const newIntervention = {
            ...intervention,
            id: String(intervention.id || `temp_${Date.now()}`)
        };
        interventions.push(newIntervention);
        interventionLocalService.saveAll(interventions);
        return newIntervention;
    },

    update: (updatedIntervention) => {
        const interventions = interventionLocalService.getAll();
        const idToFind = String(updatedIntervention.id);
        const index = interventions.findIndex(i => String(i.id) === idToFind);
        if (index === -1) return null;
        interventions[index] = { ...updatedIntervention, id: idToFind };
        interventionLocalService.saveAll(interventions);
        return interventions[index];
    },

    delete: (id) => {
        const interventions = interventionLocalService.getAll();
        const filtered = interventions.filter(i => String(i.id) !== String(id));
        interventionLocalService.saveAll(filtered);
        return true;
    }
};