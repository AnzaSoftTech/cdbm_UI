import React from 'react';
import './ProcessingDialog.css'; // Import the CSS file

const ProcessingDialog = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog_overlay">
      <div className="dialog">
        <div className="spinner"></div>
        <p>Processing...</p>
      </div>
    </div>
  );
};

export default ProcessingDialog;
