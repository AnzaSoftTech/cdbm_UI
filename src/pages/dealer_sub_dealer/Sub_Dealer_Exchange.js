import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import deleteIcon from './image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import './Dealer_Sub_Dealer.css'; 
import './PopupCss.css'; 
import { format, parseISO } from 'date-fns';
import Sub_Deal_Sharing from './Sub_Deal_Sharing';
import { BASE_URL } from "../constants";

export default function Address_Contacts({ onCloseClick, p_Dealer_Code, p_Dealer_Name, s_Dealer_Code, s_Dealer_Name }) {
    const [userId, setUserId] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null);
// const [contactPersData, setContactPersData] = useState([{ cont_pers_id:'',  contact_person: '', designation: '', department: '', cont_pers_mobile: '', 
    //                                                         cont_pers_phone: '', extn: '', cont_pers_email1: '', cont_pers_email2: '' }]);

    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [header, setHeader] = useState({});

    const [dealername, setDealerName] = useState();
    const [dealerCode, setDealerCode] = useState(p_Dealer_Code);
    const [subdealerCode, setSubDealerCode] = useState(s_Dealer_Code);
    const [activityCode, setActivityCode] = useState();
    const [exchange, setExchange] = useState();
    const [exchanges, setExchanges] = useState([]);
    const [excName, setExcName] = useState();
    const [excCode, setExcCode] = useState();
    const [segment, setSegment] = useState();
    const [segments, setSegments] = useState([]);
    const [segName, setSegName] = useState();
    const [segCode, setSegCode] = useState();
    const [dealerorderlimit, setDealerOrderLimit] = useState('');
    const [dealergrosslimit, setDealerGrossLimit] = useState('');
    const [dealernetlimit, setDealerNetLimit] = useState('');
    const [dateappl, setDateAppl] = useState('');
    const [excstatus, setExcStatus] = useState('');
    const [statuschangedate, setStatusChangeDate] = useState('');
    const [addressResults, setAddressResults] = useState([]);
    const [subdealerExchange, setSubDealerExchange] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [activityCodes, setActivityCodes] = useState([]);
    const [actvitiName, setActvityName] = useState();
    const [subdealername, setSubDealerName] = useState();
    const [showSubDealShrPopup, setShowSubDealShrPopup] = useState(false);
    const [shrMode, setShrMode] = useState(true);



    const excRef = useRef();
    const segRef = useRef();
    const actRef = useRef(); 


    useEffect(() => {
        handleGetAddresses();
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_MI_master`)
            .then(response => {
                setExchanges(response.data);
            })
            .catch(error => console.error('Error fetching exchanges:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_segment_master`)
            .then(response => {
                setSegments(response.data);
            })
            .catch(error => console.error('Error fetching exchanges:', error));
    }, []);

    const handleRowSelect = (data, index) => {
        setSelectedRow(data);
        setSelectedRowIndex(index);
    };

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_desler_activity_master`)
            .then(response => setActivityCodes(response.data))
            .catch(error => console.error('Error fetching Activities:', error));
    }, []);

    useEffect(() => {
        populateSubDealExc();
        
    }, []);

    const populateSubDealExc = () => {

        axios.get(`${BASE_URL}/api/get_sub_dealer_exchange`, { params: { p_Dealer_Code, s_Dealer_Code } })
            .then(response => {
                setSubDealerExchange(response.data)
                console.log(response.data);
            })
    .catch(error => console.error('Error fetching dealer exchange', error));
    }

    const handleCloseSubDealShr = () => {
        setShowSubDealShrPopup(false);
    };

    const handleClearAddress = () => {
        setExchange('');
        setSegment('');
        setDealerOrderLimit('');
        setDealerGrossLimit('');
        setDealerNetLimit('');
        setDateAppl('');
        setExcStatus('');
        setStatusChangeDate('');
        setActivityCode('');

        excRef.current.disabled = false;
        segRef.current.disabled = false;
        actRef.current.disabled = false;
        setShrMode(true);
    }

    const handleShowSubDealerShr = () => {
        setShowSubDealShrPopup(true);
    }

    const handleFinalSave = () => {

        setUserId(1);

        if(segment && exchange && activityCode){
            const headerData = {
                dealerCode,
                subdealerCode,
                activityCode,
                exchange,
                segment,
                userId,
            };

            setHeader(headerData);
            const data = {
                header: headerData,
            };

            const isConfirmed = window.confirm('Sure, you want to save?');
            if (!isConfirmed) {
                return;
            }
        
            axios.post(`${BASE_URL}/api/save_sub_exchange_link`, data)
                .then(response => {
                    if (response.data.message === 'Data already exists') {
                        alert('Sub-Dealer Exchange already exists!!');
                    }
                    else {
                        alert('Sub-Dealer Exchange Link saved successfully!');
                        populateSubDealExc();
                        setExchange('');
                        setSegment('');
                        setActivityCode('');
                    }
                });           
        }
        else{
            alert('All Fields are manadatory!');
        }
    };

    const handleSendData = async (selectedRow) => {
        setExchange(selectedRow.mii_id);
        setSegment(selectedRow.seg_code);
        setActivityCode(selectedRow.activity_cd);
        setActvityName(selectedRow.act_name);
        setSegName(selectedRow.seg_name);
        setExcName(selectedRow.exc_name);

        excRef.current.disabled = true;
        segRef.current.disabled = true;
        actRef.current.disabled = true;
        setShrMode(false);
    }

    const handleCloseSubDealerExc = () => {
        setShowSubDealShrPopup(false);
    };

    const handleGetAddresses = async () => {

        try {
            const response = await axios.get(`${BASE_URL}/api/get_addresses`, {
                params: {
                    //p_addr_type: addrtype || 'BANK'
                }
            });
            //setAddressResults(response.data);
            // console.log('response.data ==> ', response.data);
            // console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };


    return (
        <div className="popup_addr_cont" style={{width: '1020px'}}>
            <div className="popup-inner">
                <div className='div_header_warn'>
                    <h5 className='search_header '>Sub-Dealer Exchange Link</h5>
                </div>

                <div className="card-body">

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex" style={{height: '38px', width: '50%'}}>
                            <label htmlFor="dealername" className="form-label label-width">Dealer Name</label>
                            <input id="dealername" type="text" className="form-control size_input_cashbank"
                                disabled value={p_Dealer_Name} onChange={(e) => setDealerName(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-2 d-flex" style={{height: '38px', width: '50%'}}>
                            <label htmlFor="subdealername" className="form-label label-width">Sub-Dealer</label>
                            <input id="dealername" type="text" className="form-control size_input_cashbank"
                                disabled value={s_Dealer_Name} onChange={(e) => setSubDealerName(e.target.value)} />
                        </div>
                    </div>

                    {/*  ****************************************************************************
                                   Exchanges and Segments
                     **************************************************************************** */}
                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex" style={{ height: '38px', width: '50%' }}>
                            <label htmlFor="exchange" className="form-label label-width">Exchange</label>
                            <select id="exchange" className="form-control size_input_cashbank" name='exchange' ref={excRef} value={exchange} 
                                style={{ width: '350px' }} onChange={(e) => setExchange(e.target.value)}>
                                <option value="">Select Exchange</option>
                                {exchanges.map(Exc => (
                                    <option key={Exc.exc_cd} value={Exc.exc_cd}>{Exc.exc_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-2 d-flex" style={{ height: '38px', width: '50%' }}>
                            <label htmlFor="segment" className="form-label label-width">Segment</label>
                            <select id="segment" className="form-control size_input_cashbank" ref={segRef} value={segment}
                                style={{ marginLeft: '0px', width: '350px' }} name='segment' onChange={(e) => setSegment(e.target.value)}>
                                <option value="">Select Segment</option>
                                {segments.map(Seg_Code => (
                                    <option key={Seg_Code.seg_code} value={Seg_Code.seg_code}>{Seg_Code.seg_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex" style={{ height: '38px', width: '50%' }}>
                            <label htmlFor="activitycode" className="form-label label-width">Activity</label>
                            <select id="activitycode" className="form-control size_input_cashbank" style={{ width: '350px' }}
                                name='activitycode' value={activityCode} onChange={(e) => setActivityCode(e.target.value)} ref={actRef}>
                                <option value="">Select Activity</option>
                                {activityCodes.map(actcd => (
                                    <option key={actcd.activity_cd} value={actcd.activity_cd}>{actcd.act_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">

                        <div className="d-flex">

                            <button className="btn btn-warning me-2" style={{ width: '100px' }} onClick={handleShowSubDealerShr}
                            disabled={shrMode}>Sharing</button>
                            {showSubDealShrPopup && <Sub_Deal_Sharing onCloseClick={handleCloseSubDealShr} p_Dealer_Code={p_Dealer_Code}
                                p_Dealer_Name={p_Dealer_Name} s_Dealer_Code={s_Dealer_Code} s_Dealer_Name={s_Dealer_Name} act_Code={activityCode}
                                act_Name={actvitiName} seg_Code={segment} seg_Name={segName} exc_Code={exchange} exc_Name={excName}
                            />}
                            <button className="btn btn-primary me-2" style={{width:'100px'}} onClick={handleClearAddress}>New</button>
                            <button className="btn btn-success me-2" style={{ width: '150px' }} onClick={handleFinalSave}>Save</button>
                            <button className="btn btn-danger me-2" onClick={() => onCloseClick(null)} style={{ width: '100px' }}>Close</button>
                        </div>

                    </div>
                </div>

                {/* ****************************************************************************************************
                **************************************   Start  Address Table   *********************************
                **************************************************************************************************** */}

                <div className='div_sub_header_warn'>
                    <h6 className='search_header '>Dealer Exchange</h6>
                </div>

                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Exchange</th>
                                <th>Segment</th>
                                <th>Activity</th>
                                <th hidden>Exchange Code</th>
                                <th hidden>Segment Code</th>
                                <th hidden>Activity Code</th>

                                {/* <th >Gross Limit</th>
                                <th >Net Limit</th>
                                <th >Date Appl</th>
                                <th >Status</th>
                                <th >Status Change</th> */}
                                {/* <th hidden>addr_id</th>
                                <th hidden>parent_id</th> */}
                            </tr>

                        </thead>
                        <tbody>
                            {subdealerExchange.map((result, index) => (
                                <tr key={index} style={{ cursor: 'pointer' }} onClick={() => handleSendData(result)}>
                                    <td>{result.exc_name}</td>
                                    <td>{result.seg_name}</td>
                                    <td>{result.act_name}</td>
                                    <td hidden>{result.mii_id}</td>
                                    <td hidden>{result.seg_code}</td>
                                    <td hidden>{result.activity_cd}</td>
                                    {/* <td>{result.gross_limit}</td>
                                    <td>{result.net_limit}</td>
                                    <td>{result.date_appl}</td>
                                    <td>{result.status}</td>
                                    <td>{result.statuschangedt}</td> */}
                                    {/* <td hidden>{result.addr_id}</td>
                                    <td hidden>{result.parent_id}</td> */}
                                    {/* <td hidden>{result.exc_cd}</td>
                                    <td hidden>{result.seg_code}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ****************************************************************************************************
                **************************************   End Address Table   *********************************
                **************************************************************************************************** */}

            </div>

        </div>
    );
}
