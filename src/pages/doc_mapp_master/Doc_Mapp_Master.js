import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import deleteIcon from './image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import './Doc_Mapp_Master.css';
import EditPopup from './EditPopup.js';
import { BASE_URL } from ".././constants";


function Doc_Mapp_Master() {

    const [userId, setUserId] = useState(1);
    const [docs, setDocs] = useState([]);
    const [catgs, setCatgs] = useState([]);
    const [subCatgs, setSubCatgs] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [addMode, setAddMode] = useState(true);
    const [showEditPopup, setShowEditPopup] = useState(false);

    const [docMappData, setdocMappData] = useState([{
        doc_code: '', docu_type: 'POI', docu_name: '', id_no: 'Y', place_of_issue: 'Y',
        issue_date: 'Y', expiry_date: 'Y', catg: '', sub_catg: '', nse: '', kyc: '',
        ckyc: '', nsdl: '', fatca: '', mand_optn:'M'
    }]);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_catg_doc_mapp`)
            .then(response => { setCatgs(response.data) })
            .catch(error => console.error('Error fetching categories:', error));
        axios.get(`${BASE_URL}/api/ddl_sub_catg_doc_mapp`)
            .then(response => { setSubCatgs(response.data) })
            .catch(error => console.error('Error fetching sub-categories:', error));
        axios.get(`${BASE_URL}/api/ddl_doc_names`)
            .then(response => { setDocs(response.data) })
            .catch(error => console.error('Error fetching categories:', error));
        setUserId(1);
    }, []);

    //     const handleRowSelect = (data, index) => {
    //         setdocMappData(prevData => prevData.map(row => ({
    //             ...row,
    //              doc_code:'',  docu_name: '', docu_type: '', id_no: '', place_of_issue: '', 
    // issue_date: '',expiry_date: '', catg: '', sub_catg: '', nse: '', kyc: '',
    // ckyc: '', nsdl: '', fatca: ''
    //         })));
    //         setSelectedRow(data);
    //         setSelectedRowIndex(index);
    //     };

    const handleInputChange = (index, field, value) => {
        const updatedData = [...docMappData];
        updatedData[index] = { ...updatedData[index], [field]: value };
        setdocMappData(updatedData);
    };

    const handleAddRow = () => {
        setdocMappData([...docMappData, {
            doc_code: '', docu_type: 'POI', docu_name: '', id_no: 'Y', place_of_issue: 'Y',
            issue_date: 'Y', expiry_date: 'Y', catg: '', sub_catg: '', nse: '', kyc: '',
            ckyc: '', nsdl: '', fatca: '', mand_optn:'M'
        }]);
    };

    const handleDeleteRow = (index) => {
        setdocMappData(docMappData.filter((_, i) => i !== index));
    };

    const handleFinalSave = () => {

        if (docMappData[0].docu_name === '') {
            alert('Please enter Document Name.');
            return;
        }

        const isConfirmed = window.confirm('Are you sure you want to save this record ?');
        if (!isConfirmed) {
            return;
        }

        const data = {
            header: { userId: userId },
            details: docMappData,
        };
        console.log('docMappData',docMappData);

        //         // alert(JSON.stringify(data));

        axios.post(`${BASE_URL}/api/save_doc_mapp_master`, data)
            .then(response => {
                alert('Document Mapping Master saved successfully!')
                // After successful save clear screen
                clearFunction();
            });
    };

    const handleVoucharRowSelect = (response) => {
        // console.log('response--->',response);
        setdocMappData([{
            doc_code: response[0].doc_code,
            docu_type: response[0].doc_type,
            docu_name: response[0].doc_name,
            id_no: response[0].id_no,
            place_of_issue: response[0].place_of_issue,
            issue_date: response[0].issue_date,
            expiry_date: response[0].expiry_date,
            catg: response[0].catg,
            sub_catg: response[0].sub_catg,
            nse: response[0].nse,
            kyc: response[0].kyc,
            ckyc: response[0].ckyc,
            nsdl: response[0].nsdl,
            fatca: response[0].fatca,
            mand_optn: response[0].mand_optn,
        }])
        setShowEditPopup(false);
        setAddMode(false);
    }

    const clearFunction = () => {
        setdocMappData([{
            doc_code: '', docu_type: 'POI', docu_name: '', id_no: 'Y', place_of_issue: 'Y',
            issue_date: 'Y', expiry_date: 'Y', catg: '', sub_catg: '', nse: '', kyc: '',
            ckyc: '', nsdl: '', fatca: '', mand_optn:'M'
        }])
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

    const handleClearClick = () => {
        clearFunction();
    }

    //     const handleSendData = async (selectedRow) => {


    //         ////  **********************************
    //         ////  populating contact person details
    //         ////  **********************************

    //         try {
    //             const response = await axios.get('${BASE_URL}/api/get_cont_persons', {
    //                 params: {
    //                     p_addr_id: selectedRow.addr_id || ''
    //                 }
    //             });
    //            // console.log('contact person response --->>>> ', response);
    //             if (response) {
    //                 const contpersonList = response.data.map(cont_pers => {
    //                     return {

    //                         doc_code: cont_pers.doc_code || '',
    //                         docu_name: cont_pers.docu_name || '',
    //                         docu_type: cont_pers.docu_type || '',
    //                         id_no: cont_pers.id_no || '',
    //                         place_of_issue: cont_pers.place_of_issue || '',
    //                         issue_date: cont_pers.issue_date || '',
    //                         expiry_date: cont_pers.expiry_date || '',
    //                         catg: cont_pers.catg || '',
    //                         sub_catg: cont_pers.sub_catg || '',
    //                         nse: cont_pers.nse || '',
    //                         kyc: cont_pers.kyc || '',
    //                         ckyc: cont_pers.ckyc || '',
    //                         nsdl: cont_pers.nsdl || '',
    //                         fatca: cont_pers.fatca || '',  
    //                      };
    //                 });
    //                 console.log('contact person contpersonList --->>>> ', contpersonList);
    //                 setdocMappData(contpersonList);
    //             }

    //            // console.log('response.data ==> ', response.data);
    //            // console.log('hiii---',response.data)
    //         } catch (error) {
    //             console.error('Error searching address:', error);
    //         }
    //     }


    const columns = [

        {
            name: 'Document Type',
            selector: row => row.docu_type,
            cell: (row, index) => (
                <select
                    type="text"
                    value={row.docu_type}
                    onChange={e => handleInputChange(index, 'docu_type', e.target.value)}
                    className="form-select me-3 select_color"
                    disabled={addMode}
                >
                    <option value='POI'>POI</option>
                    <option value='POA'>POA</option>
                    <option value='FD'>Financial Details</option></select>
            ),
            width: '170px',
        },
        {
            name: 'Document Name',
            selector: row => row.docu_name,
            cell: (row, index) => (
                <select
                    type="text"
                    value={row.docu_name}
                    onChange={e => handleInputChange(index, 'docu_name', e.target.value.toUpperCase())}
                    className="form-select  me-3 select_color"
                    disabled={addMode}
                >
                    <option value=''>Select Document</option>
                    {docs.map(doc => (
                        <option key={doc.comm_id} value={doc.comm_id}>{doc.description}</option>
                    ))}
                </select>
            ),
            width: '250px',
        },
        {
            name: 'Catg',
            selector: row => row.catg,
            cell: (row, index) => (
                //<div className='d-flex '>
                <select
                    type="text"
                    value={row.catg}
                    onChange={e => handleInputChange(index, 'catg', e.target.value)}
                    className="form-select me-3 select_color" disabled={addMode}>
                    <option value=''>Select Category</option>
                    {catgs.map(catg => (
                        <option key={catg.comm_id} value={catg.comm_id}>{catg.description}</option>
                    ))}</select>
            ),
            width: '270px',
        },
        {
            name: 'Sub Catg',
            selector: row => row.sub_catg,
            cell: (row, index) => (
                //<div className='d-flex '>
                <select
                    type="text"
                    value={row.sub_catg}
                    onChange={e => handleInputChange(index, 'sub_catg', e.target.value)}
                    className="form-select me-3 select_color" disabled={addMode}>
                    <option value=''>Select Sub-Category</option>
                    {subCatgs.map(subcatg => (
                        <option key={subcatg.comm_id} value={subcatg.comm_id}>{subcatg.description}</option>
                    ))}</select>
                // </div>
            ),
            width: '270px',
        },
        {
            name: 'Id No.',
            selector: row => row.id_no,
            cell: (row, index) => (
                <select
                    type="text"
                    value={row.id_no}
                    onChange={e => handleInputChange(index, 'id_no', e.target.value)}
                    className="form-select me-3 select_color"
                    disabled={addMode}
                >
                    <option value='Y'>Yes</option>
                    <option value='N'>No</option>
                    <option value='O'>Optional</option>
                </select>
            ),
            width: '170px',
        },

        {
            name: 'Place of Issue',
            selector: row => row.place_of_issue,
            cell: (row, index) => (
                <select
                    type="text"
                    value={row.place_of_issue}
                    onChange={e => handleInputChange(index, 'place_of_issue', e.target.value)}
                    className="form-select me-3 select_color"
                    disabled={addMode}
                >
                    <option value='Y'>Yes</option>
                    <option value='N'>No</option>
                    <option value='O'>Optional</option>
                </select>
            ),
            width: '170px',
        },

        {
            name: 'Issue Date',
            selector: row => row.issue_date,
            cell: (row, index) => (
                <select type="text"
                    value={row.issue_date}
                    onChange={e => handleInputChange(index, 'issue_date', e.target.value)}
                    className="form-select me-3 select_color" disabled={addMode}>
                    <option value='Y'>Yes</option>
                    <option value='N'>No</option>
                    <option value='O'>Optional</option>
                </select>
            ),
            width: '170px',
        },

        {
            name: 'Expiry Date',
            selector: row => row.expiry_date,
            cell: (row, index) => (
                <select type="text"
                    value={row.expiry_date}
                    onChange={e => handleInputChange(index, 'expiry_date', e.target.value)}
                    className="form-select me-3 select_color" disabled={addMode}>
                    <option value='Y'>Yes</option>
                    <option value='N'>No</option>
                    <option value='O'>Optional</option>
                </select>
            ),
            width: '170px',
        },
        {
            name: 'NSE',
            selector: row => row.nse,
            cell: (row, index) => (
                //<div className='d-flex '>
                <input
                    type="text"
                    value={row.nse}
                    onChange={e => handleInputChange(index, 'nse', e.target.value)}
                    className="form-control me-3 select_color" disabled={addMode} />
                // </div>
            ),
            width: '170px',
        },
        {
            name: 'KYC',
            selector: row => row.kyc,
            cell: (row, index) => (
                //<div className='d-flex '>
                <input
                    type="text"
                    value={row.kyc}
                    onChange={e => handleInputChange(index, 'kyc', e.target.value)}
                    className="form-control me-3 select_color" disabled={addMode} />
                // </div>
            ),
            width: '170px',
        },
        {
            name: 'CKYC',
            selector: row => row.ckyc,
            cell: (row, index) => (
                //<div className='d-flex '>
                <input
                    type="text"
                    value={row.ckyc}
                    onChange={e => handleInputChange(index, 'ckyc', e.target.value)}
                    className="form-control me-3 select_color" disabled={addMode} />
                // </div>
            ),
            width: '170px',
        },
        {
            name: 'NSDL',
            selector: row => row.nsdl,
            cell: (row, index) => (
                //<div className='d-flex '>
                <input
                    type="text"
                    value={row.nsdl}
                    onChange={e => handleInputChange(index, 'nsdl', e.target.value)}
                    className="form-control me-3 select_color" disabled={addMode} />
                // </div>
            ),
            width: '170px',
        },
        {
            name: 'FATCA',
            selector: row => row.fatca,
            cell: (row, index) => (
                <div className='d-flex '>
                    <input
                        type="text"
                        value={row.fatca}
                        onChange={e => handleInputChange(index, 'fatca', e.target.value)}
                        className="form-control me-3 select_color" disabled={addMode} />
                </div>
            ),
            width: '170px',
        },
        {
            name: 'Mandatory/Optional',
            selector: row => row.mand_optn,
            cell: (row, index) => (
                <><select type="text"
                    value={row.mand_optn}
                    onChange={e => handleInputChange(index, 'mand_optn', e.target.value)}
                    className="form-select me-3 select_color" disabled={addMode}>
                    <option value='M'>Mandatory</option>
                    <option value='O'>Optional</option>
                </select>
                 <OverlayTrigger
                 placement="top"
                 overlay={<Tooltip id={`tooltip-delete-${index}`}>Delete</Tooltip>}>
                 <img
                     src={deleteIcon}
                     alt="Delete"
                     onClick={() => handleDeleteRow(index)}
                     className='select_color'
                     style={{ width: '20px', height: '20px', marginTop: '7px' }} />
             </OverlayTrigger></>
            ),
            width: '170px',
        },
        {
            selector: row => row.doc_code,
            cell: (row, index) => (
                <input value={row.doc_code} readOnly hidden />
            ),
            width: '0px',
        },
    ];

    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: '#ccc',
                backgroundColor: '#99bcef',
                color: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                minHeight: '30px',
                paddingLeft: '1px',
                paddingRight: '1px',
            },
        },
        headCells: {
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: '#ccc',
                paddingLeft: '1px',
                paddingRight: '1px',
            },
        },
        cells: {
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: '#ccc',
                paddingLeft: '1px',
                paddingRight: '1px',
            },
        },
        rows: {
            style: {
                paddingTop: '1px',
                paddingBottom: '1px',
                paddingLeft: '1px',
                paddingRight: '1px',
            },
        },
    };

    return (
        <div className="container tabs-containerDoc mt-2">
            <div>
                <div className='card-header text-center color_header py-2 mb-3'>
                    <h4 className='slabheader'>Document Mapping Master</h4>
                </div>
                <div style={{ margin: '5px 5px 0px 5px' }}>
                    {/* <h5 className='text-center label_color'>Allocation Details</h5> */}
                    {/* <input id="test" value={test}></input> */}
                    <div className='table-container'>
                        <DataTable
                            columns={columns}
                            data={docMappData}
                            responsive
                            highlightOnHover
                            customStyles={customStyles}
                        // noDataComponent={<div>No data available</div>}
                        />
                    </div>
                    <div className='d-flex justify-content-end me-2'>
                        <button className="btn btn-warning input_margin" disabled={addMode} onClick={handleAddRow}>Add Row</button>
                        <button className=" input_margin btn btn-primary" onClick={handleAddClick}>Add</button>
                        <button className="add_btn input_margin" disabled={addMode} onClick={handleClearClick}>Clear</button>
                        <button className="add_btn input_margin" onClick={handleEditClick}>Edit</button>
                        {showEditPopup && <EditPopup onClose={handleCloseEditPopup} onRowSelect={handleVoucharRowSelect} />}
                        <button className="add_btn input_margin" disabled={addMode} onClick={handleFinalSave}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Doc_Mapp_Master;
