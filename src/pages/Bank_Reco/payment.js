// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { Modal, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import './payment.css'; // Import custom styles
import axios from 'axios';
import searchIcon from './image/search.png';
import deleteIcon from './image/delete.png';
import PopupSearch from './seacrhAccountPopup';


function Payment_Voucher({ BankDetails, onClose, onRowSelect }) {
    const [details, setDetails] = useState([]);
    const [TransactionType, setTransactionType] = useState('');
    const [cbaccount, setCBAccount] = useState('');
    const [cbaccounts, setCBAccounts] = useState([]);
    const [paymentMode, setPaymentMode] = useState('CHQ');
    const [payeeName, setPayeeName] = useState('');
    const [refNo, setRefNo] = useState('');
    const [chequeNo, setChequeNo] = useState('');
    const [analyzerCode, setAnalyzerCode] = useState('');
    const [analyzerCodes, setAnalyzerCodes] = useState([]);
    const [nsebankanalyzerCode, setNSEBankAnalyzerCode] = useState('');
    const [nsebankanalyzerCodes, setNSEBankAnalyzerCodes] = useState([]);
    const [nseclientanalyzerCode, setNSEClientAnalyzerCode] = useState('');
    const [nseclientanalyzerCodes, setNSEClientAnalyzerCodes] = useState([]);
    const [amount, setAmount] = useState('');
    const [bookType, setBookType] = useState('');
    const [bookTypes, setBookTypes] = useState([]);
    const [exchanges, setExchanges] = useState([]);
    const [voucherDate, setVoucherDate] = useState('');
    const [voucherNo, setVoucherNo] = useState('');
    const [effectiveDate, setEffectiveDate] = useState('');
    const [narration, setNarration] = useState('');
    const [totals, setTotals] = useState({ drTotal: 0, crTotal: 0, balance: 0 });
    const [showModal, setShowModal] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [drCrType, setDrCrType] = useState('');
    const [header, setHeader] = useState({});
    //const [transType, setTransType] = useState('PaymentVoucher');
    const [userId, setUserId] = useState(1);
    const [bankBalance, setBankBalance] = useState('');
    const [DrCr, setDrCr] = useState('');
    const [dr_cr, setdr_cr] = useState('');




    useEffect(() => {
        // Assuming BankDetails might be an array
        if (Array.isArray(BankDetails) && BankDetails.length > 0) {
            const details = BankDetails[0]; // Just an example; select the appropriate item
            setDrCr(details.debit_credit || '');
            setCBAccount(details.cbaccount || '');
            setVoucherNo(details.voucherNo || '');
            setChequeNo(details.cheque_refernce_no || '');
            setAmount(details.amount || '');
            setVoucherDate(details.voucherDate || '');
            setEffectiveDate(details.effectiveDate || '');
            setPayeeName(details.payeeName || '');
            setRefNo(details.particular || '');
            setAnalyzerCode(details.analyzerCode || '');
            setNSEBankAnalyzerCode(details.nsebankanalyzerCode || '');
            setNSEClientAnalyzerCode(details.nseclientanalyzerCode || '');
            setBookType(details.bookType || '');
            setNarration(details.narration || '');
            setBankBalance(details.balance || '');
        } else if (BankDetails && typeof BankDetails === 'object') {
            setDrCr(BankDetails.debit_credit || '');
            setCBAccount(BankDetails.cbaccount || '');
            setVoucherNo(BankDetails.voucherNo || '');
            setChequeNo(BankDetails.chequeNo || '');
            setAmount(BankDetails.amount || '');
            setVoucherDate(BankDetails.voucherDate || '');
            setEffectiveDate(BankDetails.effectiveDate || '');
            setPayeeName(BankDetails.payeeName || '');
            setRefNo(BankDetails.refNo || '');
            setAnalyzerCode(BankDetails.analyzerCode || '');
            setNSEBankAnalyzerCode(BankDetails.nsebankanalyzerCode || '');
            setNSEClientAnalyzerCode(BankDetails.nseclientanalyzerCode || '');
            setBookType(BankDetails.bookType || '');
            setNarration(BankDetails.narration || '');
            setBankBalance(BankDetails.bankBalance || '');
        }
    }, [BankDetails]);


    useEffect(() => {
        setdr_cr(DrCr === 'DR' ? 'Cr' : 'Dr');
    }, [DrCr]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/cash_bank_master')
            .then(response => setCBAccounts(response.data))
            .catch(error => console.error('Error fetching cash bank accounts:', error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/bookType')
            .then(response => setBookTypes(response.data))
            .catch(error => console.error('Error fetching book types:', error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/exchange')
            .then(response => setExchanges(response.data))
            .catch(error => console.error('Error fetching exchanges:', error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/SSL_AnalyzerCode')
            .then(response => setAnalyzerCodes(response.data))
            .catch(error => console.error('Error fetching SSL Analyzer Codes:', error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/NSE_Bank_AnalyzerCode')
            .then(response => setNSEBankAnalyzerCodes(response.data))
            .catch(error => console.error('Error fetching NSE Bank Analyzer Codes:', error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/NSE_Client_AnalyzerCode')
            .then(response => setNSEClientAnalyzerCodes(response.data))
            .catch(error => console.error('Error fetching NSE Client Analyzer Codes:', error));
    }, []);

    useEffect(() => {
        if (details.length === 0) {
            setDetails([{ act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', segment: '', exchange: '', noraml_deposit: '', narration: '', analyzer_code: '' }]);
        }
    }, [details, setDetails]);

    const handleAddRow = () => {
        setDetails([...details, { act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', segment: '', exchange: '', noraml_deposit: '', narration: '', analyzer_code: '' }]);
    };

    const handleDeleteRow = (index) => {
        const deletedRow = details[index];
        setDetails(details.filter((_, i) => i !== index));

        // Recalculate totals after deleting row
        if (deletedRow.dr_cr === 'Dr') {
            const drTotal = totals.drTotal - parseFloat(deletedRow.dr_amount || 0);
            const balance = Math.abs(drTotal - totals.crTotal);
            setTotals({ ...totals, drTotal, balance });
        } else if (deletedRow.dr_cr === 'Cr') {
            const crTotal = totals.crTotal - parseFloat(deletedRow.cr_amount || 0);
            const balance = Math.abs(totals.drTotal - crTotal);
            setTotals({ ...totals, crTotal, balance });
        }
    };

    // const handleTypeChange = (index, type) => {
    //     const newDetails = [...details];
    //     newDetails[index].dr_cr = type;
    //     setDetails(newDetails);
    //     setDrCrType(type);
    // };



    const handleInputChange = (index, field, value) => {
        const newDetails = [...details];
        newDetails[index][field] = value;
        newDetails[index].dr_cr = dr_cr;
        if (value === '') {
            value = '0';
        }
        if (field === 'dr_amount' || field === 'cr_amount') {
            const drTotal1 = newDetails.reduce((sum, item) => item.dr_cr === 'Dr' ? sum + parseFloat(item.dr_amount || 0) : sum, 0);
            const crTotal2 = newDetails.reduce((sum, item) => item.dr_cr === 'Cr' ? sum + parseFloat(item.cr_amount || 0) : sum, 0);


            const parsedAmount = parseFloat(amount || '0');
            console.log('amount', parsedAmount)

            let drTotal3 = 0;
            let crTotal4 = 0;
            if (DrCr === 'DR') {
                drTotal3 = parsedAmount;
            } else if (DrCr === 'CR') {
                crTotal4 = parsedAmount;

            }

            const drTotal = (drTotal1 + drTotal3)
            const crTotal = (crTotal2 + crTotal4)

            const balance = Math.abs(drTotal - crTotal);

            setTotals({ drTotal, crTotal, balance });
        }
        setDetails(newDetails);
    };


    const handleAmountChange = (e) => {
        setAmount(e.target.value);

    };

    useEffect(() => {
        const parsedAmount = parseFloat(amount || '0');
        let drTotal = totals.drTotal;
        let crTotal = totals.crTotal;

        if (DrCr === 'DR') {
            drTotal += parsedAmount;
        } else if (DrCr === 'CR') {
            crTotal += parsedAmount;
        }

        const balance = Math.abs(drTotal - crTotal);
        setTotals({ drTotal, crTotal, balance });
    }, [amount, DrCr]);





    const handleSearchClick = (index, exchange, segment) => {
         
        if (!exchange) {
            alert('Please select Exchange.');
            return;
        }
        if (!segment) {
            alert('Please select Segment.');
            return;
        }
        setSelectedRowIndex(index);
        setShowModal(true);
    };

    const handleFinalSave = () => {
        const headerData = {
            cbaccount,
            voucherNo,
            voucherDate,
            effectiveDate,
            paymentMode,
            payeeName,
            refNo,
            chequeNo,
            nsebankanalyzerCode,
            analyzerCode,
            amount,
            narration,
            bookType,
            //transType,
            userId,
            TransactionType,
        };
        setHeader(headerData);
        const data = {
            header: headerData,
            details,

        };
        alert(JSON.stringify(data));
        onRowSelect(data);
        var resValidate = calculateTotals(details);

        console.log('resValidate', resValidate)

        if (resValidate == 0) {
            axios.post('http://localhost:3004/insert_fin_trans', data)
                .then(response => {
                    alert('Voucher saved successfully!');
                    // Reset form state after successful save
                    setBookType('');
                    setVoucherDate('');
                    setEffectiveDate('');
                    setNarration('');
                    setDetails([{ act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', segment: '', exchange: '', noraml_deposit: '', narration: '', analyzer_code: '' }]);
                    setTotals({ drTotal: 0, crTotal: 0, balance: 0 });

                })
                .catch(error => console.error('Error saving voucher:', error));

        }
        else {
            alert('The difference between the two values is non-zero. Exiting without saving.');
        }
    };

    const headerText = TransactionType === 'Payment' ? 'Payment Voucher' :
        TransactionType === 'Receipt' ? 'Receipt Voucher' :
            'Payment / Receipt Voucher';


    const calculateTotals = (data) => {
        
        const drTotal1 = data
            .filter((item) => item.dr_cr === 'Dr')
            .reduce((sum, item) => sum + parseFloat(item.dr_amount), 0);
        const crTotal2 = data
            .filter((item) => item.dr_cr === 'Cr')
            .reduce((sum, item) => sum + parseFloat(item.cr_amount), 0);
        
        const parsedAmount = parseFloat(amount || '0');
        console.log('amount', parsedAmount)

        let drTotal3 = 0;
        let crTotal4 = 0;
        if (DrCr === 'DR') {
            drTotal3 = parsedAmount;
        } else if (DrCr === 'CR') {
            crTotal4 = parsedAmount;

        }

        const drTotal = (drTotal1 + drTotal3)
        const crTotal = (crTotal2 + crTotal4)

        const balance = drTotal - crTotal;
        setTotals({ drTotal, crTotal, balance });

        const difference = Math.abs(balance);
        console.log('dr', drTotal);
        console.log('cr', crTotal);
        console.log('total', balance);
        return difference;

        // Add your save logic here
        //alert('Values are equal. Saving data...');
    };

    const handleSelectRow = (rowData) => {
        const { act_name, act_cd, branch_cd, cmp_cd, type_cd } = rowData;
        const newDetails = [...details];
        newDetails[selectedRowIndex].act_name = act_name;
        newDetails[selectedRowIndex].act_cd = act_cd;
        newDetails[selectedRowIndex].branch_cd = branch_cd;
        newDetails[selectedRowIndex].cmp_cd = cmp_cd;
        newDetails[selectedRowIndex].type_cd = type_cd;
        // console.log("accountName", act_name)
        console.log("act_cd", act_cd)
        // console.log("comp_cd", cmp_cd)
        // console.log("type_cd", type_cd)
        // console.log("branch_cd", branch_cd)
        setDetails(newDetails);
        
        setShowModal(false);
    };



    // const handleCashBank = async (p_cb_act_code) => {
    //     try {
    //         const response = await axios.get(`http://localhost:3001/api/cash_bank_master/${p_cb_act_code}`);
    //         setBankBalance(response.data.bank_balance);
    //     } catch (error) {
    //         console.error('Error fetching bank balance:', error);
    //     }
    // };

    const columns = [
        
        {
            name: 'Segment',
            selector: row => row.segment,
            cell: (row, index) => (
                <select
                    value={row.segment}
                    onChange={e => handleInputChange(index, 'segment', e.target.value)}
                    className="form-control">
                    <option value="">Select Segment</option>
                    <option value="C">Cash Market</option>
                    {/* <option value="2">Segment 2</option> */}
                    {/* Add more options as needed */}
                </select>
            ),
            width: '100px',
        },
        {
            name: 'Exchange',
            selector: row => row.exchange,
            cell: (row, index) => (
                <select
                    value={row.exchange}
                    onChange={e => handleInputChange(index, 'exchange', e.target.value)}
                    className="form-control"
                >
                    <option value="">Select Exchange</option>
                    {exchanges.map(exchange => (
                        <option key={exchange.exc_cd} value={exchange.exc_cd}>{exchange.exc_name}</option>
                    ))}
                </select>
            ),
            width: '100px',
        },
        {
            name: 'Normal/Deposit',
            selector: row => row.noraml_deposit,
            cell: (row, index) => (
                <select
                    value={row.noraml_deposit}
                    onChange={e => handleInputChange(index, 'noraml_deposit', e.target.value)}
                    className="form-control"
                >
                    <option value="">Select Normal/Deposit</option>
                    <option value="N">Normal</option>
                    <option value="D">Deposit</option>
                    {/* Add more options as needed */}
                </select>
            ),
            width: '100px',
        },
        {
            name: 'Account Name',
            selector: 'act_name',
            sortable: false,
            cell: (row, index) => (
                <div className='d-flex'>
                    <input
                        type="text"
                        value={row.act_name}
                        onChange={e => handleInputChange(index, 'act_name', e.target.value)}
                        className="form-control"
                    />
                    <OverlayTrigger
                        placement="top" // Position the tooltip above the button
                        overlay={
                            <Tooltip id={`tooltip-search-${index}`}>
                                Search Account
                            </Tooltip>
                        }
                    >
                        <img
                            src={searchIcon}
                            alt="Search"
                            onClick={() => handleSearchClick(index, row.exchange, row.segment)}
                            style={{
                                width: '20px', // Adjust size as needed
                                height: '20px',
                                marginTop: '7px'
                            }}
                        />
                    </OverlayTrigger>
                    <Modal show={showModal} onHide={() => setShowModal(false)} className="custom-modal">
                        <Modal.Header style={{ backgroundColor: '#0275d8', color: 'white' }} closeButton>
                            <Modal.Title >Search and Select Account</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <PopupSearch onSelectRow={handleSelectRow} exchange={row.exchange} segment={row.segment} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>

            ),
            width: '200px',
        },
        {
            name: 'Dr/Cr',
            selector: (row, index) => (

                <input
                    type="text"
                    value={dr_cr}
                    //onChange={e => handleTypeChange(index, e.target.value)}
                    className="form-control"
                    readOnly
                />
            ),
            width: '70px',
        },

        {
            name: 'Debit Amount',
            selector: row => row.dr_amount,
            cell: (row, index) => {
                // Format the amount for display
                const formattedAmount = parseFloat(row.dr_amount || '0').toLocaleString('en-IN', { maximumFractionDigits: 2 });

                return (
                    <input
                        type="text"
                        value={formattedAmount}
                        onChange={e => {
                            // Convert formatted value back to number
                            const rawValue = e.target.value.replace(/,/g, ''); // Remove commas for parsing
                            handleInputChange(index, 'dr_amount', rawValue);
                        }}
                        className="form-control"
                        style={{ textAlign: 'right' }}
                        disabled={dr_cr !== 'Dr'} // Disable if not 'Cr' is selected
                    />
                );
            },
            width: '150px',
        },
        {
            name: 'Credit Amount',
            selector: row => row.cr_amount,
            cell: (row, index) => {
                // Format the amount for display
                const formattedAmount = parseFloat(row.cr_amount || '0').toLocaleString('en-IN', { maximumFractionDigits: 2 });

                return (
                    <input
                        type="text"
                        value={formattedAmount}
                        onChange={e => {
                            // Convert formatted value back to number
                            const rawValue = e.target.value.replace(/,/g, ''); // Remove commas for parsing
                            handleInputChange(index, 'cr_amount', rawValue);
                        }}
                        className="form-control"
                        style={{ textAlign: 'right' }}
                        disabled={dr_cr !== 'Cr'} // Disable if not 'Cr' is selected
                    />
                );
            },
            width: '150px',
        },

        {
            name: 'NSE Client Analyzer',
            selector: row => row.nse_clnt_analyzer_code,
            cell: (row, index) => (
                <select
                    value={row.nse_clnt_analyzer_code}
                    onChange={e => handleInputChange(index, 'nse_clnt_analyzer_code', e.target.value)}
                    className="form-control">
                    <option value="">Select NSE Client Analyzer Code</option>
                    {nseclientanalyzerCodes.map(NC_Analy_Cd => (
                        <option key={NC_Analy_Cd.narr_code} value={NC_Analy_Cd.narr_code}>{NC_Analy_Cd.narr_desc}</option>
                    ))}
                </select>
            ),
            width: '220px',
        },
        {
            name: 'SSL Analyzer Code',
            selector: row => row.analyzer_code,
            cell: (row, index) => (
                <select
                    value={row.analyzer_code}
                    onChange={e => handleInputChange(index, 'analyzer_code', e.target.value)}
                    className="form-control">
                    <option value="">Select NSE Client Analyzer Code</option>
                    <option value="1"> Analyzer Code 1</option>
                    
                    {/* {analyzerCodes.map(Analyzer_Cd => (
                        <option key={Analyzer_Cd.narr_code} value={Analyzer_Cd.narr_code}>{Analyzer_Cd.narr_desc}</option>
                    ))} */}
                </select>
            ),
            width: '220px',
        },
        {
            name: 'Narration',
            selector: row => row.narration,
            cell: (row, index) => (
                <div className='d-flex'>
                    <textarea
                        type="text"
                        value={row.narration}
                        onChange={e => handleInputChange(index, 'narration', e.target.value)}
                        className="form-control select_color textarea"

                    >{row.narration}</textarea>

                    <OverlayTrigger
                        placement="top" // Position the tooltip above the button
                        overlay={
                            <Tooltip id={`tooltip-delete-${index}`}>
                                Delete
                            </Tooltip>
                        }
                    >
                        <img
                            src={deleteIcon}
                            alt="Delete"
                            onClick={() => handleDeleteRow(index)}
                            style={{
                                width: '20px', // Adjust size as needed
                                height: '20px',
                                marginTop: '7px'
                            }}
                        />
                    </OverlayTrigger>
                </div>
            ),
            allowOverflow: true,
            //width: '200px',
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
                paddingRight: '3px', // Adjust padding as needed
                // Include other styles as needed
            },
        },
        cells: {
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: 'blue',
                paddingLeft: '3px',
                paddingRight: '3px', // Adjust padding as needed
                // Include other styles as needed
            },
        },
        rows: {
            style: {
                paddingLeft: '3px',
                paddingRight: '3px', // Adjust padding as needed
                // Include other styles as needed
            },
        },
        actionsHeader: {
            style: {
                borderRightStyle: 'none', // Remove border-right for Actions column header
            },
        },
        // Specific styles for Actions column cells
        actionsCell: {
            style: {
                borderRightStyle: 'none', // Remove border-right for Actions column cells
                paddingLeft: '3px',
                paddingRight: '3px', // Ensure padding remains consistent
            },
        },
    };


    return (
        <div className="container mt-5 paymentPopup" >
            <div className="card paymentPopup-innear">
                <div className="card-header text-center color_header">
                    <h5>{headerText}</h5>
                </div>
                <div className="card-body">
                    {/*  ****************************************************************************
                                   Cash/Bank Account and Voucher No
            **************************************************************************** */}
                    <div className="row" >
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="cbaccount" className="form-label label-width-pay-rcpt label_color">Cash/Bank A/c</label>
                            <select id="cbaccount" className="form-select size_input_contra" name='cbaccount' value={cbaccount}
                            >
                                <option value=" ">Select Cash Bank A/c</option>
                                {cbaccounts.map(CB_Act => (
                                    <option key={CB_Act.cb_act_cd} value={CB_Act.cb_act_cd}>{CB_Act.bank_ac_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="voucherNo" className="form-label label-width-pay-rcpt input-pay-rcpt label_color">Voucher No</label>
                            <input id="voucherNo" type="number" className="form-control size_input_pay_rcpt " value={voucherNo} onChange={(e) => setVoucherNo(e.target.value)}  />
                        </div>
                    </div>
                    {/*  ****************************************************************************
                                   Voucher and Effective Date
            **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="voucherDate" className="form-label label-width-pay-rcpt label_color">Voucher Date </label>
                            <input id="voucherDate" type="date" className="form-control size_input_pay_rcpt" value={voucherDate} onChange={(e) => setVoucherDate(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="effectiveDate" className="form-label label-width-pay-rcpt input-pay-rcpt label_color">Effective Date </label>
                            <input id="effectiveDate" type="date" className="form-control size_input_pay_rcpt" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
                        </div>
                    </div>
                    {/*  ****************************************************************************
                                   Payment Mode and Payee Name
            **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="paymentMode" className="form-label label-width-pay-rcpt label_color">Payment Mode</label>
                            <select id="paymentMode" className="form-select size_input_pay_rcpt" name='paymentMode' value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                                <option value="CHQ">Cheque</option>
                                <option value="NEFT">NEFT</option>
                                <option value="IMPS">IMPS</option>
                                <option value="RTGS">RTGS</option>
                                <option value="RTGS">UPI</option>
                                <option value="FTRAN">Funds Transfer</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="payeeName" className="form-label label-width-pay-rcpt input-pay-rcpt label_color">Payee Name</label>
                            <input id="payeeName" type="text" className="form-control size_input_pay_rcpt" value={payeeName} onChange={(e) => setPayeeName(e.target.value)} />
                        </div>
                    </div>
                    {/*  ****************************************************************************
                                   Reference No. and Cheque No.
            **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="refNo" className="form-label label-width-pay-rcpt label_color">Reference No.</label>
                            <input id="refNo" type="text" className="form-control size_input_pay_rcpt label_color" value={refNo} onChange={(e) => setRefNo(e.target.value)} />
                        </div>

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="chequeNo" className="form-label label-width-pay-rcpt input-pay-rcpt label_color">Cheque No.</label>
                            <input id="chequeNo" type="text" className="form-control size_input_pay_rcpt" value={chequeNo} onChange={(e) => setChequeNo(e.target.value)} />
                        </div>

                    </div>
                    {/*  ****************************************************************************
                                   NSE Bank Analyzer Codes and SSL Analyzer Code
            **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="nsebankanalyzerCode" className="form-label label-width-pay-rcpt label_color">NSE Bank Analyzer </label>
                            <select id="nsebankanalyzerCode" className="form-select size_input_pay_rcpt label_color" name='nsebankanalyzerCode' value={nsebankanalyzerCode}
                                onChange={(e) => setNSEBankAnalyzerCode(e.target.value)}>
                                <option value=" ">Select NSE Bank Analyzer Code</option>
                                {nsebankanalyzerCodes.map(NB_Analy_Cd => (
                                    <option key={NB_Analy_Cd.narr_code} value={NB_Analy_Cd.narr_code}>{NB_Analy_Cd.narr_desc}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="analyzerCode" className="form-label label-width-pay-rcpt input-pay-rcpt label_color">SSL Analyzer</label>
                            <select id="analyzerCode" className="form-select size_input_pay_rcpt" name='analyzerCode' value={analyzerCode}
                                onChange={(e) => setAnalyzerCode(e.target.value)}>
                                <option value=" ">Select SSL Analyzer Code</option>
                                {analyzerCodes.map(Analyzer_Code => (
                                    <option key={Analyzer_Code.narr_code} value={Analyzer_Code.narr_code}>{Analyzer_Code.narr_desc}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/*  ****************************************************************************
                                   Amount and Narration
            **************************************************************************** */}

                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="amount" className="form-label label-width-pay-rcpt label_color">
                                Amount ({DrCr})
                            </label>
                            <input
                                id="amount"
                                type="number"
                                className="form-control size_input_pay_rcpt"
                                value={amount}
                                onChange={handleAmountChange}
                                style={{ textAlign: 'end' }}
                            />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="narration" className="form-label label-width-pay-rcpt input-pay-rcpt label_color">Narration </label>
                            <input id="narration" type="text" className="form-control size_input_pay_rcpt" value={narration} onChange={(e) => setNarration(e.target.value)} />
                        </div>

                    </div>
                    {/*  ****************************************************************************
                                      Bank Balance and Book Type
              **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="bankBalance" className="form-label label-width-pay-rcpt label_color">Bank Balance</label>
                            <input id="bankBalance" type="text" className="form-control size_input_pay_rcpt" value={bankBalance}
                                style={{ backgroundColor: 'lightgray', fontWeight: 'bold', fontSize: '16px', textAlign: 'end' }} />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="bookType" className="form-label label-width-pay-rcpt input-pay-rcpt label_color">Book Type</label>
                            <select id="bookType" className="form-select size_input_pay_rcpt" name='bookType' value={bookType} style={{ marginLeft: '3px' }}
                                onChange={(e) => setBookType(e.target.value)}>
                                <option value=" ">Select Book type</option>
                                {bookTypes.map(BookTypes => (
                                    <option key={BookTypes.book_type} value={BookTypes.book_type}>{BookTypes.book_type}</option>
                                ))}
                            </select>
                        </div>


                    </div>
                    
                    
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex  justify-content-end ">
                            <button className="btn btn-success " onClick={handleFinalSave}>Save</button>
                        </div>
                    </div>
                    {/*  ****************************************************************************
                                      Save and Edit Buttons
              **************************************************************************** */}
                    <div className="row ">
                        <div className="col">
                            <DataTable columns={columns} data={details} customStyles={customStyles} responsive />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mb-3 mt-3">
                        <button className="btn btn-success me-2" onClick={handleAddRow}>Add</button>
                        <button className="btn btn-secondary" onClick={onClose}>close</button>
                    </div>
                    <div className='d-flex justify-content-around'>
                        <p className='label_color'>Total Dr: {totals.drTotal}</p>
                        <p className='label_color'>Total Cr: {totals.crTotal}</p>
                        <p className='label_color'>Balance: {totals.balance}</p>
                    </div>

                </div>
            </div>

        </div>
    );
};
export default Payment_Voucher;
