import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import deleteIcon from './image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import './Dealer_Sub_Dealer.css'; 
import './PopupCss.css'; 
import { BASE_URL } from "../constants";

function Dealer_Slab() {
    const [userId, setUserId] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null);
    // const [contactPersData, setContactPersData] = useState([{ cont_pers_id:'',  contact_person: '', designation: '', department: '', cont_pers_mobile: '',
    //                                                         cont_pers_phone: '', extn: '', cont_pers_email1: '', cont_pers_email2: '' }]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [header, setHeader] = useState({});
    
    // const [addressResults, setAddressResults] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [dateappl, setDateAppl] = useState('');
    const [slabs, setSlabs] = useState([]);
    const [slabCode, setSlabCode] = useState();
    const [dateFrom, setDateFrom] = useState();
    const [dateTo, setDateTo] = useState();
    const [shares, setShares] = useState([]);
    const [sharingSlab, setSharingSlab] = useState();
    const [sharingAlias, setSharingAlias] = useState();

    const newRef = useRef();
    const slabRef = useRef();
    const dateFromRef = useRef();
    const dateToRef = useRef();

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_slab_master`)
            .then(response => {
                setSlabs(response.data);
            })
            .catch(error => console.log('Error fetching Slabs', error));
    }, []);

    useEffect(() => {
        getShares();
    }, []);


    const getShares = () => {
        axios.get(`${BASE_URL}/api/get_sub_dealer_sharing`)
            .then(response => {
                setShares(response.data);
            })
            .catch(error => console.log('Error fetching Slabs', error));
            newRef.current.disabled = true;
            dateFromRef.current.disabled = false;
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
        dateFromRef.current.disabled = false;
        setSlabCode('');
        setDateFrom('');
        setDateTo('');
        setEditMode(false);
        newRef.current.disabled = true;
    }

    const handleFinalSave = () => {

        if (sharingSlab && sharingAlias && dateFrom) {
            const headerData = {
                sharingSlab,
                sharingAlias,
                dateFrom,
                dateTo,
                userId,
                // editMode,
            };
            setHeader(headerData);
            const data = {
                header: headerData,
                // details: contactPersData,
            };


            axios.post(`${BASE_URL}/api/save_sub_dealer_sharing`, data)
                .then(response => {
                    if(response.data.message === 'Slab Already Exists'){
                        alert('Slab Already Exists, Please Select New Slab!!');
                    }
                    else{
                        alert('Sub-Dealer Sharing saved successfully!');
                    }
                    getShares();
                });

            // setSlabCode('');
            // setDateFrom('');
            // setDateTo('');
            // newRef.current.disabled = false;
            // dateFromRef.current.disabled = false;

            handleClearAddress();
        }
        else {
            alert('Sharing Slab, Alias and Date From are mandatory!!');
        }

        
        /// to re-fresh the address section again

        // handleGetAddresses();

    };

    const handleSendData = async (selectedRow) => {

        // setDealerName(p_Dealer_Name);
        // setSubDealerName(selectedRow.sub_dealer_name);
        // setSubDealerAlias(selectedRow.sub_dealer_alias);
        // setSDStatus(selectedRow.status);
        // setSubDealerCode(selectedRow.sub_dealer_cd);
        // setStatusChangeDate(selectedRow.statuschangedate);
        setSlabCode(selectedRow.br_slab_id);
        setDateFrom(selectedRow.date_from);
        if(selectedRow.date_to){
            setDateTo(selectedRow.date_to);
        }
        else{
            setDateTo('');
        }
        

        // if (selectedRow.statuschangedate) {
        //     const dateString = selectedRow.statuschangedate;
        //     const formattedDate = format(parseISO(selectedRow.statuschangedate), 'yyyy-MM-dd');
        //     setStatusChangeDate(formattedDate);
        // }
        // setEditMode(true);
        // setExcLinkMode(false);

        newRef.current.disabled = false;
        dateFromRef.current.disabled = true;
        setEditMode(true);

    }
    const handleShowDealerExc = () => {
        // setShowSubDealerExcPopup(true);
    }

    const handleCloseSubDealerExc = () => {
        // setShowSubDealerExcPopup(false);
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
        <div className="popup_addr_cont" style={{width: '1020px'}}>
            <div className="popup-inner">
              <div className='div_header_warn'>
                    <h4 className='search_header '>Dealer Slab Master</h4>
                </div>

                <div className="card-body">

                    {/*  ****************************************************************************
                                   Exchanges and Segments
                     **************************************************************************** */}
                    <div className="row" style={{ marginTop: '7px' }}>
                        <div className="col-md-6 mb-2 d-flex" style={{ height: '38px', width: '50%' }}>
                            <label htmlFor="sharingSlab" className="form-label label-width">Sharing Slab</label>
                            <input id="sharingSlab" type="text" className="form-control size_input_cashbank" value={sharingSlab}
                                onChange={(e) => {setSharingSlab(e.target.value)}}
                            />
                        </div>
                        <div className="col-md-6 mb-2 d-flex" style={{ height: '38px', width: '50%' }}>
                            <label htmlFor="sharingAlias" className="form-label label-width">Sharing Alias</label>
                            <input id="sharingAlias" type="text" className="form-control size_input_cashbank" value={sharingAlias}
                                onChange={(e) => {setSharingAlias(e.target.value)}}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex"  style={{marginTop: '7px'}}>
                            <label htmlFor="openingdate" className="form-label label-width">Date From</label>
                            <input id="dateFrom" type="date" className="form-control size_input_cashbank" ref={dateFromRef}
                                value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}  />
                        </div>
                        <div className="col-md-6 mb-3 d-flex"  style={{marginTop: '6px'}}>
                            <label htmlFor="openingdate" className="form-label label-width">Date To</label>
                            <input id="Dateto" type="date" className="form-control size_input_cashbank" ref={dateToRef}
                                value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                        </div>
                    </div>

                    <div className="mt-4">

                        <div className="d-flex">
                            <button className="btn btn-primary me-2" style={{width:'100px'}} onClick={handleClearAddress}
                                ref={newRef}>New</button>
                            <button className="btn btn-success me-2" style={{width:'150px'}} onClick={handleFinalSave}>Save</button>
                        </div>

                    </div>
                </div>

                {/* ****************************************************************************************************
                **************************************   Start  Address Table   *********************************
                **************************************************************************************************** */}

                <div className='div_sub_header_warn'>
                    <h6 className='search_header '>Sub-Dealer Sharing</h6>
                </div>

                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Sharing Slab</th>
                                <th>Date From</th>
                                <th>Date To</th>
                                <th hidden>Sharing Slab ID</th>
                            </tr>

                        </thead>
                        <tbody>
                            {shares.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.alias}</td>
                                    <td>{result.date_from}</td>
                                    <td>{result.date_to}</td>
                                    <td hidden>{result.br_slab_id}</td>
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

export default Dealer_Slab;
