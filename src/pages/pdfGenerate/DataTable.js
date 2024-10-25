import React, { useState } from 'react';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { Table, Button, Container, Form, Row, Col } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MyPDFDocument from './generatePDF';  // Import from the new file
import './DataTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const DataTable = ({ columns, data }) => {
    const [accountName, setAccountName] = useState('');
    const [showTable, setShowTable] = useState(false);

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

    const handleRunReport = () => setShowTable(true);

    return (
        <Container className="align-items-center">
            <Row className="pt-5 mb-3">
                <Col xs={12} md={6} className="d-flex align-items-center">
                    <Form.Label className="margin-right mb-0 label-color-common" style={{ width: "25%" }}>Settlement No:</Form.Label>
                    <Form.Control
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        size="sm"
                    />
                </Col>
                <Col xs={12} md={6} className="d-flex align-items-center">
                    <Form.Label className="margin-right mb-0 label-color-common" style={{ width: "25%" }}>Select Date: </Form.Label>
                    <Form.Control
                        type="date"
                        size="sm"
                    />
                </Col>
            </Row>

            <Row className="mb-3 button-align">
                <Col>
                    <Button variant="primary" onClick={handleRunReport} className="mr-2 custom-header">
                        Run Report
                    </Button>

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
