import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Fin_Report.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ClientSearchPop from './ClientSearchPop'
import ScripSearchPop from './scripSearch.js'
import axios from 'axios';
import { BASE_URL } from ".././constants";
//import Select from 'react-select';


const CashNetPosition = () => {
    const [branches, setBranches] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showScripPopup, setshowScripPopup] = useState(false);

    const [Setletypes, setSetleTypes] = useState([]);
    const [ReportType, setReportType] = useState('');
    const [scripcd, setScripCd] = useState('');
    const [sec_name, setScripname] = useState('');
    const [clientcd, setClientCd] = useState('');
    const [clientname, setClientName] = useState('');
    //const [showTable, setShowTable] = useState(false);// State variable to control table visibility
    const [showInputs, setShowInputs] = useState(false);
    const [setlStartDate, setSetlStartDate] = useState('');
    const [setleEndDate, setSetleEndDate] = useState('');
    const [payInDate, setPayInDate] = useState('');
    const [payoutDate, setPayoutDate] = useState('');
    const [summarydata, setSummaryData] = useState([]);
    const [pending, setPending] = useState(false);
    const [data, setData] = useState([]);
    
    const [settleNo, setSettleNo] = useState('');

    const [filters, setFilters] = useState({
        clientcd: '',
        scripcd: '',
        fromdt: '',
        todt: '',
        branchcd: '',
        Settle_tp: '',
        SetleNo:'',
    });

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const downloadCSV = (data) => {
        const csv = convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Net_Position_' + settleNo + '.csv');
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
    

   

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({ html: '#data-table' });
        doc.save('Client Net Position.pdf');
    };

    const fetchData = async () => {
        const params = new URLSearchParams();
        //alert(JSON.stringify(filters));
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                params.append(key, filters[key]);
                //alert( filters[key]);
            }
        });
        console.log('Filters:', filters);
        //alert('Filters:', filters);
        console.log('Params:', params.toString());
        //alert('Params:' + params.toString());
        //alert(params.toString());
        try {
          // `http://localhost:3001/api/client_net_position?${params.toString()}`
            const response = await axios.get(`${BASE_URL}/api/client_net_position?${params.toString()}`);
            setData(response.data);

            //alert(JSON.stringify(response.data));

            setSettleNo(response.data[0].delv_settle_no);

            //console.log('response.data ---> ', response.data[0].delv_settle_no);
            
            setShowInputs(true);

        } catch (err) {
            console.error(err);

        }

        setPending(true);
        
        try {
            // `http://localhost:3001/api/client_summary?${params.toString()}`
            const summeryresponse = await axios.get(`${BASE_URL}/api/client_summary?${params.toString()}`);
            
                // params: { client_cd: clientcd,
                //     scripcd: scripcd,
                //     fromdt: fromdt,
                //     todt: todt,
                //     branchcd: branchcd,
                //     Settle_tp: Settle_tp,
                //     SetleNo: SetleNo}
            // });
            setSummaryData(summeryresponse.data);
            
            //setShowTable(true)
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setPending(false);
        }
    };


    useEffect(() => {
        // 'http://localhost:3001
        axios.get(`${BASE_URL}/api/branches`)
            .then(response => {
                setBranches(response.data);
                // alert(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    },
        []);

    useEffect(() => {
        // 'http://localhost:3001/api/Settlement_type'
        axios.get(`${BASE_URL}/api/Settlement_type`)
            .then(response => {
                setSetleTypes(response.data);
                //alert(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    },
        []);

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


    const handleScripChange = async (e) => {
        const newScripCd = e.target.value;
        
        setScripCd(newScripCd);
        filters.scripcd = newScripCd;
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
        
        if (newScripCd) {
            try {
                //`http://localhost:3001/api/scrip/${newScripCd}`
                const response = await axios.get(`${BASE_URL}/api/scrip/${newScripCd}`);
                setScripname(response.data.sec_name);
            } catch (err) {
                setScripname(''); // Clear name if there's an error
                console.error(err);
            }
        } else {
            setScripname(''); // Clear name if ClientCd is empty
        }
    };
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
                borderTopColor: 'purple',
                backgroundColor: 'rgb(224, 230, 245)',
                position: 'sticky',
                top: 0,
                zIndex: 1,


            },
        },
        headCells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: 'black',


                },
            },
        },
        cells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: 'black',

                },


            },
        },
    };



    const columns = [
        {
            name: 'Client Cd',
            selector: row => row.client_cd,
            sortable: true,
            left: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'left' }}>{row.client_cd}</div>,
        },
        {
            name: 'Scrip',
            selector: row => row.scrip_cd,
            sortable: true,
            minWidth: '200px',
            // maxWidth: '500px', 
        },
        {
            name: 'Series',
            selector: row => row.series,
            sortable: true,
            minWidth: '10px',
            // maxWidth: '90px',
        },
        {
            name: 'Buy Qty',
            selector: row => row.buy_qty,
            //sortable: true,
            right: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'right' }}>{row.buy_qty}</div>,
        },
        {
            name: 'Buy Value',
            selector: row => row.buy_value,
            //sortable: true,
            minWidth: '110px',
            //maxWidth: '250px',
            right: true, // Align text to the right
            cell: (row) =>
                <div style={{ textAlign: 'right' }}>
                    {parseFloat(row.buy_value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>,
        },
        {
            name: 'Sell Qty',
            selector: row => row.sale_qty,
            //sortable: true,
            right: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'right' }}>{row.sale_qty}</div>,
        },
        {
            name: 'Sell Value',
            selector: row => row.sale_value,
            //sortable: true,
            right: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {parseFloat(row.sale_value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
        }, {
            name: 'Net Qty',
            selector: row => row.net_qty,
            //sortable: true,
            right: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'right' }}>{row.net_qty}</div>,
        },
        {
            name: 'Net Value',
            selector: row => row.net_value,
            //sortable: true,
            minWidth: '110px',
            // maxWidth: '250px',
            right: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {parseFloat(row.net_value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
        },
        {
            name: 'Trade Date',
            selector: row => row.position_date,
            sortable: true,
            right: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'right' }}>{row.position_date}</div>,
        },
        {
            name: 'Setl No',
            selector: row => row.delv_settle_no,
            sortable: true,
            right: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'right' }}>{row.delv_settle_no}</div>,
        },

    ];

    const columnsSummary = [
        {
            name: 'Description',
            selector: row => row.delivery_nodelivery,
            sortable: true,
            accessor: 'delivery_nodelivery'
        },
        {
            name: 'Buy Value',
            selector: row => row.buy_value,
            sortable: true,
            accessor: 'buy_value',
            right: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {parseFloat(row.buy_value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
        },
        {
            name: 'Sell Value',
            selector: row => row.sale_value,
            sortable: true,
            accessor: 'sale_value',
            right: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {parseFloat(row.sale_value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
        },
        {
            name: 'Net Value',
            selector: row => row.net_value1,
            sortable: true,
            accessor: 'net_value1',
            right: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {parseFloat(row.net_value1).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
        },
        {
            name: 'Gross Value',
            selector: row => row.gross_value,
            sortable: true,
            accessor: 'gross_value',
            right: true, // Align text to the right
            cell: (row) => <div style={{ textAlign: 'right' }}>
                {parseFloat(row.gross_value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>,
            // Cell: props => <React.Fragment>{this.toCurrency(props.value)}</React.Fragment>,
        },
    ];

    return (
        <Container className="align-items-center mt-3">
            <Row className="mb-3">
                <Col xs={12} md={4}>
                    <div className="d-flex flex-column flex-md-row align-items-md-center">
                        <div className="mb-2 mb-md-0 me-md-5 align-middle">
                            <Form.Label className='branch_width label-color-common'>Branch:</Form.Label>
                        </div>
                        <div>
                            <Form.Select
                                aria-label="Default select example"
                                name="branchcd"
                                value={filters.branchcd}
                                onChange={handleChange}
                                size="sm"
                            >
                                <option value="">Select Branch</option>
                                {branches.map(branch => (
                                    <option key={branch.branch_cd} value={branch.branch_cd}>
                                        {branch.branch_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>
                </Col>

                <Col xs={12} md={4}>
                    <div className="d-flex flex-column flex-md-row align-items-md-center">
                        <div className="mb-2 mb-md-0">
                            <Form.Label className="me-md-2 label-color-common label_btn_margin align-middle">Settle Type:</Form.Label>
                        </div>
                        <div>
                            <Form.Select
                                aria-label="Default select example"
                                name='Settle_tp'
                                value={filters.Settle_tp}
                                onChange={handleChange}
                                size="sm"
                            >
                                <option value="">Select Settle Type</option>
                                {Setletypes.map(Setletype => (
                                    <option key={Setletype.settle_tp} value={Setletype.settle_tp}>
                                        {Setletype.description}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>
                </Col>

                <Col xs={12} md={4}>
                    <div className="d-flex flex-column flex-md-row align-items-md-center">
                        <div className="mb-2 mb-md-0 me-md-2">
                            <Form.Label className='labelSettleNo align-middle label-color-common'>Settle No:</Form.Label>
                        </div>
                        <div>
                            <Form.Control
                                type="number"
                                name="SetleNo"
                                value={filters.SetleNo}
                                onChange={handleChange}
                                size="sm"
                            />
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col xs={12} md={12}>
                    <div className="d-flex flex-column flex-md-row align-items-md-center">
                        <div className="mb-2 mb-md-0 margin_form_dt align-middle">
                            <Form.Label className='width_formdt label-color-common'>Form Date:</Form.Label>
                        </div>
                        <div>
                            <Form.Control
                                type="date"
                                className='inputDate_width'
                                name="fromdt"
                                value={filters.fromdt}
                                onChange={handleChange}
                                size="sm"
                            />
                        </div>
                        <div className="mb-2 mb-md-0 ms-md-2 me-md-2 align-middle">
                            <Form.Label className='width_todt label-color-common'>To Date:</Form.Label>
                        </div>
                        <div>
                            <Form.Control
                                type="date"
                                className='inputDate_width'
                                name="todt"
                                value={filters.todt}
                                onChange={handleChange}
                                size="sm"
                            />
                        </div>
                        <div className="d-flex flex-column flex-md-row align-items-md-start label_client_margin">
                            <div className="mb-2 mb-md-0 me-md-2">
                                <Form.Label className='mb-0 align-middle label-color-common'>Client:</Form.Label>
                            </div>
                            <div>
                                <Form.Control
                                    type="text"
                                    name="clientcd"
                                    value={clientcd}
                                    onChange={handleClientCdChange}
                                    size="sm"
                                    className='client_width'
                                    
                                />
                            </div>
                            <div>
                                <Form.Control
                                    type="text"
                                    value={clientname}
                                    size="sm"
                                    className='text_width'
                                />
                            </div>
                            <div>
                                <Button
                                    className="mr-2 btn-primary report-button"
                                    style={{ width: "100px" }}
                                    size='sm'
                                    onClick={() => setShowPopup(true)}
                                >
                                    Search Client
                                </Button>
                                {showPopup && <ClientSearchPop onRowSelect={handleRowSelect} />}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col xs={12} md={4}>
                    <div className="d-flex flex-column flex-md-row align-items-md-center">
                        <div className="d-flex flex-column justify-content-start flex-md-row align-items-md-center">
                            <div className="mb-2 mb-md-0 me-md-2 align-middle">
                                <Form.Label className='label-color-common'>Scrip:</Form.Label>
                            </div>
                            <div>
                                <Form.Control
                                    type="text"
                                    name="scripcd"
                                    value={scripcd}
                                    onChange={handleScripChange}
                                    size="sm"
                                    className='number_width'
                                />
                            </div>
                            <div>
                                <Form.Control
                                    type="text"
                                    value={sec_name}
                                    size="sm"
                                    className='scrip_width'
                                />
                            </div>
                            <div>
                                <Button
                                    className="mr-2 btn-primary report-button"
                                    size='sm'
                                    style={{ width: "100px" }}
                                    onClick={() => setshowScripPopup(true)}
                                >
                                    Search Scrip
                                </Button>
                                {showScripPopup && <ScripSearchPop onRowSelect={handleRowScripSelect} />}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={8}>
                    <div className="d-flex justify-content-end align-items-end mb-3 labelmarginbtn">
                        <div>
                        <button onClick={() => downloadCSV(data)}>Download CSV</button>
                            <Button
                                variant="primary"
                                onClick={fetchData}
                                className="mr-2 btn-success"
                                size='sm'
                                style={{ width: "150px" }}
                            >
                                Run Report
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {showInputs && (
                <Row className="mb-3">
                    <Col xs={12} md={3}>
                        <div className="d-flex flex-column flex-md-row align-items-md-center">
                            <div className="align-middle">
                                <Form.Label style={{ width: "120px" }}>Settle Start Date:</Form.Label>
                            </div>
                            <div>
                                <Form.Control
                                    value={setlStartDate}
                                    onChange={(e) => setSetlStartDate(e.target.value)}
                                    size="sm"
                                    className='date_padding'
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={3}>
                        <div className="d-flex flex-column flex-md-row align-items-md-center">
                            <div className="align-middle">
                                <Form.Label style={{ width: "120px" }}>Settle End Date:</Form.Label>
                            </div>
                            <div>
                                <Form.Control
                                    value={setleEndDate}
                                    onChange={(e) => setSetleEndDate(e.target.value)}
                                    size="sm"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={3}>
                        <div className="d-flex flex-column flex-md-row align-items-md-center">
                            <div className="align-middle">
                                <Form.Label style={{ width: "110px" }}>Payin Date:</Form.Label>
                            </div>
                            <div>
                                <Form.Control
                                    value={payInDate}
                                    onChange={(e) => setPayInDate(e.target.value)}
                                    size="sm"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={3}>
                        <div className="d-flex flex-column flex-md-row align-items-md-center">
                            <div className="align-middle">
                                <Form.Label style={{ width: "110px" }}>Payout Date:</Form.Label>
                            </div>
                            <div>
                                <Form.Control
                                    value={payoutDate}
                                    onChange={(e) => setPayoutDate(e.target.value)}
                                    size="sm"
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            )}

            <div>
                <DataTable
                    id='data-table'
                    columns={columns}
                    data={data}
                    customStyles={customStyles}
                    highlightOnHover
                    pagination={false}
                    responsive
                    dense
                    overflowY
                />
            </div>

            <div>
                <DataTable
                    columns={columnsSummary}
                    data={summarydata}
                    progressPending={pending}
                    customStyles={customStyles}
                    highlightOnHover
                    pagination
                    responsive
                    dense
                />
            </div>
        </Container>
    );
}

export default CashNetPosition;
