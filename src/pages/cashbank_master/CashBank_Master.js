// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './journal.css'; 
import './CashBank_Master.css';
import ChequeBookNoTable from './Cheque_Book_No.js';
import searchIcon from './image/search.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap';
import PopupSearchBookType from './popupSearchBookType.js';
import PopupSearchBranch from './popupSearchBranch.js';
import EditPopup from './EditPopup.js';
import AddressContPopup from './Address_Contacts.js';
import { format, parseISO } from 'date-fns';
import { BASE_URL } from ".././constants";

function CashBank_Master() {

    const [header, setHeader] = useState({});
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [cbAcctCode, setCBAcctCode] = useState('');
    const [acctType, setAcctType] = useState();
    const [actstatus, setActStatus] = useState('ACTIVE');
    const [acctTitle, setAcctTitle] = useState();
    const [activityCode, setActivityCode] = useState();
    const [activityCodes, setActivityCodes] = useState([]);
    const [exchange, setExchange] = useState();
    const [exchanges, setExchanges] = useState([]);
    const [segment, setSegment] = useState();
    const [segments, setSegments] = useState([]);
    const [bookType, setBookType] = useState('');
    const [groupCode, setGroupCode] = useState();
    const [groupCodes, setGroupCodes] = useState([]);
    const [subgroupCode, setSubGroupCode] = useState();
    const [subgroupCodes, setSubGroupCodes] = useState([]);
    const [subsubgroupCode, setSubSubGroupCode] = useState();
    const [subsubgroupCodes, setSubSubGroupCodes] = useState([]);
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [bankName, setBankName] = useState();
    const [acctNo, setAcctNo] = useState();
    const [bankBranchCode, setBankBranchCode] = useState('');
    const [bankBranch, setBankBranch] = useState();
    const [acctCatg, setAcctCatg] = useState();
    const [acctCatgs, setAcctCatgs] = useState();
    const [pan, setPan] = useState('');
    const [gstNo, setGstNo] = useState('');
    const [ifscCode, setIFSCCode] = useState();
    const [micr, setMICR] = useState();
    const [excClearNo, setExcClearNo] = useState();
    const [userId, setUserId] = useState(1);
    const [visible_tf, setVisible_tf] = useState(false);
    const [ChqBookPopup, setShowChqBookPopup] = useState(false);
    const [addressPopup, setShowAddressPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalBk, setShowModalBk] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [addMode, setAddMode] = useState(true);

    // const getCurrDate = () => {
    //   var today = new Date();
    //   alert("Hello in currdate");
    //   document.getElementById("tran_date").value = today.getDate();
    // }

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_MI_master`)
            .then(response => setExchanges(response.data))
            .catch(error => console.error('Error fetching exchanges:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_segment_master`)
            .then(response => setSegments(response.data))
            .catch(error => console.error('Error fetching segment:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_fin_group_level2`)
            .then(response => setGroupCodes(response.data))
            .catch(error => console.error('Error fetching exchanges:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_mii_bank_types`)
            .then(response => { setAcctCatgs(response.data)})
            .catch(error => console.error('Error fetching MII bank types:', error));
    }, []);

    const handleAccountType = async (p_AcctType) => {
        try {

            setAcctType(p_AcctType);

            if (p_AcctType === 'CURRENT' || p_AcctType === 'SAVING') {
                setVisible_tf(true);
            }
            else {
                setVisible_tf(false);
            }

        }
        catch (error) {
            console.error("Error in Account Type Selection! ", error);
        }
    }

    const handleSegment = async (p_Segment) => {
        try {

            setSegment(p_Segment);

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

    const handleStatus = async (p_Status) => {
        try {

        }
        catch (error) {
            console.error("Error in Status! ", error);
        }
    }

    const handleAcctCatg = async (p_AcctType) => {
        try {

        }
        catch (error) {
            console.error("Error in Account Type Selection! ", error);
        }
    }

    const handleSearchBranch = () => {
        setShowModal(true); // Opens the modal
    };

    const handleSearchBookType = () => {
        setShowModalBk(true); // Opens the modal
    };

    const handleShowChequeNo = (p_cb_act_code) => {

        if (!p_cb_act_code) {
            alert('Please Save Cash/Bank entry before entering Cheque No.!');
            return;
        }
        else {
            setShowChqBookPopup(true);
        }


    };

    const handleShowAddress = (p_cb_act_code, p_Addr_Id) => {

        // if (!p_cb_act_code)
        // {
        //     alert('Please Save Cash/Bank entry before entering Address and Contacts !')

        // }
        // else {
        setShowAddressPopup(true);
        // }


    };


    const handleChequeNo = (p_cb_act_code, p_Addr_Id, p_BankShortName) => {

        setShowChqBookPopup(false);
    };

    const handleAddress = (p_cb_act_code) => {

        setShowChqBookPopup(false);
    };

    const handleSelectedBranch = (rowData) => {
        console.log('Selected row:', rowData);
        const { branch_name, branch_cd } = rowData;

        setBankBranch(branch_name);
        setBankBranchCode(branch_cd);
        setShowModal(false);
        console.log('bankBranchCode', bankBranchCode);
    }

    const handleChqBookNo = () => {
        setShowChqBookPopup(false);
    }

    const handleCloseAddr = () => {
        setShowAddressPopup(false);
    }

    const handleFinalSave = () => {


        /*      if (!narration) {
                  alert('Please enter the Narration');
                  return;
              }
      
              if (!voucherDate || !effectiveDate) {
                  alert('Please enter Voucher Date and Effective Date.');
                  return;
              }
      */


        //console.log('save bankBranchCode ==> ', bankBranchCode);
        setUserId(1);
        const mainData = {
            cbAcctCode,
            acctType,
            actstatus,
            acctTitle,
            activityCode,
            exchange,
            segment,
            bookType,
            groupCode,
            subgroupCode,
            subsubgroupCode,
            fromDate,
            toDate,
            bankName,
            acctNo,
            bankBranchCode,
            acctCatg,
            ifscCode,
            micr,
            pan,
            gstNo,
            excClearNo,
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
        axios.post(`${BASE_URL}/api/save_cash_bank_master`, data)
            .then(response => {
                alert('Cash/Bank Master saved successfully!');
                // Reset form state after successful save
                handleClearClick();
            })
            .catch(error => console.error('Error saving Cash/Bank Master:', error));
    };

    const handleClearClick = () => {
        setCBAcctCode('');
        setAcctType('');
        setActStatus('ACTIVE');
        setAcctTitle('');
        setActivityCode('');
        setActivityCodes([]);
        setExchange('');
        setSegment('');
        setBookType('');
        setGroupCode('');
        setSubGroupCode('');
        setSubGroupCodes([]);
        setSubSubGroupCode('');
        setSubSubGroupCodes([]);
        setFromDate('');
        setToDate('');
        setBankName('');
        setAcctNo('');
        setBankBranchCode('');
        setAcctCatg('');
        setIFSCCode('');
        setMICR('');
        setPan('');
        setGstNo('');
        setExcClearNo('');
        setVisible_tf(false);
        setAddMode(true);
        setEditMode(true);
    }

    const handleAddClick = () => {     
        setAddMode(false);
        setEditMode(false);
    };
    
    const handleEditClick = () => {
        setShowEditPopup(true);
    };

    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
    };

    const handleVoucharRowSelect = (cb_master_data) => {


        console.log('Selected row in cb_master_data.act_type ', cb_master_data[0].act_type);

        setCBAcctCode(cb_master_data[0].cb_act_cd);
        setAcctType(cb_master_data[0].act_type);

        if (cb_master_data[0].act_type === 'CURRENT' || cb_master_data[0].act_type === 'SAVING') {
            setVisible_tf(true);
        }
        else {
            setVisible_tf(false);
        }

        setActStatus(cb_master_data[0].status);
        setAcctTitle(cb_master_data[0].account_title);

        setExchange(cb_master_data[0].exc_cd);
        setSegment(cb_master_data[0].segment);

        if (cb_master_data[0].segment) {
            setActivityCodes([]);
            axios.get(`${BASE_URL}/api/ddl_activity_master?p_segment_cd=` + cb_master_data[0].segment)
                .then(response => setActivityCodes(response.data))
                .catch(error => console.error('Error fetching activity:', error));
        }

        setActivityCode(cb_master_data[0].activity_cd);

        setBookType(cb_master_data[0].book_type);
        setGroupCode(cb_master_data[0].grp_code);

        if (cb_master_data[0].grp_code) {
            setSubGroupCodes([]);
            axios.get(`${BASE_URL}/api/ddl_fin_group_level3?p_grp_lvl2=` + cb_master_data[0].grp_code)
                .then(response => setSubGroupCodes(response.data))
                .catch(error => console.error('Error fetching sub-groups:', error));
        }

        setSubGroupCode(cb_master_data[0].sub_grp_code);

        if (cb_master_data[0].sub_grp_code) {
            setSubSubGroupCodes([]);
            axios.get(`${BASE_URL}/api/ddl_fin_group_level4?p_grp_lvl3=` + cb_master_data[0].sub_grp_code)
                .then(response => setSubSubGroupCodes(response.data))
                .catch(error => console.error('Error fetching sub-groups:', error));
        }

        setSubSubGroupCode(cb_master_data[0].sub_sub_grp_code);
        const startDate = cb_master_data[0].act_start_date;
        const endDate = cb_master_data[0].act_end_date;
        if (startDate) {
            const dateString = startDate;
            const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
            setFromDate(formattedDate);
        }
        if (endDate) {
            const daStr = endDate;
            const forDate = format(parseISO(daStr), 'yyyy-MM-dd');
            setToDate(forDate);
        }
        setBankName(cb_master_data[0].bank_name);
        setAcctNo(cb_master_data[0].acct_no);
        setBankBranchCode(cb_master_data[0].bank_branch_cd);
        setBankBranch(cb_master_data[0].branch_name);
        setAcctCatg(cb_master_data[0].act_catg);
        setIFSCCode(cb_master_data[0].ifsc);
        setMICR(cb_master_data[0].micr);
        setPan(cb_master_data[0].pan);
        setGstNo(cb_master_data[0].gst_no);
        setExcClearNo(cb_master_data[0].exc_clearing_no);

        console.log('cb_master_data[0].gst_no', cb_master_data[0].gst_no);
        console.log('cb_master_data[0].pan', cb_master_data[0].pan);
        setAddMode(false);
        setShowEditPopup(false);

    }

    return (
        <div className="container-common">
            <div className="card">
                <div className="card-header-css">
                    <h5 className="text-center">Cash/Bank Master </h5>
                </div>
                <div className="card-body">
                    {/*  ****************************************************************************
                                   Bank Account Type & Status
                      **************************************************************************** */}
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="acctType" className="form-label label-width">Bank Acc Type</label>
                            <select id="acctType" disabled={addMode} className="form-select size_input_cashbank" name='bankAcctType' value={acctType}
                                onChange={(e) => handleAccountType(e.target.value)}>
                                <option value=" ">Select Bank Acc Type</option>
                                <option value="CURRENT">Current A/c</option>
                                <option value="SAVING">Saving A/c</option>
                                <option value="CASH">Cash</option>
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="status" className="form-label label-width">Status</label>
                            <select id="actstatus" disabled={addMode} className="form-select size_input_cashbank" name='actstatus' value={actstatus}
                                onChange={(e) => setActStatus(e.target.value)}>
                                {/* <option value="">Select Status</option> */}
                                <option value="ACTIVE">Active</option>
                                <option value="CLOSED">Closed</option>
                                <option value="SUSPENDED">Suspended</option>
                            </select>
                        </div>
                    </div>


                    {/*  ****************************************************************************
                                  Account Title & Exchange
            **************************************************************************** */}

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="acctTitle" className="form-label label-width">Account Title</label>
                            <input id="acctTitle" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={acctTitle} onChange={(e) => setAcctTitle(e.target.value.toUpperCase())} />
                        </div>

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="exchange" className="form-label label-width">Exchange</label>
                            <select id="exchange" disabled={addMode} className="form-select size_input_cashbank" name='exchange' value={exchange}
                                onChange={(e) => setExchange(e.target.value)}>
                                <option value=" ">Select Exchange</option>
                                {exchanges.map(Exc => (
                                    <option key={Exc.exc_cd} value={Exc.exc_cd}>{Exc.exc_name}</option>
                                ))}
                            </select>
                        </div>

                    </div>


                    {/*  ****************************************************************************
                                  Segment & Activity
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

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="activityCode" className="form-label label-width">Activity Code</label>
                            <select id="activityCode" disabled={addMode} className="form-select size_input_cashbank" name='activityCode' value={activityCode}
                                onChange={(e) => setActivityCode(e.target.value)}>
                                <option value=" ">Select Activity Code</option>
                                {activityCodes.map(Act_Code => (
                                    <option key={Act_Code.activity_cd} value={Act_Code.activity_cd}>{Act_Code.act_name}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                    {/*  ****************************************************************************
                                   Book Type & Group
            **************************************************************************** */}
                    <div className="row ">

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="bookType" className="form-label label-width">Book Type</label>
                            <input id="bookType" disabled={addMode} maxLength="6" type="text" className="form-control"
                                value={bookType} onChange={(e) => setBookType(e.target.value.toUpperCase().replace(/\s+/g, '').slice("0,6"))}
                                style={{ width: '340px', marginRight: '10px' }} />
                            <OverlayTrigger
                                placement="bottom" // Position the tooltip above the button
                                overlay={
                                    <Tooltip id={`tooltip-search`}>
                                        Search Book Type
                                    </Tooltip>
                                }
                            >
                                <img
                                    src={searchIcon}
                                    alt="Search Book Type"
                                    onClick={() => handleSearchBookType()}
                                    style={{
                                        width: '20px', // Adjust size as needed
                                        height: '20px',
                                        marginTop: '7px'
                                    }}
                                />
                            </OverlayTrigger>
                            <Modal show={showModalBk} onHide={() => setShowModalBk(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Search Book Type</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <PopupSearchBookType />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowModalBk(false)}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                        </div>

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="groupCode" className="form-label label-width">Group</label>
                            <select id="groupCode" disabled={addMode} className="form-select size_input_cashbank" name='groupCode' value={groupCode}
                                onChange={(e) => handleGroup(e.target.value)}>
                                <option value=" ">Select Group</option>
                                {/* <option value="2">Current</option> */}
                                {groupCodes.map(Grp => (
                                    <option key={Grp.grp_cd_lvl2} value={Grp.grp_cd_lvl2}>{Grp.grp_desc}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                    {/*  ****************************************************************************
                                    Sub-Group & Sub-Sub-Group
            **************************************************************************** */}

                    <div className="row ">

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
                    </div>

                    {/*  ****************************************************************************
                                   From Date and To Date
            **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="fromDate" className="form-label label-width">From Date</label>
                            <input id="fromDate" disabled={addMode} type="date" className="form-control size_input_cashbank" style={{ marginLeft: '0px' }}
                                value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="toDate" className="form-label label-width ">To Date </label>
                            <input id="toDate" disabled={addMode} type="date" className="form-control size_input_cashbank" style={{ marginLeft: '0px' }}
                                value={toDate} onChange={(e) => setToDate(e.target.value)} />
                        </div>
                    </div>

                    {/*  ****************************************************************************
                                  Bank Name and Account No.
            **************************************************************************** */}
                    {visible_tf && (
                        <div className="row">
                            <div className="col-md-6 mb-3 d-flex">
                                <label htmlFor="bankName" className="form-label label-width">Bank Name</label>
                                <input id="bankName" type="text" className="form-control size_input_cashbank"
                                    value={bankName} onChange={(e) => setBankName(e.target.value.toUpperCase())} />
                            </div>
                            <div className="col-md-6 mb-3 d-flex">
                                <label htmlFor="acctNo" className="form-label label-width">Account No.</label>
                                <input id="acctNo" type="text" className="form-control size_input_cashbank"
                                    value={acctNo} onChange={(e) => setAcctNo(e.target.value)} />
                            </div>
                        </div>
                    )}
                    {/*  ****************************************************************************
                                  Bank Branch and Account Catg
            **************************************************************************** */}
                    {visible_tf && (

                        <div className="row">
                            <div className="col-md-6 mb-3 d-flex">
                                <label htmlFor="bankBranch" className="form-label label-width">Bank Branch</label>
                                <input id="bankBranch" type="text" className="form-control" style={{ width: '340px', marginRight: '10px' }}
                                    readOnly value={bankBranch} onChange={(e) => setBankBranch(e.target.value.toUpperCase())} />

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
                                        onClick={() => handleSearchBranch()}
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

                                {/* <select id="acctCatg" className="form-select size_input_cashbank" name='acctCatg' value={acctCatg}
                                    onChange={(e) => setAcctCatg(e.target.value)}>
                                    <option value=" ">Select Account Category</option>
                                    <option value="CLIENT">Client</option>
                                    <option value="OWN">Own</option>
                                    <option value="SETTLEMENT">Settlement</option>
                                    <option value="EXCDUES">Exchange Dues</option>
                                    <option value="MARGIN">Margin</option>
                                    <option value="MTF">MTF</option>
                                </select> */}

                                <select id="acctCatg" className="form-select size_input_cashbank" name='acctCatg' value={acctCatg}
                                onChange={(e) => setAcctCatg(e.target.value)}>
                                <option value="">Select Account Category</option>
                                {acctCatgs.map(BnkType => (
                                    <option key={BnkType.bank_type_id} value={BnkType.bank_type_id}>{BnkType.type_name}</option>
                                ))}
                            </select>

                            </div>
                        </div>

                    )}


                    {/*  ****************************************************************************
                                  PAN and GST
            **************************************************************************** */}

                    {visible_tf && (

                        <div className="row">
                            <div className="col-md-6 mb-3 d-flex">
                                <label htmlFor="pan" className="form-label label-width">PAN</label>
                                <input id="pan" type="text" className="form-control size_input_cashbank"
                                    value={pan} onChange={(e) => setPan(e.target.value)} />
                            </div>
                            <div className="col-md-6 mb-3 d-flex">
                                <label htmlFor="gstNo" className="form-label label-width">GST No.</label>
                                <input id="gstNo" type="text" className="form-control size_input_cashbank"
                                    value={gstNo} onChange={(e) => setGstNo(e.target.value)} />

                            </div>
                        </div>

                    )}


                    {/*  ****************************************************************************
                                  IFSC and MICR
            **************************************************************************** */}

                    {visible_tf && (

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

                    )}

                    {/*  ****************************************************************************
                                  Exchange Clearing No & Buttons
            **************************************************************************** */}
                    {visible_tf && (
                        <div className="row">
                            <div className="col-md-6 mb-3 d-flex">
                                <label htmlFor="excClearNo" className="form-label label-width">Exc Clear No.</label>
                                <input id="excClearNo" type="text" className="form-control size_input_cashbank"
                                    value={excClearNo} onChange={(e) => setExcClearNo(e.target.value)} />
                            </div>
                            <div className="col-md-6 mb-3 d-flex">
                            <button id="btn_chq_book" className="btn btn-primary me-2"
                                onClick={() => handleShowChequeNo(cbAcctCode)}  >Chq Bk No.</button>
                            {ChqBookPopup && <ChequeBookNoTable onClick={handleChequeNo} p_cbAcctCode={cbAcctCode}
                                onCloseClick={handleChqBookNo} />}
                            <button id="btn_addr" className="btn btn-primary"
                                onClick={() => handleShowAddress(cbAcctCode, bankBranchCode)}  >Addr & Contacts</button>
                            {addressPopup && <AddressContPopup
                                onClick={handleChequeNo} p_cbAcctCode={cbAcctCode} p_Address_Id={bankBranchCode} p_BankShortName={'ICICI'}
                                onCloseClick={handleCloseAddr} />}</div>
                            <div> <input id="CB_Acct_Code" hidden value={cbAcctCode} /> </div>
                        </div>

                    )}


                    {/*  ****************************************************************************
                                   Edit and Save
            **************************************************************************** */}
                    <div className="row ">
                        <div className="col-lg-8 col-md-6 mb-3 d-flex  justify-content-end ">
                            <button className="btn  btn-primary me-2" onClick={handleAddClick}>Add</button>
                            <button className="btn  btn-primary me-2" onClick={handleEditClick} >Edit</button>
                            {showEditPopup && <EditPopup onClose={handleCloseEditPopup} onRowSelect={handleVoucharRowSelect} />}
                            <button className="btn  btn-primary me-2" onClick={handleClearClick} disabled={addMode} >Clear</button>
                            <button className="btn btn-success me-2 " onClick={handleFinalSave}
                                style={{ width: '150px' }} disabled={addMode} >Save</button>
                           
                        </div>
                    </div>

                </div>
            </div>

        </div>

    );
}

export default CashBank_Master;
