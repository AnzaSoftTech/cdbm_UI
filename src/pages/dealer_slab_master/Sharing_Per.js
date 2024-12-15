import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
// import deleteIcon from './image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import './Dealer_Slab.css'; 
import './SharingPopupCss.css'; 
// import Sub_Dealer_Exchange from './Sub_Dealer_Exchange';
import { BASE_URL } from "../constants";


function Sharing_Per({ onCloseClick, sharingSlabId, sharingSlab }) {
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
    const [subdealerexcPopup, setShowSubDealerExcPopup] = useState(false);
    const [excLinkMode, setExcLinkMode] = useState(true);
    
    const [brBrokerage, setBrBrokerage] = useState();
    const [dlBrokerage, setDlBrokerage] = useState();
    const [genCharge, setGenCharge] = useState('N');
    const [dateFrom, setDateFrom] = useState();
    const [dateTo, setDateTo] = useState();
    const [brSlDetNo, setBrSlDetNo] = useState();
    const [shrPer, setShrPer] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const newRef = useRef();


    // useEffect(() => {
    //     handleGetAddresses();
    // }, []);

    useEffect(() => {
        getSharingPer();
        newRef.current.disabled = true;
    }, []);

    // const getSubDealer = () => {
    //     axios.get(`${BASE_URL}/api/get_sub_dealer', { params: { p_Dealer_Code } })
    //         .then((response) => {
    //             // console.log(response.data);
    //             setSubDealerRes(response.data);
    //         })
    //         .catch(error => { console.error('error fetching sub dealer', error) });
    // }

    const getSharingPer = async () => {
        await axios.get(`${BASE_URL}/api/get_sharing_percentage`, { params: { sharingSlabId } })
            .then(response => {
                setShrPer(response.data);
            })
            .catch(error => console.error('error fetching sharing percentages!', error));
    }

    const handleRowSelect = (data, index) => {
        setSelectedRow(data);
        setSelectedRowIndex(index);
    };

    // const handleInputChange = (index, field, value) => {
    //     const updatedData = [...contactPersData];
    //     updatedData[index] = { ...updatedData[index], [field]: value };
    // };


    const handleClearShrPer = () => {
        setBrBrokerage('');
        setDlBrokerage('');
        setDateFrom('');
        setDateTo('');
        setGenCharge('N');
        setEditMode(false);
        newRef.current.disabled = true;
        // newRef.current.disabled = true;
        // shrPerRef.current.disabled = true;
    }

    const handleFinalSave = async () => {
        console.log('dateFrom ', dateFrom);

        if (brBrokerage || dlBrokerage) {

            if (!dateFrom) {
                alert('Please enter Date From');
                return;
            }
            if (dateTo) {
                if (dateTo <= dateFrom) {
                    alert('Please enter Date From less than Date To!');
                    return;
                }
            }

            const headerData = {
                sharingSlabId,
                brBrokerage,
                dlBrokerage,
                genCharge,
                dateFrom,
                dateTo,
                brSlDetNo,
                userId,
                editMode,
            }

            const data = {
                header: headerData,
            };

            const res = await axios.get(`${BASE_URL}/api/validation`, { params: { sharingSlabId, dateFrom, editMode } });
            // .then(response => {
            //     if(response.data === 1){
            //        alert("new entry's date from should be greater than last entry's date from!!");
            //        return;
            //     }
            // })
            // .catch(error => console.error(error.message));

            console.log('res.data ', res.data);

            if(res.data === 1){
                alert("new entry's date from should be greater than last entry's date from!!");
                   return;
            }
            if(res.data === 2){
                alert("new entry's date from should be greater than last entry's date from and last entry's date to!!");
                   return;
            }
            

            await axios.post(`${BASE_URL}/api/save_sharing_percentage`, data)
                .then(response => {
                    if(response.data === "new entry's date from should be greater than last entry's date from"){
                        alert("new entry's date from should be greater than last entry's date from!!");
                        return;
                    }
                    if(response.data === "new entry's date from should be greater than last entry's date from and date to"){
                        alert("new entry's date from should be greater than last entry's date from and date to!!");
                        return;
                    }
                    alert('Sharing Percentage saved successfully!');
                    handleClearShrPer();
                    getSharingPer();
                })
                .catch(error => console.log(error)); 
        }
        else{
            alert('Please enter Branch Brokerage or Delievery Brokerage!');
        }
        /// to re-fresh the address section again

        // handleGetAddresses();

    };

    const handleSendData = async (selectedRow) => {

        setBrBrokerage(selectedRow.br_brok || '');
        setDlBrokerage(selectedRow.dl_brok || '');
        setGenCharge(selectedRow.net_off_g_chg);
        setBrSlDetNo(selectedRow.br_sl_det_no);
        if (selectedRow.date_app) {
            const formattedDate = format(parseISO(selectedRow.date_app), 'yyyy-MM-dd');
            setDateFrom(formattedDate);
        }
        if (selectedRow.date_to) {
            const formattedDate = format(parseISO(selectedRow.date_to), 'yyyy-MM-dd');
            setDateTo(formattedDate);
        }
        else{
            setDateTo('');
        }

        setEditMode(true);
        newRef.current.disabled = false;
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
                    <h5 className='search_header '>Sharing Percentage</h5>
                </div>

                <div className="card-body">

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="sharingSlab" className="form-label label-width" style={{width: '170px'}}>Sharing Slab</label>
                            <input id="sharingSlab" type="text" className="form-control" style={{width:'350px'}}
                              disabled  value={sharingSlab} />
                        </div>
                    </div>

                    {/*  ****************************************************************************
                                   Exchanges and Segments
                     **************************************************************************** */}
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="brBrokerage" className="form-label label-width" style={{width: '170px'}}>Branch Brok.</label>
                            <input id="brBrokerage" type="number" className="form-control" style={{width:'350px', textAlign:'right'}} 
                                value={brBrokerage} onChange={(e) => setBrBrokerage(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="dlBrokerage" className="form-label label-width" style={{width: '170px'}}>Delievery Brok.</label>
                            <input id="dlBrokerage" type="number" className="form-control" style={{width:'350px', textAlign:'right'}}
                                value={dlBrokerage} onChange={(e) => setDlBrokerage(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="genCharge" className="form-label label-width" style={{width: '170px'}}>Net Off Gen Charges</label>
                            <select id="genCharge" className="form-select" name='genCharge' value={genCharge} style={{ width: '350px' }}
                                onChange={(e) => setGenCharge(e.target.value)}>
                                <option value="N">No</option>
                                <option value="Y">Yes</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="dateFrom" className="form-label label-width" style={{width: '185px'}}>Date From</label>
                            <input id="dateFrom" type="date" className="form-control size_input_cashbank"
                                value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="Dateto" className="form-label label-width" style={{width: '185px'}}>Date To</label>
                            <input id="Dateto" type="date" className="form-control size_input_cashbank"
                                value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                        </div>

                    </div>

                    <div className="mt-4">

                        <div className="d-flex">
                            <button className="btn btn-primary me-2" ref={newRef} style={{width:'100px'}} onClick={handleClearShrPer}>New</button>
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
                                <th>Branch Brok.</th>
                                <th>Delievery Brok.</th>
                                <th >Net Off Gen Charges</th>
                                <th >Date From</th>
                                <th>Date To</th>
                                <th hidden>br_sl_det_no</th>
                            </tr>

                        </thead>
                        <tbody>
                            {shrPer.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.br_brok}</td>
                                    <td>{result.dl_brok}</td>
                                    <td>{result.net_off_g_chg}</td>
                                    <td>{result.date_app}</td>
                                    <td>{result.date_to}</td>
                                    <td hidden>{result.br_sl_det_no}</td>
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

export default Sharing_Per;
