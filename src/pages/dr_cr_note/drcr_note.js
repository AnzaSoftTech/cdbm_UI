// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { Modal, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import './common.css';
import axios from 'axios';
// import './drcr.css';
import PopupSearch from './popsearch';
import EditVoucherPopup from './EditVoucherPopup.js';
import { BASE_URL } from "../constants";
import searchIcon from '../../image/search.png';
import deleteIcon from '../../image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';


function DrCr_Note({ details, setDetails }) {
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
    const [drCrType, setDrCrType] = useState('');
    const [header, setHeader] = useState({});
    const [transType, setTransType] = useState('Dr Note');
    const [userId, setUserId] = useState(1);
    const [addMode, setAddMode] = useState(true);

    const [exchange, setExchange] = useState();
    const [segment, setSegment] = useState('');
    const [activityCode, setActivityCode] = useState();
    const [activityCodes, setActivityCodes] = useState([]);
    const [segments, setSegments] = useState([]);
    const [finYear, setFinYear] = useState();

    const [normal_deposit, setNormal_deposit] = useState([]);



    useEffect(() => {
        axios.get(`${BASE_URL}/api/bookType`)
            .then(response => setBookTypes(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_segment`)
            .then(response => setSegments(response.data))
            .catch(error => console.error('Error fetching Segment:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_exchange`)
            .then(response => setExchanges(response.data))
            .catch(error => console.error('Error fetching Exchange:', error));
    }, []);

    useState(() => {
        if (details.length === 0) {
            setDetails([{ act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', narration: '', analyzer_code: '' }]);
        }
    });

    const handleAddRow = () => {
        setDetails([...details, { act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', narration: '', analyzer_code: '' }]);
    };

    const handleEditClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
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

    const handleInputChange = async (index, field, value) => {
        const newDetails = [...details];
        newDetails[index][field] = value;
        if (value === '') {
            value = '0';
        }
        if (field === 'dr_amount' || field === 'cr_amount') {
            const drTotal = newDetails.reduce((sum, item) => item.dr_cr === 'Dr' ? sum + parseFloat(item.dr_amount || 0) : sum, 0);
            const crTotal = newDetails.reduce((sum, item) => item.dr_cr === 'Cr' ? sum + parseFloat(item.cr_amount || 0) : sum, 0);
            const balance = Math.abs(drTotal - crTotal);

            setTotals({ drTotal, crTotal, balance });
        }
        setDetails(newDetails);
    };

    const handleSearchClick = (index) => {
        if (!bookType) {
            alert('Please select Book Type.');
            return;
        }
        if (!segment) {
            alert('Please select Segment.');
            return;
        }
        if (!activityCode) {
            alert('Please select Activity.');
            return;
        }
        setSelectedRowIndex(index);
        setShowModal(true);
    };

    const formatDate = (isoString) => {
        if (!isoString) return ''; // Return empty string if input is empty or undefined
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return ''; // Return empty string if date is invalid
        return date.toISOString().split('T')[0]; // Formats as YYYY-MM-DD
    };

    const handleVoucharRowSelect = async (vouchers) => {
        // Ensure vouchers is an array
        if (Array.isArray(vouchers)) {
            const voucherDetailsList = vouchers.map(voucher => {

                // Ensure numeric fields are properly converted
                const parseAmount = (value) => {
                    const number = parseFloat(value);
                    return isNaN(number) ? 0 : number;
                };

                return {
                    bookType: voucher.book_type || '',
                    voucherNo: voucher.voucher_no || 0,
                    effectiveDate: voucher.trans_date || null,
                    voucherDate: voucher.eff_date || null,
                    act_name: voucher.act_name || '',
                    drCr: voucher.drcr || '',
                    drAmount: voucher.drcr === 'Dr' ? parseAmount(voucher.amount) : 0,
                    crAmount: voucher.drcr === 'Cr' ? parseAmount(voucher.amount) : 0,
                    narration: voucher.narration || '',
                    analyzerCode: voucher.narr_code || '',
                    finYear: voucher.fin_year || 0,
                    branchCd: voucher.branch_cd || '',
                    actCd: voucher.act_cd || '',
                    cmpCd: voucher.cmp_cd || 0
                };
            });

            // Format the dates for the first voucher
            const formattedVoucherDate = formatDate(vouchers[0].trans_date);
            const formattedEffectiveDate = formatDate(vouchers[0].eff_date);

            if (vouchers.length > 0) {
                console.log('finyear ', vouchers[0].fin_year);
                setFinYear(vouchers[0].fin_year)
                setBookType(vouchers[0].book_type);
                setEffectiveDate(formattedEffectiveDate);
                setVoucherDate(formattedVoucherDate);
                setVoucherNo(vouchers[0].voucher_no);
                setSegment(vouchers[0].segment);
                // setExchange(vouchers[0].exc_cd);
                setActivityCode(vouchers[0].cmp_cd);
                setNormal_deposit(vouchers[0].nor_depos);
                console.log('normal_deposit ', vouchers[0].nor_depos);

            }
            const newDetails = voucherDetailsList.map(details => ({
                act_name: details.act_name,
                dr_cr: details.drCr,
                dr_amount: details.drAmount,
                cr_amount: details.crAmount,
                narration: details.narration,
                analyzer_code: details.analyzerCode,
                fin_year: details.finYear,
                branch_cd: details.branchCd,
                act_cd: details.actCd,
                cmp_cd: details.cmpCd
            }));

            console.log('newDetails ', newDetails);

            // Update the state with selected voucher details
            // setVoucherDetails(voucherDetailsList);

            // Update details state
            setDetails(newDetails);

            const drTotal = newDetails.reduce((sum, item) => item.dr_cr === 'Dr' ? sum + parseFloat(item.dr_amount || 0) : sum, 0);
            const crTotal = newDetails.reduce((sum, item) => item.dr_cr === 'Cr' ? sum + parseFloat(item.cr_amount || 0) : sum, 0);
            const balance = Math.abs(drTotal - crTotal);

            setTotals({ drTotal, crTotal, balance });

            setShowModal(false);

            setAddMode(false);


            // Log modal state update
            console.log('Modal Closed');
        } else {
            console.error('Invalid vouchers array:', vouchers);
        }
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
        // console.log("act_cd", act_cd)
        // console.log("comp_cd", cmp_cd)
        // console.log("type_cd", type_cd)
        // console.log("branch_cd", branch_cd)
        setDetails(newDetails);
        setShowModal(false);
    };
    const handleTypeChange = (index, type) => {
        const newDetails = [...details];
        newDetails[index].dr_cr = type;
        setDetails(newDetails);
        setDrCrType(type);
    };
    const handleFinalSave = () => {
        if (!voucherDate || !effectiveDate) {
            alert('Please enter Voucher Date and Effective Date.');
            return;
        }

        if (details.length === 0) {
            alert('Please add atleast one transaction');
            return;
        }

        if (!segment) {
            alert('Please select Segment');
            return;
        }

        if (!activityCode) {
            alert('Please select Activity');
            return;
        }

        if (!normal_deposit) {
            alert('Please select Normal/Deposit');
            return;
        }

        for (let i = 0; i < details.length; i++) {
            if (!details[i].act_name) {
                alert('Please Enter Account Name.');
                return;
            }

            if (!details[i].dr_cr) {
                alert('Please Select Dr/Cr.');
                return;
            }
            if (!details[i].narration) {
                alert('Please Enter Narration.');
                return;
            }
            if (!details[i].analyzer_code) {
                alert('Please Select Analyzer Code.');
                return;
            }
            if (details[i].dr_cr === 'Cr') {
                if (details[i].cr_amount <= 0) {
                    alert('Cr amount should be greater than 0.');
                    return;
                }
            }
            else if (details[i].dr_cr === 'Dr') {
                if (details[i].dr_amount <= 0) {
                    alert('Dr amount should be greater than 0.');
                    return;
                }
            }
        }

        let dupFlag = 0;
        let tempActName = '';

        for (let i = 0; i < details.length; i++) {
            for (let j = i + 1; j < details.length; j++) {
                if (details[i].act_name === details[j].act_name) {
                    dupFlag = 1;
                    tempActName = details[i].act_name;
                    break;
                }
            }
            if (dupFlag === 1) {
                break;
            }
        }

        if (dupFlag === 1) {
            alert(`Can not select dupilicate Account Name: ${tempActName}`);
            return;
        }

        setUserId(1);

        const headerData = {
            bookType,
            voucherDate,
            effectiveDate,
            voucherNo,
            transType,
            userId,
            finYear,
            segment,
            activityCode,
            normal_deposit
        };
        setHeader(headerData);
        const data = {
            header: headerData,
            details: details,
        };
        var resValidate = calculateTotals(details);
        if (resValidate == 0) {
            const isConfirmed = window.confirm('Sure, you want to save?');
            if (!isConfirmed) {
                return;
            }
            axios.post(`${BASE_URL}/api/save_dr_cr_note`, data)
                .then(response => {
                    alert('Voucher saved successfully!');
                    // Reset form state after successful save
                    setBookType('');
                    setVoucherDate('');
                    setEffectiveDate('');
                    setVoucherNo('');
                    setNarration('');
                    setFinYear('');
                    setDetails([{ act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', narration: '', analyzer_code: '' }]);
                    setTotals({ drTotal: 0, crTotal: 0, balance: 0 });
                    setAddMode(true);
                    setSegment('');
                    setActivityCode('');
                    setNormal_deposit('');
                })
                .catch(error => console.error('Error saving voucher:', error));

        }
        else {
            alert('The difference between the two values is non-zero. Exiting without saving.');
        }
    };

    const calculateTotals = (data) => {
        const drTotal = data
            .filter((item) => item.dr_cr === 'Dr')
            .reduce((sum, item) => sum + parseFloat(item.dr_amount), 0);
        const crTotal = data
            .filter((item) => item.dr_cr === 'Cr')
            .reduce((sum, item) => sum + parseFloat(item.cr_amount), 0);
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
    const handleAdd = () => {
        setAddMode(false);
    }
    // Function to format number with commas
    const formatNumber = (num) => {
        if (!num && num !== 0) return '';
        const [integer, decimal] = num.toString().split('.');
        return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (decimal ? `.${decimal}` : '');
    };
    const handleClear = () => {

        const isCleared = window.confirm('Sure, you want to clear?');

        if (!isCleared) {
            return;
        }

        setFinYear('');
        setBookType('');
        setVoucherDate('');
        setVoucherNo('');
        setEffectiveDate('');
        // setExchange('');
        setSegment('');
        setActivityCode('');
        setNormal_deposit('');
        setDetails([{ act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', narration: '', analyzer_code: '' }]);
        setTotals({ drTotal: 0, crTotal: 0, balance: 0 });
        setTransType('Dr Note');
        setAddMode(true);
        // setActivityCodes([]);
    }

    const handleSegment = async (p_Segment) => {
        try {
            setSegment(p_Segment);
            if (!voucherNo) {
                if (p_Segment) {
                    setActivityCodes([]);
                    await axios.get(`${BASE_URL}/api/ddl_activity_master?p_segment_cd=` + p_Segment)
                        .then(response => setActivityCodes(response.data))
                        .catch(error => console.error('Error fetching activity:', error));
                }
                else {
                    setActivityCodes([]);
                }
            }
        }
        catch (error) {
            console.error("Error in Account Type Selection! ", error);
        }
    }

    const columns = [
        // {
        //     name: 'Index',
        //     selector: (row, index) => index + 1,
        //     sortable: true,
        // },
        {
            name: 'Account Name',
            selector: 'act_name',
            sortable: true,
            cell: (row, index) => (
                <div className='d-flex'>
                    <input
                        type="text"
                        value={row.act_name}
                        readOnly
                        onChange={e => handleInputChange(index, 'act_name', e.target.value)}
                        className="form-control form-control form-control-jv-1"

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
                            onClick={() => handleSearchClick(index, activityCode, segment)}
                            style={{
                                width: '20px', // Adjust size as needed
                                height: '20px',
                                marginTop: '7px',
                                marginLeft: '2px'
                            }}
                        />
                    </OverlayTrigger>
                    <Modal show={showModal} onHide={() => setShowModal(false)} className="custom-modal">
                        <Modal.Header style={{ backgroundColor: '#0275d8', color: 'white' }} closeButton>
                            <Modal.Title >Search and Select Account</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <PopupSearch onSelectRow={handleSelectRow} activity={activityCode} segment={segment} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>

            ),
            width: '16rem',
        },
        {
            name: 'Dr/Cr',
            selector: (row, index) => (
                <select
                    value={row.dr_cr}
                    onChange={e => handleTypeChange(index, e.target.value)} // Note: Using index here
                    className="form-control form-control form-control-jv-1"
                >
                    <option value="">Select Dr/Cr</option>
                    <option value="Dr">Dr</option>
                    <option value="Cr">Cr</option>
                </select>
            ),
            width: '7.5rem',
        },
        {
            name: 'Debit Amount',
            selector: row => row.dr_amount,
            cell: (row, index) => (
                <input
                    type="number"
                    style={{ textAlign: 'right' }}
                    value={row.dr_amount}
                    onChange={e => handleInputChange(index, 'dr_amount', e.target.value)}
                    className="form-control form-control form-control-jv-1"
                    disabled={row.dr_cr !== 'Dr'} // Disable if not 'Dr' is selected
                />
            ),
            width: '9.375rem',
        },
        {
            name: 'Credit Amount',
            selector: row => row.cr_amount,
            cell: (row, index) => (
                <input
                    type="number"
                    style={{ textAlign: 'right' }}
                    value={row.cr_amount}
                    onChange={e => handleInputChange(index, 'cr_amount', e.target.value)}
                    className="form-control form-control form-control-jv-1"
                    disabled={row.dr_cr !== 'Cr'} // Disable if not 'Cr' is selected
                />
            ),
            width: '9.375rem',
        },
        {
            name: 'Narration',
            selector: row => row.narration,
            cell: (row, index) => (
                <textarea
                    value={row.narration}
                    onChange={e => handleInputChange(index, 'narration', e.target.value)}
                    className="form-control custom-textarea"
                    rows={3} />
            ),
            width: 'auto', // Adjusted for better flexibility
            style: { height: 'auto' }, // Ensures height adjusts based on content
        },
        {
            name: 'Analyzer Code',
            selector: row => row.analyzer_code,
            cell: (row, index) => (
                <select
                    value={row.analyzer_code}
                    onChange={e => handleInputChange(index, 'analyzer_code', e.target.value)}
                    className="form-control form-control form-control-jv-1"
                >
                    <option value="">Select Analyzer Code</option>
                    <option value="1">Code 1</option>
                    <option value="2">Code 2</option>
                    <option value="3">Code 3</option>
                    {/* Add more options as needed */}
                </select>
            ),
            width: '13.75rem',
        },
        {
            name: '',
            cell: (row, index) => (
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
                            marginTop: '7px',
                            marginLeft: '16px'
                        }}
                    />
                </OverlayTrigger>
            ),
            allowOverflow: true,
            width: '3.438rem',
            style: { padding: '0', margin: '0', borderRight: 'none' }, // Ensures no padding/margin/border
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
                paddingRight: '3px',
                // Hide the border on the last head cell
                '&:last-child': {
                    borderRightStyle: 'none',
                },
            },
        },
        cells: {
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: 'blue',
                paddingLeft: '3px',
                paddingRight: '3px',
                // Hide the border on the last cell
                '&:last-child': {
                    borderRightStyle: 'none',
                },
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
                borderRightStyle: 'none', // Remove border-right for Actions column header
            },
        },
        actionsCell: {
            style: {
                borderRightStyle: 'none', // Remove border-right for Actions column cells
                paddingLeft: '3px',
                paddingRight: '3px',
            },
        },
    };

    return (
        <div className="container-common">
            <div className="card">
                <div className="card-header-css">
                    <h5>Debit/Credit Notes</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="bookType" className="form-label form-label-jv label-color-common">Book Type</label>
                            <select
                                id="bookType"
                                className="form-select form-select-jv"
                                name='bookType'
                                value={bookType}
                                disabled={voucherNo ? true : addMode}
                                onChange={(e) => setBookType(e.target.value)}
                            >
                                <option value="">Select Book type</option>
                                {bookTypes.map(BookTypes => (
                                    <option key={BookTypes.book_type} value={BookTypes.book_type}>
                                        {BookTypes.book_type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="voucherDate" className="form-label form-label-jv label-color-common">Voucher Date</label>
                            <input
                                id="voucherDate"
                                type="date"
                                className="form-control form-control-jv"
                                value={voucherDate}
                                disabled={addMode}
                                onChange={(e) => setVoucherDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="voucherNo" className="form-label form-label-jv label-color-common">Voucher No</label>
                            <input
                                id="voucherNo"
                                type="number"
                                className="form-control form-control-jv"
                                value={voucherNo}
                                onChange={(e) => setVoucherNo(e.target.value)}
                                readOnly
                            />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="effectiveDate" className="form-label form-label-jv label-color-common">Effective Date</label>
                            <input
                                id="effectiveDate"
                                type="date"
                                className="form-control form-control-jv"
                                value={effectiveDate}
                                disabled={addMode}
                                onChange={(e) => setEffectiveDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="transType" className="form-label form-label-jv label-color-common">Dr/Cr Note</label>
                            <select
                                id="transType"
                                className="form-control form-control-jv"
                                name='transType'
                                value={transType}
                                disabled={voucherNo ? true : addMode}
                                onChange={(e) => setTransType(e.target.value)}
                            >
                                <option value="Dr Note">Debit Note</option>
                                <option value="Cr Note">Credit Note</option>
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="segment" className="form-label form-label-jv label-color-common">Segment</label>
                            <select
                                id="segment"
                                className="form-select form-select-jv"
                                name="segment"
                                value={segment}
                                disabled={voucherNo ? true : addMode}
                                onChange={(e) => handleSegment(e.target.value)}
                            >
                                <option value="">Select Segment</option>
                                {segments.map(result => (
                                    <option value={result.seg_code} key={result.seg_code}>{result.seg_name}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="activityCode" className="form-label form-label-jv label-color-common">Activity Code</label>
                            <select
                                id="activityCode"
                                className="form-select form-select-jv"
                                name='activityCode'
                                value={activityCode}
                                disabled={voucherNo ? true : addMode}
                                onChange={(e) => setActivityCode(e.target.value)}
                            >
                                <option value=" ">Select Activity Code</option>
                                {activityCodes.map(Act_Code => (
                                    <option key={Act_Code.activity_cd} value={Act_Code.activity_cd}>{Act_Code.act_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="normalDeposit" className="form-label form-label-jv label-color-common">Norml/Deposit</label>
                            <select
                                id="normalDeposit"
                                className="form-select form-select-jv"
                                name='normalDeposit'
                                value={normal_deposit}
                                disabled={voucherNo ? true : addMode}
                                onChange={(e) => setNormal_deposit(e.target.value)}
                            >
                                <option value=" ">Select Noraml/Deposit</option>
                                <option value="N">Normal</option>
                                <option value="D">Deposit</option>
                            </select>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">

                        </div>
                        <div className="col-md-6 mb-2 d-flex justify-content-end" style={{ float: 'right' }}>
                            <button className="btn btn-primary me-2" style={{ width: '9rem' }} disabled={!addMode}
                                onClick={handleAdd}>Add</button>
                            <button className="btn btn-secondary me-2" style={{ width: '9rem' }} disabled={addMode}
                                onClick={handleClear}>Clear</button>
                            <button className="btn btn-primary me-2" style={{ width: '9rem' }} onClick={handleEditClick}
                                disabled={!addMode}>Search Voucher</button>
                            {showPopup && <EditVoucherPopup onClose={handleClosePopup} onRowSelect={handleVoucharRowSelect} />}
                            <button className="btn btn-success" style={{ width: '9rem' }} onClick={handleFinalSave}
                                disabled={addMode}>Save</button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="container-datatable mt-2">
                            <div className="datatable_dr_cr">
                                <DataTable columns={columns} data={details} customStyles={customStyles} responsive />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-evenly mb-3 mt-3 ">

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
                            <p class><button className="btn btn-warning" style={{ width: '7rem' }} onClick={handleAddRow}>Add Row</button></p>
                        </div>
                    </div>


                   

                </div>
            </div>
        </div>
    );
};
export default DrCr_Note;
