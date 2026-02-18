import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { calculateInterventionImpact } from './impactModel';
<<<<<<< HEAD

ReactModal.setAppElement('#root');
/*
component rendering modal which builds the Interventions and calls impact model method 
*/


=======
import './InterventionBuilderModal.css';

ReactModal.setAppElement('#root');
>>>>>>> origin/main

const InterventionBuilderModal = ({ 
    isOpen, 
    onClose, 
    intervention,
    onCreate,
    onDelete,
    totalCount
}) => {
    const [form, setForm] = useState({
        name: '',
        category: 'physical',
        description: '',
        costMin: 1000,
        costMax: 5000,
        impactMin: 1,
        impactMax: 5,
        feasibility: 5,
        tags: ''
    });
    
    const [preview, setPreview] = useState(null);
    const [zone, setZone] = useState('mixed');

    useEffect(() => {
        if (intervention) {
            setForm({
                name: intervention.name || '',
                category: intervention.category || 'physical',
                description: intervention.description || '',
                costMin: intervention.cost?.[0] || intervention.costRange?.min || 1000,
                costMax: intervention.cost?.[1] || intervention.costRange?.max || 5000,
                impactMin: intervention.impact?.[0] || intervention.impactRange?.min || 1,
                impactMax: intervention.impact?.[1] || intervention.impactRange?.max || 5,
                feasibility: (intervention.feasibility * 10) || 5,
                tags: intervention.tags?.join(', ') || ''
            });
        }
    }, [intervention]);

    useEffect(() => {
        const impact = calculateInterventionImpact({
            type: form.category,
            category: form.category
        }, zone);
        setPreview(impact);
    }, [form, zone]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const interventionData = {
            id: `${Date.now()}`,
            name: form.name,
            category: form.category,
            description: form.description,
            cost: [ form.costMin,form.costMax ],
            impact: [form.impactMin,form.impactMax],
            feasibility: Math.round(form.feasibility) || 5,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            created_at: intervention?.created_at || new Date().toISOString()
        };

        if (intervention) {
            onUpdate(interventionData);
        } else {
            onCreate(interventionData);
        }
        
        onClose();
    };

    const handleDelete = () => {
        if (totalCount <= 16) {
            alert('Cannot delete: Minimum 16 interventions required');
            return;
        }
        if (window.confirm('Delete this intervention?')) {
            onDelete(intervention.id);
            onClose();
        }
    };

    const modalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            maxHeight: '90vh',
            borderRadius: '8px',
            padding: '20px'
        }
    };

    return (
        <ReactModal isOpen={isOpen} onRequestClose={onClose} style={modalStyles}>
            <div>
                <div >
                    <h2>{intervention ? 'Edit' : 'New'} Intervention</h2>
                    <button onClick={onClose} >×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="imb-field">
                        <label>Name *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                            required
                        />
                    </div>

                    <div className="imb-field">
                        <label>Category</label>
                        <select 
                            value={form.category}
                            onChange={e => setForm({...form, category: e.target.value})}
                        >
                            <option value="physical">Physical</option>
                            <option value="regulatory">Regulatory</option>
                            <option value="educational">Educational</option>
                            <option value="green">Green</option>
                            <option value="technical">Technical</option>
                        </select>
                    </div>

                    <div className="imb-field">
                        <label>Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({...form, description: e.target.value})}
                            rows="2"
                        />
                    </div>

                    <div className="row">
                        <div className="imb-field">
                            <label>Cost Min (£)</label>
                            <input
                                type="number"
                                value={form.costMin}
                                onChange={e => setForm({...form, costMin: +e.target.value})}
                                min="0" step="100"
                            />
                        </div>
                        <div className="imb-field">
                            <label>Cost Max (£)</label>
                            <input
                                type="number"
                                value={form.costMax}
                                onChange={e => setForm({...form, costMax: +e.target.value})}
                                min="0" step="100"
                            />
                        </div>
                    </div>

                    <div className='row'>
                        <div className="imb-field">
                            <label>Impact Min (dB)</label>
                            <input
                                type="number"
                                value={form.impactMin}
                                onChange={e => setForm({...form, impactMin: +e.target.value})}
                                min="0" max="1000"
                            />
                        </div>
                        <div className="imb-field">
                            <label>Impact Max (dB)</label>
                            <input
                                type="number"
                                value={form.impactMax}
                                onChange={e => setForm({...form, impactMax: +e.target.value})}
                                min="0" max="30"
                            />
                        </div>
                    </div>

                    <div className="imb-field">
                        <label>Feasibility: {form.feasibility}/10</label>
                        <input
                            type="range"
                            value={form.feasibility}
                            onChange={e => setForm({...form, feasibility: +e.target.value})}
                            min="1" max="10"
                        />
                    </div>

                    <div className="imb-field">
                        <label>Tags </label>
                        <input
                            type="text"
                            value={form.tags}
                            onChange={e => setForm({...form, tags: e.target.value})}
                        />
                    </div>

                    <div className="imb-field">
                        <label>Preview Zone</label>
                        <select value={zone} onChange={e => setZone(e.target.value)}>
                            <option value="mixed">Mixed</option>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="campus">Campus</option>
                            <option value="event">Event</option>
                        </select>
                    </div>

                    {preview && (
                        <div className="imb-preview">
                            <strong>Impact Preview:</strong> {preview.min}-{preview.max} dB
                            <br />
                            <small>Confidence: {preview.confidence}</small>
                        </div>
                    )}

                    <div >
                        {intervention && (
                            <button 
                                type="button" 
                                onClick={handleDelete}
                                className="imb-delete"
                                disabled={totalCount <= 16}
                            >
                                Delete
                            </button>
                        )}
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </ReactModal>
    );
};

export default InterventionBuilderModal;