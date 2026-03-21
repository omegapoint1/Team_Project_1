import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { calculateInterventionImpact, formatImpact } from './impactModel';
import './InterventionBuilderModal.css';

ReactModal.setAppElement('#root');

const InterventionBuilderModal = ({ 
    isOpen, 
    onClose, 
    intervention,
    onCreate,
    onUpdate,
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

    // Load intervention data if editing
    useEffect(() => {
        if (intervention) {
            // Handle different possible data formats
            let impactMin = 1, impactMax = 5;
            
            if (Array.isArray(intervention.impact)) {
                impactMin = intervention.impact[0];
                impactMax = intervention.impact[1];
            } else if (intervention.impactRange) {
                impactMin = intervention.impactRange.min;
                impactMax = intervention.impactRange.max;
            } else if (intervention.impactMin !== undefined) {
                impactMin = intervention.impactMin;
                impactMax = intervention.impactMax;
            }
            
            setForm({
                name: intervention.name || '',
                category: intervention.category || 'physical',
                description: intervention.description || '',
                costMin: intervention.costMin || intervention.costRange?.min || 1000,
                costMax: intervention.costMax || intervention.costRange?.max || 5000,
                impactMin: impactMin,
                impactMax: impactMax,
                feasibility: intervention.feasibility || 5,
                tags: intervention.tags?.join(', ') || ''
            });
        } else {
            // Reset form for new intervention
            setForm({
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
        }
    }, [intervention, isOpen]);

    // Update preview whenever form changes
    useEffect(() => {
        const mockIntervention = {
            impact: [form.impactMin, form.impactMax]
        };
        const impact = calculateInterventionImpact(mockIntervention);
        setPreview(impact);
    }, [form.impactMin, form.impactMax]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate form
        if (!form.name.trim()) {
            alert('Please enter a name');
            return;
        }
        
        if (form.costMin > form.costMax) {
            alert('Minimum cost cannot be greater than maximum cost');
            return;
        }
        
        if (form.impactMin > form.impactMax) {
            alert('Minimum impact cannot be greater than maximum impact');
            return;
        }
        
        // Build intervention data in consistent format
        const interventionData = {
            id: intervention?.id || `int-${Date.now()}`,
            name: form.name,
            category: form.category,
            description: form.description,
            costRange: {
                min: form.costMin,
                max: form.costMax
            },
            impact: [form.impactMin, form.impactMax], // Simple array format
            feasibility: form.feasibility / 10, // Convert to 0-1 scale
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            createdAt: intervention?.createdAt || new Date().toISOString()
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
            padding: '20px',
            overflow: 'auto'
        }
    };

    return (
        <ReactModal isOpen={isOpen} onRequestClose={onClose} style={modalStyles}>
            <div className="imb-container">
                <div className="imb-header">
                    <h2>{intervention ? 'Edit Intervention' : 'Create New Intervention'}</h2>
                    <button className="imb-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="imb-form">
                    <div className="imb-field">
                        <label>Name *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                            placeholder="e.g., Acoustic Noise Barrier"
                            required
                        />
                    </div>

                    <div className="imb-field">
                        <label>Category</label>
                        <select 
                            value={form.category}
                            onChange={e => setForm({...form, category: e.target.value})}
                        >
                            <option value="physical">Physical Barrier</option>
                            <option value="traffic">Traffic Management</option>
                            <option value="infrastructure">Infrastructure</option>
                            <option value="regulatory">Regulatory</option>
                            <option value="building">Building</option>
                            <option value="green">Natural/Green</option>
                            <option value="enforcement">Enforcement</option>
                            <option value="industrial">Industrial</option>
                            <option value="technology">Technology</option>
                            <option value="transport">Transport</option>
                            <option value="community">Community Engagement</option>
                        </select>
                    </div>

                    <div className="imb-field">
                        <label>Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({...form, description: e.target.value})}
                            rows="3"
                            placeholder="Describe the intervention..."
                        />
                    </div>

                    <div className="imb-row">
                        <div className="imb-field">
                            <label>Cost Min (£)</label>
                            <input
                                type="number"
                                value={form.costMin}
                                onChange={e => setForm({...form, costMin: parseInt(e.target.value) || 0})}
                                min="0" step="100"
                            />
                        </div>
                        <div className="imb-field">
                            <label>Cost Max (£)</label>
                            <input
                                type="number"
                                value={form.costMax}
                                onChange={e => setForm({...form, costMax: parseInt(e.target.value) || 0})}
                                min="0" step="100"
                            />
                        </div>
                    </div>

                    <div className="imb-row">
                        <div className="imb-field">
                            <label>Impact Min (dB)</label>
                            <input
                                type="number"
                                value={form.impactMin}
                                onChange={e => setForm({...form, impactMin: parseInt(e.target.value) || 0})}
                                min="0" max="30" step="1"
                            />
                        </div>
                        <div className="imb-field">
                            <label>Impact Max (dB)</label>
                            <input
                                type="number"
                                value={form.impactMax}
                                onChange={e => setForm({...form, impactMax: parseInt(e.target.value) || 0})}
                                min="0" max="30" step="1"
                            />
                        </div>
                    </div>

                    <div className="imb-field">
                        <label>Feasibility: {form.feasibility}/10</label>
                        <input
                            type="range"
                            value={form.feasibility}
                            onChange={e => setForm({...form, feasibility: parseInt(e.target.value)})}
                            min="1" max="10" step="1"
                        />
                        <div className="imb-range-labels">
                            <span>Difficult</span>
                            <span>Easy</span>
                        </div>
                    </div>

                    <div className="imb-field">
                        <label>Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={form.tags}
                            onChange={e => setForm({...form, tags: e.target.value})}
                            placeholder="e.g., barrier, high-impact, quick-win"
                        />
                    </div>

                    {preview && (
                        <div className="imb-preview">
                            <h4>Impact Preview</h4>
                            <div className="imb-preview-content">
                                <div className="preview-item">
                                    <span className="preview-label">Single intervention:</span>
                                    <span className="preview-value">{formatImpact(preview)}</span>
                                </div>
                                <div className="preview-note">
                                    <small>This is the value that will be used in calculations</small>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="imb-actions">
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
                        <button type="button" onClick={onClose} className="imb-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="imb-save">
                            {intervention ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </ReactModal>
    );
};

export default InterventionBuilderModal;