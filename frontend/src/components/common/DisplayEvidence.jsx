const EvidenceDisplay = ({ evidence = [], onRemoveEvidence }) => {
    if (!evidence || evidence.length === 0) {
        return null;
    }

    const getFileIcon = (fileType) => {
        if (!fileType) return '📎';
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('image')) return '🖼️';
        if (fileType.includes('word') || fileType.includes('document')) return '📝';
        return '📎';
    };

    return (
        <div className="evidence-display">
            <div className="evidence-header">
                <h5>Current Evidence ({evidence.length})</h5>
            </div>
            <div className="evidence-list">
                {evidence.map((item) => (
                    <div key={item.id} className="evidence-item-display">
                        <div className="evidence-icon-display">
                            {getFileIcon(item.fileType)}
                        </div>
                        <div className="evidence-details-display">
                            <div className="evidence-filename-display">{item.fileName}</div>
                            <div className="evidence-meta-display">
                                <span>{item.description || 'No description'}</span>
                                <span> • </span>
                                <span>{item.size || 'Unknown size'}</span>
                                {item.uploadedAt && (
                                    <>
                                        <span> • </span>
                                        <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        {onRemoveEvidence && (
                            <button 
                                className="evidence-remove-btn"
                                onClick={() => onRemoveEvidence(item.id)}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvidenceDisplay;