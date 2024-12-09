// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './FamGrp_Master.css';
import EditPopup from './EditPopup.js';
import Client_Links_Popup from './Client_Links.js';
import { BASE_URL } from ".././constants";

function FamGrp_Master() {
    const [header, setHeader] = useState({});
    const [famGrpCode, setFamGrpCode] = useState();
    const [famGrp, setFamGrp] = useState('');
    const [userId, setUserId] = useState(1);
    const [showClientPopup, setShowClientPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [addMode, setAddMode] = useState(true);

    const handleFinalSave = () => {


           if (!famGrp) {
                  alert('Please enter the Family Group Name');
                  return;
           }

        setUserId(1);
        const mainData = {
            famGrpCode,
            famGrp,
            userId,
        };

        setHeader(mainData);
        const data = {
            header: mainData,
        };

        // alert(JSON.stringify(data));

        const isConfirmed = window.confirm("Sure you want to save the record ?");
        if (!isConfirmed) {
            return;
        }

        axios.post(`${BASE_URL}/api/save_family_grp`, data)
            .then(response => {
                alert('Family Group saved successfully!');
                // Reset form state after successful save
                handleClearClick();

            })
            .catch(error => console.error('Error saving Family Group:', error));
    };

    const handleEditClick = () => {
        setShowEditPopup(true);
    };

    const handleClearClick = () => {
        // reset form after clear click.
        setAddMode(true);
        setEditMode(true);
        setFamGrpCode('');
        setFamGrp('');
    }

    const handleAddClick = () => {
        setAddMode(false);
        setEditMode(false);
    }

    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
    };

    const handleClientClick = () => {
        if (!famGrpCode)
        {
        alert('Family Group Name has to be entered.');
        return;
        }
        setShowClientPopup(true);
    };

    const handleCloseClientPopup = () => {
        setShowClientPopup(false);
    };

    const handleVoucharRowSelect = (fam_grp_data) => {
        
        console.log('Selected row in fam_grp_data.fam_grp_name ', fam_grp_data[0].fam_grp_name);
        setFamGrpCode(fam_grp_data[0].fam_grp_cd);
        setFamGrp(fam_grp_data[0].fam_grp_name);
        setAddMode(false);
        setShowEditPopup(false);

    }

    return (
        <div className="container mt-2">
            <div className="card">
                <div className="card-header-css">
                    <h3 className="text-center">Family Group</h3>
                </div>
                <div className="card-body">

                    {/*  ****************************************************************************
                                  FAMILY GROUP NAME
            **************************************************************************** */}

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="famGrp" className="form-label label-width">Family Grp Name</label>
                            <input id="famGrp" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={famGrp} onChange={(e) => setFamGrp(e.target.value.toUpperCase())} />
                        </div>
                    </div>

                    {/*  ****************************************************************************
                                   Edit and Save
            **************************************************************************** */}
                    <div className="row mt-3">
                        <div className="col-lg-8 col-md-6 mb-3 d-flex  justify-content-end ">
                            <button className="btn  btn-primary me-2" onClick={handleAddClick}>Add</button>
                            <button className="btn  btn-primary me-2" onClick={handleEditClick}>Edit</button>
                            {showEditPopup && <EditPopup onClose={handleCloseEditPopup} 
                             onRowSelect={handleVoucharRowSelect} />}
                            <button className="btn  btn-primary me-2" disabled={addMode} onClick={handleClearClick}>Clear</button>
                            <button className="btn btn-success addrbtn me-2"
                                onClick={handleClientClick} style={{ width: '150px' }} disabled={addMode}>Client Link</button>
                            {showClientPopup && <Client_Links_Popup p_fam_grp_cd={famGrpCode}
                                onCloseClick={handleCloseClientPopup} p_fam_id={famGrpCode} p_fam_name={famGrp}/>}
                            <button className="btn btn-success " style={{ width: '150px' }}  
                             onClick={handleFinalSave} disabled={addMode} >Save</button>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    );
}

export default FamGrp_Master;
