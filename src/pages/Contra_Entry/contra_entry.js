// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './contra_entry.css'; 
// import { ProgressBar, Form, Button, Alert } from 'react-bootstrap';
import './FileUpload.css'; // Import custom styles
import { BASE_URL } from "../constants";

function Contra_Entry() {

     const [segment, setSegment] = useState('C');
     const [cbaccountDr, setCBAccountDr] = useState();
     const [actsDr, setActsDr] = useState([]);
     const [cbaccountCr, setCBAccountCr] = useState();
     const [bookType, setBookType] = useState('');
     const [bookTypes, setBookTypes] = useState([]);
     const [voucherDate, setVoucherDate] = useState('');
     const [voucherNo, setVoucherNo] = useState('');
     const [effectiveDate, setEffectiveDate] = useState(''); 
     const [branchCode, setBranchCode] = useState('');
     const [branchCodes, setBranchCodes] = useState([]);
     const [exchangeCode, setExchangeCode] = useState();
     const [exchanges, setExchanges] = useState([]);
     const [dranalyzerCode, setDrAnalyzerCode] = useState();
     const [cranalyzerCode, setCrAnalyzerCode] = useState();
     const [dranalyzerCodes, setDrAnalyzerCodes] = useState([]);
     const [amount, setAmount] = useState();
     const [narration, setNarration] = useState();
     const [userId, setUserId] = useState(1);
     const [header, setHeader] = useState({});

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
        axios.get(`${BASE_URL}/api/branches`)
            .then(response => setBranchCodes(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/exchange`)
            .then(response => setExchanges(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/analyzercode`)
            .then(response => setDrAnalyzerCodes(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    const handleCashBankDebit = async (p_actDrCode) => {
        try{
            console.log('actDrCode = ', p_actDrCode);
        setCBAccountDr(p_actDrCode);

        const response = await axios.get(`${BASE_URL}/api/populatedetails?p_cb_act_cd=` + p_actDrCode);
        //const response = await axios.get(`http://localhost:3001/populatedetails`);
        //console.log('UI response ==> ', response.data[0].branch_cd );
        //console.log('response.data[0].book_type', response.data[0].book_type);
         if (response.data.length === 1){
            setBranchCode(response.data[0].branch_cd);
            setSegment(response.data[0].segment);
            setBookType(response.data[0].book_type);
            setExchangeCode(response.data[0].exc_cd);
        }
        else {
            setBranchCode('');
            setSegment('');
            setBookType('');
            setExchangeCode('');
        }
        

    }catch (error) {
        console.error("Error handleCashBankDebit file:", error);
        //alert('Error handleCashBankDebit file');
      }

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

        if (!branchCode) {
            alert('Please Select Branch');
            return;
        }

        if (!exchangeCode) {
            alert('Please Select Exchange');
            return;
        }

        setUserId(1);

        const mainData = {
            segment,
            cbaccountDr,
            cbaccountCr,
            bookType,
            voucherDate,
            voucherNo,
            effectiveDate,
            branchCode,
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
                    setBranchCode('');
                    setExchangeCode('');
                    setDrAnalyzerCode('');
                    setCrAnalyzerCode('');
                    setAmount('');
                    setVoucherNo('');
                    setVoucherDate('');
                    setEffectiveDate('');
                    setNarration('');
                })
                .catch(error => console.error('Error saving voucher:', error));
    };

    return (
        <div className="container-common">
          <div className="card">
            <div className="card-header-css">
              <h3>Contra Entry </h3>
            </div>
            <div className="card-body">
              {/*  ****************************************************************************
                                     Cash/Bank Account Dr/Cr
              **************************************************************************** */}
              <div className="row ">
                  <div className="col-md-6 mb-2 d-flex">
                          <label htmlFor="cbaccountDr" className="form-label label-width label-color-common">Cash/Bank Dr</label>
                          <select id="cbaccountDr" className="form-select size_input_contra" name='cbaccountDr' value={cbaccountDr}
                              onChange={(e) => handleCashBankDebit(e.target.value)}>
                                  <option value=" ">Select Cash Bank A/c Dr</option>
                                   {actsDr.map(CB_Dr => (
                                      <option key={CB_Dr.cb_act_cd} value={CB_Dr.cb_act_cd}>{CB_Dr.bank_ac_name}</option>
                                  ))} 
                          </select> 
                  </div>
                  <div className="col-md-6 mb-2 d-flex">
                          <label htmlFor="cbaccountCr" className="form-label label-width label-color-common">Cash/Bank Cr</label>
                          <select id="cbaccountCr" className="form-select size_input_contra" name='cbaccountCr' value={cbaccountCr} onChange={(e) => setCBAccountCr(e.target.value)}>
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
                           onChange={(e) => setDrAnalyzerCode(e.target.value)}>
                                  <option value=" ">Select Analyzer Code Dr</option>
                                   {dranalyzerCodes.map(Analyzer_Dr => (
                                      <option key={Analyzer_Dr.ana_grp_cd} value={Analyzer_Dr.ana_grp_cd}>{Analyzer_Dr.grp_name}</option>
                                  ))}  
                          </select> 
                  </div>
                  <div className="col-md-6 mb-2 d-flex">
                          <label htmlFor="cranalyzerCode" className="form-label label-width label-color-common">Analyzer Cr</label>
                          <select id="cranalyzerCode" className="form-select size_input_contra" name='cranalyzerCode' value={cranalyzerCode} onChange={(e) => setCrAnalyzerCode(e.target.value)}>
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
                      <input id="amount" type="number" className="form-control form-control-ce size_input_contra " value={amount} onChange={(e) => setAmount(e.target.value)}  />
                  </div>
                  <div className="col-md-6 mb-2 d-flex">
                      <label htmlFor="narration" className="form-label label-width label-color-common">Narration </label>
                      <input id="narration" type="text" className="form-control form-control-ce size_input_contra" value={narration} onChange={(e) => setNarration(e.target.value)} />
                  </div>
              </div>
              {/*  ****************************************************************************
                                     Book Type and Voucher Date
              **************************************************************************** */}
              <div className="row ">
                  <div className="col-md-6 mb-2 d-flex">
                      <label htmlFor="bookType" className="form-label label-width label-color-common">Book Type</label>
                      <select id="bookType" className="form-select  size_input_contra" name='bookType' value={bookType} onChange={(e) => setBookType(e.target.value)}>
                          <option value=" ">Select Book type</option>
                          {bookTypes.map(BookTypes => (
                              <option key={BookTypes.book_type} value={BookTypes.book_type}>{BookTypes.book_type}</option>
                          ))}
                      </select>
                  </div>
                  <div className="col-md-6 mb-2 d-flex">
                      <label htmlFor="voucherDate" className="form-label label-width label-color-common">Voucher Date </label>
                      <input id="voucherDate" type="date" className="form-control form-control-ce size_input_contra" style={{ marginLeft: '0px'}}
                       value={voucherDate} onChange={(e) => setVoucherDate(e.target.value)} />
                  </div> 
              </div>
              {/*  ****************************************************************************
                                     Voucher No and Effective Date
              **************************************************************************** */}
              <div className="row ">
                  <div className="col-md-6 mb-2 d-flex">
                      <label htmlFor="voucherNo" className="form-label label-width label-color-common">Voucher No</label>
                      <input id="voucherNo" type="number" className="form-control form-control-ce size_input_contra " value={voucherNo} onChange={(e) => setVoucherNo(e.target.value)} readOnly />
                  </div>
                  <div className="col-md-6 mb-2 d-flex">
                      <label htmlFor="effectiveDate" className="form-label label-width label-color-common">Effective Date </label>
                      <input id="effectiveDate" type="date" className="form-control form-control-ce size_input_contra" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
                  </div>
              </div>
  
              {/*  ****************************************************************************
                                     Branch and Segment
              **************************************************************************** */}
  
              <div className="row ">
                  <div className="col-md-6 mb-2 d-flex">
                      <label htmlFor="branchCode" className="form-label label-width label-color-common">Branch Code</label>
                      <select id="branchCode" className="form-select size_input_contra" name='branchCode' value={branchCode} onChange={(e) => setBranchCode(e.target.value)}>
                                  <option value=" ">Select Branch</option>
                                  {branchCodes.map(Branches => (
                                      <option key={Branches.branch_cd} value={Branches.branch_cd}>{Branches.branch_name}</option>
                                  ))}
                      </select>
                  </div>
                  <div className="col-md-6 mb-2 d-flex">
                      <label htmlFor="segment" className="form-label label-width label-color-common">Segment</label>
                      <select id="segment" className="form-select size_input_contra" style={{marginLeft:'0px'}}
                               name='segment' value={segment} onChange={(e) => setSegment(e.target.value)}>
                                  <option value="">Select Segment</option>
                                  <option value="C">Cash Market</option>
                      </select>
                  </div>
              </div>
              {/*  ****************************************************************************
                                     Exchange
              **************************************************************************** */}
              <div className="row ">
                  <div className="col-md-6 mb-3 d-flex">
                      <label htmlFor="exchange" className="form-label label-width label-color-common">Exchange</label>
                      <select id="exchangeCode" className="form-select size_input_contra" name='exchangeCode' style={{marginLeft:'0px'}}
                               value={exchangeCode} onChange={(e) => setExchangeCode(e.target.value)}>
                          <option value="">Select Exchange</option>
                          {exchanges.map(exchange => (
                               <option key={exchange.exc_cd} value={exchange.exc_cd}>{exchange.exc_name}</option>
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
                      <button className="btn  btn-primary me-2" style={{width:'9rem'}} >Edit Voucher</button>
                      <button className="btn btn-success " onClick={handleFinalSave} style={{width:'9rem'}} >Save</button>
                  </div>
              </div>
   
            </div>
          </div>
    
        </div>
    
      );
    }
  
  export default Contra_Entry;
  