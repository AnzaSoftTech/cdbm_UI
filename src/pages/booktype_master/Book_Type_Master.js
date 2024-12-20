// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './journal.css'; 
import './Book_Type_Master.css';
import EditPopup from './EditPopup.js';
import { format, parseISO } from 'date-fns';
import { BASE_URL } from ".././constants";

// import searchIcon from './image/search.png';
// import { Tooltip, OverlayTrigger } from 'react-bootstrap';
// import { Modal, Button } from 'react-bootstrap';
// import PopupSearchBookTypeMaster from './popupSearchBookTypeMaster.js';

function Book_Type_Master() {

    const [header, setHeader] = useState({});
    const [finYear, setFinYear] = useState();
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [segment, setSegment] = useState('');
    const [segments, setSegments] = useState([]);
    const [activityCode, setActivityCode] = useState('');
    const [activityCodes, setActivityCodes] = useState([]);
    const [bookType, setBookType] = useState('');
    const [bookTypeDesc, setBookTypeDesc] = useState('');
    const [endDate, setEndDate] = useState();
    const [jvNo, setJVNo] = useState(0);
    const [userId, setUserId] = useState(1);
    const [addMode, setAddMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    // const [showModalBkM, setShowModalBkM] = useState(false);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_activity_master`)
            .then(response => setActivityCodes(response.data))
            .catch(error => console.error('Error fetching activity:', error));
        clearBookType();
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_segment_master`)
            .then(response => setSegments(response.data))
            .catch(error => console.error('Error fetching segment:', error));
    }, []);

    const handleSegment = async (p_Segment) => {
        try {

            setSegment(p_Segment);

            console.log('p_Segment >>> ', p_Segment);

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

    const handleFinalSave = () => {
        if (!activityCode) {
            alert('Please select Activity.');
            return;
        }
        if (!segment) {
            alert('Please select Segment.');
            return;
        }
        if (!bookType) {
            alert('Please enter the Book Type.');
            return;
        }
        if (!bookTypeDesc) {
            alert('Please enter the Description.');
            return;
        }
        const mainData = {
            activityCode,
            segment,
            bookType,
            jvNo,
            bookTypeDesc,
            endDate,
            userId,
        };

        setHeader(mainData);
        const data = {
            header: mainData,
        };

        if (bookType.length === 6) {
            const isConfirmed = window.confirm("Sure you want to save the record ?");
            if (!isConfirmed) {
                return;
            }
            axios.post(`${BASE_URL}/api/save_bookType`, data)
            .then(response => {
                alert('Book Type saved successfully!');
                clearBookType();
                // Reset form state after successful save
                // setFinYear('');
                // setActivityCode('');
                // setSegment('');
                // setBookType('');
                // setEndDate('');
                // setBookTypeDesc('');
                // setJVNo('');
                // setActivityCodes([]); 
                // setAddMode(true);  
            })
            .catch(error => console.error('Error saving Book Type Master:', error));
        }
        else{
            alert('Book Type must be 6 characters!');
        }
    };

    const clearBookType = () => {
        setFinYear('');
        setActivityCode('');
        setSegment('');
        setBookType('');
        setEndDate('');
        setBookTypeDesc('');
        setJVNo('');
        setActivityCodes([]);
        // setAddMode(false);
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

    const handleVoucharRowSelect = (fin_year, book_type, book_type_desc, seg_code, jv_no, end_date, activity_code) => {


        console.log('Selected row in book_type_master_data.fin_year ', fin_year);
        setFinYear(fin_year);
        setBookType(book_type);
        setBookTypeDesc(book_type_desc);
        setSegment(seg_code);

        if (end_date) {
            const dateString = end_date;
            const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
            setEndDate(formattedDate);
        }

        setAddMode(false);
        setEditMode(true);

        if (seg_code) {
            setActivityCodes([]);
            axios.get(`${BASE_URL}/api/ddl_activity_master?p_segment_cd=` + seg_code)
                .then(response => setActivityCodes(response.data))
                .catch(error => console.error('Error fetching activity:', error));
        }

        setActivityCode(activity_code);
        setJVNo(jv_no);

        setShowEditPopup(false);

    }

    return (
        <div className="container-common">
            <div className="card">
                <div className="card-header-css">
                    <h5 className="text-center">Book Type </h5>
                </div>
                <div className="card-body">
                    {/*  ****************************************************************************
                                       FIN YEAR
            **************************************************************************** */}
                    {/* <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="finYear" className="form-label label-width">Fin Year</label>
                            <input id="finYear" disabled={true} type="text" className="form-control size_input_cashbank"
                                value={finYear} />
                        </div>
                    </div> */}

                    {/*  ****************************************************************************
                                   Segment & Activity Code
            **************************************************************************** */}
                    <div className="row">
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
                            <label htmlFor="activityCode" className="form-label label-width">Activity</label>
                            <select id="activityCode" disabled={addMode} className="form-select size_input_cashbank" name='activityCode' value={activityCode}
                                onChange={(e) => setActivityCode(e.target.value)}>
                                <option value=" ">Select Activity</option>
                                {activityCodes.map(Act_Code => (
                                    <option key={Act_Code.activity_cd} value={Act_Code.activity_cd}>{Act_Code.act_name}</option>
                                ))}
                            </select>
                        </div>


                        {/*  ****************************************************************************
                                 Book Type & Description 
            **************************************************************************** */}
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="bookType" className="form-label label-width">Book Type</label>
                            <input id="bookType" maxLength="6" type="text" className="form-control size_input_cashbank"
                                disabled={editMode}
                                value={bookType} onChange={(e) => { setBookType(e.target.value.toUpperCase().replace(/\s+/g, '').slice("0,6")) }} />
                            {/* style={{ width: '340px', marginRight: '10px' }} */}
                            {/* <OverlayTrigger
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
                                        onClick={() => handleSearchBookTypeMas()}
                                        style={{
                                            width: '20px', // Adjust size as needed
                                            height: '20px',
                                            marginTop: '7px'
                                        }}
                                    />
                                </OverlayTrigger>
                                <Modal show={showModalBkM} onHide={() => setShowModalBkM(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Search Book Type</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <PopupSearchBookTypeMaster/>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowModalBkM(false)}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal> */}
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="bookTypeDesc" className="form-label label-width">Description</label>
                            <input id="bookTypeDesc" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={bookTypeDesc}
                                onChange={(e) => setBookTypeDesc(e.target.value.toUpperCase())} />
                        </div>


                        {/*  ****************************************************************************
                                Curr JV No &  End Date
            **************************************************************************** */}
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="endDate" className="form-label label-width">End Date</label>
                            <input id="endDate" disabled={addMode} type="date" className="form-control size_input_cashbank" style={{ marginLeft: '0px' }}
                                value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>

                        {/* <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="jvNo" className="form-label label-width">Curr JV No</label>
                            <input id="jvNo" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={jvNo} onChange={(e) => setJVNo(e.target.value)} />
                        </div> */}
                       

                    </div>


                    {/*  ****************************************************************************
                                   Edit and Save
            **************************************************************************** */}
                    <div className="row ">
                        <div className="col-lg-12 col-md-6  mb-3 d-flex  justify-content-center ">
                            <button className="btn  btn-primary me-2" onClick={handleAddClick}>Add</button>
                            <button className="btn  btn-primary me-2" disabled={addMode} onClick={clearBookType}>Clear</button>
                            <button className="btn  btn-primary me-2" onClick={handleEditClick} >Edit</button>
                            {showEditPopup && <EditPopup onClose={handleCloseEditPopup} onRowSelect={handleVoucharRowSelect} />}
                            <button className="btn btn-success" disabled={addMode} onClick={handleFinalSave} style={{ width: '150px' }}
                            >Save</button>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    );
}

export default Book_Type_Master;
