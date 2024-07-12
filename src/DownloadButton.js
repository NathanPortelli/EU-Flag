import React, { useState } from 'react';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileExport } from '@fortawesome/free-solid-svg-icons';
import './styles/DownloadButton.css';
import { overlaySymbols } from './components/OverlaySymbols';

const DownloadButton = ({ backColours, selectedPattern, selectedAmount, backgroundImage, customImage, overlays, stripeCount, crossSaltireSize, containerFormat, gridRotation, starsOnTop, checkerSize, sunburstStripeCount }) => {
  const [buttonClicked, setButtonClicked] = useState(false);

  const sortOverlays = (overlays) => {
    return [...overlays].sort((a, b) => overlays.indexOf(b) - overlays.indexOf(a));
  };

  function drawCross(ctx, x, y, width, height, strokeWidth) {
    ctx.save();
    ctx.strokeStyle = backColours[0];
    ctx.lineWidth = strokeWidth * (crossSaltireSize / 11);
    ctx.beginPath();
    
    // Horizontal line
    ctx.moveTo(x, y + height / 2);
    ctx.lineTo(x + width, y + height / 2);
    
    // Vertical line
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width / 2, y + height);
    
    ctx.stroke();
    ctx.restore();
  }

  function drawSaltire(ctx, x, y, width, height, strokeWidth) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x + width / 2, y + height / 2);
    const angle = Math.atan2(height, width);
    const length = Math.sqrt(width * width + height * height);
  
    ctx.lineWidth = strokeWidth * (crossSaltireSize / 11);
    ctx.strokeStyle = backColours[0];
  
    ctx.rotate(angle);
    ctx.moveTo(-length / 2, 0);
    ctx.lineTo(length / 2, 0);
    ctx.stroke();
  
    ctx.rotate(-2 * angle);
    ctx.moveTo(-length / 2, 0);
    ctx.lineTo(length / 2, 0);
    ctx.stroke();
    ctx.restore();
  }
  
  const handleSvgDownload = () => {
    const starsContainer = document.getElementById('stars-container');
    const starsOnlyContainer = document.getElementById('stars-only-container') || document.getElementById('stars-container');
    if (!starsContainer || !starsOnlyContainer) {
      console.error('Stars container not found.');
      return;
    }
  
    // New SVG element with 2:3 aspect ratio
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "600");
    svg.setAttribute("height", "400");
    svg.setAttribute("viewBox", "0 0 600 400");
    createBackground(svg);
  
    const starsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const overlaysGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Contain the stars
    const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    if (containerFormat === 'circle') {
      foreignObject.setAttribute("width", "66.67%");
      foreignObject.setAttribute("height", "100%");
      foreignObject.setAttribute("x", "16.665%");
    } else {
      foreignObject.setAttribute("width", "100%");
      foreignObject.setAttribute("height", "100%");
      foreignObject.setAttribute("x", "0");
      foreignObject.setAttribute("transform", `rotate(${gridRotation} 300 200)`);
    }

    const starsClone = starsOnlyContainer.cloneNode(true);

    // Center the stars
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'center';
    wrapper.style.alignItems = 'center';

    wrapper.appendChild(starsClone);
    foreignObject.appendChild(wrapper);
    // svg.appendChild(foreignObject);
    starsGroup.appendChild(foreignObject);

    // Add overlays
    const sortedOverlays = sortOverlays(overlays);
    sortedOverlays.forEach((overlay, index) => {
      if (overlay.type === 'text') {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("font-size", `${overlay.size}px`);
        text.setAttribute("font-family", overlay.font);
        text.setAttribute("fill", overlay.color);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "central");
        text.setAttribute("transform", `
          translate(${300 + overlay.offsetX}, ${200 + overlay.offsetY})
          rotate(${overlay.rotation})
        `);
      
        const words = overlay.text.split(' ');
        let lines = [];
        let currentLine = words[0];
      
        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const testLine = currentLine + " " + word;
          const testWidth = testLine.length * (overlay.size / 2); // Rough estimate of text width
          if (testWidth <= overlay.width) {
            currentLine = testLine;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
      
        const lineHeight = overlay.size * 1.2;
        const totalHeight = lines.length * lineHeight;
        const startY = -totalHeight / 2 + lineHeight / 2;
      
        lines.forEach((line, index) => {
          const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
          tspan.setAttribute("x", "0");
          tspan.setAttribute("y", (startY + index * lineHeight).toString());
          tspan.textContent = line;
          text.appendChild(tspan);
        });
      
        overlaysGroup.appendChild(text);
      } else {
        // Handle symbol overlay
        const overlaySymbol = overlaySymbols.find(s => s.value === overlay.shape);
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("font-size", `${overlay.size}px`);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "central");
        text.setAttribute("fill", overlay.color);
        text.setAttribute("transform", `
          translate(${300 + overlay.offsetX}, ${200 + overlay.offsetY})
          rotate(${overlay.rotation})
        `);
        text.textContent = overlaySymbol.unicode;
        overlaysGroup.appendChild(text);
      }
    });

    // Append groups based on starsOnTop
    if (starsOnTop) {
      svg.appendChild(overlaysGroup);
      svg.appendChild(starsGroup);
    } else {
      svg.appendChild(starsGroup);
      svg.appendChild(overlaysGroup);
    }
  
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "eu-flag.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  
  const createBackground = (svg) => {
    switch (selectedPattern) {
      case 'Single':
        createSolidBackground(svg, backColours[0]);
        break;
      case 'Checkered':
        createCheckeredBackground(svg, checkerSize);
        break;
      case 'Sunburst':
        createSunburstBackground(svg);
        break;
      case 'Vertical':
        createVerticalStripes(svg);
        break;
      case 'Horizontal':
        createHorizontalStripes(svg);
        break;
      case 'Cross':
        createCrossBackground(svg);
        break;
      case 'Saltire':
        createSaltireBackground(svg);
        break;
      case 'Quadrants':
        createQuadrantsBackground(svg);
        break;
      case 'Bends':
        createBendsBackground(svg);
        break;
      default:
        createSolidBackground(svg, backColours[0]);
    }
  };
  
  const createSolidBackground = (svg, color) => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", color);
    svg.appendChild(rect);
  };
  
  const createCheckeredBackground = (svg, checkerSize) => {
    const rectSize = 100 / checkerSize;
    for (let i = 0; i < checkerSize; i++) {
      for (let j = 0; j < checkerSize; j++) {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", `${i * rectSize}%`);
        rect.setAttribute("y", `${j * rectSize}%`);
        rect.setAttribute("width", `${rectSize}%`);
        rect.setAttribute("height", `${rectSize}%`);
        rect.setAttribute("fill", (i + j) % 2 === 0 ? backColours[1] : backColours[0]);
        svg.appendChild(rect);
      }
    }
  };
  
  const createSunburstBackground = (svg) => {
    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.sqrt(width * width + height * height) / 2;
  
    for (let i = 0; i < sunburstStripeCount; i++) {
      const startAngle = (i / sunburstStripeCount) * 360;
      const endAngle = ((i + 1) / sunburstStripeCount) * 360;
  
      const startX = centerX + radius * Math.cos(startAngle * Math.PI / 180);
      const startY = centerY + radius * Math.sin(startAngle * Math.PI / 180);
      const endX = centerX + radius * Math.cos(endAngle * Math.PI / 180);
      const endY = centerY + radius * Math.sin(endAngle * Math.PI / 180);
  
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M${centerX},${centerY} L${startX},${startY} A${radius},${radius} 0 0,1 ${endX},${endY} Z`);
      path.setAttribute("fill", backColours[i % backColours.length]);
      svg.appendChild(path);
    }
  };

  const createVerticalStripes = (svg) => {
    const stripeWidth = 600 / stripeCount;
    for (let i = 0; i < stripeCount; i++) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", i * stripeWidth);
      rect.setAttribute("y", "0");
      rect.setAttribute("width", stripeWidth);
      rect.setAttribute("height", "400");
      rect.setAttribute("fill", backColours[i] || backColours[backColours.length - 1]);
      svg.appendChild(rect);
    }
  };
  
  const createHorizontalStripes = (svg) => {
    const stripeHeight = 400 / stripeCount;
    for (let i = 0; i < stripeCount; i++) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", "0");
      rect.setAttribute("y", i * stripeHeight);
      rect.setAttribute("width", "600");
      rect.setAttribute("height", stripeHeight);
      rect.setAttribute("fill", backColours[i] || backColours[backColours.length - 1]);
      svg.appendChild(rect);
    }
  };
  
  const createCrossBackground = (svg) => {
    // Background
    createSolidBackground(svg, backColours[1]);
    
    // Cross
    const crossWidth = 600 * (crossSaltireSize / 100);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M0,200 H600 M300,0 V400`);
    path.setAttribute("stroke", backColours[0]);
    path.setAttribute("stroke-width", crossWidth);
    svg.appendChild(path);
  };
  
  const createSaltireBackground = (svg) => {
    // Background
    createSolidBackground(svg, backColours[1]);
    
    // Saltire
    const saltireWidth = 600 * (crossSaltireSize / 100);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M0,0 L600,400 M0,400 L600,0`);
    path.setAttribute("stroke", backColours[0]);
    path.setAttribute("stroke-width", saltireWidth);
    svg.appendChild(path);
  };
  
  const createQuadrantsBackground = (svg) => {
    const rects = [
      {x: 0, y: 0, color: backColours[3]},
      {x: 300, y: 0, color: backColours[0]},
      {x: 0, y: 200, color: backColours[2]},
      {x: 300, y: 200, color: backColours[1]}
    ];
    rects.forEach(({x, y, color}) => {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", "300");
      rect.setAttribute("height", "200");
      rect.setAttribute("fill", color);
      svg.appendChild(rect);
    });
  };
  
  const createBendsBackground = (svg) => {
    if (selectedAmount === 'Forwards' || selectedAmount === 'Backwards') {
      const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      linearGradient.setAttribute("id", "bendsGradient");
      linearGradient.setAttribute("x1", selectedAmount === 'Forwards' ? "0%" : "100%");
      linearGradient.setAttribute("y1", "0%");
      linearGradient.setAttribute("x2", selectedAmount === 'Forwards' ? "100%" : "0%");
      linearGradient.setAttribute("y2", "100%");
  
      const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop1.setAttribute("offset", "50%");
      stop1.setAttribute("stop-color", backColours[0]);
  
      const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop2.setAttribute("offset", "50%");
      stop2.setAttribute("stop-color", backColours[1]);
  
      linearGradient.appendChild(stop1);
      linearGradient.appendChild(stop2);
  
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      defs.appendChild(linearGradient);
      svg.appendChild(defs);
  
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("width", "100%");
      rect.setAttribute("height", "100%");
      rect.setAttribute("fill", "url(#bendsGradient)");
      svg.appendChild(rect);
    } else if (selectedAmount === 'Both Ways') {
      const width = svg.getAttribute("width");
      const height = svg.getAttribute("height");
  
      const paths = [
        { d: `M0,0 L${width/2},${height/2} L0,${height} Z`, color: backColours[2] }, 
        { d: `M0,0 L${width},0 L${width/2},${height/2} Z`, color: backColours[3] }, 
        { d: `M${width},0 L${width},${height} L${width/2},${height/2} Z`, color: backColours[0] }, 
        { d: `M0,${height} L${width/2},${height/2} L${width},${height} Z`, color: backColours[1] } 
      ];
  
      paths.forEach(({ d, color }) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("fill", color);
        svg.appendChild(path);
      });
    }
  };

  const canDownloadSvg = !customImage && !backgroundImage;

  const handleDownload = () => {
    const starsContainerBackground = document.getElementById('stars-container');
    const starsContainer = document.getElementById('stars-only-container') || document.getElementById('stars-container');
    if (!starsContainer || !starsContainerBackground) {
      console.error('Stars container not found.');
      return;
    }

    const hasBackgroundImage = starsContainerBackground.dataset.hasBackgroundImage === 'true';

    // Setting dimensions of stars container
    const computedStyle = window.getComputedStyle(starsContainerBackground);
    let starsWidth = parseInt(computedStyle.width, 10);
    let starsHeight = parseInt(computedStyle.height, 10);
    // Canvas dimensions -- 2:3 aspect ratio
    const aspectRatio = 3 / 2;
    let canvasWidth, canvasHeight;

    canvasWidth = starsHeight * aspectRatio;
    canvasHeight = starsHeight;

    // New canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (hasBackgroundImage) {
      // Draw background image
      const bgImg = new Image();
      bgImg.onload = function() {
        ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
        drawStars();
      };
      bgImg.src = backgroundImage;
    } else {
      // Draw pattern background
      drawPatternBackground();
      drawStars();
    }

    function drawPatternBackground() {
      const angle = Math.PI / 4; // 50 degrees in radians
      const diagonalLength = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);
      const dx = Math.cos(angle) * diagonalLength - 150;
      const dy = Math.sin(angle) * diagonalLength + 120;

      if (selectedPattern === 'Single') {
        ctx.fillStyle = backColours[0];
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      } else if (selectedPattern === 'Checkered') {
        const horizontalSquareSize = canvasWidth / checkerSize;
        const verticalSquareSize = canvasHeight / checkerSize;
        for (let i = 0; i < checkerSize; i++) {
          for (let j = 0; j < checkerSize; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? backColours[1] : backColours[0];
            ctx.fillRect(
              i * horizontalSquareSize, 
              j * verticalSquareSize, 
              horizontalSquareSize, 
              verticalSquareSize
            );
          }
        }
      } else if (selectedPattern === 'Cross') {
        ctx.fillStyle = backColours[1];
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Cross
        const crossWidth = Math.min(canvasWidth, canvasHeight) * 0.109;
        drawCross(ctx, 0, 0, canvasWidth, canvasHeight, crossWidth);
      } else if (selectedPattern === 'Saltire') {
        ctx.fillStyle = backColours[1];
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
        // Saltire
        ctx.strokeStyle = backColours[0];
        const saltireWidth = canvasWidth * 0.1;
        ctx.lineWidth = saltireWidth;
      
        // Draw the saltire using a custom function
        drawSaltire(ctx, 0, 0, canvasWidth, canvasHeight, saltireWidth);
      } else if (selectedPattern === 'Quadrants') {
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
      } else if (selectedPattern === 'Bends') {
        if (selectedAmount === 'Forwards') {
          const gradient = ctx.createLinearGradient(-50, -50, dx, dy);
          gradient.addColorStop(0, backColours[0]);
          gradient.addColorStop(0.5, backColours[0]);
          gradient.addColorStop(0.5, backColours[1]);
          gradient.addColorStop(1, backColours[1]);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        } else if (selectedAmount === 'Backwards') {
          const gradient = ctx.createLinearGradient(canvasWidth, -30, canvasWidth - dx, dy - 50);
          gradient.addColorStop(0, backColours[0]);
          gradient.addColorStop(0.5, backColours[0]);
          gradient.addColorStop(0.5, backColours[1]);
          gradient.addColorStop(1, backColours[1]);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        } else if (selectedAmount === 'Both Ways') {
          const centerX = canvasWidth / 2;
          const centerY = canvasHeight / 2;
          const gradient = ctx.createConicGradient((Math.PI / 4), centerX, centerY);
          gradient.addColorStop(0, backColours[1]);
          gradient.addColorStop(0.25, backColours[1]);
          gradient.addColorStop(0.25, backColours[2]);
          gradient.addColorStop(0.5, backColours[2]);
          gradient.addColorStop(0.5, backColours[3]);
          gradient.addColorStop(0.75, backColours[3]);
          gradient.addColorStop(0.75, backColours[0]);
          gradient.addColorStop(1, backColours[0]);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
      } else if (selectedPattern === 'Vertical') {
        const stripeWidth = canvasWidth / stripeCount;
        for (let i = 0; i < stripeCount; i++) {
          ctx.fillStyle = backColours[i] || backColours[backColours.length - 1];
          ctx.fillRect(i * stripeWidth, 0, stripeWidth, canvasHeight);
        }
      } else if (selectedPattern === 'Horizontal') {
        const stripeHeight = canvasHeight / stripeCount;
        for (let i = 0; i < stripeCount; i++) {
          ctx.fillStyle = backColours[i] || backColours[backColours.length - 1];
          ctx.fillRect(0, i * stripeHeight, canvasWidth, stripeHeight);
        }
      } else if (selectedPattern === 'Sunburst') {
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const radius = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight) / 2;
    
        for (let i = 0; i < sunburstStripeCount; i++) {
          const startAngle = (i / sunburstStripeCount) * Math.PI * 2;
          const endAngle = ((i + 1) / sunburstStripeCount) * Math.PI * 2;
    
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, startAngle, endAngle);
          ctx.closePath();
    
          ctx.fillStyle = backColours[i % backColours.length];
          ctx.fill();
        }
      }
    }

    function drawOverlays() {
      const sortedOverlays = sortOverlays(overlays);
      sortedOverlays.forEach((overlay) => {
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.translate(overlay.offsetX, overlay.offsetY);
        ctx.rotate(overlay.rotation * Math.PI / 180);
    
        if (overlay.type === 'text') {
          // Handle text overlay
          ctx.font = `${overlay.size}px ${overlay.font}`;
          ctx.fillStyle = overlay.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
    
          // Calculate text lines and total height
          const lines = calculateTextLines(ctx, overlay.text, overlay.width);
          const totalHeight = lines.length * overlay.size * 1.2;
    
          // Adjust starting Y position to center the text block
          let startY = -totalHeight / 2;
    
          // Draw each line of text
          lines.forEach((line, index) => {
            ctx.fillText(line, 0, startY + (index + 0.5) * overlay.size * 1.2);
          });
        } else {
          // Handle symbol overlay (unchanged)
          const overlaySymbol = overlaySymbols.find(s => s.value === overlay.shape);
          if (overlaySymbol) {
            ctx.font = `${overlay.size}px Arial`;
            ctx.fillStyle = overlay.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(overlaySymbol.unicode, 0, 0);
          }
        }
        ctx.restore();
      });
    }
    
    function calculateTextLines(context, text, maxWidth) {
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];
    
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }

    function drawStars() {
      htmlToImage.toPng(starsContainer)
      .then(function (starsDataUrl) {
        const starsImg = new Image();
        starsImg.onload = function () {
          const offsetX = (canvasWidth - starsWidth) / 2;
          const offsetY = (canvasHeight - starsHeight) / 2;
    
          // Apply rotation if 'square'
          if (containerFormat === 'square') {
            ctx.save();
            ctx.translate(canvasWidth / 2, canvasHeight / 2);
            ctx.rotate(gridRotation * Math.PI / 180);
            ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
          }
    
          ctx.drawImage(starsImg, offsetX, offsetY, starsWidth, starsHeight);
    
          // Restore canvas state if rotation was applied
          if (containerFormat === 'square') {
            ctx.restore();
          }
    
          // Draw overlays or stars based on starsOnTop
          if (starsOnTop) {
            drawOverlays();
            ctx.drawImage(starsImg, offsetX, offsetY, starsWidth, starsHeight);
          } else {
            ctx.drawImage(starsImg, offsetX, offsetY, starsWidth, starsHeight);
            drawOverlays();
          }
    
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
    }

    setButtonClicked(true);
  };

  return (
    <div>
      <div className="download-button-container">
        <button className="download-button" onClick={handleDownload}>
          <FontAwesomeIcon icon={faDownload} className="download-icon" />
          Export PNG
        </button>
        {canDownloadSvg && (
          <button className="download-button svg-button" onClick={handleSvgDownload}>
            <FontAwesomeIcon icon={faFileExport} className="download-icon" />
            Export SVG
          </button>
        )}
      </div>
      {buttonClicked && (
        <div className="flag-text">
          <p><a href="https://krikienoid.github.io/flagwaver/" target="_blank" rel="noopener noreferrer">Wave the Flag!</a></p>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;