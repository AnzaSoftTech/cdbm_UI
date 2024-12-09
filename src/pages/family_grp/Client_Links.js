import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import deleteIcon from './image/delete.png';
import searchIcon from './image/search.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap';
import PopupSearchClientName from './popupSearchClientName.js';
import './FamGrp_Master.css';
import './PopupCss.css';
import { BASE_URL } from ".././constants";
import debounce from 'lodash.debounce';

function Client_Links_Popup({ onCloseClick, p_fam_id, p_fam_name }) {
    const [clientCd, setClientCd] = useState('');
    const [cliName, setCliName] = useState('');
    const [showModalCliName, setShowModalCliName] = useState(false);
    const [header, setHeader] = useState({});  
    const [cliNameResults, setCliNameResults] = useState([]); 

    useEffect(() => {
        handleGetCliLinks();
    }, []);

    const handleSearchClientName = () => {
        setShowModalCliName(true); // Opens the modal
    };

    const handleGetCliLinks = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/get_linked_client`, {
                params: {
                    p_family_code: p_fam_id
                }
            });
            setCliNameResults(response.data);
            
            // console.log('response.data ==> ', response.data);
            // console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error searching client link:', error);
        }
    }

    const handleFinalSave = () => {

            if (!clientCd) 
            {
                alert('Please enter client code.');
                return;
            }

        const headerData = {
            clientCd,
            cliName,
            p_fam_id,
        };
        setHeader(headerData);
        const data = {
            header: headerData
        };

        axios.post(`${BASE_URL}/api/upd_client_link`, data)
            .then(response => {
                alert('Client Link saved successfully!')
                handleGetCliLinks();
            });
        setClientCd('');
        setCliName('');

        //      to re-fresh the address section again
        handleGetCliLinks();

    };

    const handleCliRowSelect = (client_cd, name) => {
        setClientCd(client_cd);
        setCliName(name);
        setShowModalCliName(false);
    }

    const handleDelete = (code) => {
        const data = {
            p_delCli_cd: { code }
        };
    
        const isConfirmed = window.confirm("Sure you want to delete the record ?");
        if (!isConfirmed) {
            return;
        }

        axios.post(`${BASE_URL}/api/delete_client_link`, data)
            .then(response => {
                alert('Client Link deleted successfully!');
                handleGetCliLinks();
            })
            .catch(error => {
                console.error('Error deleting client link:', error);
                alert('Error deleting client link. Please try again.');
            });
        // alert(code);
    }

    const handleDeleteAll = (code) => {
        const data = {
            p_delCli_cd: { p_fam_id }
        };
    
        const isConfirmed = window.confirm("Sure you want to delete the records ?");
        if (!isConfirmed) {
            return;
        }

        axios.post(`${BASE_URL}/api/delete_client_links`, data)
            .then(response => {
                alert('Client Links deleted successfully!');
                handleGetCliLinks();
            })
            .catch(error => {
                console.error('Error deleting client links:', error);
                alert('Error deleting client links. Please try again.');
            });
        // alert(code);
    }
    

    const fetchfunc = async (code) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/get_client_name`, {
                params: {
                    p_client_cd: code,
                }
            });
            setCliName(response.data[0].name);
            console.log('response.data for client name ==> ', response.data[0].name);
        } catch (error) {
            console.error('Error searching client name:', error);
        }
    }

    const debouncedFetchClientName = debounce((code) => {
        if (code) {
            fetchfunc(code);
        }
    }, 300);

    const handleClientCd = async (value) => {

        setClientCd(value);
        debouncedFetchClientName(value);
    };

    return (
        <div className="popup_addr_cont">
            <div className="popup-inner">
                <div className='div_header_warn'>
                    <h4 className='search_header '>Client Link</h4>
                </div>

                <div>
                </div>

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="FamName" className="form-label label-width">Family Name</label>
                            <input id="FamName" readOnly type="text" className="form-control size_input_cashbank"
                                value={p_fam_name} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="clientCd" className="form-label label-width">Client Code</label>
                            <input id="clientCd" type="text" className="form-control"
                                value={clientCd} onChange={(e) => { handleClientCd(e.target.value) }}
                                style={{ width: '340px', marginRight: '10px' }} />
                            <OverlayTrigger
                                placement="bottom"  //Position the tooltip above the button
                                overlay={
                                    <Tooltip id={`tooltip-search`}>
                                        Search Client Name
                                    </Tooltip>
                                }
                            >
                                <img
                                    src={searchIcon}
                                    alt="Search Client Name"
                                    onClick={() => handleSearchClientName()}
                                    style={{
                                        width: '20px',  //Adjust size as needed
                                        height: '20px',
                                        marginTop: '7px'
                                    }}
                                />
                            </OverlayTrigger>
                            <Modal show={showModalCliName} onHide={() => setShowModalCliName(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Search Client Name</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <PopupSearchClientName  onRowSelect={handleCliRowSelect} 
                                     p_family_id={p_fam_id} getClients={handleGetCliLinks} close={setShowModalCliName}/>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowModalCliName(false)}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                        </div>

                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="cliName" className="form-label label-width">Client Name</label>
                            <input id="cliName" readOnly type="text" className="form-control size_input_cashbank"
                                value={cliName} onChange={(e) => setCliName(e.target.value)} />
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <button className='close_btn input_margin' style={{ width: '100px' }}
                                onClick={() => onCloseClick(null)}>Close</button>
                            <button className="save_btn input_margin" style={{ width: '150px' }}
                                onClick={handleFinalSave}>Add</button>
                            <button className="btn btn-secondary input_margin" style={{ width: '150px' }}
                                onClick={handleDeleteAll}>Delete All</button>
                        </div>

                    </div>
                </div>

                {/* ****************************************************************************************************
                **************************************   Start Client Table   *********************************
                **************************************************************************************************** */}

                <div className='div_sub_header_warn'>
                    <h6 className='search_header '>Linked Clients</h6>
                </div>

                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Client Code</th>
                                <th>Client Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cliNameResults.map((result, index) => (
                                <tr key={index} style={{ cursor: 'pointer' }}>
                                    <td>{result.cli_cd?result.cli_cd:result.client_cd}</td>
                                    <td>{result.cli_name?result.cli_name:result.name}</td>
                                    <td><button className='close_btn' onClick={()=>handleDelete(result.cli_cd?result.cli_cd:result.client_cd)}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ****************************************************************************************************
                **************************************   End Client Table   *********************************
                **************************************************************************************************** */}

            </div>

        </div>
    );
}

export default Client_Links_Popup;
