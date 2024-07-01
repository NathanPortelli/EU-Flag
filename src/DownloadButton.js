import React, { useState } from 'react';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import './DownloadButton.css';

const DownloadButton = ({ backColours, selectedPattern }) => {
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleDownload = () => {
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) {
      console.error('Stars container not found.');
      return;
    }

    // Setting dimensions of stars container
    const computedStyle = window.getComputedStyle(starsContainer);
    let starsWidth = parseInt(computedStyle.width, 10);
    let starsHeight = parseInt(computedStyle.height, 10);

    // Canvas dimensions -- 2:3 aspect ratio
    const aspectRatio = 3 / 2;
    let canvasWidth, canvasHeight;
    // Stars container is wider
    if (starsWidth / starsHeight > aspectRatio) {
      canvasWidth = starsWidth;
      canvasHeight = starsWidth / aspectRatio;
    } 
    // Stars container is taller or square
    else {
      canvasWidth = starsHeight * aspectRatio;
      canvasHeight = starsHeight;
    }

    //todo: quickfix for verticals
    // Adjust dimensions for specific patterns
    if (selectedPattern === 'Vertical Thirds') {
      starsWidth *= 1.2;
      starsHeight *= 1.2;
    }
    if (selectedPattern === 'Vertical Quarters') {
      starsWidth *= 1.3;
      starsHeight *= 1.3;
    }

    // New canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (selectedPattern === 'Quadrants') {
      const halfWidth = canvasWidth / 2;
      const halfHeight = canvasHeight / 2;
    
      // Top-left quadrant
      ctx.fillStyle = backColours[3];
      ctx.fillRect(0, 0, halfWidth, halfHeight);
    
      // Top-right quadrant
      ctx.fillStyle = backColours[0];
      ctx.fillRect(halfWidth, 0, halfWidth, halfHeight);
    
      // Bottom-left quadrant
      ctx.fillStyle = backColours[2];
      ctx.fillRect(0, halfHeight, halfWidth, halfHeight);
    
      // Bottom-right quadrant
      ctx.fillStyle = backColours[1];
      ctx.fillRect(halfWidth, halfHeight, halfWidth, halfHeight);
    } else if (selectedPattern.includes('Vertical')) {
      // Vertical
      const stripeWidth = canvasWidth / backColours.length;
      //todo: quickfix for quarters pattern
      if (selectedPattern.includes('Quarters')) {
        // Reverse the order for quarters pattern
        for (let i = 0; i < backColours.length; i++) {
          ctx.fillStyle = backColours[backColours.length - 1 - i];
          ctx.fillRect(i * stripeWidth, 0, stripeWidth, canvasHeight);
        }
      } else {
        // Normal vertical pattern
        backColours.forEach((colour, index) => {
          ctx.fillStyle = colour;
          ctx.fillRect(index * stripeWidth, 0, stripeWidth, canvasHeight);
        });
      }
    } else {
      // Horizontal pattern (default behavior)
      for (let i = 0; i < backColours.length; i++) {
        //todo: quickfix for quarters pattern
        if (selectedPattern.includes('Quarters')) {
          // Reverse the order for quarters pattern
          ctx.fillStyle = backColours[backColours.length - 1 - i];
        } else {
          ctx.fillStyle = backColours[i];
        }
        ctx.fillRect(0, (canvasHeight / backColours.length) * i, canvasWidth, canvasHeight / backColours.length);
      }
    }

    // Converting stars container to image and draw on canvas
    htmlToImage.toPng(starsContainer)
      .then(function (starsDataUrl) {
        const starsImg = new Image();
        starsImg.onload = function () {
          const offsetX = (canvasWidth - starsWidth) / 2;
          const offsetY = (canvasHeight - starsHeight) / 2 - (canvasHeight * 0.02);

          ctx.drawImage(starsImg, offsetX, offsetY, starsWidth, starsHeight);

          // Downloading composite image
          canvas.toBlob(function (blob) {
            download(blob, 'eu-flag.png');
          });
        };
        starsImg.src = starsDataUrl;
      })
      .catch(function (error) {
        console.error('Error generating flag: ', error);
      });

    setButtonClicked(true);
  };

  return (
    <div className="download-button-container">
      <button className="download-button" onClick={handleDownload}>
        <FontAwesomeIcon icon={faDownload} className="download-icon" />
        Download Flag
      </button>
      {buttonClicked && (
        <div className="flag-text">
          <p><a href="https://krikienoid.github.io/flagwaver/" target="_blank" rel="noopener noreferrer">Wave the Flag!</a></p>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;