import React, { useState } from 'react';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileExport } from '@fortawesome/free-solid-svg-icons';
import './styles/DownloadButton.css';
import { overlaySymbols } from './components/OverlaySymbols';
import Tooltip from './components/Tooltip';

const DownloadButton = ({ backColours, selectedPattern, selectedAmount, backgroundImage, customImage, overlays, stripeCount, crossSaltireSize, containerFormat, gridRotation, starsOnTop, checkerSize, sunburstStripeCount, borderWidth, stripeWidth, seychellesStripeCount, crossVerticalOffset, crossHorizontalOffset }) => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const canDownloadSvg = !overlays.some(overlay => overlay.type === 'image') && !customImage && !backgroundImage;

  // PNG DOWNLOAD

  const handlePngDownload = () => {
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) {
      console.error('Stars container not found.');
      return;
    }

    htmlToImage.toPng(starsContainer, { quality: 1 })
    .then(function (dataUrl) {
      download(dataUrl, 'eu-flag.png');
    })
    .catch(function (error) {
      console.error('Error generating PNG:', error);
    });

    setButtonClicked(true);
  };

  // SVG DOWNLOAD

  const sortOverlays = (overlays) => {
    return [...overlays].sort((a, b) => overlays.indexOf(b) - overlays.indexOf(a));
  };

  // For Text Overlay
  const wrapText = (text, fontSize, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
  
    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = getTextWidth(testLine, fontSize);
  
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
  
    if (currentLine) {
      lines.push(currentLine);
    }
  
    return lines;
  };
  
  const getTextWidth = (text, fontSize) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${fontSize}px Arial`;
    return context.measureText(text).width;
  };

  // SVG
  
  const handleSvgDownload = () => {
    const starsContainer = document.getElementById('stars-container');
    const starsOnlyContainer = document.getElementById('stars-only-container') || document.getElementById('stars-container');
    if (!starsContainer || !starsOnlyContainer) {
      console.error('Stars container not found.');
      return;
    }
  
    // Create SVG element with appropriate dimensions and viewBox
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    // Set dimensions and viewBox based on containerFormat
    let width, height, viewBox;
    switch (containerFormat) {
      case 'flag':
        width = 600;
        height = 400;
        viewBox = "0 0 600 400";
        break;
      case 'guidon':
        width = 600;
        height = 400;
        viewBox = "0 0 600 400";
        break;
      case 'flag-1-2':
        width = 600;
        height = 300;
        viewBox = "0 0 600 300";
        break;
      case 'square-flag':
        width = 400;
        height = 400;
        viewBox = "0 0 400 400";
        break;
      case 'circle':
        width = 400;
        height = 400;
        viewBox = "0 0 400 400";
        break;
      case 'ohio':
        width = 600;
        height = 400;
        viewBox = "0 0 600 400";
        break;
      case 'shield':
        width = 500;
        height = 600;
        viewBox = "0 0 500 600";
        break;
      case 'pennant':
        width = 600;
        height = 400;
        viewBox = "0 0 600 400";
        break;
      default:
        width = 600;
        height = 400;
        viewBox = "0 0 600 400";
    }

    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    svg.setAttribute("viewBox", viewBox);

    // Create a clipping path or shape for non-rectangular formats
    if (['guidon', 'ohio', 'shield', 'pennant', 'circle'].includes(containerFormat)) {
      const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
      clipPath.setAttribute("id", "flagShape");
  
      let shape;
      switch (containerFormat) {
        case 'guidon':
          shape = `M 0 0 L 600 0 L 601 0 L 450 200 L 601 403 L 600 400 L 0 400 Z`;
          break;
        case 'ohio':
          shape = `M0,0 L${width},${height * 0.2} L${width * 0.75},${height * 0.5} L${width},${height * 0.8} L0,${height} Z`;
          break;
        case 'shield':
          shape = `M0,0 L${width},0 L${width},${height * 0.68} L${width / 2},${height} L0,${height * 0.72} Z`;
          break;
        case 'pennant':
          shape = `M0,0 L${width},${height / 2} L0,${height} Z`;
          break;
        case 'circle':
          shape = `M${width / 2},${height / 2} m-${width / 2},0 a${width / 2},${height / 2} 0 1,0 ${width},0 a${width / 2},${height / 2} 0 1,0 -${width},0`;
          break;
        default:
          break;
      }
  
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", shape);
      clipPath.appendChild(path);
      svg.appendChild(clipPath);
    }

    const flagContent = document.createElementNS("http://www.w3.org/2000/svg", "g");
    if (['guidon', 'ohio', 'shield', 'pennant', 'circle'].includes(containerFormat)) {
      flagContent.setAttribute("clip-path", "url(#flagShape)");
    }

    createBackground(flagContent);

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
        const textGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const id = `curve-${index}`;
        const width = overlay.width;
        const height = overlay.size * 4;
        const curveAmount = overlay.textCurve * 0.5;
        const verticalOffset = Math.abs(curveAmount) / 2;
  
        // Wrap text based on width
        const wrappedText = wrapText(overlay.text, overlay.size, width);
  
        wrappedText.forEach((line, lineIndex) => {
          const yOffset = (lineIndex - (wrappedText.length - 1) / 2) * overlay.size;
          
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("id", `${id}-${lineIndex}`);
          path.setAttribute("d", `M0,${height / 2 + verticalOffset + yOffset} Q${width / 2},${height / 2 + curveAmount + yOffset} ${width},${height / 2 + verticalOffset + yOffset}`);
          path.setAttribute("fill", "none");
          textGroup.appendChild(path);
  
          const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          text.setAttribute("font-size", `${overlay.size}px`);
          text.setAttribute("font-family", overlay.font);
          text.setAttribute("fill", overlay.color);
  
          const textPath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
          textPath.setAttribute("href", `#${id}-${lineIndex}`);
          textPath.setAttribute("startOffset", "50%");
          textPath.setAttribute("text-anchor", "middle");
          textPath.textContent = line;
  
          text.appendChild(textPath);
          textGroup.appendChild(text);
        });
  
        textGroup.setAttribute("transform", `
          translate(${300 + overlay.offsetX - width / 2}, ${200 + overlay.offsetY - height / 2})
          rotate(${overlay.rotation})
        `);
  
        overlaysGroup.appendChild(textGroup);
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
      flagContent.appendChild(overlaysGroup);
      flagContent.appendChild(starsGroup);
    } else {
      flagContent.appendChild(starsGroup);
      flagContent.appendChild(overlaysGroup);
    }    

    svg.appendChild(flagContent);

    // Generate and download SVG
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "flag.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  
    setButtonClicked(true);
  };
  
  const createBackground = (parent) => {
    switch (selectedPattern) {
      case 'Single':
        createSolidBackground(parent, backColours[0]);
        break;
      case 'Seychelles':
        createSeychellesBackground(parent);
        break;
      case 'Checkered':
        createCheckeredBackground(parent, checkerSize);
        break;
      case 'Sunburst':
        createSunburstBackground(parent);
        break;
      case 'Border':
        createBorderBackground(parent);
        break;
      case 'Vertical':
        createVerticalStripes(parent);
        break;
      case 'Horizontal':
        createHorizontalStripes(parent);
        break;
      case 'Cross':
        createCrossBackground(parent);
        break;
      case 'Saltire':
        createSaltireBackground(parent);
        break;
      case 'Quadrants':
        createQuadrantsBackground(parent);
        break;
      case 'Bends':
        createBendsBackground(parent);
        break;
      default:
        createSolidBackground(parent, backColours[0]);
        break;
    }
  };
  
  const createSolidBackground = (parent, color) => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", color);
    parent.appendChild(rect);
  };
  
  const createCheckeredBackground = (parent, checkerSize) => {
    const rectSize = 100 / checkerSize;
    for (let i = 0; i < checkerSize; i++) {
      for (let j = 0; j < checkerSize; j++) {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", `${i * rectSize}%`);
        rect.setAttribute("y", `${j * rectSize}%`);
        rect.setAttribute("width", `${rectSize}%`);
        rect.setAttribute("height", `${rectSize}%`);
        rect.setAttribute("fill", (i + j) % 2 === 0 ? backColours[1] : backColours[0]);
        parent.appendChild(rect);
      }
    }
  };
  
  const createSunburstBackground = (parent) => {
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
      parent.appendChild(path);
    }
  };

  const createSeychellesBackground = (parent) => {
    const width = 600;
    const height = 400;
    const angleStep = 90 / seychellesStripeCount;
  
    for (let i = 0; i < seychellesStripeCount; i++) {
      const startAngle = i * angleStep;
      const endAngle = (i + 1) * angleStep;
      const color = backColours[i % backColours.length];
  
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", getSeychellesPath(startAngle, endAngle, width, height));
      path.setAttribute("fill", color);
      parent.appendChild(path);
    }
  };
  
  const getSeychellesPath = (startAngle, endAngle, width, height) => {
    const startX = width * Math.tan(startAngle * Math.PI / 180);
    const endX = width * Math.tan(endAngle * Math.PI / 180);
  
    return `
      M 0 ${height}
      L ${startX} 0
      L ${endX} 0
      L 0 ${height}
      Z
    `;
  };

  const createVerticalStripes = (parent) => {
    const stripeWidth = 600 / stripeCount;
    for (let i = 0; i < stripeCount; i++) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", i * stripeWidth);
      rect.setAttribute("y", "0");
      rect.setAttribute("width", stripeWidth);
      rect.setAttribute("height", "400");
      rect.setAttribute("fill", backColours[i] || backColours[backColours.length - 1]);
      parent.appendChild(rect);
    }
  };
  
  const createHorizontalStripes = (parent) => {
    const stripeHeight = 400 / stripeCount;
    for (let i = 0; i < stripeCount; i++) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", "0");
      rect.setAttribute("y", i * stripeHeight);
      rect.setAttribute("width", "600");
      rect.setAttribute("height", stripeHeight);
      rect.setAttribute("fill", backColours[i] || backColours[backColours.length - 1]);
      parent.appendChild(rect);
    }
  };

  const createBorderBackground = (parent) => {
    // Main background rectangle
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", backColours[1]);
    parent.appendChild(rect);
  
    // Border rectangle
    const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    border.setAttribute("x", "0");
    border.setAttribute("y", "0");
    border.setAttribute("width", "100%");
    border.setAttribute("height", "100%");
    border.setAttribute("fill", "none");
    border.setAttribute("stroke", backColours[0] || "#000000");
    border.setAttribute("stroke-width", borderWidth);
    parent.appendChild(border);
  };
  
    const createCrossBackground = (parent) => {
      // Background
      createSolidBackground(parent, backColours[1]);
      
      // Cross
      const crossWidth = 600 * (crossSaltireSize / 100);
      const horizontalOffset = 300 * (crossHorizontalOffset / 100) * 2.5;
      const verticalOffset = 200 * (crossVerticalOffset / 100) * 1.5;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M0,${200 - verticalOffset} H600 M${300 - horizontalOffset},0 V400`);
      path.setAttribute("stroke", backColours[0]);
      path.setAttribute("stroke-width", crossWidth);
      parent.appendChild(path);
  };

  
  const createSaltireBackground = (parent) => {
    // Background
    createSolidBackground(parent, backColours[1]);
    
    // Saltire
    const saltireWidth = 600 * (crossSaltireSize / 100);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M0,0 L600,400 M0,400 L600,0`);
    path.setAttribute("stroke", backColours[0]);
    path.setAttribute("stroke-width", saltireWidth);
    parent.appendChild(path);
  };
  
  const createQuadrantsBackground = (parent) => {
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
      parent.appendChild(rect);
    });
  };
  
  const createBendsBackground = (parent) => {
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
      parent.appendChild(defs);
  
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("width", "100%");
      rect.setAttribute("height", "100%");
      rect.setAttribute("fill", "url(#bendsGradient)");
      parent.appendChild(rect);
    } else if (selectedAmount === 'Both Ways') {
      const width = parent.getAttribute("width");
      const height = parent.getAttribute("height");
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
        parent.appendChild(path);
      });
    } else if (selectedAmount === 'Forward Stripe' || selectedAmount === 'Backward Stripe') {
      const isForward = selectedAmount === 'Forward Stripe';
      const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      linearGradient.setAttribute("id", "bendsGradient");
      linearGradient.setAttribute("x1", isForward ? "0%" : "100%");
      linearGradient.setAttribute("y1", "0%");
      linearGradient.setAttribute("x2", isForward ? "100%" : "0%");
      linearGradient.setAttribute("y2", "100%");
  
      const stripeWidthRatio = stripeWidth / Math.sqrt(600 * 600 + 400 * 400);
  
      const stops = [
        { offset: "0%", color: backColours[0] },
        { offset: `${50 - (stripeWidthRatio * 50)}%`, color: backColours[0] },
        { offset: `${50 - (stripeWidthRatio * 50)}%`, color: backColours[2] },
        { offset: `${50 + (stripeWidthRatio * 50)}%`, color: backColours[2] },
        { offset: `${50 + (stripeWidthRatio * 50)}%`, color: backColours[1] },
        { offset: "100%", color: backColours[1] }
      ];
  
      stops.forEach(stop => {
        const stopElement = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stopElement.setAttribute("offset", stop.offset);
        stopElement.setAttribute("stop-color", stop.color);
        linearGradient.appendChild(stopElement);
      });
  
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      defs.appendChild(linearGradient);
      parent.appendChild(defs);
  
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("width", "100%");
      rect.setAttribute("height", "100%");
      rect.setAttribute("fill", "url(#bendsGradient)");
      parent.appendChild(rect);
    }
  };

  return (
    <div className="download-segment">
      <h1 className='quiz-controls-title'>Download</h1>
      <div className="download-button-container">
        <Tooltip text="Set configuration to 'Circle' or 'Flag' based on your preferred output.">
          <button className="download-button" onClick={handlePngDownload}>
            <FontAwesomeIcon icon={faDownload} className="download-icon" />
            Export PNG
          </button>
        </Tooltip>
        {canDownloadSvg && (
          <Tooltip text="SVG output may not exactly match the displayed flag.">
            <button className="download-button svg-button" onClick={handleSvgDownload}>
              <FontAwesomeIcon icon={faFileExport} className="download-icon" />
              Export SVG
            </button>
          </Tooltip>
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