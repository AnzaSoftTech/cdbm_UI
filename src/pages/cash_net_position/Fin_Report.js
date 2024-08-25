// import React, { useEffect, useState } from 'react';
// import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
// import { Table, Button, Container, Form, Row, Col } from 'react-bootstrap';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import './Fin_Report.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';


// const DataTable = ({ columns, data }) => {
//     // const [branch, setBranch] = useState('');
//     const [branches, setBranches] = useState([]);
//     const [Setletype, setSetleType] = useState('');
//     const [SetleNo, setSetleNo] = useState('');
//     const [DateFrom, setDateFrom] = useState('');
//     const [DateTo, setDateTo] = useState('');
//     // const [Client, setClient] = useState('');
//     const [ReportType, setReportType] = useState('');
//     const [Scrip, setScrip] = useState('');
//     const [clientcd, setClientCd] = useState('');
//     const [clientname, setClientName] = useState('');
    

//     const [showTable, setShowTable] = useState(false);// State variable to control table visibility
//     const [showInputs, setShowInputs] = useState(false);
//     const [setlStartDate, setSetlStartDate] = useState('');
//     const [setleEndDate, setSetleEndDate] = useState('');
//     const [payInDate, setPayInDate] = useState('');
//     const [payoutDate, setPayoutDate] = useState('');




//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         page,
//         prepareRow,
//         canPreviousPage,
//         canNextPage,
//         pageOptions,
//         pageCount,
//         gotoPage,
//         nextPage,
//         previousPage,
//         setPageSize,
//         state: { pageIndex, pageSize },
//     } = useTable(
//         {
//             columns,
//             data,
//             initialState: { pageIndex: 0 },
//         },
//         useFilters,
//         useSortBy,
//         usePagination
//     );

//     const exportToPDF = () => {
//         const doc = new jsPDF();
//         doc.autoTable({ html: '#data-table' });
//         doc.save('Client Net Position.pdf');
//     };

//     const handleRunReport = () => {
//         console.log(`Branch: ${branches},Setletype: ${Setletype},SetleNo: ${SetleNo}, DateFrom: ${DateFrom}, DateTo: ${DateTo},Client: ${Client},ReportType: ${ReportType},Scrip: ${Scrip}`);
//         setShowTable(true); // Show table when report is run
//         setShowInputs(true);
//     };

//     useEffect(() => {
//          axios.get('http://localhost:3004/api/branches')
//          .then(response => { 
//             setBranches(response.data);
//             // alert(response.data);
//         })
//             .catch(error => { 
//                 console.error("There was an error fetching the data!", error);
//              }); 
//             },
//              []);

//              const handleClientCdChange = async (e) => {
//                 const newClientCd = e.target.value;
//                 setClientCd(newClientCd);
            
//                 if (newClientCd) {
//                   try {
//                     const response = await axios.get(`http://localhost:3004/api/client/${newClientCd}`);
//                     setClientName(response.data.client_name);
//                   } catch (err) {
//                     setClientName(''); // Clear name if there's an error
//                     console.error(err);
//                   }
//                 } else {
//                     setClientName(''); // Clear name if ClientCd is empty
//                 }
//               };

//     return (
//         <Container className="align-items-center ">
//             <Row className="mb-3">
//                 <Col xs={12} md={4}>
//                     <div className="d-flex flex-column flex-md-row align-items-md-center">
//                         <div className="mb-2 mb-md-0 me-md-5 align-middle">
//                             <Form.Label>Branch:</Form.Label>
//                         </div>
//                         <div className='input_width'>
//                         <select className='margin_before_select'> 
//                             {branches.map(branch => ( <option key={branch.branch_cd} value={branch.branch_cd}>{branch.branch_name}</option> ))} 
//                         </select>
//                         </div>
//                     </div>
//                 </Col>

//                 <Col xs={12} md={4}>
//                     <div className="d-flex flex-column flex-md-row align-items-md-center">
//                         <div className="mb-2 mb-md-0">
//                             <Form.Label className="me-md-2 label_btn_margin align-middle">Settle Type:</Form.Label>
//                         </div>
//                         <div>
//                             <Form.Select aria-label="Default select example" value={Setletype} onChange={(e) => setSetleType(e.target.value)} size="sm">
//                                 <option value="">Select Settle Type</option>
//                                 <option value="NORMAL T+1">NORMAL T+1</option>
//                                 <option value="Settle Type 2">Settle Type 2</option>
//                                 <option value="Settle Type 3">Settle Type 3</option>
//                             </Form.Select>
//                         </div>
//                     </div>
//                 </Col>

//                 <Col xs={12} md={4}>
//                     <div className="d-flex flex-column flex-md-row align-items-md-center">
//                         <div className="mb-2 mb-md-0 me-md-2">
//                             <Form.Label className='label_btn_margin align-middle'>Settle No:</Form.Label>
//                         </div>
//                         <div>
//                             <Form.Control type="number" value={SetleNo} onChange={(e) => setSetleNo(e.target.value)} size="sm" />
//                         </div>
                        
                        
//                     </div>
//                 </Col>
//             </Row>


//             <Row className="mb-3">
//                 <Col xs={12} md={12}>
//                     <div className="d-flex flex-column flex-md-row align-items-md-center">
//                         <div className="mb-2 mb-md-0 margin_form_dt align-middle">
//                             <Form.Label>Form Date:</Form.Label>
//                         </div>
//                         <div>
//                             <Form.Control type="date" value={DateFrom} onChange={(e) => setDateFrom(e.target.value)} size="sm" />
//                         </div>
//                         <div className="mb-2 mb-md-0 ms-md-2 me-md-2 align-middle">
//                             <Form.Label>To:</Form.Label>
//                         </div>
//                         <div>
//                             <Form.Control type="date" value={DateTo} onChange={(e) => setDateTo(e.target.value)} size="sm" />
//                         </div>
//                         <div className="d-flex flex-column flex-md-row align-items-md-start label_client_margin">
//                             <div className="mb-2 mb-md-0 me-md-2 ">
//                                 <Form.Label className='mb-0 align-middle'>Client:</Form.Label>
//                             </div>
//                             <div>
//                                 <Form.Control type="text" value={clientcd} onChange={handleClientCdChange} size="sm" className='number_width' />

//                             </div>
//                             <div>
//                                 <Form.Control type="text" className='text_width' value={clientname} size="sm" />
//                             </div>
//                             <div>
//                             <Button variant="primary"  className="mr-2 custom-header report-button" size='sm'>
//                                     Search Client
//                             </Button>
//                         </div>
//                         </div>
//                     </div>
//                 </Col>


//             </Row>
//             <Row className="mb-3">
//                 <Col xs={12} md={4}>
//                     <div className="d-flex flex-column flex-md-row align-items-md-center">
//                         <div className="mb-2 mb-md-0 margin_report align-middle">
//                             <Form.Label>Report Type:</Form.Label>
//                         </div>
//                         <div className='input_width'>
//                             <Form.Select aria-label="Default select Report Type" value={ReportType} onChange={(e) => setReportType(e.target.value)} size="sm">
//                                 <option value="">Select Report Type</option>
//                                 <option value="Client Wise Scrip Wise">Client Wise Scrip Wise</option>
//                                 <option value="Report Type 2">Report Type 2</option>
//                                 <option value="Report Type 3">Report Type 3</option>
//                             </Form.Select>

//                         </div>

//                     </div>
//                 </Col>
//                 <Col xs={12} md={8}>
//                     <div className="d-flex  align-items-center mb-3 label_btn_margin">
//                         <div>
//                             <Button variant="primary" onClick={handleRunReport} className="mr-2 custom-header report-button" size='sm'>
//                                 Run Report
//                             </Button>
//                             <Button variant="primary" onClick={exportToPDF} className="custom-header" size='sm'>
//                                 Export to PDF
//                             </Button>
//                         </div>
//                         <div className="d-flex flex-column flex-md-row align-items-md-center label_client_margin">
//                             <div className="mb-2 mb-md-0 me-md-2 align-middle">
//                                 <Form.Label >Scrip:</Form.Label>
//                             </div>
//                             <div>
//                                 <Form.Control type="number" value={Scrip} onChange={(e) => setScrip(e.target.value)} size="sm" className='number_width' />
//                             </div>
//                             <div>
//                                 <Form.Control type="text" value={Scrip} onChange={(e) => setScrip(e.target.value)} size="sm" className='scrip_width' />
//                             </div>
//                             <div>
//                                 <Button variant="primary"  className="mr-2 custom-header report-button" size='sm'>
//                                     Search Scrip
//                                 </Button>
//                             </div>
                        
//                         </div>
//                     </div>
//                 </Col>



//             </Row>
//             {showInputs && (
//                 <Row className="mb-3">
//                     <Col xs={12} md={3}>
//                         <div className="d-flex flex-column flex-md-row align-items-md-center">
//                             <div className="me-md-2 align-middle">
//                                 <Form.Label>Settl Start Date:</Form.Label>
//                             </div>
//                             <div>
//                                 <Form.Control type="date" value={setlStartDate} onChange={(e) => setSetlStartDate(e.target.value)} size="sm" className='date_padding' />
//                             </div>
//                         </div>
//                     </Col>
//                     <Col xs={12} md={3}>
//                         <div className="d-flex flex-column flex-md-row align-items-md-center">
//                             <div className="me-md-2 align-middle">
//                                 <Form.Label>Settl End Date:</Form.Label>
//                             </div>
//                             <div>
//                                 <Form.Control type="date" value={setleEndDate} onChange={(e) => setSetleEndDate(e.target.value)} size="sm" />
//                             </div>
//                         </div>
//                     </Col>
//                     <Col xs={12} md={3}>
//                         <div className="d-flex flex-column flex-md-row align-items-md-center">
//                             <div className="me-md-2 align-middle">
//                                 <Form.Label>Payin Date:</Form.Label>
//                             </div>
//                             <div>
//                                 <Form.Control type="date" value={payInDate} onChange={(e) => setPayInDate(e.target.value)} size="sm" />
//                             </div>
//                         </div>
//                     </Col>
//                     <Col xs={12} md={3}>
//                         <div className="d-flex flex-column flex-md-row align-items-md-center">
//                             <div className="me-md-2 align-middle">
//                                 <Form.Label>Payout Date:</Form.Label>
//                             </div>
//                             <div>
//                                 <Form.Control type="date" value={payoutDate} onChange={(e) => setPayoutDate(e.target.value)} size="sm" />
//                             </div>
//                         </div>
//                     </Col>
//                 </Row>
//             )}



//             {showTable && ( // Render table only if showTable is true
//                 <div className="table-wrapper custom-table scrollX" style={{
//                     maxHeight: "40vh",
//                     overflowY: "scroll"
//                 }} >
//                     <Table bordered className='table-hover' {...getTableProps()} id="data-table" >
//                         {/* Table headers */}
//                         <thead style={{
//                             position: "sticky",
//                             top: "0", zIndex: 3, background: 'white'
//                         }}>
//                             {headerGroups.map(headerGroup => (
//                                 <tr {...headerGroup.getHeaderGroupProps()}>
//                                     {headerGroup.headers.map(column => (
//                                         <th
//                                             {...column.getHeaderProps(column.getSortByToggleProps())}

//                                             className="custom-header"
//                                         >
//                                             {column.render('Header')}
//                                             <span>
//                                                 {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
//                                             </span>
//                                         </th>


//                                     ))}
//                                 </tr>
//                             ))}
//                         </thead>
//                         {/* Table body */}
//                         <tbody {...getTableBodyProps()} >
//                             {page.map(row => {
//                                 prepareRow(row);
//                                 return (
//                                     <tr {...row.getRowProps()} className={`custom-row `}>
//                                         {row.cells.map(cell => (
//                                             <td {...cell.getCellProps()} className="custom-cell" style={{ textAlign: cell.column.align }}>
//                                                 {console.log('Cell Value:', cell.value)} {/* Debug output */}
//                                                 {cell.render('Cell')}
//                                             </td>
//                                         ))}
//                                     </tr>

//                                 );
//                             })}
//                         </tbody>
//                     </Table>
//                 </div>
//             )}
//             {showTable && ( // Render table only if showTable is true
//                 <div className="table-wrapper custom-table scrollX" style={{
//                     maxHeight: "40vh",
//                     overflowY: "scroll"
//                 }} >
//                     <Table bordered className='table-hover' {...getTableProps()} id="data-table" >
//                         {/* Table headers */}
//                         <thead style={{
//                             position: "sticky",
//                             top: "0", zIndex: 3, background: 'white'
//                         }}>
//                             {headerGroups.map(headerGroup => (
//                                 <tr {...headerGroup.getHeaderGroupProps()}>
//                                     {headerGroup.headers.map(column => (
//                                         <th
//                                             {...column.getHeaderProps(column.getSortByToggleProps())}

//                                             className="custom-header"
//                                         >
//                                             {column.render('Header')}
//                                             <span>
//                                                 {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
//                                             </span>
//                                         </th>


//                                     ))}
//                                 </tr>
//                             ))}
//                         </thead>
//                         {/* Table body */}
//                         <tbody {...getTableBodyProps()} >
//                             {page.map(row => {
//                                 prepareRow(row);
//                                 return (
//                                     <tr {...row.getRowProps()} className={`custom-row `}>
//                                         {row.cells.map(cell => (
//                                             <td {...cell.getCellProps()} className="custom-cell" style={{ textAlign: cell.column.align }}>
//                                                 {console.log('Cell Value:', cell.value)} {/* Debug output */}
//                                                 {cell.render('Cell')}
//                                             </td>
//                                         ))}
//                                     </tr>

//                                 );
//                             })}
//                         </tbody>
//                     </Table>
//                 </div>
//             )}
//             <div className="pagination">
//                 <div className=''>
//                     <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
//                         {'<<'}
//                     </Button>{' '}
//                     <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
//                         {'<'}
//                     </Button>{' '}
//                     <Button onClick={() => nextPage()} disabled={!canNextPage}>
//                         {'>'}
//                     </Button>{' '}
//                     <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
//                         {'>>'}
//                     </Button>{' '}
//                 </div>

//                 <span style={{ marginLeft: '48%' }}>
//                     &nbsp;Page{' '}
//                     <strong>
//                         {pageIndex + 1} of {pageOptions.length}
//                     </strong>{' '}
//                 </span>
//                 <span style={{ float: 'right' }}>
//                     &nbsp;| Go to page:{' '}
//                     <input
//                         type="number"
//                         defaultValue={pageIndex + 1}
//                         onChange={e => {
//                             const page = e.target.value ? Number(e.target.value) - 1 : 0;
//                             gotoPage(page);
//                         }}
//                         style={{ width: '60px', marginRight: '10px' }}
//                     />
//                 </span>{' '}
//                 &nbsp;<select style={{ height: '1.7rem', marginRight: '10px' }}
//                     value={pageSize}
//                     onChange={e => {
//                         setPageSize(Number(e.target.value));
//                     }}
//                 >
//                     {[5, 10, 20, 30, 40, 50].map(pageSize => (
//                         <option key={pageSize} value={pageSize}>
//                             Show {pageSize}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//         </Container>
//     );
// }

// export default DataTable;
