import React, { useState } from 'react';
import Divider from './Divider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileExport } from '@fortawesome/free-solid-svg-icons';

const UserGuide = () => {
  const [activeTab, setActiveTab] = useState('modes');
  const [subMenuOpen, setSubMenuOpen] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // setSubMenuOpen(subMenuOpen === null);
  };

  const handleSubMenuClick = (subMenu) => {
    setActiveTab(subMenu);
    setSubMenuOpen(subMenuOpen === subMenu ? null : subMenu);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="user-guide-popup">
      <button className="menu-icon" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button
          className={`sidebar-btn ${activeTab === 'modes' ? 'active' : ''}`}
          onClick={() => handleTabClick('modes')}
        >
          Modes
        </button>
        <button
          className={`sidebar-btn ${activeTab === 'designer' ? 'active' : ''}`}
          onClick={() => handleSubMenuClick('designer')}
        >
          Designer
        </button>
        {subMenuOpen === 'designer' && (
          <div className="submenu">
            <button
              className={`submenu-btn ${activeTab === 'format' ? 'active' : ''}`}
              onClick={() => handleTabClick('format')}
            >
              Format
            </button>
            <button
              className={`submenu-btn ${activeTab === 'shape' ? 'active' : ''}`}
              onClick={() => handleTabClick('shape')}
            >
              Shape
            </button>
            <button
              className={`submenu-btn ${activeTab === 'overlays' ? 'active' : ''}`}
              onClick={() => handleTabClick('overlays')}
            >
              Overlays
            </button>
            <button
              className={`submenu-btn ${activeTab === 'background' ? 'active' : ''}`}
              onClick={() => handleTabClick('background')}
            >
              Background
            </button>
            <button
              className={`submenu-btn ${activeTab === 'header' ? 'active' : ''}`}
              onClick={() => handleTabClick('header')}
            >
              Header
            </button>
            <button
              className={`submenu-btn ${activeTab === 'download' ? 'active' : ''}`}
              onClick={() => handleTabClick('download')}
            >
              Download
            </button>
            <button
              className={`submenu-btn ${activeTab === 'other' ? 'active' : ''}`}
              onClick={() => handleTabClick('other')}
            >
              Other
            </button>
          </div>
        )}
        <button
          className={`sidebar-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => handleSubMenuClick('quiz')}
        >
          Quiz
        </button>
        {subMenuOpen === 'quiz' && (
          <div className="submenu">
            <button
              className={`submenu-btn ${activeTab === 'quiz-settings' ? 'active' : ''}`}
              onClick={() => handleTabClick('quiz-settings')}
            >
              Settings
            </button>
          </div>
        )}
        <button
          className={`sidebar-btn ${activeTab === 'flag-list' ? 'active' : ''}`}
          onClick={() => handleSubMenuClick('flag-list')}
        >
          Flag List
        </button>
        {subMenuOpen === 'flag-list' && (
          <div className="submenu">
            <button
              className={`submenu-btn ${activeTab === 'flag-filters' ? 'active' : ''}`}
              onClick={() => handleTabClick('flag-filters')}
            >
              Filters
            </button>
          </div>
        )}
        <button
          className={`sidebar-btn ${subMenuOpen === 'online' ? 'active' : ''}`}
          onClick={() => handleSubMenuClick('online')}
        >
          Online
        </button>
        {subMenuOpen === 'online' && (
          <div className="submenu">
            <button
              className={`submenu-btn ${activeTab === 'online-upload' ? 'active' : ''}`}
              onClick={() => handleTabClick('online-upload')}
            >
              Share
            </button>
            <button
              className={`submenu-btn ${activeTab === 'online-list' ? 'active' : ''}`}
              onClick={() => handleTabClick('online-list')}
            >
              List
            </button>
          </div>
        )}
      </div>

      <div className="content">
        {activeTab === 'modes' && <div>
          <h1>Modes</h1>
          <Divider />
          <p><b><i>Designer:</i></b> This is the core area of the site where you can design your flag.</p>
          <br />
          <p><b><i>Quiz:</i></b> A random flag from the 'Flag List' will appear, to which you need to guess the associated country/city/group associated with the flag. Several settings are available to make the quiz more challenging, including the toggling of the amount of options, and a timer.</p>
          <br />
          <p><b><i>Flag List:</i></b> A list of flags manually created by yours truly, made to resemble the actual flags as closely as possible with the limitations of this web app. The list contains over 700 current and historical flags of countries, cities, provinces and groups from all over the world.</p>
          <br />
          <p><b><i>Online:</i></b> Similar to 'Flag List', however these are created and shared by anyone.</p>
          <Divider />
          <p>Click on the 📋 icon in the <b>Footer</b> to get the list of every update as well as planned additions. For any suggestions/issues, contact me via <a href='https://x.com/NathPortelli' target="_blank" rel="noopener noreferrer">Twitter/X</a> or <a href="mailto:portellinathan@yahoo.com" target="_blank" rel="noopener noreferrer">email</a>.</p>
        </div>}

        {activeTab === 'designer' && <div>
          <h1>Designer</h1>
          <Divider />
          <p>This is the core workspace where you can design your flag. It consists of two sub-sections:</p>
          <li className="guide-list"><b><i>Flag Canvas</i></b>: This is where your flag is displayed. You can see the real-time application of the changes you make to the various design options. Underneath this area there are also options to choose the overall layout/shape of your flag (such as a circle, rectangle, pennant etc.), pick from a list of pre-created flags, the ability to randomise every design option, and a way to share your flag to the <b>Online</b> section of the site.</li>
          <li className="guide-list"><b><i>Design Options</i></b>: This is where you can configure the various design elements of your flag. The options are divided into the following sections:</li>
          <Divider />
          The <b>Design Option</b> section is further sub-divided as follows:
          <li className="guide-list"><b><i>Format</i></b>: This section allows you to change the positioning of the fixed shapes on your flag.</li>
          <li className="guide-list"><b><i>Shape</i></b>: This section allows you to select the shapes that will be displayed on your flag.</li>
          <li className="guide-list"><b><i>Overlays</i></b>: This section lets you add additional design elements apart from the flag background and/or shapes.</li>
          <li className="guide-list"><b><i>Background</i></b>: This section allows you to set the background pattern, colour or image for your flag.</li>
        </div>}

        {activeTab === 'format' && <div>
          <h1>Format</h1>
          <Divider />  
          <p>The <b><i>Format</i></b> tab allows you to change the positioning of the fixed shapes on your flag.</p> 
          <br />
          <b><i>Configuration</i></b>
          <p>By default, these fixed shapes are set to the <i>EU Format</i>, meaning that they are in a circular form. A <i>USA Format</i> is also available, which just changes the configuration of the shapes into a rectangle.</p>
          <Divider />
          <b><i>Sliders</i></b>
          <p>Move the slider left or right to change the amount for each slider. Alternatively, you can simply click on the number to write a value. They have a minimum and maximum limit, which varies according to what they're representing.</p>
          <br />
          <li className="guide-list"><b><i>Shapes</i></b>: This sets the amount of shapes on your flag. To get rid of all shapes, just set this to <b>0</b>. The maximum amount of possible shapes is <b>50</b>.</li>
          <li className="guide-list"><b><i>Circle</i></b>: Only available for the <b>EU Format</b>. This allows you to add additional circles within the circle, up to a maximum of <b>3</b> circles.</li>
          <li className="guide-list"><b><i>Rotate (🗘)</i></b>:  This allows you to rotate the circle/rectangle configuration. To rotate the shapes themselves, refer to the <i>Shape</i> section of this guide.</li>
          <li className="guide-list"><b><i>Spacing (↔)</i></b>: This sets the total spacing/size between the shapes for both the EU/USA configurations.</li>
        </div>}

        {activeTab === 'shape' && <div>
          <h1>Shape</h1>
          <Divider />    
          <p>This section allows you to select the shapes that will be displayed on your flag. You can choose from various built-in shapes, upload your own custom image, or define a custom SVG path. You can also configure the colour, size, rotation, and other properties of the shapes.</p>
          <br /> 
          <p>These shapes were added to provide a simpler method of adding uniform items on the flag without having to duplicate and move a bunch of overlay items.</p>
          <Divider />
          <b><i>Upload an Image</i></b>
          <p>Click on the <i>Upload Image</i> button to select an image from your device. The image will be displayed on the flag canvas, and you can adjust its properties same as any shape item, apart from changing its colour, or setting the Outline/Filled toggle.</p>
          <br />
          <p>Please note that you the maximum image size is limited to <b>1MB</b>, and that you cannot export your flag in a <b>SVG</b> format if you have an image on the flag.</p>
          <br />
          <p>To remove the image and reset to the previously set shape, click the <b>🗑</b> icon.</p>
          <Divider />
          <b><i>Shape</i></b>
          <p>Click on the <i>Shape</i> dropdown to select a shape to add to the flag. Some of the available shapes are:</p>
          <li className="guide-list">Star (Default)</li>
          <li className="guide-list">Circle</li>
          <li className="guide-list">Square</li>
          <li className="guide-list">Shield</li>
          <li className="guide-list">Hexagon etc.</li>
          <br />
          <p>If you would like to create your own symbol, simply create a <b>SVG Path</b> of the shape/symbol into the input box underneath the dropdown, and click the <b>→</b> button.</p>
          <br />
          <p>Check out <a href='https://yqnn.github.io/svg-path-editor/' target="_blank" rel="noopener noreferrer">this tool</a> to create these SVG Paths.</p>
          <Divider />
          <b><i>Colour</i></b>
          <p>Click on the colour box to select a colour for the shape. You can also enter a colour code in its input box, depending on the browser you're on. This option is not available if you're using images instead of shapes.</p>   
          <Divider />
          <b><i>Toggles</i></b>
          <li className="guide-list"><b><i>Pointing Up/Outward</i></b>: When set to <b>Pointing Up</b> (default), all shapes will be facing the same direction. When set to <b>Pointing Outward</b>, all shapes will be facing away from the center of the flag.</li>
          <li className="guide-list"><b><i>Filled/Outline</i></b>: This toggle allows you to change the shape from being a filled shape to an outlined shape, or vice versa. When set to <b>Outline</b>, the inside of the shape will be transparent. This toggle is not available if you're using images instead of shapes.</li>
          <Divider />
          <b><i>Sliders</i></b>
          <p>Move the slider left or right to change the amount for each slider. Alternatively, you can simply click on the number to write a value. They have a minimum and maximum limit, which varies according to what they're representing.</p>
          <br />
          <li className="guide-list"><b><i>Size (✥)</i></b>: This sets the size of the shape. The minimum size is <b>10px</b> while the maximum is <b>400px</b>.</li>
          <li className="guide-list"><b><i>Rotate (🗘)</i></b>: his allows you to simultaneously rotate the shapes in any direction. To rotate the configuration itself, refer to the <i>Format</i> section of this guide.</li>
        </div>}

        {activeTab === 'overlays' && <div>
          <h1>Overlays</h1>
          <Divider />    
          <p>This section lets you add additional design elements apart from the flag background and/or shapes. You can add text, images, or unicode symbols as overlays. When adding a new overlay, the symbols/colours are randomised.</p>
          <br />
          <b><i>Shapes Under/On Top</i></b>
          <p>This toggle allows you to place the configured shapes on top of, or underneath, all overlays you place on your flag.</p> 
          <br />
          <b><i>General Settings</i></b>
          <li className="guide-list"><b><i>Overlay Colour</i></b>: Click on the colour box to select a colour for the overlay. You can also enter a colour code in its input box, depending on the browser you're on.</li>
          <li className="guide-list"><b><i>Move Up/Down (↕)</i></b>: Reposition the overlay up or down by moving the slider left to move upward, or to the right to move downward. You can also write a value between <b>-350</b> (top) and <b>350</b> (bottom) in the text box instead of moving the slider.</li>
          <li className="guide-list"><b><i>Move Left/Right (↔)</i></b>: Reposition the overlay left or right by moving the slider is that direction. You can also write a value between <b>-350</b> (left) and <b>350</b> (right) in the text box instead of moving the slider.</li>
          <li className="guide-list"><b><i>Size (✥)</i></b>: This sets the size of the overlay. The minimum size is <b>10</b> while the maximum is <b>999</b>.</li>
          <li className="guide-list"><b><i>Rotate (🗘)</i></b>: This allows you to rotate the overlay in any direction.</li>
          <li className="guide-list"><b><i>Clone (🗐)</i></b>: This button next to the overlay type input allows you to duplicate the current overlay to a newly created exact replica, containing the exact same content and parameter values.</li>
          <li className="guide-list"><b><i>Remove (🗑)</i></b>: This button allows you to remove the overlay from the flag.</li>
          <li className="guide-list"><b><i>Relayer (↑ or ↓)</i></b>: These buttons to the left of the overlay type input allow you to relayer the overlays to determine which overlay goes on top/under other overlays. The overlays on top of the list will go underneath other overlays, while those at the bottom of the list are listed on top. To change the layer of a particular overlay, click the <b>↑</b> or <b>↓</b> buttons depending on where you want to position it. The overlays at the very top/bottom have a different button which looks like <b>⤶</b>. This will move the overlay from the bottom to the very top, or vice-versa.</li>
          <Divider />
          <b><i>Overlay Types</i></b>
          <li className="guide-list"><b><i>Overlays</i></b>: Click on the <b>New Overlay</b> button to add a new unicode symbol onto the flag. There are over 100 available unicode symbols from which you can choose from by clicking on the dropdown menu, which also shows you a preview of the symbol on the left.</li>
          <li className="guide-list"><b><i>Text</i></b>: Click on the <b>New Text</b> button to add a new text box onto the flag.</li>
          <li className="guide-list"><b><i>Image</i></b>: Click on the <b>New Image</b> button to add a free-moving image onto the flag. By default, this will contain no image and will just say "Overlay". Click on the <b>Upload Image</b> button to select an image from your device. The image will be displayed on the flag canvas, and you can adjust its properties same as any shape item, apart from changing its colour. To change the image to something else, simply re-click on the button, which is now named <b>Change Image</b>. To delete the uploaded image without selecting a new image, click on the <b>🗑</b> button.</li>
          <Divider />
          <b><i>Text Settings</i></b>
          <p>When selecting a Text Overlay, two additional settings are available;</p>
          <li className="guide-list"><b><i>Text Width</i></b>: Allows you to set how large you'd like the width of the text box to be.</li>
          <li className="guide-list"><b><i>Text Curve</i></b>: Allows you to curve the text upward (up to <b>-200</b>) or downward (up to <b>200</b>). This curve is linked to the set text width, so if you'd like a more/less extreme curve, be sure to also mess around with the text width slider.</li>
        </div>}

        {activeTab === 'background' && <div>
          <h1>Background</h1>
          <Divider />  
          <p>This section allows you to set the background pattern, colour or image for your flag.</p>
          <br />  
          <b><i>Upload an Image</i></b>
          <p>Click on the <i>Upload Image</i> button to select an image from your device. The image will be displayed on the flag canvas, and you can adjust its properties same as any shape item, apart from changing its colour, or setting the Outline/Filled toggle.</p>
          <br />
          <p>Please note that you the maximum image size is limited to <b>1MB</b>, and that you cannot export your flag in a <b>SVG</b> format if you have an image on the flag.</p>
          <br />
          <p>To remove the image and reset to the previously set shape, click the <b>🗑</b> icon.</p>
          <Divider />
          <b><i>Patterns</i></b>
          <p>Click on the <i>Pattern</i> dropdown to select a pattern to add to the flag. The available patterns are:</p>
          <li className="guide-list"><b><i>Single (Default)</i></b>: A single coloured background, with no patterns or style.</li>
          <li className="guide-list"><b><i>Horizontal Stripes</i></b>: Horizontal Stripes with the amount ranging between <b>2</b> to <b>16</b> stripes, which can be set through the newly-appearing slider underneath the patterns dropdown. Each stripe can be set to a unique colour.</li>
          <li className="guide-list"><b><i>Vertical Stripes</i></b>: Same as Horizontal Stripes, but vertical instead.</li>
          <li className="guide-list"><b><i>Checkered</i></b>: A pattern with alternating squares in two different colours, forming a grid-like appearance. The size of the squares can be adjusted using the <i>Checker Size</i> slider, which appears once this pattern is selected.</li>
          <li className="guide-list"><b><i>Bends</i></b>: A pattern featuring diagonal lines, either going Forwards (/), Backwards (\), or Both Ways (𝕏), crossing the flag from one corner to the opposite. The particular format can be selected through the <b>Format</b> dropdown which appears after this pattern is selected. A <b>Stripe</b> can also be added in the middle of the Forward and Backward bends, which can have its size adjusted by using the slider.</li>
          <li className="guide-list"><b><i>Quadrants</i></b>: The flag is divided into four equal sections, each with a different colour. You can select and customise the colours for each of the quadrants individually.</li>
          <li className="guide-list"><b><i>Cross</i></b>: A pattern with a cross, extending from the top to the bottom and left to right of the flag. You can customise the cross's thickness and colours for both the cross and the background.</li>
          <li className="guide-list"><b><i>Saltire</i></b>: A diagonal cross (X-shaped) that stretches from corner to corner of the flag. The thickness of the cross and the colours of the saltire and the background can be adjusted.</li>
          <li className="guide-list"><b><i>Sunburst</i></b>:  A pattern with rays emanating from the center of the flag. The number of rays and their colours can be modified.</li>
          <li className="guide-list"><b><i>Border</i></b>: Adds a border around the flag. The border's thickness and colour can be customised.</li>
          <li className="guide-list"><b><i>Seychelles</i></b>: A unique pattern inspired by the Seychelles national flag, featuring a series of radiating stripes from the bottom-left corner of the flag. The number of stripes and their individual colours can be modified.</li>
          <Divider />
          <b><i>Colour</i></b>
          <p>The amount of colour input boxes available are dependent on the type of background pattern selected and the sliders selected, however the maximum amount is set to <b>16</b> unique colours.</p>
          <br />  
          <p>Click on the colour box to select a colour for the background. You can also enter a colour code in its input box, depending on the browser you're on. This option is not available if you've set the background as an image.</p>
        </div>}

        {activeTab === 'header' && (
          <div>
            <h1>Header</h1>
            <Divider />
            <p>This section describes the buttons to the left of the <b>Modes</b> buttons which are used to manage your flag design process.</p>
            <br />
            <li className="guide-list">
              <b><i>Undo</i></b>: This button allows you to revert the most recent change made to your flag design. Changes are saved every 3-5 seconds, with up to 50 changes saved in the history.
            </li>
            <li className="guide-list">
              <b><i>Redo</i></b>: The Redo button reinstates the last 50 undone change. If you undo an action and then decide that you want to keep the change after all, use this button to restore it.
            </li>
            <li className="guide-list">
              <b><i>Save/Share</i></b>: This button opens a menu that allows you to save your current flag design on your browser's cache (up to a maximum of 10 saved flags) by naming your flag to whatever name you'd like and clicking the 💾 button. The list of saved flags can be found at the bottom of this menu, which can be reloaded by clicking on the name of the flag in the list. It also generates a shareable link which can be sent to others for an editable version of your flag. 
            </li>
            <li className="guide-list">
              <b><i>Refresh</i></b>: The Refresh button resets the flag canvas to the default EU flag. This is a quick way to start over if you want to create a new design from a standard template.
            </li>
            <li className="guide-list">
              <b><i>GitHub</i></b>: This button links directly to the web app's GitHub repository.
            </li>
          </div>
        )}
        
        {activeTab === 'other' && <div>
          <h1>Other</h1>
          <Divider />
          <p>Underneath the flag canvas are 'Miscellaneous' options that add a bit more fun to the Designer.</p>
          <br />
          <b><i>Format</i></b>
          <p>This button allows you to change the flag format/aspect ratio of your flag. The available formats are:</p>
          <li className="guide-list"><b><i>Circle</i></b>: A perfectly circular format centered on the middle of the flag.</li>
          <li className="guide-list"><b><i>Flag 2:3 (Default)</i></b>: A rectangular format that fills the entire flag canvas, in a 2:3 ratio <i>(width:height)</i>.</li>
          <li className="guide-list"><b><i>Flag 1:2</i></b>: A rectangular format that fills the entire flag canvas, in a 1:2 ratio <i>(width:height)</i>.</li>
          <li className="guide-list"><b><i>Square</i></b>: A perfectly square format with a 1:1 ratio <i>(width:height)</i>.</li>
          <li className="guide-list"><b><i>Guidon</i></b>: A format shaped like a swallow-tailed flag, typically used in military or ceremonial flags. The flag tapers to two points at the fly end, creating a distinctive triangular cutout.</li>
          <li className="guide-list"><b><i>Ohio</i></b>: A burgee-shaped format based on the flag of Ohio, featuring a swallowtail design with a triangular pennant on the hoist side. The unique shape is often used for flags representing organizations or locations.</li>
          <li className="guide-list"><b><i>Shield</i></b>: A shield-shaped format, often used in heraldic designs. The top of the flag is wider and rounded, tapering towards the bottom, mimicking the shape of a traditional shield.</li>
          <li className="guide-list"><b><i>Pennant</i></b>: A long, narrow, triangular flag format, typically used in sports or maritime contexts. The pennant tapers from the hoist to a point at the fly end, and can be oriented horizontally or vertically.</li>
          <br />
          <p>Please note that the selected format is not saved in the URL and therefore if saved, shared, or added to the <b>Online List</b>, it will be set to the default 2:3 Rectangular Format.</p>
          <p>However, if you download the flag in either <b>PNG</b> or <b>SVG</b> formats, the flag will be exported in the selected format.</p>
          <Divider />
          <b><i>Randomiser</i></b>
          <p>There are two available buttons for randomising the flag design:</p>
          <li className="guide-list"><b><i>Randomise</i></b>: This button randomises every design option on the flag, including the shapes, overlays, and background. This is a great way to get some inspiration for your flag design.</li>
          <li className="guide-list"><b><i>Randomise (Ø)</i></b>: The small button next to the <b>Randomise</b> button randomises every design option on the flag except for the addition of overlays. This is an alternate randomiser for those that would like a flag that does not look like it was created by someone who went through the worst acid trip of their lives.</li>
          <Divider />
          <b><i>Share Online</i></b>
          <p>This button allows you to add your own creation to the <b>Online</b> section of the site. Clicking on this button will open a popup where you can enter your name/nickname, the name of the flag, and select tags relevant to your flag.</p>
          <br />
          <p>Refer to the <b>Online</b> section of this guide for more information.</p>
        </div>}

        {activeTab === 'quiz' && <div>
          <h1>Quiz</h1>
          <Divider />
          <p>A random flag from the <b>Flag List</b> will appear, to which you need to guess the associated country/city/group associated with the flag. Several settings are available to make the quiz more challenging, including the toggling of the amount of options, and a timer.</p>
          <br />
          <p>When you click on a correct answer, the button will turn <b><span style={{color: '#90EE90'}}>green</span></b> and the Score value will be incremented. If incorrect, the button will turn <b><span style={{color: '#ff474c'}}>red</span></b>, and your score will reset. Your high score (saved in your browser's cache) will be saved underneath your current score.</p>
          <br />
          <p>To exit this mode, either click on the <b>Quiz</b> button in the Header again, or click on "EU Flag Maker" in the Header, or go to the <b>Settings (⚙)</b> and click <b>Exit Quiz Mode</b>.</p>
        </div>}

        {activeTab === 'quiz-settings' && <div>
          <h1>Quiz Settings</h1>
          <Divider />
          <p>To change the settings of the quiz, click on the <b>⚙</b> icon on the right of the score.</p>
          <br />
          <b><i>Options</i></b>
          <p>This slider allows you to set the amount of possible answers on the quiz, ranging from <b>2</b> to <b>6</b>, but set to <b>3</b> on default.</p>
          <Divider />
          <b><i>Timer</i></b>
          <p>This toggle allows you to set a timer for the quiz. When the toggle is set to <b>Timer On</b>, a timer will appear underneath the score, counting down from <b>10</b> seconds. When the timer reaches <b>0</b>, your score will automatically reset to <b>0</b>, and a new flag is shown.</p>
          <br />
          <p>A slider will also appear when you turn on the timer, allowing you to change the total amount of time you get per flag. This ranges from <b>5</b> seconds up to a maximum of <b>30</b> seconds.</p>
        </div>}

        {activeTab === 'flag-list' && <div>
          <h1>Flag List</h1>
          <Divider />
          <p>A list of flags manually created by yours truly, made to resemble the actual flags as closely as possible with the limitations of this web app. The list contains over 700 current and historical flags of countries, cities, provinces and groups from all over the world.</p>
          <br />
          <p>To exit this mode, either click on the <b>Flag List</b> button in the Header again, or click on "EU Flag Maker" in the Header.</p>
        </div>}

        {activeTab === 'flag-filters' && <div>
          <h1>Filters</h1>
          <Divider />
          <p>There are several filters available to help you find a specific flag in the list. They can all be used together to further filter the list.</p>
          <br />
          <b><i>Search</i></b>
          <p>Enter a keyword in the search bar to find flags with that keyword in the flag's name.</p>
          <br />
          <b><i>Sort</i></b>
          <p>Click on either <b>Ascending</b> or <b>Descending</b> buttons to list them in that alphabetical order. By default, this is set to <b>Ascending</b></p>
          <br />
          <b><i>Alphabetical</i></b>
          <p>You can also filter the list by the first letter of the flag's name by clicking any of the letters. To reset this filter, click on the <b>All</b> button at the top of this list.</p>
        </div>}
        
        {activeTab === 'online' && <div>
          <h1>Online</h1>
          <Divider />
          <p>This section contains a list of user-generated flags created through this web app.</p> 
          <br />
          <p>By clicking the <b>Share Online</b> button, you can add your own creation to this list!</p>
          <br />
          <p>To exit this mode, either click on the <b>Online</b> button in the Header again, or click on "EU Flag Maker" in the Header.</p>
        </div>}

        {activeTab === 'online-upload' && <div>
          <h1>Upload your Flag</h1>
          <Divider />
          <p>Click on the <b>Share Online</b> button underneath the flag canvas to share your flag design to the <b>Online</b> section of the site.</p>
          <br />
          <p>In the first input box, enter your name/nickname, to whom the flag will be credited to.</p>
          <br /> 
          <p>In the second input box, enter the name of the flag you're sharing.</p>
          <br />
          <p>Finally, you can select tags (one or multiple) relevant to your flag. The available tags are:</p>
          <li className="guide-list"><b><i>OC (Original Creation)</i></b>; for unique flags unrelated to any existing design.</li>
          <li className="guide-list"><b><i>Historical</i></b>; for real-life flags that were previously in use by any country/city/organisation etc.</li>
          <li className="guide-list"><b><i>Redesign</i></b>; for flags created by the user which are based on real-life flags</li>
          <li className="guide-list"><b><i>Current</i></b>; for real-life flags that are currently in use by any country/city/organisation etc.</li>
          <li className="guide-list"><b><i>Fictional</i></b>; for flags based on fictional countries/cities/organisations etc.</li>
          <li className="guide-list"><b><i>Random</i></b>; for any wacky flags, or those created using the <b><span style={{color: '#90EE90'}}>R</span><span style={{color: '#008000'}}>a</span><span style={{color: '#7e8ed7'}}>n</span><span style={{color: '#d990d3'}}>d</span><span style={{color: '#e8eb77'}}>o</span><span style={{color: '#77ebe5'}}>m</span><span style={{color: '#77eba0'}}>i</span><span style={{color: '#b877eb'}}>s</span><span style={{color: '#edfffe'}}>e</span></b> feature.</li>
          <li className="guide-list"><b><i>Offensive</i></b>; for flags with symbols that may be considered as offensive by others, including far-right flags, communist symbols etc. Flags with this tag will be blurred by default.</li>
          <li className="guide-list"><b><i>Other</i></b>; for anything else.</li>
          <br />
          <p>Once you click <b>Share</b>, the flag currently on the canvas will be added to the <b>Online</b> section of the site.</p>
        </div>}

        {activeTab === 'online-list' && <div>
          <h1>Online List</h1>
          <Divider />
          <p>The list contains every submitted flag by users such as yourself. The flags are listed according to the latest posted flag, however you can also sort by <b>Ascending</b> and <b>Descending</b> order.</p>
          <br />
          <p>To filter through the flags;</p>
          <li className="guide-list"><b><i>Search</i></b>: Enter a keyword in the search bar to find flags with that keyword in the flag's name.</li>
          <li className="guide-list"><b><i>Tags</i></b>: Click on any tags within the list of <b>Tags</b> at the top of the page, which gives you a list of flags with that particular tag. To clear the clear this filter, click on the <b>Clear Filter</b> button.</li>
          <br />
          <p>Some flags in the list may be blurred, as they contain the <b>Offensive</b> tag. This could be due to them containing offensive or banned symbols such as the 'Hammer & Sickle' or 'Nazi' symbolisms, or else are related to groups (etc.) that have far-right/far-left connotations.</p>
          <br />  
          <p>To remove the blur, simply click on the <b>Unblur</b> button.</p>
        </div>}

        {activeTab === 'download' && <div>
          <h1>Download</h1>
          <Divider />
          <p>In the <b>Download</b> section underneath the <b>Design Options</b> tabs contains two buttons that allow you to save your flag design as a <b>SVG</b> or <b>PNG</b> file. The file will be downloaded to your device with the name '<i>eu-flag</i>'.</p>
          <br />  
          <div className="download-segment user-guide-download">
            <div>
              <h1 className='quiz-controls-title'>Download</h1>
              <div className="download-button-container">
                <button className="download-button">
                  <FontAwesomeIcon icon={faDownload} className="download-icon" />
                  Export PNG
                </button>
                <button className="download-button svg-button">
                  <FontAwesomeIcon icon={faFileExport} className="download-icon" />
                  Export SVG
                </button>
              </div>
            </div>
          </div>
          <p>If you had placed any images onto your flag (either as a shape, overlay, or background), the <b>SVG</b> option will not be available.</p>
          <br />  
          <p>Please note that the <b>SVG</b> output may not be entirely accurate to the one displayed on the canvas. If you'd like an output exactly as shown on the canvas, export the flag as a <b>PNG</b>.</p>
        </div>}
      </div>
    </div>
  );
};

export default UserGuide;
