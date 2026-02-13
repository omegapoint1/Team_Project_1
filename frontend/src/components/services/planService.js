const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const PLANS_ENDPOINT = '/plans';
const STORAGE_KEY = 'noise_mitigation_plans';

/*Helper functions */
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
        console.error('Plan API Error:', error);
        throw error;
    }
};


/*data converters  */
const convertPlanFromAPI = (data) => ({
    id: data.id,
    name: data.name,
    status: data.status,
    zone: data.zone,
    budget: data.budget,
    totalCost: data.total_cost || data.totalCost,
    timeline: data.timeline,
    interventions: data.interventions || [],
    impact: data.impact,
    notes: data.notes,
    evidence: data.evidence || [],
    createdAt: data.created_at || data.createdAt,
});

const convertPlanToAPI = (plan) => ({
    ...plan,
    total_cost: plan.totalCost,
    created_at: plan.createdAt,
});


/*
                    Local storage
*/
export const planLocalService = {
    getAll: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading plans from localStorage:', error);
            return [];
        }
    },

    // save all to localStorage
    saveAll: (plans) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
            return true;
        } catch (error) {
            console.error('Error saving plans to localStorage:', error);
            return false;
        }
    },

    // get by id
    getById: (planId) => {
        const plans = planLocalService.getAll();
        return plans.find(p => p.id === planId) || null;
    },



    // update plan
    update: (planId, updates) => {
        const plans = planLocalService.getAll();
        const index = plans.findIndex(p => p.id === planId);
        
        if (index === -1) return null;
        
        plans[index] = {
            ...plans[index],
            ...updates,
        };
        
        planLocalService.saveAll(plans);
        return plans[index];
    },

    // delete plan
    delete: (planId) => {
        const plans = planLocalService.getAll();
        const filtered = plans.filter(p => p.id !== planId);
        planLocalService.saveAll(filtered);
        return true;
    },

    // update status only
    updateStatus: (planId, status) => {
        return planLocalService.update(planId, { status });
    },

    // update evidence
    updateEvidence: (planId, newEvidenceArray) => {
        const plans = planLocalService.getAll();
        const planIndex = plans.findIndex(p => p.id === planId);
        
        if (planIndex === -1) return null;
        
        plans[planIndex].evidence = newEvidenceArray;  // Direct assignment
        
        
        // Save entire plans dictionary
        planLocalService.saveAll(plans);
        
        return plans[planIndex];
    },

    // update notes
    updateNotes: (planId, notes) => {
        return planLocalService.update(planId, { notes });
    },

    // synbc server to localStorage
    syncFromServer: async (serverPlans) => {
        planLocalService.saveAll(serverPlans);
        return serverPlans;
    }
};

export const planServerService = {
    getAll: async (filters = {}) => {
        const queryString = new URLSearchParams(filters).toString();
        const url = `${API_URL}${PLANS_ENDPOINT}${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetchWithAuth(url);
        return Array.isArray(response) ? response.map(convertPlanFromAPI) : [];
    },

    // get by id
    getById: async (planId) => {
        const response = await fetchWithAuth(`${API_URL}${PLANS_ENDPOINT}/${planId}`);
        return convertPlanFromAPI(response);
    },
    
    addPlan: async (plan) => {
        const response = await fetchWithAuth(`${API_URL}${PLANS_ENDPOINT}`, {
            method: 'POST',
            body: JSON.stringify(convertPlanToAPI(plan))
        });
        return convertPlanFromAPI(response);
    },



    // update plan
    update: async (planId, updates) => {
        const response = await fetchWithAuth(`${API_URL}${PLANS_ENDPOINT}/${planId}`, {
            method: 'PATCH',
            body: JSON.stringify(convertPlanToAPI({
                ...updates,
            }))
        });
        return convertPlanFromAPI(response);
    },
    /*
    // update status
    updateStatus: async (planId, status) => {
        const response = await fetchWithAuth(`${API_URL}${PLANS_ENDPOINT}/${planId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ 
                status,
            })
        });
        return convertPlanFromAPI(response);
    },

  

    // update evidence
     updateEvidence: async (planId, evidenceArray) => {
        const response = await fetchWithAuth(`${API_BASE_URL}${PLANS_ENDPOINT}/${planId}/evidence`, {
            method: 'PUT', 
            body: JSON.stringify({ 
                evidence: evidenceArray,
            })
        });
        return transformPlanFromAPI(response);
    },

    // update notes
    updateNotes: async (planId, notes) => {
        const response = await fetchWithAuth(`${API_URL}${PLANS_ENDPOINT}/${planId}/notes`, {
            method: 'PATCH',
            body: JSON.stringify({ 
                notes,
            })
        });
        return convertPlanFromAPI(response);
    },
*/
    // delete a specific plan
    delete: async (planId) => {
        return await fetchWithAuth(`${API_URL}${PLANS_ENDPOINT}/${planId}`, {
            method: 'DELETE'
        });
    },



};
