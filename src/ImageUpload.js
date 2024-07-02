import React, { useRef } from 'react';

const ImageUpload = ({ onImageUpload, onImageRemove, hasImage }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 1024 * 1024) { // 1MB max
      const reader = new FileReader();
      reader.onload = (e) => onImageUpload(e.target.result);
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file under 1MB.');
    }
    event.target.value = '';
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
        <button onClick={handleRemove} className="remove-image">
          <i className="fas fa-trash"></i>
        </button>
      )}
    </div>
  );
};

export default ImageUpload;