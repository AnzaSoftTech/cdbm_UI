import React, { useState, useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import './Tabs.css'; // Import your custom CSS for additional styles
import deleteIcon from './image/delete.png';
import searchIcon from './image/search.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from "../constants";

export default function Bank_Details({ onCloseClick, p_actCode, p_actName, is_Auto }) {

    const [userId, setUserId] = useState(1);
    const [Bankdetails, setBankDetails] = useState([{
        bank_dtl_id: '', bank_name: '', bank_acc_type: '', bank_acc_no: '', upi_id: '', start_date: '', end_date: '', ifsc: ''
        , bank_address_1: '', bank_address_2: '', bank_address_3: '', ac_status: 'A', editMode: false, 
    }]);
    const [bank_ac_types, setBank_ac_types] = useState([]);
    const [details, setDetails] = useState([]);
    const [addMode, setAddMode] = useState(is_Auto);



    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/client_bank_ac_type`);
                const data = await response.json();
                setBank_ac_types(data);
                // console.log('bank_ac_type', data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        getBankDetails();
    }, []);

    const getBankDetails = () => {
        axios.get(`${BASE_URL}/api/get_bank_details`, { params: { p_actCode } })
            .then(response => {
                const detailList = response.data.map(result => {
                    return {
                        bank_dtl_id: result.bank_dtl_id, bank_name: result.bank_name, bank_acc_type: result.bank_acc_type
                        , bank_acc_no: result.bank_acc_no, upi_id: result.upi_id, start_date: result.start_date, end_date: result.end_date
                        , ifsc: result.ifsc, bank_address_1: result.bank_addr_1, bank_address_2: result.bank_addr_2
                        , bank_address_3: result.bank_addr_3, ac_status: result.status, editMode: false, isExist: true,
                    }
                });
                console.log('detailList ', detailList);
                setBankDetails(detailList);
            })
            .catch(error => { console.error('Error getting details', error) });
    }

    const handleBankDetailsInputChange = (index, field, value) => {
        const updatedData = [...Bankdetails]; // Assuming 'data' is the state variable holding your rows
        updatedData[index][field] = value;
        updatedData[index]['editMode'] = true;
        setBankDetails(updatedData); // Update your state with the new data
    };

    const handleBankDetailsDeleteRow = (index) => {
        if(Bankdetails[index].isExist){
            alert('The already exists row can not be deleted.');
        }
        else{
            setBankDetails(Bankdetails.filter((_, i) => i !== index));
        }   
    };

    const handleSave = async () => {

        if(Bankdetails.length === 0){
            alert('Please Add Atleast One Record.');
            return;
        }

        var ret = 0;

        Bankdetails.map((bank) => {
            // If UPI ID is provided, no bank details required
            if (bank.upi_id) {
                return;  // Skip validation for bank details when UPI is available
            }
        
            // If UPI is not provided, validate bank details
            if (!bank.bank_name || !bank.bank_acc_type || !bank.bank_acc_no) {
                if (!bank.bank_name && !bank.bank_acc_type && !bank.bank_acc_no) {
                    alert('Please Enter Bank Details or UPI');
                } else {
                    if (!bank.bank_name) {
                        alert('Please Enter Bank Name!');
                    } else if (!bank.bank_acc_type) {
                        alert('Please Select Bank Account Type!');
                    } else if (!bank.bank_acc_no) {
                        alert('Please Enter Bank Account Number!');
                    }
                }
                ret = 1;  // Flag indicating a validation failure
                return;   // Exit the map function early
            }

            if (bank.ifsc && bank.ifsc.length !== 11) {
                alert('IFSC Code must be exactly 11 characters!');
                ret = 1;  // Flag indicating a validation failure
                return;   // Exit the map function early
            }
        });

        if(ret === 1){
            return;
        }

        const isConfirmed = window.confirm('Sure you want to save?');
        if(!isConfirmed){
            return;
        }
        
        const Masterdata = {
            userId,
            p_actCode,
            Bankdetails,
        };

        // alert(JSON.stringify(Masterdata));

        try {
            const response = await fetch(`${BASE_URL}/api/save_bank_details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Masterdata),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);

            // Display a success message
            alert('Data saved successfully!'); // or use a more user-friendly notification

            // Reset all form states to initial state
            setBankDetails([{ bank_dtl_id: '', bank_name: '', bank_acc_type: '', bank_acc_no: '', upi_id: ''
                , start_date: '', end_date: '', ifsc: '', bank_address_1: '', bank_address_2: '', bank_address_3: '', ac_status: ''
                , editMode: false,   
            }]);
            getBankDetails();

        } catch (error) {
            console.error('Error:', error);
            alert('Error saving data. Please try again.'); // Display error message
        }
    };

    const Bankcolumns = [
        {
            name: 'Bank Name',
            selector: row => row.bank_name,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.bank_name} disabled={addMode}
                    onChange={e => handleBankDetailsInputChange(index, 'bank_name', e.target.value.toUpperCase())}
                    className="form-control"
                />
            ),
            width: '8rem',
        },
        {
            name: 'Bank Acc Type',
            selector: row => row.bank_acc_type,
            cell: (row, index) => (
                <select
                    name="bank_acc_type"
                    className="form-select" disabled={addMode}
                    value={row.bank_acc_type} // Ensure this is the comm_id
                    onChange={e => handleBankDetailsInputChange(index, 'bank_acc_type', e.target.value)} // Sends comm_id

                >
                    <option value="" disabled={addMode}>Select Bank Type</option>
                    {bank_ac_types.map(bank_ac_typess => (
                        <option key={bank_ac_typess.comm_id} value={bank_ac_typess.comm_id}>
                            {bank_ac_typess.description}
                        </option>
                    ))}
                </select>
            ),
            width: '8.7rem',
        },
        {
            name: 'Bank Acc No.',
            selector: row => row.bank_acc_no,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.bank_acc_no} disabled={addMode}
                    onChange={e => handleBankDetailsInputChange(index, 'bank_acc_no', e.target.value)}
                    className="form-control "

                />

            ),
            width: '12rem',
        },
        {
            name: 'IFSC',
            selector: row => row.ifsc,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.ifsc} disabled={addMode}
                    onChange={e => handleBankDetailsInputChange(index, 'ifsc', e.target.value.toUpperCase())}
                    className="form-control"
                />
            ),
            width: '10rem',
        },
        {
            name: 'UPI Id',
            selector: row => row.upi_id,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.upi_id} disabled={addMode}
                    onChange={e => handleBankDetailsInputChange(index, 'upi_id', e.target.value)}
                    className="form-control"
                />
            ),
            width: '10rem',
        },
        {
            name: 'Bank Addres 1',
            selector: row => row.bank_address_1,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.bank_address_1} disabled={addMode}
                    onChange={e => handleBankDetailsInputChange(index, 'bank_address_1', e.target.value)}
                    className="form-control "

                />
            ),
            width: '15rem',
        },
        {
            name: 'Bank Addres 2',
            selector: row => row.bank_address_2,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.bank_address_2} disabled={addMode}
                    onChange={e => handleBankDetailsInputChange(index, 'bank_address_2', e.target.value)}
                    className="form-control "

                />
            ),
            width: '15rem',
        },
        {
            name: 'Bank Addres 3',
            selector: row => row.bank_address_3,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.bank_address_3} disabled={addMode}
                    onChange={e => handleBankDetailsInputChange(index, 'bank_address_3', e.target.value)}
                    className="form-control "

                />
            ),
            width: '15rem',
        },
        {
            name: 'Status',
            selector: row => row.ac_status,
            cell: (row, index) => (
                <select
                    value={row.ac_status} disabled={addMode}
                    onChange={e => handleBankDetailsInputChange(index, 'ac_status', e.target.value)}
                    className="form-select">
                    <option value="A">Active</option>
                    <option value="I">Inactive</option>
                </select>
            ),
            allowoverflow: true,
            width: '8rem',
        },
        {
            name: 'Start Date',
            selector: row => row.start_date,
            cell: (row, index) => (
                <div className='d-flex'>
                    <input
                        type="date"
                        value={row.start_date} disabled={addMode}
                        onChange={e => handleBankDetailsInputChange(index, 'start_date', e.target.value)}
                        className="form-control "

                    />
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-delete-${index}`}>
                                Delete
                            </Tooltip>
                        }
                    >
                        <img
                            src={deleteIcon}
                            alt="Delete"
                            onClick={!addMode ? () => handleBankDetailsDeleteRow(index) : null}
                            style={{
                                width: '20px',
                                height: '20px',
                                marginTop: '7px'
                            }}
                        />
                    </OverlayTrigger>
                </div>
            ),
            width: '10.5rem',
        }

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
        actionsHeader: {
            style: {
                borderRightStyle: 'none',
            },
        },

        actionsCell: {
            style: {
                borderRightStyle: 'none',
                paddingLeft: '3px',
                paddingRight: '3px',
            },
        },
    };

    const handleBankDetailsAddRow = () => {
        setBankDetails([...Bankdetails, { bank_dtl_id: '', bank_name: '', bank_acc_type: '', bank_acc_no: '', upi_id: ''
            , start_date: '', end_date: '', ifsc: '', bank_address_1: '', bank_address_2: '', bank_address_3: '', ac_status: 'A'
            ,editMode: false, isExist: false,
        }]);
    };
    return (

        <div className="popup_addr_cont" style={{height: '620px'}}>
            <div className="popup-inner">
                <div className='div_header_warn'>
                    <h5 className='search_header '>Bank Details</h5>
                </div>
                <div className='card-body'>
                    <div className='row'>
                        <div>
                            <div className="col-md-6 mb-3 d-flex">
                                <label htmlFor="acctName" className="form-label label-width">Account Name</label>
                                <input id="acctName" disabled type="text" className="form-control size_input_cashbank" value={p_actName} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-2'>
                    <DataTable columns={Bankcolumns} data={Bankdetails} customStyles={customStyles} responsive />
                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex" style={{ marginTop: '10px' }}>
                            {!addMode ?
                                <button className='btn btn-primary' style={{ width: '100px', marginLeft: '10px' }}
                                    onClick={handleBankDetailsAddRow}>Add</button>
                                : null
                            }
                            <button className='btn btn-secondary' style={{ width: '100px', marginLeft: '10px' }}
                                onClick={() => onCloseClick(null)}>Close</button>

                            {!addMode ?
                                <button className='btn btn-success' style={{ width: '100px', marginLeft: '10px' }}
                                    onClick={handleSave}>Save</button>
                                : null
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}