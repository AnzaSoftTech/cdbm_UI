import React, { useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { Table, Button, Container, Form, Row, Col } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MyPDFDocument from './generatePDF';
import './DataTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Helper function to format the date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const DataTable = ({ columns, data }) => {
    const [showTable, setShowTable] = useState(false);
    const [companyDetails, setCompanyDetails] = useState(null);
    const [excDetails, setExcDetails] = useState(null);
    const [contractNotes, setContractNotes] = useState(null);
    const [selectedDate, setSelectedDate] = useState(''); // State for the selected date
    const [securitySummary, setSecuritySummary] = useState(null);
    const [taxSummary, setTaxSummary] = useState(null);
    const [detailContrNote, setDetailContrNote] = useState(null);
    const [headerInfo, setHeaderInfo] = useState({ client_cd: '', int_mkt_type: '', trd_settle_no: '' }); // State for header values

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
    } = useTable(
        { columns, data, initialState: { pageIndex: 0 } },
        useFilters,
        useSortBy,
        usePagination
    );

    const handleRunReport = async () => {
        setShowTable(true);
        await fetchData(selectedDate); // Wait for data to load before generating PDF
    };

    const fetchData = async (date) => {
        try {
            const formattedDate = formatDate(date);
            const endpoint = `http://localhost:3001/api/contract_notes?p_transaction_date=${formattedDate}`;

            const [
                companyResponse,
                excResponse,
                contractNotesResponse,
                securitySummaryResponse,
                taxSummaryResponse,
                detailContrNoteResponse
            ] = await Promise.all([
                axios.get('http://localhost:3001/api/company_details'),
                axios.get('http://localhost:3001/api/exc_details'),
                axios.get(endpoint),
                axios.get('http://localhost:3001/api/security_summary'),
                axios.get('http://localhost:3001/api/tax_summary'),
                axios.get('http://localhost:3001/api/contract_notes?p_transaction_date=03/06/2024')
            ]);

            // console.log("contractNotesResponse",contractNotesResponse)


            setCompanyDetails(companyResponse.data[0]);
            setExcDetails(excResponse.data);
            setContractNotes(contractNotesResponse.data);
            setSecuritySummary(securitySummaryResponse.data);
            setTaxSummary(taxSummaryResponse.data);
            setDetailContrNote(detailContrNoteResponse.data);

            // Extract and set the header info from contractNotesResponse data
            if (contractNotesResponse.data && contractNotesResponse.data.length > 0) {
                const { client_cd, int_mkt_type, trd_settle_no } = contractNotesResponse.data[0];
                setHeaderInfo({ client_cd, int_mkt_type, trd_settle_no });
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <Container className="align-items-center">
            <Row className="pt-5 mb-3">
                <Col xs={12} md={6} className="d-flex align-items-center">
                    <Form.Label className="margin-right mb-0 label-color-common" style={{ width: "25%" }}>Select Date: </Form.Label>
                    <Form.Control
                        type="date"
                        size="sm"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)} // Update selected date
                    />
                </Col>
            </Row>

            {/* Header section to display client_cd, int_mkt_type, trd_settle_no */}
            {showTable && headerInfo.client_cd && (
                <Row className="mb-3">
                    <Col>
                        <h5>Client Code: {headerInfo.client_cd}</h5>
                        <h5>Market Type: {headerInfo.int_mkt_type}</h5>
                        <h5>Settlement Number: {headerInfo.trd_settle_no}</h5>
                    </Col>
                </Row>
            )}

            <Row className="mb-3 button-align">
                <Col>
                    <Button variant="primary" onClick={handleRunReport} className="mr-2 custom-header">
                        Run Report
                    </Button>

                    {showTable && companyDetails && excDetails && contractNotes && securitySummary && taxSummary && detailContrNote && (
                        <PDFDownloadLink
                            document={
                                <MyPDFDocument
                                    tableData={page.map(row => row.values)}
                                    companyDetails={companyDetails}
                                    excDetails={excDetails}
                                    contractNotes={contractNotes}
                                    securitySummary={securitySummary}
                                    taxSummary={taxSummary}
                                    detailContrNote={detailContrNote}
                                />
                            }
                            fileName="Ledger.pdf"
                            style={{ textDecoration: 'none' }}
                        >
                            {({ loading }) => (
                                <Button variant="primary" className="custom-header" style={{ marginLeft: '10px' }}>
                                    {loading ? 'Generating PDF...' : 'Export to PDF'}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    )}
                </Col>
            </Row>

            {showTable && (
                <div className="table-wrapper custom-table">
                    <Table bordered className='table-hover' {...getTableProps()} id="data-table">
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ width: column.id === "no" ? "100px" : "auto" }}>
                                            {column.render('Header')}
                                            <span>
                                                {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            )}
        </Container>
    );
};

export default DataTable;
