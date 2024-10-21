import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

import './EditBillMasterPopup.css'; // Import the custom CSS file
//import { Tooltip, OverlayTrigger } from 'react-bootstrap';
//import { FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';

// Function to format numbers with commas
// const formatNumberWithCommas = (num) => {
//     if (num === undefined || num === null || num === '') return ''; // Return empty string for blank input
//     const [integerPart, decimalPart] = num.toString().split('.');
//     const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//     return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
// };

// Function to parse a formatted number string back to a number
const parseNumberFromFormattedString = (str) => {
    if (str === undefined || str === null || str.trim() === '') return ''; // Return empty string for blank input
    return parseFloat(str.replace(/,/g, ''));
};

function SearchBill({ onClose, onRowSelect, accountName, actCd ,vendorDetails}) {
    const [vendorName, setVendorName] = useState('');
    const [items, setItems] = useState([]); // Initialize with an empty array
    //const [selectedRows, setSelectedRows] = useState([]); // State for selected rows


    useEffect(() => {
        console.log("accountName----",accountName);
        setVendorName(accountName || '');
    }, [accountName]);

    useEffect(() => {
        const fetchData = async () => {
            console.log('vendordetails------', vendorDetails);
            console.log("code----",actCd);
            if (actCd) {
                try {
                    if (!vendorDetails || vendorDetails.length === 0) {
                        // Fetch data only if vendorDetails is not provided or is empty
                        const response = await axios.get('http://localhost:3001/api/bill_master', {
                            params: { actCd }
                        });
                        console.log('Fetched data:', response.data);
                        const formattedData = response.data.map(item => ({
                            ...item,
                            invoice_date: new Date(item.invoice_date).toISOString().split('T')[0]  // Format to YYYY-MM-DD
                        }));
                        setItems(formattedData);
                    } else {
                         //Use vendorDetails to initialize items
                        const formattedData = vendorDetails.map(item => ({
                           ...item,
                            invoice_date: new Date(item.invoice_date).toISOString().split('T')[0]  // Format to YYYY-MM-DD
                       }));
                        setItems(formattedData);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    alert('Error fetching data:', error);
                }
            }
        };
    
        fetchData();
    }, [actCd, vendorDetails]);
    

    const handleInputChange = (index, field, value) => {
        const newItems = [...items];
        if (field === 'amount') {
            newItems[index][field] = (value);
        } else {
            newItems[index][field] = value;
        }
        setItems(newItems);
        console.log('items', items);

    };

    const handleSelectRow = () => {
        // Filter rows where payment_amt is greater than 0
        const validRows = items.filter(item => parseNumberFromFormattedString(item.payment_amt) > 0);

        if (validRows.length > 0) {
            onRowSelect(validRows); // Send valid rows to parent component
            alert("Vendor Details successfully sent");
        } else {
            alert("Please Enter the Payment amount !!");
        }
    };


    // const handleRowSelect = (row) => {
    //     const newSelectedRows = selectedRows.includes(row)
    //         ? selectedRows.filter(r => r !== row) // Deselect row if already selected
    //         : [...selectedRows, row]; // Select row if not already selected

    //     setSelectedRows(newSelectedRows); // Update selected rows
    //     onRowSelect(newSelectedRows); // Send data to parent component
    // };

    const columns = [
        // {
        //     name: 'Bill No.',
        //     selector: row => row.bill_id,
        //     cell: (row, index) => (
        //         <input
        //             type="number"
        //             value={row.bill_id}
        //             onChange={e => handleInputChange(index, 'bill_id', e.target.value)}
        //             className="form-control input-right-align"
        //             readOnly

        //         />
        //     ),

        //     hidden: true,
        // },
        {
            name: 'Invoice No.',
            selector: row => row.invoice_no,
            cell: (row, index) => (
                <input
                    type="number"
                    value={row.invoice_no}
                    onChange={e => handleInputChange(index, 'invoice_no', e.target.value)}
                    className="form-control input-right-align"
                    readOnly
                />
            ),

        },
        {
            name: 'Invoice Date',
            selector: row => row.invoice_date,
            cell: (row, index) => (
                <input
                    type="date"
                    value={row.invoice_date}
                    onChange={e => handleInputChange(index, 'invoice_date', e.target.value)}
                    className="form-control"
                    readOnly
                />
            ),
            width: '15%',
        },
        {
            name: 'Tax',
            selector: row => row.taxable_value,
            cell: (row, index) => (
                <input
                    type="number"
                    value={(row.taxable_value)}
                    onChange={e => handleInputChange(index, 'taxable_value', e.target.value)}
                    className="form-control input-right-align"
                    readOnly
                />
            ),

        },
        {
            name: 'Amount',
            selector: row => row.invoice_value,
            cell: (row, index) => (
                <input
                    type="number"
                    value={(row.invoice_value)}
                    onChange={e => handleInputChange(index, 'invoice_value', e.target.value)}
                    className="form-control input-right-align"
                    readOnly
                />
            ),

        },
        {
            name: 'Pending Amount',
            selector: row => row.pending_amount,
            cell: (row, index) => (
                <input
                    type="number"
                    value={(row.pending_amount)}
                    onChange={e => handleInputChange(index, 'pending_amount', e.target.value)}
                    className="form-control input-right-align"
                    readOnly
                />
            ),

        },
        {
            name: 'Payment Amount',
            selector: row => row.payment_amt,
            cell: (row, index) => (
                <input
                    type="text"
                    value={(row.payment_amt)}
                    onChange={e => handleInputChange(index, 'payment_amt', e.target.value)}
                    className="form-control input-right-align"
                />
            ),

        },
        // {
        //     name: 'Select',
        //     cell: (row) => (
        //         <OverlayTrigger
        //             placement="top" // Position the tooltip above the button
        //             overlay={
        //                 <Tooltip id={`tooltip-select-${row.bill_id}`}>
        //                     {selectedRows.includes(row) ? 'Deselect' : 'Select'} Bill No. {row.bill_id}
        //                 </Tooltip>
        //             }
        //         >
        //             <button
        //                 className={`btn btn-sm ${selectedRows.includes(row) ? 'btn-custom-selected' : 'btn-custom-unselected'} btn-custom-icon`}
        //                 onClick={() => handleRowSelect(row)}
        //                 style={{ marginLeft: '20px' }}
        //             >
        //                 {selectedRows.includes(row) ? <FaCheck /> : <FaTimes />}
        //             </button>
        //         </OverlayTrigger>
        //     ),
        //     allowOverflow: true,
        //     width: '7%', // Set width
        //     style: {
        //         borderRight: 'none', // Remove right border for column
        //     },
        // },
        // {
        //     name: '',
        //     cell: (row, index) => (
        //         <OverlayTrigger
        //             placement="top" // Position the tooltip above the button
        //             overlay={
        //                 <Tooltip id={`tooltip-delete-${index}`}>
        //                     Delete Bill No. {row.bill_no}
        //                 </Tooltip>
        //             }
        //         >
        //             <button
        //                 className="btn btn-danger btn-sm"
        //                 onClick={() => handleDelete(index)}
        //                 style={{
        //                     borderRightStyle: 'none', // Remove right border for Actions column
        //                     padding: '3px 5px', // Adjust padding as needed
        //                     display: 'flex',
        //                     alignItems: 'center',
        //                     justifyContent: 'center',
        //                 }}
        //             >
        //                 <FaTrashAlt /> {/* React Icon */}
        //             </button>
        //         </OverlayTrigger>
        //     ),
        //     allowOverflow: true,
        //     width: '10%',
        //     style: {
        //         borderRightStyle: 'none', // Ensure no border-right for Actions column
        //     },
        //},
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
                width: '100%',
            },
        },
    };

    return (
        <div className="popupsearch">
            <div className="popup-innersearch">
                <h4 className="header_color">Vendor Bill </h4>
                <div className="d-flex justify-content-between">
                    <div className="form-group d-flex">
                        <label className="mr-2 vendor_width">Name</label>
                        <input
                            type="text"
                            className="form-control mb-3 label_vendor"
                            value={vendorName}
                            onChange={(e) => setVendorName(e.target.value)}
                            size="sm"
                            readOnly
                        />
                    </div>
                </div>
                <div className="table-container">
                    <DataTable
                        columns={columns}
                        data={items}
                        customStyles={customStyles}
                        responsive
                    />
                </div>

            </div>
            <button className="btn btn-secondary  add_button" onClick={handleSelectRow} >
                okk
            </button>
            <button className="btn btn-secondary close_btn" onClick={onClose}>
                Close
            </button>
        </div>
    );
}

export default SearchBill;
