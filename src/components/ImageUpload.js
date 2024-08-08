import React, { useRef, useState } from 'react';
import Notification from './Notification';
import Tooltip from './Tooltip';

const ImageUpload = ({ onImageUpload, onImageRemove, hasImage }) => {
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 1024 * 1024) { // 1MB max
      const reader = new FileReader();
      reader.onload = (e) => onImageUpload(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setNotification("Please select an image file under 1MB.");
    }
    event.target.value = '';
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const handleRemove = () => {
    onImageRemove();
    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <input
        type="file"
        accept=".png,.jpg,.jpeg,.svg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <button onClick={() => fileInputRef.current.click()}>
        {hasImage ? 'Change Image' : 'Upload Image'}
      </button>
      {hasImage && (
        <Tooltip text="Delete the image.">
          <button onClick={handleRemove} className="remove-image">
            <i className="fas fa-trash"></i>
          </button>
        </Tooltip>
      )}
      {notification && (
        <Notification message={notification} onClose={clearNotification} />
      )}
    </div>
  );
};

export default ImageUpload;