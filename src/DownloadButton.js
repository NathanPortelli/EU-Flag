import React, { useState } from 'react';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileExport } from '@fortawesome/free-solid-svg-icons';
import './styles/DownloadButton.css';
import { overlaySymbols } from './components/OverlaySymbols';
import Tooltip from './components/Tooltip';

const DownloadButton = ({ backColours, selectedPattern, selectedAmount, backgroundImage, customImage, overlays, stripeCount, crossSaltireSize, containerFormat, gridRotation, starsOnTop, checkerSize, sunburstStripeCount, borderWidth, stripeWidth }) => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const canDownloadSvg = !customImage && !backgroundImage;

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

    setButtonClicked(true);
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
      case 'Border':
        createBorderBackground(svg);
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

  const createBorderBackground = (svg) => {
    // Main background rectangle
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", backColours[1]);
    svg.appendChild(rect);
  
    // Border rectangle
    const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    border.setAttribute("x", "0");
    border.setAttribute("y", "0");
    border.setAttribute("width", "100%");
    border.setAttribute("height", "100%");
    border.setAttribute("fill", "none");
    border.setAttribute("stroke", backColours[0] || "#000000");
    border.setAttribute("stroke-width", borderWidth);
    svg.appendChild(border);
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
      svg.appendChild(defs);
  
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("width", "100%");
      rect.setAttribute("height", "100%");
      rect.setAttribute("fill", "url(#bendsGradient)");
      svg.appendChild(rect);
    }
  };

  return (
    <div className="download-segment">
      <h2>Download</h2>
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