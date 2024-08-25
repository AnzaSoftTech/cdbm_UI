import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// import DataTable from './Fin_Report';
import { Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import './cnp_mainapp.css';
import CashNetPosition from './cash_net_position';

// function formatIndianRupees(amount) {
//   // Convert amount to number
//   const numericAmount = parseFloat(amount);

//   // Check if numericAmount is NaN or not
//   if (isNaN(numericAmount)) {
//       return amount; // Return original value if not a number
//   }

//   // Format numericAmount with commas
//   return numericAmount.toLocaleString('en-IN');
// }
function CNP_MainApp() {
  const [Clientitems, setClientItems] = useState([]);
    //const [Client_2_items, setClient_2_Items] = useState([]);
  


  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get('http://localhost:3004/api/client');
    setClientItems(response.data);
  };
  // const fetchItems = async () => {
  //   try {
  //     const [clientResponse, ledgerResponse] = await Promise.all([
  //       axios.get('http://localhost:3004/api/client'),
  //       axios.get('http://localhost:3004/api/ledger')
  //     ]);
  //     setClientItems(clientResponse.data);
  //     setClient_2_Items(ledgerResponse.data2);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
 // };
  

  const exportToPDFAll = () => {
    const doc = new jsPDF();

    // Add some text to the PDF
    doc.text('Client Net Position(Cash Market)', 20, 10);

    // Adding table data from the API response
    doc.autoTable({
      startY: 20,
      head: [['Client Id', 'Scrip', 'Ser.','Buy Qty','Buy Value','Sell Qty','Sell Value','Net Qty','Net Value','Trd. Date','De.Setl.No.']], // Replace with your actual headers
      body: Clientitems.map(item => [item.client_cd, item.scrip, item.series,item.buy_qty,item.buy_value,item.sell_qty, item.sell_value, item.net_qty,item.net_value,item.trd_date,item.de_setl_no]), // Replace with your actual data fields
    });

  //   // Add text for the second table
  //   // doc.text('Ledger', 20, doc.autoTable.previous.finalY + 10); // Add some space (10) after the first table

  //   // // Adding data for the second table
  //   // doc.autoTable({
  //   //     startY: doc.autoTable.previous.finalY + 20, // Start at the end of the first table + some space (20)
  //   //     head: [['Date', 'Vachour No', 'Particular','Debit Amount','Credit Amount','Balance Amount ']], // Replace with your actual headers
  //   //     body: Client_2_items.map(item => [item.date, item.vchr_no, item.particular,item.debit_amount, item.credit_amount, item.balance_amount]), // Replace with your actual data fields
  //   // });
    doc.save('Client_Net_Position.pdf');
  };

  // const columns1 = useMemo(
  //   () => [
  //     {
  //       Header: 'Client Id',
  //       accessor: 'client_id',
  //       align: 'left',
        
        
  //     },
  //     {
  //       Header: 'Scrip',
  //       accessor: 'scrip',
  //       align: 'left',
        
         
       
  //     },
  //     {
  //       Header: 'Ser.',
  //       accessor: 'series',
  //       align: 'left',
        
  //     },
      
  //     {
  //       Header: 'Buy Qty',
  //       accessor: 'buy_qty',
        
        
  //     },
  //     {
  //       Header: 'Buy Value',
  //       accessor: 'buy_value',
  //       Cell: ({ value }) => formatIndianRupees(value),
        
        
  //     },
  //     {
  //       Header: 'Sell Qty',
  //       accessor: 'sell_qty',
        
  //     },
  //     {
  //       Header: 'Sell Value',
  //       accessor: 'sell_value',
  //       Cell: ({ value }) => formatIndianRupees(value),
        
  //     },
  //     {
  //       Header: 'Net Qty',
  //       accessor: 'net_qty',
        
  //     },
  //     {
  //       Header: 'Net Value',
  //       accessor: 'net_value',
  //       Cell: ({ value }) => formatIndianRupees(value),
        
  //     },
  //     {
  //       Header: 'Trd. Date',
  //       accessor: 'trd_date',
        
  //     },
  //     {
  //       Header: 'De.Setl.No.',
  //       accessor: 'de_setl_no',
        
  //     },
      
  //   ],
  //   []
  // );
  

  ///table 2 
  // const columns2 = useMemo(
  //   () => [
  //     {
  //       Header: 'Date',
  //       accessor: 'date',
  //       align: 'left',
  //     },
  //     {
  //       Header: 'Vachour No',
  //       accessor: 'vchr_no',
  //       align: 'left',
  //     },
  //     {
  //       Header: 'Particular',
  //       accessor: 'particular',
  //       align: 'left',
  //     },
  //     {
  //       Header: 'Debit Amount',
  //       accessor: 'debit_amount',
  //       Cell: ({ value }) => formatIndianRupees(value),
        
  //     },
  //     {
  //       Header: 'Credit Amount',
  //       accessor: 'credit_amount',
  //       Cell: ({ value }) => formatIndianRupees(value),
  //     },
  //     {
  //       Header: 'Balance Amount',
  //       accessor: 'balance_amount',
  //       Cell: ({ value }) => formatIndianRupees(value),
  //     },
  //   ],
  //   []
  // );

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
      <h4 className='header-broder'>Cash Net Position(Cash Market)</h4>
    </div>         
      <CashNetPosition />
      <div hidden><Button variant="primary" onClick={exportToPDFAll}>
        Api PDF
      </Button></div>
      
    </div>

  );
}

export default CNP_MainApp;
