import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Container, Form, Row, Col, TabContainer } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Day_Book.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import ClientSearchPop from './ClientSearchPop'
// import ScripSearchPop from './scripSearch.js'
import axios from 'axios';
import { BASE_URL } from "../constants";
// import Select from 'react-select';
import { Autocomplete, MenuItem, Select, Checkbox, ListItemText, InputLabel, FormControl } from '@mui/material';

import { format, parseISO } from 'date-fns'
import { Heading } from '@chakra-ui/react';
//import Select from 'react-select';

// for reference
// npm install @mui/material @emotion/react @emotion/styled

const Trial_Balance = () => {

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

      useEffect( () => {
          axios.get(`${BASE_URL}/api/bookType_multi_ddl`)
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
            setSelectedBookTypes(items.map((item) => item.book_type)); 
    }, []);


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
        link.setAttribute('download', 'Day_Book.csv');
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

    const fetchData = async () => {
       // console.log('Inside fetch data-->>', asonDate);
        try {

            const param = {
                selectedBookTypes,
                selectedTranTypes,
                fromDate,
                toDate
                // p_book_types: selectedBookTypes,
                // p_trans_type : selectedTranTypes,
                // p_from_date: fromDate,
                // p_to_date: toDate
            };
            const response = await axios.get(`${BASE_URL}/api/day_book`, 
                {params : {p_book_types: selectedBookTypes, p_trans_type : selectedTranTypes, p_from_date: fromDate, p_to_date: toDate} });
            setData(response.data);
            setShowInputs(true);
        } catch (err) {
            console.error(err);
        }
    };

    const customStyles = {
        
        // header: {
        //     style: {
        //         minHeight: '56px',
        //     },
        // },

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
            name: 'Trans Date',
            selector: row => row.trans_date,
            sortable: true,
            minWidth: '80px',
            left: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'left' }}>{row.trans_date}</div>,
        },
        {
            name: 'Voucher No.',
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
            name: 'Account Name',
            selector: row => row.account_name,
            sortable: true,
            minWidth: '150px',
            // maxWidth: '500px'
            left: true, // Align text to the right,
            cell: (row) => <div style={{ textAlign: 'left' }}>{row.account_name}</div>,
        },

        {
            name: 'Narration',
            selector: row => row.narration,
            sortable: true,
            minWidth: '150px',
            // maxWidth: '500px'
            left: true, // Align text to the right,
            cell: (row) => <div style={{ textAlign: 'left' }}>{row.narration}</div>,
        },

        {
            name: 'Debit (Rs.)',
            selector: row => row.dr_amt,
            sortable: true,
            minWidth: '10px',
            // maxWidth: '90px',
            right: true, // Align text to the right,
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {/* {row.open_bal_cr} */}
                {parseFloat(row.dr_amt).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
        },

        {
            name: 'Credit (Rs.)',
            selector: row => row.cr_amt,
            sortable: true,
            minWidth: '10px',
            // maxWidth: '90px',
            right: true, // Align text to the right,
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {/* {row.open_bal_cr} */}
                {parseFloat(row.cr_amt).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
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
                                    style: {maxHeight: 400, width: 250,}, }, }}
                        >
                         
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
                <Col>
                    <FormControl fullWidth >
                        <InputLabel id="select-multiple-checkbox-label">Select Transaction Types</InputLabel>
                        <Select labelId="select-multiple-checkbox-label"
                            id="select-multiple-checkbox"
                            multiple
                            value={selectedTranTypes}
                            onChange={handleSelectTranType}
                            renderValue={(selected) => selected.join(", ")}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 400,
                                        width: 250,
                                    },
                                },
                            }}
                        >
                            <MenuItem value="select-all" onClick={handleSelectAllTransTypes}>
                                <Checkbox checked={selectAllTranTypes} />
                                <ListItemText primary="Select All" />
                            </MenuItem>

                            {/* Map over the items fetched from your database/API */}
                            {transTypes.map((trantype) => (
                                <MenuItem key={trantype.trans_type} value={trantype.trans_type}>
                                    <Checkbox checked={selectedTranTypes.indexOf(trantype.trans_type) > -1} />
                                    <ListItemText primary={trantype.trans_name} /> {/* Assuming 'name' is the item text */}
                                </MenuItem>
                            ))}
                        </Select>
                        {/* {error && <FormHelperText>{error}</FormHelperText>} */}
                    </FormControl>

                </Col>

            </Row>

            <Row className="mb-3">
                <Col className='' xs={12} md={4}>
                    <div className="d-flex flex-column flex-md-row align-items-md-center">From Date : &nbsp;
                        <div>
                            <Form.Control
                                type="date"
                                className='inputDate_width'
                                name="fromDate"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                size="sm"
                            />
                        </div>

                    </div>
                </Col>
                <Col className='' xs={12} md={4}>
                    <div className="d-flex flex-column flex-md-row align-items-md-center">To Date : &nbsp;
                        <div>
                            <Form.Control
                                type="date"
                                className='inputDate_width'
                                name="toDate"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                size="sm"
                            />
                        </div>

                    </div>
                </Col>

                <Col className='pl-3' xs={12} md={4}>
                    <div className="d-flex justify-content-end align-items-end mb-3">

                        {/* <button className='btn btn-secondary'
                            onClick={() =>
                                downloadCSV(data, `Day_Book`)}
                        >Download CSV</button> &nbsp; */}

                        <Button onClick={() => downloadCSV(data, `Day_Book`)}
                             style={{ marginLeft: '10px', width: "150px" }} className="">Download CSV </Button>

                        {/* <Button onClick={exportToPDFAll} style={{ marginLeft: '10px', width: "150px" }} className="">
                            Export To Pdf
                        </Button> */}
                        <Button variant="primary" onClick={fetchData}
                            className="mr-2 ms-2 btn-success"
                            style={{ width: "150px" }}>Run Report </Button>
                    </div>
                </Col>
            </Row>

            <div>
                <DataTable 
                    id='data-table'
                    columns={columns}
                    data={data}
                    customStyles={customStyles}
                    highlightOnHover={true}
                    pagination={true}
                    responsive
                    dense
                    overflowY
                    title={data.length > 0 ? `Day Book : ` : ''}
                />
            </div>

        </Container>
    );
}

export default Trial_Balance;
