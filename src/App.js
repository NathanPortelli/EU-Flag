import React, { useState, useEffect, useMemo } from 'react';
import Slider from './components/Slider';
import StarsDisplay from './StarsDisplay';
import DownloadButton from './DownloadButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { faArrowsRotate, faPlus, faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import './styles/App.css';

import { shapePaths, shapeOptions, patternOptions, amountOptions, patternIcons, amountIcons } from './components/ItemLists';
import ImageUpload from './components/ImageUpload';
import Divider from './components/Divider';
import { CustomShapeDropdown } from './components/CustomShapeDropdown';
import { overlaySymbols } from './components/OverlaySymbols';
import Notification from './components/Notification';
import { CustomToggle } from './components/CustomToggle';
import { CountryList } from './components/CountryURLList';
import FilterableSelect from './components/FilterableSelect';

const App = () => {
  const [notification, setNotification] = useState(null);
  const defaultBackColours = ['#003399', '#ffffff', '#000000', '#008000', '#ff5733', '#33ff57', '#5733ff', '#f0f033', '#33f0f0', '#f033f0', '#ff33aa', '#33aaff', '#aa33ff', '#ff3380', '#33ffaa', '#ffaa33'];
  const [userSetColours, setUserSetColours] = useState([...defaultBackColours]);
  const MAX_OVERLAYS = 15;

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
  const [overlays, setOverlays] = useState([]);
  const [stripeCount, setStripeCount] = useState(2);
  const [containerFormat, setContainerFormat] = useState('circle');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const handleBackgroundImageUpload = (imageData) => {
    setBackgroundImage(imageData);
  };
  
  const moveOverlay = (index, direction) => {
    const newOverlays = [...overlays];
    if (direction === 'up' && index > 0) {
      [newOverlays[index - 1], newOverlays[index]] = [newOverlays[index], newOverlays[index - 1]];
    } else if (direction === 'down' && index < newOverlays.length - 1) {
      [newOverlays[index], newOverlays[index + 1]] = [newOverlays[index + 1], newOverlays[index]];
    }
    setOverlays(newOverlays);
  };
  
  const addOverlay = () => {
    if (overlays.length < MAX_OVERLAYS) {
      const randomShape = overlaySymbols[Math.floor(Math.random() * overlaySymbols.length)].value;
      const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      setOverlays(prevOverlays => [{ 
        shape: randomShape, 
        size: 50,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        color: randomColor
      }, ...prevOverlays]);
    }
  };

  const removeOverlay = (index) => {
    setOverlays(prevOverlays => prevOverlays.filter((_, i) => i !== index));
  };

  const updateOverlayProperty = (index, property, value) => {
    setOverlays(prevOverlays => {
      const newOverlays = [...prevOverlays];
      newOverlays[index][property] = value;
      return newOverlays;
    });
  };

  const getRelevantColors = () => {
    switch (selectedPattern) {
      case 'Single':
        return [backColours[0]];
      case 'Vertical':
      case 'Horizontal':
        return backColours.slice(0, stripeCount);
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
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let saturation = (max - min) / max;
    
    if (saturation < 0.2 && luminance > 0.4 && luminance < 0.6) {
      return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }
    return `#${(0xFFFFFF ^ parseInt(hex.slice(1), 16)).toString(16).padStart(6, '0')}`;
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
      const smallScreen = window.innerWidth < 1000;
      setIsSmallScreen(smallScreen);
      setIsNewFormat(!smallScreen);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatClass = containerFormat === 'flag' || isSmallScreen ? 'old-format' : 'new-format';

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

    setSelectedPattern(getParamOrDefault('pattern', 'Single'));
    if (params.get('pattern') === 'Horizontal' || params.get('pattern') === 'Vertical') {
      setStripeCount(getParamOrDefault('stripeCount', 2, parseInt));
    } else {
      setSelectedAmount(getParamOrDefault('amount', ''));
    }
    
    const overlayData = params.get('overlays');
    if (overlayData) {
      const parsedOverlays = overlayData.split(';').map(overlayString => {
        const [shape, size, offsetX, offsetY, rotation, color] = overlayString.split(',');
        return {
          shape,
          size: parseFloat(size),
          offsetX: parseFloat(offsetX),
          offsetY: parseFloat(offsetY),
          rotation: parseFloat(rotation),
          color: `#${color}`
        };
      });
      setOverlays(parsedOverlays);
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
  
    params.set('pattern', selectedPattern);
    if (selectedPattern === 'Horizontal' || selectedPattern === 'Vertical') {
      params.set('stripeCount', stripeCount);
    } else {
      params.set('amount', selectedAmount);
    }

    if (overlays.length > 0) {
      const overlayData = overlays.map(overlay => 
        `${overlay.shape},${overlay.size},${overlay.offsetX},${overlay.offsetY},${overlay.rotation},${overlay.color.substring(1)}`
      ).join(';');
      params.set('overlays', overlayData);
    }
  
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
  }, [starCount, circleCount, starSize, starRadius, starColour, rotationAngle, selectedShape, selectedPattern, selectedAmount, pointAway, outlineOnly, outlineWeight, starRotation, shapeConfiguration, backColours, overlays]);

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

  const handleStripeCountChange = (value) => {
    setStripeCount(value);
    setBackColours(userSetColours.slice(0, value));
    updateURL();
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

    if (pattern === 'Horizontal' || pattern === 'Vertical') {
      setStripeCount(2);
      setBackColours(userSetColours.slice(0, 2));
    } else {
      if (['Quadrants', 'Saltire', 'Cross', 'Single'].includes(pattern)) {
        setSelectedAmountAndURL('');
      } else {
        setSelectedAmountAndURL(amountOptions[pattern][0] || '');
      }

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
    }
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
      setNotification("Current URL copied to clipboard!");
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
      setNotification("Failed to copy URL. Please try again.");
    });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const handleRefresh = () => {
    window.history.replaceState({}, '', window.location.pathname);
    window.location.reload();
  };

  return (
    <div className={`App ${formatClass}`}>
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
          <div>
            <a href="https://github.com/NathanPortelli/EU-Flag" className="github-icon" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </header>
      <main className="App-main">
        <div className="App-content">
          <div className="Stars-content">
            <div className="Stars-display">
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
                overlays={overlays}
                containerFormat={containerFormat}
              />
            </div>
            <div className="custom-toggle-container">
              <CustomToggle 
                option1="Circle"
                option2="Flag"
                isActive={containerFormat === 'flag'}
                onChange={() => setContainerFormat(containerFormat === 'circle' ? 'flag' : 'circle')}
              />
            </div>
            <div className="Shape-selector">
              <div className="Shape-container">
                <label htmlFor="countrySelector" className="shape-label">Samples</label>
                <select 
                  id="countrySelector" 
                  className="shape-dropdown"
                  onChange={(e) => window.location.href = CountryList.find(country => country.value === e.target.value).link}
                >
                  <option value="">Select a Country</option>
                  {CountryList.map((country) => (
                    <option key={country.value} value={country.value}>{country.label}</option>
                  ))}
                </select>
              </div>
            </div>
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
                      <option value="circle">EU</option>
                      <option value="square">USA</option>
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
                <p className='image-disclaimer'>Images cannot be shared via link.</p>
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
                {overlays.length < MAX_OVERLAYS && (
                  <div className="add-button-container">
                    <button className="download-button" onClick={addOverlay}>
                      <FontAwesomeIcon icon={faPlus} className="download-icon" />
                      Add New
                    </button>
                  </div>
                )}
                {overlays.map((overlay, index) => (
                  <div className='overlay-full-container'>
                    <div className="overlay-handle">
                      <div className="overlay-topcontent">
                        <div className="overlay-arrows">
                          <button 
                            className="arrow-button"
                            onClick={() => moveOverlay(index, 'up')}
                            disabled={index === 0}
                          >
                            <i className="fas fa-arrow-up"></i>
                          </button>
                          <button 
                            className="arrow-button"
                            onClick={() => moveOverlay(index, 'down')}
                            disabled={index === overlays.length - 1}
                          >
                            <i className="fas fa-arrow-down"></i>
                          </button>
                        </div>
                        <div className="overlay-sliders">
                          <div className="overlay-content">
                            <div className="Shape-container">
                              <label htmlFor={`overlaySelector-${index}`} className="shape-label">Overlay</label>
                              <FilterableSelect
                                options={overlaySymbols}
                                value={overlay.shape} 
                                onChange={(value) => updateOverlayProperty(index, 'shape', value)}
                                placeholder="Select or type to filter..."
                              />
                            </div>
                            <div className="overlay-container">
                              <button className="remove-image" onClick={() => removeOverlay(index)}>
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="overlay-sliders">
                    <Slider
                        value={overlay.offsetY}
                        onChange={(value) => updateOverlayProperty(index, 'offsetY', value)}
                        min={-300}
                        max={300}
                        unit="↕"
                        label="Vertical Position"
                      />
                      <Slider
                        value={overlay.offsetX}
                        onChange={(value) => updateOverlayProperty(index, 'offsetX', value)}
                        min={-300}
                        max={300}
                        unit="↔"
                        label="Horizontal Position"
                      />
                    </div>
                    <div className="overlay-sliders">
                      <Slider
                        value={overlay.size}
                        onChange={(value) => updateOverlayProperty(index, 'size', value)}
                        min={10}
                        max={800}
                        unit="%"
                        label="Size"
                      />
                      <Slider
                        value={overlay.rotation}
                        onChange={(value) => updateOverlayProperty(index, 'rotation', value)}
                        min={0}
                        max={360}
                        unit="°"
                        label="Rotation"
                      />
                    </div>
                    <div className='overlay-color'>
                      <div className="Colour-container">
                        <label
                          htmlFor={`overlayColorPicker-${index}`}
                          className="colour-label"
                          style={{color: getOppositeColour(overlay.color)}}
                        >
                          Overlay Colour
                        </label>
                        <input
                          type="color"
                          id={`overlayColorPicker-${index}`}
                          value={overlay.color}
                          onChange={(e) => updateOverlayProperty(index, 'color', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
                  <p className='image-disclaimer'>Images cannot be shared via link.</p>
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
                          <option key={pattern} value={pattern} className="optionWithSpacing">
                            {patternIcons[pattern]} {' '} {pattern}
                          </option>
                        ))}
                      </select>
                    </div>
                    {(selectedPattern === 'Horizontal' || selectedPattern === 'Vertical') ? (
                      <Slider
                        value={stripeCount}
                        onChange={handleStripeCountChange}
                        min={2}
                        max={16}
                        unit="stripes"
                        label="Number of Stripes"
                      />
                    ) : (
                      selectedPattern !== 'Single' && selectedPattern !== 'Quadrants' && selectedPattern !== 'Saltire' && selectedPattern !== 'Cross' && (
                        <div className="Shape-container">
                          <label htmlFor="amountSelector" className="shape-label">Amount</label>
                          <select 
                            id="amountSelector" 
                            value={selectedAmount} 
                            onChange={handleAmountChange} 
                            className="shape-dropdown"
                          >
                            {amountOptions[selectedPattern] && amountOptions[selectedPattern].map((amount) => (
                              <option key={amount} value={amount} className="optionWithSpacing">
                                {amountIcons[amount]} {' '} {amount}
                              </option>
                            ))}
                          </select>
                        </div>
                      )
                    )}
                    <p className="colours-header">Colours</p>
                    {selectedPattern === 'Single' ? (
                      <div className="single-colour-container">
                        <div className="Colour-container">
                          <label
                            htmlFor="backColourPicker-0"
                            className="colour-label"
                            style={{color: labelColors['back-0']}}
                          >
                            Background Colour
                          </label>
                          <input
                            type="color"
                            id="backColourPicker-0"
                            value={backColours[0]}
                            onChange={(e) => handleBackColourChange(e.target.value, 0)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="colour-grid">
                        {(selectedPattern === 'Horizontal' || selectedPattern === 'Vertical') ? (
                          Array.from({ length: stripeCount }, (_, index) => (
                            <div className="Colour-container" key={index}>
                              <label
                                htmlFor={`backColourPicker-${index}`}
                                className="colour-label"
                                style={{color: labelColors[`back-${index}`]}}
                              >
                                Stripe Colour {index + 1}
                              </label>
                              <input
                                type="color"
                                id={`backColourPicker-${index}`}
                                value={backColours[index] || '#ffffff'}
                                onChange={(e) => handleBackColourChange(e.target.value, index)}
                              />
                            </div>
                          ))
                        ) : (
                          backColours.map((colour, index) => (
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
                          ))
                        )}
                      </div>
                    )}
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
              overlays={overlays}
              stripeCount={stripeCount}
            />
          </div>
        </div>
      </main>
      <footer className="App-footer">
        <div className="App-footer-content">
          <p className="App-footer-text">Created by</p>
          <a href="https://github.com/NathanPortelli/" target="_blank" rel="noopener noreferrer">
            Nathan Portelli
          </a>
        </div>
      </footer>
      {notification && (
        <Notification message={notification} onClose={clearNotification} />
      )}
    </div>
  );
};

export default App;