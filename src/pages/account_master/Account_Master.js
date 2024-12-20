// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './journal.css'; 
import './Account_Master.css';
import EditPopup from "./EditPopup";
import Address_Contacts from "./Address_Contacts";
import { BASE_URL } from ".././constants";
import Bank_Details from './Bank_Details';

function Account_Master() {

    const [header, setHeader] = useState({});
    const [actCode, setActCode] = useState('');
    const [activityCode, setActivityCode] = useState();
    const [activityCodes, setActivityCodes] = useState([]);
    const [exchange, setExchange] = useState('');
    const [exchanges, setExchanges] = useState([]);
    const [segment, setSegment] = useState('');
    const [segments, setSegments] = useState([]);
    const [acctName, setAcctName] = useState('');
    const [ledgType, setLedgType] = useState('G');
    const [typeAcc, setTypeAcc] = useState('M');     // this is type code
    const [groupCode, setGroupCode] = useState();
    const [groupCodes, setGroupCodes] = useState([]);
    const [subgroupCode, setSubGroupCode] = useState();
    const [subgroupCodes, setSubGroupCodes] = useState([]);
    const [subsubgroupCode, setSubSubGroupCode] = useState();
    const [subsubgroupCodes, setSubSubGroupCodes] = useState([]);
    const [actstatus, setActStatus] = useState('A');
    const [crn, setCrn] = useState('');
    const [userId, setUserId] = useState(1);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAddrPopup, setShowAddrPopup] = useState(false);
    const [showBankPopup, setShowBankPopup] = useState(false);
    // const [partyClick, setPartyClick] = useState(true);
    const [editMode, setEditMode] = useState(true);
    const [addMode, setAddMode] = useState(true);
    const [isAuto, setIsAuto] = useState(false);
    const [panNo, setPanNo] = useState('');



    // const [toDate, setToDate] = useState();
    // const [bankBranchCode, setBankBranchCode] = useState('');
    // const [acctCatg, setAcctCatg] = useState();
    // const [micr, setMICR] = useState();
    // const [excClearNo, setExcClearNo] = useState();
    // const [visible_tf, setVisible_tf] = useState(false);
    // const [ChqBookPopup, setShowChqBookPopup] = useState(false);
    // const [showModal, setShowModal] = useState(false);

    // useEffect(() => {
    //     axios.get(`${BASE_URL}/api/ddl_MI_master`)
    //         .then(response => setExchanges(response.data))
    //         .catch(error => console.error('Error fetching exchanges:', error));
    // }, []);

    // useEffect(() => {
    //     axios.get(`${BASE_URL}/api/ddl_segment_master`)
    //         .then(response => setSegments(response.data))
    //         .catch(error => console.error('Error fetching segment:', error));
    //     handleClearClick();
    //     setUserId(1);
    //     setActStatus('A');
    // }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_fin_group_level2`)
            .then(response => setGroupCodes(response.data))
            .catch(error => console.error('Error fetching exchanges:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_activity_master`)
        .then(response => setActivityCodes(response.data))
        .catch(error => console.error('Error fetching activity:', error));
    }, []);

    
    const handleActivityChange = async (p_activity) => {
        try {

            setActivityCode(p_activity);

            if (p_activity) {
                setExchanges([]);
                setSegments([]);
                await axios.get(`${BASE_URL}/api/ddl_activitywise_exchange`, {params: {p_activity_cd: p_activity} })
                    .then(response => setExchanges(response.data))
                    .catch(error => console.error('Error fetching activity:', error));
            }
            else {
                setExchanges([]);
                setSegments([]);
            }

        }
        catch (error) {
            console.error("Error in Activity Selection! ", error);
        }
    }

    const handleExchangeChange = async (p_exc_code) => {
        
        try {

            setExchange(p_exc_code);

            if (p_exc_code) {
                setSegments([]);
                await axios.get(`${BASE_URL}/api/ddl_exchangewise_segment`, {params: {p_Exc_Code: p_exc_code} })
                    .then(response => setSegments(response.data))
                    .catch(error => console.error('Error fetching segment:', error));
            }
            else {
                setSegments([]);
            }

        }
        catch (error) {
            console.error("Error in Exchange Selection! ", error);
        }

    }


    const handleSegment = async (p_Segment) => {
        try {

            setSegment(p_Segment);

            // if (p_Segment) {
            //     setActivityCodes([]);
            //     await axios.get(`${BASE_URL}/api/ddl_activity_master`)
            //         .then(response => setActivityCodes(response.data))
            //         .catch(error => console.error('Error fetching activity:', error));
            // }
            // else {
            //     setActivityCodes([]);
            // }

        }
        catch (error) {
            console.error("Error in Account Type Selection! ", error);
        }
    }

    const handleGroup = async (p_Grp_lvl2) => {
        try {

            setGroupCode(p_Grp_lvl2);

            if (p_Grp_lvl2) {
                setSubGroupCodes([]);
                await axios.get(`${BASE_URL}/api/ddl_fin_group_level3?p_grp_lvl2=` + p_Grp_lvl2)
                    .then(response => setSubGroupCodes(response.data))
                    .catch(error => console.error('Error fetching sub-groups:', error));
            }
            else {
                setSubGroupCodes([]);
            }

        }
        catch (error) {
            console.error("Error in Group Level 3! ", error);
        }
    }

    const handleSubGroup = async (p_Grp_lvl3) => {
        try {

            setSubGroupCode(p_Grp_lvl3);

            if (p_Grp_lvl3) {
                setSubSubGroupCodes([]);
                await axios.get(`${BASE_URL}/api/ddl_fin_group_level4?p_grp_lvl3=` + p_Grp_lvl3)
                    .then(response => setSubSubGroupCodes(response.data))
                    .catch(error => console.error('Error fetching sub-groups:', error));
            }
            else {
                setSubSubGroupCodes([]);
            }

        }
        catch (error) {
            console.error("Error in Group Level 3! ", error);
        }
    }

    const handleFinalSave = () => {

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

        if (!ledgType) {
            alert('Please select Ledger Type.');
            return;
        }
        // if (actstatus === 'ACTIVE') {
        //     alert('ACTIVE.');
        //     return;
        // }
        if (!acctName) {
            alert('Please enter Acccount Name.');
            return;
        }
        // if (!activityCode) {
        //     alert('Please select Activity Code.');
        //     return;
        // }
        // if (!panNo) {
        //     alert('Please enter PAN.');
        //     return;
        // }

        if (panNo) {
            if (!panRegex.test(panNo)) {
                alert('Invalid PAN format, it should AAAAA9999A.');
                return;
            }
        }

        // console.log('save bankBranchCode ==> ', bankBranchCode);

        const mainData = {
            actCode,
            activityCode,
            exchange,
            segment,
            acctName,
            ledgType,
            typeAcc,
            groupCode,
            subgroupCode,
            subsubgroupCode,
            actstatus,
            panNo,
            crn,
            userId,
        };

        setHeader(mainData);
        const data = {
            header: mainData,
        };

        //alert(JSON.stringify(data));
        const isConfirmed = window.confirm("Sure you want to save the record ?");
        if (!isConfirmed) {
            return;
        }
        axios.post(`${BASE_URL}/api/save_account_master`, data)
            .then(response => {
                alert('Account Master saved successfully!');
                //console.log('response.data.message ===>>> ', response.data.message);
                setActCode(response.data.message);
                handleClearClick();
            })
            .catch(error => console.error('Error saving Account Master:', error));
    };

    const handleClearClick = () => {
        // Reset form state when New button is clicked
        setActCode('');
        setActivityCode('');
        setExchange('');
        setSegment('');
        setAcctName('');
        //setLedgType('');
        // setTypeAcc('M');
        setGroupCode('');
        setSubGroupCode('');
        setSubSubGroupCode('');
        setActStatus('A');
        setCrn('');
        setAddMode(true);
        setEditMode(true);
        setPanNo('');
    }

    const handleAddClick = () => {
        setEditMode(false);
        handleClearClick();
        setIsAuto(false);
        setAddMode(false);
    }

    const handleEditClick = () => {
        setShowEditPopup(true);
    };

    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
    };

    const handleAddrClick = () => {
        if (!actCode) {
            alert('Account Name has to be entered.');
            return;
        }
        setShowAddrPopup(true);
    };

    const handleBankClick = () => {
        if (!actCode) {
            alert('Account Name has to be entered.');
            return;
        }
        setShowBankPopup(true);
    };

    const handleCloseAddrPopup = () => {
        setShowAddrPopup(false);
    };

    const handleCloseBankPopup = () => {
        setShowBankPopup(false);
    };

    const handleVoucharRowSelect = (acc_master_data) => {


        console.log('Selected row in acc_master_data ', acc_master_data);

        setActCode(acc_master_data[0].act_cd);
        setLedgType(acc_master_data[0].ledg_type);
        //console.log('ledg type>>>>',acc_master_data[0].ledg_type)

        // if (acc_master_data[0].ledg_type === 'P') {
        //     setPartyClick(false);
        // }
        // else {
        //     setVisible_tf(false);
        // }

        setActStatus(acc_master_data[0].status);
        setCrn(acc_master_data[0].crn);
        console.log('acc_master_data[0].crn>>>>>>>>', acc_master_data[0].crn);
        setAcctName(acc_master_data[0].account_name);

        setExchange(acc_master_data[0].exc_cd);
        setSegment(acc_master_data[0].segment);


        if (acc_master_data[0].segment) {
            setActivityCodes([]);
            axios.get(`${BASE_URL}/api/ddl_activity_master?p_segment_cd=` + acc_master_data[0].segment)
                .then(response => setActivityCodes(response.data))
                .catch(error => console.error('Error fetching activity:', error));
        }

        setActivityCode(acc_master_data[0].activity_cd);

        setTypeAcc(acc_master_data[0].type_acct);
        setGroupCode(acc_master_data[0].grp_code);


        if (acc_master_data[0].grp_code) {
            setSubGroupCodes([]);
            axios.get(`${BASE_URL}/api/ddl_fin_group_level3?p_grp_lvl2=` + acc_master_data[0].grp_code)
                .then(response => setSubGroupCodes(response.data))
                .catch(error => console.error('Error fetching sub-groups:', error));
        }

        setSubGroupCode(acc_master_data[0].sub_grp_code);
        setPanNo(acc_master_data[0].pan_no);

        if (acc_master_data[0].sub_grp_code) {
            setSubSubGroupCodes([]);
            axios.get(`${BASE_URL}/api/ddl_fin_group_level4?p_grp_lvl3=` + acc_master_data[0].sub_grp_code)
                .then(response => setSubSubGroupCodes(response.data))
                .catch(error => console.error('Error fetching sub-groups:', error));
        }

        setSubSubGroupCode(acc_master_data[0].sub_sub_grp_code);
        setShowEditPopup(false);

        console.log('type_acct ', acc_master_data[0].type_acct);

        if (acc_master_data[0].type_acct === 'A') {
            setAddMode(true);
            setIsAuto(true);
        }
        else{
            setAddMode(false);
            setIsAuto(false);
        }


    }

    return (
        <div className="container-common">
            <div className="card ">
                <div className="card-header-css">
                    <h5 className="text-center">Account Master </h5>
                </div>
                <div className="card-body">
                    {/*  ****************************************************************************
                                   Ledger Type & Status
            **************************************************************************** */}
                    <div className="row">
                        {/*        <div className="col-md-6 mb-3 d-flex">
                            <label className="form-label label-width">Ledger Type</label>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" disabled={addMode} type="radio" name="inlineRadioOptions" id="LedgerType1" value={'P'} checked={ledgType === 'P'} onClick={e => { setLedgType(e.target.value); setPartyClick(false) }} />
                                <label className="form-check-label" htmlFor="LedgerType1">Party</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" disabled={addMode} type="radio" name="inlineRadioOptions" id="LedgerType2" value={'G'} checked={ledgType === 'G'} onClick={e => { setLedgType(e.target.value); setPartyClick(true) }} />
                                <label className="form-check-label" htmlFor="LedgerType2">General</label>
                            </div>
                        </div> */}
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="acctName" className="form-label label-width">Account Name</label>
                            <input id="acctName" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={acctName} onChange={(e) => setAcctName(e.target.value.toUpperCase())} />
                        </div>

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="actstatus" className="form-label label-width">Status</label>
                            <select id="actstatus" disabled={addMode} className="form-select size_input_cashbank" name='actstatus' value={actstatus}
                                onChange={(e) => setActStatus(e.target.value)}>
                                {/* <option value="">Select Status</option> */}
                                <option value="A">Active</option>
                                <option value="C">Closed</option>
                                {/* <option value="SUSPENDED">Suspended</option> */}
                            </select>
                        </div>

                    </div>


                    {/*  ****************************************************************************
                                  Acitivty & Exchange
            **************************************************************************** */}
                  

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="activityCode" className="form-label label-width">Activity Code</label>
                            <select id="activityCode" disabled={addMode} className="form-select size_input_cashbank"
                             name='activityCode' value={activityCode}
                                onChange={(e) => handleActivityChange(e.target.value)}>
                                <option value=" ">Select Activity Code</option>
                                {activityCodes.map(Act_Code => (
                                    <option key={Act_Code.activity_cd} value={Act_Code.activity_cd}>{Act_Code.act_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="exchange" className="form-label label-width">Exchange</label>
                            <select id="exchange" disabled={addMode} className="form-select size_input_cashbank" name='exchange' value={exchange}
                                onChange={(e) => handleExchangeChange(e.target.value)}>
                                <option value=" ">Select Exchange</option>
                                {exchanges.map(Exc => (
                                    <option key={Exc.exc_cd} value={Exc.exc_cd}>{Exc.exc_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>


                    {/*  ****************************************************************************
                                  Segment & Activity Code
            **************************************************************************** */}
                    <div className="row ">

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="segment" className="form-label label-width">Segment</label>
                            <select id="segment" disabled={addMode} className="form-select size_input_cashbank" style={{ marginLeft: '0px' }}
                                name='segment' value={segment} onChange={(e) => handleSegment(e.target.value)}>
                                <option value="">Select Segment</option>
                                {segments.map(Seg_Code => (
                                    <option key={Seg_Code.seg_code} value={Seg_Code.seg_code}>{Seg_Code.seg_name}</option>
                                ))}
                            </select>
                        </div>

                       

                    </div>
                    {/*  ****************************************************************************
                                   Group & Sub-Group
            **************************************************************************** */}
                    <div className="row ">

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="groupCode" className="form-label label-width">Group</label>
                            <select id="groupCode" disabled={addMode} className="form-select size_input_cashbank" name='groupCode' 
                                value={groupCode} onChange={(e) => handleGroup(e.target.value)}>
                                <option value=" ">Select Group</option>
                                {groupCodes.map(Grp => (
                                    <option key={Grp.grp_cd_lvl2} value={Grp.grp_cd_lvl2}>{Grp.grp_desc}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="subgroupCode" className="form-label label-width">Sub-Group</label>
                            <select id="subgroupCode" disabled={addMode} className="form-select size_input_cashbank" name='subgroupCode' value={subgroupCode}
                                onChange={(e) => handleSubGroup(e.target.value)}>
                                <option value=" ">Select Sub-Group</option>
                                {subgroupCodes.map(SubGrp => (
                                    <option key={SubGrp.grp_cd_lvl3} value={SubGrp.grp_cd_lvl3}>{SubGrp.grp_desc}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                    {/*  ****************************************************************************
                                    Sub-Sub-Group & CRN 
            **************************************************************************** */}

                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="subsubgroupCode" className="form-label label-width">Sub-Sub-Group</label>
                            <select id="subsubgroupCode" disabled={addMode} className="form-select size_input_cashbank" name='subsubgroupCode' value={subsubgroupCode}
                                onChange={(e) => setSubSubGroupCode(e.target.value)}>
                                <option value=" ">Select Sub-Sub-Group</option>
                                {subsubgroupCodes.map(SubSubGrp => (
                                    <option key={SubSubGrp.grp_cd_lvl4} value={SubSubGrp.grp_cd_lvl4}>{SubSubGrp.grp_desc}</option>
                                ))}
                            </select>
                        </div>
                        {/* 
                            <div className="col-md-6 mb-3 d-flex">
                                <label htmlFor="CRN" className="form-label label-width ">CRN</label>
                                <input id="CRN" type="text" disabled={true} value={crn} onChange={(e) => setCrn(e.target.value)} className="form-control size_input_cashbank" />
                            </div>
                         */}
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="panNo" className="form-label label-width">PAN</label>
                            <input id="panNo" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={panNo} onChange={(e) => setPanNo(e.target.value.toUpperCase())} />
                        </div>
                    </div>

                    {/*  ****************************************************************************
                                           Type Code
                        **************************************************************************** */}

                    {/* <div className="col-md-6 mb-3 d-flex">
                        <label htmlFor="typeCode" className="form-label label-width">Type Code</label>
                        <select id="typeCode" disabled={addMode} className="form-select size_input_cashbank" name='typeCode' value={'Type Code'}
                            onChange={(e) => setTypeAcc(e.target.value)}>
                            <option value=" ">Select Type Code</option>
                    
                        </select>
                    </div> */}


                    {/*  ****************************************************************************
                                   From Date and To Date
            **************************************************************************** */}
                    {/* <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="fromDate" className="form-label label-width">From Date</label>
                            <input id="fromDate" type="date" className="form-control size_input_cashbank" style={{ marginLeft: '0px' }}
                                value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="toDate" className="form-label label-width ">To Date </label>
                            <input id="toDate" type="date" className="form-control size_input_cashbank" style={{ marginLeft: '0px' }}
                                value={toDate} onChange={(e) => setToDate(e.target.value)} />
                        </div>
                    </div> */}


                    {/*  ****************************************************************************
                                  Bank Branch and Account Catg
            **************************************************************************** */}
                    {/* {visible_tf && (

                        <div className="row">
                            <div className="col-md-6 mb-3 d-flex">
                                <label htmlFor="bankBranch" className="form-label label-width">Bank Branch</label>
                                <input id="bankBranch" type="text" className="form-control" style={{ width: '340px', marginRight: '10px' }}
                                    readOnly value={bankBranch} onChange={(e) => setBankBranch(e.target.value)} />

                                <OverlayTrigger
                                    placement="bottom" // Position the tooltip above the button
                                    overlay={
                                        <Tooltip id={`tooltip-search`}>
                                            Search Branch
                                        </Tooltip>
                                    }
                                >
                                    <img
                                        src={searchIcon}
                                        alt="Search Branch"
                                        // onClick={() => handleSearchBranch()}
                                        style={{
                                            width: '20px', // Adjust size as needed
                                            height: '20px',
                                            marginTop: '7px'
                                        }}
                                    />
                                </OverlayTrigger>
                                <Modal show={showModal} onHide={() => setShowModal(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Search and Select Branch</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <PopupSearchBranch onSelectRow={handleSelectedBranch} />
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                            </div>
                            <div className="col-md-6 mb-3 d-flex">
                                <label htmlFor="acctCatg" className="form-label label-width">Account Category</label>

                                <select id="acctCatg" className="form-select size_input_cashbank" name='acctCatg' value={acctCatg}
                                    onChange={(e) => setAcctCatg(e.target.value)}>
                                    <option value=" ">Select Account Category</option>
                                    <option value="CLIENT">Client</option>
                                    <option value="OWN">Own</option>
                                    <option value="SETTLEMENT">Settlement</option>
                                    <option value="EXCDUES">Exchange Dues</option>
                                    <option value="MARGIN">Margin</option>
                                    <option value="MTF">MTF</option>
                                </select>

                            </div>
                        </div>

                    )} */}


                    {/*  ****************************************************************************
                                  IFSC and MICR
            **************************************************************************** */}

                    {/* {visible_tf && (

                        <div className="row">
                            <div className="col-md-6 mb-3 d-flex">
                                <label htmlFor="ifscCode" className="form-label label-width">IFSC</label>
                                <input id="ifscCode" type="text" className="form-control size_input_cashbank"
                                    value={ifscCode} onChange={(e) => setIFSCCode(e.target.value)} />
                            </div>
                            <div className="col-md-6 mb-3 d-flex">
                                <label htmlFor="micr" className="form-label label-width">MICR</label>
                                <input id="micr" type="text" className="form-control size_input_cashbank"
                                    value={micr} onChange={(e) => setMICR(e.target.value)} />

                            </div>
                        </div>

                    )} */}

                    {/*  ****************************************************************************
                                  Exchange Clearing No
            **************************************************************************** */}
                    {/* {visible_tf && (
                        <div className="row">
                            <div className="col-md-6 mb-3 d-flex">
                                <label htmlFor="excClearNo" className="form-label label-width">Exc Clear No.</label>
                                <input id="excClearNo" type="text" className="form-control size_input_cashbank"
                                    value={excClearNo} onChange={(e) => setExcClearNo(e.target.value)} />
                            </div>
                            <div className="col-md-6 mb-3 d-flex">
                                <button id="btn_chq_book" className="btn btn-primary"
                                    onClick={() => handleShowChequeNo(cbAcctCode)}  >Cheque Book No.</button>
                                onClick={() => handleSearchClick(index, exchange, segment)}
                                onClick={handleChequeNo}
                                {ChqBookPopup && <ChequeBookNoTable  p_cbAcctCode={cbAcctCode}
                                    onCloseClick={handleChqBookNo} />}
                            </div>
                            <div> <input id="CB_Acct_Code" hidden value={cbAcctCode} /> </div>
                        </div>

                    )} */}


                    {/*  ****************************************************************************
                                   Edit and Save
            **************************************************************************** */}
                    <div className="row ">
                        <div className="col-lg-8 col-md-6 mb-3 d-flex  justify-content-end ">
                            <button className="btn  btn-primary me-2" onClick={ handleAddClick }>Add</button>
                            <button className="btn  btn-primary me-2" disabled={addMode} onClick={handleClearClick} >Clear</button>
                            <button className="btn  btn-primary me-2" onClick={handleEditClick}>Search</button>
                            {showEditPopup && <EditPopup onClose={handleCloseEditPopup}
                                onRowSelect={handleVoucharRowSelect} />}
                            <button className="btn btn-success me-2" onClick={handleFinalSave}
                                style={{ width: '150px' }} disabled={addMode} >Save</button>
                            <button className="btn btn-success addrbtn" 
                                onClick={handleAddrClick} style={{ width: '150px' }} >Addr. & Contact</button>
                            {showAddrPopup && <Address_Contacts p_actCode={actCode} is_Auto={isAuto}
                                onCloseClick={handleCloseAddrPopup} />}
                            <button className="btn btn-warning me-2"
                                onClick={handleBankClick} style={{ width: '150px', marginLeft: '7px' }} >Bank Details</button>
                            {showBankPopup && <Bank_Details p_actCode={actCode} p_actName={acctName} is_Auto={isAuto}
                                onCloseClick={handleCloseBankPopup} />}
                        </div>
                    </div>

                </div>
            </div>

        </div>

    );
}

export default Account_Master;
