import { useState } from 'react';

const EvidenceUploader = ({ onEvidenceUploaded, attachedEvidence = [], onRemoveEvidence, planId }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [fileDescription, setFileDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = () => {
        if (!selectedFile || !fileDescription.trim()) {
            alert('Please select a file and add a description');
            return;
        }

        setIsUploading(true);

        setTimeout(() => {
            const newEvidence = {
                id: `EVID-${Date.now()}-${planId}`,
                fileName: selectedFile.name,
                fileType: selectedFile.type,
                description: fileDescription,
                uploadedAt: new Date().toISOString(),
                size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
                status: 'uploaded'
            };

            if (onEvidenceUploaded) {
                onEvidenceUploaded([newEvidence]);
            }

            setSelectedFile(null);
            setFileDescription('');
            setIsUploading(false);
            
            const fileInput = document.getElementById('evidence-file-input');
            if (fileInput) fileInput.value = '';
        }, 1000);
    };

    const formatFileType = (type) => {
        if (type?.includes('pdf')) return 'PDF';
        if (type?.includes('image')) return 'Image';
        if (type?.includes('word') || type?.includes('document')) return 'Document';
        return 'File';
    };

    return (
        <div className="evidence-uploader">
            <div className="upload-section">
                <div className="file-select-row">
                    <input
                        type="file"
                        id="evidence-file-input"
                        onChange={handleFileSelect}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="evidence-file-input" className="file-select-label">
                        {selectedFile ? selectedFile.name : '📎 Choose File'}
                    </label>
                    
                    <input
                        type="text"
                        value={fileDescription}
                        onChange={(e) => setFileDescription(e.target.value)}
                        placeholder="Enter file description"
                        className="description-input"
                    />
                    
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || !fileDescription.trim() || isUploading}
                        className="upload-button"
                    >
                        {isUploading ? '⏳ Uploading...' : '📤 Attach'}
                    </button>
                </div>
                
                <div className="file-hint">
                    <small>Allowed: PDF, Images, Documents (Max 10MB)</small>
                </div>
            </div>

            {attachedEvidence && attachedEvidence.length > 0 && (
                <div className="evidence-list-section">
                    <h5>📋 Attached Evidence ({attachedEvidence.length})</h5>
                    <div className="evidence-items">
                        {attachedEvidence.map((evidence) => (
                            <div key={evidence.id} className="evidence-item">
                                <div className="evidence-icon">
                                    {evidence.fileType?.includes('pdf') ? '📄' : 
                                     evidence.fileType?.includes('image') ? '🖼️' : '📎'}
                                </div>
                                <div className="evidence-info">
                                    <div className="evidence-filename">{evidence.fileName}</div>
                                    <div className="evidence-description">{evidence.description}</div>
                                    <div className="evidence-meta">
                                        <span>{formatFileType(evidence.fileType)}</span>
                                        <span> • </span>
                                        <span>{evidence.size}</span>
                                        <span> • </span>
                                        <span>
                                            {evidence.uploadedAt ? new Date(evidence.uploadedAt).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            }) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onRemoveEvidence && onRemoveEvidence(evidence.id)}
                                    title="Remove evidence"
                                    className="remove-evidence-btn"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EvidenceUploader;