import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import deleteIcon from './image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import './Account_Master.css'; 
import './AddressPopupCss.css'; 
import { BASE_URL } from ".././constants";

function Address_Contacts({ onCloseClick, p_actCode, p_Address_Id, p_BankShortName, is_Auto }) {
    // const [auctiondatas, setAuctiondata] = useState([]);
    const [userId, setUserId] = useState();
    const [selectedRow, setSelectedRow] = useState(null);
    //const [additionalTable1Data, setAdditionalTable1Data] = useState([]);
    const [contactPersData, setContactPersData] = useState([{ cont_pers_id:'',  contact_person: '', designation: '', department: '', cont_pers_mobile: '', 
                                                            cont_pers_phone: '', extn: '', cont_pers_email1: '', cont_pers_email2: '' }]);
   // const [totalAllocatedQty, setTotalAllocatedQty] = useState(0);
  //  const [totalBalanceQty, setTotalBalanceQty] = useState(0);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [header, setHeader] = useState({});
    const [branchname, setBranchName] = useState('');
    const [addrId, setAddrId] = useState('');
    const [addrfor, setAddrFor] = useState('');
    const [addrLine1, setAddrLine1] = useState('');
    const [addrLine2, setAddrLine2] = useState('');
    const [addrLine3, setAddrLine3] = useState('');
    const [city, setCity] = useState('');
    const [pin, setPIN] = useState('');
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');
    const [phone3, setPhone3] = useState('');
    const [email, seteMail] = useState('');
    const [website, setWebSite] = useState('');
    const [addrstatus, setAddrStatus] = useState('');
    const [addressResults, setAddressResults] = useState([]);
    const [addrtype, setAddrType] = useState('VENDOR');
    const [addMode, setAddMode] = useState(is_Auto);

    useEffect(() => {
        handleGetAddresses();
    }, []);

    const handleRowSelect = (data, index) => {
        setContactPersData(prevData => prevData.map(row => ({
            ...row,
            cont_pers_id:'',  contact_person: '', designation: '', department: '', cont_pers_mobile: '', cont_pers_phone: '', extn: '', cont_pers_email1: '', cont_pers_email2: ''
        })));
        setSelectedRow(data);
        setSelectedRowIndex(index);
    };

    const handleInputChange = (index, field, value) => {
        const updatedData = [...contactPersData];
        updatedData[index] = { ...updatedData[index], [field]: value };
        setContactPersData(updatedData);
    };

    const handleAddRow = () => {
        setContactPersData([...contactPersData, { cont_pers_id:'',  contact_person: '', designation: '', department: '', cont_pers_mobile: '', 
            cont_pers_phone: '', extn: '', cont_pers_email1: '', cont_pers_email2: '' }]);
    };

    const handleDeleteRow = (index) => {
        setContactPersData(contactPersData.filter((_, i) => i !== index));
    };

    const handleClearAddress = () => {
        setAddrId('');
        setAddrFor('');
        setBranchName('');
        setAddrLine1('');
        setAddrLine2('');
        setAddrLine3('');
        setCity('');
        setPIN('');
        setPhone1('');
        setPhone2('');
        setPhone3('');
        seteMail('');
        setWebSite('');
        setAddrStatus('');
    }

    const handleFinalSave = () => {

        setUserId(1);

        if (!addrfor) 
        {
            alert('Please enter For Bank.');
            return;
        }

        if (!branchname) 
        {
            alert('Please enter Branch Name.');
            return;
        }

        if (!addrLine1) 
        {
            alert('Please enter Address Line 1.');
            return;
        }

        if (!addrstatus) 
        {
            alert('Please Select Status.');
            return;
        }

        const headerData = {
            addrId,
            p_actCode,
            branchname,
            addrfor,
            addrLine1,
            addrLine2,
            addrLine3,
            city,
            pin,
            phone1,
            phone2,
            phone3,
            email,
            website,
            addrstatus,
            addrtype, 
            userId,
        };
        setHeader(headerData);
        const data = {
            header: headerData,
            details: contactPersData,
        };

        // alert(JSON.stringify(data));

        axios.post(`${BASE_URL}/api/save_address_cont_persons`, data)
        .then(response => {
            //debugger;
            setAddrId(response.data.message);
            // debugger;
            // console.log('response.data.message ---==== ',response.data.message);
            // console.log('response idhar >>>>>>',response);
            alert('Address and Contact Persons saved successfully!')});

        /// to re-fresh the address section again
        debugger;
        handleGetAddresses();
        debugger;

    };

    const handleSendData = async (selectedRow) => {

        //console.log('selectedRow.addrLine1 ', selectedRow.addrLine1);
        setAddrId(selectedRow.addr_id);
        setAddrFor(selectedRow.addr_for);
        setBranchName(selectedRow.branch_name);
        setAddrLine1(selectedRow.addr_line1);
        setAddrLine2(selectedRow.addr_line2);
        setAddrLine3(selectedRow.addr_line3);
        setCity(selectedRow.city);
        setPIN(selectedRow.pin);
        setPhone1(selectedRow.phone1);
        setPhone2(selectedRow.phone2);
        setPhone3(selectedRow.phone3);
        seteMail(selectedRow.email_id);
        setWebSite(selectedRow.website);
        setAddrStatus(selectedRow.status);
        setAddrType('VENDOR');

        ////  **********************************
        ////  populating contact person details
        ////  **********************************

        try {
            const response = await axios.get(`${BASE_URL}/api/get_cont_persons`, {
                params: {
                    p_addr_id: selectedRow.addr_id || ''
                }
            });
           // console.log('contact person response --->>>> ', response);
            if (response) {
                const contpersonList = response.data.map(cont_pers => {
                    return {
                        cont_pers_id: cont_pers.cont_pers_id || '',
                       // list_addr_id: cont_pers.addr_id || '',
                        contact_person: cont_pers.cont_pers_name || '',
                        designation: cont_pers.designation || '',
                        department: cont_pers.dept || '',
                        cont_pers_email1: cont_pers.email_id1 || '',
                        cont_pers_email2: cont_pers.email_id2 || '',
                        cont_pers_mobile: cont_pers.mobile || '',
                        cont_pers_phone: cont_pers.phone || '',
                        extn: cont_pers.extn || '',
                        //list_status: cont_pers.status || ''   
                     };
                });
                console.log('contact person contpersonList --->>>> ', contpersonList);
                setContactPersData(contpersonList);
            }
            
            //setAddressResults(response.data);
           // console.log('response.data ==> ', response.data);
           // console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error searching address:', error);
        }
    }

    const handleGetAddresses = async () => {

        try {
            const response = await axios.get(`${BASE_URL}/api/get_addresses`, {
                params: {
                    p_addr_type: addrtype || 'VENDOR',
                    p_act_Code: p_actCode
                }
            });
            setAddressResults(response.data);
           // console.log('response.data ==> ', response.data);
           // console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };

    const columns = [
        
        {
            name: 'Contact Person',
            selector: row => row.contact_person,
            cell: (row, index) => (
                <input
                    type="text" disabled={addMode}
                    value={row.contact_person}
                    onChange={e => handleInputChange(index, 'contact_person', e.target.value)}
                    className="form-control me-3 select_color"
                />
            ),
            width: '30%',
        },

        {
            name: 'Designation',
            selector: row => row.designation,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.designation} disabled={addMode}
                    onChange={e => handleInputChange(index, 'designation', e.target.value)}
                    className="form-control me-3 select_color"
                />
            ),
            width: '20%',
        },

        {
            name: 'Department',
            selector: row => row.department,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.department} disabled={addMode}
                    onChange={e => handleInputChange(index, 'department', e.target.value)}
                    className="form-control me-3 select_color"
                />
            ),
            width: '20%',
        },

        {
            name: 'Mobile',
            selector: row => row.cont_pers_mobile,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.cont_pers_mobile} disabled={addMode}
                    onChange={e => handleInputChange(index, 'cont_pers_mobile', e.target.value)}
                    className="form-control me-3 select_color"
                />
            ),
            width: '20%',
        },

        {
            name: 'Phone',
            selector: row => row.cont_pers_phone,
            cell: (row, index) => (
                <input type="text"
                    value={row.cont_pers_phone} disabled={addMode}
                    onChange={e => handleInputChange(index, 'cont_pers_phone', e.target.value)}
                    className="form-control me-3 select_color" />
            ),
            width: '20%',
        },

        {
            name: 'Extension',
            selector: row => row.extn,
            cell: (row, index) => (
                <input type="text"
                    value={row.extn} disabled={addMode}
                    onChange={e => handleInputChange(index, 'extn', e.target.value)}
                    className="form-control me-3 select_color" />
            ),
            width: '20%',
        },

        {
            name: 'eMail Id-1',
            selector: row => row.cont_pers_email1,
            cell: (row, index) => (
                //<div className='d-flex '>
                    <input
                        type="text"
                        value={row.cont_pers_email1} disabled={addMode}
                        onChange={e => handleInputChange(index, 'cont_pers_email1', e.target.value)}
                        className="form-control me-3 select_color"/>
               // </div>
            ),
            width: '20%',
        },

        {
            name: 'eMail Id-2',
            selector: row => row.cont_pers_email2,
            cell: (row, index) => (
                <div className='d-flex '>
                    <input
                        type="text"
                        value={row.cont_pers_email2} disabled={addMode}
                        onChange={e => handleInputChange(index, 'cont_pers_email2', e.target.value)}
                        className="form-control me-3 select_color"/>
                        <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-delete-${index}`}>Delete</Tooltip>}>
                        <img
                            src={deleteIcon}
                            alt="Delete" 
                            onClick={!addMode ? () => handleDeleteRow(index) : null}
                            className='select_color'
                            style={{ width: '20px', height: '20px', marginTop: '7px' }} />
                    </OverlayTrigger>
                </div>
            ),
            width: '20%',
        },

         {
            selector: row => row.cont_pers_id,
            cell: (row, index) => (
                <input value={row.cont_pers_id} hidden />
            ),
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
        <div className="popup_addr_cont">
            <div className="popup-inner">
            <div className='div_header_warn'>
                    <h4 className='search_header '>Address & Contact Persons</h4>
                </div>

                <div>
                </div>

                <div className="card-body">

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="addr1" className="form-label label-width">Address Line 1</label>
                            <input id="addrline1" type="text" className="form-control size_input_cashbank" disabled={addMode}
                                value={addrLine1} onChange={(e) => setAddrLine1(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="addr2" className="form-label label-width">Address Line 2</label>
                            <input id="addrLine2" type="text" className="form-control size_input_cashbank" disabled={addMode}
                                value={addrLine2} onChange={(e) => setAddrLine2(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="addr3" className="form-label label-width">Address Line 3</label>
                            <input id="addrline3" type="text" className="form-control size_input_cashbank" disabled={addMode}
                                value={addrLine3} onChange={(e) => setAddrLine3(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="city" className="form-label label-width">City</label>
                            <input id="city" type="text" className="form-control size_input_cashbank" disabled={addMode}
                                value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="pin" className="form-label label-width">PIN</label>
                            <input id="pin" type="text" className="form-control size_input_cashbank" disabled={addMode}
                                value={pin} onChange={(e) => setPIN(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="phone1" className="form-label label-width">Phone 1</label>
                            <input id="phone1" type="text" className="form-control size_input_cashbank" disabled={addMode}
                                value={phone1} onChange={(e) => setPhone1(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="phone2" className="form-label label-width">Phone 2</label>
                            <input id="phone2" type="text" className="form-control size_input_cashbank" disabled={addMode}
                                value={phone2} onChange={(e) => setPhone2(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="phone3" className="form-label label-width">Phone 3</label>
                            <input id="phone3" type="text" className="form-control size_input_cashbank" disabled={addMode}
                                value={phone3} onChange={(e) => setPhone3(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="email" className="form-label label-width">eMail Id</label>
                            <input id="email" type="text" className="form-control size_input_cashbank" disabled={addMode}
                                value={email} onChange={(e) => seteMail(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="website" className="form-label label-width">Web Site</label>
                            <input id="website" type="text" className="form-control size_input_cashbank" disabled={addMode}
                                value={website} onChange={(e) => setWebSite(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="status" className="form-label label-width">Status</label>
                            <select id="addrstatus" className="form-select size_input_cashbank" name='addrstatus' value={addrstatus}
                                onChange={(e) => setAddrStatus(e.target.value)} disabled={addMode}>
                                <option value="">Select Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="CLOSED">Closed</option>
                                <option value="SUSPENDED">Suspended</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-2 d-flex">
                            <button className='close_btn input_margin' style={{ width: '100px' }} onClick={() => onCloseClick(null)}>Close</button>
                            {!addMode ?
                                <button className='btn_new input_margin' style={{ width: '100px' }} onClick={handleClearAddress}>New</button>
                                : null
                            }
                            {!addMode ?
                                <button className="save_btn input_margin" style={{ width: '150px' }} onClick={handleFinalSave}>Save</button>
                                : null
                            }  
                        </div>

                    </div>
                </div>

                {/* ****************************************************************************************************
                **************************************   Start  Address Table   *********************************
                **************************************************************************************************** */}

                <div className='div_sub_header_warn'>
                    <h6 className='search_header '>Addresses</h6>
                </div>

                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Address Line1</th>
                                <th>Address Line2</th>
                                <th>Address Line3</th>
                                <th >City</th>
                                <th >PIN</th>
                                <th >Phone 1</th>
                                <th >Phone 2</th>
                                <th >Phone 3</th>
                                <th >eMail Id</th>
                                <th >Web Site</th>
                                <th >Status</th>
                                <th hidden>addr_id</th>
                            </tr>

                        </thead>
                        <tbody>
                            {addressResults.map((result, index) => (
                                <tr key={index} onClick={addMode ? null : () => { handleSendData(result) }} style={{ cursor: 'pointer' }}>
                                    <td>{result.addr_line1}</td>
                                    <td>{result.addr_line2}</td>
                                    <td>{result.addr_line3}</td>
                                    <td>{result.city}</td>
                                    <td>{result.pin}</td>
                                    <td>{result.phone1}</td>
                                    <td>{result.phone2}</td>
                                    <td>{result.phone3}</td>
                                    <td>{result.email_id}</td>
                                    <td>{result.website}</td>
                                    <td>{result.status}</td>
                                    <td hidden>{result.addr_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            {/* ****************************************************************************************************
                **************************************   End Address Table   *********************************
                **************************************************************************************************** */}

            {/* ****************************************************************************************************
                **************************************   Start  Contact Person   *********************************
            **************************************************************************************************** */}


                <div className='div_sub_header_warn'>
                    <h6 className='search_header '>Contact Persons</h6>
                </div>

                <div className='table_margin mt-2' style={{ lineHeight: '1' }}>
                   
                </div>
                    <div className='mt-2'>
                        <div style={{ border: '1px solid #ccc', margin: '5px 5px 0px 5px' }}>
                            {/* <h5 className='text-center label_color'>Allocation Details</h5> */}
                            {/* <input id="test" value={test}></input> */}
                              <div className='table-container'>
                                 <DataTable
                                    columns={columns}
                                    data={contactPersData}
                                    responsive
                                    highlightOnHover
                                    customStyles={customStyles}
                                    noDataComponent={<div>No data available</div>}
                                /> 
                            </div>  
                        {!addMode ?
                            <div className='d-flex justify-content-end me-2'>
                                <button className="add_btn input_margin" onClick={handleAddRow} disabled={addMode}>Add</button>
                            </div>
                            : null}
                    </div>
                    </div>

            {/* ****************************************************************************************************
                **************************************   End Contact Person   *********************************
            **************************************************************************************************** */}
               
            </div>
            
        </div>
    );
}

export default Address_Contacts;
