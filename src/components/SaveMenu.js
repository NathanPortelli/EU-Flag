import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import Notification from './Notification';

const SaveMenu = ({ currentUrl, onClose }) => {
    const [notification, setNotification] = useState(null);
    const [flagName, setFlagName] = useState('');
    const [savedFlags, setSavedFlags] = useState([]);

    useEffect(() => {
        const storedFlags = JSON.parse(localStorage.getItem('savedFlags') || '[]');
        setSavedFlags(storedFlags);
    }, []);

    const handleSave = () => {
        if (!flagName.trim()) return;

        const newFlag = { name: flagName, url: currentUrl, date: new Date().toISOString() };
        const updatedFlags = [newFlag, ...savedFlags.slice(0, 9)];

        setSavedFlags(updatedFlags);
        localStorage.setItem('savedFlags', JSON.stringify(updatedFlags));
        setFlagName('');
        setNotification("Flag saved successfully!");
    };

    const handleDelete = (index) => {
        const updatedFlags = savedFlags.filter((_, i) => i !== index);
        setSavedFlags(updatedFlags);
        localStorage.setItem('savedFlags', JSON.stringify(updatedFlags));
        setNotification("Flag deleted successfully!");
    };

    const handleShare = () => {
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                setNotification("Current URL copied to clipboard!");
            })
            .catch(err => {
                setNotification("Failed to copy URL. Please try again.");
            });
    };

    return (
        <div className="save-menu">
            <h2 className="save-menu-title">Share Flag</h2>
            <div className="share-section">
                <input type="text" value={currentUrl} readOnly className="share-input" />
                <button onClick={handleShare} className="share-button">
                    <FontAwesomeIcon icon={faShare} />
                </button>
            </div>

            <h2 className="save-menu-title">Save Flag</h2>
            <div className="save-section">
                <input
                    type="text"
                    value={flagName}
                    onChange={(e) => setFlagName(e.target.value)}
                    placeholder="Enter Flag Name"
                    className="save-input"
                />
                <button
                    onClick={handleSave}
                    className="save-button"
                    disabled={!flagName.trim()}
                >
                    <FontAwesomeIcon icon={faSave} />
                </button>
            </div>
            {savedFlags.length > 0 && (  
                <div>
                    <h3 className="saved-flags-title">Saved Flags</h3>
                    <div className="saved-flags-container">
                        {savedFlags.map((flag, index) => (                    
                            <div key={index} className="saved-flag-item">
                                <a href={flag.url} target="_blank" rel="noopener noreferrer" className="saved-flag-link">
                                    {flag.name}
                                </a>
                                <button onClick={() => handleDelete(index)} className="delete-button">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {notification && (
                <Notification 
                    message={notification} 
                    onClose={() => setNotification(null)} 
                />
            )}
        </div>
    );
};

export default SaveMenu;