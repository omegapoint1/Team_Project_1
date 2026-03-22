/**
  Service module providing CRUD operations for mitigation plans with server API and local storage persistence.
 Supports creating, updating retrieving intervention plans 
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const PLANS_ENDPOINT = '/intervention-plan';
const STORAGE_KEY = 'intervention-plan';

/* Helper functions */
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
        console.error('Fetch API Error:', error);
        throw error;
    }
};

/* Data converters */
const convertPlanFromAPI = (data) => ({
    id: String(data.id),
    name: data.name,
    status: data.status || 'draft',
    zone: data.zone,
    budget: data.budget || 0,
    totalCost: data.total_cost || data.totalCost || 0,
    timeline: data.timeline || 4,
    interventions: data.interventions || [],
    impact: typeof data.impact === 'number' 
        ? [data.impact, data.impact]
        : Array.isArray(data.impact) 
            ? data.impact 
            : [0, 0],
    notes: data.notes || '',
    evidence: data.evidence || [],
    createdAt: data.created_at || data.createdAt || new Date().toISOString(),
    updatedAt: data.updated_at || data.updatedAt || new Date().toISOString()
});

const convertPlanToAPI = (plan) => ({
    id: String(plan.id),
    name: plan.name,
    status: plan.status,
    zone: plan.zone,
    budget: plan.budget,
    total_cost: plan.totalCost || plan.total_cost || 0,
    timeline: plan.timeline,
    interventions: plan.interventions || [],
    impact: Array.isArray(plan.impact) ? plan.impact : [plan.impact || 0, plan.impact || 0],
    notes: plan.notes || '',
    evidence: plan.evidence || [],
    created_at: plan.createdAt || plan.created_at || new Date().toISOString(),
    updated_at: plan.updatedAt || plan.updated_at || new Date().toISOString()
});

export const planServerService = {
    getAll: async (filters = {}) => {
        try {
            const url = `${API_URL}${PLANS_ENDPOINT}/get`;
            const response = await fetchAPI(url);
            if (!response) return [];
            const plans = Array.isArray(response) ? response : [response];
            return plans.map(convertPlanFromAPI);
        } catch (error) {
            console.error('Error fetching plans:', error);
            return [];
        }
    },

    getById: async (planId) => {
        try {
            const url = `${API_URL}${PLANS_ENDPOINT}/get?id=${planId}`;
            const response = await fetchAPI(url);
            return response ? convertPlanFromAPI(response) : null;
        } catch (error) {
            console.error('Error fetching plan by ID:', error);
            return null;
        }
    },

    create: async (planData) => {
        try {
            const response = await fetchAPI(`${API_URL}${PLANS_ENDPOINT}/store`, {
                method: 'POST',
                body: JSON.stringify(convertPlanToAPI(planData))
            });
            return response ? convertPlanFromAPI(response) : null;
        } catch (error) {
            console.error('Error creating plan:', error);
            throw error;
        }
    },

    update: async (updatedPlan) => {
        try {
            const response = await fetchAPI(`${API_URL}${PLANS_ENDPOINT}/store`, {
                method: 'POST',
                body: JSON.stringify(convertPlanToAPI(updatedPlan))
            });
            return response ? convertPlanFromAPI(response) : null;
        } catch (error) {
            console.error('Error updating plan:', error);
            throw error;
        }
    },

    delete: async (planId) => {
        try {
            return await fetchAPI(`${API_URL}${PLANS_ENDPOINT}/delete`, {
                method: 'POST',
                body: JSON.stringify({ id: String(planId) })
            });
        } catch (error) {
            console.error(`Error deleting plan ${planId}:`, error);
            throw error;
        }
    }
};

export const planLocalService = {
    getAll: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            const plans = data ? JSON.parse(data) : [];
            return plans.map(plan => ({
                ...plan,
                id: String(plan.id),
                interventions: plan.interventions || [],
                notes: plan.notes || '',
                evidence: plan.evidence || [],
                impact: Array.isArray(plan.impact) ? plan.impact : [plan.impact || 0, plan.impact || 0]
            }));
        } catch (error) {
            console.error('Error reading plans:', error);
            return [];
        }
    },

    saveAll: (plans) => {
        try {
            const normalized = plans.map(plan => ({
                ...plan,
                id: String(plan.id),
                interventions: plan.interventions || [],
                notes: plan.notes || '',
                evidence: plan.evidence || [],
                impact: Array.isArray(plan.impact) ? plan.impact : [plan.impact || 0, plan.impact || 0]
            }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
            return true;
        } catch (error) {
            console.error('Error saving plans:', error);
            return false;
        }
    },

    create: (plan) => {
        const plans = planLocalService.getAll();
        const newPlan = {
            ...plan,
            id: String(plan.id || Date.now()),
            status: plan.status || 'draft',
            notes: plan.notes || '',
            evidence: plan.evidence || [],
            impact: Array.isArray(plan.impact) ? plan.impact : [plan.impact || 0, plan.impact || 0],
            createdAt: plan.createdAt || new Date().toISOString()
        };
        plans.push(newPlan);
        planLocalService.saveAll(plans);
        return newPlan;
    },

    update: (updatedPlan) => {
        const plans = planLocalService.getAll();
        const index = plans.findIndex(p => String(p.id) === String(updatedPlan.id));
        if (index === -1) return null;
        
        plans[index] = {
            ...updatedPlan,
            id: String(updatedPlan.id),
            impact: Array.isArray(updatedPlan.impact) ? updatedPlan.impact : [updatedPlan.impact || 0, updatedPlan.impact || 0],
            updatedAt: new Date().toISOString()
        };
        planLocalService.saveAll(plans);
        return plans[index];
    },

    delete: (id) => {
        const plans = planLocalService.getAll();
        const filtered = plans.filter(p => String(p.id) !== String(id));
        planLocalService.saveAll(filtered);
        return true;
    }
};