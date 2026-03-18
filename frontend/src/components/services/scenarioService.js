// scenarioService.js
const SCENARIO_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const SCENARIO_ENDPOINT = '/scenario';
const SCENARIO_STORAGE_KEY = 'scenarios';

// Helper (reuse from your intervention service or import)
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
        console.error('API Error:', error);
        throw error;
    }
};

// Converters
const convertScenarioFromAPI = (data) => ({
    id: data.id,
    name: data.name,
    description: data.description,
    interventionIds: data.interventionIds || [],
    metrics: data.metrics || {
        totalCost: 0,
        impact: { min: 0, max: 0 },
        feasibility: 0,
        timeline: '3-4 weeks'
    },
    scores: data.scores || {
        cost: 0,
        impact: 0,
        feasibility: 0,
        total: 0
    },
    createdAt: data.created_at || data.createdAt
});

const convertScenarioToAPI = (data) => ({
    id: data.id,
    name: data.name,
    description: data.description,
    interventionIds: data.interventionIds,
    metrics: data.metrics,
    scores: data.scores,
    created_at: data.createdAt || new Date().toISOString()
});

// Server Service
export const scenarioServerService = {
    getAll: async () => {
        try {
            const url = `${SCENARIO_API_URL}${SCENARIO_ENDPOINT}/get`;
            const response = await fetchAPI(url);
            return response.map(convertScenarioFromAPI);
        } catch (error) {
            console.error('Error fetching scenarios:', error);
            return [];
        }
    },

    create: async (scenarioData) => {
        try {
            const response = await fetchAPI(`${SCENARIO_API_URL}${SCENARIO_ENDPOINT}/store`, {
                method: 'POST',
                body: JSON.stringify(convertScenarioToAPI(scenarioData))
            });
            return convertScenarioFromAPI(response);
        } catch (error) {
            console.error('Error creating scenario:', error);
            throw error;
        }
    },

    update: async (updatedScenario) => {
        try {
            const response = await fetchAPI(`${SCENARIO_API_URL}${SCENARIO_ENDPOINT}/store`, {
                method: 'POST',
                body: JSON.stringify(convertScenarioToAPI(updatedScenario))
            });
            return convertScenarioFromAPI(response);
        } catch (error) {
            console.error('Error updating scenario:', error);
        }
    },

    delete: async (scenarioId) => {
        try {
            return await fetchAPI(`${SCENARIO_API_URL}${SCENARIO_ENDPOINT}/delete`, {
                method: 'POST',
                body: JSON.stringify({ id: scenarioId })
            });
        } catch (error) {
            console.error('Error deleting scenario:', error);
        }
    }
};

// Local Storage Service
export const scenarioLocalService = {
    getAll: () => {
        try {
            const data = localStorage.getItem(SCENARIO_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading scenarios:', error);
            return [];
        }
    },

    saveAll: (scenarios) => {
        try {
            localStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(scenarios));
            return true;
        } catch (error) {
            console.error('Error saving scenarios:', error);
            return false;
        }
    },

    create: (scenario) => {
        const scenarios = scenarioLocalService.getAll();
        const newScenario = {
            ...scenario,
            id: scenario.id || `scenario-${Date.now()}`
        };
        scenarios.push(newScenario);
        scenarioLocalService.saveAll(scenarios);
        return newScenario;
    },

    update: (updatedScenario) => {
        const scenarios = scenarioLocalService.getAll();
        const index = scenarios.findIndex(s => s.id === updatedScenario.id);
        if (index === -1) return null;
        
        scenarios[index] = updatedScenario;
        scenarioLocalService.saveAll(scenarios);
        return updatedScenario;
    },

    delete: (id) => {
        const scenarios = scenarioLocalService.getAll();
        const filtered = scenarios.filter(s => s.id !== id);
        scenarioLocalService.saveAll(filtered);
        return true;
    }
};