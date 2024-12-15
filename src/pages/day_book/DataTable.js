import React, { useState } from 'react';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { Table, Button, Container, Form, Row, Col } from 'react-bootstrap';
import jsPDF from 'jspdf';
import axios from 'axios';
import 'jspdf-autotable';
// import './DataTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';



const DataTable = ({ columns, data, api }) => {
  const [branch, setBranch] = useState('');
  // const [asOnDate, setAsOnDate] = useState('');
  const [reportType, setReportType] = useState('partwise');
  const [showTable, setShowTable] = useState(false); // State variable to control table visibility

  const [filters, setFilters] = useState({
    asOnDate:''
  });

  const handleChange = (e) => {
    setFilters({
      [e.target.name]: e.target.value
    });
  };
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
  const formatAmountWithCommas = (amount) => {
    console.log('----', amount);
    // Convert amount to Indian numbering system format with commas
    return amount ? amount.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '';
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: '#data-table' });
    doc.save('Trial Balance.pdf');
  };

  const handleRunReport = async () => {
    // console.log(`Branch: ${branch}, As On Date: ${asOnDate}, Report Type: ${reportType}`);
    // const params = new URLSearchParams();
    //     //alert(JSON.stringify(filters));
    //     Object.keys(filters).forEach(key => {
    //         if (filters[key]) {
    //             params.append(key, filters[key]);
    //             //alert( filters[key]);
    //         }
    //     });
    //     console.log('Filters:', filters);
    //     //alert('Filters:', filters);
        console.log('Params:', filters.asOnDate);
        //alert('Params:' + params.toString());
        //alert(params.toString());
    // const response = await axios.get(api)
    // console.log('response', response)
    // console.log('api', api)
    try {
      // const response = 
      // const response =  await axios.get(`${BASE_URL}/api/bal`);
        // console.log('response-->',response);
      console.log('api--->>>',api+`${filters.asOnDate}`)

    } catch (err) {
        console.error(err);

    }
    setShowTable(true); // Show table when report is run
  };

  return (
    <Container className="align-items-center">
      <Row className="mb-3">

        <Col xs={6} md={4}>
          <Form.Group controlId="asOnDate">
            <Form.Label>As On Date</Form.Label>
            <Form.Control type="date" name="asOnDate" 
            value={filters.asOnDate} onChange={handleChange} size="sm" />
          </Form.Group>
        </Col>
        <Col xs={6} md={4} style={{ display: 'flex' }}>
          <Form.Check
            type="radio"
            label="Partwise"
            name="reportType"
            value="partwise"
            id="partwiseRadio"
            checked={reportType === 'partwise'}
            onChange={(e) => setReportType(e.target.value)}
            className="mr-3"
          />
          <Form.Check
            type="radio"
            label="Total"
            name="reportType"
            value="total"
            id="totalRadio"
            style={{ marginLeft: '5%' }}
            checked={reportType === 'total'}
            onChange={(e) => setReportType(e.target.value)}
          />
        </Col>
      </Row>
      {/* <Row className="mb-3">
        
      </Row> */}
      <Row className="mb-3">
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
          <Table bordered style={{ "width": "auto" }} className='table-hover' {...getTableProps()} id="data-table">
            {/* Table headers */}
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ width: column.id === 'paticular' ? '1000px' : (column.id === 'bal_debit' || column.id === 'bal_credit' ? '200px' : 'auto') }} className="custom-header">
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
                        {cell.column.id === 'debit' || cell.column.id === 'credit'
                          ? formatAmountWithCommas(cell.value)
                          : cell.render('Cell')}
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
