import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import deleteIcon from './image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import './Dealer_Sub_Dealer.css'; 
import './PopupCss.css'; 
import Sub_Dealer_Exchange from './Sub_Dealer_Exchange';
import { BASE_URL } from "../constants";

function Address_Contacts({ onCloseClick, p_Dealer_Code, p_Dealer_Name }) {
    const [userId, setUserId] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null);
    // const [contactPersData, setContactPersData] = useState([{ cont_pers_id:'',  contact_person: '', designation: '', department: '', cont_pers_mobile: '', 
    //                                                         cont_pers_phone: '', extn: '', cont_pers_email1: '', cont_pers_email2: '' }]);
    const [subdealerCode, setSubDealerCode] = useState('');
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [header, setHeader] = useState({});
    
    const [dealername, setDealerName] = useState();
    const [subdealername, setSubDealerName] = useState('');
    const [subdealeralias, setSubDealerAlias] = useState('');
    const [sdstatus, setSDStatus] = useState('');
    const [statuschangedate, setStatusChangeDate] = useState('');
    // const [addressResults, setAddressResults] = useState([]);
    const [subDealerRes, setSubDealerRes] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [subdealerexcPopup, setShowSubDealerExcPopup] = useState(false);
    const [excLinkMode, setExcLinkMode] = useState(true);



    // useEffect(() => {
    //     handleGetAddresses();
    // }, []);

    useEffect(() => {
        getSubDealer();
    }, []);

    const getSubDealer = () => {
        axios.get(`${BASE_URL}/api/get_sub_dealer`, { params: { p_Dealer_Code } })
            .then((response) => {
                // console.log(response.data);
                setSubDealerRes(response.data);
            })
            .catch(error => { console.error('error fetching sub dealer', error) });
    }

    const handleRowSelect = (data, index) => {
        setSelectedRow(data);
        setSelectedRowIndex(index);
    };

    // const handleInputChange = (index, field, value) => {
    //     const updatedData = [...contactPersData];
    //     updatedData[index] = { ...updatedData[index], [field]: value };
    // };


    const handleClearAddress = () => {
        setSubDealerName('');
        setSubDealerAlias(''); 
        setSDStatus('');
        setStatusChangeDate('');

        setEditMode(false);
        setExcLinkMode(true);

    }

    const handleFinalSave = () => {

        // setUserId(1);

        // if (!addrLine1) 
        // {
        //     alert('Please enter Address Line 1.');
        //     return;
        // }

        

        if (subdealername && subdealeralias && sdstatus) {
            const headerData = {
                p_Dealer_Code,
                subdealerCode,
                subdealername,
                subdealeralias,
                sdstatus,
                statuschangedate,
                userId,
                editMode,
            };
            setHeader(headerData);
            const data = {
                header: headerData,
                // details: contactPersData,
            };

            const isConfirmed = window.confirm('Sure, you want to save?');
            if (!isConfirmed) {
                return;
            }

            // alert(JSON.stringify(data));

            axios.post(`${BASE_URL}/api/save_sub_dealer`, data)
                .then(response => {
                    alert('Sub-Dealer saved successfully!');
                    getSubDealer();
                });

            setSubDealerName('');
            setSubDealerAlias('');
            setSDStatus('');
            setEditMode(false);
        }
        else{
            alert('All fields are mandatory!!');
        }

        
        /// to re-fresh the address section again

        // handleGetAddresses();

    };

    const handleSendData = async (selectedRow) => {

        setDealerName(p_Dealer_Name);
        setSubDealerName(selectedRow.sub_dealer_name);
        setSubDealerAlias(selectedRow.sub_dealer_alias);
        setSDStatus(selectedRow.status);
        setSubDealerCode(selectedRow.sub_dealer_cd);
        // setStatusChangeDate(selectedRow.statuschangedate);

        if (selectedRow.st_change_dt) {
            const formattedDate = format(parseISO(selectedRow.st_change_dt), 'yyyy-MM-dd');
            setStatusChangeDate(formattedDate);
        }

                console.log('p_Dealer_Name -> ', p_Dealer_Name);
                console.log('subdealername -> ', subdealername);
                console.log('subdealeralias -> ', subdealeralias);
                console.log('sdstatus -> ', sdstatus);
                console.log('statuschangedate -> ', statuschangedate);


        setEditMode(true);
        setExcLinkMode(false);

    }
    const handleShowDealerExc = () => {
        setShowSubDealerExcPopup(true);
    }

    const handleCloseSubDealerExc = () => {
        setShowSubDealerExcPopup(false);
    };
    // const handleGetAddresses = async () => {

    //     try {
    //         const response = await axios.get(`${BASE_URL}/api/get_addresses', {
    //             params: {
    //                 //p_addr_type: addrtype || 'BANK'
    //             }
    //         });
    //         //setAddressResults(response.data);
    //        // console.log('response.data ==> ', response.data);
    //        // console.log('hiii---',response.data)
    //     } catch (error) {
    //         console.error('Error searching vouchers:', error);
    //     }
    // };

    return (
        <div className="popup_addr_cont">
            <div className="popup-inner">
              <div className='div_header_warn'>
                    <h5 className='search_header '>Sub-Dealer</h5>
                </div>

                <div className="card-body">

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="dealername" className="form-label label-width">Dealer Name</label>
                            <input id="dealername" type="text" className="form-control" style={{width:'350px'}}
                              disabled value={p_Dealer_Name} onChange={(e) => setDealerName(e.target.value)} />
                        </div>
                    </div>

                    {/*  ****************************************************************************
                                   Exchanges and Segments
                     **************************************************************************** */}
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="subdealername" className="form-label label-width">Sub-Dealer</label>
                            <input id="subdealername" type="text" className="form-control" style={{width:'350px'}}
                                value={subdealername} onChange={(e) => setSubDealerName(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="subdealeralias" className="form-label label-width">Alias</label>
                            <input id="subdealeralias" type="text" className="form-control" style={{width:'350px'}}
                                value={subdealeralias} onChange={(e) => setSubDealerAlias(e.target.value)} />
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="sdstatus" className="form-label label-width">Status</label>
                            <select id="sdstatus" className="form-select" name='sdstatus' value={sdstatus} style={{ width: '350px' }}
                                onChange={(e) => setSDStatus(e.target.value)}>
                                <option value="">Select Status</option>
                                <option value="A">Active</option>
                                <option value="C">Closed</option>
                                <option value="S">Suspended</option>
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="statuschangedate" className="form-label label-width">Status Change</label>
                            <input id="statuschangedate" type="text" className="form-control" style={{ width: '350px' }}
                                disabled value={statuschangedate} onChange={(e) => setStatusChangeDate(e.target.value)} />
                        </div>

                    </div>

                    <div className="mt-4">

                        <div className="d-flex">
                            <button className="btn btn-warning me-2" disabled={excLinkMode} onClick={handleShowDealerExc}
                                style={{ width: '150px' }}>Exchange Link</button>
                            {subdealerexcPopup &&
                                <Sub_Dealer_Exchange 
                                p_Dealer_Code={p_Dealer_Code} p_Dealer_Name={p_Dealer_Name} 
                                s_Dealer_Code={subdealerCode} s_Dealer_Name={subdealername}
                                onCloseClick={handleCloseSubDealerExc} />
                            }
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
                    <h6 className='search_header '>Sub-Dealers</h6>
                </div>

                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Sub-Dealer</th>
                                <th>Alias</th>
                                <th >Status</th>
                                <th >Status Change</th>
                                <th hidden>sub_dealer_code</th>
                            </tr>

                        </thead>
                        <tbody>
                            {subDealerRes.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.sub_dealer_name}</td>
                                    <td>{result.sub_dealer_alias}</td>
                                    <td>{result.status}</td>
                                    <td>{result.st_change_dt}</td>
                                    <td hidden>{result.sub_dealer_cd}</td>
                                    {/* <td hidden>{result.sub_dealer_cd}</td>
                                    <td hidden>{result.parent_id}</td> */}
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
