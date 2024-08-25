// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { Modal, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import './journal.css'; // Import custom styles
import axios from 'axios';
import PopupSearch from './popsearch.js';
import EditVoucherPopup from './EditVoucherPopup.js';
import SearchBill from './searchBill.js';
import searchIcon from './image/search.png';
import deleteIcon from './image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { BASE_URL } from "../constants";

function Payment_Voucher({ details, setDetails }) {

    const [cbaccount, setCBAccount] = useState();
    const [cbaccounts, setCBAccounts] = useState([]);
    const [paymentMode, setPaymentMode] = useState();
    const [payeeName, setPayeeName] = useState();
    const [refNo, setRefNo] = useState();
    const [chequeNo, setChequeNo] = useState();
    const [analyzerCode, setAnalyzerCode] = useState();
    const [analyzerCodes, setAnalyzerCodes] = useState([]);
    const [nsebankanalyzerCode, setNSEBankAnalyzerCode] = useState();
    const [nsebankanalyzerCodes, setNSEBankAnalyzerCodes] = useState([]);
    const [nseclientanalyzerCode, setNSEClientAnalyzerCode] = useState();
    const [nseclientanalyzerCodes, setNSEClientAnalyzerCodes] = useState([]);
    const [amount, setAmount] = useState('');
    const [bookType, setBookType] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [bookTypes, setBookTypes] = useState([]);
    const [exchanges, setExchanges] = useState([]);
    const [voucherDate, setVoucherDate] = useState('');
    const [voucherNo, setVoucherNo] = useState('');
    const [effectiveDate, setEffectiveDate] = useState('');
    const [narration, setNarration] = useState('');
    const [totals, setTotals] = useState({ drTotal: 0, crTotal: 0, balance: 0 });
    const [showModal, setShowModal] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [dr_cr, setdr_cr] = useState('');
    const [header, setHeader] = useState({});
    //const [transType, setTransType] = useState('PaymentVoucher');
    const [userId, setUserId] = useState(1);
    const [bankBalance, setBankBalance] = useState();
    const [showBillPopup, setShowBillPopup] = useState(false);
    const [vendorDetails, setVendorDetails] = useState(null);
    const [TransactionType, setTransactionType] = useState('');

    useEffect(() => {
        setdr_cr(TransactionType === 'Payment' ? 'Cr' : 'Dr');
    }, [TransactionType]);

    useEffect(() => {
        //'http://localhost:3001/api/cash_bank_master
        axios.get(`${BASE_URL}/api/cash_bank_master`)
            .then(response => setCBAccounts(response.data))
            .catch(error => console.error('Error fetching cash bank accounts:', error));
    }, []);
    //console.log('vendordetails', vendorDetails);
    useEffect(() => {
        axios.get(`${BASE_URL}/api/bookType`)
            .then(response => setBookTypes(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/exchange`)
            .then(response => setExchanges(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/SSL_AnalyzerCode`)
            .then(response => setAnalyzerCodes(response.data))
            .catch(error => console.error('Error fetching analyzer:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/NSE_Bank_AnalyzerCode`)
            .then(response => setNSEBankAnalyzerCodes(response.data))
            .catch(error => console.error('Error fetching NSE Bank analyzer:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/NSE_Client_AnalyzerCode`)
            .then(response => setNSEClientAnalyzerCodes(response.data))
            .catch(error => console.error('Error fetching NSE Bank analyzer:', error));
    }, []);


    const getCurrDate = () => {
        var today = new Date();
        // alert("Hello in currdate", today.getDate());
        // document.getElementById("voucherDate").value = today.getDate();
    }

    useState(() => {
        //console.log('details', details);
        if (details.length === 0) {
            setDetails([{ act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', segment: '', exchange: '', noraml_deposit: '', narration: '', analyzer_code: '', nse_clnt_analyzer_code: '' }]);
        }
    });

    const handleAddRow = () => {
        setDetails([...details, { act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', segment: '', exchange: '', noraml_deposit: '', narration: '', analyzer_code: '',  nse_clnt_analyzer_code: ''  }]);
    };

    const handleEditClick = () => {
        setShowPopup(true);
    };

    const handleBillClick = () => {
        setShowBillPopup(true);
    };

    const handleBillRowSelect = (row) => {
        // Handle row selection
        //console.log('Selected row:', row);
        setVendorDetails(row);


    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleBillClosePopup = () => {
        setShowBillPopup(false);
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
            //console.log('amount', parsedAmount)

            let drTotal3 = 0;
            let crTotal4 = 0;
            const DrCr = (TransactionType === 'Payment' ? 'Dr' : 'Cr')
            if (DrCr === 'Dr') {
                drTotal3 = parsedAmount;
            } else if (DrCr === 'Cr') {
                crTotal4 = parsedAmount;

            }

            const drTotal = (drTotal1 + drTotal3)
            const crTotal = (crTotal2 + crTotal4)

            const balance = Math.abs(drTotal - crTotal);

            setTotals({ drTotal, crTotal, balance });
        }
        setDetails(newDetails);
    };

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

    const headerText = TransactionType === 'Payment' ? 'Payment Voucher' :
        TransactionType === 'Receipt' ? 'Receipt Voucher' :
            'Payment / Receipt Voucher';

    const handleVoucharRowSelect = (fin_year, voucher_no, book_type, trans_date, eff_date, cb_act_cd, amount, drcr, segment, exchange, branch_cd, cmp_cd, normal_deposit, act_cd, narration, narr_code) => {
        setBookType(book_type);
        setEffectiveDate(eff_date);
        setVoucherDate(trans_date);
        setVoucherNo(voucher_no);
        const newDetails = [...details];
        const selectedRow = newDetails[selectedRowIndex];

        selectedRow.segment = segment;
        selectedRow.exchange = exchange;
        selectedRow.noraml_deposit = normal_deposit;
        selectedRow.act_name = cb_act_cd;
        selectedRow.dr_cr = drcr;
        if (drcr === 'Dr') {
            selectedRow.dr_amount = amount;
            selectedRow.cr_amount = '';
        } else {
            selectedRow.cr_amount = amount;
            selectedRow.dr_amount = '';
        }
        selectedRow.narration = narration;
        selectedRow.analyzer_code = narr_code;

        setDetails(newDetails);
        // console.log('segment', segment);
        // console.log('exc_cd', exc_cd);
        // console.log('nor_depos', nor_depos);
        // console.log('cb_act_cd', cb_act_cd);
        // console.log('drcr', drcr);
        // console.log('drcr', amount);
        // console.log('drcr', narration);
        // console.log('drcr', narr_code)
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
        //console.log("act_cd", act_cd)
        // console.log("comp_cd", cmp_cd)
        // console.log("type_cd", type_cd)
        // console.log("branch_cd", branch_cd)
        setDetails(newDetails);
        setVendorDetails('');
        setShowModal(false);
    };



    const handleFinalSave = () => {
        // console.log("vendoeDetaisl", vendorDetails);
        // console.log('details.segment', details[0].segment);
        // console.log('details.length', details.length);

        var lv_row_cnt = details.length;   
        var lv_sr_no = 1;   
        var lv_msg_txt = '';

        // **************************************************
        // Start : Data table validations
        // **************************************************
       // console.log('details ----> ', details);
       
        for (let i = 0; i < lv_row_cnt; i++)
        {

            if (!details[i].segment) {
                lv_msg_txt = 'Please select Segment at Sr No. ' + lv_sr_no;
                alert(lv_msg_txt);
                return;
            }

            if (!details[i].exchange) {
                lv_msg_txt = 'Please select Exchange at Sr No. ' + lv_sr_no;
                //console.log('exchange',details[i].exchange)
                alert(lv_msg_txt, ' lv_row_cnt ', lv_row_cnt);
                return;
            }

            if (!details[i].noraml_deposit) {
                lv_msg_txt = 'Please select Normal/Deposit at Sr No. ' + lv_sr_no;
                alert(lv_msg_txt);
                return;
            }

            if (!details[i].act_cd) {
                lv_msg_txt = 'Please select Account Name at Sr No. ' + lv_sr_no;
                alert(lv_msg_txt);
                return;
            }

            if (details[i].dr_cr === "Dr") {
                if (!details[i].dr_amount) {
                    lv_msg_txt = 'Please enter Debit Amount at Sr No. ' + lv_sr_no;
                    alert(lv_msg_txt);
                    return;
                }
                else if (details[i].dr_amount <= 0) {
                    lv_msg_txt = 'Please enter Debit Amount greater than 0 at Sr No. ' + lv_sr_no;
                    alert(lv_msg_txt);
                    return;
                }
            }

            if (details[i].dr_cr === "Cr") {
                if (!details[i].cr_amount) {
                    lv_msg_txt = 'Please enter Credit Amount at Sr No. ' + lv_sr_no;
                    alert(lv_msg_txt);
                    return;
                }
                else if (details[i].cr_amount <= 0) {
                    lv_msg_txt = 'Please enter Credit Amount greater than 0 at Sr No. ' + lv_sr_no;
                    alert(lv_msg_txt);
                    return;
                }
            }

            if (!details[i].nse_clnt_analyzer_code) {
                lv_msg_txt = 'Please select NSE Client Analyzer Code at Sr No. ' + lv_sr_no
                alert(lv_msg_txt);
                return;
            }

            if (!details[i].analyzer_code) {
                lv_msg_txt = 'Please select SSL Analyzer Code at Sr No. ' + lv_sr_no
                alert(lv_msg_txt);
                return;
            }

            if (!details[i].narration) {
                lv_msg_txt = 'Please enter Narration at Sr No. ' + lv_sr_no;
                alert(lv_msg_txt);
                return;
            }

            lv_sr_no++;

        } // end of : for (let i = 0; i < lv_row_cnt; i++)
        // **************************************************
        // End : Data Table validations
        // **************************************************

        // **************************************************
        // Start : Header validation 
        // **************************************************

        if (!cbaccount) {
            alert('Please Select Cash/Bank Account.');
            return;
        }

        if (!voucherDate || !effectiveDate) {
            alert('Please enter Voucher Date and Effective Date.');
            return;
        }

        if (!paymentMode) {
            alert('Please Select Payment Mode.');
            return;
        }

        if (!nsebankanalyzerCode) {
            alert('Please Select NSE Bank Analyzer Code');
            return;
        }

        if (!analyzerCode) {
            alert('Please Select SSL Bank Analyzer Code');
            return;
        }

        if (!amount) {
            alert('Please enter Cash/Bank Amount');
            return;
        }

        if (!narration) {
            alert('Please enter Narration');
            return;
        }

        //// **************************************************
        //// End : Header validation 
        //// **************************************************

        setUserId(1);

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
            userId,
            TransactionType
        };
        setHeader(headerData);
        const data = {
            header: headerData,
            details: details,
            vendorDetails: vendorDetails,
        };
        alert(JSON.stringify(data));
        var resValidate = calculateTotals(details);

        console.log('resValidate before save ', resValidate)

        if (resValidate == 0) {
            axios.post(`${BASE_URL}/api/voucher`, data)
                .then(response => {
                    alert('Voucher saved successfully!');
                    // Reset form state after successful save
                    setBookType('');
                    setVoucherDate('');
                    setEffectiveDate('');
                    setNarration('');
                    setDetails([{ act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', segment: '', exchange: '', noraml_deposit: '', narration: '', analyzer_code: '' }]);
                    setTotals({ drTotal: 0, crTotal: 0, balance: 0 });
                    setVendorDetails('');
                })
                .catch(error => console.error('Error saving voucher:', error));

        }
        else {
            alert('The difference between the two values is non-zero. Exiting without saving.');
        }
    };

    const calculateTotals = (data) => {

        const drTotal1 = data
            .filter((item) => item.dr_cr === 'Dr')
            .reduce((sum, item) => sum + parseFloat(item.dr_amount), 0);
        const crTotal2 = data
            .filter((item) => item.dr_cr === 'Cr')
            .reduce((sum, item) => sum + parseFloat(item.cr_amount), 0);

        const parsedAmount = parseFloat(amount || '0');
      //  console.log('amount', parsedAmount)

        let drTotal3 = 0;
        let crTotal4 = 0;
        let DrCr = (TransactionType === 'Payment' ? 'Dr' : 'Cr')
        if (DrCr === 'Dr') {
            drTotal3 = parsedAmount;
        } else if (DrCr === 'Cr') {
            crTotal4 = parsedAmount;

        }

        const drTotal = (drTotal1 + drTotal3)
        const crTotal = (crTotal2 + crTotal4)

        const balance = drTotal - crTotal;
        setTotals({ drTotal, crTotal, balance });

        const difference = Math.abs(balance);
       // console.log('dr', drTotal);
       // console.log('cr', crTotal);
       // console.log('total', balance);
        return difference;

        // Add your save logic here
        //alert('Values are equal. Saving data...');
    };

     // Function to format number with commas
     const formatNumber = (num) => {
        if (!num && num !== 0) return '';
        const [integer, decimal] = num.toString().split('.');
        return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (decimal ? `.${decimal}` : '');
    };

    // Function to parse formatted number
    const parseNumber = (numStr) => {
        return parseFloat(numStr.replace(/,/g, '') || '0');
    };



    const handleAmountChange = (e) => {
        setAmount(e.target.value);

    };

    useEffect(() => {

        const parsedAmount = parseFloat(amount || '0');
       // console.log('parsedAmount', parsedAmount);
       // console.log('total', totals);
        let drTotal = totals.drTotal;
        let crTotal = totals.crTotal;

        let DrCr = (TransactionType === 'Payment' ? 'Dr' : 'Cr')
        //console.log('DrCr', DrCr);
        if (DrCr === 'Dr') {
            drTotal = 0;
            drTotal += parsedAmount;
            //console.log('drTotal----', drTotal);
        } else if (DrCr === 'Cr') {
            crTotal = 0;
            crTotal += parsedAmount;
           // console.log('crTotal---', crTotal);
        }


        const balance = Math.abs(drTotal - crTotal);
        setTotals({ drTotal, crTotal, balance });
    }, [amount, TransactionType]);



    const handleCashBank = async (p_cb_act_code) => {
        try {
            //console.log('handleCashBank actDrCode =>>>>> ', p_cb_act_code);
            getCurrDate();


            setCBAccount(p_cb_act_code);
            //setBankBalance((100000.25).toLocaleString('hi') + ' Cr');

            const response = await axios.get(`${BASE_URL}/api/populatedetails?p_cb_act_cd=` + p_cb_act_code);

            if (response.data.length === 1) {
                //setBranchCode(response.data[0].branch_cd);
                //setSegment(response.data[0].segment);
                setBookType(response.data[0].book_type);
                //setExchangeCode(response.data[0].exc_cd);
            }
            else {
                //setBranchCode('');
                //setSegment('');
                setBookType('');
                setBankBalance(0);
                //setExchangeCode('');
            }

        } catch (error) {
            console.error("Error handleCashBank :", error);
            //alert('Error handleCashBankDebit');
        }

    };

    const handleAmount = async (p_amount) => {
        setAmount((p_amount).toLocaleString('hi'));
    }

    const columns = [
        // {
        //     name: 'Sr',
        //     selector: (row, index) => index + 1,
        //     sortable: true,
        //     width: '60px',
        // },
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
                        readOnly


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
                    {analyzerCodes.map(Analyzer_Cd => (
                        <option key={Analyzer_Cd.narr_code} value={Analyzer_Cd.narr_code}>{Analyzer_Cd.narr_desc}</option>
                    ))}
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
                color: 'black',
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


    const isAccountNamePresent = details.some(row => row.act_name && row.act_name.trim() !== '');


    return (
        <div className="container-common">
    <div className="card">
        <div className="card-header-css">
            <h3>{headerText}</h3>
        </div>
        <div className="card-body">
            {/*  Cash/Bank Account and Voucher No */}
            <div className="row">
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="TransactionTypeCode" className="form-label form-label-pv label-color-common">Transaction Type</label>
                    <select id="TransactionTypeCode" className="form-select form-control-standard" name='TransactionType' value={TransactionType}
                        onChange={(e) => setTransactionType(e.target.value)}>
                        <option value="">Select Transaction Type</option>
                        <option value="Payment">Payment Type</option>
                        <option value="Receipt">Receipt Type</option>
                    </select>
                </div>
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="bookType" className="form-label form-label-pv label-color-common">Book Type</label>
                    <select id="bookType" className="form-select form-control-standard" name='bookType' value={bookType}
                        onChange={(e) => setBookType(e.target.value)}>
                        <option value="">Select Book Type</option>
                        {bookTypes.map(BookTypes => (
                            <option key={BookTypes.book_type} value={BookTypes.book_type}>{BookTypes.book_type}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="cbaccount" className="form-label form-label-pv label-color-common">Cash/Bank A/c</label>
                    <select id="cbaccount" className="form-select form-control-standard" name='cbaccount' value={cbaccount}
                        onChange={(e) => handleCashBank(e.target.value)}>
                        <option value="">Select Cash Bank A/c</option>
                        {cbaccounts.map(CB_Act => (
                            <option key={CB_Act.cb_act_cd} value={CB_Act.cb_act_cd}>{CB_Act.bank_ac_name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="voucherNo" className="form-label form-label-pv label-color-common">Voucher No</label>
                    <input id="voucherNo" type="number" className="form-control form-control-standard" value={voucherNo} onChange={(e) => setVoucherNo(e.target.value)} readOnly />
                </div>
            </div>
            {/*  Voucher and Effective Date */}
            <div className="row">
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="voucherDate" className="form-label form-label-pv label-color-common">Voucher Date</label>
                    <input id="voucherDate" type="date" className="form-control form-control-standard" value={voucherDate} onChange={(e) => setVoucherDate(e.target.value)} />
                </div>
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="effectiveDate" className="form-label form-label-pv label-color-common">Effective Date</label>
                    <input id="effectiveDate" type="date" className="form-control form-control-standard" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
                </div>
            </div>
            {/*  Payment Mode and Payee Name */}
            <div className="row">
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="paymentMode" className="form-label form-label-pv label-color-common">Payment Mode</label>
                    <select id="paymentMode" className="form-select form-control-standard" name='paymentMode' value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                        <option value="CHQ">Cheque</option>
                        <option value="NEFT">NEFT</option>
                        <option value="IMPS">IMPS</option>
                        <option value="RTGS">RTGS</option>
                        <option value="UPI">UPI</option>
                        <option value="FTRAN">Funds Transfer</option>
                    </select>
                </div>
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="payeeName" className="form-label form-label-pv label-color-common">Payee Name</label>
                    <input id="payeeName" type="text" className="form-control form-control-standard" value={payeeName} onChange={(e) => setPayeeName(e.target.value)} />
                </div>
            </div>
            {/*  Reference No. and Cheque No. */}
            <div className="row">
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="refNo" className="form-label form-label-pv label-color-common">Reference No.</label>
                    <input id="refNo" type="text" className="form-control form-control-standard" value={refNo} onChange={(e) => setRefNo(e.target.value)} />
                </div>
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="chequeNo" className="form-label form-label-pv label-color-common">Cheque No.</label>
                    <input id="chequeNo" type="text" className="form-control form-control-standard" value={chequeNo} onChange={(e) => setChequeNo(e.target.value)} />
                </div>
            </div>
            {/*  NSE Bank Analyzer Codes and SSL Analyzer Code */}
            <div className="row">
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="nsebankanalyzerCode" className="form-label form-label-pv label-color-common">NSE Bank Analyzer</label>
                    <select id="nsebankanalyzerCode" className="form-select form-control-standard" name='nsebankanalyzerCode' value={nsebankanalyzerCode}
                        onChange={(e) => setNSEBankAnalyzerCode(e.target.value)}>
                        <option value="">Select NSE Bank Analyzer Code</option>
                        {nsebankanalyzerCodes.map(NB_Analy_Cd => (
                            <option key={NB_Analy_Cd.narr_code} value={NB_Analy_Cd.narr_code}>{NB_Analy_Cd.narr_desc}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="analyzerCode" className="form-label form-label-pv    label-color-common">SSL Analyzer</label>
                    <select id="analyzerCode" className="form-select form-control-standard" name='analyzerCode' value={analyzerCode}
                        onChange={(e) => setAnalyzerCode(e.target.value)}>
                        <option value="">Select SSL Analyzer Code</option>
                        {analyzerCodes.map(Analyzer_Code => (
                            <option key={Analyzer_Code.narr_code} value={Analyzer_Code.narr_code}>{Analyzer_Code.narr_desc}</option>
                        ))}
                    </select>
                </div>
            </div>
            {/*  Amount and Narration */}
            <div className="row">
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="amount" className="form-label form-label-pv label-color-common">Amount ({TransactionType === 'Payment' ? 'Dr' : 'Cr'})</label>
                    <input id="amount" type="number" className="form-control form-control-standard" value={amount}
                        onChange={handleAmountChange} placeholder={TransactionType === 'Payment' ? 'Enter Dr amount' : 'Enter Cr amount'} />
                </div>
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="narration" className="form-label form-label-pv label-color-common">Narration</label>
                    <input id="narration" type="text" className="form-control form-control-standard" value={narration} onChange={(e) => setNarration(e.target.value)} />
                </div>
            </div>
            {/*  Bank Balance and Book Type */}
            <div className="row">
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="bankBalance" className="form-label form-label-pv label-color-common">Bank Balance</label>
                    <input id="bankBalance" type="text" className="form-control form-control-standard" value={bankBalance}
                        readOnly style={{ backgroundColor: 'lightgray', fontWeight: 'bold', fontSize: '16px', textAlign: 'end' }} />
                </div>
                <div className="col-md-6 mb-2 d-flex justify-content-end">
                    <button className="btn btn-primary me-2" onClick={handleBillClick} disabled={!isAccountNamePresent}>Vendor Bill</button>
                    {showBillPopup && <SearchBill onClose={handleBillClosePopup} onRowSelect={handleBillRowSelect} accountName={details[selectedRowIndex]?.act_name || ''}
                        actCd={details[selectedRowIndex]?.act_cd || ''} vendorDetails={vendorDetails} />}
                    
                    <button className="btn btn-primary me-2" onClick={handleEditClick}>Edit Voucher</button>
                    {showPopup && <EditVoucherPopup onClose={handleClosePopup} onRowSelect={handleVoucharRowSelect} />}
                    
                    <button className="btn btn-success" onClick={handleFinalSave}>Save</button>
                </div>
            </div>
            {/*  Save and Edit Buttons */}
            <div className="row">
                <div className="col">
                    <DataTable columns={columns} data={details} customStyles={customStyles} responsive />
                </div>
            </div>
            <div className="d-flex justify-content-evenly mb-3 mt-3">
                <div>
                    <p>Total Dr: {formatNumber(totals.drTotal)}</p>
                </div>
                <div>
                    <p>Total Cr: {formatNumber(totals.crTotal)}</p>
                </div>
                <div>
                    <p><b>Balance: {formatNumber(totals.balance)}</b></p>
                </div>
                <div className="d-flex">
                    <button className="btn btn-success" onClick={handleAddRow}>Add</button>
                </div>
            </div>
        </div>
    </div>
</div>


    );
};

export default Payment_Voucher;
