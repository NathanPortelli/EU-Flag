import React, { useState, useEffect, useRef, useMemo } from 'react';
import Slider from './Slider';
import StarsDisplay from './StarsDisplay';
import DownloadButton from './DownloadButton';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import { shapePaths, shapeOptions, patternOptions, amountOptions, patternIcons, amountIcons } from './ItemLists';
import ImageUpload from './ImageUpload';
import Divider from './Divider';

const CustomShapeDropdown = ({ options, value, onChange, shapePaths }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="Shape-container" ref={dropdownRef}>
      <label className="shape-label">Shape</label>
      <div
        className="shape-dropdown"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShapeOption shape={value} shapePaths={shapePaths} />
      </div>
      {isOpen && (
        <div className="dropdown-options">
          {options.map((shape) => (
            <div
              key={shape}
              className="dropdown-option"
              onClick={() => {
                onChange(shape);
                setIsOpen(false);
              }}
            >
              <ShapeOption shape={shape} shapePaths={shapePaths} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ShapeOption = ({ shape, shapePaths }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 100 100"
        style={{ marginRight: '10px' }}
      >
        <path d={shapePaths[shape]} fill="#FFDD00" />
      </svg>
      {shape}
    </div>
  );
};

const App = () => {
  const defaultBackColours = ['#003399', '#ffffff', '#000000', '#008000'];
  const [userSetColours, setUserSetColours] = useState([...defaultBackColours]);

  const [starCount, setStarCount] = useState(12);
  const [circleCount, setCircleCount] = useState(1);
  const [starSize, setStarSize] = useState(55);
  const [isNewFormat, setIsNewFormat] = useState(false);
  const [starRadius, setStarRadius] = useState(window.innerWidth < 1000 ? 90 : 80);
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
  }, []);

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
        setStarRadius(90);
      } else {
        setIsNewFormat(false);
        setStarRadius(80);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBackColourChange = (colour, index) => {
    const newColours = [...backColours];
    newColours[index] = colour;
    setBackColours(newColours);
  
    const newUserSetColours = [...userSetColours];
    newUserSetColours[index] = colour;
    setUserSetColours(newUserSetColours);
  
    document.documentElement.style.setProperty(`--back-color-${index}`, colour);
    setLabelColors(prev => ({...prev, [`back-${index}`]: getOppositeColour(colour)}));
  };
  
  const handleStarColourChange = (colour) => {
    setStarColour(colour);
    document.documentElement.style.setProperty('--star-color', colour);
    
    setLabelColors(prev => ({...prev, star: getOppositeColour(colour)}));
  };
  
  // Initialising label colours on component mount
  useEffect(() => {
    const initialLabelColors = {};
    backColours.forEach((color, index) => {
      initialLabelColors[`back-${index}`] = getOppositeColour(color);
    });
    initialLabelColors.star = getOppositeColour(starColour);
    setLabelColors(initialLabelColors);
  }, []);
  
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
  const handlePatternChange = (event) => {
    const pattern = event.target.value;
    setSelectedPattern(pattern);
    setSelectedAmount('');
  
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
  };
  
  const handleAmountChange = (event) => {
    const amount = event.target.value;
    setSelectedAmount(amount);
  
    let coloursCount = 2;
  
    if (amount === 'Thirds') {
      coloursCount = 3;
    } else if (amount === 'Quarters' || amount === 'Both Ways') {
      coloursCount = 4;
    }
  
    const newColours = userSetColours.slice(0, coloursCount);
    setBackColours(newColours);
  };

  return (
    <div className={`App ${isNewFormat ? 'old-format' : 'new-format'}`}>
      <header className="App-header">
        <h1>EU Flag Maker</h1>
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
                onClick={() => setActiveSection('Background')} 
                className={activeSection === 'Background' ? 'active' : ''}
              >
                Background
              </button>
            </nav>
            {activeSection === 'Format' && (
              <div className="toolbar-segment">
                <Slider
                  value={starCount}
                  onChange={setStarCount}
                  min={0}
                  max={50}
                  unit={starCount === 1 ? "star" : "stars"}
                  label="Star Count"
                />
                <Slider
                  value={circleCount}
                  onChange={setCircleCount}
                  min={1}
                  max={3}
                  unit={circleCount === 1 ? "circle" : "circles"}
                  label="Circle Count"
                />
                <Slider
                  value={starSize}
                  onChange={setStarSize}
                  min={10}
                  max={150}
                  unit="px"
                  label="Star Size"
                />
                <Slider
                  value={rotationAngle}
                  onChange={setRotationAngle}
                  min={0}
                  max={360}
                  unit="°"
                  label="Rotation Angle"
                />
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
                        onChange={setSelectedShape}
                        shapePaths={shapePaths}
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
                    <div className="custom-toggle-container">
                      <CustomToggle 
                        option1="Filled"
                        option2="Outline Only"
                        isActive={outlineOnly}
                        onChange={() => setOutlineOnly(!outlineOnly)}
                      />
                    </div>
                    {outlineOnly && (
                      <div className="outline-weight">
                        <Slider
                          value={outlineWeight}
                          onChange={setOutlineWeight}
                          min={1}
                          max={15}
                          unit="px"
                          label="Outline Weight"
                        />
                      </div>
                    )}
                  </>
                )}
                <div className="custom-toggle-container">
                  <CustomToggle 
                    option1="Pointing Up"
                    option2="Pointing Outward"
                    isActive={pointAway}
                    onChange={() => setPointAway(!pointAway)}
                  />
                </div>
                <Slider
                  value={starRotation}
                  onChange={setStarRotation}
                  min={0}
                  max={360}
                  unit="°"
                  label="Star Rotation"
                />
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
                    <span className="tooltiptext">2:3 Aspect Ratio is ideal for downloading</span>
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
      </main>
      <footer className="App-footer">
      </footer>
    </div>
  );
};

export default App;