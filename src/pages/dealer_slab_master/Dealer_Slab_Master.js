// src/App.js
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './Segment.css';
import { format, parseISO } from 'date-fns';
import './Dealer_Slab.css'; 
import './SharingPopupCss.css'; 
import Sharing_Per from './Sharing_Per';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { BASE_URL } from "../constants";


function Dealer_Slab_Master() {

    const [userId, setUserId] = useState(1);
    const [header, setHeader] = useState({});
    const [dateFrom, setDateFrom] = useState();
    const [dateTo, setDateTo] = useState();
    const [sharingSlab, setSharingSlab] = useState();
    const [sharingAlias, setSharingAlias] = useState();
    const [slabs, setSlabs] = useState([]);
    const [sharingSlabId, setSharingSlabId] = useState();
    // const [addMode, setAddMode] = useState(false);
    const [showShrPerPopup, setShowShrPerPopup] = useState(false);
    const [editMode, setEditMode] = useState('N');
    // const [success, setSuccess] = useState('');

    const shrRef = useRef();
    const aliasRef = useRef();
    const dateFromRef = useRef();
    const dateToRef = useRef();
    const newRef = useRef();
    const shrPerRef = useRef();

    useEffect(() => {
        getSlabs();
        shrRef.current.disabled = true;
        aliasRef.current.disabled = true;
        dateFromRef.current.disabled = true;
        dateToRef.current.disabled = true;
        newRef.current.disabled = false;
        shrPerRef.current.disabled = true;
    }, []);




    // useEffect(() => {
    //     // Fetch segment data if needed
    //     axios.get(`${BASE_URL}/api/ddl_segment_master')
    //         .then(response => {
    //             //
    //         })
    //         .catch(error => console.error('Error fetching segment:', error));

    //     // clearSegment();  // Initialize form
    // }, []);

    // useEffect(() => {
    //     if(editMode === 'Y'){
    //         segCodeRef.current.disabled = true;
    //     }
    // }, [editMode])

    const handleFinalSave = async () => {

        if(!sharingSlab){
            alert('Please Enter Sharing Slab');
            return;
        }
        if(!sharingAlias){
            alert('Please Enter Alias');
            return;
        }
        if(!dateFrom){
            alert('Please Enter Date From');
            return;
        }
   

        if(dateTo){
            if(dateTo <= dateFrom){
                alert('Please enter Date From less than Date To!');
                return;
            }
        }

        const mainData = {
            sharingSlabId,
            sharingSlab,
            sharingAlias,
            dateFrom,
            dateTo,
            userId,
            editMode,
        };

        const data = {
            header: mainData
        };

        if (sharingSlab && sharingAlias && dateFrom) {
            const isConfirmed = window.confirm("Sure you want to save the record?");
            if (!isConfirmed) {
                return;
            }
            await axios.post(`${BASE_URL}/api/save_sharing_slab`, data)
                .then(response => {
                    setSharingSlabId(response.data.message);
                    alert('Sharing Slab saved successfully! ' + response.data.message);
                    setSharingSlab('');
                    setSharingAlias('');
                    setDateFrom('');
                    setDateTo('');
                    setEditMode('N');
                    shrPerRef.current.disabled = true;
                    getSlabs();
                })
                .catch(error => console.error('Error saving Sharing Slab: ', error));
        }    
    }

    const handleAddSlab = () => {
        setSharingSlab('');
        setSharingAlias('');
        setDateFrom('');
        setDateTo('');
        setEditMode('N');
        shrRef.current.disabled = false;
        aliasRef.current.disabled = false;
        dateFromRef.current.disabled = false;
        dateToRef.current.disabled = false;
        newRef.current.disabled = true;
        shrPerRef.current.disabled = true;
    }

    const handleClearSlab = () => {
        const isConfirmed = window.confirm("Sure you want to clear the record?");
        if (!isConfirmed) {
            return;
        }
        setSharingSlab('');
        setSharingAlias('');
        setDateFrom('');
        setDateTo('');
        setEditMode('N');
        shrPerRef.current.disabled = true;
    }

    const getSlabs = async () => {
        await axios.get(`${BASE_URL}/api/get_sharing_slabs`)
        .then(response => {
            setSlabs(response.data);
        })
        .catch(error => console.error('Error getting sharing slabs: ', error));
    }

    const handleShowShrPer = () => {
        setShowShrPerPopup(true);
    }

    const handleCloseShrPer = () => {
        setShowShrPerPopup(false);
    };

    const handleAddClick = () => {
        // setAddMode(false);
        // setEditMode('N');
    }

    const handleEditClick = () => {
        // setShowEditPopup(true);
    };

    const handleCloseEditPopup = () => {
        // setAddMode(true);
        // setEditMode('N');
        // clearSegment();
        // setShowEditPopup(false);
    };

    const handleRowSelect = () => {

        // setSegCode(seg_code);
        // setStdVal(std_val);
        // setSegName(seg_name);
        // setEditMode('Y');
           

        // if (seg_end_date) {
        //     const dateString = seg_end_date;
        //     const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
        //     setEndDate(formattedDate);
        // }

        // if (seg_start_date) {
        //     const dateString = seg_start_date;
        //     const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
        //     setStartDate(formattedDate);
        // }

        // setAddMode(false);
        // setShowEditPopup(false);

    }

    const handleSendData = async (selectedRow) => {
        shrRef.current.disabled = false;
        aliasRef.current.disabled = false;
        dateFromRef.current.disabled = false;
        dateToRef.current.disabled = false;
        setSharingSlabId(selectedRow.br_slab_id);
        setSharingSlab(selectedRow.br_slab_name);
        setSharingAlias(selectedRow.alias);
        setDateFrom(selectedRow.date_app);
        setDateTo(selectedRow.date_to || '');
        newRef.current.disabled = false;
        shrPerRef.current.disabled = false;
        setEditMode('Y');
    }

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header-css">
                    <h5 className="text-center">Dealer Sharing Slab</h5>
                </div>
                <div className="card-body">
                    {/* Sharing Slab & Alias */}
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="sharingSlab" className="form-label label-width">Sharing Slab</label>
                            <input id="sharingSlab" type="text" className="form-control size_input_cashbank" value={sharingSlab}
                               ref={shrRef} onChange={(e) => { setSharingSlab(e.target.value) }}
                            />
                        </div>

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="sharingAlias" className="form-label label-width">Sharing Alias</label>
                            <input id="sharingAlias" type="text" className="form-control size_input_cashbank" value={sharingAlias}
                                ref={aliasRef} onChange={(e) => { setSharingAlias(e.target.value) }}
                            />
                        </div>
                    </div>

                    {/* Date From & Date To */}
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="dateFrom" className="form-label label-width">Date From</label>
                            <input id="dateFrom" type="date" className="form-control size_input_cashbank" ref={dateFromRef}
                                value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                        </div>

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="Dateto" className="form-label label-width">Date To</label>
                            <input id="Dateto" type="date" className="form-control size_input_cashbank" ref={dateToRef}
                                value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                        </div>
                    </div>

                    {/* Buttons */}
                    {/* <div className="row">
                        <div className="col-lg-12 col-md-6 mb-3 d-flex justify-content-center">
                            <button className="btn btn-warning me-2" style={{ width: '200px' }} onClick={handleShowShrPer}
                                ref={shrPerRef}>Sharing Percentage</button>
                            {showShrPerPopup &&
                                <Sharing_Per
                                    sharingSlabId={sharingSlabId}
                                    sharingSlab={sharingSlab}
                                    onCloseClick={handleCloseShrPer} />
                            }
                            <button className="btn btn-primary me-2" style={{ width: '100px' }} onClick={handleClearSlab}
                                ref={newRef}>New</button>
                            <button className="btn btn-success me-2" style={{ width: '150px' }} onClick={handleFinalSave}>Save</button>
                        </div>
                    </div> */}

                    <div className="mt-4">
                        <div className="d-flex">
                            <button className="btn btn-warning me-2" style={{ width: '200px' }} onClick={handleShowShrPer}
                                ref={shrPerRef}>Sharing Percentage</button>
                            {showShrPerPopup &&
                                <Sharing_Per
                                    sharingSlabId={sharingSlabId}
                                    sharingSlab={sharingSlab}
                                    onCloseClick={handleCloseShrPer} />
                            }
                            <button className="btn btn-primary me-2" style={{ width: '100px' }} onClick={handleAddSlab}
                                ref={newRef}>Add</button>
                            <button className="btn  btn-secondary me-2" onClick={handleClearSlab} style={{ width: '150px' }}>Clear</button>
                            <button className="btn btn-success me-2" style={{ width: '150px' }} onClick={handleFinalSave}>Save</button>
                        </div>
                    </div>
                </div>

                <div className='div_sub_header_warn'>
                    <h6 className='search_header '>Dealer Sharing</h6>
                </div>

                <div className='table-container'>
                    <table className="table mt-3 table-wrapper" style={{height: '100px'}}>
                        <thead className='table-primary'>
                            <tr>
                                <th>Sharing Slab</th> 
                                <th>Date From</th>
                                <th>Date To</th>
                                <th hidden>Sharing Slab ID</th>
                            </tr>

                        </thead>
                        <tbody>
                            {slabs.map((result, index) => (
                                <tr key={index} onClick={showShrPerPopup ? null : () => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.br_slab_name}</td>
                                    <td>{result.date_app}</td>
                                    <td>{result.date_to}</td>
                                    <td hidden>{result.br_slab_id}</td>
                                    {/* <td hidden>{result.sub_dealer_cd}</td>
                                    <td hidden>{result.parent_id}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dealer_Slab_Master;
