import React, { useState } from 'react';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { Table, Button, Container, Form, Row, Col } from 'react-bootstrap';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import './DataTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// PDF styles
const styles = StyleSheet.create({
    page: {
        padding: 13,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        fontSize: 7, // Font size for header text
        marginBottom: 2, // Space between lines
        textAlign: 'center', // Center text for the middle section
    },
    leftText: {
        fontSize: 5, // Font size for left text
        textAlign: 'left', // Align left text to the left
        marginBottom: 2, // Space between lines for left text
    },
    righttext: {
        fontSize: 5, // Font size for left text
        textAlign: 'right', // Align left text to the left
        marginBottom: 2, // Space between lines for left text
    },
    row: {
        flexDirection: 'row', // Align items in a row
        justifyContent: 'space-between', // Space between left and center content
        alignItems: 'flex-start', // Align items at the top
        width: '100%', // Full width
        marginBottom: 10, // Space between this row and the next element
    },
    line: {
        borderBottomWidth: 1, // Thickness of the line
        borderBottomColor: 'black', // Line color
        marginVertical: 2, // Space above and below the line
        width: '100%', // Full width of the page
    },
});

// Custom PDF document
const MyPDFDocument = ({ tableData }) => (
    <Document>
        <Page style={styles.page} size="A4" orientation="landscape">  {/* Landscape mode */}

            {/* Display left-side text and middle text at the top */}
            <View fixed style={styles.row}>

                {/* Left side text */}
                <View style={{ width: '40%' }}>
                    <Text style={styles.leftText}>Regd. Office: 304, Samarpan, New Link Road,</Text>
                    <Text style={styles.leftText}>Chakala, Andheri East, Mumbai - 400 099.</Text>
                    <Text style={styles.leftText}>Tel: 022-28316600, Fax: 022 2831 6605,</Text>
                    <Text style={styles.leftText}>Email: sodhani.vt@gmail.com</Text>
                    <Text style={styles.leftText}>Grievance Email: sodhani.relations@gmail.com</Text>
                    <Text style={styles.leftText}>Director: Anil Sodhani / Anand Sodhani</Text>
                    <Text style={styles.leftText}>Auth. Sign: Aditya Sodhani / Roopam Sodhani</Text>
                </View>



                {/* Middle text */}
                <View style={{ width: '90%', alignItems: 'center' }}>
                    <Text style={styles.header}>CONTRACT NOTE CUM TAX INVOICE</Text>
                    <Text style={styles.header}>(TAX INVOICE UNDER SECTION 31 OF GST ACT)</Text>
                    <Text style={{ fontSize: 11, textAlign: 'center' }}>SODHANI SECURITIES LTD</Text>
                    <Text style={styles.header}>MEMBER: NATIONAL STOCK EXCHANGE OF INDIA LTD</Text>
                    <Text style={styles.header}>SEBI REGN. NO. INZ000242534 • TRADING CODE NO: 23/10245 • CM BP ID: IN554382</Text>
                    <Text style={styles.header}>CIN: U67120MH1997PLC108674 • GSTIN: 27AABCS • PAN NO AABCS9766K</Text>
                    <Text style={styles.header}>Compliance Officer: Anil Sodhani • Phone: 022-2831 6600 • Email: sodhani.anil@gmail.com</Text>
                </View>
                {/* right  side text */}
                <View style={{ width: '40%', alignItems: 'right' }}>
                    <Text style={styles.righttext}>Revised / Supplementary</Text>
                    <Text style={styles.righttext}>Original for Recipient / Duplicate for Supplier</Text>
                    <Text style={styles.righttext}>Dealing Office Address:</Text>
                    <Text style={styles.righttext}>304, Samarpan, New Link Road,</Text>
                    <Text style={styles.righttext}>Chakala, Andheri East,</Text>
                    <Text style={styles.righttext}>Mumbai - 400 099.</Text>
                </View>
            </View>

            {/* Horizontal line */}
            <View style={styles.line} />

            {/* Left side text */}
            <View style={{ width: '20%' }}>
                <Text style={styles.leftText}>To,</Text>
                <Text style={styles.leftText}>KISHORI GUPTA (HUF) (1K009)</Text>
                <Text style={styles.leftText}>50 VAISHNO DEVI, 40 VITHAL NAGAR</Text>
                <Text style={styles.leftText}>J V P D VILEPARLE W</Text>
                <Text style={styles.leftText}>MUMBAI 400049</Text>
            </View>
            <View style={{ width: '20%' }}>
                <Text style={styles.leftText}>Sir/Madam,</Text>
                <Text style={styles.leftText}>we have this day done by your order and on ypur account the following transaction: </Text>
            </View>


            {/* bottom Table Data */}
            <View style={{ width: '100%', position: 'absolute', bottom: 10, }} />

            <View style={{ width: '70%', position: 'absolute', bottom: 10, left: 10 }}>
                <Text style={styles.leftText}>OTHER LEVIES, IF ANY:</Text>
                <Text style={styles.leftText}>Description of Service: Brokerage & related Securities & Commodity services. Accounting Code: 997152.
                    SSL is collecting Stamp Duty & Securities Transaction Tax (STT) as a pure agent of the investor and hence the same is not considered in taxable value of supply for charging GST.
                    Transactions mentioned in this contract note cum bill shall be governed and subject to the Rules, Bye-laws, Regulations and Circulars of the respective Exchanges on which trades have been executed and Securities and Exchange Board of India issued from time to time. It shall also be subject to the relevant Acts, Rules, Regulations, Directives, Notifications, Guidelines (including GST Laws) & Circulars issued by SEBI / Government of India / State Governments
                    and Union Territory Governments issued from time to time. The Exchanges provide Complaint Resolution, Arbitration and Appellate arbitration facilities at the Regional Arbitration Centres (RAC). The client may approach its nearest centre, details of which are available on respective Exchange's website. Please visit www.nseindia.com for NSE, www.bseindia.com for BSE and www.msei.in for MSEI.
                    Date: 18 Oct, 2024. Place: Mumbai
                </Text>

            </View>


            <View style={{ width: '70%', position: 'absolute', bottom: 60, right: 10 }}>
                <Text style={styles.righttext}>Your Faithfully,for Sodhani Securities Ltd.:</Text>
            </View>
            <View style={{ width: '70%', position: 'absolute', bottom: 7, right: 10 }}>
                <Text style={styles.righttext}>Director/Authorised Signatory </Text>
                <Text style={styles.righttext}>Member: National Stock Exchange of India Ltd</Text>
            </View>



            {/* Table Data */}
            {tableData.map((row, index) => (
                <View key={index} style={{ flexDirection: 'row', width: '100%', marginBottom: 3 }}>
                    {Object.values(row).map((cell, cellIndex) => (
                        <Text key={cellIndex} style={{ marginRight: 5 }}>{cell}</Text>
                    ))}
                </View>
            ))}

        </Page>
    </Document>
);

const DataTable = ({ columns, data }) => {
    const [reportType, setReportType] = useState('partwise');
    const [accountName, setAccountName] = useState('');
    const [showTable, setShowTable] = useState(false);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        useFilters,
        useSortBy,
        usePagination
    );

    const handleRunReport = () => {
        setShowTable(true);
    };

    return (
        <Container className="align-items-center">
            <Row className="mb-3">
                <Col xs={12} md={6} className="d-flex align-items-center label-color-common">
                    <Form.Check
                        type="radio"
                        label="Party"
                        name="reportType"
                        value="part"
                        checked={reportType === 'part'}
                        onChange={(e) => setReportType(e.target.value)}
                        className="mr-3"
                        defaultChecked
                    />
                    <Form.Check
                        type="radio"
                        label="General"
                        name="reportType"
                        value="general"
                        style={{ marginLeft: '5%' }}
                        checked={reportType === 'general'}
                        onChange={(e) => setReportType(e.target.value)}
                    />
                </Col>
                <Col xs={12} md={6} className="d-flex align-items-center">
                    <Form.Label className="margin-right mb-0 label-color-common" style={{ width: "25%" }}>Account Name </Form.Label>
                    <Form.Control
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        size="sm"
                    />
                </Col>
            </Row>

            <Row className="mb-3 button-align">
                <Col>
                    <Button variant="primary" onClick={handleRunReport} className="mr-2 custom-header">
                        Run Report
                    </Button>

                    {/* PDF Download Button */}
                    {showTable && (
                        <PDFDownloadLink
                            document={<MyPDFDocument tableData={page.map(row => row.values)} />}
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
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ width: column.id === 'particular' ? '400px' : 'auto' }} className="custom-header">
                                            {column.render('Header')}
                                            <span>
                                                {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
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

            {/* Pagination and other controls (if needed) */}
        </Container>
    );
};

export default DataTable;
