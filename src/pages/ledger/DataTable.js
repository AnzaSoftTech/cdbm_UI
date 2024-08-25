import React, { useState } from 'react';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { Table, Button, Container, Form, Row, Col } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './DataTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';



const DataTable = ({ columns, data }) => {
  const [reportType, setReportType] = useState('partwise');
  const [accountName, setAccountName] = useState('');
  const [showTable, setShowTable] = useState(false); // State variable to control table visibility

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: '#data-table' });
    doc.save('Ledger.pdf');
  };

  const handleRunReport = () => {
    console.log(`Report Type: ${reportType},Account Name: ${accountName}`);
    setShowTable(true); // Show table when report is run
  };

  return (
    <Container className="align-items-center">
      <Row className="mb-3">
      <Col xs={12} md={6} className="d-flex align-items-center">
          <Form.Check
            type="radio"
            label="Part"
            name="reportType"
            value="part"
            id="partRadio"
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
            id="generalRadio"
            style={{ marginLeft: '5%' }}
            checked={reportType === 'general'}
            onChange={(e) => setReportType(e.target.value)}
          />
        </Col>
        <Col xs={12} md={6} className="d-flex align-items-center">
          <Form.Label className="margin-right mb-0  " style={{width:"25%"}}>Account Name </Form.Label>
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
          <Button variant="primary" onClick={exportToPDF} style={{ marginLeft: '10px' }} className="custom-header">
            Export to PDF
          </Button>
        </Col>
      </Row>
      {showTable && ( // Render table only if showTable is true
        <div className="table-wrapper custom-table">
          <Table bordered  className='table-hover' {...getTableProps()} id="data-table">
            {/* Table headers */}
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ width: column.id === 'particular' ? '400px' : (column.id === 'date' || column.id === 'vchr_no' ? '100px' :(column.id === 'debit_amount' || column.id === 'credit_amount' || column.id === 'balance_amount' ? '100px' : 'auto'))}} className="custom-header">
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {/* Table body */}
            <tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className={`custom-row `}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()} className="custom-cell" style={{ textAlign: cell.column.align }}>
                          {console.log('Cell Value:', cell.value)} {/* Debug output */}
                          { cell.render('Cell')}
                        </td>
                      ))}
                  </tr>

                );
              })}
            </tbody>
          </Table>
        </div>
      )}
      <div className="pagination">
        <div className=''>
          <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </Button>{' '}
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </Button>{' '}
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </Button>{' '}
          <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </Button>{' '}
        </div>

        <span style={{ marginLeft: '48%' }}>
          &nbsp;Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span style={{ float: 'right' }}>
          &nbsp;| Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '60px', marginRight: '10px' }}
          />
        </span>{' '}
        &nbsp;<select style={{ height: '1.7rem', marginRight: '10px' }}
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </Container>
  );
}

export default DataTable;