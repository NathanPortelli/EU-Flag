import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import Notification from './Notification';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import Divider from './Divider';

const ShareFlagForm = ({ flagURL, onClose, togglePublicShareMode }) => {
    const [displayName, setDisplayName] = useState('');
    const [flagName, setFlagName] = useState('');
    const [obsceneWords, setObsceneWords] = useState([]);
    const [notification, setNotification] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);

    const tags = [
        'OC', 
        'Historical', 
        'Redesign', 
        'Current', 
        'Fictional', 
        'Random',
        'Offensive',
        'Other'
    ];  

    const setTagStyles = (tag) => {
        const colors = {
            'OC': { 
                background: '#FF6F61',
                color: '#FFF', 
                border: '#FFF', 
                hoverBackground: '#FF8C71',
                hoverColor: '#003399', 
                selectedBackground: '#FFDD00',
                selectedColor: '#003399'
            },
            'Historical': { 
                background: '#8C8C8C',
                color: '#FFF', 
                border: '#FFF', 
                hoverBackground: '#A8A8A8',
                hoverColor: '#003399', 
                selectedBackground: '#FFDD00', 
                selectedColor: '#003399'
            },
            'Redesign': { 
                background: '#007BFF',
                color: '#FFF', 
                border: '#FFF', 
                hoverBackground: '#0056b3',
                hoverColor: '#003399', 
                selectedBackground: '#FFDD00',
                selectedColor: '#003399'
            },
            'Current': { 
                background: '#0400ff',
                color: '#FFF', 
                border: '#FFF', 
                hoverBackground: '#FFCC00',
                hoverColor: '#003399', 
                selectedBackground: '#FFDD00',
                selectedColor: '#003399'
            },
            'Fictional': { 
                background: '#9B59B6', 
                color: '#FFF', 
                border: '#FFF', 
                hoverBackground: '#8E44AD',
                hoverColor: '#003399', 
                selectedBackground: '#FFDD00',
                selectedColor: '#003399'
            },
            'Offensive': { 
                background: '#ff0000', 
                color: '#FFF', 
                border: '#FFF', 
                hoverBackground: '#27AE60',
                hoverColor: '#003399', 
                selectedBackground: '#FFDD00', 
                selectedColor: '#003399'
            },
            'Random': { 
                background: '#2ECC71', 
                color: '#FFF', 
                border: '#FFF', 
                hoverBackground: '#27AE60',
                hoverColor: '#003399', 
                selectedBackground: '#FFDD00', 
                selectedColor: '#003399'
            },
            'Other': { 
                background: '#E67E22', 
                color: '#FFF', 
                border: '#FFF', 
                hoverBackground: '#D35400',
                hoverColor: '#003399', 
                selectedBackground: '#FFDD00', 
                selectedColor: '#003399'
            }
        };
        
        
        return colors[tag] || { background: '#000000', color: '#FFF', border: '#FFF', hoverBackground: '#000000', hoverColor: '#FFF', selectedBackground: '#000000', selectedColor: '#FFF' };
    };

    useEffect(() => {
        const fetchObsceneWords = async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/en');
                const text = await response.text();
                const words = text.split('\n').map(word => word.trim().toLowerCase()).filter(word => word.length > 0);
                setObsceneWords(words);
            } catch (error) {
                console.error('Error fetching list of obscene words:', error);
            }
        };
        
        fetchObsceneWords();
    }, []);

    const containsObsceneWords = (text) => {
        if (!text) return false;
        const lowerCaseText = text.toLowerCase();
        return obsceneWords.some(word => lowerCaseText.includes(word));
    };

    const handleTagSelection = (tag) => {
        setSelectedTags(prevTags => 
            prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (displayName.length > 40 || flagName.length > 90) {
            setNotification('Some fields exceed the maximum allowed length. Please correct them before submitting.');
            return;
        }
    
        if (containsObsceneWords(displayName) || containsObsceneWords(flagName) || containsObsceneWords(flagURL)) {
            setNotification('Please remove any obscene words before submitting.');
            return;
        }
    
        // Get submission history from local storage
        const submissionHistory = JSON.parse(localStorage.getItem('submissionHistory')) || [];
        const now = Date.now();
        const past24Hours = now - 24 * 60 * 60 * 1000;
        const recentSubmissions = submissionHistory.filter(timestamp => timestamp > past24Hours);
    
        if (recentSubmissions.length >= 15) {
            setNotification('You have reached the maximum number of submissions in the past 24 hours.');
            return;
        }
    
        // Proceed with submission
        try {
            await addDoc(collection(db, 'sharedFlags'), {
                displayName,
                flagName,
                flagURL,
                tags: selectedTags,
                createdAt: Timestamp.now(),
            });
    
            // Update submission history
            recentSubmissions.push(now);
            localStorage.setItem('submissionHistory', JSON.stringify(recentSubmissions));
    
            setNotification('Flag shared successfully!');
            togglePublicShareMode();
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            setNotification('Error sharing flag. Please try again.');
        }
    };

    return (
        <div className="save-menu">
            <h2 className='share-menu-title'>Share Online</h2>
            <p className='report-para'>When sharing, you will be posting the currently created flag onto the <b>'Online'</b> section of this site with other user-generated flags.</p>
            <form className='share-online-form' onSubmit={handleSubmit}>
                <div className="Text-container">
                    <label htmlFor="displayName" className="shape-label">Your Name</label>
                    <input 
                        type="text" 
                        id="displayName" 
                        placeholder="Enter your name..." 
                        className="shape-input" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value.slice(0, 40))} 
                        required
                        maxLength="30"
                    />
                </div>
                <div className="Text-container">
                    <label htmlFor="flagName" className="shape-label">Flag Name</label>
                    <input 
                        type="text" 
                        id="flagName" 
                        placeholder="Enter the flag's name..." 
                        className="shape-input" 
                        value={flagName}
                        onChange={(e) => setFlagName(e.target.value.slice(0, 90))}
                        required
                        maxLength="60"
                    />
                </div>
                <Divider />
                <div className="tags-container">
                    <label className="tags-label">Select Tags</label>
                    <div className="tags-list">
                        {tags.map(tag => {
                            const styles = setTagStyles(tag);
                            return (
                                <button
                                    key={tag}
                                    type="button"
                                    className={`tag-state ${selectedTags.includes(tag) ? 'selected' : ''}`}
                                    onClick={() => handleTagSelection(tag)}
                                    style={{
                                        '--tag-background': styles.background,
                                        '--tag-color': styles.color,
                                        '--tag-border': styles.border,
                                        '--tag-hover-background': styles.hoverBackground,
                                        '--tag-hover-color': styles.hoverColor,
                                        '--tag-selected-background': styles.selectedBackground,
                                        '--tag-selected-color': styles.selectedColor
                                    }}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <Divider />
                <button type="submit" className='share-button'>
                    <FontAwesomeIcon icon={faShare} className="random-icon" />
                    Share
                </button>
                {notification && (
                    <Notification 
                        message={notification} 
                        onClose={() => setNotification(null)} 
                    />
                )}
            </form>
        </div>
    );
};

export default ShareFlagForm;
