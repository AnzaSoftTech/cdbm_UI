// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './ClientGrp_Master.css';
import EditPopup from './EditPopup.js';
import Client_Links_Popup from './Client_Links.js';

function ClientGrp_Master() {
    const [header, setHeader] = useState({});
    const [cliGrpCode, setCliGrpCode] = useState();
    const [cliGrp, setCliGrp] = useState('');
    const [userId, setUserId] = useState(1);
    const [showClientPopup, setShowClientPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [addMode, setAddMode] = useState(true);

    const handleFinalSave = () => {


           if (!cliGrp) {
                  alert('Please enter the Client Group Name');
                  return;
           }

        setUserId(1);
        const mainData = {
            cliGrpCode,
            cliGrp,
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

        axios.post('http://localhost:3001/api/save_cli_grp', data)
            .then(response => {
                alert('Client Group saved successfully!');
                // Reset form state after successful save
                handleClearClick();

            })
            .catch(error => console.error('Error saving Client Group:', error));
    };

    const handleEditClick = () => {
        setShowEditPopup(true);
    };

    const handleClearClick = () => {
        // reset form after clear click.
        setAddMode(true);
        setEditMode(true);
        setCliGrpCode('');
        setCliGrp('');
    }

    const handleAddClick = () => {
        setAddMode(false);
        setEditMode(false);
    }

    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
    };

    const handleClientClick = () => {
        if (!cliGrpCode)
        {
        alert('Client Group Name has to be entered.');
        return;
        }
        setShowClientPopup(true);
    };

    const handleCloseClientPopup = () => {
        setShowClientPopup(false);
    };

    const handleVoucharRowSelect = (cli_grp_data) => {
        
        console.log('Selected row in cli_grp_data.cli_grp_name ', cli_grp_data[0].cli_grp_name);
        setCliGrpCode(cli_grp_data[0].cli_grp_cd);
        setCliGrp(cli_grp_data[0].cli_grp_name);
        setAddMode(false);
        setShowEditPopup(false);

    }

    return (
        <div className="container mt-2">
            <div className="card">
                <div className="card-header-css">
                    <h3 className="text-center">Client Group</h3>
                </div>
                <div className="card-body">

                    {/*  ****************************************************************************
                                  Client GROUP NAME
            **************************************************************************** */}

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="cliGrp" className="form-label label-width">Client Grp Name</label>
                            <input id="cliGrp" disabled={addMode} type="text" className="form-control size_input_cashbank"
                                value={cliGrp} onChange={(e) => setCliGrp(e.target.value.toUpperCase())} />
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
                            {showClientPopup && <Client_Links_Popup p_cli_grp_cd={cliGrpCode}
                                onCloseClick={handleCloseClientPopup} p_cli_id={cliGrpCode} p_cli_name={cliGrp}/>}
                            <button className="btn btn-success " style={{ width: '150px' }}  
                             onClick={handleFinalSave} disabled={addMode} >Save</button>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    );
}

export default ClientGrp_Master;
