/**
  EvidenceDisplay component for rendering a list of evidence items with file icons,
 and removal capability, supports various file types
 */
import { useState } from 'react';

const EvidenceDisplay = ({ evidence = [], onRemoveEvidence }) => {
    const [expandedItem, setExpandedItem] = useState(null);

    // Returns if no evidence to display
    if (!evidence || evidence.length === 0) {
        return null;
    }

    // Returns appropriate icon based on file type
    const getFileIcon = (fileType) => {
        if (!fileType) return '📎';
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('image')) return '🖼️';
        if (fileType.includes('word') || fileType.includes('document')) return '📝';
        if (fileType.includes('text')) return '📃';
        return '📎';
    };

    // Returns human-readable label for file type
    const getFileTypeLabel = (fileType) => {
        if (!fileType) return 'File';
        if (fileType.includes('pdf')) return 'PDF Document';
        if (fileType.includes('image')) return 'Image';
        if (fileType.includes('word')) return 'Word Document';
        if (fileType.includes('spreadsheet')) return 'Spreadsheet';
        if (fileType.includes('text')) return 'Text File';
        return 'File';
    };

    // Handles file download, creating blob from base64 data or showing simulated download
    const handleDownload = (evidence) => {
        if (evidence.fileData) {
            try {
                // Create blob from base64 or array buffer
                const byteCharacters = atob(evidence.fileData);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: evidence.fileType || 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = url;
                link.download = evidence.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading file:', error);
                alert('Failed to download file. File data may be corrupted.');
            }
        } else {
            // If we only have metadata, show download dialog with info
            alert(`Download requested for: ${evidence.fileName}\n\nFile Type: ${getFileTypeLabel(evidence.fileType)}\nSize: ${evidence.size}\n\nNote: This is a simulated download. In production, the actual file data would be stored and downloaded.`);
        }
    };

    // Handles file preview
    const handleView = (evidence) => {
        // For images, try to display in new tab
        if (evidence.fileType?.includes('image') && evidence.fileData) {
            try {
                const byteCharacters = atob(evidence.fileData);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: evidence.fileType });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            } catch (error) {
                console.error('Error viewing image:', error);
                alert('Could not preview this file.');
            }
        } else if (evidence.fileType?.includes('pdf') && evidence.fileData) {
            // For PDF, open in new tab
            try {
                const byteCharacters = atob(evidence.fileData);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            } catch (error) {
                console.error('Error viewing PDF:', error);
                alert('Could not preview this PDF.');
            }
        } else {
            //For other files, show file info
            setExpandedItem(expandedItem === evidence.id ? null : evidence.id);
        }
    };

    // Formats file size from bytes to human-readable format
    const formatFileSize = (size) => {
        if (!size) return 'Unknown size';
        if (typeof size === 'number') {
            if (size < 1024) return `${size} B`;
            if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
            return `${(size / (1024 * 1024)).toFixed(1)} MB`;
        }
        return size;
    };

    return (
        <div className="evidence-display">
            <div className="evidence-header">
                <h5> Current Evidence ({evidence.length})</h5>
            </div>
            <div className="evidence-list">
                {evidence.map((item) => (
                    <div key={item.id} className="evidence-item-display">
                        <div className="evidence-icon-display">
                            {getFileIcon(item.fileType)}
                        </div>
                        <div className="evidence-details-display">
                            <div className="evidence-filename-display">
                                {item.fileName}
                                <span className="evidence-type-badge">
                                    {getFileTypeLabel(item.fileType)}
                                </span>
                            </div>
                            <div className="evidence-meta-display">
                                <span>{item.description || 'No description'}</span>
                                <span> • </span>
                                <span>{formatFileSize(item.size)}</span>
                                {item.uploadedAt && (
                                    <>
                                        <span> • </span>
                                        <span>Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}</span>
                                    </>
                                )}
                            </div>
                            <div className="evidence-actions-buttons">
                                <button 
                                    className="evidence-view-btn"
                                    onClick={() => handleView(item)}
                                    title="View file details"
                                >
                                    👁️ View
                                </button>
                                <button 
                                    className="evidence-download-btn"
                                    onClick={() => handleDownload(item)}
                                    title="Download file"
                                >
                                    📥 Download
                                </button>
                            </div>
                            {expandedItem === item.id && (
                                <div className="evidence-expanded-info">
                                    <div className="expanded-detail">
                                        <strong>File Name:</strong> {item.fileName}
                                    </div>
                                    <div className="expanded-detail">
                                        <strong>File Type:</strong> {getFileTypeLabel(item.fileType)}
                                    </div>
                                    <div className="expanded-detail">
                                        <strong>Size:</strong> {formatFileSize(item.size)}
                                    </div>
                                    <div className="expanded-detail">
                                        <strong>Description:</strong> {item.description || 'No description provided'}
                                    </div>
                                    {item.uploadedAt && (
                                        <div className="expanded-detail">
                                            <strong>Uploaded:</strong> {new Date(item.uploadedAt).toLocaleString()}
                                        </div>
                                    )}
                                    <div className="expanded-detail">
                                        <strong>File ID:</strong> {item.id}
                                    </div>
                                </div>
                            )}
                        </div>
                        {onRemoveEvidence && (
                            <button 
                                className="evidence-remove-btn"
                                onClick={() => onRemoveEvidence(item.id)}
                                title="Remove evidence"
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