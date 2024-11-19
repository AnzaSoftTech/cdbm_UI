import React, { useMemo,useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from './DataTable';
import { Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import './l_mainapp.css';
function formatIndianRupees(amount) {
  // Convert amount to number
  const numericAmount = parseFloat(amount);

  // Check if numericAmount is NaN or not
  if (isNaN(numericAmount)) {
      return amount; // Return original value if not a number
  }

  // Format numericAmount with commas
  return numericAmount.toLocaleString('en-IN');
}


function PDF_FILE() {
  const [items,] = useState([]);
  useEffect(() => {
    // fetchItems();
  }, []);

//   const fetchItems = async () => {
//     const response = await axios.get('http://localhost:3001/api/ledger');
//     setItems(response.data);
//   };

const exportToPDFAll = () => {
    const doc = new jsPDF();

    // Add some text to the PDF
    doc.text('Ledger', 20, 10);

    // Adding table data from the API response
    doc.autoTable({
      startY: 20,
      head: [['Date', 'Vachour No', 'Particular','Debit Amount','Credit Amount','Balance Amount ']], // Replace with your actual headers
      body: items.map(item => [item.date, item.vchr_no, item.particular,item.debit_amount, item.credit_amount, item.balance_amount]), // Replace with your actual data fields
    });
    doc.save('sample_report.pdf');
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
        align: 'left',
      },
      {
        Header: 'Vachour No',
        accessor: 'vchr_no',
        align: 'left',
      },
      {
        Header: 'Particular',
        accessor: 'particular',
        align: 'left',
      },
      {
        Header: 'Debit Amount',
        accessor: 'debit_amount',
        Cell: ({ value }) => formatIndianRupees(value),
        
      },
      {
        Header: 'Credit Amount',
        accessor: 'credit_amount',
        Cell: ({ value }) => formatIndianRupees(value),
      },
      {
        Header: 'Balance Amount',
        accessor: 'balance_amount',
        Cell: ({ value }) => formatIndianRupees(value),
      },
    ],
    []
  );

  // const data = useMemo(
  //   () => [
  //     { bal_paticular: 'John Doe', bal_debit: 28000, bal_credit: null },
  //     { bal_paticular: 'Jane Smith', bal_debit: null, bal_credit: 30000 },
  //     { bal_paticular: 'Alice Johnson', bal_debit: 4500, bal_credit: null },
  //     // Add more data as needed
  //   ],
  //   []
  // ); 

  return (
    <div className="container-common">   
    <div className='card'>
    <div className=" card-header-css">
      <h3>PDF GENERATE </h3>
    </div>        
      <DataTable columns={columns} data={items} />
      <div hidden><Button variant="primary" onClick={exportToPDFAll}>
        Api PDF
      </Button></div>
    </div>
    </div> 

  );
}

export default PDF_FILE;