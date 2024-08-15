import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import Notification from './Notification';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';

const ShareFlagForm = ({ flagURL, onClose }) => {
    const [displayName, setDisplayName] = useState('');
    const [flagName, setFlagName] = useState('');
    const [obsceneWords, setObsceneWords] = useState([]);
    const [notification, setNotification] = useState(null);

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
    
        if (recentSubmissions.length >= 5) {
            setNotification('You have reached the maximum number of submissions in the past 24 hours.');
            return;
        }
    
        // Proceed with submission
        try {
            await addDoc(collection(db, 'sharedFlags'), {
                displayName,
                flagName,
                flagURL,
                createdAt: Timestamp.now(),
            });
    
            // Update submission history
            recentSubmissions.push(now);
            localStorage.setItem('submissionHistory', JSON.stringify(recentSubmissions));
    
            setNotification('Flag shared successfully!');
            onClose();
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
