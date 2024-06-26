import React, { useState, useEffect } from 'react';
import Slider from './Slider';
import StarsDisplay from './StarsDisplay';
import DownloadButton from './DownloadButton';
import Switch from 'react-switch';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const shapeOptions = [
  'Star', 'Circle', 'Square', 'Hexagon', 'Pentagon', 'Octagon', 'Diamond', 'Crescent', 'Triangle', 'Cross'
];

const patternOptions = [
  'Single', 'Vertical Bicolour', 'Horizontal Bicolour', 'Bends Forward', 'Bends Backward', 'Vertical Thirds', 'Horizontal Thirds', 'Vertical Quarters', 'Horizontal Quarters', 'Quadrants', 'Bends Both Ways', 'Saltire'
];

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
  const [pointAway, setPointAway] = useState(false);
  const [outlineOnly, setOutlineOnly] = useState(false); 
  const [outlineWeight, setOutlineWeight] = useState(2); 
  const [activeSection, setActiveSection] = useState('Format');
  const [starRotation, setStarRotation] = useState(0);

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
  };

  const handleStarColourChange = (colour) => {
    setStarColour(colour);
    document.documentElement.style.setProperty('--star-color', colour);
  };

  const handleShapeChange = (event) => {
    setSelectedShape(event.target.value);
  };

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
  
    let coloursCount = 1;
    let defaultColours = ['#003399'];
  
    switch (pattern) {
      case 'Single':
        coloursCount = 1;
        break;
      case 'Vertical Bicolour':
      case 'Horizontal Bicolour':
      case 'Bends Forward':
      case 'Bends Backward':
      case 'Saltire':
        coloursCount = 2;
        defaultColours = ['#003399', '#ffffff'];
        break;
      case 'Vertical Thirds':
      case 'Horizontal Thirds':
        coloursCount = 3;
        defaultColours = ['#003399', '#ffffff', '#000000'];
        break;
      case 'Vertical Quarters':
      case 'Horizontal Quarters':
      case 'Quadrants':
      case 'Bends Both Ways':
        coloursCount = 4;
        defaultColours = ['#003399', '#ffffff', '#000000', '#008000'];
        break;
      default:
        coloursCount = 1;
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
              starRotation={starRotation}
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
                  unit="stars"
                  label="Star Count"
                />
                <Slider
                  value={circleCount}
                  onChange={setCircleCount}
                  min={1}
                  max={3}
                  unit="circles"
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
                <div className="Shape-selector">
                  <div className="Shape-container">
                    <label htmlFor="shapeSelector" className="shape-label">Select Shape</label>
                    <select id="shapeSelector" value={selectedShape} onChange={handleShapeChange} className="shape-dropdown">
                      {shapeOptions.map((shape) => (
                        <option key={shape} value={shape}>
                          {shape}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
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
              </div>
            )}
            {activeSection === 'Colours' && (
              <div className="toolbar-segment">
                <div className="Colour-selector">
                  <div className="Shape-container">
                    <label htmlFor="patternSelector" className="shape-label">Select Pattern</label>
                    <select id="patternSelector" value={selectedPattern} onChange={handlePatternChange} className="shape-dropdown">
                      {patternOptions.map((pattern) => (
                        <option key={pattern} value={pattern}>
                          {pattern}
                        </option>
                      ))}
                    </select>
                  </div>
                  {backColours.map((colour, index) => (
                    <div className="Colour-container" key={index}>
                      <label htmlFor={`backColourPicker-${index}`} className="colour-label">Background Colour {index + 1} </label>
                      <input
                        type="color"
                        id={`backColourPicker-${index}`}
                        value={colour}
                        onChange={(e) => handleBackColourChange(e.target.value, index)}
                      />
                    </div>
                  ))}
                  <div className="Colour-container" id="star-colour">
                    <label htmlFor="starColourPicker" className="colour-label">Star Colour </label>
                    <input
                      type="color"
                      id="starColourPicker"
                      value={starColour}
                      onChange={(e) => handleStarColourChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            <DownloadButton backColours={backColours} selectedPattern={selectedPattern} />
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
