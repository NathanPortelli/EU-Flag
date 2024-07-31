import React, { useState, useEffect } from 'react';
import { CountryList } from './CountryURLList';
import StarsDisplay from '../StarsDisplay';

const QuizMode = ({ onExit }) => {
  const [currentFlag, setCurrentFlag] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [scoreColor, setScoreColor] = useState('#FFDD00');
  const [flagParams, setFlagParams] = useState(null);

  const parseURLParams = (url) => {
    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.search);
    const entries = Object.fromEntries(params.entries());

    if (entries.overlays) {
      entries.overlays = entries.overlays.split(';;').map(overlay => {
        const [type, ...rest] = overlay.split('|');
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
    } else {
      entries.overlays = [];
    }

    return entries;
  };

  const generateNewQuestion = () => {
    const correctCountry = getRandomCountry();
    let wrongOptions = [];
    while (wrongOptions.length < 2) {
      const wrongOption = getRandomCountry();
      if (wrongOption.value !== correctCountry.value && !wrongOptions.includes(wrongOption)) {
        wrongOptions.push(wrongOption);
      }
    }
    setCurrentFlag(correctCountry);
    setOptions([correctCountry, ...wrongOptions].sort(() => Math.random() - 0.5));
    
    const params = parseURLParams(correctCountry.link);
    setFlagParams(params);
  };

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const getRandomCountry = () => {
    return CountryList[Math.floor(Math.random() * CountryList.length)];
  };

  useEffect(() => {
    const selectRandomCountry = () => {
      const randomIndex = Math.floor(Math.random() * CountryList.length);
      setCurrentCountry(CountryList[randomIndex]);
    };

    selectRandomCountry();
  }, []);

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const handleAnswer = (selectedCountry) => {
    if (selectedCountry.value === currentFlag.value) {
      setScore(score + 1);
      setScoreColor('#11E091');
    } else {
      setScore(0);
      setScoreColor('red');
    }
    setTimeout(() => {
      setScoreColor('#FFDD00');
    }, 1000);
    generateNewQuestion();
  };

  return (
    <div className="quiz-mode-container">
        <div className="quiz-mode">
            <div className="flag-display">
                {currentFlag && flagParams && (
                <StarsDisplay
                    count={parseInt(flagParams.starCount) || 0}
                    size={parseInt(flagParams.starSize) || 55}
                    radius={parseInt(flagParams.starRadius) || 90}
                    circleCount={parseInt(flagParams.circleCount) || 1}
                    backColours={flagParams.backColours ? flagParams.backColours.split(',') : []}
                    starColour={flagParams.starColour || '#FFDD00'}
                    rotationAngle={parseInt(flagParams.rotationAngle) || 0}
                    shape={flagParams.shape || 'Star'}
                    pointAway={flagParams.pointAway === 'true'}
                    outlineOnly={flagParams.outlineOnly === 'true'}
                    outlineWeight={parseInt(flagParams.outlineWeight) || 2}
                    pattern={flagParams.pattern || 'Single'}
                    amount={flagParams.amount || ''}
                    starRotation={parseInt(flagParams.starRotation) || 0}
                    shapeConfiguration={flagParams.shapeConfiguration || 'circle'}
                    crossSaltireSize={parseInt(flagParams.crossSaltireSize) || 11}
                    gridRotation={parseInt(flagParams.gridRotation) || 0}
                    starsOnTop={flagParams.starsOnTop === 'true'}
                    checkerSize={parseInt(flagParams.checkerSize) || 4}
                    sunburstStripeCount={parseInt(flagParams.sunburstStripeCount) || 8}
                    borderWidth={parseInt(flagParams.borderWidth) || 10}
                    stripeWidth={parseInt(flagParams.stripeWidth) || 10}
                    circleSpacing={parseInt(flagParams.circleSpacing) || 100}
                    gridSpacing={parseInt(flagParams.gridSpacing) || 100}
                    containerFormat="flag"
                    overlays={flagParams.overlays}
                    updateOverlayPosition={() => {}}
                />
                )}
            </div>
            <div className="quiz-right">
                <div className="quiz-score" style={{ color: scoreColor }}>Score: {score}</div>
                <div className="quiz-options">
                {options.map((option, index) => (
                    <button key={index} onClick={() => handleAnswer(option)} className='quiz-options-buttons'>
                    {option.label}
                    </button>
                ))}
                </div>
                <div className='exit-quiz'>
                    <button className="exit-quiz-button" onClick={onExit}>Exit Quiz Mode</button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default QuizMode;