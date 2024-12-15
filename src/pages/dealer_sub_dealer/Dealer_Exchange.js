import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import deleteIcon from './image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import './Dealer_Sub_Dealer.css'; 
import './PopupCss.css'; 
import { format, parseISO } from 'date-fns';
import { BASE_URL } from "../constants";


function Address_Contacts({ onCloseClick, p_Dealer_Name, p_Dealer_Code, p_Activity_code }) {
    const [userId, setUserId] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null);
    // const [contactPersData, setContactPersData] = useState([{ cont_pers_id:'',  contact_person: '', designation: '', department: '', cont_pers_mobile: '', 
    //                                                         cont_pers_phone: '', extn: '', cont_pers_email1: '', cont_pers_email2: '' }]);

    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [header, setHeader] = useState({});
    
    const [dealername, setDealerName] = useState(p_Dealer_Name);
    const [dealerCode, setDealerCode] = useState(p_Dealer_Code);
    const [activityCode, setActivityCode] = useState(p_Activity_code);
    const [exchange, setExchange] = useState();
    const [exchanges, setExchanges] = useState([]);
    const [excCode, setExcCode] = useState();
    const [segment, setSegment] = useState();
    const [segments, setSegments] = useState([]);
    const [segCode, setSegCode] = useState();
    const [dealerorderlimit, setDealerOrderLimit] = useState('');
    const [dealergrosslimit, setDealerGrossLimit] = useState('');
    const [dealernetlimit, setDealerNetLimit] = useState('');
    const [dateappl, setDateAppl] = useState('');
    const [excstatus, setExcStatus] = useState('');
    const [statuschangedate, setStatusChangeDate] = useState('');
    const [addressResults, setAddressResults] = useState([]);
    const [dealerExchange, setDealerExchange] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const excRef = useRef();
    const segRef = useRef();


    useEffect(() => {
        handleGetAddresses();
    }, []);

    const handleRowSelect = (data, index) => {
        setSelectedRow(data);
        setSelectedRowIndex(index);
    };

    // const handleInputChange = (index, field, value) => {
    //     const updatedData = [...contactPersData];
    //     updatedData[index] = { ...updatedData[index], [field]: value };
    // };
///api/ddl_MI_master

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

    useEffect(() => {
        getDealerExc();
    }, []);

    const getDealerExc = () => {
        axios.get(`${BASE_URL}/api/get_dealer_exchange`, { params: { p_Dealer_Code } })

            // console.log(response.data); , { params: { p_Dealer_Code } })
            .then(response => { setDealerExchange(response.data) })
            .catch(error => console.error('Error fetching dealer exchange', error));
    }

    const handleClearAddress = () => {
        // setDealerName(''); 
        setExchange('');
        setSegment(''); 
        setDealerOrderLimit('');
        setDealerGrossLimit('');
        setDealerNetLimit('');
        setDateAppl('');
        setExcStatus('');
        setStatusChangeDate('');
        setEditMode(false);

        excRef.current.disabled = false;
        segRef.current.disabled = false;


    }

    const handleFinalSave = () => {

        setUserId(1);

        // if (!addrLine1) 
        // {
        //     alert('Please enter Address Line 1.');
        //     return;
        // }

        const headerData = {
            dealerCode,
            activityCode,
            exchange,
            segment,
            dealerorderlimit,
            dealergrosslimit,
            dealernetlimit,
            dateappl,
            excstatus,
            statuschangedate,
            editMode,
            userId,
        };
        setHeader(headerData);
        const data = {
            header: headerData,
           // details: contactPersData,
        };

        // alert(JSON.stringify(data));

        axios.post(`${BASE_URL}/api/save_exchange_link`, data)
            .then(response => {
                alert('Dealer Exchange Link saved successfully!');
                getDealerExc();
            });

        setExchange('');
        setSegment('');
        setDealerOrderLimit('');
        setDealerGrossLimit('');
        setDealerNetLimit('');
        setDateAppl('');
        setExcStatus('');
        setStatusChangeDate('');
        setEditMode(false);
        

        /// to re-fresh the address section again


        handleGetAddresses();

    };

    const handleSendData = async (selectedRow) => {

        setDealerName(dealername);
        setExchange(selectedRow.exc_cd);
        setSegment(selectedRow.seg_code);
        setDealerOrderLimit(selectedRow.order_limit);
        setDealerGrossLimit(selectedRow.gross_limit);
        setDealerNetLimit(selectedRow.net_limit);
        setExcStatus(selectedRow.status);
        // setStatusChangeDate(selectedRow.statuschangedt);

        if (selectedRow.date_appl) {
            const formattedDate = format(parseISO(selectedRow.date_appl), 'yyyy-MM-dd');
            setDateAppl(formattedDate);
        }

        if (selectedRow.st_change_dt) {
            const formattedDate = format(parseISO(selectedRow.st_change_dt), 'yyyy-MM-dd');
            setStatusChangeDate(formattedDate);
        }

        excRef.current.disabled = true;
        segRef.current.disabled = true;

        setEditMode(true);



        ////  **********************************
        ////  populating contact person details
        ////  **********************************

        // try {
        //     const response = await axios.get(`${BASE_URL}/api/get_cont_persons', {
        //         params: {
        //             p_addr_id: selectedRow.addr_id || ''
        //         }
        //     });
        //    // console.log('contact person response --->>>> ', response);
        //     if (response) {
        //         const contpersonList = response.data.map(cont_pers => {
        //             return {
        //                 cont_pers_id: cont_pers.cont_pers_id || '',
        //                // list_addr_id: cont_pers.addr_id || '',
        //                 contact_person: cont_pers.cont_pers_name || '',
        //                 designation: cont_pers.designation || '',
        //                 department: cont_pers.dept || '',
        //                 cont_pers_email1: cont_pers.email_id1 || '',
        //                 cont_pers_email2: cont_pers.email_id2 || '',
        //                 cont_pers_mobile: cont_pers.mobile || '',
        //                 cont_pers_phone: cont_pers.phone || '',
        //                 extn: cont_pers.extn || '',
        //                 //list_status: cont_pers.status || ''   
        //              };
        //         });
        //         console.log('contact person contpersonList --->>>> ', contpersonList);
        //        // setContactPersData(contpersonList);
        //     }
        //     //setAddressResults(response.data);
        //    // console.log('response.data ==> ', response.data);
        //    // console.log('hiii---',response.data)
        // } catch (error) {
        //     console.error('Error searching address:', error);
        // }
    }

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
        <div className="popup_addr_cont">
            <div className="popup-inner">
              <div className='div_header_warn'>
                    <h5 className='search_header '>Dealer Exchange Link</h5>
                </div>

                <div className="card-body">

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="dealername" className="form-label label-width">Dealer Name</label>
                            <input id="dealername" type="text" className="form-control size_input_cashbank"
                              disabled value={dealername} onChange={(e) => setDealerName(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="exchange" className="form-label label-width">Exchange</label>
                            <select id="exchange" className="form-select size_input_cashbank" name='exchange' ref={excRef} value={exchange} 
                                style={{ width: '350px' }} onChange={(e) => setExchange(e.target.value)}>
                                <option value=" ">Select Exchange</option>
                                {exchanges.map(Exc => (
                                    <option key={Exc.exc_cd} value={Exc.exc_cd}>{Exc.exc_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/*  ****************************************************************************
                                   Exchanges and Segments
                     **************************************************************************** */}
                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="segment" className="form-label label-width">Segment</label>
                            <select id="segment" className="form-select size_input_cashbank" ref={segRef} value={segment}
                                style={{width: '350px'}} name='segment' onChange={(e) => setSegment(e.target.value)}>
                                <option value="">Select Segment</option>
                                {segments.map(Seg_Code => (
                                    <option key={Seg_Code.seg_code} value={Seg_Code.seg_code}>{Seg_Code.seg_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                     {/*  ****************************************************************************
                                   Order Limit, Gross Limit, Net Limit
                      **************************************************************************** */}
                      <div>
                        &nbsp;
                      </div>
                    <div >
                        <div className="col-md-4 mt-3">
                            <div className="inputOnText">
                                <label className="labelAddress" style={{ top: '-18px' }} htmlFor="Textinput">Limits :</label>
                                <div className="form-control size_dealer_exc_limit">
                                    <div className="row">
                                        <div className="col-md-3 mb-3 d-flex" style={{width: '300px', marginLeft: '12px'}}>
                                            <label htmlFor="dealerorderlimit" className="form-label" 
                                                style={{ width: '110px' }}>Order Limit</label>
                                            <input id="dealerorderlimit" type="text" className="form-control" style={{ width: '175px' }}
                                                value={dealerorderlimit} onChange={(e) => setDealerOrderLimit(e.target.value)} />
                                        </div>
                                        <div className="col-md-3 mb-3 d-flex" style={{width: '300px', marginLeft: '4px'}}>
                                            <label htmlFor="dealergrosslimit" className="form-label" 
                                                style={{ width: '110px' }}>Gross Limit</label>
                                            <input id="dealergrosslimit" type="text" className="form-control" style={{ width: '175px' }}
                                                value={dealergrosslimit} onChange={(e) => setDealerGrossLimit(e.target.value)} />
                                        </div>
                                        <div className="col-md-3 mb-3 d-flex" style={{width: '300px'}}>
                                            <label htmlFor="dealernetlimit" className="form-label" 
                                                style={{ width: '110px' }}>Net Limit</label>
                                            <input id="dealernetlimit" type="text" className="form-control" style={{ width: '175px' }}
                                                value={dealernetlimit} onChange={(e) => setDealerNetLimit(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-3 mb-3 d-flex" style={{width: '300px'}}>
                                            <label htmlFor="dateappl" className="form-label" style={{ width: '110px' }}>Date Appl</label>
                                            <input id="dateappl" type="date" className="form-control" style={{ width: '175px' }}
                                                value={dateappl} onChange={(e) => setDateAppl(e.target.value)} />
                                        </div>
                                        <div className="col-md-3 mb-3 d-flex" style={{width: '300px'}}>
                                            <label htmlFor="excstatus" className="form-label" style={{ width: '110px' }}>Status</label>
                                            <select id="excstatus" className="form-select" name='excstatus' value={excstatus} style={{ width: '175px' }}
                                                onChange={(e) => setExcStatus(e.target.value)}>
                                                <option value="">Select Status</option>
                                                <option value="A">Active</option>
                                                <option value="C">Closed</option>
                                                <option value="S">Suspended</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3 d-flex" style={{width: '320px'}}>
                                            <label htmlFor="statuschangedate" className="form-label" 
                                                style={{ width: '110px' }}>Status Change</label>
                                            <input id="statuschangedate" type="text" className="form-control" style={{ width: '175px' }}
                                               disabled value={statuschangedate} onChange={(e) => setStatusChangeDate(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">

                        <div className="d-flex">
                            
                            <button className="btn btn-primary me-2" style={{width:'100px'}} onClick={handleClearAddress}>New</button>
                            <button className="btn btn-success me-2" style={{width:'150px'}} onClick={handleFinalSave}>Save</button>
                            <button className="btn btn-danger me-2" style={{width:'100px'}} onClick={() => onCloseClick(null)}>Close</button>
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
                                <th>Order Limit</th>
                                <th >Gross Limit</th>
                                <th >Net Limit</th>
                                <th >Date Appl</th>
                                <th >Status</th>
                                <th >Status Change</th>
                                {/* <th hidden>addr_id</th>
                                <th hidden>parent_id</th> */}
                            </tr>

                        </thead>
                        <tbody>
                            {dealerExchange.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.exc_name}</td>
                                    <td>{result.seg_name}</td>
                                    <td>{result.order_limit}</td>
                                    <td>{result.gross_limit}</td>
                                    <td>{result.net_limit}</td>
                                    <td>{result.date_appl}</td>
                                    <td>{result.status}</td>
                                    <td>{result.st_change_dt}</td>
                                    {/* <td hidden>{result.addr_id}</td>
                                    <td hidden>{result.parent_id}</td> */}
                                    <td hidden>{result.exc_cd}</td>
                                    <td hidden>{result.seg_code}</td>
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

export default Address_Contacts;
