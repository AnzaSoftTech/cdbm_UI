// src/App.js
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Segment.css';
import EditSegPopup from './EditSegPopup';
import { format, parseISO } from 'date-fns';
import { BASE_URL } from ".././constants";


function Segment_Master() {

    const [userId, setUserId] = useState(1);
    const [segCode, setSegCode] = useState('');
    const [stdVal, setStdVal] = useState('');
    const [segName, setSegName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [addMode, setAddMode] = useState(true);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editMode, setEditMode] = useState('N');
    // const [success, setSuccess] = useState('');

    // useEffect(() => {
    //     // Fetch segment data if needed
    //     axios.get('http://localhost:3001/api/ddl_segment_master')
    //         .then(response => {
    //             //
    //         })
    //         .catch(error => console.error('Error fetching segment:', error));

    //     clearSegment();  // Initialize form
    // }, []);

    const handleFinalSave = async () => {
        if (!segCode) {
            alert('Please enter Segment Code.');
            return;
        }
        if (!stdVal) {
            alert('Please enter Standard Value.');
            return;
        }
        if (!segName) {
            alert('Please enter Segment Name.');
            return;
        }
        if (!startDate) {
            alert('Please enter Start Date.');
            return;
        }

        if(endDate){
            if(endDate <= startDate){
                alert('Please enter Start Date less than End Date');
                return;
            }
        }

        const mainData = {
            segCode: segCode,
            stdVal: stdVal,
            segName: segName,
            startDate: startDate,
            endDate: endDate || null,
            editMode,
            userId
        };

        const data = {
            header: mainData,
        };

        if (segCode && stdVal) {
            const isConfirmed = window.confirm("Sure you want to save the record?");
            if (!isConfirmed) {
                return;
            }
            var success = '';
            await axios.post(`${BASE_URL}/api/save_segment`, data)
                .then(response => {
                    success = response.data.message;
                    if (success === '9') {
                        alert(`Segment ${segCode} already exists`);
                    }
                    else {
                        alert('Segment saved successfully!');
                        clearSegment();
                        setEditMode('N');
                        setAddMode(true);
                        setSegCode('');
                        setStdVal('');
                        setSegName('');
                        setStartDate('');
                        setEndDate('');
                    }
                })
                .catch(error => console.error('Error saving Segment Master:', error));
        }
    };

    const clearSegment = () => {
        setSegCode('');
        setStdVal('');
        setSegName('');
        setStartDate('');
        setEndDate('');
        setAddMode(true);
        setEditMode('N');
    }

    const handleAddClick = () => {
        setAddMode(false);
        setEditMode('N');
    }

    const handleEditClick = () => {
        setShowEditPopup(true);
    };

    const handleCloseEditPopup = () => {
        setAddMode(true);
        setEditMode('N');
        clearSegment();
        setShowEditPopup(false);
    };

    const handleRowSelect = (seg_code, std_val, seg_name, seg_start_date, seg_end_date) => {

        setSegCode(seg_code);
        setStdVal(std_val);
        setSegName(seg_name);
        setEditMode('Y');
           

        if (seg_end_date) {
            const dateString = seg_end_date;
            const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
            setEndDate(formattedDate);
        }

        if (seg_start_date) {
            const dateString = seg_start_date;
            const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
            setStartDate(formattedDate);
        }

        setAddMode(false);
        setShowEditPopup(false);

    }

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header-css">
                    <h5 className="text-center">Segment</h5>
                </div>
                <div className="card-body">
                    {/* Segment & Standard Value */}
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="segCode" className="form-label label-width">Segment Code</label>
                            <input id="segCode" disabled={editMode === 'N' ? addMode : true} type="text" 
                                className="form-control size_input_cashbank" value={segCode} 
                                onChange={(e) => { setSegCode(e.target.value.toUpperCase()) }} />
                        </div>

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="stdVal" className="form-label label-width">Standard Value</label>
                            <input id="stdVal" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={stdVal} onChange={(e) => {setStdVal(e.target.value.toUpperCase())}} />
                        </div>
                    </div>

                    {/* Segment Name */}
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="segName" className="form-label label-width">Segment Name</label>
                            <input id="segName" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={segName} onChange={(e) => {setSegName(e.target.value)}} />
                        </div>
                    </div>

                    {/* Start Date & End Date */}
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="startDate" className="form-label label-width">Start Date</label>
                            <input id="startDate" disabled={addMode} type="date" className="form-control size_input_cashbank" 
                                value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="endDate" className="form-label label-width">End Date</label>
                            <input id="endDate" disabled={addMode} type="date" className="form-control size_input_cashbank" 
                                value={endDate || ''} onChange={(e) => setEndDate(e.target.value ? e.target.value : null)} />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="row" style={{float: 'right'}}>
                        <div className="col-lg-12 col-md-6 mb-3 d-flex justify-content-center">
                            <button className="btn btn-primary me-2" disabled={editMode === 'Y' ? true : !addMode} style={{ width: '9rem' }}
                                    onClick={handleAddClick}>Add</button>
                            <button className="btn btn-secondary me-2" style={{ width: '9rem' }} disabled={addMode} 
                                onClick={clearSegment}>Clear</button>
                            <button className="btn btn-primary me-2" style={{ width: '9rem' }} onClick={handleEditClick} 
                                disabled={!addMode}>Search</button>
                            {showEditPopup && <EditSegPopup onClose={handleCloseEditPopup} onRowSelect={handleRowSelect} />}
                            <button className="btn btn-success" disabled={addMode} onClick={handleFinalSave} 
                                style={{ width: '9rem' }}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Segment_Master;
