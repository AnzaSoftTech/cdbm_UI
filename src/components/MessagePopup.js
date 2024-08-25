import React from 'react';
import { Alert } from 'react-bootstrap';

function MessagePopup({ message }) {
  return (
    <Alert variant="info" className="text-center">
      {message}
    </Alert>
  );
}

export default MessagePopup;
