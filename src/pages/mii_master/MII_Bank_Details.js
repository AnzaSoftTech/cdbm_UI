import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import deleteIcon from './image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import './MII_Master.css'; 
import './PopupCss.css';
import { format,parseISO } from 'date-fns'; 

//import { response } from 'express';
import { BASE_URL } from ".././constants";

function MII_Bank_Detl({ onCloseClick, p_MII_code }) {
    const [userId, setUserId] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null);
    const [contactPersData, setContactPersData] = useState([{ mii_bank_dtl_id:'',  bank_type: '', book_type: '', bank_name: '', bank_act_no: '', 
                                                            status: '', start_date: '', end_date: '' }]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [header, setHeader] = useState({});
    const [bankDtlId, setBankDtlId] = useState('');
    const [banktype, setBankType] = useState('');
    const [banktypes, setBankTypes] = useState([]);
    const [booktype, setBookType] = useState('');
    const [booktypes, setBookTypes] = useState([]);
    const [bankname, setBankName] = useState('');
    const [bankacctno, setBankActNo] = useState('');
    const [status, setStatus] = useState('A');
    const [fromdate, setFromDate] = useState('');
    const [todate, setToDate] = useState('');
    const [bankdetlResults, setBankDtlResults] = useState([]);

    useEffect(() => {
        handleGetBank_Details();
        setUserId(1);
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_mii_bank_types`)
            .then(response => { setBankTypes(response.data)})
            .catch(error => console.error('Error fetching MII bank types:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_cb_book_types`)
            .then(response => { setBookTypes(response.data)})
            .catch(error => console.error('Error fetching MII Book Types :', error));
    }, []);

    const handleBookType = async (p_book_type) => {

        try {
            setBookType(p_book_type);
            console.log('p_book_type === ', p_book_type);

            const response = await axios.get(`${BASE_URL}/api/get_bankname_accountno?p_book_type=` + p_book_type);

            if (response.data.length === 1) {
                setBankName(response.data[0].bank_name);
                setBankActNo(response.data[0].bank_acc_no);
            }
            else {
                setBankName('');
                setBankActNo('');
            }
        }

     catch (error) {
        console.error("Error in handleBookType! ", error);

     }

    }

    const handleClearBankDtl = () => {
        setBankDtlId('');
        setBankType('');
        setBookType('');
        setStatus('');
        setFromDate('');
        setToDate('');
        setBankName('');
        setBankActNo('');
    }

    const handleFinalSave = () => {

        

        if (!banktype) 
        {
            alert('Please Select Bank Type.');
            return;
        }

        if (!booktype) 
        {
            alert('Please Select Book Type.');
            return;
        }

        if (!status) 
        {
            alert('Please Select Status');
            return;
        }
        if (!fromdate) 
        {
            alert('Please Select From Date');
            return;
        }

        const headerData = {
            p_MII_code,
            bankDtlId,
            banktype,
            booktype,
            bankname,
            bankacctno,
            status,
            fromdate,
            todate,
            userId,
        };
        setHeader(headerData);
        const data = {
            header: headerData
            //details: contactPersData,
        };

        // alert(JSON.stringify(data));

        axios.post(`${BASE_URL}/api/save_MII_Bank_Details`, data)
        .then(response => {
            alert('MII Bank Details saved successfully!')});

      //  setBankDtlId(response.statusMessage.lv_bank_dtl_id);

        /// to re-fresh the address section again

      handleGetBank_Details();

    };

    const handleSendData = async (selectedRow) => {

        setBankDtlId(selectedRow.bank_dtl_id);
        setBankType(selectedRow.bank_type_id);
        setBookType(selectedRow.book_type);
        setStatus(selectedRow.status);
        if (selectedRow.from_date) {
            const dateString = selectedRow.from_date;
            const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
            setFromDate(formattedDate);
        }
        else{
            setFromDate('');
        }
        if (selectedRow.to_date) {
            const dateString = selectedRow.to_date;
            const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
            setToDate(formattedDate);
        }
        else{
            setToDate('');
        }
        setBankName(selectedRow.bank_name);
        setBankActNo(selectedRow.bank_acc_no);
       
    }

    const handleGetBank_Details = async () => {

        try {
            const response = await axios.get(`${BASE_URL}/api/get_MII_bank_details`, {
                params: {
                    p_MII_Id: p_MII_code
                }
            });
            setBankDtlResults(response.data);
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };

 
    return (
        <div className="popup_addr_cont">
            <div className="popup-inner">
            <div className='div_header_warn'>
                    <h4 className='search_header '>MII Bank Details</h4>
                </div>

                <div>
                </div>

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="banktype" className="form-label label-width">Bank Type</label>
                            <select id="banktype" className="form-select size_input_cashbank" name='banktype' value={banktype}
                                onChange={(e) => setBankType(e.target.value)}>
                                <option value="">Select Bank Type</option>
                                {banktypes.map(BnkType => (
                                    <option key={BnkType.bank_type_id} value={BnkType.bank_type_id}>{BnkType.type_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="booktype" className="form-label label-width">Book Type</label>
                            <select id="booktype" className="form-select size_input_cashbank" name='booktype' value={booktype}
                                onChange={(e) => handleBookType(e.target.value)}>
                                <option value="">Select Book Type</option>
                                {booktypes.map(BType => (
                                    <option key={BType.book_type} value={BType.book_type}>{BType.book_type}</option>
                                ))}
                            </select>
                        </div>
                        
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="bankname" className="form-label label-width">Bank Name</label>
                            <input id="bankname" type="text" className="form-control size_input_cashbank"
                                value={bankname} disabled onChange={(e) => setBankName(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="bankacctno" className="form-label label-width">Bank Ac No</label>
                            <input id="bankacctno" disabled type="text" className="form-control size_input_cashbank"
                                value={bankacctno} onChange={(e) => setBankActNo(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="fromdate" className="form-label label-width">From Date</label>
                            <input id="fromdate" type="date" className="form-control size_input_cashbank"
                                value={fromdate} onChange={(e) => setFromDate(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="todate" className="form-label label-width">To Date</label>
                            <input id="todate" type="date" className="form-control size_input_cashbank"
                                value={todate} onChange={(e) => setToDate(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="status" className="form-label label-width">Status</label>

                            <select id="status" className="form-select size_input_cashbank" name='status' value={status}
                                onChange={(e) => setStatus(e.target.value)}>
                                <option value="A">Active</option>
                                <option value="C">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">

                        <div className="col-md-6 mb-2 d-flex">
                            <button className='close_btn input_margin' style={{width:'100px'}} onClick={() => onCloseClick(null)}>Close</button>
                            <button className='btn_new input_margin' style={{width:'100px'}} onClick={handleClearBankDtl}>New</button>
                            <button className="save_btn input_margin" style={{width:'150px'}} onClick={handleFinalSave}>Save</button>
                        </div>
                    </div>
                </div>

                {/* ****************************************************************************************************
                **************************************   Start  Table   *********************************
                **************************************************************************************************** */}

                <div className='div_sub_header_warn'>
                    <h6 className='search_header '>Addresses</h6>
                </div>

                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Bank Type</th>
                                <th>Book Type</th>
                                <th>Bank Name</th>
                                <th>Bank Acct Number</th>
                                <th>Status</th>
                                <th >Start Date</th>
                                <th >End Data</th>
                            </tr>

                        </thead>
                        <tbody>
                            {bankdetlResults.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.type_name}</td>
                                    <td>{result.book_type}</td>
                                    <td>{result.bank_name}</td>
                                    <td>{result.bank_acc_no}</td>
                                    <td>{result.status}</td>
                                    <td>{result.from_date}</td>
                                    <td>{result.to_date}</td>
                                    <td hidden>{result.bank_dtl_id}</td>
                                    <td hidden>{result.bank_type_id}</td>
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

export default MII_Bank_Detl;
