import React from 'react';
import './styles/StarsDisplay.css';
import { shapePaths } from './components/ItemLists';
import { overlaySymbols } from './components/OverlaySymbols';

const StarsDisplay = ({ count, size, radius, circleCount, backColours, starColour, rotationAngle, shape, pointAway, outlineOnly, outlineWeight, pattern, amount, starRotation, customImage, backgroundImage, shapeConfiguration, overlays, containerFormat, crossSaltireSize, gridRotation, starsOnTop, checkerSize }) => {
 
  const renderOverlays = () => {
    return overlays.map((overlay, index) => {
      if (overlay.type === 'text') {
        return (
          <div
            key={`overlay-${index}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${overlay.offsetX}px), calc(-50% + ${overlay.offsetY}px)) rotate(${overlay.rotation}deg)`,
              fontSize: `${overlay.size}px`,
              fontFamily: overlay.font,
              zIndex: overlays.length - index,
              color: overlay.color,
            }}
          >
            {overlay.text}
          </div>
        );
      } else {
        const symbol = overlaySymbols.find(s => s.value === overlay.shape);
        return (
          <div
            key={`overlay-${index}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${overlay.offsetX}px), calc(-50% + ${overlay.offsetY}px)) rotate(${overlay.rotation}deg)`,
              fontSize: `${overlay.size}px`,
              zIndex: overlays.length - index,
              color: overlay.color,
            }}
          >
            {symbol ? symbol.unicode : ''}
          </div>
        );
      }
    });
  };

  const renderShapes = (count, size, radius, keyPrefix) => {
    const shapes = [];
  
    if (shapeConfiguration === 'square') {
      let rows = Math.ceil(Math.sqrt(count));
      let cols = Math.floor(count / rows);
      let remainingStars = count - rows * cols;
  
      if (remainingStars > 0) {
        rows++;
      }
  
      let starIndex = 0;
      for (let row = 0; row < rows; row++) {
        const isOddRow = row % 2 === 1;
        const starsInThisRow = isOddRow ? Math.ceil(count / rows) : Math.floor(count / rows);
        
        const horizontalGap = 100 / (starsInThisRow + 1);
        const verticalGap = 100 / (rows + 1);
        
        let offsetX = 0;
        if (starsInThisRow !== Math.ceil(count / rows)) {
          offsetX = (horizontalGap / 2) * (isOddRow ? 1 : 0);
        }
  
        for (let col = 0; col < starsInThisRow; col++) {
          if (starIndex >= count) break;
  
          const x = offsetX + (col + 1) * horizontalGap;
          const y = (row + 1) * verticalGap;
  
          let shapeRotation = pointAway ? 0 : starRotation;
  
          shapes.push(
            <svg
              key={`${keyPrefix}-${starIndex}`}
              className="shape"
              viewBox="0 0 100 100"
              style={{
                position: 'absolute',
                left: `calc(${x}% - ${size / 2}px)`,
                top: `calc(${y}% - ${size / 2}px)`,
                width: `${size}px`,
                height: `${size}px`,
                transform: `rotate(${shapeRotation}deg)`,
                overflow: 'visible',
              }}
            >
              {customImage ? (
                <image
                  href={customImage}
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  preserveAspectRatio="xMidYMid meet"
                />
              ) : (
                <path
                  d={shapePaths[shape]}
                  fill={outlineOnly ? 'none' : starColour}
                  stroke={starColour}
                  strokeWidth={outlineOnly ? outlineWeight : '0'}
                />
              )}
            </svg>
          );
          starIndex++;
        }
      }
    } else {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2 + (rotationAngle * Math.PI / 180);
        let x, y;
        
        if (containerFormat === 'flag') {
          x = 50 + (radius * 0.66) * Math.cos(angle);
          y = 50 + radius * Math.sin(angle);
        } else {
          x = 50 + radius * Math.cos(angle);
          y = 50 + radius * Math.sin(angle);
        }
      
        let shapeRotation = pointAway ? angle : 0;
        
        if ((shape === 'Star' || shape === 'Pentagon') && pointAway) {
          shapeRotation += (19 * Math.PI) / 180;
        }
  
        shapes.push(
          <svg
            key={`${keyPrefix}-${i}`}
            className="shape"
            viewBox="0 0 100 100"
            style={{
              position: 'absolute',
              left: `calc(${x}% - ${size / 2}px)`,
              top: `calc(${y}% - ${size / 2}px)`,
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotate(${shapeRotation}rad) rotate(${starRotation}deg)`,
              overflow: 'visible',
            }}
          >
            {customImage ? (
              <image
                href={customImage}
                x="0"
                y="0"
                width="100"
                height="100"
                preserveAspectRatio="xMidYMid meet"
              />
            ) : (
              <path
                d={shapePaths[shape]}
                fill={outlineOnly ? 'none' : starColour}
                stroke={starColour}
                strokeWidth={outlineOnly ? outlineWeight : '0'}
              />
            )}
          </svg>
        );
      }
    }

    if (shapeConfiguration === 'square') {
      return (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: `rotate(${gridRotation}deg)`,
            transformOrigin: 'center',
          }}
        >
          {shapes}
        </div>
      );
    }

    return shapes;
  };
  
  const generateBackgroundStyle = () => {
    let backgroundStyle = {};
  
    if (backgroundImage) {
      backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    } else {
      switch (pattern) {
        case 'Single':
          backgroundStyle = { background: backColours[0] };
          break;
        case 'Checkered':
          const checkerSizePercentage = 200 / checkerSize
          backgroundStyle = {
            backgroundImage: `
              repeating-conic-gradient(
                ${backColours[0]} 0deg 90deg,
                ${backColours[1]} 90deg 180deg
              )
            `,
            backgroundSize: `${checkerSizePercentage}% ${checkerSizePercentage}%`,
          };
          break;
        case 'Horizontal':
        case 'Vertical':
          const gradientDirection = pattern === 'Horizontal' ? 'to bottom' : 'to right';
          const gradientStops = backColours.map((color, index) => 
            `${color} ${index * (100 / backColours.length)}%, ${color} ${(index + 1) * (100 / backColours.length)}%`
          ).join(', ');
          backgroundStyle = {
            background: `linear-gradient(${gradientDirection}, ${gradientStops})`
          };
          break;
        case 'Bends':
          switch (amount) {
            case 'Forwards':
            default:
              backgroundStyle = {
                background: `linear-gradient(
                  to bottom right,
                  ${backColours[0]} 0%,
                  ${backColours[0]} 50%,
                  ${backColours[1]} 50%,
                  ${backColours[1]} 100%
                )`
              };
              break;
            case 'Backwards':
              backgroundStyle = {
                background: `linear-gradient(
                  to bottom left,
                  ${backColours[0]} 0%,
                  ${backColours[0]} 50%,
                  ${backColours[1]} 50%,
                  ${backColours[1]} 100%
                )`
              };
              break;
            case 'Both Ways':
              backgroundStyle = {
                background: `conic-gradient(
                  from 45deg at 50% 50%,
                  ${backColours[0]} 0deg,
                  ${backColours[0]} 90deg,
                  ${backColours[1]} 90deg,
                  ${backColours[1]} 180deg,
                  ${backColours[2]} 180deg,
                  ${backColours[2]} 270deg,
                  ${backColours[3]} 270deg,
                  ${backColours[3]} 360deg
                )`
              };
              break;
          }
          break;
        case 'Quadrants':
          backgroundStyle = {
            background: `conic-gradient(
              from 0deg at 50% 50%,
              ${backColours[0]} 0deg,
              ${backColours[0]} 90deg,
              ${backColours[1]} 90deg,
              ${backColours[1]} 180deg,
              ${backColours[2]} 180deg,
              ${backColours[2]} 270deg,
              ${backColours[3]} 270deg,
              ${backColours[3]} 360deg
            )`
          };
          break;
        case 'Cross':
          const crossWidth = `${crossSaltireSize}%`;
          backgroundStyle = {
            background: `
              linear-gradient(to right, transparent calc(50% - ${crossWidth}/2), ${backColours[0]} calc(50% - ${crossWidth}/2), ${backColours[0]} calc(50% + ${crossWidth}/2), transparent calc(50% + ${crossWidth}/2)),
              linear-gradient(to bottom, transparent calc(50% - ${crossWidth}/2), ${backColours[0]} calc(50% - ${crossWidth}/2), ${backColours[0]} calc(50% + ${crossWidth}/2), transparent calc(50% + ${crossWidth}/2)),
              ${backColours[1]}
            `
          };
          break;
        case 'Saltire':
          const saltireWidth = `${crossSaltireSize}%`;
          const saltireAngle = '33.8deg';
          backgroundStyle = {
            background: `
              linear-gradient(${saltireAngle}, transparent calc(50% - ${saltireWidth}/2), ${backColours[0]} calc(50% - ${saltireWidth}/2), ${backColours[0]} calc(50% + ${saltireWidth}/2), transparent calc(50% + ${saltireWidth}/2)),
              linear-gradient(-${saltireAngle}, transparent calc(50% - ${saltireWidth}/2), ${backColours[0]} calc(50% - ${saltireWidth}/2), ${backColours[0]} calc(50% + ${saltireWidth}/2), transparent calc(50% + ${saltireWidth}/2)),
              ${backColours[1]}
            `
          };
          break;
        default:
          backgroundStyle = { background: backColours[0] };
      }
    }
  
    return backgroundStyle;
  }; 

  if (count === 1) {
    return (
      <div 
        id="stars-container" 
        className={`stars-container ${containerFormat === 'flag' ? 'flag' : ''}`}
        style={{
          ...generateBackgroundStyle(),
          ...(containerFormat === 'flag' ? {
            borderRadius: '0',
          } : {
            borderRadius: '100%',
          })
        }}
        data-has-background-image={!!backgroundImage}
      >
        <div 
          id="stars-only-container" 
          className="stars-only-container"
          style={{
            ...(containerFormat === 'flag' ? {
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
            } : {})
          }}
        >
          <svg
            className="shape"
            viewBox="0 0 100 100"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${starRotation}deg)`,
              width: `${size}px`,
              height: `${size}px`,
              overflow: 'visible',
            }}
          >
            {customImage ? (
              <image
                href={customImage}
                x="0"
                y="0"
                width="100"
                height="100"
                preserveAspectRatio="xMidYMid meet"
              />
            ) : (
              <path
                d={shapePaths[shape]}
                fill={outlineOnly ? 'none' : starColour}
                stroke={starColour}
                strokeWidth={outlineOnly ? outlineWeight : '0'}
              />
            )}
          </svg>
        </div>
        {renderOverlays()}
      </div>
    );
  }

  const circleConfigurations = [
    { circleIndex: 1, countRatio: { 1: 1, 2: 2/3, 3: 4/9 }, radiusFactor: 2 },
    { circleIndex: 2, countRatio: { 2: 1/3, 3: 3/9 }, radiusFactor: 2.5 },
    { circleIndex: 3, countRatio: { 3: 2/9 }, radiusFactor: 4 },
  ];
  
  let remainingStars = count;
  const circles = circleConfigurations.slice(0, circleCount).map((config, index) => {
    let newCount;
    if (index === circleCount - 1) {
      newCount = remainingStars;
    } else {
      newCount = Math.round((config.countRatio[circleCount] || 1) * count);
      remainingStars -= newCount;
    }
    const currentRadius = radius / config.radiusFactor;
  
    return (
      <div
        key={`circle-${config.circleIndex}`}
        className="circle"
        style={{
          position: 'absolute',
          width: `${currentRadius * 2}%`,
          height: `${currentRadius * 2}%`,
          top: `calc(50% - ${currentRadius}%)`,
          left: `calc(50% - ${currentRadius}%)`
        }}
      >
        {renderShapes(newCount, size, currentRadius, `circle-${config.circleIndex}`)}
      </div>
    );
  });

  return (
    <div 
      id="stars-container" 
      className={`stars-container ${containerFormat === 'flag' ? 'flag' : ''}`}
      style={{
        ...generateBackgroundStyle(),
        ...(containerFormat === 'flag' ? {
          borderRadius: '0',
        } : {
          borderRadius: '100%',
        })
      }}
      data-has-background-image={!!backgroundImage}
    >
      <div 
        id="stars-only-container" 
        className="stars-only-container"
        style={{
          ...(containerFormat === 'flag' ? {
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
          } : {}),
          zIndex: starsOnTop ? 2 : 1,
        }}
      >
        {circles}
      </div>
      <div 
        id="overlays-container" 
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          zIndex: starsOnTop ? 1 : 2,
        }}
      >
        {renderOverlays()}
      </div>
    </div>
  );
};
export default StarsDisplay;