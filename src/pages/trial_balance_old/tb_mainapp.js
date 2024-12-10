import React, { useMemo,useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from './DataTable';
import { Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import './tb_mainapp.css';
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


function TB_MainApp() {

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get('http://localhost:3001/api/bal');
    setItems(response.data);
  };

  const exportToPDFAll = () => {
    const doc = new jsPDF();

    // Add some text to the PDF
    doc.text('Trial Balance', 20, 10);

    // Adding table data from the API response
    doc.autoTable({
      startY: 20,
      head: [['Particular', 'Open Bal Dr', 'Open Bal Cr', 'Tran Amt Dr', 'Tran Amt Cr', 'Closing Bal Dr', 'Closing Bal Cr' ]], // Replace with your actual headers
      body: items.map(item => [item.paticular, item.open_bal_dr,, item.open_bal_cr, item.amt_dr, item.amt_cr, item.closing_dr, item.closing_cr]), // Replace with your actual data fields
    });
    doc.save('sample_report.pdf');
  };

  const columns = useMemo(
    () => [

      {
        Header: 'Particular',
        accessor: 'paticular',
        align: 'left',
      },

      {
        Header: 'Open Bal Dr',
        accessor: 'open_bal_dr',
        Cell: ({ value }) => formatIndianRupees(value),
       
      },

      {
        Header: 'Open Bal Cr',
        accessor: 'open_bal_cr',
        Cell: ({ value }) => formatIndianRupees(value),
       
      },

      {
        Header: 'Tran Amt Dr',
        accessor: 'amt_dr',
        Cell: ({ value }) => formatIndianRupees(value),
       
      },

      {
        Header: 'Tran Amt Cr',
        accessor: 'amt_Cr',
        Cell: ({ value }) => formatIndianRupees(value),
       
      },

      {
        Header: 'Closing Bal Dr',
        accessor: 'closing_dr',
        Cell: ({ value }) => formatIndianRupees(value),
       
      },

      {
        Header: 'Closing Bal Cr',
        accessor: 'closing_cr',
        Cell: ({ value }) => formatIndianRupees(value),
       
      },

      // {
      //   Header: 'Debit',
      //   accessor: 'bal_debit',
      //   Cell: ({ value }) => formatIndianRupees(value),
       
      // },
      // {
      //   Header: 'Credit',
      //   accessor: 'bal_credit',
      //   Cell: ({ value }) => formatIndianRupees(value),
        
      // },
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
       <div className="card">
           <div className="card-header-css">
           <h5>Trial Balance</h5>
          </div>
          <DataTable columns={columns} data={items} />
          <div hidden><Button variant="primary" onClick={exportToPDFAll}>
              Api PDF
           </Button></div>
        </div>
    </div>

  );
}

export default TB_MainApp;
