import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import deleteIcon from './image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import './CashBank_Master.css'; 
import './PopupCss.css'; 
import { BASE_URL } from ".././constants";

function ChequeBookNo({ onCloseClick, p_cbAcctCode }) {
    const [userId, setUserId] = useState();
    const [selectedRow, setSelectedRow] = useState(null);
    const [additionalTable2Data, setAdditionalTable2Data] = useState([{ chq_id: '', from_chq_no: '', to_chq_no: '' }]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [header, setHeader] = useState({});

    useEffect(() => {
        axios.get(`${BASE_URL}/api/get_cheque_nos?p_cbAcctCode=` + p_cbAcctCode)
        .then(response=>{setAdditionalTable2Data(response.data); console.log('response.data',response.data)})    
    }, []);

    const handleRowSelect = (data, index) => {
        setAdditionalTable2Data(prevData => prevData.map(row => ({
            ...row,
            chq_id: '',
            from_chq_no: '',
            to_chq_no: '',
        })));
        setSelectedRow(data);
        setSelectedRowIndex(index);
    };

    const handleInputChange = (index, field, value) => {
        const updatedData = [...additionalTable2Data];
        updatedData[index] = { ...updatedData[index], [field]: value };
        setAdditionalTable2Data(updatedData);
    };

    const handleAddRow = () => {
        setAdditionalTable2Data([...additionalTable2Data, { chq_id: '', from_chq_no: '', to_chq_no: '' }]);
    };

    const handleDeleteRow = (index) => {
        setAdditionalTable2Data(additionalTable2Data.filter((_, i) => i !== index));
    };

    const handleFinalSave = () => {

        setUserId(1);

        var lv_validation_passed = 'T';

        for (let i = 0; i < additionalTable2Data.length; i++)
        {
                
            if ((!additionalTable2Data[i].from_chq_no && additionalTable2Data[i].to_chq_no) ||
                 (additionalTable2Data[i].from_chq_no && !additionalTable2Data[i].to_chq_no))
            {
                lv_validation_passed = 'F';
                break;
            }
    
        }

        if (lv_validation_passed === 'F')
            {
                alert('From and To Cheque No. must be entered.');
                return;
            }

        for (let i = 0; i < additionalTable2Data.length; i++)
        {
            
            if (Number(additionalTable2Data[i].from_chq_no) > Number(additionalTable2Data[i].to_chq_no))
            {
                lv_validation_passed = 'F';
                break;
            }

        }

        if (lv_validation_passed === 'F')
        {
            alert('From Cheque No. cannot be greater than To Cheque No.');
            return;
        }

        const headerData = {
            p_cbAcctCode,
            userId,
        };
        setHeader(headerData);
        const data = {
            header: headerData,
            details: additionalTable2Data,
        };

        alert(JSON.stringify(data));

        axios.post(`${BASE_URL}/api/save_cheque_nos`, data)
        .then(response => {
            alert('Cheque Nos saved successfully!')});
        
    };


    const columns = [
        {
            selector: row => row.chq_id,
            cell: (row, index) => (
                <input value={row.chq_id} hidden />
            ),
        },
        {
            name: 'From Cheque No.',
            selector: row => row.from_chq_no,
            cell: (row, index) => (
                <input
                    type="number"
                    value={row.from_chq_no}
                    onChange={e => handleInputChange(index, 'from_chq_no', e.target.value)}
                    className="form-control text_align_table me-3 select_color"
                />
            ),
            width: '30%',
        },
        {
            name: 'To Cheque No.',
            selector: row => row.to_chq_no,
            cell: (row, index) => (
                <div className='d-flex '>
                    <input
                        type="number"
                        value={row.to_chq_no}
                        onChange={e => handleInputChange(index, 'to_chq_no', e.target.value)}
                        className="form-control text_align_table me-3 select_color"
                    />
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-delete-${index}`}>Delete</Tooltip>}
                    >
                        <img
                            src={deleteIcon}
                            alt="Delete"
                            onClick={() => handleDeleteRow(index)}
                            className='select_color'
                            style={{ width: '20px', height: '20px', marginTop: '7px' }}
                        />
                    </OverlayTrigger>
                </div>
            ),
            width: '50%',
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
        <div className="popup">
            <div className="popup-inner">
            <div className='div_header_warn'>
                    <h4 className='search_header '>Cheque Book Number</h4>
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
                                    data={additionalTable2Data}
                                    responsive
                                    highlightOnHover
                                    customStyles={customStyles}
                                    noDataComponent={<div>No data available</div>}
                                /> 
                            </div>  
                            <div className='d-flex justify-content-end me-2'>
                                <button className="add_btn input_margin" onClick={handleAddRow}>Add</button>
                            </div>
                        </div>
                    </div>
                <button className="save_btn input_margin" onClick={handleFinalSave}>Save</button>
                <button className='close_btn input_margin' onClick={() => onCloseClick(null)}>Close</button>
            </div>
        </div>
    );
}

export default ChequeBookNo;
