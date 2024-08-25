import React, { useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import './ViewLogPopup.css';

function Client_Popup({ wrongClients = [], onCloseClick }) {
    // Initialize Clientdata based on wrongClients
    const [Clientdata, setClientData] = useState(
        wrongClients.map(client => ({
            wrongClient: client,
            clientCd: '',
            clientName: ''
        }))
    );

    // Function to handle clientCd input change directly in DataTable
    const handleClientCdChange = async (index, newClientCd) => {
        if (newClientCd) {
            try {
                const response = await axios.get(`http://localhost:3001/client/${newClientCd}`);
                const fetchedClientName = response.data.client_name;

                // Update DataTable data
                const updatedData = [...Clientdata];
                updatedData[index] = { ...updatedData[index], clientCd: newClientCd, clientName: fetchedClientName };
                setClientData(updatedData);
            } catch (err) {
                console.error('Error fetching client data:', err);
                const updatedData = [...Clientdata];
                updatedData[index] = { ...updatedData[index], clientCd: newClientCd, clientName: '' }; // Handle error case
                setClientData(updatedData);
            }
        } else {
            const updatedData = [...Clientdata];
            updatedData[index] = { ...updatedData[index], clientCd: '', clientName: '' }; // Reset data
            setClientData(updatedData);
        }
    };

    const handleButtonClick = async () => {
        try {
            console.log('Sending data:', Clientdata);

            // Send the POST request with the data
            const response = await axios.post('http://localhost:3001/api/client_not_found_trade', { clientData: Clientdata }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Handle successful response
            alert('Voucher saved successfully!');
            setClientData([]); // Clear the data or perform other actions

        } catch (err) {
            // Handle error
            console.error('Error saving voucher:', err);
            alert('Error saving voucher. Please try again.');
        }
    };

    // DataTable columns
    const columns = [
        {
            name: 'Wrong Client ID',
            selector: row => row.wrongClient,
            cell: row => <input type="text" value={row.wrongClient} readOnly className="form-control" />,
            width: '25%',
        },
        {
            name: 'Client Code',
            selector: row => row.clientCd,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.clientCd}
                    onChange={e => handleClientCdChange(index, e.target.value)}
                    className="form-control"
                />
            ),
            width: '25%',
        },
        {
            name: 'Client Name',
            selector: row => row.clientName,
            cell: row => <input type="text" value={row.clientName} readOnly className="form-control" />,
            width: '50%',
            allowOverflow: true,
        },
    ];

    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: 'purple',
                backgroundColor: '#99bcef',
                color: 'white',
                fontWeight: 'bold',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                minHeight: '40px',
                paddingLeft: '3px',
                paddingRight: '3px',
            },
        },
        headCells: {
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: 'black',
                paddingLeft: '3px',
                paddingRight: '3px',
            },
        },
        cells: {
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: 'blue',
                paddingLeft: '3px',
                paddingRight: '3px',
            },
        },
        rows: {
            style: {
                paddingLeft: '3px',
                paddingRight: '3px',
            },
        },
    };

    return (
        <div className="popup" style={{ height: '50%' }}>
            <div className="popup-inner" style={{ height: 'auto' }}>
                <h4 className="div_header_warn">Client</h4>
                <div className='me-2 ms-2' style={{ height: '100%', overflowY: 'auto' }}>
                    <DataTable
                        columns={columns}
                        data={Clientdata} // Provide the data prop
                        customStyles={customStyles}
                        responsive
                        noDataComponent={<div>No data available</div>}
                    />
                </div>
            </div>
            <button className="btn btn-secondary mt-2 ms-2" onClick={onCloseClick}>Close</button>
            <button className="btn btn-success mt-2 ms-2" onClick={handleButtonClick}>Process</button>
        </div>
    );
}

export default Client_Popup;
