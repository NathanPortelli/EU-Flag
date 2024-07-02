import React, { useState, useEffect, useRef, useMemo } from 'react';
import Slider from './Slider';
import StarsDisplay from './StarsDisplay';
import DownloadButton from './DownloadButton';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import { shapePaths } from './ShapePaths';
import ImageUpload from './ImageUpload';
import Divider from './Divider';

const shapeOptions = [
  'Star', 'Circle', 'Square', 'Hexagon', 'Pentagon', 'Octagon', 'Diamond', 'Crescent', 'Triangle', 'Cross'
];

const patternOptions = [
  'Single', 'Horizontal', 'Vertical', 'Bends', 'Quadrants', 'Saltire'
];

// Pattern amount options
const amountOptions = {
  'Horizontal': ['Bicolour', 'Thirds', 'Quarters'],
  'Vertical': ['Bicolour', 'Thirds', 'Quarters'],
  'Bends': ['Forwards', 'Backwards', 'Both Ways']
};

const patternIcons = {
  'Single': '☐',
  'Vertical': '║',
  'Horizontal': '═',
  'Bends': '⫽',
  'Quadrants': '╬',
  'Saltire': 'X'
};

const amountIcons = {
  'Bicolour': '| ',
  'Thirds': '||| ',
  'Quarters': '||||',
  'Forwards': '/',
  'Backwards': '\\',
  'Both Ways': '𝕏'
};

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
  const [starCount, setStarCount] = useState(12);
  const [circleCount, setCircleCount] = useState(1);
  const [starSize, setStarSize] = useState(45);
  const [isNewFormat, setIsNewFormat] = useState(false);
  const [starRadius, setStarRadius] = useState(100);
  const [backColours, setBackColours] = useState(['#003399']);
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

  // Calculate opposite colour
  const getOppositeColor = (hex) => {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Calculate initial label colors
  const initialLabelColors = useMemo(() => {
    const colors = {};
    backColours.forEach((color, index) => {
      colors[`back-${index}`] = getOppositeColor(color);
    });
    colors.star = getOppositeColor(starColour);
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
    setStarRadius(isNewFormat ? 90 : 80);

    if (window.innerWidth < 1000) {
      setIsNewFormat(true);
    }

    return () => { };
  }, []);

  const handleToggle = () => {
    setIsNewFormat(!isNewFormat);
  };

  const handleBackColourChange = (colour, index) => {
    const newColours = [...backColours];
    newColours[index] = colour;
    setBackColours(newColours);
    document.documentElement.style.setProperty(`--back-color-${index}`, colour);
    
    setLabelColors(prev => ({...prev, [`back-${index}`]: getOppositeColor(colour)}));
  };
  
  const handleStarColourChange = (colour) => {
    setStarColour(colour);
    document.documentElement.style.setProperty('--star-color', colour);
    
    setLabelColors(prev => ({...prev, star: getOppositeColor(colour)}));
  };
  
  // Initialising label colors on component mount
  useEffect(() => {
    const initialLabelColors = {};
    backColours.forEach((color, index) => {
      initialLabelColors[`back-${index}`] = getOppositeColor(color);
    });
    initialLabelColors.star = getOppositeColor(starColour);
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
    let defaultColours = ['#003399'];
  
    switch (pattern) {
      case 'Single':
        coloursCount = 1;
        break;
      case 'Vertical':
      case 'Horizontal':
      case 'Bends':
      case 'Saltire':
        coloursCount = 2;
        defaultColours = ['#003399', '#ffffff'];
        break;
      case 'Quadrants':
        coloursCount = 4;
        defaultColours = ['#003399', '#ffffff', '#000000', '#008000'];
        break;
      default:
        coloursCount = 1;
    }
  
    const newColours = Array.from({ length: coloursCount }, (_, index) => defaultColours[index] || '#003399');
    setBackColours(newColours);
  };

  const handleAmountChange = (event) => {
    const amount = event.target.value;
    setSelectedAmount(amount);
  
    let coloursCount = 2;
    let defaultColours = ['#003399', '#ffffff'];
  
    if (amount === 'Thirds') {
      coloursCount = 3;
      defaultColours = ['#003399', '#ffffff', '#000000'];
    } else if (amount === 'Quarters' || amount === 'Both Ways') {
      coloursCount = 4;
      defaultColours = ['#003399', '#ffffff', '#000000', '#008000'];
    }
  
    const newColours = Array.from({ length: coloursCount }, (_, index) => defaultColours[index] || '#003399');
    setBackColours(newColours);
  };

  return (
    <div className={`App ${isNewFormat ? 'old-format' : 'new-format'}`}>
      <header className="App-header">
        <h1>EU Flag Maker</h1>
        <CustomToggle 
          option1="PC"
          option2="Mobile"
          isActive={isNewFormat}
          onChange={handleToggle}
        />
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
            />
          </div>
          <div className="Slider-content">
            <nav className="App-nav">
              <button onClick={() => setActiveSection('Format')} className={activeSection === 'Format' ? 'active' : ''}>Format</button>
              <button onClick={() => setActiveSection('Shape')} className={activeSection === 'Shape' ? 'active' : ''}>Shape</button>
              <button onClick={() => setActiveSection('Colours')} className={activeSection === 'Colours' ? 'active' : ''}>Colours</button>
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
            {activeSection === 'Colours' && (
              <div className="toolbar-segment">
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
                  <p class="colours-header">Colours</p>
                  {backColours.map((colour, index) => (
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
                  {!customImage && (
                  <>
                    <div className="Colour-container" id="star-colour">
                      <label
                        htmlFor="starColourPicker"
                        className="colour-label"
                        style={{color: labelColors.star}}
                      >
                        Star Colour
                      </label>
                      <input
                        type="color"
                        id="starColourPicker"
                        value={starColour}
                        onChange={(e) => handleStarColourChange(e.target.value)}
                      />
                    </div>
                  </>
                )}
                </div>
              </div>
            )}
            <DownloadButton 
              backColours={backColours} 
              selectedPattern={selectedPattern} 
              selectedAmount={selectedAmount} 
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
