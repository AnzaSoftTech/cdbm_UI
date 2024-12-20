// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './journal.css'; 
import './MII_Master.css';
import EditPopup from './EditPopup.js';
import Branch_Contacts from "./Branch_Contacts";
import MII_Segments from './MII_Segments.js';
import MII_Bank_Detl from './MII_Bank_Details.js';
import MII_Deemat_Detl from './MII_Deemat_Details.js';
import { BASE_URL } from ".././constants";

// import ChequeBookNoTable from './Cheque_Book_No';
// import searchIcon from './image/search.png';
// import { Tooltip, OverlayTrigger } from 'react-bootstrap';
// import { Modal, Button } from 'react-bootstrap';
// import PopupSearchBranch from './popupSearchBranch.js';

function MII_Master() {

    const [header, setHeader] = useState({});
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showBankDtl, setShowBankDtl] = useState(false);
    const [showSegment, setShowSegment] = useState(false);

    const [showBranchPopup, setShowBranchPopup] = useState(false);
    const [showDeematDtl, setShowDeematDtl] = useState(false);
    const [miiCode, setMiiCode] = useState('');
    const [status, setStatus] = useState('A');
    // const [segment, setSegment] = useState('');
    // const [segments, setSegments] = useState([]);
    const [mii_cc_id, setMii_cc_id] = useState('');
    const [mii_cc_ids, setMii_cc_ids] = useState([]);
    const [sebiRegNo, setSebiRegNo] = useState('');
    const [tan, setTan] = useState('');
    const [gstNo, setGstNo] = useState('');
    const [panNo, setPanNo] = useState('');
    const [miiName, setMiiName] = useState('');
    const [miiShortName, setMiiShortName] = useState('');
    const [miiCat, setMiiCat] = useState('');
    const [miiSrcCode, setMiiSrcCode] = useState('');
    const [miiSrcCodes, setMiiSrcCodes] = useState([]);
    const [userId, setUserId] = useState('');
    const [miiCatgCC, setMiiCatgCC] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [addMode, setAddMode] = useState(true);
    
    const [activityCode, setActivityCode] = useState();
    const [activityCodes, setActivityCodes] = useState([]);


    useEffect(() => {
        // axios.get('http://localhost:3001/api/ddl_mii_master',{
        //     params:{
        //         p_mii_cat:miiCat
        //     }
        // })
        //     .then(response => setMiiSrcCodes(response.data))
        //     .catch(error => console.error('Error fetching MiiSrcCodes:', error));

    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_activity_master`)
        .then(response => setActivityCodes(response.data))
        .catch(error => console.error('Error fetching activity:', error));
        setUserId(1);
        setStatus('A');
    }, []);

    // useEffect(() => {
    //     axios.get(`${BASE_URL}/api/ddl_segment_master`)
    //         .then(response => { setSegments(response.data) })
    //         .catch(error => console.error('Error fetching segments:', error));
        
    // }, []);

    const handleMiiCat = async (p_mii_cat) => {
        try {

            setMiiCat(p_mii_cat);

            if (p_mii_cat) {
                setMiiSrcCodes([]);
                setMii_cc_ids([]);
                await axios.get(`${BASE_URL}/api/ddl_mii_master?p_mii_cat=` + p_mii_cat)
                    .then(response => setMiiSrcCodes(response.data))
                    .catch(error => console.error('Error fetching mii source names ddl:', error));
                if (p_mii_cat === 'EXC') {
                    await axios.get(`${BASE_URL}/api/ddl_mii_cc_id`)
                    .then(response => setMii_cc_ids(response.data))
                    .catch(error => console.error('Error fetching mii cc ids ddl:', error));
                }
                if (p_mii_cat === 'CC') {
                    setMiiCatgCC(false);
                }
                else{
                    setMiiCatgCC(true);
                }
            }
            else {
                setMiiSrcCodes([]);
                setMii_cc_ids([]);
            }

        }
        catch (error) {
            console.error("Error in mii source code ddl! ", error);
        }
    }

    const handleBranchClick = () => {
        // if (!actCode)
        // {
        //     alert('Account Name has to be entered.');
        //     return;
        // }
        setShowBranchPopup(true);
    };

    const handleCloseBranchPopup = () => {
        setShowBranchPopup(false);
    };

    const handleFinalSave = () => {

        if (!miiSrcCode) {
            alert('Please select MII Source.');
            return;
        }
        if (!miiCat) {
            alert('Please select MII Category.');
            return;
        }
        if (!miiName) {
            alert('Please enter MII Name.');
            return;
        }
        if (!miiShortName) {
            alert('Please enter MII Short Name.');
            return;
        }

        if (!sebiRegNo) {
            alert('Please enter SEBI Regn. No.');
            return;
        }

        // if (!status) {
        //     alert('Please select Status.');
        //     return;
        // }

        const mainData = {
            miiCode,
            miiSrcCode,
            miiCat,
            miiName,
            miiShortName,
            gstNo,
            panNo,
            tan,
            sebiRegNo,
            mii_cc_id,
            //segment,
            //activity,
            activityCode,
            status,
            userId
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
        axios.post(`${BASE_URL}/api/save_mii_master`, data)
            .then(response => {
                alert('MII Master saved successfully!');
                // Reset form state after successful save
                handleNewClick();
            })
            .catch(error => console.error('Error saving MII Master:', error));
    };

    const handleNewClick = () => {
        setMiiCode('');
        setMiiSrcCode('');
        setMiiSrcCodes([]);
        setMiiCat('');
        setMiiName('');
        setMiiShortName('');
        setGstNo('');
        setPanNo('');
        setTan('');
        setSebiRegNo('');
        setMii_cc_id('');
        setMii_cc_ids([]);
       // setSegment('');
        setActivityCode('');
        setStatus('A');
        setMiiCatgCC(true); 
        setAddMode(true);
        setEditMode(true);
    };

    const handleEditClick = () => {
        setShowEditPopup(true);
    };

    const handleBankDtlClick = () => {

        if (!miiCode) {
            alert('Save the MII first or Edit the existing one to enter/view Bank Details.');
            return;
        }
        setShowBankDtl(true);
    };

    const handleSegmentClick = () => {

        if (!miiCode) {
            alert('Save the MII first or Edit the existing one to enter/view Bank Details.');
            return;
        }
        setShowSegment(true);
    };

    const handleDeematDtlClick = () => {

        if (!miiCode) {
            alert('Save the MII first or Edit the existing one to enter/view Deemat Details.');
            return;
        }
        setShowDeematDtl(true);
    };

    const handleCloseBankDtl = () => {
        setShowBankDtl(false);
    };

    const handleCloseSegments = () => {
        setShowSegment(false);
    };
    
    const handleCloseDeematDtl = () => {
        setShowDeematDtl(false);
    };

    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
    };

    const handleVoucharRowSelect = (mii_master_data) => {


        // console.log('Selected row in mii_master_data.act_type ', mii_master_data[0].act_type);


        setMiiCode(mii_master_data[0].mii_id);
        setMiiCat(mii_master_data[0].mii_catg);
        if (mii_master_data[0].mii_catg) {
            setMiiSrcCodes([]);
            axios.get(`${BASE_URL}/api/ddl_mii_master?p_mii_cat=` + mii_master_data[0].mii_catg)
                .then(response => setMiiSrcCodes(response.data))
                .catch(error => console.error('Error fetching mii src codes:', error));
        }
        if(mii_master_data[0].mii_catg === 'EXC'){
            axios.get(`${BASE_URL}/api/ddl_mii_cc_id`)
            .then(response => setMii_cc_ids(response.data))
            .catch(error => console.error('Error fetching mii cc ids ddl:', error));
        }
        console.log('mii_master_data[0].mii_cc_id',mii_master_data[0].mii_cc_id);
        setMiiSrcCode(mii_master_data[0].mii_src_code);
        setSebiRegNo(mii_master_data[0].sebi_regisn_no);
        setMii_cc_id(mii_master_data[0].mii_cc_id);
        setStatus(mii_master_data[0].status);
        setMiiName(mii_master_data[0].mii_name);
        setMiiShortName(mii_master_data[0].mii_short_name);
        //setSegment(mii_master_data[0].seg_code);
        setActivityCode(mii_master_data[0].activity);
        setTan(mii_master_data[0].tan);
        setPanNo(mii_master_data[0].pan);
        setGstNo(mii_master_data[0].gst_no);
        if (mii_master_data[0].mii_catg === 'CC') {
            setMiiCatgCC(false);
        }else {
            setMiiCatgCC(true);
        }
        // console.log('mii_master_data[0].status', mii_master_data[0].status);
        setAddMode(false);
        setShowEditPopup(false);

    }

    const handleAddClick = () => {
        setAddMode(false);
        setEditMode(false);
    }

    return (
        <div className="container mt-2">
            <div className="card">
                <div className="card-header-css">
                    <h5 className="text-center">MII Master </h5>
                </div>
                <div className="card-body">
                    {/*  ****************************************************************************
                                   Activity & MII Category
            **************************************************************************** */}
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="activity" className="form-label label-width">Activity</label>
                            <select id="activity" disabled={addMode} className="form-select size_input_cashbank" name='activity' value={activityCode} onChange={(e) => setActivityCode(e.target.value)}>
                                <option value="">Select Activity</option>
                                {activityCodes.map(Act_Code => (
                                    <option key={Act_Code.activity_cd} value={Act_Code.activity_cd}>{Act_Code.act_name}</option>
                                ))}
                                {/* <option value="BROKING">Broking</option>
                                <option value="SETTLEMENT">Settlement</option>
                                <option value="DP_SERVICES">DP Services</option>
                                <option value="KYC">KYC</option> */}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="status" className="form-label label-width">Status</label>
                            <select id="status" disabled={addMode} className="form-select size_input_cashbank" name='status' value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="A">Active </option>
                                <option value="C">Closed </option>
                            </select>
                        </div>
                       
                    </div>


                    {/*  ****************************************************************************
                                  MII Source Code & MII Name
            **************************************************************************** */}

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="miiCat" className="form-label label-width">MII Category</label>
                            <select id="miiCat" disabled={addMode} className="form-select size_input_cashbank" name='miiCat' value={miiCat} onChange={(e) => handleMiiCat(e.target.value)}>
                                <option value="">Select MII Category</option>
                                <option value="EXC">Stock Exchange</option>
                                <option value="CC">Clearing Corp</option>
                                <option value="DEPOS ">Depository</option>
                                <option value="KRA ">KRA</option>
                                <option value="CORP ">Corporate</option>
                            </select>

                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="miiSrcCode" className="form-label label-width">MII Source Code</label>
                            <select id="miiSrcCode" disabled={addMode} className="form-select size_input_cashbank" name='miiSrcCode' value={miiSrcCode} onChange={(e) => setMiiSrcCode(e.target.value)}>
                                <option value="">Select MII Source Code</option>
                                {miiSrcCodes.map(MiiSrc => (
                                    <option key={MiiSrc.mii_src_code} value={MiiSrc.mii_src_code}>{MiiSrc.mii_source_name}</option>
                                ))}
                            </select>

                        </div>
                        
                    </div>

                    {/*  ****************************************************************************
                                  MII Short Name & GST
            **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="miiName" className="form-label label-width">MII Name</label>
                            <input id="miiName" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={miiName} onChange={(e) => setMiiName(e.target.value.toUpperCase())} />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="miiShortName" className="form-label label-width">MII Short Name</label>
                            <input id="miiShortName" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={miiShortName} onChange={(e) => setMiiShortName(e.target.value.toUpperCase())} />
                        </div>
                        
                    </div>
                    {/*  ****************************************************************************
                                   PAN & TAN
            **************************************************************************** */}
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="gstNo" className="form-label label-width">GST No.</label>
                            <input id="gstNo" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={gstNo} onChange={(e) => setGstNo(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="panNo" className="form-label label-width">PAN No.</label>
                            <input id="panNo" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={panNo} onChange={(e) => setPanNo(e.target.value)} />
                        </div>
                       
                    </div>
                    {/*  ****************************************************************************
                                    SEBI Regn. No. & MII_CC_ID          
            **************************************************************************** */}

                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="tan" className="form-label label-width">TAN</label>
                            <input id="tan" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={tan} onChange={(e) => setTan(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="sebiRegNo" className="form-label label-width">SEBI Regn. No.</label>
                            <input id="sebiRegNo" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={sebiRegNo} onChange={(e) => setSebiRegNo(e.target.value)} />
                        </div>

                    </div>

                    {/*  ****************************************************************************
                                      SEG_CODE & STATUS                   
            **************************************************************************** */}

                    <div className='row'>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="mii_cc_id" className="form-label label-width">MII CC ID</label>
                            <select id="mii_cc_id" disabled={addMode} className="form-select size_input_cashbank" name='mii_cc_id' value={mii_cc_id} onChange={(e) => setMii_cc_id(e.target.value)}>
                                <option value="">Select MII CC ID</option>
                                {mii_cc_ids.map(MiiCcId => (
                                    <option key={MiiCcId.cc_id} value={MiiCcId.cc_id}>{MiiCcId.cc_name}</option>
                                ))}
                            </select>
                        </div>
                        {/* <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="segment" className="form-label label-width">Segment</label>
                            <select id="segment" disabled={addMode} className="form-select size_input_cashbank" name='segment' value={segment} onChange={(e) => setSegment(e.target.value)}>
                                <option value="">Select Segment</option>
                                {segments.map(Seg => (
                                    <option key={Seg.seg_code} value={Seg.seg_code}>{Seg.seg_name}</option>
                                ))}
                            </select>
                        </div> */}
                    </div>


                    {/*  ****************************************************************************
                                   Edit and Save
            **************************************************************************** */}
                    <div className="row mt-3">
                        <div className="col-lg-10  col-md-6 mb-3 d-flex  justify-content-end ">
                            <button className="btn  btn-primary me-2" onClick={handleAddClick}>Add</button>
                            <button className="btn  btn-primary me-2" onClick={handleSegmentClick} disabled={addMode}>Segments</button>
                            {showSegment && <MII_Segments p_MII_code={miiCode} onClose={handleCloseBankDtl} onCloseClick={handleCloseSegments} />}

                            <button className="btn  btn-primary me-2" onClick={handleBankDtlClick} disabled={addMode}>Bank Details</button>
                            {showBankDtl && <MII_Bank_Detl p_MII_code={miiCode} onClose={handleCloseBankDtl} onCloseClick={handleCloseBankDtl} />}
                            <button className="btn btn-primary me-2"
                                onClick={handleBranchClick} style={{ width: '150px' }} disabled={addMode}>Branch & Cont</button>
                            {/* onRowSelect={handleBranchRowSelect}   */}
                            {showBranchPopup && <Branch_Contacts p_mii_Code={miiCode} onCloseClick={handleCloseBranchPopup} />}
                            <button className="btn  btn-primary me-2" onClick={handleDeematDtlClick} hidden={miiCatgCC} disabled={addMode}>Demat Details</button>
                            {showDeematDtl && <MII_Deemat_Detl p_MII_code={miiCode} onClose={handleCloseDeematDtl} onCloseClick={handleCloseDeematDtl} />}
                            <button className="btn  btn-primary me-2" onClick={handleNewClick} disabled={addMode}>Clear</button>
                            <button className="btn  btn-primary me-2" onClick={handleEditClick}>Edit</button>
                            {showEditPopup && <EditPopup onClose={handleCloseEditPopup} onRowSelect={handleVoucharRowSelect} />}
                            <button className="btn btn-success " onClick={handleFinalSave} style={{ width: '150px' }} disabled={addMode}>Save</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
}

export default MII_Master;
