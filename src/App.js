import React, { useState, useEffect } from 'react';
import Slider from './Slider';
import StarsDisplay from './StarsDisplay';
import StarSizeSlider from './StarSizeSlider';
import CircleCountSlider from './CircleCountSlider';
import DownloadButton from './DownloadButton';
import Switch from 'react-switch';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  const [starCount, setStarCount] = useState(12);
  const [circleCount, setCircleCount] = useState(1);
  const [starSize, setStarSize] = useState(45);
  const [isNewFormat, setIsNewFormat] = useState(false);
  const [starRadius, setStarRadius] = useState(100);

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
            <StarsDisplay count={starCount} size={starSize} radius={starRadius} circleCount={circleCount} />
          </div>
          <div className="Slider-content">
            <Slider value={starCount} onChange={setStarCount} />
            <CircleCountSlider value={circleCount} onChange={setCircleCount} />
            <StarSizeSlider value={starSize} onChange={setStarSize} />
            <div className="Download-btn">
              <DownloadButton />
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
