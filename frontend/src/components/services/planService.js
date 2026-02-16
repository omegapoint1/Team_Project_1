const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const PLANS_ENDPOINT = '/intervention-plan';
const STORAGE_KEY = 'intervention-plan';

/*Helper functions */
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
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};


/*data converters  */
const convertPlanFromAPI = (data) => ({
    id: data.id,
    name: data.name,
    status: data.status,
    zone: data.zone,
    budget: data.budget,
    total_cost: data.total_cost,
    timeline: data.timeline,
    interventions: data.interventions || [], 
    impact: data.impact,
    notes: data.notes || [],                 
    evidence: data.evidence || [],            
    created_at: data.created_at
});

const convertPlanToAPI = (plan) => ({
    id: plan.id,
    name: plan.name,
    status: plan.status,
    zone: plan.zone,
    budget: plan.budget,
    total_cost: plan.total_cost || plan.totalCost,
    timeline: plan.timeline,
    interventions: plan.interventions || [],
    impact: plan.impact,
    notes: plan.notes || [],
    evidence: plan.evidence || [],
    created_at: plan.created_at || plan.createdAt
});




export const planServerService = {
        getAll: async (filters = {}) => {
        try {
            const url = `${API_URL}${PLANS_ENDPOINT}/get`;
            const response = await fetchAPI(url);
            return response.map(convertPlanFromAPI);
        } catch (error) {
            console.log('Error fetching plans:', error);
            return [];
        }
    },

    // get by id
    /*getById: async (planId) => {
        const response = await fetchAPI(`${API_URL}${PLANS_ENDPOINT}/${planId}`);
        return convertPlanFromAPI(response);
    },*/
    
    create: async (planData) => {
        try {
            const response = await fetchAPI(`${API_URL}${PLANS_ENDPOINT}/store`, {
                method: 'POST',
                body: JSON.stringify(convertPlanToAPI(planData))
            });
            return convertPlanFromAPI(response);
        } catch (error) {
            console.log('Error creating plan:', error);
        }
    },


    // update plan
    update: async (updatedPlan) => {
        try {
            const response = await fetchAPI(`${API_URL}${PLANS_ENDPOINT}/store`, {
                method: 'POST',
                body: JSON.stringify(convertPlanToAPI(updatedPlan))
            });
            return convertPlanFromAPI(response);
        } catch (error) {
            console.log('Error updating plan:', error);
        }
    },
    /*
    // update status
    updateStatus: async (planId, status) => {
        const response = await fetchAPI(`${API_URL}${PLANS_ENDPOINT}/${planId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ 
                status,
            })
        });
        return convertPlanFromAPI(response);
    },

  

    // update evidence
     updateEvidence: async (planId, evidenceArray) => {
        const response = await fetchAPI(`${API_BASE_URL}${PLANS_ENDPOINT}/${planId}/evidence`, {
            method: 'PUT', 
            body: JSON.stringify({ 
                evidence: evidenceArray,
            })
        });
        return transformPlanFromAPI(response);
    },


*/
    // delete a specific plan
    delete: async (planId) => {
        try {
            return await fetchAPI(`${API_URL}${PLANS_ENDPOINT}/delete`, {
                method: 'POST',
                bpdy:JSON.stringify({id:planId})
            });
        } catch (error) {
            console.log(`Error deleting plan ${planId}:`, error);
        }
    }



};



export const planLocalService = {
    getAll: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading plans:', error);
            return [];
        }
    },

    saveAll: (plans) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
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
            id: plan.id
        };
        plans.push(newPlan);
        planLocalService.saveAll(plans);
        return newPlan;
    },

    update: (updatedPlan) => {
        const plans = planLocalService.getAll();
        const index = plans.findIndex(p => p.id === updatedPlan.id);
        if (index === -1) return null;
        
        plans[index] = updatedPlan;
        planLocalService.saveAll(plans);
        return updatedPlan;
    },

    delete: (id) => {
        const plans = planLocalService.getAll();
        const filtered = plans.filter(p => p.id !== id);
        planLocalService.saveAll(filtered);
        return true;
    }
};