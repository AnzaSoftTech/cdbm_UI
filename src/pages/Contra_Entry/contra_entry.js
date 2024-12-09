// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './contra_entry.css';
// import { ProgressBar, Form, Button, Alert } from 'react-bootstrap';
// import './FileUpload.css'; // Import custom styles
import { BASE_URL } from "../constants";
import EditVoucherPopup from './EditVoucherPopup.js';


function Contra_Entry() {

    const [segment, setSegment] = useState('');
    const [cbaccountDr, setCBAccountDr] = useState();
    const [actsDr, setActsDr] = useState([]);
    const [cbaccountCr, setCBAccountCr] = useState();
    const [bookType, setBookType] = useState('');
    const [bookTypes, setBookTypes] = useState([]);
    const [voucherDate, setVoucherDate] = useState('');
    const [voucherNo, setVoucherNo] = useState('');
    const [effectiveDate, setEffectiveDate] = useState('');
    const [activity, setActivity] = useState('');
    const [activies, setActivities] = useState([]);
    const [exchangeCode, setExchangeCode] = useState();
    const [exchanges, setExchanges] = useState([]);
    const [segments, setSegments] = useState([]);
    const [dranalyzerCode, setDrAnalyzerCode] = useState();
    const [cranalyzerCode, setCrAnalyzerCode] = useState();
    const [dranalyzerCodes, setDrAnalyzerCodes] = useState([]);
    const [amount, setAmount] = useState();
    const [narration, setNarration] = useState();
    const [userId, setUserId] = useState(1);
    const [header, setHeader] = useState({});
    const [addMode, setAddMode] = useState(true);
    const [finYear, setFinYear] = useState();
    const [showPopup, setShowPopup] = useState(false);



    const getCurrDate = () => {
        var today = new Date();
        alert("Hello in currdate");
        document.getElementById("tran_date").value = today.getDate();
    }

    useEffect(() => {
        axios.get(`${BASE_URL}/api/cash_bank_master`)
            .then(response => setActsDr(response.data))
            .catch(error => console.error('Error fetching cash bank accounts:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/bookType`)
            .then(response => setBookTypes(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/actvities`)
            .then(response => setActivities(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/exchange`)
            .then(response => setExchanges(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/segment`)
            .then(response => {
                setSegments(response.data)
            })
            .catch(error => console.error('Error fetching Segment:', error));

        
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/analyzercode`)
            .then(response => setDrAnalyzerCodes(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    const handleCashBankDebit = async (p_actDrCode) => {
        try {
            console.log('actDrCode = ', p_actDrCode);
            setCBAccountDr(p_actDrCode);

            const response = await axios.get(`${BASE_URL}/api/populatedetailsContra?p_cb_act_cd=` + p_actDrCode);
            if (response.data.length === 1) {
                setSegment(response.data[0].segment);
                setBookType(response.data[0].book_type);
                setExchangeCode(response.data[0].exc_cd);
            }
            else {
               // setActivity('');
                setSegment('');
                setBookType('');
                setExchangeCode('');
            }
        } catch (error) {
            console.error("Error handleCashBankDebit file:", error);
            //alert('Error handleCashBankDebit file');
        }
    };
    const handleAdd = () => {
        setAddMode(false);
    }
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleVoucharRowSelect = async (vouchers) => {

        if (Array.isArray(vouchers)) {
            vouchers.map(voucher => {
                
                if (voucher.drcr === 'Dr') {
                    // console.log('voucher ', voucher);
                    setCBAccountDr(voucher.cb_act_cd);
                    setDrAnalyzerCode(voucher.narr_code);
                }
                if (voucher.drcr === 'Cr') {
                    console.log('voucher ', voucher);
                    setCBAccountCr(voucher.cb_act_cd);
                    setCrAnalyzerCode(voucher.narr_code);
                }

                setAmount(voucher.amount);
                setNarration(voucher.narration);
                setBookType(voucher.book_type);
                setVoucherDate(voucher.trans_date);
                setVoucherNo(voucher.voucher_no);
                setEffectiveDate(voucher.eff_date);
                setActivity(voucher.cmp_cd);
                setSegment(voucher.segment);
                setExchangeCode(voucher.exc_cd);
            })
        }

        setAddMode(false);

        // <td hidden>{result.fin_year}</td>
        //                             <td>{result.voucher_no}</td>
        //                             <td>{result.book_type}</td>
        //                             <td>{new Date(result.trans_date).toLocaleDateString()}</td>
        //                             <td>{result.account_title}</td>
        //                             <td>{result.amount}</td>
        //                             <td>{result.drcr}</td>
        //                             <td hidden>{result.segment}</td>
        //                             <td hidden>{result.exc_cd}</td>
        //                             <td hidden>{result.branch_cd}</td>
        //                             <td hidden>{result.drcr}</td>
        //                             <td hidden>{result.act_cd}</td>
        //                             <td hidden>{result.narration}</td>
        //                             <td hidden>{result.narr_code}</td>
        //                             <td hidden>{new Date(result.eff_date).toLocaleDateString()}</td>



        // console.log('vouchers----', vouchers); // Check the structure of vouchers here

        // // Ensure vouchers is an array
        // if (Array.isArray(vouchers)) {
        //     const voucherDetailsList = vouchers.map(voucher => {

        //         // Ensure numeric fields are properly converted
        //         const parseAmount = (value) => {
        //             const number = parseFloat(value);
        //             return isNaN(number) ? 0 : number;
        //         };

        //         return {
        //             bookType: voucher.book_type || '',
        //             voucherNo: voucher.voucher_no || 0,
        //             effectiveDate: voucher.trans_date || null,
        //             voucherDate: voucher.eff_date || null,
        //             segment: voucher.segment || '',
        //             activity: voucher.cmp_cd || '',
        //             normal_deposit: voucher.nor_depos || '',
        //             act_name: voucher.act_name || '',
        //             drCr: voucher.drcr || '',
        //             drAmount: voucher.drcr === 'Dr' ? parseAmount(voucher.amount) : 0,
        //             crAmount: voucher.drcr === 'Cr' ? parseAmount(voucher.amount) : 0,
        //             narration: voucher.narration || '',
        //             analyzerCode: voucher.narr_code || '',
        //             finYear: voucher.fin_year || 0,
        //             branchCd: voucher.branch_cd || '',
        //             actCd: voucher.act_cd || '',
        //             cmpCd: voucher.cmp_cd || 0
        //         };
        //     });

        //     // Format the dates for the first voucher
        //     const formattedVoucherDate = formatDate(vouchers[0].trans_date);
        //     const formattedEffectiveDate = formatDate(vouchers[0].eff_date);

        //     if (vouchers.length > 0) {
        //         console.log('finyear ',vouchers[0].fin_year);
        //         setFinYear(vouchers[0].fin_year)
        //         setBookType(vouchers[0].book_type);
        //         setEffectiveDate(formattedEffectiveDate);
        //         setVoucherDate(formattedVoucherDate);
        //         setVoucherNo(vouchers[0].voucher_no);
        //         setSegment(vouchers[0].segment);
        //         // setExchange(vouchers[0].exc_cd);
        //         setActivityCode(vouchers[0].cmp_cd);
        //         setNormal_deposit(vouchers[0].nor_depos);
        //         console.log('normal_deposit ', vouchers[0].nor_depos);

        //     }
        //     const newDetails = voucherDetailsList.map(details => ({
        //         act_name: details.act_name,
        //         dr_cr: details.drCr,
        //         dr_amount: details.drAmount,
        //         cr_amount: details.crAmount,
        //         segment: details.segment,
        //         activity: details.activity,
        //         normal_deposit: details.normal_deposit,
        //         narration: details.narration,
        //         analyzer_code: details.analyzerCode,
        //         fin_year: details.finYear,
        //         branch_cd: details.branchCd,
        //         act_cd: details.actCd,
        //         cmp_cd: details.cmpCd
        //     }));

        //     console.log('newDetails ', newDetails);

        //     // Update the state with selected voucher details
        //     // setVoucherDetails(voucherDetailsList);

        //     // Update details state
        //     setDetails(newDetails);

        //     const drTotal = newDetails.reduce((sum, item) => item.dr_cr === 'Dr' ? sum + parseFloat(item.dr_amount || 0) : sum, 0);
        //     const crTotal = newDetails.reduce((sum, item) => item.dr_cr === 'Cr' ? sum + parseFloat(item.cr_amount || 0) : sum, 0);
        //     const balance = Math.abs(drTotal - crTotal);

        //     setTotals({ drTotal, crTotal, balance });

        //     setShowModal(false);

        //     setAddMode(false);


        //     // Log modal state update
        //     console.log('Modal Closed');
        // } else {
        //     console.error('Invalid vouchers array:', vouchers);
        // }
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
        setAmount('');
        setNarration('');
        setSegment('');
        setCBAccountDr('');
        setCBAccountCr('');
        setDrAnalyzerCode('');
        setCrAnalyzerCode('');
        setActivity('');
        setExchangeCode('');
        setAddMode(true);
    }
    const handleEditClick = () => {
        setShowPopup(true);
    };

    const handleFinalSave = () => {

        if (!cbaccountDr) {
            alert('Please select Cash/Bank A/c Dr');
            return;
        }

        if (!cbaccountCr) {
            alert('Please select Cash/Bank A/c Cr');
            return;
        }

        if (cbaccountDr === cbaccountCr) {
            alert('Cash/Bank A/c Dr and Cr must be different.');
            return;
        }

        if (!dranalyzerCode) {
            alert('Please select Analyzer Code Dr');
            return;
        }

        if (!cranalyzerCode) {
            alert('Please select Analyzer Code Cr');
            return;
        }

        if (!amount) {
            alert('Please enter the amount');
            return;
        }

        if (amount === 0 || amount < 0) {
            alert('Please the amount greater than 0');
            return;
        }

        if (!narration) {
            alert('Please enter the Narration');
            return;
        }

        if (!voucherDate || !effectiveDate) {
            alert('Please enter Voucher Date and Effective Date.');
            return;
        }

        if (!segment) {
            alert('Please Select Segment');
            return;
        }

        if (!bookType) {
            alert('Please Select Book Type');
            return;
        }

        if (!activity) {
            alert('Please Select Activity');
            return;
        }

        if (!exchangeCode) {
            alert('Please Select Exchange');
            return;
        }

        setUserId(1);

        const isConfirmed = window.confirm('Sure, you want to save?');
        if(!isConfirmed){
            return;
        }

        const mainData = {
            segment,
            cbaccountDr,
            cbaccountCr,
            bookType,
            voucherDate,
            voucherNo,
            effectiveDate,
            activity,
            exchangeCode,
            dranalyzerCode,
            cranalyzerCode,
            amount,
            narration,
            userId,
        };

        setHeader(mainData);
        const data = {
            header: mainData,
        };

        //  alert(JSON.stringify(data));

        axios.post(`${BASE_URL}/api/save_contra_voucher`, data)
            .then(response => {
                alert('Voucher No. ' + response.data.message + ' saved successfully!');
                // Reset form state after successful save
                setSegment('');
                setCBAccountDr('');
                setCBAccountCr('');
                setBookType('');
                setEffectiveDate('');
                setActivity('');
                setExchangeCode('');
                setDrAnalyzerCode('');
                setCrAnalyzerCode('');
                setAmount('');
                setVoucherNo('');
                setVoucherDate('');
                setEffectiveDate('');
                setNarration('');
                setAddMode(true);
            })
            .catch(error => console.error('Error saving voucher:', error));
    };

    return (
        <div className="container-common">
            <div className="card">
                <div className="card-header-css">
                    <h5>Contra Entry </h5>
                </div>
                <div className="card-body">
                    {/*  ****************************************************************************
                                     Cash/Bank Account Dr/Cr
              **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="cbaccountDr" className="form-label label-width label-color-common">Cash/Bank Dr</label>
                            <select id="cbaccountDr" className="form-select size_input_contra" name='cbaccountDr' value={cbaccountDr}
                                onChange={(e) => handleCashBankDebit(e.target.value)} disabled={voucherNo ? true : addMode}>
                                <option value=" ">Select Cash Bank A/c Dr</option>
                                {actsDr.map(CB_Dr => (
                                    <option key={CB_Dr.cb_act_cd} value={CB_Dr.cb_act_cd}>{CB_Dr.bank_ac_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="cbaccountCr" className="form-label label-width label-color-common">Cash/Bank Cr</label>
                            <select id="cbaccountCr" className="form-select size_input_contra" name='cbaccountCr' value={cbaccountCr}
                                onChange={(e) => setCBAccountCr(e.target.value)} disabled={voucherNo ? true : addMode}>
                                <option value=" ">Select Cash Bank A/c Cr</option>
                                {actsDr.map(CB_Cr => (
                                    <option key={CB_Cr.cb_act_cd} value={CB_Cr.cb_act_cd}>{CB_Cr.bank_ac_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/*  ****************************************************************************
                                     Analyzer Codes Dr/Cr
              **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="dranalyzerCode" className="form-label label-width label-color-common">Analyzer Dr</label>
                            <select id="dranalyzerCode" className="form-select size_input_contra" name='dranalyzerCode' value={dranalyzerCode}
                                onChange={(e) => setDrAnalyzerCode(e.target.value)} disabled={addMode}>
                                <option value=" ">Select Analyzer Code Dr</option>
                                {dranalyzerCodes.map(Analyzer_Dr => (
                                    <option key={Analyzer_Dr.ana_grp_cd} value={Analyzer_Dr.ana_grp_cd}>{Analyzer_Dr.grp_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="cranalyzerCode" className="form-label label-width label-color-common">Analyzer Cr</label>
                            <select id="cranalyzerCode" className="form-select size_input_contra" name='cranalyzerCode' value={cranalyzerCode} 
                                onChange={(e) => setCrAnalyzerCode(e.target.value)} disabled={addMode}>
                                <option value=" ">Select Analyzer Code Cr</option>
                                {dranalyzerCodes.map(Analyzer_Dr => (
                                    <option key={Analyzer_Dr.ana_grp_cd} value={Analyzer_Dr.ana_grp_cd}>{Analyzer_Dr.grp_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/*  ****************************************************************************
                                     Amount and Narration
              **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="amount" className="form-label label-width label-color-common">Amount</label>
                            <input id="amount" type="number" className="form-control form-control-ce size_input_contra " value={amount} 
                                onChange={(e) => setAmount(e.target.value)} disabled={addMode} />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="narration" className="form-label label-width label-color-common">Narration </label>
                            <input id="narration" type="text" className="form-control form-control-ce size_input_contra" value={narration} 
                                onChange={(e) => setNarration(e.target.value)} disabled={addMode} />
                        </div>
                    </div>
                    {/*  ****************************************************************************
                                     Book Type and Voucher Date
              **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="bookType" className="form-label label-width label-color-common">Book Type</label>
                            <select id="bookType" className="form-select  size_input_contra" name='bookType' value={bookType} 
                                onChange={(e) => setBookType(e.target.value)} disabled>
                                <option value=" ">Select Book type</option>
                                {bookTypes.map(BookTypes => (
                                    <option key={BookTypes.book_type} value={BookTypes.book_type}>{BookTypes.book_type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="voucherDate" className="form-label label-width label-color-common">Voucher Date </label>
                            <input id="voucherDate" type="date" className="form-control form-control-ce size_input_contra"
                                style={{ marginLeft: '0px' }} value={voucherDate} onChange={(e) => setVoucherDate(e.target.value)}
                                disabled={addMode} />
                        </div>
                    </div>
                    {/*  ****************************************************************************
                                     Voucher No and Effective Date
              **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="voucherNo" className="form-label label-width label-color-common">Voucher No</label>
                            <input id="voucherNo" type="number" className="form-control form-control-ce size_input_contra " value={voucherNo} 
                                onChange={(e) => setVoucherNo(e.target.value)} readOnly />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="effectiveDate" className="form-label label-width label-color-common">Effective Date </label>
                            <input id="effectiveDate" type="date" className="form-control form-control-ce size_input_contra" 
                                value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} disabled={addMode} />
                        </div>
                    </div>

                    {/*  ****************************************************************************
                                     Branch and Segment
              **************************************************************************** */}

                    <div className="row ">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="activity" className="form-label label-width label-color-common">Activity</label>
                            <select id="activity" className="form-select size_input_contra" name='activity' value={activity} 
                                onChange={(e) => setActivity(e.target.value)} disabled={voucherNo ? true : addMode}>
                                <option value="">Select Activity</option>
                                {activies.map(act => (
                                    <option key={act.activity_cd} value={act.activity_cd}>{act.act_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="segment" className="form-label label-width label-color-common">Segment</label>
                            <select id="segment" className="form-select size_input_contra" style={{ marginLeft: '0px' }}
                                name='segment' value={segment} onChange={(e) => setSegment(e.target.value)} disabled>
                                <option value="">Select Segment</option>
                                {segments.map(Branches => (
                                    <option key={Branches.seg_code} value={Branches.seg_code}>{Branches.seg_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/*  ****************************************************************************
                                     Exchange
              **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="exchange" className="form-label label-width label-color-common">Exchange</label>
                            <select id="exchangeCode" className="form-select size_input_contra" name='exchangeCode' style={{ marginLeft: '0px' }}
                                value={exchangeCode} onChange={(e) => setExchangeCode(e.target.value)} disabled>
                                <option value="">Select Exchange</option>
                                {exchanges.map(exchange => (
                                    <option key={exchange.mii_id} value={exchange.mii_id}>{exchange.mii_name}</option>
                                ))}
                            </select>
                        </div>
                        {/* <div className="col-md-6 mb-3 d-flex">
                      <label htmlFor="normalDeposit" className="form-label label-width">Normal/Deposit</label>
                      <select id="normalDeposit" className="form-select  size_input" name='normalDeposit' value={normalDeposit} onChange={(e) => setNormalDeposit(e.target.value)} >
                                  <option value="">Select Normal/Deposit</option>
                                  <option value="N">Normal</option>
                                  <option value="D">Deposit</option>
                      </select>
                  </div> */}

                    </div>
                    {/*  ****************************************************************************
                                     Edit and Save
              **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-12 mb-2 d-flex  justify-content-center ">
                            <button className="btn btn-primary me-2" style={{ width: '9rem' }} disabled={!addMode}
                                onClick={handleAdd}>Add</button>
                            <button className="btn btn-secondary me-2" style={{ width: '9rem' }} disabled={addMode}
                                onClick={handleClear}>Clear</button>
                            <button className="btn btn-primary me-2" style={{ width: '9rem' }} onClick={handleEditClick}
                                disabled={!addMode}>Search Voucher</button>
                            {showPopup && <EditVoucherPopup onClose={handleClosePopup} onRowSelect={handleVoucharRowSelect} />}
                            <button className="btn btn-success " onClick={handleFinalSave} style={{ width: '9rem' }} 
                                disabled={addMode}>Save</button>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    );
}

export default Contra_Entry;
