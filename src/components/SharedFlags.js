import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import StarsDisplay from '../StarsDisplay';
import Notification from './Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import Divider from './Divider';

const tagColors = {
  'OC': { background: '#FF6F61', color: '#FFF', border: '#FFF', hoverBackground: '#FF8C71', hoverColor: '#FFF', selectedBackground: '#FFDD00', selectedColor: '#000000' },
  'Historical': { background: '#8C8C8C', color: '#FFF', border: '#FFF', hoverBackground: '#A8A8A8', hoverColor: '#FFF', selectedBackground: '#FFDD00', selectedColor: '#000000' },
  'Redesign': { background: '#007BFF', color: '#FFF', border: '#FFF', hoverBackground: '#0056b3', hoverColor: '#FFF', selectedBackground: '#FFDD00', selectedColor: '#000000' },
  'Current': { background: '#ff2f00', color: '#FFF', border: '#FFF', hoverBackground: '#FFCC00', hoverColor: '#FFF', selectedBackground: '#FFDD00', selectedColor: '#000000' },
  'Fictional': { background: '#9B59B6', color: '#FFF', border: '#FFF', hoverBackground: '#8E44AD', hoverColor: '#FFF', selectedBackground: '#FFDD00', selectedColor: '#000000' },
  'Random': { background: '#2ECC71', color: '#FFF', border: '#FFF', hoverBackground: '#27AE60', hoverColor: '#FFF', selectedBackground: '#FFDD00', selectedColor: '#000000' },
  'Other': { background: '#E67E22', color: '#FFF', border: '#FFF', hoverBackground: '#D35400', hoverColor: '#FFF', selectedBackground: '#FFDD00', selectedColor: '#000000' }
};

const SharedFlags = () => {
  const [sharedFlags, setSharedFlags] = useState([]);
  const [displayedFlags, setDisplayedFlags] = useState([]);
  const [filteredFlags, setFilteredFlags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedTag, setSelectedTag] = useState(null);
  const [flagsPerPage] = useState(21);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchSharedFlags = async () => {
      const q = query(collection(db, 'sharedFlags'), orderBy('flagName'));
      const querySnapshot = await getDocs(q);
      const flags = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSharedFlags(flags);
      setFilteredFlags(flags);
      setDisplayedFlags(flags.slice(0, flagsPerPage));
    };

    fetchSharedFlags();
  }, []);

  useEffect(() => {
    let filtered = sharedFlags.filter(flag =>
      flag.flagName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedTag) {
      filtered = filtered.filter(flag => flag.tags && flag.tags.includes(selectedTag));
    }

    filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.flagName.localeCompare(b.flagName);
      } else {
        return b.flagName.localeCompare(a.flagName);
      }
    });

    setFilteredFlags(filtered);
    setDisplayedFlags(filtered.slice(0, flagsPerPage));
  }, [searchTerm, sortOrder, selectedTag, sharedFlags]);

  const loadMoreFlags = () => {
    const currentLength = displayedFlags.length;
    const nextFlags = filteredFlags.slice(currentLength, currentLength + flagsPerPage);
    setDisplayedFlags([...displayedFlags, ...nextFlags]);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  const handleClearTagFilter = () => {
    setSelectedTag(null);
  };

  const handleShare = (url) => {
    console.log('Sharing URL:', url);
    navigator.clipboard.writeText(url).then(() => {
      setNotification('URL copied to clipboard!');
    }).catch(err => {
      setNotification('Failed to copy URL.');
    });
  };

  const parseURLParams = (url) => {
    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.search);
    const entries = Object.fromEntries(params.entries());

    if (entries.overlays) {
      entries.overlays = entries.overlays.split(';;').map(overlay => {
        const [type, ...rest] = overlay.split('|');
        if (type === 'text') {
          const [text, font, size, width, offsetX, offsetY, rotation, color, textCurve] = rest;
          return {
            type: 'text',
            text: decodeURIComponent(text),
            font: decodeURIComponent(font),
            size: parseFloat(size),
            width: parseFloat(width),
            offsetX: parseFloat(offsetX),
            offsetY: parseFloat(offsetY),
            rotation: parseFloat(rotation),
            color: decodeURIComponent(color),
            textCurve: parseFloat(textCurve) || 0
          };
        } else {
          const [shape, size, offsetX, offsetY, rotation, color] = rest;
          return {
            type: 'shape',
            shape,
            size: parseFloat(size),
            offsetX: parseFloat(offsetX),
            offsetY: parseFloat(offsetY),
            rotation: parseFloat(rotation),
            color: decodeURIComponent(color)
          };
        }
      });
    } else {
      entries.overlays = [];
    }

    if (entries.backColours) {
      entries.backColours = entries.backColours.split(',');
    }

    return entries;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getTagStyle = (tag) => {
    const color = tagColors[tag] || tagColors['Other'];
    return {
      backgroundColor: color.background,
      color: color.color,
      borderColor: color.border
    };
  };

  const allTags = [...new Set(sharedFlags.flatMap(flag => flag.tags || []))];

  return (
    <div className="shared-flags-container">
      <h2 className='flag-mode-title'>Shared Flags</h2>
      <p className='flag-mode-subtitle'>Explore shared flags created by others.</p>
      <p className='report-para'>To add your own flag, click on the <b>"Share Online"</b> button under the flag in the Designer.</p>
      <p className='report-para'>Please report any obscene material via <a href='https://x.com/NathPortelli'>Twitter/X</a> or <a href="mailto:portellinathan@yahoo.com">email</a></p>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search flags..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="sort-buttons">
        <button 
          className={sortOrder === 'asc' ? 'selected' : ''}
          onClick={() => handleSortChange('asc')}
        >
          Ascending
        </button>
        <button 
          className={sortOrder === 'desc' ? 'selected' : ''}
          onClick={() => handleSortChange('desc')}
        >
          Descending
        </button>
      </div>
      <div className="tags-filter">
        {selectedTag ? (
          <button onClick={handleClearTagFilter} className="clear-filter-btn">Clear Filter</button>
        ) : (
          <div className="tags-list">
            {allTags.map((tag, index) => (
              <span 
                key={index}
                className="tag-state"
                style={getTagStyle(tag)}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <Divider />
      <div className="flags-grid">
        {displayedFlags.map((flag, index) => {
          const flagParams = parseURLParams(flag.flagURL);
          return (
            <div key={index} className="flag-item">
              <h3 className="flag-label">{flag.flagName}</h3>
              <h4 className="flag-author">by {flag.displayName}</h4>
              <p className="report-para">Submitted on: {formatDate(flag.createdAt)}</p>
              <div className="tags-container">
                <div className="tags-list">
                  {flag.tags && flag.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="tag-state-fixed"
                      style={getTagStyle(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <StarsDisplay
                count={parseInt(flagParams.starCount) || 0}
                size={parseInt(flagParams.starSize) || 55}
                radius={parseInt(flagParams.starRadius) || 90}
                circleCount={parseInt(flagParams.circleCount) || 1}
                backColours={flagParams.backColours || []}
                starColour={flagParams.starColour || '#FFDD00'}
                rotationAngle={parseInt(flagParams.rotationAngle) || 0}
                shape={flagParams.shape || 'Star'}
                pointAway={flagParams.pointAway === 'true'}
                outlineOnly={flagParams.outlineOnly === 'true'}
                outlineWeight={parseInt(flagParams.outlineWeight) || 2}
                pattern={flagParams.pattern || 'Single'}
                amount={flagParams.amount || ''}
                starRotation={parseInt(flagParams.starRotation) || 0}
                shapeConfiguration={flagParams.shapeConfiguration || 'circle'}
                crossSaltireSize={parseInt(flagParams.crossSaltireSize) || 11}
                gridRotation={parseInt(flagParams.gridRotation) || 0}
                starsOnTop={flagParams.starsOnTop === 'true'}
                checkerSize={parseInt(flagParams.checkerSize) || 4}
                sunburstStripeCount={parseInt(flagParams.sunburstStripeCount) || 8}
                borderWidth={parseInt(flagParams.borderWidth) || 10}
                stripeWidth={parseInt(flagParams.stripeWidth) || 10}
                circleSpacing={parseInt(flagParams.circleSpacing) || 100}
                gridSpacing={parseInt(flagParams.gridSpacing) || 100}
                crossHorizontalOffset={parseFloat(flagParams.crossHorizontalOffset) || 0}
                crossVerticalOffset={parseFloat(flagParams.crossVerticalOffset) || 0}
                customSvgPath={flagParams.customSvgPath || ''}
                seychellesStripeCount={parseInt(flagParams.seychellesStripeCount) || 4}
                containerFormat="flag"
                overlays={flagParams.overlays}
                updateOverlayPosition={() => {}}
              />
              <div className="share-section" id="online-share-section">
                <input
                  type="text"
                  value={flag.flagURL}
                  readOnly
                  className="share-input"
                />
                <button onClick={() => handleShare(flag.flagURL)} className="share-button">
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {displayedFlags.length < filteredFlags.length && (
        <div className="show-container">
          <button className="show-flag-btn" onClick={loadMoreFlags}>Show More</button>
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

export default SharedFlags;
