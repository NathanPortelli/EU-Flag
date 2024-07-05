import React, { useState, useEffect, useMemo } from 'react';
import { Analytics } from "@vercel/analytics/react"
import Slider from './components/Slider';
import StarsDisplay from './StarsDisplay';
import DownloadButton from './DownloadButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { faArrowsRotate, faPlus, faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import { shapePaths, shapeOptions, patternOptions, amountOptions, patternIcons, amountIcons } from './components/ItemLists';
import ImageUpload from './components/ImageUpload';
import Divider from './components/Divider';
import { CustomShapeDropdown } from './components/CustomShapeDropdown';

const App = () => {
  const defaultBackColours = ['#003399', '#ffffff', '#000000', '#008000'];
  const [userSetColours, setUserSetColours] = useState([...defaultBackColours]);

  const [starCount, setStarCount] = useState(12);
  const [circleCount, setCircleCount] = useState(1);
  const [starSize, setStarSize] = useState(55);
  const [isNewFormat, setIsNewFormat] = useState(false);
  const [starRadius, setStarRadius] = useState(window.innerWidth < 1000 ? 80 : 90);
  const [backColours, setBackColours] = useState(defaultBackColours);
  const [starColour, setStarColour] = useState('#FFDD00');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [selectedShape, setSelectedShape] = useState('Star');
  const [selectedPattern, setSelectedPattern] = useState('Single');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [pointAway, setPointAway] = useState(false);
  const [outlineOnly, setOutlineOnly] = useState(false); 
  const [outlineWeight, setOutlineWeight] = useState(2); 
  const [activeSection, setActiveSection] = useState('Format');
  const [starRotation, setStarRotation] = useState(0);
  const [customImage, setCustomImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [shapeConfiguration, setShapeConfiguration] = useState('circle');

  const handleBackgroundImageUpload = (imageData) => {
    setBackgroundImage(imageData);
  };

  const getRelevantColors = () => {
    switch (selectedPattern) {
      case 'Single':
        return [backColours[0]];
      case 'Vertical':
      case 'Horizontal':
      case 'Bends':
        switch (selectedAmount) {
          case 'Bicolour':
            return backColours.slice(0, 2);
          case 'Thirds':
            return backColours.slice(0, 3);
          case 'Quarters':
          case 'Both Ways':
            return backColours.slice(0, 4);
          default:
            return backColours.slice(0, 2);
        }
      case 'Cross':
      case 'Saltire':
        return backColours.slice(0, 2);
      case 'Quadrants':
        return backColours.slice(0, 4);
      default:
        return [backColours[0]];
    }
  };

  // Calculate opposite colour
  const getOppositeColour = (hex) => {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Calculate initial label colours
  const initialLabelColors = useMemo(() => {
    const colors = {};
    backColours.forEach((color, index) => {
      colors[`back-${index}`] = getOppositeColour(color);
    });
    colors.star = getOppositeColour(starColour);
    return colors;
  }, [backColours, starColour]);

  const [labelColors, setLabelColors] = useState(initialLabelColors);

  const handleImageUpload = (imageData) => {
    setCustomImage(imageData);
  };

  const handleImageRemove = () => {
    setCustomImage(null);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1000) {
        setIsNewFormat(true);
        setStarRadius(80);
      } else {
        setIsNewFormat(false);
        setStarRadius(90);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const getParamOrDefault = (paramName, defaultValue, parser = (v) => v) => {
      const paramValue = params.get(paramName);
      return paramValue !== null ? parser(paramValue) : defaultValue;
    };

    setStarCount(getParamOrDefault('starCount', 12, parseInt));
    setCircleCount(getParamOrDefault('circleCount', 1, parseInt));
    setStarSize(getParamOrDefault('starSize', 55, parseInt));
    setStarRadius(getParamOrDefault('starRadius', window.innerWidth < 1000 ? 80 : 90, parseInt));
    setStarColour(getParamOrDefault('starColour', '#FFDD00'));
    setRotationAngle(getParamOrDefault('rotationAngle', 0, parseInt));
    setSelectedShape(getParamOrDefault('shape', 'Star'));
    setSelectedPattern(getParamOrDefault('pattern', 'Single'));
    setSelectedAmount(getParamOrDefault('amount', ''));
    setPointAway(getParamOrDefault('pointAway', false, (v) => v === 'true'));
    setOutlineOnly(getParamOrDefault('outlineOnly', false, (v) => v === 'true'));
    setOutlineWeight(getParamOrDefault('outlineWeight', 2, parseInt));
    setStarRotation(getParamOrDefault('starRotation', 0, parseInt));
    setShapeConfiguration(getParamOrDefault('shapeConfiguration', 'circle'));

    // Handle background colours
    const urlBackColors = params.get('backColours');
    if (urlBackColors) {
      const colors = urlBackColors.split(',');
      setBackColours(colors);
      setUserSetColours(colors);
    } else {
      setBackColours(defaultBackColours);
      setUserSetColours(defaultBackColours);
    }

  }, []);

  const updateURL = () => {
    const params = new URLSearchParams();
    
    params.set('starCount', starCount);
    params.set('circleCount', circleCount);
    params.set('starSize', starSize);
    params.set('starRadius', starRadius);
    params.set('starColour', starColour);
    params.set('rotationAngle', rotationAngle);
    params.set('shape', selectedShape);
    params.set('pattern', selectedPattern);
    params.set('amount', selectedAmount);
    params.set('pointAway', pointAway.toString());
    params.set('outlineOnly', outlineOnly.toString());
    params.set('outlineWeight', outlineWeight);
    params.set('starRotation', starRotation);
    params.set('shapeConfiguration', shapeConfiguration);
    params.set('backColours', backColours.join(','));
  
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };

  const debouncedUpdateURL = debounce(updateURL, 300);

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  useEffect(() => {
    debouncedUpdateURL();
  }, [starCount, circleCount, starSize, starRadius, starColour, rotationAngle, selectedShape, selectedPattern, selectedAmount, pointAway, outlineOnly, outlineWeight, starRotation, shapeConfiguration, backColours]);

  const setStateAndUpdateURL = (setter) => (value) => {
    setter(value);
    updateURL();
  };

  const setStarCountAndURL = setStateAndUpdateURL(setStarCount);
  const setCircleCountAndURL = setStateAndUpdateURL(setCircleCount);
  const setStarSizeAndURL = setStateAndUpdateURL(setStarSize);
  const setStarColourAndURL = setStateAndUpdateURL(setStarColour);
  const setRotationAngleAndURL = setStateAndUpdateURL(setRotationAngle);
  const setSelectedShapeAndURL = setStateAndUpdateURL(setSelectedShape);
  const setSelectedPatternAndURL = setStateAndUpdateURL(setSelectedPattern);
  const setSelectedAmountAndURL = setStateAndUpdateURL(setSelectedAmount);
  const setPointAwayAndURL = setStateAndUpdateURL(setPointAway);
  const setOutlineOnlyAndURL = setStateAndUpdateURL(setOutlineOnly);
  const setOutlineWeightAndURL = setStateAndUpdateURL(setOutlineWeight);
  const setStarRotationAndURL = setStateAndUpdateURL(setStarRotation);
  const setShapeConfigurationAndURL = setStateAndUpdateURL(setShapeConfiguration);

  const handleBackColourChange = (colour, index) => {
    const newColours = [...backColours];
    newColours[index] = colour;
    setBackColours(newColours);
  
    const newUserSetColours = [...userSetColours];
    newUserSetColours[index] = colour;
    setUserSetColours(newUserSetColours);
  
    document.documentElement.style.setProperty(`--back-color-${index}`, colour);
    setLabelColors(prev => ({...prev, [`back-${index}`]: getOppositeColour(colour)}));

    updateURL();
  };

  
  const handleStarColourChange = (colour) => {
    setStarColourAndURL(colour);
    document.documentElement.style.setProperty('--star-color', colour);
    
    setLabelColors(prev => ({...prev, star: getOppositeColour(colour)}));

    updateURL();
  };
  
  // Initialising label colours on component mount
  useEffect(() => {
    const initialLabelColors = {};
    backColours.forEach((color, index) => {
      initialLabelColors[`back-${index}`] = getOppositeColour(color);
    });
    initialLabelColors.star = getOppositeColour(starColour);
    setLabelColors(initialLabelColors);
  }, [backColours, starColour]);

  const CustomToggle = ({ option1, option2, isActive, onChange }) => {
    return (
      <div className="custom-toggle" onClick={onChange}>
        <div className={`custom-toggle-option ${!isActive ? 'active' : ''}`}>
          {option1}
        </div>
        <div className={`custom-toggle-option ${isActive ? 'active' : ''}`}>
          {option2}
        </div>
      </div>
    );
  };

  const handleShapeConfigurationChange = (e) => {
    const newConfig = e.target.value;
    if (newConfig === 'square') {
      setCircleCount(1);
    }
    setShapeConfigurationAndURL(newConfig);
  };

  const handlePatternChange = (event) => {
    const pattern = event.target.value;
    setSelectedPatternAndURL(pattern);
    setSelectedAmountAndURL('');
  
    let coloursCount = 1;
  
    switch (pattern) {
      case 'Single':
        coloursCount = 1;
        break;
      case 'Vertical':
      case 'Horizontal':
      case 'Bends':
      case 'Cross':
      case 'Saltire':
        coloursCount = 2;
        break;
      case 'Quadrants':
        coloursCount = 4;
        break;
      default:
        coloursCount = 1;
    }
    const newColours = userSetColours.slice(0, coloursCount);
    setBackColours(newColours);

    updateURL();
  };
  
  const handleAmountChange = (event) => {
    const amount = event.target.value;
    setSelectedAmountAndURL(amount);
  
    let coloursCount = 2;
  
    if (amount === 'Thirds') {
      coloursCount = 3;
    } else if (amount === 'Quarters' || amount === 'Both Ways') {
      coloursCount = 4;
    }
  
    const newColours = userSetColours.slice(0, coloursCount);
    setBackColours(newColours);

    updateURL();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert("Current URL copied to clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert("Failed to copy URL. Please try again.");
      });
  };

  const handleRefresh = () => {
    // Remove query parameters
    window.history.replaceState({}, '', window.location.pathname);
    window.location.reload();
  };

  return (
    <div className={`App ${isNewFormat ? 'old-format' : 'new-format'}`}>
      <header className="App-header">
        <h1>EU Flag Maker</h1>
        <div className="header-buttons">
          <div>
            <button className="header-button" onClick={handleShare}>
              <FontAwesomeIcon icon={faShareFromSquare} className="header-icon" />
            </button>
          </div>
          <div>
            <button className="header-button" onClick={handleRefresh}>
              <FontAwesomeIcon icon={faArrowsRotate} className="header-icon" />
            </button>
          </div>
        </div>
      </header>
      <main className="App-main">
        <div className="App-content">
          <div className="Stars-content">
            <StarsDisplay
              count={starCount}
              size={starSize}
              radius={starRadius}
              circleCount={circleCount}
              backColours={backColours}
              starColour={starColour}
              rotationAngle={rotationAngle}
              shape={selectedShape}
              pointAway={pointAway}
              outlineOnly={outlineOnly}
              outlineWeight={outlineWeight}
              pattern={selectedPattern}
              amount={selectedAmount}
              starRotation={starRotation}
              customImage={customImage}
              backgroundImage={backgroundImage}
              shapeConfiguration={shapeConfiguration}
            />
          </div>
          <div className="Slider-content">
            <nav className="App-nav">
              <button 
                onClick={() => setActiveSection('Format')} 
                className={activeSection === 'Format' ? 'active' : ''}
              >
                Format
              </button>
              <button 
                onClick={() => setActiveSection('Shape')} 
                className={activeSection === 'Shape' ? 'active' : ''}
              >
                Shape
              </button>
              <button 
                onClick={() => setActiveSection('Overlays')} 
                className={activeSection === 'Overlays' ? 'active' : ''}
              >
                Overlays
              </button>
              <button 
                onClick={() => setActiveSection('Background')} 
                className={activeSection === 'Background' ? 'active' : ''}
              >
                Background
              </button>
            </nav>
            {activeSection === 'Format' && (
              <div className="toolbar-segment">
                <div className="Shape-selector">
                  <div className="Shape-container">
                    <label htmlFor="configurationSelector" className="shape-label">Configuration</label>
                    <select 
                      id="configurationSelector" 
                      value={shapeConfiguration} 
                      onChange={handleShapeConfigurationChange}
                      className="shape-dropdown"
                    >
                      <option value="circle">Circle</option>
                      <option value="square">Square</option>
                    </select>
                  </div>
                </div>
                <Slider
                  value={starCount}
                  onChange={setStarCountAndURL}
                  min={0}
                  max={50}
                  unit={starCount === 1 ? "star" : "stars"}
                  label="Star Count"
                />
                {shapeConfiguration === 'circle' && (
                  <>
                    <Slider
                      value={circleCount}
                      onChange={setCircleCountAndURL}
                      min={1}
                      max={3}
                      unit={circleCount === 1 ? "circle" : "circles"}
                      label="Circle Count"
                    />
                    <Slider
                      value={rotationAngle}
                      onChange={setRotationAngleAndURL}
                      min={0}
                      max={360}
                      unit="°"
                      label="Rotation Angle"
                    />
                  </>
                )}
              </div>
            )}
            {activeSection === 'Shape' && (
              <div className="toolbar-segment">
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  hasImage={!!customImage}
                />
                {!customImage && (
                  <>
                    <Divider text="or" />
                    <div className="Shape-selector">
                      <CustomShapeDropdown
                        options={shapeOptions}
                        value={selectedShape}
                        onChange={setSelectedShapeAndURL}
                        shapePaths={shapePaths}
                        title={"Shape"}
                      />
                    </div>
                    <div className="Shape-colour">
                      <div className="Colour-container" id="star-colour">
                        <label
                          htmlFor="starColourPicker"
                          className="colour-label"
                          style={{color: labelColors.star}}
                        >
                          Shape Colour
                        </label>
                        <input
                          type="color"
                          id="starColourPicker"
                          value={starColour}
                          onChange={(e) => handleStarColourChange(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
                {shapeConfiguration === 'circle' && (
                  <div className="custom-toggle-container">
                    <CustomToggle 
                      option1="Pointing Up"
                      option2="Pointing Outward"
                      isActive={pointAway}
                      onChange={() => setPointAwayAndURL(!pointAway)}
                    />
                  </div>
                )}
                {!customImage && (
                  <>
                    <div className="custom-toggle-container">
                      <CustomToggle 
                        option1="Filled"
                        option2="Outline Only"
                        isActive={outlineOnly}
                        onChange={() => setOutlineOnlyAndURL(!outlineOnly)}
                      />
                    </div>
                    {outlineOnly && (
                      <div className="outline-weight">
                        <Slider
                          value={outlineWeight}
                          onChange={setOutlineWeightAndURL}
                          min={1}
                          max={15}
                          unit="px (outline)"
                          label="Outline Weight"
                        />
                      </div>
                    )}
                  </>
                )}
                <Slider
                  value={starSize}
                  onChange={setStarSizeAndURL}
                  min={10}
                  max={150}
                  unit="px"
                  label="Star Size"
                />
                <Slider
                  value={starRotation}
                  onChange={setStarRotationAndURL}
                  min={0}
                  max={360}
                  unit="°"
                  label="Star Rotation"
                />
              </div>
            )}
            {activeSection === 'Overlays' && (
              <div className="toolbar-segment">
                <p><b>Work-in-progress, coming soon!</b></p>
                <div className="download-button-container">
                  <button className="download-button">
                    <FontAwesomeIcon icon={faPlus} className="download-icon" />
                    Add New
                  </button>
                </div>
              </div>
            )}
            {activeSection === 'Background' && (
              <div className="toolbar-segment">
                <div className='background-image'>
                  <ImageUpload
                    onImageUpload={handleBackgroundImageUpload}
                    onImageRemove={() => setBackgroundImage(null)}
                    hasImage={!!backgroundImage}
                    label="Upload Background Image"
                  />
                  {!backgroundImage && (
                    <span className="tooltiptext">2:3 Aspect Ratio optimal for downloading</span>
                  )}
                  </div>
                {!backgroundImage && (
                  <>
                  <Divider text="or" />
                  <div className="Shape-selector">
                    <div className="Shape-container">
                      <label htmlFor="patternSelector" className="shape-label">Pattern</label>
                      <select 
                        id="patternSelector" 
                        value={selectedPattern} 
                        onChange={handlePatternChange} 
                        className="shape-dropdown"
                      >
                        {patternOptions.map((pattern) => (
                          <option key={pattern} value={pattern}>
                            {patternIcons[pattern]}{'\u00A0\u00A0\u00A0\u00A0'}{pattern}
                          </option>
                        ))}
                      </select>
                    </div>
                    {['Horizontal', 'Vertical', 'Bends'].includes(selectedPattern) && (
                      <div className="Shape-container">
                        <label htmlFor="amountSelector" className="shape-label">Amount</label>
                        <select 
                          id="amountSelector" 
                          value={selectedAmount} 
                          onChange={handleAmountChange} 
                          className="shape-dropdown"
                        >
                          {amountOptions[selectedPattern].map((amount) => (
                            <option key={amount} value={amount}>
                              {amountIcons[amount]}{'\u00A0\u00A0\u00A0\u00A0'}{amount}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <p className="colours-header">Colours</p>
                    {backColours.slice(0, selectedPattern === 'Single' ? 1 : backColours.length).map((colour, index) => (
                      <div className="Colour-container" key={index}>
                        <label
                          htmlFor={`backColourPicker-${index}`}
                          className="colour-label"
                          style={{color: labelColors[`back-${index}`]}}
                        >
                          Background Colour {index + 1}
                        </label>
                        <input
                          type="color"
                          id={`backColourPicker-${index}`}
                          value={colour}
                          onChange={(e) => handleBackColourChange(e.target.value, index)}
                        />
                      </div>
                    ))}
                  </div>
                  </>
                )}
              </div>
            )}
            <DownloadButton 
              backColours={getRelevantColors()}
              selectedPattern={selectedPattern} 
              selectedAmount={selectedAmount} 
              backgroundImage={backgroundImage}
              customImage={customImage}
            />
          </div>
        </div>
        <a href="https://github.com/NathanPortelli/EU-Flag" className="github-icon" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github"></i>
        </a>
        <Analytics />
      </main>
      <footer className="App-footer">
      </footer>
    </div>
  );
};

export default App;