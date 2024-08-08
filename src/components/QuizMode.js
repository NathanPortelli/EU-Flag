import React, { useState, useEffect } from 'react';
import { CountryList } from './CountryURLList';
import StarsDisplay from '../StarsDisplay';
import Slider from './Slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faClock, faCog } from '@fortawesome/free-solid-svg-icons';
import { CustomToggle } from './CustomToggle';
import Popup from './Popup';

const QuizMode = ({ onExit }) => {
  const [currentFlag, setCurrentFlag] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [scoreColor, setScoreColor] = useState('#FFDD00');
  const [flagParams, setFlagParams] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [optionCount, setOptionCount] = useState(3);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLimit, setTimeLimit] = useState(10);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const storedMaxScore = localStorage.getItem('maxScore');
    if (storedMaxScore) {
      setMaxScore(parseInt(storedMaxScore, 10));
    }
  
    generateNewQuestion();
  
    let timer;
    const startTimer = () => {
      if (timerEnabled) {
        timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timer);
              setScore(0);
              setScoreColor('red');
              generateNewQuestion();
              setTimeLeft(timeLimit);
              startTimer();
              return timeLimit;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
    };
  
    startTimer();
  
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerEnabled, timeLimit, optionCount]);

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
    while (wrongOptions.length < optionCount - 1) {
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

  const getRandomCountry = () => {
    return CountryList[Math.floor(Math.random() * CountryList.length)];
  };
  
  const handleAnswer = (selectedCountry) => {
    setSelectedAnswer(selectedCountry);
    setCorrectAnswer(currentFlag);
  
    if (selectedCountry.value === currentFlag.value) {
      const newScore = score + 1;
      setScore(newScore);
      setScoreColor('#11E091');
      
      if (newScore > maxScore) {
        setMaxScore(newScore);
        localStorage.setItem('maxScore', newScore);
      }
    } else {
      setScore(0);
      setScoreColor('red');
    }
  
    if (timerEnabled) {
      setTimeLeft(timeLimit);
    }
  
    setTimeout(() => {
      setScoreColor('#FFDD00');
      setSelectedAnswer(null);
      setCorrectAnswer(null);
      generateNewQuestion();
    }, 600);
  };

  const handleOptionCountChange = (newCount) => {
    setOptionCount(newCount);
  };

  const handleTimerToggle = () => {
    setTimerEnabled(!timerEnabled);
    setTimeLeft(timeLimit);
  };

  const handleTimeLimitChange = (newLimit) => {
    setTimeLimit(newLimit);
    setTimeLeft(newLimit);
  };

  // Settings popup

  const Settings = () => (
    <div className='quiz-controls'>
      <h1 className='quiz-controls-title'>Quiz Settings</h1>
      <div className="timer-controls">
        <CustomToggle
          option1="Timer Off"
          option2="Timer On"
          isActive={timerEnabled}
          onChange={handleTimerToggle}
        />
      </div>
      {timerEnabled && (
        <Slider
          value={timeLimit}
          onChange={handleTimeLimitChange}
          min={5}
          max={30}
          label="Time Limit"
          unit="seconds"
          icon={faClock}
        />
      )}
      <div className="option-count-slider-container">
        <Slider
          value={optionCount}
          onChange={handleOptionCountChange}
          min={2}
          max={6}
          label="Number of Options"
          unit="options"
          icon={faList}
        />
      </div>
      <button className="exit-quiz-button" onClick={onExit}>Exit Quiz Mode</button>
    </div>
  );

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
          <div className="quiz-score-container">
            <div className="quiz-score-content">
              <div className="quiz-score" style={{ color: scoreColor }}>Score: {score}</div>
              <div className="quiz-max-score">High Score: {maxScore}</div>
            </div>
            <button className="settings-button" onClick={() => setShowSettings(true)}>
              <FontAwesomeIcon icon={faCog} />
            </button>
          </div>
          {timerEnabled && <div className="quiz-timer">Time Left: {timeLeft}s</div>}
          <div className="quiz-options">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`quiz-options-buttons ${
                  selectedAnswer && (
                    option.value === selectedAnswer.value
                      ? option.value === correctAnswer.value
                        ? 'correct'
                        : 'incorrect'
                      : option.value === correctAnswer.value
                        ? 'correct'
                        : ''
                  )
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {showSettings && (
        <Popup onClose={() => setShowSettings(false)}>
          <Settings />
        </Popup>
      )}
    </div>
  );
};

export default QuizMode;