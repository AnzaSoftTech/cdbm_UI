// src/App.js
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './journal.css'; 
import './Dealer_Sub_Dealer.css';
import searchIcon from './image/search.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap';
import EditPopup from './EditPopup.js';
import AddressContPopup from './Address_Contacts.js'
import DealerExchangePopup from './Dealer_Exchange.js'
import SubDealerPopup from './Sub_Dealer.js'
import { format, parseISO } from 'date-fns';
import Address_Contacts from './Sub_Dealer.js';
import { BASE_URL } from "../constants";

function Dealer_Sub_Dealer() { 

    const [testdata, setTestData] = useState([]);

    const [dealerCode, setDealerCode] = useState('');
    const [openingdate, setOpeningDate] = useState();
    const [activityCode, setActivityCode] = useState('');
    const [activityCodes, setActivityCodes] = useState([]);
    const [prevactivityCode, setPrevActivityCode] = useState('');

    const [statuschangedt, setStatusChangeDt] = useState();
    const [dealername, setDealerName] = useState('');
    const [aliasname, setAliasName] = useState('');
    const [dealerPAN, setDealerPAN] = useState('');
    const [wardno, setWardNo] = useState('');
    const [tdsrate, setTDSRate] = useState('');
    const [orderlmt, setOrderLmt] = useState('');
    const [grosslmt, setGrossLmt] = useState('');
    const [netlmt, setNetLmt] = useState('');

    const [addressPopup, setShowAddressPopup] = useState(false);
    const [dealerexcPopup, setShowDealerExcPopup] = useState(false);
    const [subdealerPopup, setShowSubDealerPopup] = useState(false);

    const [header, setHeader] = useState({});
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [dealerstatus, setDealerStatus] = useState('A');
    const [userId, setUserId] = useState(1);
    const [showModal, setShowModal] = useState(false);

    const [addMode, setAddMode] = useState(true);
    const [stsChange, setStsChange] = useState(false);

    const addRef = useRef();
    const excRef = useRef();
    const subRef = useRef();
    const editRef = useRef();
    const adRef = useRef();

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_desler_activity_master`)
            .then(response => setActivityCodes(response.data))
            .catch(error => console.error('Error fetching Activities:', error));
    }, []);

    useEffect(() => {
        if(!dealerCode){
            addRef.current.disabled = true;
            excRef.current.disabled = true;
            subRef.current.disabled = true;
        }
        if(dealerCode){
            addRef.current.disabled = false;
            excRef.current.disabled = false;
            subRef.current.disabled = false;
        }
    }, [dealerCode])

    const handleShowAddress = (p_dealer_cd) => {

        if (!p_dealer_cd)
        {
            alert('Please Save/Edit a Dealer before going to Address/Contacts !');
        }
        else {
            setShowAddressPopup(true);
        }

    };

    const handleShowDealerExc = (p_cb_act_code, p_Addr_Id) => {

        if (!p_cb_act_code)
        {
            alert('Please Save Cash/Bank entry before entering Address and Contacts !');
        }
        else {
            setShowDealerExcPopup(true);
        }

        
    };

    const handleShowSubDealer = (p_cb_act_code, p_Addr_Id) => {

        if (!p_cb_act_code)
        {
            alert('Please Save Cash/Bank entry before entering Address and Contacts !')

        }
        else {
            setShowSubDealerPopup(true); 
        }

        
    };

    const handleCloseAddr = () => {
        setShowAddressPopup(false);
    }

    const handleCloseDealerExc = () => {
        setShowDealerExcPopup(false);
    }

    const handleCloseSubDealer = () => {
        setShowSubDealerPopup(false);
    }

    const handleFinalSave = async () => {

        // await axios.get(`http://localhost:3001/api/contract_notes?p_transaction_date='03/06/2024'`).then(response => setTestData(response.data))
        // .catch(error => console.error('Error fetching test:', error));

        // console.log('testdate ', testdata);

        // return;


        // Regex for PAN validation
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

        

        if (!activityCode)
        {
            alert('Please Select Activity Code.');
            return;
        }


        if (!dealername)
        {
            alert('Please enter Dealer Name.');
            return;
        }

        if (!aliasname)
        {
            alert('Please enter Dealer Alias.');
            return;
        }

        if (!dealerPAN)
        {
            alert('Please enter Dealer PAN.');
            return;
        }

        if (!panRegex.test(dealerPAN))
        {
            alert('Invalid PAN format, it should AAAAA9999A.');
            return;
        }

        setUserId(1);

        const isConfirmed = window.confirm("Sure you want to Save the Dealer ?");

        if (!isConfirmed) {
            return;
        }


        //console.log('save bankBranchCode ==> ', bankBranchCode);

        // if (openingdate) {
        //     const dateString = seg_start_date;
        //     const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
        //     // setStartDate(formattedDate);
        // }

        const mainData = {
            dealerCode,
            dealername,
            aliasname,
            openingdate,
            dealerstatus: dealerstatus || 'A',
            dealerPAN,
            wardno,
            tdsrate,
            statuschangedt,
            activityCode,
            orderlmt,
            netlmt,
            grosslmt,
            userId,
        };

        setHeader(mainData);
        const data = {
            header: mainData,
        };

        console.log('header ->', header);

        //alert(JSON.stringify(data));

        axios.post(`${BASE_URL}/api/save_dealer_master`, data)
            .then(response => {setDealerCode(response.data.message);
                alert('Dealer Master saved successfully! ' + response.data.message);
                // Reset form state after successful save
                //setCBAcctCode('');
            })
            .catch(error => console.error('Error saving Cash/Bank Master:', error));
    };

    const handleEditClick = () => {
        setShowEditPopup(true);
        editRef.current.disabled = false;
    };

    const clearDealer = () => {
        setDealerCode('');
        setOpeningDate('');
        setActivityCode('');
        setDealerName('');
        setAliasName('');
        setDealerStatus('');
        setStatusChangeDt('');
        setDealerPAN('');
        setWardNo('');
        setTDSRate('');
        setOrderLmt('');
        setGrossLmt('');
        setNetLmt('');
        editRef.current.disabled = false;
        adRef.current.disabled = false;
        setAddMode(true);
    }

    const handleAddClick = () => {
        setAddMode(false);
        editRef.current.disabled = true;
    }

    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
    };

    const handleVoucharRowSelect = (cb_master_data) => {
        
        cb_master_data.map(result => {
            setDealerCode(result.dealer_cd);
            setOpeningDate(result.opening_date);
            setActivityCode(result.activity_cd);
            setDealerName(result.dealer_name);
            setAliasName(result.dealer_alias);
            setDealerStatus(result.status);
            setStatusChangeDt(result.st_change_dt || '');
            setDealerPAN(result.pan);
            setWardNo(result.it_ward_no);
            setTDSRate(result.tds_rate);
            setOrderLmt(result.order_limit);
            setGrossLmt(result.gross_limit);
            setNetLmt(result.net_limit);

            if (result.opening_date) {
                const formattedDate1 = format(parseISO(result.opening_date), 'yyyy-MM-dd');
                setOpeningDate(formattedDate1);
            }
            if (result.st_change_dt) {
                const formattedDate2 = format(parseISO(result.st_change_dt), 'yyyy-MM-dd');
                setStatusChangeDt(formattedDate2);
            }
        });
        setShowEditPopup(false);
        setAddMode(false);
        adRef.current.disabled = true;
    }

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header-css">
                    <h5 className="text-center">Dealer/Sub-Dealer Master </h5>
                </div>
                <div className="card-body">
                    {/*  ****************************************************************************
                                   Entry Date
                      **************************************************************************** */}

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="openingdate" className="form-label label-width">Opening Date</label>
                            <input id="openingdate" disabled={addMode} type="date" className="form-control size_input_cashbank"
                                value={openingdate} onChange={(e) => setOpeningDate(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="activitycode" className="form-label label-width">Activity</label>
                            <select id="activitycode" disabled={addMode} className="form-select size_input_cashbank" name='activitycode' value={activityCode}
                                onChange={(e) => setActivityCode(e.target.value)}>
                                <option value="">Select Activity</option>
                                {activityCodes.map(actcd => (
                                    <option key={actcd.activity_cd} value={actcd.activity_cd}>{actcd.act_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                      {/*  ****************************************************************************
                                   Dealer Name & Alias
                      **************************************************************************** */}

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="dealername" className="form-label label-width">Dealer Name</label>
                            <input id="dealername" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={dealername} onChange={(e) => setDealerName(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="aliasname" className="form-label label-width">Alias</label>
                            <input id="aliasname" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={aliasname} onChange={(e) => setAliasName(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="dealerstatus" className="form-label label-width">Status</label>
                            <select id="dealerstatus" disabled={addMode} className="form-select size_input_cashbank" name='dealerstatus' 
                                value={dealerstatus} onChange={(e) => setDealerStatus(e.target.value)}>
                                <option value="A">Active</option>
                                <option value="C">Closed</option>
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="statuschangedt" className="form-label label-width">Status Change</label>
                            <input id="statuschangedt" disabled type="date" className="form-control size_input_cashbank"
                                value={statuschangedt} onChange={(e) => setStatusChangeDt(e.target.value || null)} />
                        </div>

                    </div>


                    {/*  ****************************************************************************
                                   PAN, Ward No and TDS Rate
                      **************************************************************************** */}
                    <div >
                        <div className="col-md-4 mt-2">
                            <div className="inputOnText">
                                <label className="labelAddress" style={{ top: '-18px' }} htmlFor="Textinput">Finance Info :</label>
                                <div className="form-control size_address">
                                    <div className="row ">
                                        <div className="col-md-4 mb-3 d-flex">
                                            <label htmlFor="dealerPAN" className="form-label label-width">PAN</label>
                                            <input id="dealerPAN" disabled={addMode} type="text" className="form-control" style={{width:'250px'}}
                                              value={dealerPAN} onChange={(e) => setDealerPAN(e.target.value.toUpperCase())} />
                                        </div>
                                        <div className="col-md-4 mb-3 d-flex">
                                            <label htmlFor="wardno" className="form-label label-width">Ward No</label>
                                            <input id="wardno" disabled={addMode} type="text" className="form-control" style={{width:'250px'}}
                                                value={wardno} onChange={(e) => setWardNo(e.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3 d-flex">
                                            <label htmlFor="tdsrate" className="form-label label-width">TDS Rate</label>
                                            <input id="tdsrate" disabled={addMode} type="number" className="form-control" style={{width:'250px', textAlign:'right'}}
                                                value={tdsrate} onChange={(e) => setTDSRate(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                     {/*  ****************************************************************************
                                   Order Limit, Gross Limit, Net Limit
                      **************************************************************************** */}
                      <div>
                        &nbsp;
                      </div>
                    <div >
                        <div className="col-md-4 mt-3">
                            <div className="inputOnText">
                                <label className="labelAddress" style={{ top: '-18px' }} htmlFor="Textinput">Limits :</label>
                                <div className="form-control size_address">
                                    <div className="row">
                                        <div className="col-md-4 mb-3 d-flex">
                                            <label htmlFor="orderlmt" className="form-label label-width">Order Limit</label>
                                            <input id="orderlmt" disabled={addMode} type="number" className="form-control" style={{width:'250px', textAlign:'right'}}
                                              value={orderlmt} onChange={(e) => setOrderLmt(e.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3 d-flex">
                                            <label htmlFor="grosslmt" className="form-label label-width">Gross Limit</label>
                                            <input id="grosslmt" disabled={addMode} type="number" className="form-control" style={{width:'250px', textAlign:'right'}}
                                                value={grosslmt} onChange={(e) => setGrossLmt(e.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3 d-flex">
                                            <label htmlFor="netlmt" className="form-label label-width">Net Limit</label>
                                            <input id="netlmt" disabled={addMode} type="number" className="form-control" style={{width:'250px', textAlign:'right'}}
                                                value={netlmt} onChange={(e) => setNetLmt(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/*  ****************************************************************************
                                   Edit and Save
                     **************************************************************************** */}
                     <div  className="mt-5" style={{float: 'right'}}> 
                        <div className=" d-flex ">
                            <button className="btn btn-primary me-2" onClick={handleAddClick} style={{ width: '150px' }}  ref={adRef}>Add</button>
                            <button className="btn btn-warning me-2" ref={addRef} onClick={() => handleShowAddress(dealerCode)} 
                                style={{ width: '155px' }}>Address/Contacts</button>

                            {addressPopup && <AddressContPopup 
                                   p_parent_id={dealerCode}
                                 onCloseClick={handleCloseAddr} />}

                            <button className="btn btn-warning me-2" onClick={handleShowDealerExc} style={{ width: '150px' }}
                            ref={excRef} >Exchange Link</button>
                            {dealerexcPopup && <DealerExchangePopup 
                                   p_Dealer_Code={dealerCode}
                                   p_Dealer_Name={dealername}
                                   p_Activity_code={activityCode}
                                 onCloseClick={handleCloseDealerExc} />}

                            <button className="btn btn-warning me-2" onClick={handleShowSubDealer} style={{ width: '150px' }}
                            ref={subRef}>Sub-Dealer</button>
                            {subdealerPopup && <SubDealerPopup 
                                   p_Dealer_Code={dealerCode}
                                   p_Dealer_Name={dealername}
                                 onCloseClick={handleCloseSubDealer} />}

                            <button className="btn  btn-secondary me-2" onClick={clearDealer} style={{ width: '150px' }}>Clear</button>
                            <button className="btn  btn-primary me-2" onClick={handleEditClick} style={{ width: '150px' }}
                            ref={editRef}>Search</button>
                            {showEditPopup && <EditPopup onClose={handleCloseEditPopup} onRowSelect={handleVoucharRowSelect} />}
                            <button className="btn btn-success " onClick={handleFinalSave} style={{ width: '150px' }}>Save</button>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    );
}

export default Dealer_Sub_Dealer;
