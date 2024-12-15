// src/App.js
import React, { useEffect, useRef, useState, } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './Segment.css';
import './Activity_Master.css'; 
import { BASE_URL } from "../constants";
import { add } from 'date-fns';

function Activity_Master() {

    const [userId, setUserId] = useState(1);
    const [editMode, setEditMode] = useState('N');
    const [actName, setActName] = useState();
    const [actCode, setActCode] = useState();
    // const [segment, setSegment] = useState();
    // const [segments, setSegments] = useState([]);
    const [activities, setActivities] = useState([]);
    const [addMode, setAddMode] = useState(true);

    // useEffect(() => {
    //     axios.get(`${BASE_URL}/api/ddl_segment_master`)
    //         .then(response => {
    //             setSegments(response.data);
    //         })
    //         .catch(error => console.error('Error fetching exchanges:', error));
    // }, []);

    useEffect(() => {
        getActivities();
    }, []);

    const getActivities = () => {
        axios.get(`${BASE_URL}/api/get_activities`)
            .then(response => {
                setActivities(response.data);
            })
            .catch(error => console.error('Error fetching exchanges:', error));
    }

    const handleFinalSave = async () => {

        if(!actName){
            alert('Please Enter Activity Name.');
            return;
        }

        const mainData = {
            actCode,
            actName,
         //   segment,
            userId,
            editMode,
        };

        const data = {
            header: mainData
        };

        if (actName) {
            const isConfirmed = window.confirm("Sure you want to save the record?");
            if (!isConfirmed) {
                return;
            }
            await axios.post(`${BASE_URL}/api/save_activity_master`, data)
                .then(response => {
                    alert('Activity saved successfully! ' + response.data.message);  
            //        setSegment('');
                    setActName('');
                    getActivities();
                    setAddMode(true);
                })
                .catch(error => console.error('Error saving Activity Master: ', error));
        }    
    }

    const handleAddAct = () => {
    //    setSegment(''); 
        setActName('');

        setEditMode('N');

        setAddMode(false);
    }

    const handleClearAct = () => {

        const isConfirmed = window.confirm('Sure, do you want to clear?');
        if(!isConfirmed){
            return;
        }

      //  setSegment('');
        setActName('');
        setActCode('');
        setAddMode(true);
    }

    const handleSendData = async (selectedRow) => {
     //   setSegment(selectedRow.seg_code); 
        setActName(selectedRow.act_name);
        setActCode(selectedRow.activity_cd)
        setEditMode('Y');

        setAddMode(false);
    }

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header-css">
                    <h5 className="text-center">Activity Master</h5>
                </div>
                <div className="card-body">
                    {/* Sharing Slab & Alias */}
                    <div className="row">

                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="actName" className="form-label label-width">Activity Name</label>
                            <input id="actName" type="text" className="form-control size_input_cashbank" value={actName}
                                disabled={addMode} onChange={(e) => { setActName(e.target.value) }} />
                        </div>

                        {/* <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="segment" className="form-label label-width">Segment</label>
                            <select id="segment" className="form-select size_input_cashbank" disabled={addMode} style={{width: '380px'}}
                                name='segment' value={segment} onChange={(e) => setSegment(e.target.value)}>
                                <option value="">Select Segment</option>
                                {segments.map(Seg_Code => (
                                    <option key={Seg_Code.seg_code} value={Seg_Code.seg_code}>{Seg_Code.seg_name}</option>
                                ))}
                            </select>
                        </div> */}

                    </div>

                    {/* Date From & Date To */}

                    <div className="mt-4">
                        <div className="d-flex">
                            <button className="btn btn-primary me-2" style={{ width: '100px' }} onClick={handleAddAct}
                                disabled={!addMode}>Add</button>
                            <button className="btn  btn-secondary me-2" onClick={handleClearAct} style={{ width: '150px' }} 
                                disabled={addMode}>Clear</button>
                            <button className="btn btn-success me-2" style={{ width: '150px' }} onClick={handleFinalSave} 
                                disabled={addMode}>Save</button>
                        </div>
                    </div>
                </div>

                <div className='table-container'>
                    <table className="table mt-3 table-wrapper" style={{height: '100px'}}>
                        <thead className='table-primary' style={{ position: 'sticky', top: '0', index: '2', textAlign:'left' }}>
                            <tr>
                                <th>Activity Name</th> 
                                {/* <th>Segment</th> */}
                                <th hidden>activity_cd</th>
                            </tr>

                        </thead>
                        <tbody>
                            {activities.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.act_name}</td>
                                    {/* <td>{result.seg_name}</td> */}
                                    <td hidden>{result.activity_cd}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Activity_Master;
