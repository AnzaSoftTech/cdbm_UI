import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './auctionPopUp.css';
import DataTable from 'react-data-table-component';
import deleteIcon from './image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { BASE_URL } from ".././constants";

function AuctionTable({ onCloseClick }) {
    const [auctiondatas, setAuctiondata] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [additionalTable1Data, setAdditionalTable1Data] = useState([]);
    const [additionalTable2Data, setAdditionalTable2Data] = useState([{ clientCode: '', sec: '', qty: '' }]);
    const [totalAllocatedQty, setTotalAllocatedQty] = useState(0);
    const [totalBalanceQty, setTotalBalanceQty] = useState(0);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    useEffect(() => {
        // 'http://localhost:3001/api/auctiondata'
        axios.get(`${BASE_URL}/api/auctiondata`)
            .then(response => {

                const data = response.data;
                console.log('Fetched data:', data);


                const validData = data.filter(item => {

                    const allocQty = item.total_alloc_qty ? Number(item.total_alloc_qty) : 0;
                    const tradeQty = Number(item.total_trade_qty) || 0;


                    return tradeQty - allocQty !== 0;
                });


                if (validData.length > 0) {
                    setAuctiondata(validData);
                }
            })
            .catch(error => console.error('Error fetching auction data:', error));
    }, []);

    useEffect(() => {
        if (selectedRow) {
            // `http://localhost:3001/api/stag_auction
            axios.get(`${BASE_URL}/api/stag_auction?symbol=${selectedRow.symbol}`)
                .then(response => setAdditionalTable1Data(response.data))
                .catch(error => console.error('Error fetching Additional Table 1 data:', error));

            // Update sec for all rows to the newly selected row's symbol
            setAdditionalTable2Data(prevData => prevData.map(row => ({
                ...row,
                sec: selectedRow.symbol,
            })));
        }
    }, [selectedRow]);

    useEffect(() => {
        if (selectedRow && selectedRowIndex >= 0) {
            const totalQty = additionalTable2Data.reduce((sum, row) => sum + Number(row.qty), 0);
            const allocatedQty = Number(auctiondatas[selectedRowIndex]?.total_trade_qty || 0);
            setTotalAllocatedQty(totalQty);
            setTotalBalanceQty(totalQty - allocatedQty);
        }
    }, [additionalTable2Data, selectedRow, selectedRowIndex, auctiondatas]);

    const handleRowSelect = (data, index) => {
        setAdditionalTable2Data(prevData => prevData.map(row => ({
            ...row,
            clientCode: '',
            clientName: '',
            qty: '',
            sec: data.symbol, // Maintain the selected symbol
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
        setAdditionalTable2Data([...additionalTable2Data, { clientCode: '', sec: selectedRow ? selectedRow.symbol : '', qty: '' }]);
    };

    const handleDeleteRow = (index) => {
        setAdditionalTable2Data(additionalTable2Data.filter((_, i) => i !== index));
    };

    const handleFinalSave = () => {
        const selectedRowData = auctiondatas[selectedRowIndex];
        if (!selectedRowData) {
            console.error('No auction row selected.');
            return;
        }

        if (totalBalanceQty === 0) {
            const payload = {
                auctionDetails: additionalTable1Data,
                clientDetails: additionalTable2Data,
               
            };

            console.log('Payload:', payload);
           // http://localhost:3001/api
            axios.post(`${BASE_URL}/api/saveAuctionDetails`, payload)
                .then(response => {
                    console.log('Auction Details saved successfully:', response.data);
                    //alert(response.data.message);

                    // Fetch the updated auction data
                    // 'http://localhost:3001/api/auctiondata'
                    axios.get(`${BASE_URL}/api/auctiondata`)
                        .then(response => {
                            const updatedData = response.data;
                            console.log('Updated data:', updatedData);

                            const validData = updatedData.filter(item => {
                                const allocQty = item.total_alloc_qty ? Number(item.total_alloc_qty) : 0;
                                const tradeQty = Number(item.total_trade_qty) || 0;
                                return tradeQty - allocQty !== 0;
                            });

                            if (validData.length > 0) {
                                setAuctiondata(validData);
                            }
                        })
                        .catch(error => console.error('Error fetching updated auction data:', error));

                    // Reset form and selection states
                    setSelectedRow(null);
                    setSelectedRowIndex(null);
                    setAdditionalTable2Data([{ clientCode: '', sec: '', qty: '' }]);
                })
                .catch(error => {
                    console.error('Error saving data:', error);
                    alert('Error saving data. Please try again.');
                });
        } else {
            alert('Balance Quantity must be zero before saving.');
        }
    };

    const handleClientCdChange = async (index, newClientCd) => {
        console.log("newClientCd", newClientCd);
        if (newClientCd) {
            try {
                // http://localhost:3001/api/client/${newClientCd}
                const response = await axios.get(`${BASE_URL}/api/client/${newClientCd}`);
                const fetchedClientName = response.data.client_name;
                console.log('name---', fetchedClientName)

                const updatedData = [...additionalTable2Data];
                updatedData[index] = { ...updatedData[index], clientCode: newClientCd, clientName: fetchedClientName };
                setAdditionalTable2Data(updatedData);
            } catch (err) {
                console.error('Error fetching client data:', err);
                const updatedData = [...additionalTable2Data];
                updatedData[index] = { ...updatedData[index], clientCode: newClientCd, clientName: '' };
                setAdditionalTable2Data(updatedData);
            }
        } else {
            const updatedData = [...additionalTable2Data];
            updatedData[index] = { ...updatedData[index], clientCode: '', clientName: '' };
            setAdditionalTable2Data(updatedData);
        }
    };

    const columns = [
        {
            name: 'Sec',
            selector: row => row.sec,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.sec}
                    readOnly
                    className="form-control select_color"
                />
            ),
            width: '20%',
        },
        {
            name: 'Client ',
            selector: row => row.client_cd,
            cell: (row, index) => (
                <div className='d-flex' style={{ width: '100%' }}>
                    <input
                        type="text"
                        value={row.clientCode}
                        onChange={e => handleClientCdChange(index, e.target.value)}
                        className="form-control select_color"
                        style={{ width: '30%', marginRight: '2px' }}
                    />
                    <input
                        type="text"
                        value={row.clientName}
                        readOnly
                        className="form-control select_color"
                        style={{ width: '60%' }}
                    />
                </div>
            ),
            width: 'auto',
        },
        {
            name: 'Qty',
            selector: row => row.qty,
            cell: (row, index) => (
                <div className='d-flex '>
                    <input
                        type="number"
                        value={row.qty}
                        onChange={e => handleInputChange(index, 'qty', e.target.value)}
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
            width: '20%',
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
                    <h4 className='search_header '>Auction</h4>
                </div>
                <div className='table_margin mt-2' style={{ lineHeight: '1' }}>
                    <table>
                        <thead>
                            <tr>
                                <th className='p-1 px-1 fw-normal text_size'>Select</th>
                                <th className='p-1 px-1 fw-normal text_size'>Auction Item</th>
                                <th className='p-1 px-1 fw-normal text_size'>Auction Qty</th>
                                <th className='p-1 px-1 fw-normal text_size'>Allocated Qty</th>
                                <th className='p-1 px-1 fw-normal text_size '>Balance Qty</th>
                            </tr>
                        </thead>
                        <tbody className='select_color'>
                            {auctiondatas.map((auctiondata, index) => (
                                <tr
                                    key={index}
                                    style={{
                                        backgroundColor: selectedRowIndex === index ? '#FFD700' : 'transparent',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleRowSelect(auctiondata, index)}
                                >
                                    <td className='p-0 px-1 fw-normal text_size'>
                                        <input
                                            type="radio"
                                            name="rowSelect"
                                            checked={selectedRowIndex === index}
                                            onChange={() => handleRowSelect(auctiondata, index)}
                                            className='mt-1'
                                        />
                                    </td>
                                    <td className='p-0 px-1 fw-normal text_size'>{auctiondata.symbol}</td>
                                    <td className='text_align_table p-0 px-1 fw-normal text_size'>{auctiondata.total_trade_qty}</td>
                                    <td className='text_align_table p-0 px-1 fw-normal text_size'>{selectedRowIndex === index ? totalAllocatedQty : 0}</td>
                                    <td className='text_align_table p-0 px-1 fw-normal text_size'>{selectedRowIndex === index ? totalBalanceQty : 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {selectedRow && (
                    <div className='mt-2'>
                        <div style={{ border: '1px solid #ccc', margin: '5px 5px 0px 5px' }}>
                            <h5 className='text-center label_color'> Auction Details </h5>
                            <div className='table-container'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th className='p-0 px-1 fw-normal text_size '>Rec No</th>
                                            <th className='p-0 px-1 fw-normal text_size '>Client_cd</th>
                                            <th className='p-0 px-1 fw-normal text_size '>Comp</th>
                                            <th className='p-0 px-1 fw-normal text_size'>Exe</th>
                                            <th className='p-0 px-1 fw-normal text_size'>Branch</th>
                                            <th className='p-0 px-1 fw-normal text_size'>Trade No</th>
                                            <th className='p-0 px-1 fw-normal text_size'>Order No</th>
                                            <th className='p-0 px-1 fw-normal text_size'>Date</th>
                                            <th className='p-0 px-1 fw-normal text_size'>Rate</th>
                                            <th className='p-0 px-1 fw-normal text_size'>Qty</th>
                                            <th className='p-0 px-1 fw-normal text_size'>Inst Type</th>
                                            <th className='p-0 px-1 fw-normal text_size'>Sec</th>
                                            <th className='p-0 px-1 fw-normal text_size'>Auc</th>
                                            <th className='p-0 px-1 fw-normal text_size'>Series</th>
                                            <th className='p-0 px-1 fw-normal text_size'>Book Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className='select_color'>
                                        {additionalTable1Data.map((row) => (
                                            <tr key={row.recNo}>
                                                <td className='p-0 px-1 fw-normal text_size'>{row.recNo}</td>
                                                <td className='p-0 px-1 fw-normal text_size'>{row.client_id}</td>
                                                <td className='p-0 px-1 fw-normal text_size'>{row.company}</td>
                                                <td className='p-0 px-1 fw-normal text_size'>{row.exchange}</td>
                                                <td className='p-0 px-1 fw-normal text_size'>{row.branch}</td>
                                                <td className='p-0 px-1 fw-normal text_size'>{row.unq_trade_id}</td>
                                                <td className='p-0 px-1 fw-normal text_size'>{row.ord_ref_no}</td>
                                                <td className='p-0 px-1 fw-normal text_size'>{row.trade_date}</td>
                                                <td className='p-0 px-1 fw-normal text_size text_align_table'>{parseFloat(row.price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                                                <td className='p-0 px-1 fw-normal text_size text_align_table'>{row.trade_qty}</td>
                                                <td className='p-0 px-1 fw-normal text_size text_align_table'>{row.inst_type}</td>
                                                <td className='p-0 px-1 fw-normal text_size'>{row.symbol}</td>
                                                <td className='p-0 px-1 fw-normal text_size'>{row.auc}</td>
                                                <td className='p-0 px-1 fw-normal text_size'>{row.security_series}</td>
                                                <td className='p-0 px-1 fw-normal text_size'>{row.bookType}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div style={{ border: '1px solid #ccc', margin: '5px 5px 0px 5px' }}>
                            <h5 className='text-center label_color'>Allocation Details</h5>
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
                )}
                <button className="save_btn input_margin" onClick={handleFinalSave}>Save</button>
                <button className='close_btn input_margin' onClick={() => onCloseClick(null)}>Close</button>
            </div>
        </div>
    );
}

export default AuctionTable;
