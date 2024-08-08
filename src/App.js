import React, { useState, useEffect, useMemo } from 'react';
import Slider from './components/Slider';
import StarsDisplay from './StarsDisplay';
import DownloadButton from './DownloadButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { faLayerGroup, faImage, faArrowRight, faClipboardList, faBorderStyle, faBan, faArrowsAltH, faFont, faChessBoard, faMaximize, faRotate, faUpDown, faLeftRight, faPlus, faShuffle, faBorderTopLeft, faPaintRoller, faManatSign } from '@fortawesome/free-solid-svg-icons';
import './styles/App.css';
import { random } from 'lodash';

import { shapePaths, shapeOptions, patternOptions, amountOptions, patternIcons, amountIcons } from './components/ItemLists';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import Divider from './components/Divider';
import { CustomShapeDropdown } from './components/CustomShapeDropdown';
import { overlaySymbols } from './components/OverlaySymbols';
import Notification from './components/Notification';
import { CustomToggle } from './components/CustomToggle';
import { CountryList } from './components/CountryURLList';
import FilterableSelect from './components/FilterableSelect';
import CountryFilterableSelect from './components/CountryFilterableSelect';
import ColourPicker from './components/ColourPicker';
import Tooltip from './components/Tooltip';
import { fonts } from './components/OverlayFonts';

import ChangelogPopup from './components/ChangelogPopup';
import Popup from './components/Popup';
import QuizMode from './components//QuizMode';
import SaveMenu from './components/SaveMenu';

const App = () => {
  const [notification, setNotification] = useState(null);
  const defaultBackColours = ['#003399', '#ffffff', '#000000', '#008000', '#ff5733', '#33ff57', '#5733ff', '#f0f033', '#33f0f0', '#f033f0', '#ff7100', '#33aaff', '#aa33ff', '#033308', '#33ffaa', '#ffaa33'];
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
  const [containerFormat, setContainerFormat] = useState('flag');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [crossSaltireSize, setCrossSaltireSize] = useState(11);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [gridRotation, setGridRotation] = useState(0);
  const [starsOnTop, setStarsOnTop] = useState(false);
  const [checkerSize, setCheckerSize] = useState(4);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [borderWidth, setBorderWidth] = useState(10);
  const [sunburstStripeCount, setSunburstStripeCount] = useState(8);
  const [stripeWidth, setStripeWidth] = useState(10);
  const [circleSpacing, setCircleSpacing] = useState(100);
  const [gridSpacing, setGridSpacing] = useState(100);
  const [seychellesStripeCount, setSeychellesStripeCount] = useState(3);
  const [customSvgPath, setCustomSvgPath] = useState("M 10,20 L 90,20 L 90,60 L 10,60 Z M 10,20 L 50,40 L 90,20");
  const [crossHorizontalOffset, setCrossHorizontalOffset] = useState(0);
  const [crossVerticalOffset, setCrossVerticalOffset] = useState(0);

  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isSaveMenuOpen, setIsSaveMenuOpen] = useState(false);
  const [urlHistory, setUrlHistory] = useState([window.location.href]);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);

  const toggleSaveMenu = () => {
    setIsSaveMenuOpen(!isSaveMenuOpen);
  };

  const toggleChangelog = () => {
    setIsChangelogOpen(!isChangelogOpen);
  };

  useEffect(() => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content > div');
  
    tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.style.display = 'none');
        button.classList.add('active');
      });
    });
  }, [isChangelogOpen]);

  const handleCustomSvgPathChange = (e) => {
    setCustomSvgPath(e.target.value);
  };
  
  const isValidSvgPath = (path) => {
    const svgPathRegex = /^[MmLlHhVvCcSsQqTtAaZz0-9\s,.-]+$/;
    return svgPathRegex.test(path);
  };
  
  const handleCustomSvgSubmit = () => {
    if (customSvgPath && isValidSvgPath(customSvgPath)) {
      updateCustomShapePath(customSvgPath);
      setSelectedShapeAndURL('Custom');
      updateURL();
      
      // Clear the input field
      const svgPathElement = document.getElementById('custom-svg-path');
      if (svgPathElement) {
        svgPathElement.textContent = '';
      }

      setNotification('Custom SVG path added successfully.');
    } else {
      setNotification('Invalid SVG path. Please check your input.');
    }
  };
  
  const updateCustomShapePath = (path) => {
    shapePaths.Custom = path;
  };

  const cloneOverlay = (index) => {
    if (overlays.length < MAX_OVERLAYS) {
      const clonedOverlay = JSON.parse(JSON.stringify(overlays[index]));
      setOverlays(prevOverlays => [clonedOverlay, ...prevOverlays]);
      updateURL();
    }
  };

  const addTextOverlay = () => {
    if (overlays.length < MAX_OVERLAYS) {
      setOverlays(prevOverlays => [{
        type: 'text',
        text: 'New Text',
        font: 'Arial, sans-serif',
        size: 48,
        width: 500,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        textCurve: 0
      }, ...prevOverlays]);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(overlays[index]);
  };
  
  const handleDragEnd = (e) => {
    if (draggedItem) {
      const newOverlays = overlays.filter((overlay) => overlay !== draggedItem);
      newOverlays.splice(dragOverItem, 0, draggedItem);
      setOverlays(newOverlays);
      setDraggedItem(null);
      setDragOverItem(null);
    }
  };
  
  const handleDragEnter = (e, index) => {
    setDragOverItem(index);
  };

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
    updateURL();
  };
  
  const addOverlay = () => {
    if (overlays.length < MAX_OVERLAYS) {
      const randomShape = overlaySymbols[Math.floor(Math.random() * overlaySymbols.length)].value;
      const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      setOverlays(prevOverlays => [{ 
        shape: randomShape, 
        size: 200,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        color: randomColor
      }, ...prevOverlays]);
    }
  };

  const addImageOverlay = () => {
    if (overlays.length < MAX_OVERLAYS) {
      setOverlays(prevOverlays => [{
        type: 'image',
        imageData: null,
        size: 200,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
      }, ...prevOverlays]);
    }
  };

  const removeOverlay = (index) => {
    setOverlays(prevOverlays => prevOverlays.filter((_, i) => i !== index));
  };

  const updateOverlayProperty = (index, property, value) => {
    setOverlays(prevOverlays => {
      const newOverlays = [...prevOverlays];
      newOverlays[index] = {
        ...newOverlays[index],
        [property]: value,
      };
      return newOverlays;
    });
  };  
  
  const handleCheckerSizeChange = (value) => {
    setCheckerSize(value);
    updateURL();
  };

  const handleSunburstStripeCountChange = (value) => {
    setSunburstStripeCount(value);
    updateURL();
  };

  
  const handleStripeWidthChange = (value) => {
    setStripeWidth(value);
    updateURL();
  };

  const randomizeAll = (includeOverlays = true) => {
    const randomPattern = patternOptions[Math.floor(Math.random() * patternOptions.length)];
    const randomShape = shapeOptions[Math.floor(Math.random() * shapeOptions.length)];
    const randomAmount = amountOptions[randomPattern] ? amountOptions[randomPattern][Math.floor(Math.random() * amountOptions[randomPattern].length)] : '';
  
    setStarCountAndURL(random(1, 50));
    setCircleCountAndURL(random(1, 3));
    setStarSizeAndURL(random(10, 150));
    setStarColourAndURL(`#${Math.floor(Math.random()*16777215).toString(16)}`);
    setRotationAngleAndURL(random(0, 360));
    setSelectedShapeAndURL(randomShape);
    setSelectedPatternAndURL(randomPattern);
    setSelectedAmountAndURL(randomAmount);
    setPointAwayAndURL(Math.random() < 0.5);
    setOutlineOnlyAndURL(Math.random() < 0.5);
    setOutlineWeightAndURL(random(1, 15));
    setStarRotationAndURL(random(0, 360));
    setShapeConfigurationAndURL(Math.random() < 0.5 ? 'circle' : 'square');
    setCrossSaltireSize(random(1, 60));
    setGridRotationAndURL(random(0, 360));
    setCheckerSize(random(1, 16));
    setStarsOnTopAndURL(Math.random() < 0.5);
    setSunburstStripeCount(random(2, 16));
    setBorderWidth(random(1, 30));
    setCircleSpacingAndURL(random(80, 200));
    setGridSpacingAndURL(random(20, 200));
    setCrossHorizontalOffsetAndURL(random(-50, 50));
    setCrossVerticalOffsetAndURL(random(-50, 50));  
  
    const newBackColours = Array(16).fill().map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);
    setBackColours(newBackColours);
    setUserSetColours(newBackColours);
  
    if (randomPattern === 'Horizontal' || randomPattern === 'Vertical') {
      setStripeCount(random(2, 16));
    } else if (randomPattern === 'Seychelles') {
      setSeychellesStripeCount(Math.floor(Math.random() * 14) + 3);
    }
  
    // Randomize overlays
    if (includeOverlays) {
      const newOverlays = Array(random(0, MAX_OVERLAYS)).fill().map(() => ({
        shape: overlaySymbols[Math.floor(Math.random() * overlaySymbols.length)].value,
        size: random(10, 800),
        offsetX: random(-300, 300),
        offsetY: random(-300, 300),
        rotation: random(0, 360),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      }));
      setOverlays(newOverlays);
    } else {
      setOverlays([]);
    }
  
    updateURL();
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
          case 'Both Ways':
            return backColours.slice(0, 4);
          case 'Forward Stripe':
          case 'Backward Stripe':
            return backColours.slice(0, 3);
          default:
            return backColours.slice(0, 2);
        }
      case 'Border':
      case 'Cross':
      case 'Saltire':
      case 'Checkered':
      case 'Sunburst':
        return backColours.slice(0, 2);
      case 'Seychelles':
        return backColours.slice(0, seychellesStripeCount);
      case 'Quadrants':
        return backColours.slice(0, 4);
      default:
        return [backColours[0]];
    }
  };

  // Calculate opposite colour
  const getOppositeColour = (hex) => {
    if (!hex) return '#000000';

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

  const formatClass = isSmallScreen ? 'old-format' : 'new-format';

  useEffect(() => {
    parseUrlParams();
  }, []);

  const parseUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    
    setStarCount(parseInt(params.get('starCount') || '12'));
    setCircleCount(parseInt(params.get('circleCount') || '1'));
    setStarSize(parseInt(params.get('starSize') || '55'));
    setStarColour(params.get('starColour') || '#FFDD00');
    setRotationAngle(parseInt(params.get('rotationAngle') || '0'));
    setSelectedShape(params.get('shape') || 'Star');
    setSelectedPattern(params.get('pattern') || 'Single');
    setSelectedAmount(params.get('amount') || '');
    setPointAway(params.get('pointAway') === 'true');
    setOutlineOnly(params.get('outlineOnly') === 'true');
    setOutlineWeight(parseInt(params.get('outlineWeight') || '2'));
    setStarRotation(parseInt(params.get('starRotation') || '0'));
    setShapeConfiguration(params.get('shapeConfiguration') || 'circle');
    setCrossSaltireSize(parseFloat(params.get('crossSaltireSize') || '11'));
    setGridRotation(parseInt(params.get('gridRotation') || '0'));
    setStarsOnTop(params.get('starsOnTop') === 'true');
    setCheckerSize(parseInt(params.get('checkerSize') || '4'));
    setSunburstStripeCount(parseInt(params.get('sunburstStripeCount') || '8'));
    setBorderWidth(parseInt(params.get('borderWidth') || '10'));
    setStripeCount(parseInt(params.get('stripeCount') || '2'));
    setSeychellesStripeCount(parseInt(params.get('seychellesStripeCount') || '3'));
    setCircleSpacing(parseInt(params.get('circleSpacing') || '100'));
    setGridSpacing(parseInt(params.get('gridSpacing') || '100'));
    setCrossHorizontalOffset(parseFloat(params.get('crossHorizontalOffset') || '0'));
    setCrossVerticalOffset(parseFloat(params.get('crossVerticalOffset') || '0'));

    const urlCustomSvgPath = params.get('customSvgPath');
    if (urlCustomSvgPath) {
      const decodedPath = decodeURIComponent(urlCustomSvgPath);
      setCustomSvgPath(decodedPath);
      updateCustomShapePath(decodedPath);
      setSelectedShape('Custom');
    }
  
    const urlBackColors = params.get('backColours');
    if (urlBackColors) {
      const colors = urlBackColors.split(',');
      setBackColours(colors);
      setUserSetColours(colors);
    }
  
    // Handle overlays
    const overlayData = params.get('overlays');
    if (overlayData) {
      const parsedOverlays = overlayData.split(';;').map(overlayString => {
        const [type, ...rest] = overlayString.split('|');
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
            textCurve: parseFloat(textCurve)
          };
        } else if (type === 'image') {
          const [size, offsetX, offsetY, rotation] = rest;
          return {
            type: 'image',
            imageData: null,
            size: parseFloat(size),
            offsetX: parseFloat(offsetX),
            offsetY: parseFloat(offsetY),
            rotation: parseFloat(rotation)
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
      setOverlays(parsedOverlays.map(overlay => ({
        ...overlay,
        textCurve: overlay.textCurve !== undefined ? overlay.textCurve : 0
      })));     
    }
  };

  const handleUrlChange = (newUrl) => {
    const url = new URL(newUrl);
    const params = new URLSearchParams(url.search);
    
    // Update state based on URL parameters
    setStarCount(parseInt(params.get('starCount') || '12'));
    setCircleCount(parseInt(params.get('circleCount') || '1'));
    setStarSize(parseInt(params.get('starSize') || '55'));
    setStarColour(params.get('starColour') || '#FFDD00');
    setRotationAngle(parseInt(params.get('rotationAngle') || '0'));
    setSelectedShape(params.get('shape') || 'Star');
    setSelectedPattern(params.get('pattern') || 'Single');
    setSelectedAmount(params.get('amount') || '');
    setPointAway(params.get('pointAway') === 'true');
    setOutlineOnly(params.get('outlineOnly') === 'true');
    setOutlineWeight(parseInt(params.get('outlineWeight') || '2'));
    setStarRotation(parseInt(params.get('starRotation') || '0'));
    setShapeConfiguration(params.get('shapeConfiguration') || 'circle');
    setCrossSaltireSize(parseFloat(params.get('crossSaltireSize') || '11'));
    setGridRotation(parseInt(params.get('gridRotation') || '0'));
    setStarsOnTop(params.get('starsOnTop') === 'true');
    setCheckerSize(parseInt(params.get('checkerSize') || '4'));
    setSunburstStripeCount(parseInt(params.get('sunburstStripeCount') || '8'));
    setBorderWidth(parseInt(params.get('borderWidth') || '10'));
    setStripeCount(parseInt(params.get('stripeCount') || '2'));
    setSeychellesStripeCount(parseInt(params.get('seychellesStripeCount') || '3'));
    setGridSpacing(parseInt(params.get('gridSpacing') || '100'));
    setCircleSpacing(parseInt(params.get('circleSpacing') || '100'));
    setCrossSaltireSize(parseInt(params.get('crossSaltireSize') || '11'));
  
    // Handle background colours
    const urlBackColors = params.get('backColours');
    if (urlBackColors) {
      const colors = urlBackColors.split(',');
      setBackColours(colors);
      setUserSetColours(colors);
    }
  
    // Handle overlays
    const overlayData = params.get('overlays');
    if (overlayData) {
      const parsedOverlays = overlayData.split(';;').map(overlayString => {
        const [type, ...rest] = overlayString.split('|');
        if (type === 'text') {
          const [text, font, size, width, offsetX, offsetY, rotation, color] = rest;
          return {
            type: 'text',
            text: decodeURIComponent(text),
            font: decodeURIComponent(font),
            size: parseFloat(size),
            width: parseFloat(width),
            offsetX: parseFloat(offsetX),
            offsetY: parseFloat(offsetY),
            rotation: parseFloat(rotation),
            color: decodeURIComponent(color)
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
      setOverlays(parsedOverlays.map(overlay => ({
        ...overlay,
        textCurve: overlay.textCurve !== undefined ? overlay.textCurve : 0 // Default to 0 if not specified
      })));      
    } else {
      setOverlays([]);
    }
  
    // Update the URL without redirecting
    //window.history.replaceState({}, '', `${window.location.pathname}${url.search}`);
    window.history.replaceState({}, '', newUrl);
  };

  const undo = () => {
    if (currentUrlIndex > 0) {
      const newIndex = currentUrlIndex - 1;
      setCurrentUrlIndex(newIndex);
      handleUrlChange(urlHistory[newIndex]);
    }
  };
  
  const redo = () => {
    if (currentUrlIndex < urlHistory.length - 1) {
      const newIndex = currentUrlIndex + 1;
      setCurrentUrlIndex(newIndex);
      handleUrlChange(urlHistory[newIndex]);
    }
  };

  useEffect(() => {
    const checkUrlUpdate = () => {
      const currentUrl = window.location.href;
      if (currentUrl !== urlHistory[currentUrlIndex]) {
        setUrlHistory(prevHistory => {
          const newHistory = prevHistory.slice(0, currentUrlIndex + 1);
          newHistory.push(currentUrl);
          if (newHistory.length > 40) {
            newHistory.shift();
          }
          return newHistory;
        });
        setCurrentUrlIndex(prevIndex => Math.min(prevIndex + 1, 39));
      }
    };
  
    const intervalId = setInterval(checkUrlUpdate, 3000);  // 3 seconds
  
    return () => clearInterval(intervalId);
  }, [urlHistory, currentUrlIndex]);

  const updateURL = () => {
    const params = new URLSearchParams();
    
    // Define default values
    const defaults = {
      starCount: 12,
      circleCount: 1,
      starSize: 55,
      starRadius: window.innerWidth < 1000 ? 80 : 90,
      starColour: '#FFDD00',
      rotationAngle: 0,
      shape: 'Star',
      pattern: 'Single',
      amount: '',
      pointAway: false,
      outlineOnly: false,
      outlineWeight: 2,
      starRotation: 0,
      shapeConfiguration: 'circle',
      crossSaltireSize: 11,
      gridRotation: 0,
      starsOnTop: false,
      checkerSize: 4,
      sunburstStripeCount: 8,
      borderWidth: 10,
      stripeWidth: 10,
      gridSpacing: 100,
      circleSpacing: 100,
      seychellesStripeCount: 3,
    };

    if (selectedShape === 'Custom' && customSvgPath) {
      params.set('customSvgPath', encodeURIComponent(customSvgPath));
    }
  
    const isDifferent = (key, value) => {
      if (key === 'backColours') {
        return JSON.stringify(value) !== JSON.stringify(defaultBackColours);
      }
      return value !== defaults[key];
    };
  
    // Helper function to add param if different from default
    const addParamIfDifferent = (key, value) => {
      if (isDifferent(key, value)) {
        params.set(key, value);
      }
    };
  
    // Add parameters only if they differ from defaults
    addParamIfDifferent('starCount', starCount);
    addParamIfDifferent('circleCount', circleCount);
    addParamIfDifferent('starSize', starSize);
    addParamIfDifferent('starRadius', starRadius);
    addParamIfDifferent('starColour', starColour);
    addParamIfDifferent('rotationAngle', rotationAngle);
    addParamIfDifferent('shape', selectedShape);
    addParamIfDifferent('pattern', selectedPattern);
    addParamIfDifferent('amount', selectedAmount);
    addParamIfDifferent('pointAway', pointAway.toString());
    addParamIfDifferent('outlineOnly', outlineOnly.toString());
    addParamIfDifferent('outlineWeight', outlineWeight);
    addParamIfDifferent('starRotation', starRotation);
    addParamIfDifferent('shapeConfiguration', shapeConfiguration);
    addParamIfDifferent('crossSaltireSize', crossSaltireSize);
    addParamIfDifferent('gridRotation', gridRotation);
    addParamIfDifferent('starsOnTop', starsOnTop);
    addParamIfDifferent('checkerSize', checkerSize);
    addParamIfDifferent('sunburstStripeCount', sunburstStripeCount);
    addParamIfDifferent('borderWidth', borderWidth);
    addParamIfDifferent('circleSpacing', circleSpacing);
    addParamIfDifferent('gridSpacing', gridSpacing);
    addParamIfDifferent('crossHorizontalOffset', crossHorizontalOffset);
    addParamIfDifferent('crossVerticalOffset', crossVerticalOffset);
  
    // Handle background colours
    if (isDifferent('backColours', backColours)) {
      params.set('backColours', backColours.join(','));
    }
  
    // Handle pattern-specific parameters
    if (selectedPattern === 'Horizontal' || selectedPattern === 'Vertical') {
      addParamIfDifferent('stripeCount', stripeCount);
    } else if (selectedPattern === 'Bends' && 
      (selectedAmount === 'Forward Stripe' || selectedAmount === 'Backward Stripe')) {
      addParamIfDifferent('stripeWidth', stripeWidth);
    } else if (selectedPattern === 'Seychelles') {
      params.append('seychellesStripeCount', seychellesStripeCount);
    }
  
    // Handle overlays
    if (overlays.length > 0) {
      const overlayData = overlays.map(overlay => {
        if (overlay.type === 'text') {
          return `text|${encodeURIComponent(overlay.text)}|${encodeURIComponent(overlay.font)}|${overlay.size}|${overlay.width}|${overlay.offsetX}|${overlay.offsetY}|${overlay.rotation}|${encodeURIComponent(overlay.color)}|${overlay.textCurve}`;
        } else if (overlay.type === 'image') {
          return `image|${overlay.size}|${overlay.offsetX}|${overlay.offsetY}|${overlay.rotation}`;
        } else {
          return `shape|${overlay.shape}|${overlay.size}|${overlay.offsetX}|${overlay.offsetY}|${overlay.rotation}|${encodeURIComponent(overlay.color)}`;
        }
      }).join(';;');
      params.set('overlays', overlayData);
    }
  
    // Update the URL
    const newUrl = params.toString() ? `${window.location.pathname}?${params}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
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
  }, [starCount, circleCount, starSize, starRadius, starColour, rotationAngle, selectedShape, selectedPattern, selectedAmount, pointAway, outlineOnly, outlineWeight, starRotation, shapeConfiguration, backColours, overlays, debouncedUpdateURL]);

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
  const setGridRotationAndURL = setStateAndUpdateURL(setGridRotation);
  const setStarsOnTopAndURL = setStateAndUpdateURL(setStarsOnTop);
  const setCircleSpacingAndURL = setStateAndUpdateURL(setCircleSpacing);
  const setGridSpacingAndURL = setStateAndUpdateURL(setGridSpacing);
  const setCrossHorizontalOffsetAndURL = setStateAndUpdateURL(setCrossHorizontalOffset);
  const setCrossVerticalOffsetAndURL = setStateAndUpdateURL(setCrossVerticalOffset);

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
    const newColors = [...backColours];
    while (newColors.length < value) {
      newColors.push(defaultBackColours[newColors.length % defaultBackColours.length]);
    }
    setBackColours(newColors.slice(0, value));
    setUserSetColours(newColors);
    updateURL();
  };

  const handleSeychellesStripeCountChange = (value) => {
    setSeychellesStripeCount(value);
    const newColors = [...backColours];
    while (newColors.length < value) {
      newColors.push(defaultBackColours[newColors.length % defaultBackColours.length]);
    }
    setBackColours(newColors.slice(0, value));
    setUserSetColours(newColors);
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
    } else if (pattern === 'Checkered') {
      setCheckerSize(4);
      setBackColours(userSetColours.slice(0, 2));
    } else if (pattern === 'Border') {
      setBackColours(userSetColours.slice(0, 2));
      setBorderWidth(10);
    } else if (pattern === 'Seychelles') {
      setBackColours(userSetColours.slice(0, 3));
      setSeychellesStripeCount(3);
    } else if (pattern === 'Sunburst') {
      setSunburstStripeCount(8);
      setBackColours(userSetColours.slice(0, 2));
    } else {
      if (['Quadrants', 'Saltire', 'Cross', 'Single'].includes(pattern)) {
        setSelectedAmountAndURL('');
      } else {
        setSelectedAmountAndURL(amountOptions[pattern][0] || '');
      }

      let coloursCount = 1;

      switch (pattern) {
        case 'Vertical':
        case 'Horizontal':
        case 'Bends':
        case 'Cross':
        case 'Saltire':
          coloursCount = 2;
          break;
        case 'Seychelles':
          coloursCount = 3;
          break;
        case 'Quadrants':
          coloursCount = 4;
          break;
        case 'Single':
        default:
          coloursCount = 1;
          break;
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
    if (amount === 'Forward Stripe' || amount === 'Backward Stripe') {
      coloursCount = 3;
    } else if (amount === 'Both Ways') {
      coloursCount = 4;
    }
    const newColours = userSetColours.slice(0, coloursCount);
    setBackColours(newColours);
    updateURL();
  };

  const handleShare = () => {
    toggleSaveMenu();
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const handleRefresh = () => {
    window.history.replaceState({}, '', window.location.pathname);
    window.location.reload();
  };

  const updateOverlayPosition = (index, offsetX, offsetY) => {
    setOverlays(prevOverlays => {
      const newOverlays = [...prevOverlays];
      newOverlays[index].offsetX = offsetX;
      newOverlays[index].offsetY = offsetY;
      return newOverlays;
    });
  };

  return (
    <div className={`App ${formatClass}`}>
      <Header 
        handleShare={handleShare} 
        handleRefresh={handleRefresh} 
        toggleQuizMode={() => setIsQuizMode(!isQuizMode)}
        isQuizMode={isQuizMode}
        undo={undo}
        redo={redo}
        canUndo={currentUrlIndex > 0}
        canRedo={currentUrlIndex < urlHistory.length - 1}
      />
      <main className="App-main">
        {isSaveMenuOpen && (
          <Popup onClose={toggleSaveMenu}>
            <SaveMenu currentUrl={window.location.href} onClose={toggleSaveMenu} />
          </Popup>
        )}
        {isQuizMode ? (
          <QuizMode onExit={() => setIsQuizMode(false)} />
        ) : (
          <div className="App-content">
            <div className="Stars-content">
              {!isQuizMode ? (
                <div>
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
                      crossSaltireSize={crossSaltireSize}
                      gridRotation={gridRotation}
                      starsOnTop={starsOnTop}
                      checkerSize={checkerSize}
                      sunburstStripeCount={sunburstStripeCount}
                      borderWidth={borderWidth}
                      stripeWidth={stripeWidth}
                      circleSpacing={circleSpacing}
                      gridSpacing={gridSpacing}
                      updateOverlayPosition={updateOverlayPosition}
                      customSvgPath={customSvgPath}
                      seychellesStripeCount={seychellesStripeCount}
                      crossHorizontalOffset={crossHorizontalOffset}
                      crossVerticalOffset={crossVerticalOffset}
                    />
                  </div>
                  <div className="Shape-selector Under-Stars-Display">
                    <div className="Shape-selector">
                          <Tooltip text="Select the flag format or aspect ratio.">
                            <div className="Shape-container">
                              <label htmlFor="patternSelector" className="shape-label">Format</label>
                              <select 
                                id="formatDropdown" 
                                className="shape-dropdown"
                                value={containerFormat}
                                onChange={(e) => setContainerFormat(e.target.value)}
                              >
                                <option value="circle">Circle</option>
                                <option value="flag">Flag 2:3</option>
                                <option value="flag-1-2">Flag 1:2</option>
                                <option value="square-flag">Square</option>
                                <option value="guidon">Guidon</option>
                                <option value="ohio">Ohio</option>
                                <option value="shield">Shield</option>
                                <option value="pennant">Pennant</option>
                              </select>
                            </div>
                          </Tooltip>
                        </div>

                    <div className="Shape-container" id="country-selector">
                      <label htmlFor="countrySelector" className="shape-label">Samples</label>
                      <CountryFilterableSelect
                        options={CountryList}
                        value={selectedCountry}
                        onChange={setSelectedCountry}
                        placeholder="Select a Country"
                        onUrlChange={handleUrlChange}
                      />
                    </div>
                    <div className="randomize-buttons-container">
                      <button onClick={() => randomizeAll(true)} className="random-button random-button-large">
                        <FontAwesomeIcon icon={faShuffle} className="random-icon" />
                        Randomise All
                      </button>
                      <Tooltip text="Randomise all settings except for the overlays.">
                        <button onClick={() => randomizeAll(false)} className="random-button random-button-small">
                          <FontAwesomeIcon icon={faBan} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ) : ( <> </> )}
            </div>
            <div className="Slider-content">
              {!isQuizMode ? (
                <div className='Slider-secondary-content'>
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
                        <Tooltip text="'EU' arranges the shapes in a circle, while 'USA' displays them in a rectangular grid.">
                          <div className="Shape-container">
                            <label htmlFor="configurationSelector" className="shape-label">Configuration</label>
                            <select 
                              id="configurationSelector" 
                              value={shapeConfiguration} 
                              onChange={handleShapeConfigurationChange}
                              className="shape-dropdown"
                            >
                              <option value="circle">EU Format</option>
                              <option value="square">USA Format</option>
                            </select>
                        
                          </div>
                        </Tooltip>
                      </div>
                      <Slider
                        value={starCount}
                        onChange={setStarCountAndURL}
                        min={0}
                        max={50}
                        unit={starCount === 1 ? "shape" : "shapes"}
                        label="Shape Count"
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
                            icon={faRotate}
                          />
                          <Slider
                            value={circleSpacing}
                            onChange={setCircleSpacingAndURL}
                            min={80}
                            max={200}
                            unit="%"
                            label="Circle Spacing"
                            icon={faArrowsAltH}
                          />
                        </>
                      )}
                      {shapeConfiguration === 'square' && (
                        <>
                          <Slider
                            value={gridRotation}
                            onChange={setGridRotationAndURL}
                            min={0}
                            max={360}
                            unit="°"
                            label="Grid Rotation"
                            icon={faRotate}
                          />
                          <Slider
                            value={gridSpacing}
                            onChange={setGridSpacingAndURL}
                            min={20}
                            max={200}
                            unit="%"
                            label="Grid Spacing"
                            icon={faArrowsAltH}
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
                            <Tooltip text="Select a shape for the field on your flag.">
                              <CustomShapeDropdown
                                options={shapeOptions}
                                value={selectedShape}
                                onChange={setSelectedShapeAndURL}
                                shapePaths={shapePaths}
                                title={"Shape"}
                              />
                            </Tooltip>
                          </div>
                          <div className="custom-svg-input">
                            <Tooltip text="Enter a custom SVG path for your shape.">
                              <input
                                id="custom-svg-path"
                                type="text"
                                placeholder="Enter Custom SVG Path"
                                value={customSvgPath}
                                onChange={handleCustomSvgPathChange}
                              />
                              <button onClick={handleCustomSvgSubmit}>
                                <FontAwesomeIcon icon={faArrowRight} />
                              </button>
                            </Tooltip>
                          </div>
                          <p className='image-disclaimer'>Use <a href="https://yqnn.github.io/svg-path-editor/" target="_blank" rel="noopener noreferrer">this</a> tool to help you draw SVG shapes.</p>
                          <Divider />
                          <div className="Shape-colour">
                            <ColourPicker
                              id="starColourPicker"
                              label="Shape Colour"
                              value={starColour}
                              onChange={handleStarColourChange}
                              labelColor={labelColors.star}
                            />
                          </div>
                        </>
                      )}
                      {shapeConfiguration === 'circle' && (
                        <div className="custom-toggle-container">
                          <Tooltip text="Shape orientation; 'Up' aligns shapes vertically, 'Outward' orients shapes radially from the center.">                      
                            <CustomToggle 
                              option1="Pointing Up"
                              option2="Pointing Outward"
                              isActive={pointAway}
                              onChange={() => setPointAwayAndURL(!pointAway)}
                            />
                          </Tooltip>
                        </div>
                      )}
                      {!customImage && (
                        <>
                          <div className="custom-toggle-container">
                            <Tooltip text="'Filled' shows solid shapes, while 'Outline' displays just the shape's border.">
                              <CustomToggle 
                                option1="Filled"
                                option2="Outline Only"
                                isActive={outlineOnly}
                                onChange={() => setOutlineOnlyAndURL(!outlineOnly)}
                              />
                            </Tooltip>
                          </div>
                          {outlineOnly && (
                            <div className="outline-weight">
                              <Slider
                                value={outlineWeight}
                                onChange={setOutlineWeightAndURL}
                                min={1}
                                max={15}
                                unit="px"
                                label="Outline Weight"
                                icon={faBorderTopLeft}
                              />
                            </div>
                          )}
                        </>
                      )}
                      <Slider
                        value={starSize}
                        onChange={setStarSizeAndURL}
                        min={10}
                        max={400}
                        unit="px"
                        label="Star Size"
                        icon={faMaximize}
                      />
                      <Slider
                        value={starRotation}
                        onChange={setStarRotationAndURL}
                        min={0}
                        max={360}
                        unit="°"
                        label="Star Rotation"
                        icon={faRotate}
                      />
                    </div>
                  )}
                  {activeSection === 'Overlays' && (
                    <div className="toolbar-segment">
                      <div className="custom-toggle-container">
                        <Tooltip text="Place the shapes over or under the overlays.">
                          <CustomToggle 
                            option1="Shapes Under"
                            option2="Shapes On Top"
                            isActive={starsOnTop}
                            onChange={() => setStarsOnTopAndURL(!starsOnTop)}
                          />
                        </Tooltip>
                      </div>
                      {overlays.length < MAX_OVERLAYS && (
                        <div>
                          <Divider text="" />
                          <div className="add-buttons-container">
                            <Tooltip text="Add a new design element to the flag.">
                              <button className="download-button" onClick={addOverlay}>
                                <FontAwesomeIcon icon={faPlus} className="download-icon" />
                                New Overlay
                              </button>
                            </Tooltip>
                            <Tooltip text="Add the cardinal sin of vexillology to your flag.">
                              <button className="download-button" onClick={addTextOverlay}>
                                <FontAwesomeIcon icon={faFont} className="download-icon" />
                                New Text
                              </button>
                            </Tooltip>
                            <Tooltip text="Add an image overlay to your flag.">
                              <button className="download-button" onClick={addImageOverlay}>
                                <FontAwesomeIcon icon={faImage} className="download-icon" />
                                New Image
                              </button>
                            </Tooltip>
                          </div>
                          {overlays.length >= 2 && (
                            <p className='image-disclaimer'>Drag/Move overlay options up or down to change their stacking order.</p>
                          )}
                        </div>
                      )}
                      {overlays.map((overlay, index) => (
                        <div 
                          className={`overlay-full-container ${dragOverItem === index ? 'drag-over' : ''}`}
                          key={index}
                        >
                          <div className="overlay-handle">
                            <div 
                              className={`overlay-topcontent ${dragOverItem === index ? 'drag-over' : ''}`}
                              key={index}
                              draggable
                              onDragStart={(e) => handleDragStart(e, index)}
                              onDragEnter={(e) => handleDragEnter(e, index)}
                              onDragEnd={handleDragEnd}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              <div className="overlay-first-line">
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
                                    {overlay.type === 'text' ? (
                                      <div className="overlay-font-content">
                                        <div className="Text-container">
                                          <label htmlFor={`overlayText-${index}`} className="shape-label">Text</label>
                                          <input
                                            type="text"
                                            id={`overlayText-${index}`}
                                            value={overlay.text}
                                            onChange={(e) => {
                                              const newText = e.target.value.slice(0, 50);
                                              updateOverlayProperty(index, 'text', newText);
                                            }}
                                            placeholder="Enter text..."
                                            className="shape-input"
                                          />
                                        </div>
                                        <div className="Shape-container">
                                          <label htmlFor={`overlayFont-${index}`} className="shape-label">Font</label>
                                          <select
                                            id={`overlayFont-${index}`}
                                            value={overlay.font}
                                            onChange={(e) => updateOverlayProperty(index, 'font', e.target.value)}
                                            className="shape-dropdown"
                                          >
                                            {fonts.map((font) => (
                                              <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                                                {font.name}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    ) : overlay.type === 'image' ? (
                                      <div className="Image-container">
                                        <ImageUpload
                                          onImageUpload={(imageData) => updateOverlayProperty(index, 'imageData', imageData)}
                                          onImageRemove={() => updateOverlayProperty(index, 'imageData', null)}
                                          hasImage={!!overlay.imageData}
                                        />
                                      </div>
                                    ) : (
                                      <div className="Shape-container">
                                        <label htmlFor={`overlaySelector-${index}`} className="shape-label">Overlay</label>
                                        <FilterableSelect
                                          options={overlaySymbols}
                                          value={overlay.shape} 
                                          onChange={(value) => updateOverlayProperty(index, 'shape', value)}
                                          placeholder="Select or type to filter..."
                                        />
                                      </div>
                                    )}
                                    <div className="overlay-container">
                                      {overlays.length < MAX_OVERLAYS && (
                                        <Tooltip text="Duplicate this overlay.">
                                          <button className="clone-overlay" onClick={() => cloneOverlay(index)}>
                                            <i className="fas fa-clone"></i>
                                          </button>
                                        </Tooltip>
                                      )}
                                      <Tooltip text="Delete this overlay.">
                                        <button className="remove-image" onClick={() => removeOverlay(index)}>
                                          <i className="fas fa-trash"></i>
                                        </button>
                                      </Tooltip>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {overlay.type !== 'image' && (
                                <div className='overlay-color'>
                                  <div className="Colour-container">
                                    <label
                                      htmlFor={`overlayColorPicker-${index}`}
                                      className="colour-label"
                                      style={{color: getOppositeColour(overlay.color)}}
                                    >
                                      <FontAwesomeIcon 
                                        icon={faPaintRoller} 
                                        className="header-icon" 
                                        style={{ marginRight: '8px' }} 
                                      />  
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
                              )}
                            </div>
                          </div>
                          {overlay.type === 'image' && (
                            <p className='overlay-image-disclaimer'>Images cannot be shared via link.</p>
                          )}
                          <div className="overlay-sliders">
                            <Slider
                              value={overlay.offsetY}
                              onChange={(value) => updateOverlayProperty(index, 'offsetY', value)}
                              min={-350}
                              max={350}
                              label="Vertical Position"
                              icon={faUpDown}
                            />
                            <Slider
                              value={overlay.offsetX}
                              onChange={(value) => updateOverlayProperty(index, 'offsetX', value)}
                              min={-350}
                              max={350}
                              label="Horizontal Position"
                              icon={faLeftRight}
                            />
                          </div>
                          <div className="overlay-sliders">
                            <Slider
                              value={overlay.size}
                              onChange={(value) => updateOverlayProperty(index, 'size', value)}
                              min={10}
                              max={999}
                              label="Size"
                              icon={faMaximize}
                            />
                            <Slider
                              value={overlay.rotation}
                              onChange={(value) => updateOverlayProperty(index, 'rotation', value)}
                              min={0}
                              max={360}
                              unit="°"
                              label="Rotation"
                              icon={faRotate}
                            />
                          </div>
                          {overlay.type === 'text' && (
                            <div className="overlay-sliders">
                              <Slider
                                value={overlay.width}
                                onChange={(value) => updateOverlayProperty(index, 'width', value)}
                                min={50}
                                max={800}
                                label="Text Width"
                                icon={faLeftRight}
                              />
                              <Slider
                                value={overlay.textCurve}
                                onChange={(value) => updateOverlayProperty(index, 'textCurve', value)}
                                min={-200}
                                max={200}
                                label="Text Curve"
                                icon={faManatSign}
                              />
                            </div>
                          )}
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
                      </div>
                      {!backgroundImage && (
                        <>
                        <Divider text="or" />
                        <div className="Shape-selector">
                          <Tooltip text="Select the background pattern of your flag design.">
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
                          </Tooltip>
                          {selectedPattern === 'Checkered' && (
                            <Slider
                              value={checkerSize}
                              onChange={handleCheckerSizeChange}
                              min={2}
                              max={32}
                              label="Checker Size"
                              icon={faChessBoard}
                            />
                          )}
                          {selectedPattern === 'Seychelles' && (
                            <Slider
                              value={seychellesStripeCount}
                              onChange={handleSeychellesStripeCountChange}
                              min={3}
                              max={7}
                              label="Seychelles Stripes"
                              unit="stripes"
                              icon={faLayerGroup}
                            />
                          )}
                          {selectedPattern === 'Border' && (
                            <Slider
                              value={borderWidth}
                              onChange={(value) => {
                                setBorderWidth(value);
                                updateURL();
                              }}
                              min={1}
                              max={50}
                              label="Border Width"
                              unit="px"
                              icon={faBorderStyle}
                            />
                          )}
                          {selectedPattern === 'Sunburst' && (
                            <Slider
                              value={sunburstStripeCount}
                              onChange={handleSunburstStripeCountChange}
                              min={4}
                              max={32}
                              label="Sunburst Stripes"
                              unit="stripes"
                            />
                          )}
                          {selectedPattern === 'Cross' && (
                            <>
                              <Slider
                                value={crossHorizontalOffset}
                                onChange={setCrossHorizontalOffsetAndURL}
                                min={-50}
                                max={50}
                                label="Horizontal Offset"
                                icon={faLeftRight}
                              />
                              <Slider
                                value={crossVerticalOffset}
                                onChange={setCrossVerticalOffsetAndURL}
                                min={-50}
                                max={50}
                                label="Vertical Offset"
                                icon={faUpDown}
                              />
                              <Slider
                                value={crossSaltireSize}
                                onChange={(value) => setCrossSaltireSize(value)}
                                min={1}
                                max={60}
                                label={`${selectedPattern} Size`}
                                icon={faMaximize}
                              />
                            </>
                          )}
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
                            !['Single', 'Border', 'Checkered', 'Seychelles', 'Sunburst', 'Quadrants', 'Saltire', 'Cross'].includes(selectedPattern) && (
                              <Tooltip text="Select the particular style of your pattern.">
                                <div className="Shape-container">
                                  <label htmlFor="amountSelector" className="shape-label">Format</label>
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
                              </Tooltip>
                            )
                          )}
                          {selectedPattern === 'Bends' && 
                          (selectedAmount === 'Forward Stripe' || selectedAmount === 'Backward Stripe') && (
                            <Slider
                              value={stripeWidth}
                              onChange={handleStripeWidthChange}
                              min={1}
                              max={300}
                              label="Stripe Width"
                              unit="px"
                              icon={faMaximize}
                            />
                          )}
                          <Divider />
                          <p className="colours-header">Colours</p>
                          {selectedPattern === 'Single' ? (
                            <div className="single-colour-container">
                              <div className="Colour-container">
                                <label
                                  htmlFor="backColourPicker-0"
                                  className="colour-label"
                                  style={{color: labelColors['back-0']}}
                                >
                                <FontAwesomeIcon 
                                  icon={faPaintRoller} 
                                  className="header-icon" 
                                  style={{ marginRight: '8px' }} 
                                />
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
                                  <ColourPicker
                                    key={index}
                                    id={`backColourPicker-${index}`}
                                    label={`Stripe Colour ${index + 1}`}
                                    value={backColours[index] || defaultBackColours[index % defaultBackColours.length]}
                                    onChange={(e) => handleBackColourChange(e, index)}
                                    labelColor={labelColors[`back-${index}`]}
                                  />
                                ))
                              ) : (
                                backColours.map((colour, index) => (
                                  <ColourPicker
                                    key={index}
                                    id={`backColourPicker-${index}`}
                                    label={`Background Colour ${index + 1}`}
                                    value={colour}
                                    onChange={(value) => handleBackColourChange(value, index)}
                                    labelColor={labelColors[`back-${index}`]}
                                  />
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
                    crossSaltireSize={crossSaltireSize}
                    containerFormat={containerFormat}
                    gridRotation={gridRotation}
                    starsOnTop={starsOnTop}
                    checkerSize={checkerSize}
                    sunburstStripeCount={sunburstStripeCount}
                    borderWidth={borderWidth}
                    stripeWidth={stripeWidth}
                    seychellesStripeCount={seychellesStripeCount}
                    crossHorizontalOffset={crossHorizontalOffset}
                    crossVerticalOffset={crossVerticalOffset}
                  />
                </div>
              ) : ( 
                <> </>
              )}
            </div>
          </div>
        )}
      </main>
      <footer className="App-footer">
        <div className="App-footer-content">
          <p className="App-footer-text">Created by</p>
          <a href="https://github.com/NathanPortelli/" target="_blank" rel="noopener noreferrer">
            Nathan Portelli
          </a>
          <button onClick={toggleChangelog} className="changelog-button" aria-label="Open Changelog">
            <FontAwesomeIcon icon={faClipboardList} />
          </button>
        </div>
        {isChangelogOpen && (
          <Popup onClose={toggleChangelog}>
            <ChangelogPopup />
          </Popup>
        )}
      </footer>
      {notification && (
        <Notification message={notification} onClose={clearNotification} />
      )}
    </div>
  );
};

export default App;