const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const INCIDENTS_ENDPOINT = '/report';
const STORAGE_KEY = 'reports';

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
        console.error('Fetch error:', error);
        throw error;
    }
};

const normalizeStatus = (status) => {
    if (!status) return 'Pending';
    const validStatuses = ['Pending', 'Accepted', 'Rejected'];
    if (validStatuses.includes(status)) return status;
    
    const lower = status.toLowerCase();
    if (lower === 'pending') return 'Pending';
    if (lower === 'accepted' || lower === 'approved') return 'Accepted';
    if (lower === 'rejected') return 'Rejected';
    return 'Pending';
};

const convertIncidentFromAPI = (data) => ({
    id: String(data.id),
    noisetype: data.noisetype,
    datetime: data.datetime,
    severity: data.severity,
    description: data.description,
    location_of_noise: data.location_of_noise,
    location: data.location_of_noise,
    zone: data.zone,
    tags: data.tags || [],
    lat: data.lat,
    long: data.long,
    status: normalizeStatus(data.approved || data.status || 'Pending'),
    approved: data.approved,
    createdAt: data.datetime ? new Date(data.datetime).getTime() : Date.now(),
    updated_at: data.updated_at || data.datetime,
    _synced: true 
});

const convertIncidentToAPI = (data) => ({
    id: String(data.id),
    noisetype: data.noisetype,
    datetime: data.datetime,
    severity: data.severity,
    description: data.description,
    location_of_noise: data.location_of_noise || data.location,
    zone: data.zone,
    tags: data.tags,
    lat: data.lat,
    long: data.long,
    approved: data.status
});

export const incidentServerService = {
    getAll: async () => {
        try {
            const url = `${API_URL}${INCIDENTS_ENDPOINT}/get`;
            const response = await fetchAPI(url);
            if (!response) return [];
            
            const incidentsArray = Array.isArray(response) ? response : (response.data ? response.data : []);
            return incidentsArray.map(convertIncidentFromAPI);
        } catch (error) {
            console.error('Error fetching incidents:', error);
            return [];
        }
    },

    update: async (id, updates) => {
        try {
            const existingIncidents = incidentLocalService.getAll();
            const existingIncident = existingIncidents.find(inc => String(inc.id) === String(id));
            
            if (!existingIncident) return null;
            
            const updatedIncident = {
                ...existingIncident,
                ...updates,
                id: String(id),
                updated_at: new Date().toISOString()
            };
            
            const response = await fetchAPI(`${API_URL}${INCIDENTS_ENDPOINT}/store`, {
                method: 'POST',
                body: JSON.stringify(convertIncidentToAPI(updatedIncident))
            });

            if (!response) return updatedIncident;

          
            return convertIncidentFromAPI({
                ...response,
                id: String(id)
            });
        } catch (error) {
            console.error('Error updating incident:', error);
            return null;
        }
    },

    delete: async (incidentId) => {
        try {
            return await fetchAPI(`${API_URL}${INCIDENTS_ENDPOINT}/delete`, {
                method: 'POST',
                body: JSON.stringify({ id: incidentId })
            });
        } catch (error) {
            console.error('Error deleting incident:', error);
            throw error;
        }
    },
    
    create: async (incidentData) => {
        try {
            const response = await fetchAPI(`${API_URL}${INCIDENTS_ENDPOINT}/store`, {
                method: 'POST',
                body: JSON.stringify(convertIncidentToAPI(incidentData))
            });
            return response ? convertIncidentFromAPI(response) : null;
        } catch (error) {
            console.error('Error creating incident:', error);
            return null;
        }
    }
};

export const incidentLocalService = {
    syncWithServer: async () => {
        try {
            const serverData = await incidentServerService.getAll();
            if (serverData) {
                incidentLocalService.saveAll(serverData);
                return serverData;
            }
            return incidentLocalService.getAll();
        } catch (error) {
            console.error('Error syncing:', error);
            return incidentLocalService.getAll();
        }
    },

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
            const uniqueMap = new Map();
            incidents.forEach(inc => {
                const idKey = String(inc.id);
                // FIX: last-write-wins — always overwrite so the most recent
                // version of an incident is what gets persisted, never a stale one
                uniqueMap.set(idKey, {
                    ...inc,
                    id: idKey,
                    _synced: !!inc._synced
                });
            });
            const unique = Array.from(uniqueMap.values());
            localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
            return true;
        } catch (error) {
            return false;
        }
    },

    add: (incident) => {
        const incidents = incidentLocalService.getAll();
        const id = String(incident.id || `temp_${Date.now()}`);
        
        const newIncident = {
            ...incident,
            id,
            _synced: false
        };
        
        incidents.push(newIncident);
        return incidentLocalService.saveAll(incidents);
    },

    update: (updatedIncident) => {
        const incidents = incidentLocalService.getAll();
        const idToFind = String(updatedIncident.id);
        const index = incidents.findIndex(i => String(i.id) === idToFind);
        
        if (index !== -1) {
            incidents[index] = { ...updatedIncident, id: idToFind };
            return incidentLocalService.saveAll(incidents);
        }
        return false;
    }
};