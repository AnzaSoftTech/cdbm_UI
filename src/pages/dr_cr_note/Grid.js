// src/components/Grid.js
import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Grid = ({ details, setDetails }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [accountName, setAccountName] = useState('');

  const handleAddRow = () => {
    setDetails([...details, { accountName: '', amount: '', accountType: '' }]);
  };

  const handleDeleteRow = index => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  const handleRowSelected = (row) => {
        setSelectedRow(row);
        alert(row.name);
        setAccountName(row.name);
        setShowModal(false);
    };

  const columns = [
    {
      name: 'Account Name',
      selector: row => row.accountName,
      cell: (row, index) => (
        <input
          type="text"
          value={accountName}
          onChange={e => handleInputChange(index, 'accountName', e.target.value)}
        />
      
      ),
    },
    {
            cell: () => <Button onClick={() => setShowModal(true)}>Search</Button>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
     {
      name: 'Account Type',
      selector: row => row.accountType,
      cell: (row, index) => (
        <input
          type="text"
          value={row.accountType}
          onChange={e => handleInputChange(index, 'accountType', e.target.value)}
        />
      ),
    },
    {
      name: 'Amount',
      selector: row => row.amount,
      cell: (row, index) => (
        <input
          type="number"
          value={row.amount}
          onChange={e => handleInputChange(index, 'amount', e.target.value)}
        />
      ),
    },
      {
      name: 'Analyser Code',
      selector: row => row.amount,
      cell: (row, index) => (
        <input
          type="number"
          value={row.amount}
          onChange={e => handleInputChange(index, 'amount', e.target.value)}
        />
      ),
    },
   
    {
      name: 'Actions',
      cell: (row, index) => (
        <button onClick={() => handleDeleteRow(index)}>Delete</button>
      ),
    },
  ];

  return (
    <div>
      <button onClick={handleAddRow}>Add Row</button>
      <DataTable columns={columns} data={details} />
      {/* <Form.Group className="mt-3">
                <Form.Label>Selected Account Name:</Form.Label>
                <Form.Control type="text" value={accountName} readOnly />
            </Form.Group> */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Search and Select Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SearchPopup onRowSelected={handleRowSelected} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
    </div>
  );

  
};
const SearchPopup = ({ onRowSelected }) => {
    const popupData = [
        { id: 1, name: 'Popup Account 1', value: 'Popup Value 1' },
        { id: 2, name: 'Popup Account 2', value: 'Popup Value 2' },
        // Add more rows as needed
    ];

    const popupColumns = [
        { name: 'Name', selector: row => row.name, sortable: true },
        { name: 'Value', selector: row => row.value, sortable: true },
        {
            cell: (row) => <Button onClick={() => onRowSelected(row)}>Select</Button>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    return (
        <DataTable
            columns={popupColumns}
            data={popupData}
            pagination
        />
    );
};
export default Grid;
