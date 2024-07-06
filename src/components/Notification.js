import React, { useEffect, useState } from 'react';
import '../styles/Notification.css';

const Notification = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Waiting for animation
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${isVisible ? 'visible' : ''}`}>
      {message}
      <button className="close-button" onClick={() => setIsVisible(false)}>×</button>
    </div>
  );
};

export default Notification;