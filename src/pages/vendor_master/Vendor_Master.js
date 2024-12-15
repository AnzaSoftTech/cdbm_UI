// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './journal.css'; 
import './Vendor_Master.css';
import EditPopup from "./EditPopup";
import Address_Contacts from "./Address_Contacts";
import { BASE_URL } from "../constants";
import Bank_Details from './Bank_Details';

function Vendor_Master() {

    const [header, setHeader] = useState({});
    const [actCode, setActCode] = useState('');
    const [sslCode, setSslCode] = useState('');
    const [activityCode, setActivityCode] = useState();
    const [activityCodes, setActivityCodes] = useState([]);
    const [exchange, setExchange] = useState('');
    const [exchanges, setExchanges] = useState([]);
    const [segment, setSegment] = useState('');
    const [segments, setSegments] = useState([]);
    const [acctName, setAcctName] = useState('');
    const [ledgType, setLedgType] = useState('V');
    const [typeAcc, setTypeAcc] = useState('M');     // this is type code
    const [groupCode, setGroupCode] = useState();
    const [groupCodes, setGroupCodes] = useState([]);
    const [subgroupCode, setSubGroupCode] = useState();
    const [subgroupCodes, setSubGroupCodes] = useState([]);
    const [subsubgroupCode, setSubSubGroupCode] = useState();
    const [subsubgroupCodes, setSubSubGroupCodes] = useState([]);
    const [actstatus, setActStatus] = useState('');
    const [crn, setCrn] = useState('');
    const [userId, setUserId] = useState(1);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAddrPopup, setShowAddrPopup] = useState(false);
    const [partyClick, setPartyClick] = useState(true);
    const [bankName, setBankName] = useState('');
    const [acctNo, setAcctNo] = useState('');
    const [branchName, setBranchName] = useState('');
    const [ifscCode, setIFSCCode] = useState('');
    const [gst, setGst] = useState('');
    const [panNo, setPanNo] = useState('');
    const [upi, setUpi] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [addMode, setAddMode] = useState(true);
    const [showBankPopup, setShowBankPopup] = useState(false);
    const [isAuto, setIsAuto] = useState(false);



    // const [toDate, setToDate] = useState();
    // const [bankBranchCode, setBankBranchCode] = useState('');
    // const [acctCatg, setAcctCatg] = useState();
    // const [micr, setMICR] = useState();
    // const [excClearNo, setExcClearNo] = useState();
    // const [visible_tf, setVisible_tf] = useState(false);
    // const [ChqBookPopup, setShowChqBookPopup] = useState(false);
    // const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_MI_master`)
            .then(response => setExchanges(response.data))
            .catch(error => console.error('Error fetching exchanges:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_segment_master`)
            .then(response => setSegments(response.data))
            .catch(error => console.error('Error fetching segment:', error));
        // handleClearClick();
        setUserId(1);
        setActStatus('A');
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_fin_group_level2`)
            .then(response => setGroupCodes(response.data))
            .catch(error => console.error('Error fetching exchanges:', error));
    }, []);


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

    const handleFinalSave = () => {

        // if (actstatus === 'ACTIVE') {
        //     alert('ACTIVE.');
        //     return;
        // }
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

        if (!acctName) {
            alert('Please enter Acccount Name.');
            return;
        }
        if (!activityCode) {
            alert('Please select Activity Code.');
            return;
        }
        if (!panNo) {
            alert('Please enter PAN.');
            return;
        }
        if (!panRegex.test(panNo)) {
            alert('Invalid PAN format, it should AAAAA9999A.');
            return;
        }

        const mainData = {
            actCode,
            activityCode,
            exchange,
            segment,
            acctName,
            sslCode,
            ledgType,
            typeAcc,
            groupCode,
            subgroupCode,
            subsubgroupCode,
            actstatus,
            crn,
            bankName,
            acctNo,
            branchName,
            ifscCode,
            gst,
            panNo,
            upi,
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
        axios.post(`${BASE_URL}/api/save_account_master_vendor`, data)
            .then(response => {
                alert('Vendor Master saved successfully!');
                //console.log('response.data.message ===>>> ', response.data.message);
                setActCode(response.data.message);
                // Reset form state after successful save
                setActCode('');
                setActivityCode('');
                setExchange('');
                setSegment('');
                setAcctName('');
                setSslCode('');
                setGroupCode('');
                setSubGroupCode('');
                setSubSubGroupCode('');
                setActStatus('A');
                setCrn('');
                setBankName('');
                setAcctNo('');
                setBranchName('');
                setIFSCCode('');
                setGst('');
                setPanNo('');
                setUpi('');
                setPartyClick(true);
                setAddMode(true);
                setEditMode(true);
            })
            .catch(error => console.error('Error saving Account Master:', error));
    };

    const handleClearClick = () => {
        const isConfirmed = window.confirm('Sure, you want to clear?');
        if (!isConfirmed) {
            return;
        }
        setActCode('');
        setActivityCode('');
        setExchange('');
        setSegment('');
        setAcctName('');
        setSslCode('');
        setGroupCode('');
        setSubGroupCode('');
        setSubSubGroupCode('');
        setActStatus('A');
        setCrn('');
        setBankName('');
        setAcctNo('');
        setBranchName('');
        setIFSCCode('');
        setGst('');
        setPanNo('');
        setUpi('');
        setPartyClick(true);
        setAddMode(true);
        setEditMode(true);

    }

    const handleAddClick = () => {
        setAddMode(false);
        setEditMode(false);
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

    const handleCloseAddrPopup = () => {
        setShowAddrPopup(false);
    };

    const handleBankClick = () => {
        if (!actCode) {
            alert('Account Name has to be entered.');
            return;
        }
        setShowBankPopup(true);
    };

    const handleCloseBankPopup = () => {
        setShowBankPopup(false);
    };

    const handleVoucharRowSelect = (acc_master_data) => {


        console.log('Selected row in acc_master_data ', acc_master_data);

        setActCode(acc_master_data[0].act_cd);
        setLedgType(acc_master_data[0].ledg_type);
        //console.log('ledg type>>>>',acc_master_data[0].ledg_type)

        if (acc_master_data[0].ledg_type === 'P') {
            setPartyClick(false);
        }
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
        setSslCode(acc_master_data[0].ssl_code);

        setTypeAcc(acc_master_data[0].type_acct);
        setGroupCode(acc_master_data[0].grp_code);


        if (acc_master_data[0].grp_code) {
            setSubGroupCodes([]);
            axios.get(`${BASE_URL}/api/ddl_fin_group_level3?p_grp_lvl2=` + acc_master_data[0].grp_code)
                .then(response => setSubGroupCodes(response.data))
                .catch(error => console.error('Error fetching sub-groups:', error));
        }

        setSubGroupCode(acc_master_data[0].sub_grp_code);

        if (acc_master_data[0].sub_grp_code) {
            setSubSubGroupCodes([]);
            axios.get(`${BASE_URL}/api/ddl_fin_group_level4?p_grp_lvl3=` + acc_master_data[0].sub_grp_code)
                .then(response => setSubSubGroupCodes(response.data))
                .catch(error => console.error('Error fetching sub-groups:', error));
        }

        setSubSubGroupCode(acc_master_data[0].sub_sub_grp_code);
        setBankName(acc_master_data[0].bank_name);
        setAcctNo(acc_master_data[0].bank_acc_no);
        setBranchName(acc_master_data[0].branch_name);
        setIFSCCode(acc_master_data[0].ifsc);
        setGst(acc_master_data[0].gst);
        setPanNo(acc_master_data[0].pan_no);
        setUpi(acc_master_data[0].upi);
        setShowEditPopup(false);

        if (acc_master_data[0].type_acct === 'A') {
            setAddMode(true);
            setIsAuto(true);
        }
        else {
            setAddMode(false);
            setIsAuto(false);
        }

    }

    return (
        <div className="container mt-5">
            <div className="card main-box">
                <div className="card-header-css">
                    <h5 className="text-center">Vendor Master </h5>
                </div>
                <div className="card-body">

                    {/*  ****************************************************************************
                                  Vendor Name & Exchange
            **************************************************************************** */}

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="acctName" className="form-label label-width">Vendor Name</label>
                            <input id="acctName" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={acctName} onChange={(e) => setAcctName(e.target.value.toUpperCase())} />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="sslCode" className="form-label label-width">SSL Code</label>
                            <input id="sslCode" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={sslCode} onChange={(e) => setSslCode(e.target.value.toUpperCase())} />
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
                                   Group & Sub-Group
            **************************************************************************** */}
                    <div className="row ">

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="groupCode" className="form-label label-width">Group</label>
                            <select id="groupCode" disabled={addMode} className="form-select size_input_cashbank" name='groupCode' value={groupCode}
                                onChange={(e) => handleGroup(e.target.value)}>
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
                        {/* <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="CRN" className="form-label label-width ">CRN</label>
                            <input id="CRN" type="text" disabled={addMode} value={crn} onChange={(e) => setCrn(e.target.value)} className="form-control size_input_cashbank" />
                        </div> */}
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="gst" className="form-label label-width">GST</label>
                            <input id="gst" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={gst} onChange={(e) => setGst(e.target.value.toUpperCase())} />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="panNo" className="form-label label-width">PAN</label>
                            <input id="panNo" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={panNo} onChange={(e) => setPanNo(e.target.value.toUpperCase())} />
                        </div>
                    </div>

                    <div className="row">
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
                                   Edit and Save
            **************************************************************************** */}
                    <div className="row ">
                        <div className="col-lg-8 col-md-6 mb-3 d-flex  justify-content-end ">
                            <button className="btn  btn-primary me-2" onClick={handleAddClick} disabled={!addMode}>Add</button>
                            <button className="btn  btn-primary me-2" disabled={addMode} onClick={handleClearClick} >Clear</button>
                            <button className="btn  btn-primary me-2" onClick={handleEditClick} disabled={!addMode}>Search</button>
                            {showEditPopup && <EditPopup onClose={handleCloseEditPopup}
                                onRowSelect={handleVoucharRowSelect} />}
                            <button className="btn btn-success me-2" onClick={handleFinalSave}
                                style={{ width: '150px' }} disabled={addMode} >Save</button>
                            <button className="btn btn-success addrbtn" disabled={addMode}
                                onClick={handleAddrClick} style={{ width: '150px' }} >Addr. & Contact</button>
                            {showAddrPopup && <Address_Contacts p_actCode={actCode}
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

export default Vendor_Master;
