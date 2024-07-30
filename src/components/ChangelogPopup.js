import React, { useState } from 'react';
import { changelogData, upcomingFeatures } from './ChangelogData';

const ChangelogPopup = () => {
  const [activeTab, setActiveTab] = useState('changelog');

  return (
    <div className="changelog-popup">
      <div className="changelog-tabs">
        <button 
          className={`tab-button ${activeTab === 'changelog' ? 'active' : ''}`}
          onClick={() => setActiveTab('changelog')}
        >
          Changelog
        </button>
        <button 
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'changelog' && (
          <div className="changelog-content">
            {changelogData.map((entry, index) => (
              <div key={index}>
                <h3>{entry.version} - {entry.date}</h3>
                <ul>
                  {entry.changes.map((change, changeIndex) => (
                    <li key={changeIndex}>{change}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'upcoming' && (
          <div className="upcoming-content">
            <h3 style={{
              marginTop: '20px',
              marginBottom: '10px',
              borderBottom: '1px solid rgba(255, 221, 0, 0.3)',
              paddingBottom: '5px'
            }}>Planned Features</h3>
            <ul>
              {upcomingFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <h4 style={{
              marginTop: '20px',
              borderTop: '1px solid rgba(255, 221, 0, 0.3)',
              paddingTop: '10px'
            }}>For any suggestions/issues, contact me via<a href='https://x.com/NathPortelli'>Twitter/X</a>or<a href="mailto:portellinathan@yahoo.com">email</a></h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangelogPopup;