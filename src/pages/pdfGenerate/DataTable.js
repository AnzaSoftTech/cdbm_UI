import JSZip from 'jszip'; // Import JSZip
import React, { useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { Button, Container, Form, Row, Col, Spinner, Card } from 'react-bootstrap';
import { pdf } from '@react-pdf/renderer'; // Import pdf function from @react-pdf/renderer
import MyPDFDocument from './generatePDF'; // Assuming MyPDFDocument is the component for generating the PDF
import './DataTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BASE_URL } from ".././constants";

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

    const { page, prepareRow } = useTable(
        { columns, data, initialState: { pageIndex: 0 } },
        useFilters,
        useSortBy,
        usePagination
    );

    const handleRunReport = async () => {
        setShowTable(true);
        await fetchData(selectedDate);
    };

    const fetchData = async (date) => {
        try {
            const formattedDate = formatDate(date);
           const endpoint = `${BASE_URL}/api/contract_notes?p_transaction_date=${formattedDate}`;
           //  const endpoint = `http://localhost:3001/api/contract_notes?p_transaction_date=${formattedDate}`;

            // const [
            //     companyResponse,
            //     excResponse,
            //     contractNotesResponse,
            // ] = await Promise.all([
            //     axios.get('http://localhost:3001/api/company_details'),
            //     axios.get('http://localhost:3001/api/exc_details'),
            //     axios.get(endpoint),
            // ]);

            const [
                companyResponse,
                excResponse,
                contractNotesResponse,
            ] = await Promise.all([
                axios.get(`${BASE_URL}/api/company_details`),
                axios.get(`${BASE_URL}/api/exc_details`),
                axios.get(endpoint),
            ]);

            setCompanyDetails(companyResponse.data[0]);
            setExcDetails(excResponse.data);
            setContractNotes(contractNotesResponse.data);

            if (contractNotesResponse.data && contractNotesResponse.data.length > 0) {
                const { client_cd, int_mkt_type, trd_settle_no } = contractNotesResponse.data[0];
                setHeaderInfo({ client_cd, int_mkt_type, trd_settle_no });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const chunkSize = 10;
    const chunkedContractNotes = [];
    for (let i = 0; i < contractNotes.length; i += chunkSize) {
        chunkedContractNotes.push(contractNotes.slice(i, i + chunkSize));
    }

    const generateAllPDFs = async () => {
        const pdfs = [];
        for (let chunk of chunkedContractNotes) {
            for (let note of chunk) {
                const pdfDoc = (
                    <MyPDFDocument
                        tableData={page.map(row => row.values)}
                        companyDetails={companyDetails}
                        excDetails={excDetails}
                        contractNotes={[note]}
                    />
                );
    
                // Generate the PDF as a blob using @react-pdf/renderer's pdf function
                const pdfBlob = await pdf(pdfDoc).toBlob();
                
                // Use note.client_name for the PDF filename, or fallback to a default if it's not available
                //const pdfFileName = note.client_name ? `${note.client_name}.pdf` : `Ledger_${chunk.indexOf(note) + 1}.pdf`;
                const pdfFileName = 'Contract_Note_' + `${note.cont_note_no}` + `_` + `${note.client_cd}` +
                                      `_` + `${note.trd_settle_no}.pdf`;
                pdfs.push({ pdfBlob, pdfFileName });
            }
        }
        return pdfs;
    };
    
    const handleDownloadAllPDFs = async () => {
        const pdfDocuments = await generateAllPDFs();
        const zip = new JSZip();
    
        // Add each PDF Blob to the ZIP file using the client_name or default name
        pdfDocuments.forEach(({ pdfBlob, pdfFileName }, index) => {
            zip.file(pdfFileName, pdfBlob);
        });
    
        zip.generateAsync({ type: 'blob' }).then((content) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'Contract_Notes.zip';
            link.click();
        });
    };
    

    return (
        <Container className="py-4">
            <Card className="shadow-sm p-4 mb-4">
                <Row className="align-items-center mb-4">
                    <Col xs={12} md={6}>
                        <Form.Group>
                            <Form.Label className="fw-bold">Select Date:</Form.Label>
                            <Form.Control
                                type="date"
                                size="sm"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6} className="d-flex justify-content-md-end">
                        <Button
                            variant="primary"
                            onClick={handleRunReport}
                            className="mt-3 mt-md-0"
                            style={{ minHeight: '40px', fontWeight: '500' }}
                        >
                            {showTable ? 'Rerun Report' : 'Run Report'}
                        </Button>
                    </Col>
                </Row>
            </Card>

            {showTable && companyDetails && excDetails && contractNotes.length > 0 ? (
                <Card className="shadow-sm p-4">
                    <h5 className="fw-bold text-center mb-4">Generated PDFs</h5>
                    <Button
                        variant="success"
                        className="d-block w-100 mb-3"
                        onClick={handleDownloadAllPDFs}
                    >
                        Download All PDFs as ZIP
                    </Button>
                </Card>
            ) : (
                showTable && (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Fetching data...</p>
                    </div>
                )
            )}
        </Container>
    );
};

export default DataTable;