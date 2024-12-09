import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import deleteIcon from './image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import './MII_Master.css';
import './PopupCss.css';
import { format, parseISO } from 'date-fns';

//import { response } from 'express';
import { BASE_URL } from ".././constants";

function MII_Deemat_Detl({ onCloseClick, p_MII_code }) {
    const [userId, setUserId] = useState(1);
    // const [contactPersData, setContactPersData] = useState([{ mii_bank_dtl_id:'',  bank_type: '', book_type: '', bank_name: '', bank_act_no: '', 
    // status: '', start_date: '', end_date: '' }]);
    const [header, setHeader] = useState({});
    const [deematDtlId, setDeematDtlId] = useState('');
    const [acctType, setAcctType] = useState('');
    const [depos, setDepos] = useState('NSDL');
    const [depositories, setDepositories] = useState([]);
    const [cmBpId, setCmBpId] = useState('');
    const [dpId, setDpId] = useState('');
    const [clientId, setClientId] = useState('');
    const [status, setStatus] = useState('ACTIVE');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [deematDetlResults, setDeematDtlResults] = useState([]);
    const [hideVisibility, setHideVisibility] = useState(false);
    // const [banktypes, setBankTypes] = useState([]);
    // const [booktypes, setBookTypes] = useState([]);
    // const [bankname, setBankName] = useState('');
    // const [bankacctno, setBankActNo] = useState('');
    // const [selectedRow, setSelectedRow] = useState(null);
    // const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_demat_mii_master`)
            .then(response => {setDepositories(response.data); console.log(response.data)})
            .catch(error => console.error('Error fetching mii source names ddl:', error));
        handleGetDeemat_Details();
        setUserId(1);
    }, []);

    const handleClearDeematDtl = () => {
        setDeematDtlId('');
        setAcctType('');
        setDepos('NSDL');
        setCmBpId('');
        setDpId('');
        setClientId('');
        setStatus('ACTIVE');
        setStartDate('');
        setEndDate('');
    }

    const handleFinalSave = () => {

        if (!acctType) {
            alert('Please Select Account Type.');
            return;
        }

        if (!depos) {
            alert('Please enter Depository.');
            return;
        }

        if (!status) {
            alert('Please Select Status');
            return;
        }

        const headerData = {
            deematDtlId,
            p_MII_code,
            acctType,
            depos,
            cmBpId,
            dpId,
            clientId,
            status,
            startDate,
            endDate,
            userId,
        };
        setHeader(headerData);
        const data = {
            header: headerData
            //details: contactPersData,
        };

        // alert(JSON.stringify(data));

        axios.post(`${BASE_URL}/api/save_MII_Deemat_Details`, data)
            .then(response => {
                alert('MII Deemat Details saved successfully!');
                handleClearDeematDtl();
            });

        //  setBankDtlId(response.statusMessage.lv_bank_dtl_id);

        /// to re-fresh the address section again

        handleGetDeemat_Details();

    };

    const handleSendData = async (selectedRow) => {

        setDeematDtlId(selectedRow.deemat_dtl_id);
        setAcctType(selectedRow.acc_type);
        setDepos(selectedRow.depos);
        setCmBpId(selectedRow.cm_bp_id);
        setDpId(selectedRow.dp_id);
        setClientId(selectedRow.client_id);
        setStatus(selectedRow.status);
        // setStartDate(selectedRow.start_date);
        // setEndDate(selectedRow.end_date);
        if (selectedRow.start_date) {
            const dateString = selectedRow.start_date;
            const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
            setStartDate(formattedDate);
        }
        if (selectedRow.end_date) {
            const dateString = selectedRow.end_date;
            const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
            setEndDate(formattedDate);
        }

    }

    const handleGetDeemat_Details = async () => {

        try {
            const response = await axios.get(`${BASE_URL}/api/get_MII_deemat_details`, {
                params: {
                    p_MII_Id: p_MII_code
                }
            });
            setDeematDtlResults(response.data);
        } catch (error) {
            console.error('Error searching deemat dtls:', error);
        }
    };

    var limit;

    if (depos === 'NSDL') {
        limit = 8;
    }else{
        limit = 16;
    }
    const handleDeposChange = (value) => {
        setDepos(value);
        setClientId('');
        // console.log('value demat depos------',value);
        if(value === 'NSDL'){
            setHideVisibility(false); 
        }
        else{
            setHideVisibility(true);
        }
    }


    return (
        <div className="popup_addr_cont">
            <div className="popup-inner">
                <div className='div_header_warn'>
                    <h4 className='search_header '>MII Demat Details</h4>
                </div>

                <div>
                </div>

                <div className="card-body">

                    {/*  ****************************************************************************
                                            Account Type and Depository
                        **************************************************************************** */}
                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="acctType" className="form-label label-width">Account Type</label>
                            <select id="acctType" className="form-select size_input_cashbank" name='acctType' value={acctType}
                                onChange={(e) => setAcctType(e.target.value)}>
                                <option value="">Select Account Type</option>
                                <option value="Settlement A/C">Settlement A/C</option>
                                <option value="CUSA">CUSA </option>
                                <option value="Margin Pledge">Margin Pledge </option>
                                <option value="Own">Own</option>
                                <option value="Settlement">Settlement</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="depos" className="form-label label-width">Depository</label>
                            <select id="depos" className="form-select size_input_cashbank" name='depos' 
                             value={depos} onChange={(e) => handleDeposChange(e.target.value)}>
                                {depositories.map(depository => (
                                    <option key={depository.mii_src_code} value={depository.mii_src_code}>{depository.mii_source_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/*  ****************************************************************************
                                            CM BP Id and DP Id
                        **************************************************************************** */}

                    <div className="row" hidden={hideVisibility}>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="cmBpId" className="form-label label-width">CM BP Id</label>
                            <input id="cmBpId" type='text' maxLength='8' className="form-control size_input_cashbank"
                                value={cmBpId} onChange={(e) => setCmBpId(e.target.value.slice("0,8"))} />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="dpId" className="form-label label-width">DP Id</label>
                            <input id="dpId" type='text' maxLength='8' className="form-control size_input_cashbank"
                                value={dpId} onChange={(e) => setDpId(e.target.value.slice("0,8"))} />
                        </div>
                    </div>

                    {/*  ****************************************************************************
                                            Client Id and Status
                        **************************************************************************** */}

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="clientId" className="form-label label-width">Client Id</label>
                            <input id="clientId" type='text' maxLength={limit} className="form-control size_input_cashbank"
                                value={clientId} onChange={(e) => setClientId(e.target.value.slice(`0,${limit}`))} />
                        </div>

                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="status" className="form-label label-width">Status</label>

                            <select id="status" className="form-select size_input_cashbank" name='status' value={status}
                                onChange={(e) => setStatus(e.target.value)}>
                                <option value="ACTIVE">Active</option>
                                <option value="CLOSED">Closed</option>
                                <option value="SUSPENDED">Suspended</option>
                            </select>
                        </div>
                    </div>

                    {/*  ****************************************************************************
                                            Start Date and End Date
                        **************************************************************************** */}

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="startDate" className="form-label label-width">Start Date</label>
                            <input id="startDate" type="date" className="form-control size_input_cashbank"
                                value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="endDate" className="form-label label-width">End Date</label>
                            <input id="endDate" type="date" className="form-control size_input_cashbank"
                                value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">

                        <div className="col-md-6 mb-2 d-flex">
                            <button className='close_btn input_margin' style={{ width: '100px' }} onClick={() => onCloseClick(null)}>Close</button>
                            <button className='btn_new input_margin' style={{ width: '100px' }} onClick={handleClearDeematDtl}>New</button>
                            <button className="save_btn input_margin" style={{ width: '150px' }} onClick={handleFinalSave}>Save</button>
                        </div>
                    </div>
                </div>

                {/* ****************************************************************************************************
                **************************************   Start  Table   *********************************
                **************************************************************************************************** */}

                <div className='div_sub_header_warn'>
                    <h6 className='search_header '>Deemat Details</h6>
                </div>

                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Acct Type</th>
                                <th>Depos</th>
                                <th>CM BP Id</th>
                                <th>Dp Id</th>
                                <th>Client Id</th>
                                <th>Status</th>
                                <th >Start Date</th>
                                <th >End Data</th>
                            </tr>

                        </thead>
                        <tbody>
                            {deematDetlResults.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.acc_type}</td>
                                    <td>{result.depos}</td>
                                    <td>{result.cm_bp_id}</td>
                                    <td>{result.dp_id}</td>
                                    <td>{result.client_id}</td>
                                    <td>{result.status}</td>
                                    <td>{result.start_date}</td>
                                    <td>{result.end_date}</td>
                                    <td hidden>{result.deemat_dtl_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ****************************************************************************************************
                **************************************   End Table   *********************************
                **************************************************************************************************** */}
            </div>

        </div>
    );
}

export default MII_Deemat_Detl;
