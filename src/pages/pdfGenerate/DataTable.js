import React, { useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
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
    const [contractNotes, setContractNotes] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [headerInfo, setHeaderInfo] = useState({ client_cd: '', int_mkt_type: '', trd_settle_no: '' });

    const {
        page, // Get paginated data from react-table
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
            ] = await Promise.all([
                axios.get('http://localhost:3001/api/company_details'),
                axios.get('http://localhost:3001/api/exc_details'),
                axios.get(endpoint),
            ]);

            setCompanyDetails(companyResponse.data[0]);
            setExcDetails(excResponse.data);
            setContractNotes(contractNotesResponse.data);

            // Extract and set the header info from contractNotesResponse data
            if (contractNotesResponse.data && contractNotesResponse.data.length > 0) {
                const { client_cd, int_mkt_type, trd_settle_no } = contractNotesResponse.data[0];
                setHeaderInfo({ client_cd, int_mkt_type, trd_settle_no });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Split contract notes into smaller chunks for PDF generation
    const chunkSize = 10; // Adjust the size as needed
    const chunkedContractNotes = [];
    for (let i = 0; i < contractNotes.length; i += chunkSize) {
        chunkedContractNotes.push(contractNotes.slice(i, i + chunkSize));
    }

    // Function to handle PDF generation in batches
    const generatePDFsInBatches = () => {
        return chunkedContractNotes.map((chunk, index) => (
            <div key={index}>
                {chunk.map((note, noteIndex) => (
                    <PDFDownloadLink
                        key={noteIndex} // Ensure unique key for each link
                        document={
                            <MyPDFDocument
                                tableData={page.map(row => row.values)}
                                companyDetails={companyDetails}
                                excDetails={excDetails}
                                contractNotes={[note]} // Pass only the current note
                            />
                        }
                        fileName={`${note.client_name || `Ledger_${noteIndex + 1}`}.pdf`} // Use client_name or a fallback name
                        style={{ textDecoration: 'none', marginBottom: '10px', display: 'block' }}
                    >
                        {({ loading }) => (
                            <Button
                                variant="primary"
                                className="custom-header"
                                style={{ marginLeft: '10px' }}
                            >
                                {loading
                                    ? `PDF Loading (${note.client_name || `Ledger_${noteIndex + 1}`})...`
                                    : `Export to PDF - ${note.client_name || `Ledger ${noteIndex + 1}`}`}
                            </Button>
                        )}
                    </PDFDownloadLink>
                ))}
            </div>
        ));
    };

    return (
        <Container className="align-items-center">
            <Row className="pt-5 mb-3">
                <Col xs={12} md={6} className="d-flex align-items-center">
                    <Form.Label className="margin-right mb-0 label-color-common" style={{ width: "25%" }}>
                        Select Date:
                    </Form.Label>
                    <Form.Control
                        type="date"
                        size="sm"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </Col>
            </Row>

            {/* Generate PDFs */}
            <Row className="mb-3 button-align">
                <Col>
                    <Button variant="primary" onClick={handleRunReport} className="mr-2 custom-header">
                        Run Report
                    </Button>

                    {showTable && companyDetails && excDetails && contractNotes && (
                        <div>
                            {generatePDFsInBatches()}
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default DataTable;
