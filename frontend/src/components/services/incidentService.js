
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const INCIDENTS_ENDPOINT = '/report';
const STORAGE_KEY = 'report';

// Helpers
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

// 
const convertIncidentFromAPI = (data) => ({
    id: data.id,
    noisetype: data.noisetype,          
    datetime: data.datetime,              
    severity: data.severity,
    description: data.description,
    location_of_noise: data.location_of_noise, 
    zone: data.zone,
    tags: data.tags || [],
    lat: data.lat,                      
    long: data.long,                       
    status: data.approved || 'pending'
});

const convertIncidentToAPI = (data) => ({
    id:data.id,
    noisetype: data.noisetype,
    datetime: data.datetime,
    severity: data.severity,
    description: data.description,
    location_of_noise: data.location_of_noise,
    zone: data.zone,
    tags: data.tags,
    lat: data.lat,
    long: data.long,
    approved: data.status
});

export const incidentServerService = {
    // get all incidents
getAll: async (filters = {}) => {
    try {
        const url = `${API_URL}${INCIDENTS_ENDPOINT}/get`;
        const response = await fetchAPI(url);
        if (!response) {
            console.log('No response received from server');
            return [];
        }
        
        // Deduplicate by Id
        const converted = response.map(convertIncidentFromAPI);
        const uniqueIncidents = [];
        const ids = new Set();
        
        converted.forEach(incident => {
            if (!ids.has(incident.id)) {
                ids.add(incident.id);
                uniqueIncidents.push(incident);
            }
        });
        
        if (uniqueIncidents.length !== converted.length) {
            console.log(`Removed ${converted.length - uniqueIncidents.length} duplicates from server response`);
        }
        
        return uniqueIncidents;
    } catch (error) {
        console.log('Error from getAll incidents call :', error.message || error);
        return [];
    }
},


// update incident
update: async (id, updates) => {
    try {  // <-- Add missing try
        const existingIncidents = await incidentServerService.getAll();
        const existingIncident = existingIncidents.find(inc => inc.id === id);
        
        if (!existingIncident) {
            console.error(`Incident with id ${id} not found`);
            return null;
        }
        
        const updatedIncident = {
            ...existingIncident,
            ...updates,
            id: id 
        };
        
        const response = await fetchAPI(`${API_URL}${INCIDENTS_ENDPOINT}/store`, {
            method: 'POST',
            body: JSON.stringify(convertIncidentToAPI(updatedIncident))
        });

        if (!response) {
            console.log('No response from server');
            return updatedIncident; 
        }

        const converted = convertIncidentFromAPI(response);
        
        if (converted.id !== id) {
            console.log(`Server changed ID from ${id} to ${converted.id}, preserving original`);
            converted.id = id;
        }
        
        return converted;
    } catch (error) {
        console.log('Error in update incident:', error);
        return updatedIncident; 
    }
},




    // delete incident
delete: async (incidentId) => {
        try {
            const response = await fetchAPI(`${API_URL}${INCIDENTS_ENDPOINT}/delete`, {
                method: 'POST',
                body: JSON.stringify({ id: incidentId })
            });

            return response
        } catch (error) {
            console.error('Error in delete incident:', error.message || error);

        }
    }



};

export const incidentLocalService = {
    getAll: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading incidents:', error);
            return [];
        }
    },

    saveAll: (incidents) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
            return true;
        } catch (error) {
            console.error('Error saving incidents:', error);
            return false;
        }
    },



    update: (updatedIncident) => {
        const incidents = incidentLocalService.getAll();
        const index = incidents.findIndex(i => i.id === updatedIncident.id);
        if (index === -1) return null;
        
        incidents[index] = updatedIncident;
        incidentLocalService.saveAll(incidents);
        return updatedIncident;
    },

    delete: (id) => {
        const incidents = incidentLocalService.getAll();
        const filtered = incidents.filter(i => i.id !== id);
        incidentLocalService.saveAll(filtered);
        return true;
    }
};