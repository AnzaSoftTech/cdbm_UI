import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './ConfirmationBox.css'; // Import custom CSS file

const ConfirmationBox = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="modal-header">
        <Modal.Title className="text-center w-100">Confirm Action</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>Process the files ?</p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
         <Button variant="primary" onClick={onConfirm} className="modal-button">
            Yes
        </Button>
        <Button variant="secondary" onClick={onHide} className="modal-button">
          No
        </Button>
        
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationBox;
