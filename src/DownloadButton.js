import React, { useState } from 'react';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import './DownloadButton.css';

const DownloadButton = () => {
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleDownload = () => {
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) {
      console.error('Stars container not found');
      return;
    }

    // Setting dimensions of stars container
    const computedStyle = window.getComputedStyle(starsContainer);
    const starsWidth = parseInt(computedStyle.width, 10);
    const starsHeight = parseInt(computedStyle.height, 10);

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

    // New canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Blue background
    ctx.fillStyle = '#003399';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Converting stars container to image and draw on canvas
    htmlToImage.toPng(starsContainer)
      .then(function (starsDataUrl) {
        const starsImg = new Image();
        starsImg.onload = function () {
          const offsetX = (canvasWidth - starsWidth) / 2;
          const offsetY = (canvasHeight - starsHeight) / 2;

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
    setButtonClicked(true); // Setting button as clicked for link
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