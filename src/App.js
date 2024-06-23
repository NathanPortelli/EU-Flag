import React, { useState, useEffect } from 'react';
import Slider from './Slider';
import StarsDisplay from './StarsDisplay';
import DownloadButton from './DownloadButton';
import Switch from 'react-switch';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const shapeOptions = [
  'Star', 'Circle', 'Square', 'Hexagon', 'Pentagon', 'Octagon', 'Heart', 'Diamond', 'Crescent'
];

const App = () => {
  const [starCount, setStarCount] = useState(12);
  const [circleCount, setCircleCount] = useState(1);
  const [starSize, setStarSize] = useState(45);
  const [isNewFormat, setIsNewFormat] = useState(false);
  const [starRadius, setStarRadius] = useState(100);
  const [backColour, setBackColour] = useState('#003399');
  const [starColour, setStarColour] = useState('#FFDD00');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [selectedShape, setSelectedShape] = useState('Star');
  const [pointAway, setPointAway] = useState(false);
  const [outlineOnly, setOutlineOnly] = useState(false); 
  const [outlineWeight, setOutlineWeight] = useState(2); 
  const [activeSection, setActiveSection] = useState('Format');

  useEffect(() => {
    setStarRadius(isNewFormat ? 90 : 80);

    if (window.innerWidth < 600) {
      setIsNewFormat(true);
    }

    return () => { };
  }, []);

  const handleToggle = () => {
    setIsNewFormat(!isNewFormat);
  };

  const handleBackColourChange = (colour) => {
    setBackColour(colour);
    document.documentElement.style.setProperty('--back-color', colour);
  };

  const handleStarColourChange = (colour) => {
    setStarColour(colour);
    document.documentElement.style.setProperty('--star-color', colour);
  };

  const handleShapeChange = (event) => {
    setSelectedShape(event.target.value);
  };

  return (
    <div className={`App ${isNewFormat ? 'old-format' : 'new-format'}`}>
      <header className="App-header">
        <h1>EU Flag Maker</h1>
        <div className="toggle-container">
          <span className="toggle-text">{isNewFormat ? 'Vertical' : 'Horizontal'}</span>
          <label htmlFor="format-switch" className="toggle-label"></label>
          <Switch
            checked={isNewFormat}
            onChange={handleToggle}
            onColor="#9b870c"
            onHandleColor="#FFDD00"
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={48}
            className="react-switch"
            id="format-switch"
          />
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
              backColour={backColour}
              starColour={starColour}
              rotationAngle={rotationAngle}
              shape={selectedShape}
              pointAway={pointAway}
              outlineOnly={outlineOnly}
              outlineWeight={outlineWeight}
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
                  min={1}
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
                  max={85}
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
                <div className="Point-away-container">
                  <span className="toggle-text">{pointAway ? 'Pointing Outward' : 'Pointing Inward'}</span>
                  <label htmlFor="point-away-switch" className="toggle-label-point"></label>
                  <Switch
                    checked={pointAway}
                    onChange={() => setPointAway(!pointAway)}
                    onColor="#9b870c"
                    onHandleColor="#FFDD00"
                    handleDiameter={30}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={48}
                    className="react-switch"
                    id="point-away-switch"
                  />
                </div>
                <div className="Outline-only-container">
                  <span className="toggle-text">{outlineOnly ? 'Outline Only' : 'Filled'}</span>
                  <label htmlFor="outline-only-switch" className="toggle-label-outline"></label>
                  <Switch
                    checked={outlineOnly}
                    onChange={() => setOutlineOnly(!outlineOnly)}
                    onColor="#9b870c"
                    onHandleColor="#FFDD00"
                    handleDiameter={30}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={48}
                    className="react-switch"
                    id="outline-only-switch"
                  />
                </div>
                {outlineOnly && (
                  <div class="outline-weight">
                    <Slider
                      value={outlineWeight}
                      onChange={setOutlineWeight}
                      min={1}
                      max={10}
                      unit="px"
                      label="Outline Weight"
                    />
                  </div>
                )}
              </div>
            )}
            {activeSection === 'Colours' && (
              <div className="toolbar-segment">
                <div className="Colour-inputs-container">
                  <div className="Colour-inputs">
                    <input
                      type="color"
                      id="backColourPicker"
                      value={backColour}
                      onChange={(e) => handleBackColourChange(e.target.value)}
                    />
                    <label htmlFor="backColourPicker" className="colour-label">Background Colour</label>
                  </div>
                  <div className="Colour-inputs">
                    <input
                      type="color"
                      id="starColourPicker"
                      value={starColour}
                      onChange={(e) => handleStarColourChange(e.target.value)}
                    />
                    <label htmlFor="starColourPicker" className="colour-label">Stars Colour</label>
                  </div>
                </div>
              </div>
            )}
            <DownloadButton />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;