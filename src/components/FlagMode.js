import React, { useState, useEffect } from 'react';
import { CountryList } from './CountryURLList';
import StarsDisplay from './../StarsDisplay';

const FlagMode = ({ onExit }) => {
    const [displayedFlags, setDisplayedFlags] = useState([]);
    const [filteredFlags, setFilteredFlags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedLetter, setSelectedLetter] = useState(null);
    const flagsPerPage = 21;

    useEffect(() => {
        let filtered = CountryList.filter(country => 
            country.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (selectedLetter && selectedLetter !== 'All') {
            filtered = filtered.filter(country => country.label[0].toUpperCase() === selectedLetter);
        }

        filtered.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.label.localeCompare(b.label);
            } else {
                return b.label.localeCompare(a.label);
            }
        });

        setFilteredFlags(filtered);
        setDisplayedFlags(filtered.slice(0, flagsPerPage));
    }, [searchTerm, sortOrder, selectedLetter]);

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

    const handleLetterFilter = (letter) => {
        setSelectedLetter(letter);
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

        return entries;
    };

    return (
        <div className="flag-mode-container">
            <div className='flag-mode-top'>
                <div className='flag-mode-header'>
                    <h1 className='flag-mode-title'>Flags of the World</h1>
                    {/* <button className='exit-flag-btn' onClick={onExit}>Exit List</button> */}
                </div>
                <p className='flag-mode-subtitle'>(Approximate) current and historical flags of countries, cities, provinces, and groups</p>
                
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
                <div className="letter-buttons">
                    {['All', ...Array(26).keys()].map(i => {
                        const letter = i === 'All' ? 'All' : String.fromCharCode(65 + i); // A-Z
                        return (
                            <button 
                                key={letter} 
                                className={selectedLetter === letter ? 'selected' : ''}
                                onClick={() => handleLetterFilter(letter)}
                            >
                                {letter}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flags-grid">
                {displayedFlags.map((country, index) => {
                    const flagParams = parseURLParams(country.link);
                    return (
                        <div key={index} className="flag-item">
                            <h3 className="flag-label">{country.label}</h3>
                            <StarsDisplay
                                count={parseInt(flagParams.starCount) || 0}
                                size={parseInt(flagParams.starSize) || 55}
                                radius={parseInt(flagParams.starRadius) || 90}
                                circleCount={parseInt(flagParams.circleCount) || 1}
                                backColours={flagParams.backColours ? flagParams.backColours.split(',') : []}
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
                                crossHorizontalOffset={flagParams.crossHorizontalOffset || 0}
                                crossVerticalOffset={flagParams.crossVerticalOffset || 0}
                                customSvgPath={flagParams.customSvgPath || ''}
                                seychellesStripeCount={parseInt(flagParams.seychellesStripeCount) || 4}
                                containerFormat="flag"
                                overlays={flagParams.overlays}
                                updateOverlayPosition={() => {}}
                            />
                        </div>
                    );
                })}
            </div>
            {displayedFlags.length < filteredFlags.length && (
                <div className="show-container">
                    <button className="show-flag-btn" onClick={loadMoreFlags}>Show More</button>
                </div>
            )}
        </div>
    );
};

export default FlagMode;