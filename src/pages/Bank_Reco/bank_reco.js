import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Form, Row, Col } from 'react-bootstrap';
import './bank_reco.css';
import '../../CommonCss.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Payment_Voucher from './payment.js';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';

const BankReco = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [Vouchar, setVouchar] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [summarydata, setSummaryData] = useState([]);
    const [selectedRowsTable1, setSelectedRowsTable1] = useState([]);
    const [selectedRowsTable2, setSelectedRowsTable2] = useState([]);
    const [pending, setPending] = useState(false);
    const [data, setData] = useState([]);
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [filters, setFilters] = useState({
        clientcd: '',
        scrip: '',
        fromdt: '',
        todt: '',
        branchcd: '',
        settlementNo: '',
    });

    const onInputChange = e => {
        setFiles(e.target.files);
    };

    const onUploadBankFileSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        alert('hiii')
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
            console.log('files', formData)



            alert("file---", i)
        }
        try {
            const res = await axios.post('http://localhost:3004/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }

            });
            //console.log(File ${files[i].name} uploaded successfully);
            setMessage('Files Uploaded Successfully');
            alert('Files Uploaded Successfully');
            setFiles([]);

        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }

        }
    };
    const handleEditClick = () => {

        if (selectedRowsTable1) {
            setShowPopup(true);
        } else {
            alert('Please select a row first.');
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleProcessRecoButton = async () => {
        try {
            const response = await axios.post('http://localhost:3004/process-Bank_statement_csv');
            alert(response.data.message);
            handleData();
        } catch (error) {
            console.error("Error loading files:", error);
            alert('Error loading files');
        }
    };

    // Utility function to find mismatched entries


    const handleData = async () => {
        const params = new URLSearchParams();
        alert(JSON.stringify(filters));
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                params.append(key, filters[key]);
            }
        });
        alert(params.toString());
        try {
            const [response1, response2] = await Promise.all([
                axios.get('http://localhost:3004/api/account_statement'),
                axios.get('http://localhost:3004/api/fin_trans')
            ]);



            setData(response1.data);
            setSummaryData(response2.data);

            setShowTable(true);

        } catch (err) {
            console.error(err);
        } finally {
            setPending(false);
        }
    };

    const handleRowSelect1 = (row) => {
        setSelectedRowsTable1([row]);


    };




    const handleRowSelect2 = (row) => {
        setSelectedRowsTable2([row]);

    };


    const handleSubmitSelectedData = async () => {
        // const selectedDataTable1 = selectedRowsTable1.map(row => ({
        //     particular: row.particular,
        //     cheque_refernce_no: row.cheque_refernce_no,
        //     amount: row.amount,
        //     bank_date: row.bank_date,
        //     debit_credit: row.debit_credit,
        //     index: data.indexOf(row),
        // }));
        // const selectedDataTable2 = selectedRowsTable2.map(row => ({
        //     act_cd: row.act_cd,
        //     cheque_no: row.cheque_no,
        //     narration: row.narration,
        //     amount: row.amount,
        //     date: row.date,
        //     drcr: row.drcr,
        //     index: summarydata.indexOf(row),
        // }));




        // Prepare the payload
        const payload = {
            selectedRowsTable1,
            selectedRowsTable2,

        };

        try {
            // Send the payload to the backend
            const response = await axios.post('http://localhost:3004/update_Fin_trans', payload);
            alert(response.data.message);

        } catch (error) {
            console.error("Error submitting data:", error);
            alert('Error submitting data');
        }

    };





    const handleVoucharRowSelect = (data) => {

        setVouchar(data);

    };


    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {
                borderBottomColor: 'blue',
                backgroundColor: 'rgb(224, 230, 245)',
            },
        },
        headCells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: 'black',
                },
            },
        },
        cells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: 'blue',
                },
            },
        },
    };

    const columns = [
        {
            name: 'Particular',
            selector: row => row.particular,
            sortable: true,
            width: '200px',
            left: true,
            cell: (row) => <div style={{ textAlign: 'left' }}>{row.particular}</div>,
        },
        {
            name: 'Reference',
            selector: row => row.cheque_refernce_no,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Date',
            selector: row => row.bank_date,
            sortable: true,
            width: '125px',
        },
        {
            name: 'Amount',
            selector: row => row.amount,
            sortable: true,
            right: true,
            width: '125px',
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {parseFloat(row.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
        },
        {
            name: 'Dr/Cr',
            selector: row => row.debit_credit,
            sortable: true,
            width: '125px',
        },
        {
            name: 'Select',
            cell: (row) => (
                <div className='d-flex'>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-select-${row.amount}`}>
                                {selectedRowsTable1.includes(row) ? 'Deselect' : 'Select'} Amount {row.amount}
                            </Tooltip>
                        }
                    >
                        <button
                            className={`btn btn-sm ${selectedRowsTable1.includes(row) ? 'btn-custom-selected' : 'btn-custom-unselected'} btn-custom-icon`}
                            onClick={() => handleRowSelect1(row)}
                            style={{ margin: '10px 5px 10px 0px', width: '30px', height: '30px' }}
                        >
                            {selectedRowsTable1.includes(row) ? <FaCheck /> : <FaTimes />}
                        </button>
                    </OverlayTrigger>
                    <Button onClick={handleEditClick} className=" btn btn-warning mr-2 vouchar_btn" size='sm' >
                        Voucher
                    </Button>
                    {showPopup && <Payment_Voucher onClose={handleClosePopup} onRowSelect={handleVoucharRowSelect} BankDetails={selectedRowsTable1} />}
                </div>
            ),
            allowOverflow: true,
            width: '7%',
            style: {
                borderRight: 'none',
            },
        }


    ];

    const columnsSummary = [
        {
            name: 'Account',
            selector: row => row.act_cd,
            sortable: true,
            accessor: 'account',
            width: '150px',
        },
        {
            name: 'Cheque/MICR No',
            selector: row => row.cheque_no,
            sortable: true,
            accessor: 'cheque_micr_no',
            width: '150px',
        },
        {
            name: 'Narration',
            selector: row => row.narration,
            sortable: true,
            accessor: 'narration',
            width: '120px',
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
            accessor: 'date',
            width: '120px',
        },
        {
            name: 'Amount',
            selector: row => row.amount,
            sortable: true,
            accessor: 'amount',
            right: true,
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {parseFloat(row.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
            width: '120px',
        },
        {
            name: 'Dr/Cr',
            selector: row => row.drcr,
            sortable: true,
            width: '120px',
        },
        {
            name: 'Select',
            cell: (row) => (

                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id={`tooltip-select-${row.amount}`}>
                            {selectedRowsTable2.includes(row) ? 'Deselect' : 'Select'} Amount {row.amount}
                        </Tooltip>
                    }
                >
                    <button
                        className={`btn btn-sm ${selectedRowsTable2.includes(row) ? 'btn-custom-selected' : 'btn-custom-unselected'} btn-custom-icon`}
                        onClick={() => handleRowSelect2(row)}
                        style={{ marginLeft: '20px' }}
                    >
                        {selectedRowsTable2.includes(row) ? <FaCheck /> : <FaTimes />}
                    </button>
                </OverlayTrigger>


            ),
            allowOverflow: true,
            width: '7%',
            style: {
                borderRight: 'none',
            },
        },
    ];



    return (
        <div className="container-common">
            <div className=" card">
                <div className="card-header-css">
                    <h3 className="text-center">Bank Reco</h3>
                </div>
                <div className="card-body">
                    <Row className="mb-3">
                        <Col xs={12} md={6}>
                            <div className="d-flex flex-column flex-md-row align-items-center">
                                {/* <div className="mb-2 mb-md-0 me-md-5 align-middle"> */}
                                <Form.Label className='form-label-br'>Bank Name</Form.Label>
                                <Form.Select aria-label="Default select example " className="form-control-br"
                                    name="branchcd" value={filters.branchcd} onChange={handleChange} >
                                    <option value="Select Branch">Select Bank Name</option>
                                    <option value="Bank 1">Bank 1</option>
                                    <option value="Bank 2">Bank 2</option>
                                    <option value="Bank 3">Bank 3</option>
                                </Form.Select>
                            </div>
                            {/* </div> */}
                        </Col>

                        <Col xs={12} md={6}>
                            <div className="d-flex flex-column flex-md-row align-items-center">
                                <Form.Label className="form-label-br">Account Number</Form.Label>
                                <Form.Select aria-label="Default select example  form-control-sm"
                                    className="form-select-br" name='settlementNo'
                                    value={filters.settlementNo} onChange={handleChange} >
                                    <option value="">Select Account Number</option>
                                    <option value="Account Number 1">Account Number 1</option>
                                    <option value="Account Number 2">Account Number 2</option>
                                    <option value="Account Number 3">Account Number 3</option>
                                </Form.Select>
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col xs={12} md={6}>
                            <div className="d-flex flex-column flex-md-row align-items-center">
                                <Form.Label className='form-label-br'>Form Date</Form.Label>
                                <Form.Control type="date" className="form-control-br" name="fromdt"
                                    value={filters.fromdt} onChange={handleChange} />
                            </div>
                        </Col>
                        <Col xs={12} md={6}>
                            <div className="d-flex flex-column flex-md-row align-items-center">
                                <Form.Label className='form-label-br '>To Date</Form.Label>
                                <Form.Control type="date" className="form-control-br" name="todt"
                                    value={filters.todt} onChange={handleChange} />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} md={12}>
                            <div className="d-flex flex-column flex-md-row align-items-center">
                                {/* <Form.Label className='form-label-br'>Upload Bank Statement</Form.Label> */}
                                <input className="form-control" id="formFileSm" accept=".csv,.txt" 
                                style={{width:'25rem', marginLeft:'2rem'}}
                                onChange={onInputChange} type="file" size='sm' />
                                <Button onClick={onUploadBankFileSubmit} className="btn-primary me-3" >Upload</Button>
                            <Button style={{ width: '8rem' }} onClick={handleProcessRecoButton} className="btn-primary me-3" >

                                Process Reco
                            </Button>
                            
</div>

                        </Col>

                    </Row>

                    {showTable && (
                        <>
                            <div className='header_margin'>
                                <h6>Unmatched entries from Bank Statement after processing Statement</h6>
                            </div>
                            <div className='table-responsive'>
                                <DataTable
                                    id='data-table'
                                    columns={columns}
                                    data={data}
                                    customStyles={customStyles}
                                    highlightOnHover
                                    dense
                                    pagination
                                />
                            </div>
                            <div className='header_margin'>
                                <h6>Unmatched Receipt/Payment Entries from Fin_Vouchers after processing Statement</h6>
                            </div>
                            <div className='table-responsive'>
                                <DataTable
                                    columns={columnsSummary}
                                    data={summarydata}
                                    progressPending={pending}
                                    customStyles={customStyles}
                                    highlightOnHover
                                    dense
                                    pagination
                                />
                            </div>
                            <div className='btn_update'>
                                <Button variant="primary" onClick={'#'} className="mr-2 ms update_btn" size='sm'>
                                    Update
                                </Button>
                                <Button variant="secondary" onClick={handleSubmitSelectedData} className="mx-2 update_btn" size='sm'>
                                    Match Data
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BankReco;
