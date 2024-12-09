import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './client_slab_attach.css';
import './client_link_slab.css'; // Custom CSS;
import { format, parseISO } from 'date-fns';
import { BASE_URL } from ".././constants";
// import { Fade } from 'react-bootstrap';


function Client_Slab_Attach({ onRowSelect, cliCd, cliName, seg, act, exc, branch_cd }) {

    const [header, setHeader] = useState({});
    const [noDataMessage, setNoDataMessage] = useState('');
    const [selectedRangetableRow, setSelectedRangeTableRow] = useState(null);
    const [branchCode, setBranchCode] = useState(branch_cd);
    const [slabId, setSlabId] = useState('');
    const [dateApp, setDateApp] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [brokSlabs, setBrokSlabs] = useState([]);
    const [cliSlabAttachTableData, setCliSlabAttachTableData] = useState([]);
    const [addMode, setAddMode] = useState(true);

    useEffect(() => {
        setBranchCode(branch_cd);
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_brok_slabs`)
            .then(response => { setBrokSlabs(response.data) })
            .catch(error => console.error('Error fetching Brok Slabs:', error));
    }, []);

    const fetchData = async (cliCd) => {
        axios.get(`${BASE_URL}/api/get_client_slab_attach/${cliCd}`).then(
            res => {
                if (res.data.length > 0) {
                    setCliSlabAttachTableData(res.data)
                } else if (res.data.length === 0) {
                    setCliSlabAttachTableData([]);
                }
            }
        );
    }

    useEffect(() => {
        fetchData(cliCd);
    }, []);

    const handleAddClick = () => {
        setAddMode(false);
    }

    const handleRowClick = (row) => {
        setAddMode(false);
        setSelectedRangeTableRow(row);
        if (row.date_to) {
            alert('This Brok Slab is inactive!');
            setSlabId('');
            setDateApp('');
            return;
        }
        setSlabId(row.mslab_code);
        setDateApp(row.date_applicable);
        // setDateTo(row.date_to);
    };

    const clearFunc = () => {
        setSlabId('');
        setDateApp('');
        setAddMode(true);
    }

    const handleSave = () => {

        if (!slabId) {
            alert('Please select Slab.');
            return;
        }

        if (!dateApp) {
            alert('Please enter Date Apllicable.');
            return;
        }

        const Masterdata = {
            branchCode,
            cliCd,
            act,
            exc,
            seg,
            slabId,
            dateApp,
            dateTo
        };
        setHeader(Masterdata);
        console.log('Masterdata', Masterdata);
        const data = {
            header: Masterdata,
        };

        // alert(JSON.stringify(Masterdata));
        const isconfirmed = window.confirm('Are you sure you want to save this data?');
        if (!isconfirmed) {
            return;
        }
        axios.post(`${BASE_URL}/api/save_cli_slab_attach`, data)
            .then(response => {
                alert('Client Slab Attachment Saved Successfully!');
                // Reset form state after successful save
                fetchData(cliCd);
                clearFunc();
            })
            .catch(error => console.error('Error saving Client Slab Attachment:', error));
    }

    return (
        <div className="popup_ring">
            <div className="popup-inner_ring">
                <div className='div_header_ring'><h4>Client Slab Attachment</h4></div>
                <div className="row mb-1 ms-2 mt-3">
                    <div className="col-md-12 mb-2 d-flex justify-content-start">
                        <div className='d-flex align-items-center'>
                            <label className='width_slab_2 ' htmlFor='slabId'>Client Code:</label>
                            <input
                                type="text"
                                readOnly
                                placeholder="Client Cd"
                                className='form-control  me-2 width_slab_input'
                                value={cliCd}
                                id='slabId'
                            />
                            <input
                                type="text"
                                placeholder="Client Name"
                                className='form-control px-1 width_slab_input_large'
                                value={cliName}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
                <div className='row mb-4 ms-2'>
                    <div className="col-md-2 mb-2 d-flex align-items-center">
                        <label className='form-label me-2'>Segment:</label>
                        <input
                            className="form-control"
                            readOnly
                            value={seg}
                        />
                    </div>
                    <div className="col-md-2 mb-2 d-flex align-items-center">
                        <label className='form-label me-2'>Activity:</label>
                        <input
                            className="form-control"
                            readOnly
                            value={act}
                        />
                    </div>
                    <div className="col-md-2 mb-2 d-flex align-items-center">
                        <label className='form-label me-2'>Exchange:</label>
                        <input
                            className="form-control"
                            readOnly
                            value={exc}
                        />
                    </div>
                    <div className="col-md-6 mb-2">
                        <button className="btn btn-primary me-2" onClick={handleAddClick} >
                            Add
                        </button>
                        <button
                            className="btn btn-success me-2"
                            onClick={handleSave}
                            disabled={addMode}
                        >Save
                        </button>
                        <button
                            className="btn btn-success me-2"
                            onClick={clearFunc}
                            disabled={addMode}
                        >Clear
                        </button>
                        <button
                            className="btn btn-danger "
                            onClick={() => onRowSelect(null)}
                        >Close
                        </button>
                    </div>
                </div>
                <div className='inputflex mb-4  mt-3  ps-3' style={{ width: '100%' }}>
                    <div className="row " >
                        <div className="inputOnText ">
                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Slab Info</label>
                            <div className="form-control size_address4  me-3">
                                <div className="row mb-2 mt-1">
                                    <div className='col-6 ms-2 col-md-8 d-flex'>
                                        <label className='form-label my-2 me-2'>Brokerage:</label>
                                        <select
                                            className='form-select'
                                            value={slabId}
                                            onChange={(e) => setSlabId(e.target.value)}
                                            disabled={addMode}
                                        >
                                            <option value=''>Brok Slabs</option>
                                            {brokSlabs.map(res => (
                                                <option key={res.slab_id} value={res.slab_id}>{res.slab_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='row ms-0 mt-2 '>
                                        <div className="col-6 px-2 col-md-5 d-flex ">
                                            <label className='form-label my-2 text-end me-2'>Date App:</label>
                                            <input
                                                type="date"
                                                value={dateApp}
                                                onChange={(e) => setDateApp(e.target.value)}
                                                className='form-control mt-2 width_slab_input_1'
                                                disabled={addMode}
                                            />
                                        </div>
                                        <div className='col-6 col-md-5 d-flex'>
                                            <label className='form-label my-2 text-end me-2' style={{ width: '100%' }}>Date To:</label>
                                            <input
                                                type="date"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                                className='form-control mt-2 width_slab_input_1'
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-1 ms-3 mb-4 d-flex" style={{ width: '89%' }}>
                    <div className="normal-table-container">
                        <table className="normal-table" style={{ overflow: 'auto' }}>
                            <thead className='theadNormal'>
                                <tr className='tr_normal'>
                                    <th className='th_normal p-inline' hidden >Slab Id</th>
                                    <th className='th_normal p-inline' >Brokerage Slab</th>
                                    <th className='th_normal p-inline'  >App From</th>
                                    <th className='th_normal p-inline'  >App To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cliSlabAttachTableData.map((row, index) => (
                                    <tr key={index} className={
                                        `tr_normal ${selectedRangetableRow === row
                                            ? 'selectedRangetablerowcolor' : ''}`}
                                        onClick={() => handleRowClick(row)}
                                    >
                                        <td className='td_normal p-inline' hidden >{row.mslab_code}</td>
                                        <td className='td_normal p-inline'  >{row.slab_name}</td>
                                        <td className='td_normal p-inline'  >{
                                            row.date_applicable ? row.date_applicable =
                                                format(parseISO(row.date_applicable), 'yyyy-MM-dd') : ''}</td>
                                        <td className='td_normal p-inline'  >{
                                            row.date_to ? row.date_to =
                                                format(parseISO(row.date_to), 'yyyy-MM-dd') : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {noDataMessage && <p>{noDataMessage}</p>}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Client_Slab_Attach;
