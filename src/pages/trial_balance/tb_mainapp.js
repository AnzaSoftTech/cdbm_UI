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
      head: [['Particular', 'Debit', 'Credit']], // Replace with your actual headers
      body: items.map(item => [item.bal_paticular, item.bal_debit, item.bal_credit]), // Replace with your actual data fields
    });
    doc.save('sample_report.pdf');
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Particular',
        accessor: 'bal_paticular',
        align: 'left',
      },
      {
        Header: 'Debit',
        accessor: 'bal_debit',
        Cell: ({ value }) => formatIndianRupees(value),
       
      },
      {
        Header: 'Credit',
        accessor: 'bal_credit',
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
    <div className="container">    
    <div className="text-center">
      <h1>Trial Balance</h1>
    </div>         
      <DataTable columns={columns} data={items} />
      <div hidden><Button variant="primary" onClick={exportToPDFAll}>
        Api PDF
      </Button></div>
    </div>

  );
}

export default TB_MainApp;
