import { useState } from 'react';

/*
 Reusable EvidenceUploader component for attaching files to plans // rename to file uploader
 @param {function} onEvidenceUploaded - Callback function when evidence is uploaded
 @param {array<files>} attachedEvidence - Current list of attached evidence files
 @param {function} onRemoveEvidence - Callback function to remove evidence files
 @param {string} planId - ID of the plan for tracking
 */
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
                uploaded: new Date().toISOString(),
                size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
                status: 'uploaded'
            };

            if (onEvidenceUploaded) {
                onEvidenceUploaded([newEvidence]);
            }

            setSelectedFile(null);
            setFileDescription('');
            setIsUploading(false);
            
            document.getElementById('evidence-file-input').value = '';
        }, 1000);
    };

    const handleRemove = (evidenceId) => {
        if (onRemoveEvidence) {
            onRemoveEvidence(evidenceId);
        }
    };

    const formatFileType = (type) => {
        if (type.includes('pdf')) return 'PDF';
        if (type.includes('image')) return 'Image';
        if (type.includes('word') || type.includes('document')) return 'Document';
        return 'File';
    };

    return (
        <div>
            <div>
                <div>
                    <div>
                        <input
                            type="file"
                            id="evidence-file-input"
                            onChange={handleFileSelect}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                        />
                        <label htmlFor="evidence-file-input">
                            {selectedFile ? selectedFile.name : 'Choose File'}
                        </label>
                    </div>
                    
                    <div>
                        <input
                            type="text"
                            value={fileDescription}
                            onChange={(e) => setFileDescription(e.target.value)}
                            placeholder="Enter file description"
                        />
                    </div>
                    
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || !fileDescription.trim() || isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Attach'}
                    </button>
                </div>
                
                <div>
                    <small>Allowed: PDF, Images, Documents (Max 10MB)</small>
                </div>
            </div>

            {attachedEvidence.length > 0 && (
                <div>
                    <h5>Attached Evidence ({attachedEvidence.length})</h5>
                    <div>
                        {attachedEvidence.map((evidence) => (
                            <div key={evidence.id}>
                                <div>
                                    {evidence.fileType.includes('pdf') ? '📄' : 
                                     evidence.fileType.includes('image') ? '🖼️' : '📎'}
                                </div>
                                <div>
                                    <div>{evidence.fileName}</div>
                                    <div>{evidence.description}</div>
                                    <div>
                                        <span>{formatFileType(evidence.fileType)}</span>
                                        <span> • </span>
                                        <span>{evidence.size}</span>
                                        <span> • </span>
                                        <span>
                                            {new Date(evidence.uploaded).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemove(evidence.id)}
                                    title="Remove evidence"
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