import React, { useState, useEffect, useMemo } from 'react';
import Slider from './components/Slider';
import StarsDisplay from './StarsDisplay';
import DownloadButton from './DownloadButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { faBorderStyle, faFont, faChessBoard, faMaximize, faRotate, faUpDown, faLeftRight, faPlus, faShuffle, faBorderTopLeft, faPaintRoller } from '@fortawesome/free-solid-svg-icons';
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
  const [containerFormat, setContainerFormat] = useState('circle');
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
  const [fonts, setFonts] = useState([
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Arial Black', value: '"Arial Black", sans-serif' },
    { name: 'Book Antiqua', value: '"Book Antiqua", serif' },
    { name: 'Candara', value: 'Candara, sans-serif' },
    { name: 'Century Gothic', value: '"Century Gothic", sans-serif' },
    { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
    { name: 'Consolas', value: 'Consolas, monospace' },
    { name: 'Copperplate', value: 'Copperplate, fantasy' },
    { name: 'Courier New', value: '"Courier New", monospace' },
    { name: 'Franklin Gothic Medium', value: '"Franklin Gothic Medium", sans-serif' },
    { name: 'Garamond', value: 'Garamond, serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Gill Sans', value: '"Gill Sans", sans-serif' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
    { name: 'Impact', value: 'Impact, sans-serif' },
    { name: 'Lucida Console', value: '"Lucida Console", monospace' },
    { name: 'Lucida Sans', value: '"Lucida Sans", sans-serif' },
    { name: 'Monaco', value: 'Monaco, monospace' },
    { name: 'Palatino Linotype', value: '"Palatino Linotype", serif' },
    { name: 'Segoe UI', value: '"Segoe UI", sans-serif' },
    { name: 'Tahoma', value: 'Tahoma, sans-serif' },
    { name: 'Times New Roman', value: '"Times New Roman", serif' },
    { name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Oswald', value: 'Oswald, sans-serif' },
    { name: 'Raleway', value: 'Raleway, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Bebas Neue', value: '"Bebas Neue", sans-serif' },
    { name: 'Lobster', value: 'Lobster, cursive' }
  ]);
  
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
        width: 200,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      }, ...prevOverlays]);
    }
  };

  const handleCheckerSizeChange = (value) => {
    setCheckerSize(value);
    updateURL();
  };

  const handleSunburstStripeCountChange = (value) => {
    setSunburstStripeCount(value);
    updateURL();
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
  };
  
  const handleDragEnter = (e, index) => {
    setDragOverItem(index);
  };
  
  const handleDragEnd = () => {
    const newOverlays = [...overlays];
    const draggedItemContent = newOverlays[draggedItem];
    newOverlays.splice(draggedItem, 1);
    newOverlays.splice(dragOverItem, 0, draggedItemContent);
    setOverlays(newOverlays);
    setDraggedItem(null);
    setDragOverItem(null);
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

  const removeOverlay = (index) => {
    setOverlays(prevOverlays => prevOverlays.filter((_, i) => i !== index));
  };

  const updateOverlayProperty = (index, property, value) => {
    setOverlays(prevOverlays => {
      const newOverlays = [...prevOverlays];
      if (property === 'font') {
        const selectedFont = fonts.find(font => font.value === value);
        newOverlays[index][property] = selectedFont ? selectedFont.value : value;
      } else {
        newOverlays[index][property] = value;
      }
      return newOverlays;
    });
  };

  const handleStripeWidthChange = (value) => {
    setStripeWidth(value);
    updateURL();
  };

  const randomizeAll = () => {
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
  
    const newBackColours = Array(16).fill().map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);
    setBackColours(newBackColours);
    setUserSetColours(newBackColours);
  
    if (randomPattern === 'Horizontal' || randomPattern === 'Vertical') {
      setStripeCount(random(2, 16));
    }
  
    // Randomize overlays
    const newOverlays = Array(random(0, MAX_OVERLAYS)).fill().map(() => ({
      shape: overlaySymbols[Math.floor(Math.random() * overlaySymbols.length)].value,
      size: random(10, 800),
      offsetX: random(-300, 300),
      offsetY: random(-300, 300),
      rotation: random(0, 360),
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }));
    setOverlays(newOverlays);
  
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

  const formatClass = isSmallScreen ? 'old-format' : 'new-format';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const getParamOrDefault = (paramName, defaultValue, parser = (v) => v) => {
      const paramValue = params.get(paramName);
      return paramValue !== null ? parser(paramValue) : defaultValue;
    };

    setCrossSaltireSize(getParamOrDefault('crossSaltireSize', 11, parseFloat));
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
    setGridRotation(getParamOrDefault('gridRotation', 0, parseInt));
    setStarsOnTop(getParamOrDefault('starsOnTop', true, (v) => v === 'false'));
    setCheckerSize(getParamOrDefault('checkerSize', 4, parseInt));
    setSunburstStripeCount(getParamOrDefault('sunburstStripeCount', 8, parseInt));
    setBorderWidth(getParamOrDefault('borderWidth', 10, parseInt));

    // Handle background colours
    const urlBackColors = params.get('backColours');
    if (urlBackColors) {
      const colors = urlBackColors.split(',');
      setBackColours(colors);
      setUserSetColours(colors);
      setStripeCount(colors.length);
    } else {
      setBackColours(defaultBackColours);
      setUserSetColours(defaultBackColours);
    }

    setSelectedPattern(getParamOrDefault('pattern', 'Single'));
    if (params.get('pattern') === 'Horizontal' || params.get('pattern') === 'Vertical') {
      setStripeCount(getParamOrDefault('stripeCount', 2, parseInt));
    } else if (params.get('pattern') === 'Bends' && 
      (params.get('amount') === 'Forward Stripe' || params.get('amount') === 'Backward Stripe')) {
      setStripeWidth(getParamOrDefault('stripeWidth', 10, parseInt));
    } else {
      setSelectedAmount(getParamOrDefault('amount', ''));
    }
    
    const overlayData = params.get('overlays');
    if (overlayData) {
      const parsedOverlays = overlayData.split(';').map(overlayString => {
        const [type, ...rest] = overlayString.split(',');
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
    params.set('crossSaltireSize', crossSaltireSize);
    params.set('gridRotation', gridRotation);
    params.set('starsOnTop', starsOnTop);
    params.set('checkerSize', checkerSize);
    params.set('sunburstStripeCount', sunburstStripeCount);
    params.set('borderWidth', borderWidth);
    
    params.set('pattern', selectedPattern);
    if (selectedPattern === 'Horizontal' || selectedPattern === 'Vertical') {
      params.set('stripeCount', stripeCount);
    } else if (selectedPattern === 'Border') {
      params.set('borderWidth', borderWidth);    
    } else if (selectedPattern === 'Bends' && 
      (selectedAmount === 'Forward Stripe' || selectedAmount === 'Backward Stripe')) {
      params.set('stripeWidth', stripeWidth);    
    } else {
      params.set('amount', selectedAmount);
    }

    if (overlays.length > 0) {
      const overlayData = overlays.map(overlay => {
        if (overlay.type === 'text') {
          return `text,${encodeURIComponent(overlay.text)},${encodeURIComponent(overlay.font)},${overlay.size},${overlay.width},${overlay.offsetX},${overlay.offsetY},${overlay.rotation},${encodeURIComponent(overlay.color)}`;
        } else {
          return `shape,${overlay.shape},${overlay.size},${overlay.offsetX},${overlay.offsetY},${overlay.rotation},${encodeURIComponent(overlay.color)}`;
        }
      }).join(';');
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
  const setGridRotationAndURL = setStateAndUpdateURL(setGridRotation);
  const setStarsOnTopAndURL = setStateAndUpdateURL(setStarsOnTop);

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
      <Header handleShare={handleShare} handleRefresh={handleRefresh} />
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
                crossSaltireSize={crossSaltireSize}
                gridRotation={gridRotation}
                starsOnTop={starsOnTop}
                checkerSize={checkerSize}
                sunburstStripeCount={sunburstStripeCount}
                borderWidth={borderWidth}
                stripeWidth={stripeWidth}
              />
            </div>
            <div className="Shape-selector">
              <div className="custom-toggle-container">
                <CustomToggle 
                  option1="Circle"
                  option2="Flag"
                  isActive={containerFormat === 'flag'}
                  onChange={() => setContainerFormat(containerFormat === 'circle' ? 'flag' : 'circle')}
                />
              </div>
              <div className="Shape-container" id="country-selector">
                <label htmlFor="countrySelector" className="shape-label">Samples</label>
                <CountryFilterableSelect
                  options={CountryList}
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  placeholder="Select a Country"
                />
              </div>
              <button onClick={randomizeAll} className="random-button">
                <FontAwesomeIcon icon={faShuffle} className="random-icon" />
                Randomise All
              </button>
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
                  </>
                )}
                {shapeConfiguration === 'square' && (
                  <Slider
                    value={gridRotation}
                    onChange={setGridRotationAndURL}
                    min={0}
                    max={360}
                    unit="°"
                    label="Grid Rotation"
                    icon={faRotate}
                  />
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
                    <Tooltip text="Shape orientation; 'Up' aligns shapes vertically, 'Outward' orients shapes radially from the center.">                      <CustomToggle 
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
                  max={300}
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
                {overlays.length < MAX_OVERLAYS && (
                  <div>
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
                    </div>
                    {overlays.length >= 2 && (
                      <p className='image-disclaimer'>Drag/Move overlays up or down to change their stacking order.</p>
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
                        className="overlay-topcontent"
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
                                  <button className="clone-overlay" onClick={() => cloneOverlay(index)}>
                                    <i className="fas fa-clone"></i>
                                  </button>
                                )}
                                <button className="remove-image" onClick={() => removeOverlay(index)}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
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
                      </div>
                    </div>
                    <div className="overlay-sliders">
                      <Slider
                        value={overlay.offsetY}
                        onChange={(value) => updateOverlayProperty(index, 'offsetY', value)}
                        min={-350}
                        max={350}
                        // unit="↕"
                        label="Vertical Position"
                        icon={faUpDown}
                      />
                      <Slider
                        value={overlay.offsetX}
                        onChange={(value) => updateOverlayProperty(index, 'offsetX', value)}
                        min={-350}
                        max={350}
                        // unit="↔"
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
                        // unit="%"
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
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {activeSection === 'Background' && (
              <div className="toolbar-segment">
                <div className='background-image'>
                  <Tooltip text="2:3 Aspect Ratio optimal for downloading">
                    <ImageUpload
                      onImageUpload={handleBackgroundImageUpload}
                      onImageRemove={() => setBackgroundImage(null)}
                      hasImage={!!backgroundImage}
                      label="Upload Background Image"
                    />
                  </Tooltip>
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
                    {(selectedPattern === 'Cross' || selectedPattern === 'Saltire') && (
                      <Slider
                        value={crossSaltireSize}
                        onChange={(value) => setCrossSaltireSize(value)}
                        min={1}
                        max={60}
                        // unit="%"
                        label={`${selectedPattern} Size`}
                        icon={faMaximize}
                      />
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
                      !['Single', 'Border', 'Checkered', 'Sunburst', 'Quadrants', 'Saltire', 'Cross'].includes(selectedPattern) && (
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