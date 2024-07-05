import React from 'react';

const Divider = ({ text }) => {
  return (
    <div className="divider">
      <span className="divider-line"></span>
      {text && <span className="divider-text">{text}</span>}
      <span className="divider-line"></span>
    </div>
  );
};

export default Divider;