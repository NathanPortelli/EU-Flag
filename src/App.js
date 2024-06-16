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
            />
          </div>
          <div className="Slider-content">
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
              max={65} 
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
            <div className="Shape-selector">
              <label htmlFor="shapeSelector" className="shape-label"><b>Select Shape</b></label>
              <select id="shapeSelector" value={selectedShape} onChange={handleShapeChange} className="shape-dropdown">
                {shapeOptions.map((shape) => (
                  <option key={shape} value={shape}>
                    {shape}
                  </option>
                ))}
              </select>
            </div>
            <div className="Colour-inputs">
              <input
                type="color"
                id="backColourPicker"
                value={backColour}
                onChange={(e) => handleBackColourChange(e.target.value)}
              />
              <label htmlFor="backColourPicker" className="colour-label"><b>Background</b> Colour</label>
            </div>
            <div className="Colour-inputs">
              <input
                type="color"
                id="starColourPicker"
                value={starColour}
                onChange={(e) => handleStarColourChange(e.target.value)}
              />
              <label htmlFor="starColourPicker" className="colour-label"><b>Stars</b> Colour</label>
            </div>
            <div className="Download-btn">
              <DownloadButton backColour={backColour}/>
            </div>
          </div>
        </div>
        <a href="https://github.com/NathanPortelli/EU-Flag" className="github-icon" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github"></i>
        </a>
      </main>
    </div>
  );
};

export default App;
