const EvidenceDisplay = ({ evidence = [], onRemoveEvidence }) => {
    if (!evidence || evidence.length === 0) {
        return null; 
    }

    /*const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return '';
        if (fileType.includes('image')) return '';
        return '';
    };*/

    return (
        <div className="evidence-display">
            <div >
                <h5>Current Evidence </h5>
            </div>
            <div className="evidence-list">
                {evidence.map((item) => (
                    <div key={item.id} >
                        <div className="evidence-icon">
                            {/*getFileIcon(item.fileType)*/}
                        </div>
                        <div className="evidence-details">
                            <div >{item.fileName}</div>
                            <div >
                                <span>{item.description}</span>
                                <span> • </span>
                                <span>{item.size}</span>
                            </div>
                        </div>
                        {onRemoveEvidence && (
                            <button 
                                className="evidence-remove-btn"
                                onClick={() => onRemoveEvidence(item.id)}
                            >
                                X
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvidenceDisplay;