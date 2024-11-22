import React, { useState } from "react";
import axios from "axios";
import { Button, Container, Form, Row, Col, Spinner, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { generateAllPDFsAsZIP } from "./generatePDF"; // Import the new function
import "./DataTable.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_URL } from "../constants";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const DataTable = ({ columns, data }) => {
    const [showTable, setShowTable] = useState(false);
    const [companyDetails, setCompanyDetails] = useState(null);
    const [excDetails, setExcDetails] = useState(null);
    const [contractNotes, setContractNotes] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");

    const handleRunReport = async () => {
        setShowTable(true);
        await fetchData(selectedDate);
    };

    const fetchData = async (date) => {
        try {
            const formattedDate = formatDate(date);
            const endpoint = `${BASE_URL}/api/contract_notes?p_transaction_date=${formattedDate}`;
    
            const [companyResponse, excResponse, contractNotesResponse] = await Promise.all([
                axios.get(`${BASE_URL}/api/company_details`),
                axios.get(`${BASE_URL}/api/exc_details`),
                axios.get(endpoint),
            ]);
    
            console.log("API Response - Company Details:", companyResponse.data); // Debug
            setCompanyDetails(companyResponse.data[0]); // Ensure correct indexing
            setExcDetails(excResponse.data);
            setContractNotes(contractNotesResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    

    const generateAllPDFs = async () => {
        try {
            const zipBlob = await generateAllPDFsAsZIP(contractNotes, companyDetails, excDetails);

            const link = document.createElement("a");
            link.href = URL.createObjectURL(zipBlob);
            link.download = "Contract_Notes.zip";
            link.click();
        } catch (error) {
            console.error("Error generating PDFs:", error);
        }
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
                            style={{ minHeight: "40px", fontWeight: "500" }}
                        >
                            {showTable ? "Rerun Report" : "Run Report"}
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
                        onClick={generateAllPDFs}
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

DataTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
};

export default DataTable;
