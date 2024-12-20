import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Container, Form, Row, Col, TabContainer, CardGroup } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Ledger_Report.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import ClientSearchPop from './ClientSearchPop'
// import ScripSearchPop from './scripSearch.js'
import axios from 'axios';
import { BASE_URL } from "../constants";
// import Select from 'react-select';
import { Autocomplete, MenuItem, Select, Checkbox, ListItemText, InputLabel, FormControl } from '@mui/material';

import { format, parseISO } from 'date-fns'
//import { Heading } from '@chakra-ui/react';
//import { useGroupBy } from 'react-table';
//import Select from 'react-select';

// for reference
// npm install @mui/material @emotion/react @emotion/styled

//testing searchable textbox
// import { FaSearch } from "react-icons/fa";
// import "./SearchBar.css";

export const Ledger_Report = ({ setResults }) => {

    const [transTypes, setTransTypes] = useState([{trans_type: `'Payment'`, trans_name: 'PAYMENT'}, 
                                                  {trans_type: `'Receipt'`, trans_name: 'RECEIPT'},
                                                  {trans_type: `'SETTLEMENT'`, trans_name: 'SETTLEMENT'},
                                                  {trans_type: `'Cr Note'`, trans_name: 'CREDIT NOTE'},
                                                  {trans_type: `'Dr Note'`, trans_name: 'DEBIT NOTE'},
                                                  {trans_type: `'JV'`, trans_name: 'JV'},
                                                  {trans_type: `'CONTRA'`, trans_name: 'CONTRA'}]);

    const [showInputs, setShowInputs] = useState(false);
    const [data, setData] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    //// multi select drop down

    const [items, setItems] = useState([]);
    const [selectedBookTypes, setSelectedBookTypes] = useState([]);
    const [selectAllBookTypes, setSelectAllBookTypes] = useState(false);

    const [selectedTranTypes, setSelectedTranTypes] = useState([]);
    const [selectAllTranTypes, setSelectAllTranTypes] = useState(false);

    const [error, setError] = useState("");

    const [activityCode, setActivityCode] = useState('');
    const [activityCodes, setActivityCodes] = useState([]);
    const [exchange, setExchange] = useState('');
    const [exchanges, setExchanges] = useState([]);
    const [segment, setSegment] = useState('');
    const [segments, setSegments] = useState([]);
    const [clientCode, setClientCode] = useState();
    const [clientName, setClientName] = useState();
    const [singleLedger, setSingleLedger] = useState(false);
    
    const handleSelectBookType = (event) => {
        try {
            const value = event.target.value;
            setSelectedBookTypes(value);

          //  console.log('value.length === items.length ', value.length, items.length);

            // If "Select All" is being selected/unselected, update accordingly
            if (value.length === items.length) {
                setSelectAllBookTypes(true);
            } else {
                setSelectAllBookTypes(false);
            }
        }
        catch (err) {
            console.error('handleSelectBookType => ', err);
        }
    };

    const handleSelectAllBookTypes = () => {
        if (selectAllBookTypes) {
          setSelectedBookTypes([]);
        } else {
          setSelectedBookTypes(items.map((item) => item.book_type)); // Assuming each item has a unique 'id' field
        }
        setSelectAllBookTypes(!selectAllBookTypes);
      };

      ///// trans types

      const handleSelectTranType = (event) => {
        try {
            const value = event.target.value;
            setSelectedTranTypes(value);

          //  console.log('value.length === items.length ', value.length, items.length);

            // If "Select All" is being selected/unselected, update accordingly
            if (value.length === transTypes.length) {
                setSelectAllTranTypes(true);
            } else {
                setSelectAllTranTypes(false);
            }
        }
        catch (err) {
            console.error('handleSelectTranType => ', err);
        }
    };

    const handleSelectAllTransTypes = () => {
        if (selectAllTranTypes) {
            setSelectedTranTypes([]);
        } else {
            setSelectedTranTypes(setTransTypes.map((transTypes) => transTypes.trans_type)); // Assuming each item has a unique 'id' field
        }
        setSelectedTranTypes(!selectAllTranTypes);
      };

    //// multi select drop down

    const downloadCSV = (data, tableTitle) => {
        let csv = convertToCSV(data);
        // table title at the top
        if (tableTitle) {
            csv = tableTitle + '\n\n' + csv; // title followed by two new lines for spacing
        }
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Ledger_Report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const convertToCSV = (data) => {
        const header = Object.keys(data[0]).join(',') + '\n';
        const rows = data
            .map((row) => Object.values(row).join(','))
            .join('\n');
        return header + rows;
    };

    useEffect(() => {
       axios.get(`${BASE_URL}/api/bookType_multi_ddl`)
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
        setSelectedBookTypes(items.map((item) => item.book_type));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_activity_master`)
            .then(response => setActivityCodes(response.data))
            .catch(error => console.error('Error fetching activity:', error));
    }, []);

     
    const handleActivityChange = async (p_activity) => {
        try {

            setActivityCode(p_activity);

            if (p_activity) {
                setExchanges([]);
                setSegments([]);
                await axios.get(`${BASE_URL}/api/ddl_activitywise_exchange`, {params: {p_activity_cd: p_activity} })
                    .then(response => setExchanges(response.data))
                    .catch(error => console.error('Error fetching activity:', error));
            }
            else {
                setExchanges([]);
                setSegments([]);
            }

        }
        catch (error) {
            console.error("Error in Activity Selection! ", error);
        }
    }

    const handleClientCodeChange = async (p_client_cd) => {
        try {
            
            setData([]);
            setClientName('');
            setSingleLedger(false);

            setClientCode(p_client_cd);

            if (p_client_cd) {
              const response = await axios.get(`${BASE_URL}/api/Get_Account_Name`, {params: {p_Acct_Code: p_client_cd} })
                .then(response => setClientName(response.data[0].account_name), setSingleLedger(true))
               .catch(error => console.error('Error client name fetching:', error));
              //console.log('response ', response.data[0].account_name);
            }

        }
        catch (error) {
            console.error("Error in handleClientCodeChange ! ", error);
        }
    }

    const handleExchangeChange = async (p_exc_code) => {
        
        try {

            setExchange(p_exc_code);

            if (p_exc_code) {
                setSegments([]);
                await axios.get(`${BASE_URL}/api/ddl_exchangewise_segment`, {params: {p_Exc_Code: p_exc_code} })
                    .then(response => setSegments(response.data))
                    .catch(error => console.error('Error fetching segment:', error));
            }
            else {
                setSegments([]);
            }

        }
        catch (error) {
            console.error("Error in Exchange Selection! ", error);
        }

    }

    const run_report = async () => {
       // console.log('Inside fetch data-->>', asonDate);
        try {

            // const param = {
            //     selectedBookTypes,
            //     selectedTranTypes,
            //     fromDate,
            //     toDate
            // };
            const response = await axios.get(`${BASE_URL}/api/ledger_report`, 
                {params : {p_book_types: selectedBookTypes, p_trans_type : selectedTranTypes, 
                           p_from_date: fromDate, p_to_date: toDate, p_acct_cd:clientCode, p_activity_cd: activityCode,
                            p_exc_cd: exchange, p_segment: segment} });
            setData(response.data);
            setShowInputs(true);
        } catch (err) {
            console.error(err);
        }
    };

    //// testing searchable text box

    // const [input, setInput] = useState("");

    // const fetchData = async (value) => {
    //     axios.get(`${BASE_URL}/api/ddl_activity_master`)
    //     .then((response) => response.json())
    //     .then((json) => {
    //       const results = json.filter((user) => {
    //         return (
    //           value &&
    //           user &&
    //           user.name &&
    //           user.name.toLowerCase().includes(value)
    //         );
    //       });
    //       setResults(results);
    //     });
    // };
  
    // const handleChange = (value) => {
    //   setInput(value);
    //   fetchData(value);
    // };
    //// testing

    const exportToPDFAll = () => {
        const doc = new jsPDF('p', 'mm', [270, 297]); // Custom width: 250mm, height: 297mm (A4 height)

        doc.setFontSize(16);
        // Add some text to the PDF
        doc.text(`Sodhani Securities Ltd.`, 20, 5);
        doc.setFontSize(12);
        doc.text(`Ledger for the period : ${fromDate} - ${toDate}`, 20, 10);

        if (singleLedger)
        {
            doc.text(`Ledger Name : ${clientName}`, 20, 15);
        }

        doc.setFont('helvetica', 'normal');

        // Adding table data from the API response

        if (!singleLedger)  /// if all Ledger is selected
        {
            doc.autoTable({
                startY: 20,
                head: [[
                    { content: 'Ledger', styles: { halign: 'left' } },
                    { content: 'Trans Date', styles: { halign: 'left' } },
                    { content: 'Vchr No.', styles: { halign: 'left' } },
                    { content: 'Book Type', styles: { halign: 'left' } },
                    { content: 'Narration', styles: { halign: 'left' } },
                    { content: 'Debit (Rs.)', styles: { halign: 'right' } },
                    { content: 'Credit (Rs.)', styles: { halign: 'right' } }

                ]],
                body: data.map(item => [
                    item.account_name,
                    item.trans_date,
                    item.voucher_no,
                    item.book_type,
                    item.narration,
                    item.dr_amt,
                    item.cr_amt
                    // formatCurrency(item.dr_amt), 
                    // formatCurrency(item.cr_amt)
                ]),
                columnStyles: {
                    // Adjust the widths of the columns
                    0: { cellWidth: 40 }, // 'Ledger' column
                    1: { cellWidth: 30 }, // 'Trans Date' column
                    2: { cellWidth: 30 }, // 'Vchr No.' column
                    3: { cellWidth: 30 }, // 'Book Type' column
                    4: { cellWidth: 60 }, // 'Narration' column
                    5: { cellWidth: 30, halign: 'right' }, // 'Debit (Rs.)' column
                    6: { cellWidth: 30, halign: 'right' }, // 'Credit (Rs.)' column
                },
                styles: {
                    font: 'verdana',
                    fontSize: 10, // Adjust font size
                    cellPadding: 2, // Adjust padding inside the cells
                    alternateRow: '{ fillColor: [255, 255, 255] }', // No color for alternate rows
                },
            });
            doc.save(`Ledger_${fromDate}-${toDate}.pdf`);
        }

        if (singleLedger)  /// if Single Ledger is selected
        {
            doc.autoTable({
                startY: 20,
                head: [[
                    { content: 'Trans Date', styles: { halign: 'left' } },
                    { content: 'Vchr No.', styles: { halign: 'left' } },
                    { content: 'Book Type', styles: { halign: 'left' } },
                    { content: 'Narration', styles: { halign: 'left' } },
                    { content: 'Debit (Rs.)', styles: { halign: 'right' } },
                    { content: 'Credit (Rs.)', styles: { halign: 'right' } }

                ]],
                body: data.map(item => [
                    item.trans_date,
                    item.voucher_no,
                    item.book_type,
                    item.narration,
                    item.dr_amt,
                    item.cr_amt
                    // formatCurrency(item.dr_amt), 
                    // formatCurrency(item.cr_amt)
                ]),
                columnStyles: {
                    // Adjust the widths of the columns
                    0: { cellWidth: 30 }, // 'Trans Date' column
                    1: { cellWidth: 30 }, // 'Vchr No.' column
                    2: { cellWidth: 30 }, // 'Book Type' column
                    3: { cellWidth: 100 }, // 'Narration' column
                    4: { cellWidth: 30, halign: 'right' }, // 'Debit (Rs.)' column
                    5: { cellWidth: 30, halign: 'right' }, // 'Credit (Rs.)' column
                },
                styles: {
                    font: 'verdana',
                    fontSize: 10, // Adjust font size
                    cellPadding: 2, // Adjust padding inside the cells
                    alternateRow: '{ fillColor: [255, 255, 255] }', // No color for alternate rows
                },
            });
            doc.save(`Ledger_${clientCode}-${fromDate}-${toDate}.pdf`);
        }
           
    };

    function formatCurrency(amount) {
        const numberFormat = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            currencyDisplay: 'symbol',
        });
        return numberFormat.format(amount);
    }

    const customStyles = {
        
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: 'purple',
                backgroundColor: 'rgb(224, 230, 245)',
                position: 'sticky',
                top: 0,
                zIndex: 1,
            },
        },
        headCells: {
            style: {
                // '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: 'black',
                // },
                '&:first-of-type': {
                    borderLeftStyle: 'solid',
                    borderLeftWidth: '1px',
                    borderLeftColor: 'black',
                },
            },
        },
        cells: {
            style: {
                // '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: 'black',
                // },
                '&:first-of-type': {
                    borderLeftStyle: 'solid',
                    borderLeftWidth: '1px',
                    borderLeftColor: 'black',
                },
                // '&:last-child:nth-last-of-type': {
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
                borderBottomColor: 'black',
                // }
            },
        },
    };

    const columns = [
        {
            name: 'Ledger Name',
            selector: row => row.account_name,
            //useGroupBy: true,
            sortable: false,
            minWidth: '300px',
            // maxWidth: '500px'
            left: true, // Align text to the right,
            cell: (row) => <div style={{ textAlign: 'left', fontWeight: 'bold' }}>{row.account_name}  </div>,
        },
        
        {
            name: 'Trans Date',
            selector: row => row.trans_date,
            sortable: false,
            minWidth: '50px',
            left: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'left' }}>{row.trans_date}</div>,
        },
        {
            name: 'Vchr No.',
            selector: row => row.voucher_no,
            sortable: false,
            maxWidth: '60px',
            // maxWidth: '500px'
            left: true, // Align text to the right,
            cell: (row) => <div style={{ textAlign: 'left' }}>{row.voucher_no}</div>,
        },

        {
            name: 'Book Type',
            selector: row => row.book_type,
            sortable: false,
            minWidth: '80px',
            // maxWidth: '500px'
            left: true, // Align text to the right,
            cell: (row) => <div style={{ textAlign: 'left' }}>{row.book_type}</div>,
        },


        {
            name: 'Narration',
            selector: row => row.narration,
            sortable: false,
            minWidth: '300px',
            // maxWidth: '500px'
            left: true, // Align text to the right,
            //cell: (row) => <div style={{ textAlign: 'left' }}>{row.narration}</div>,

            cell: (row) => (
                <div
                    style={{
                        textAlign: 'left',
                        fontWeight: row.narration === 'Closing Balance' ? 'bold' : 'normal',
                    }}
                >
                    {row.narration}
                </div>
            ),
        },

        {
            name: 'Debit (Rs.)',
            selector: row => row.dr_amt,
            sortable: false,
            minWidth: '10px',
            // maxWidth: '90px',
            right: true, // Align text to the right,
            cell: (row) => 
            <div style={{ 
                   textAlign: 'right', 
                   fontWeight: row.narration === 'Closing Balance' ? 'bold' : 'normal', 
                   fontSize: row.narration === 'Closing Balance' ? '14px' : '13px',  }}>
                {row.dr_amt === null ? '' : parseFloat(row.dr_amt).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
        },

        {
            name: 'Credit (Rs.)',
            selector: row => row.cr_amt,
            sortable: false,
            minWidth: '10px',
            // maxWidth: '90px', 
            right: true, // Align text to the right,
            cell: (row) => 
            <div style={{ 
                 textAlign: 'right',
                  fontWeight: row.narration === 'Closing Balance' ? 'bold' : 'normal',
                  fontSize: row.narration === 'Closing Balance' ? '14px' : '13px',  }}>
                {row.cr_amt === null ? '' : parseFloat(row.cr_amt).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,

            // cell: (row) => (
            //     <div
            //         style={{
            //             textAlign: 'left',
            //             fontWeight: row.narration === 'Closing Balance' ? 'bold' : 'normal', 
            //         }}
            //     >
            //         {row.cr_amt}
            //     </div>
            // ),
        }
    ];

    const columns_single = [

        {
            name: 'Trans Date',
            selector: row => row.trans_date,
            sortable: true,
            minWidth: '50px',
            left: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'left' }}>{row.trans_date}</div>,
        },
        {
            name: 'Vchr No.',
            selector: row => row.voucher_no,
            sortable: true,
            maxWidth: '60px',
            // maxWidth: '500px'
            left: true, // Align text to the right,
            cell: (row) => <div style={{ textAlign: 'left' }}>{row.voucher_no}</div>,
        },

        {
            name: 'Book Type',
            selector: row => row.book_type,
            sortable: true,
            minWidth: '80px',
            // maxWidth: '500px'
            left: true, // Align text to the right,
            cell: (row) => <div style={{ textAlign: 'left' }}>{row.book_type}</div>,
        },


        {
            name: 'Narration',
            selector: row => row.narration,
            sortable: true,
            minWidth: '500px',
            // maxWidth: '500px'
            left: true, // Align text to the right,
            //cell: (row) => <div style={{ textAlign: 'left' }}>{row.narration}</div>,

            cell: (row) => (
                <div
                    style={{
                        textAlign: 'left',
                        fontWeight: row.narration === 'Closing Balance' ? 'bold' : 'normal',
                    }}
                >
                    {row.narration}
                </div>
            ),
        },

        {
            name: 'Debit (Rs.)',
            selector: row => row.dr_amt,
            sortable: true,
            minWidth: '10px',
            // maxWidth: '90px',
            right: true, // Align text to the right,
            cell: (row) => 
            <div style={{ 
                   textAlign: 'right', 
                   fontWeight: row.narration === 'Closing Balance' ? 'bold' : 'normal', 
                   fontSize: row.narration === 'Closing Balance' ? '14px' : '13px',  }}>
                {row.dr_amt === null ? '' : parseFloat(row.dr_amt).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
        },

        {
            name: 'Credit (Rs.)',
            selector: row => row.cr_amt,
            sortable: true,
            minWidth: '10px',
            // maxWidth: '90px',
            right: true, // Align text to the right,
            cell: (row) => 
            <div style={{ 
                 textAlign: 'right',
                  fontWeight: row.narration === 'Closing Balance' ? 'bold' : 'normal',
                  fontSize: row.narration === 'Closing Balance' ? '14px' : '13px',  }}>
                {row.cr_amt === null ? '' : parseFloat(row.cr_amt).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,

            // cell: (row) => (
            //     <div
            //         style={{
            //             textAlign: 'left',
            //             fontWeight: row.narration === 'Closing Balance' ? 'bold' : 'normal', 
            //         }}
            //     >
            //         {row.cr_amt}
            //     </div>
            // ),
        }
    ];


    return (
        <Container className="align-items-center mt-3">
 
            {/* ************  Book Types ************* */}

            <Row>

                <Col>
                    <FormControl fullWidth error={Boolean(error)}>
                    {/* <FormControl sx={{ minWidth: 400 }} error={Boolean(error)}> */}
                        <InputLabel id="select-multiple-checkbox-label">Select Book Types</InputLabel>
                        <Select
                            labelId="select-multiple-checkbox-label"
                            id="select-multiple-checkbox"
                            multiple
                            value={selectedBookTypes}
                            onChange={handleSelectBookType}
                            renderValue={(selected) => selected.join(", ")}
                            MenuProps={{
                                PaperProps: {
                                    style: {maxHeight: 400, width: 250,}, }, }} >
                         
                            <MenuItem value="select-all" onClick={handleSelectAllBookTypes}>
                                <Checkbox checked={selectAllBookTypes} />
                                <ListItemText primary="Select All" />
                            </MenuItem>
                        
                            {/* Map over the items fetched from your database/API */}
                            {items.map((item) => (
                                <MenuItem key={item.book_type} value={item.book_type}>
                                    <Checkbox checked={selectedBookTypes.indexOf(item.book_type) > -1} />
                                    <ListItemText primary={item.description} /> {/* Assuming 'name' is the item text */}
                                </MenuItem>
                            ))}
                        </Select>
                        {/* {error && <FormHelperText>{error}</FormHelperText>} */}
                    </FormControl>

                </Col>

            </Row>
 
            {/* ************  Transaction Types ************* */}
            &nbsp;
            <Row className="mb-3">
                <Col xs={8} md={6}>
                    <FormControl fullWidth >
                        <InputLabel id="select-multiple-checkbox-label">Select Transaction Types</InputLabel>
                        <Select labelId="select-multiple-checkbox-label"
                            id="select-multiple-checkbox"
                            multiple
                            value={selectedTranTypes}
                            onChange={handleSelectTranType}
                            renderValue={(selected) => selected.join(", ")}
                            MenuProps={{
                                PaperProps: { style: {maxHeight: 400, width: 250,},},
                            }}
                        >
                            <MenuItem value="select-all" onClick={handleSelectAllTransTypes}>
                                <Checkbox checked={selectAllTranTypes} />
                                <ListItemText primary="Select All" />
                            </MenuItem>
                            {transTypes.map((trantype) => (
                                <MenuItem key={trantype.trans_type} value={trantype.trans_type}>
                                    <Checkbox checked={selectedTranTypes.indexOf(trantype.trans_type) > -1} />
                                    <ListItemText primary={trantype.trans_name} /> 
                                </MenuItem>
                            ))}
                        </Select>
                        {/* {error && <FormHelperText>{error}</FormHelperText>} */}
                    </FormControl>

                </Col>

                <Col xs={4} md={2}>
                    <div>
                        <Form.Control type="text" className='inputDate_width'
                            name="clientcd" value={clientCode} placeholder='Client Code'
                            onChange={(e) => setClientCode(e.target.value)}
                            onBlur={(e) => handleClientCodeChange (e.target.value)} size="sm" />
                    </div>
                </Col>
                <Col xs={4} md={4}>
                    <div>
                        <Form.Control type="text" className='inputDate_width' readOnly
                            name="clientname" value={clientName} placeholder='Client Name' size="sm" />
                    </div>

                </Col>
{/* TESTING */}
                {/* <Col>
                    <div className="input-wrapper">
                        <FaSearch id="search-icon" />
                        <input
                            placeholder="Search Account..."
                            value={input}
                            onChange={(e) => handleChange(e.target.value)}
                        />
                    </div>
                </Col> */}
{/* TESTING */}
            </Row>

            <Row className="mb-3">
                <Col className='' xs={12} md={4}>
                    <select id="activityCode" className="form-select"
                       name='activityCode' value={activityCode}
                       onChange={(e) => handleActivityChange(e.target.value)}>
                          <option value="">Select Activity Code</option>
                                {activityCodes.map(Act_Code => (
                          <option key={Act_Code.activity_cd} value={Act_Code.activity_cd}>{Act_Code.act_name}</option>
                           ))}
                    </select>
                </Col>
                <Col className='' xs={12} md={4}>
                    <select id="exchange" className="form-select size_input_cashbank" name='exchange' value={exchange}
                        onChange={(e) => handleExchangeChange(e.target.value)}>
                        <option value="">Select Exchange</option>
                        {exchanges.map(Exc => (
                            <option key={Exc.exc_cd} value={Exc.exc_cd}>{Exc.exc_name}</option>
                        ))}
                    </select>
                </Col>
                <Col className='' xs={12} md={4}>
                    <select id="segment" className="form-select size_input_cashbank" style={{ marginLeft: '0px' }}
                        name='segment' value={segment} onChange={(e) => setSegment(e.target.value)}>
                        <option value="">Select Segment</option>
                        {segments.map(Seg_Code => (
                            <option key={Seg_Code.seg_code} value={Seg_Code.seg_code}>{Seg_Code.seg_name}</option>
                        ))}
                    </select>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col className='' xs={12} md={3}>
                    <div className="d-flex flex-column flex-md-row align-items-md-center">From Date : &nbsp;
                        <div>
                            <Form.Control type="date" className='inputDate_width'
                                name="fromDate" value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)} size="sm"/>
                        </div>

                    </div>
                </Col>
                <Col className='' xs={12} md={3}>
                    <div className="d-flex flex-column flex-md-row align-items-md-center">To Date : &nbsp;
                        <div>
                            <Form.Control type="date" className='inputDate_width'
                                name="toDate" value={toDate} onChange={(e) => setToDate(e.target.value)} size="sm" />
                        </div>

                    </div>
                </Col>

                <Col className='pl-3' xs={12} md={6}>
                    <div className="d-flex justify-content-end align-items-end mb-3">

                        {/* <button className='btn btn-secondary'
                            onClick={() =>
                                downloadCSV(data, `Day_Book`)}
                        >Download CSV</button> &nbsp; */}

                        <Button onClick={() => downloadCSV(data, `Ledger_Report`)}
                             style={{ marginLeft: '10px', width: "150px" }} className="">Download CSV </Button>

                        <Button onClick={exportToPDFAll} style={{ marginLeft: '10px', width: "150px" }} className="">
                            Download PDF
                        </Button> 
                        <Button variant="primary" onClick={run_report}
                            className="mr-2 ms-2 btn-success"
                            style={{ width: "150px" }}>Run Report </Button>
                    </div>
                </Col>
            </Row>

            <div>
            {singleLedger ? (
                <DataTable 
                    id='data-table'
                    columns={columns_single}
                    data={data}
                    customStyles={customStyles}
                    highlightOnHover={true}
                    pagination={true}
                    responsive
                    dense
                    overflowY
                    title={data.length > 0 ? `Ledger Name ${clientName} Ledger From Date : ${fromDate}  To Date : ${toDate}` : '' }
                />
            ) :
             (<DataTable 
                id='data-table'
                columns={columns}
                data={data}
                customStyles={customStyles}
                highlightOnHover={true}
                pagination={true}
                responsive
                dense
                overflowY
                title={data.length > 0 ? `Ledger From Date : ${fromDate}  To Date : ${toDate}` : '' }
               />)}
            </div>

        </Container>
    );
}

export default Ledger_Report;
