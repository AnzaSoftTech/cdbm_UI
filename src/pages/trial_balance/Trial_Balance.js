import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Container, Form, Row, Col, TabContainer } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Trial_Balance.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import ClientSearchPop from './ClientSearchPop'
// import ScripSearchPop from './scripSearch.js'
import axios from 'axios';
import { BASE_URL } from "../constants";
// import Select from 'react-select';
//import { MenuItem, Select, Checkbox, ListItemText, InputLabel, FormControl } from '@mui/material';
import { format, parseISO } from 'date-fns'
import { Heading } from '@chakra-ui/react';
//import Select from 'react-select';

// for reference
// npm install @mui/material @emotion/react @emotion/styled

const Trial_Balance = () => {
    // const [branches, setBranches] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showScripPopup, setshowScripPopup] = useState(false);

    const [Setletypes, setSetleTypes] = useState([]);
    // const [ReportType, setReportType] = useState('');
    const [scripcd, setScripCd] = useState('');
    const [sec_name, setScripname] = useState('');
    const [clientcd, setClientCd] = useState('');
    const [clientname, setClientName] = useState('');
    //const [showTable, setShowTable] = useState(false);// State variable to control table visibility
    const [showInputs, setShowInputs] = useState(false);
    const [setlStartDate, setSetlStartDate] = useState('');
    const [setleEndDate, setSetleEndDate] = useState('');
    const [payInDate, setPayInDate] = useState('');
    const [summarydata, setSummaryData] = useState([]);
    const [pending, setPending] = useState(false);
    const [data, setData] = useState([]);

    const [asonDate, setAsOnDate] = useState('');

    const [settleNo, setSettleNo] = useState('');

    const [filters, setFilters] = useState({
        clientcd: '',
        scripcd: '',
        fromdt: '',
        todt: '',
        branchcd: '',
        Settle_tp: '',
        SetleNo: '',
    });

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

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
        link.setAttribute('download', 'Trial_Balance_asOnDate_'
            + asonDate + '.csv');
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

    // const handleRowSelect = (name,code) => {
    //     setClientName(name);
    //     setClientCd(code)
    //     setShowPopup(false);
    // };

    const handleRowSelect = (name, code, e) => {
        setClientName(name);
        setClientCd(code)

        // Update filters object with scripname and scripCd
        const updatedFilters = {
            ...filters,

            clientcd: code
        };

        if (e && e.target) {
            updatedFilters['clientcd'] = e.target.code;

        }

        setFilters(updatedFilters);
        setShowPopup(false);
    };

    const handleRowScripSelect = (name, code, e) => {
        const trimmedCode = code ? code.trim() : '';
        setScripname(name);
        setScripCd(trimmedCode);


        const updatedFilters = {
            ...filters,
            scripcd: trimmedCode
        };

        if (e && e.target) {
            updatedFilters['scripcd'] = e.target.value.trim();

        }

        setFilters(updatedFilters);
        setshowScripPopup(false);
    };

    const fetchData = async () => {
        console.log('Inside fetch data-->>', asonDate);
        try {
            const response = await axios.get(`${BASE_URL}/api/trial_balance?p_AsOnDate=` + asonDate);
            setData(response.data);
            //alert(JSON.stringify(response.data));
            setSettleNo(response.data[0].delv_settle_no);
            //console.log('response.data ---> ', response.data[0].delv_settle_no);
            setShowInputs(true);
        } catch (err) {
            console.error(err);
        }
    };

    const exportToPDFAll = () => {
        const doc = new jsPDF();

        // Add some text to the PDF
        doc.text(`Trial Balance as on date: ${asonDate}`, 20, 10);

        // Adding table data from the API response
        doc.autoTable({
            startY: 20,
            head: [['Particular', 'Open Bal Dr', 'Open Bal Cr', 'Tran Amt Dr',
                'Tran Amt Cr', 'Closing Bal Dr', 'Closing Bal Cr']],
            body: data.map(item => [item.particular, item.open_bal_dr, item.open_bal_cr,
            item.tran_dr, item.amt_cr, item.closing_dr, item.closing_cr])
        });
        doc.save(`Trial_Balance_asOnDate_${asonDate}.pdf`);
    };

    const handleClientCdChange = async (e) => {
        const newClientCd = e.target.value;
        setClientCd(newClientCd);
        filters.clientcd = newClientCd;
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });

        if (newClientCd) {
            try {
                // `http://localhost:3001/api/client/${newClientCd}`
                const response = await axios.get(`${BASE_URL}/api/client/${newClientCd}`);
                setClientName(response.data.name);
            } catch (err) {
                setClientName(''); // Clear name if there's an error
                console.error(err);
            }
        }
        else {
            setClientName(''); // Clear name if ClientCd is empty
        }
    };

    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        // table:{
        //     style: {
        //         borderLeft: '1px solid black',
        //         borderRight: '1px solid black',
        //         borderBottom: '1px solid black',
        //     }
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
            name: 'Particular',
            selector: row => row.particular,
            sortable: true,
            minWidth: '270px',
            left: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'left' }}>{row.particular}</div>,
        },
        {
            name: 'Open Bal Dr',
            selector: row => row.open_bal_dr,
            sortable: true,
            minWidth: '10px',
            // maxWidth: '500px'
            right: true, // Align text to the right,
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {/* {row.open_bal_dr} */}
                {parseFloat(row.open_bal_dr).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
        },
        {
            name: 'Open Bal Cr',
            selector: row => row.open_bal_cr,
            sortable: true,
            minWidth: '10px',
            // maxWidth: '90px',
            right: true, // Align text to the right,
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {/* {row.open_bal_cr} */}
                {parseFloat(row.open_bal_cr).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
        },
        {
            name: 'Tran Amt Dr',
            selector: row => row.tran_dr,
            sortable: true,
            minWidth: '100px',
            right: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {/* {row.tran_dr} */}
                {parseFloat(row.tran_dr).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>,
        },
        {
            name: 'Tran Amt Cr',
            selector: row => row.amt_cr,
            sortable: true,
            minWidth: '100px',
            //maxWidth: '250px',
            right: true, // Align text to the right
            cell: (row) =>
                <div style={{ textAlign: 'right' }}>
                    {parseFloat(row.amt_cr).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>,
        },
        {
            name: 'Closing Bal Dr',
            selector: row => row.closing_dr,
            sortable: true,
            minWidth: '100px',
            right: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {/* {row.closing_dr} */}
                {parseFloat(row.closing_dr).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>,
        },
        {
            name: 'Closing Bal Cr',
            selector: row => row.closing_cr,
            sortable: true,
            minWidth: '100px',
            right: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {parseFloat(row.closing_cr).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
        }

    ];

    return (
        <Container className="align-items-center mt-3">

            <Row className="mb-3">
                <Col className='' xs={12} md={4}>
                    <div className="d-flex flex-column flex-md-row align-items-md-center">
                        <div className="mb-2 mb-md-0 margin_form_dt align-middle">
                            <Form.Label className='as_on_style'>As on Date:</Form.Label>
                        </div>
                        <div>
                            <Form.Control
                                type="date"
                                className='inputDate_width'
                                name="asonDate"
                                value={asonDate}
                                onChange={(e) => setAsOnDate(e.target.value)}
                                size="sm"
                            />
                        </div>

                    </div>
                </Col>
                <Col className=' pt-2' xs={12} md={2} style={{ display: 'flex', alignItems: 'start' }}>
                    <Form.Check
                        type="radio"
                        label="Partywise"
                        name="reportType"
                        value="partwise"
                        id="partwiseRadio"
                        // checked={reportType === 'partwise'}
                        // onChange={(e) => setReportType(e.target.value)}
                        className="me-5"
                    />
                    <Form.Check
                        type="radio"
                        label="Total"
                        name="reportType"
                        value="total"
                        id="totalRadio"
                    // checked={reportType === 'total'}
                    // onChange={(e) => setReportType(e.target.value)}
                    />
                </Col>
                <Col className='pl-3' xs={12} md={6}>
                    <div className="d-flex justify-content-end align-items-end mb-3">

                        <button className='btn btn-secondary'
                            onClick={() =>
                                downloadCSV(data, `Trial Balance `
                                    + '  ' + `asOnDate= ${asonDate}`)}
                        >Download CSV</button> &nbsp;

                        <Button onClick={exportToPDFAll} style={{ marginLeft: '10px', width: "150px" }} className="">
                            Export To Pdf
                        </Button>
                        <Button
                            variant="primary"
                            onClick={fetchData}
                            className="mr-2 ms-2 btn-success"
                            // size='sm'
                            style={{ width: "150px" }}
                        >
                            Run Report
                        </Button>

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
                    title={data.length > 0 ? `Trial Balance as on date: ${asonDate}` : ''}
                />
            </div>

        </Container>
    );
}

export default Trial_Balance;
