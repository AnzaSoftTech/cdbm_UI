// src/App.js
import React, { useEffect, useState, useRef  } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { ProgressBar, Form, Button, Alert } from 'react-bootstrap';
import '../../CommonCss.css'; // Import custom styles
import ErrorLogPopup from './TradeFile_Log';
import Client_Missing_Exc_Link_Popup from './ClientNot_Exc_Link_Popup';
import Client_Popup from './clientPopUp'
import ConfirmationBox from './ConfirmationBox'; 
import AuctionTable from './autionPopUp';  
import { BASE_URL } from ".././constants";
import ProcessingDialog from './ProcessingDialog';

//import './Busyicon.css'

//import Table from 'react-bootstrap/Table';

function FileUpload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [isButtonDisabled_ClntExcLink, setIsButtonDisabled_ClntExcLink] = useState(false);
  const [isButtonDisabled_client, setIsButtonDisabled_client] = useState(false);
  const [isButtonDisabled_auction, setIsButtonDisabled_auction] = useState(false);
  const [exch_cd, setExch_cd] = useState('N');
  const [segment, setSegment] = useState('C');
  const [date, setDate] = useState('');
  const [data, setData] = useState([]);
  const [show_auct_price, setShow_auct_price] = useState(false);
  const [showViewlogPopup, setShowViewlogPopup] = useState(false);
  const [showClntExcLinkPopup, setShowClntExcLinkPopup] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedRadioOpt, setSelectedRadioOpt] = useState('');
  const [isTradeFileUploaded, setIsTradeFileUploaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const[ClientPopup,setShowClientPopup] = useState(false);
  const[AuctionPopup,setShowAuctionPopup] = useState(false);
  const [wrongClients, setWrongClients] = useState(['','']);
  const fileInputRefSB = useRef(null);
  
  const handle_radio_change = (e) => {
    setSelectedRadioOpt(e.target.value);
    if (e.target.value === "FTP") {
      setShow_auct_price(true);
    }
    else {
      setShow_auct_price(false);
    }
  }

  // const handleRowSelect = () => {
  //   setShowViewlogPopup(false);
  // }

  const handleRowSelect = () => {
    setShowViewlogPopup(false);
  }

  const handleClntNotLinked = () => {
    setShowClntExcLinkPopup(false);
  }

  const handleClient = () => {
    setShowClientPopup(false);
  }

  const handleAuction = () => {
    setShowAuctionPopup(false);
  }


  const [message, setMessage] = useState('');

  const [sb_lastupd_date, setLastUpload_Date] = useState([]);
  const [sb_lastupd_status, setLastUpload_Status] = useState([]);

  const [oblig_upd_date, setOblig_Upd_Date] = useState([]);
  const [oblig_status, setOblig_Status] = useState([]);
  const [tradeFileName, setTradeFileName] = useState("");

  const onSaudaFileSelect = e => {
    setFiles(e.target.files);
    setTradeFileName(e.target.files[0]);
  };

  //const handlecloseselect = () => {setShowViewlogPopup(false)}


  const getCurrDate = () => {
    var today = new Date();
    alert("Hello in currdate");
    document.getElementById("tran_date").value = today.getDate();
  }
  //alert({exch_cd});

  useEffect(() => {

    //axios.get('http://localhost:3001/api/last_upd_date_status').then
    // axios.get(`${BASE_URL}/api/last_upd_date_status`).then
    //   (response => {
    //     setLastUpload_Date(response.data[0].last_upld_datetime); setLastUpload_Status(response.data[0].last_status);
    //     setOblig_Upd_Date(response.data[1].last_upld_datetime); setOblig_Status(response.data[1].last_status)
    //   })
    //   .catch(error => { console.error("Error in calling sauda_upload_history", error) })
    onpageload();
  }, []);

  const onpageload = async () => {
    try {
      fileInputRefSB.current.value = '';
      setSelectedRadioOpt('');
      setShow_auct_price(false);
    axios.get(`${BASE_URL}/api/last_upd_date_status`).then
      (response => {
        setLastUpload_Date(response.data[0].last_upld_datetime); setLastUpload_Status(response.data[0].last_status);
        setOblig_Upd_Date(response.data[1].last_upld_datetime); setOblig_Status(response.data[1].last_status);
      })
      .catch(error => { console.error("Error in calling sauda_upload_history", error) });
    }
    catch (err) {
      console.error(err);
    }

  }


  const fetchData = async () => {
    try {
      //alert('Val:'+ segment.toString());
      const response = await axios.get('http://localhost:3001/api/sauda_metadata', {
        params: { exch_cd, segment },
        //params: { type, section, date },
      });
      setData(response.data);

    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();

    //alert('hi');
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
      console.log('files', formData)
    }
    try {
      const res = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }

      });

      setMessage('Files Uploaded Successfully');
      alert('Files Uploaded Successfully');
      //setTimeout(() => setUploadPercentage(0), 10000);
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
      //setUploadPercentage(0);
    }
  };


  const btn_trade_file_upld_click = async e => {
    e.preventDefault();
    const formData = new FormData();
    const tradefileinput = document.getElementById('formFileSm');
    
    //console.log('tradeFileName===> ', tradeFileName.name);

    if (!selectedRadioOpt) {
      alert('Please select File Type to upload!');
      return;
    }

    if (tradefileinput.files.length === 0) {
      alert('Please select trade file to upload!');
      return;
    }
    //alert('files.length => ', files.length);

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
      //alert('inside for loop files[i] => ', files[i]);
      //console.log('files ===> ',formData)
    }
    try {
      //'http://localhost:3001/upload'
      const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Trade File Uploaded Successfully');
      alert('Trade File Uploaded Successfully');
      setIsTradeFileUploaded(true);
      //setTimeout(() => setUploadPercentage(0), 10000);
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
      //setUploadPercentage(0);
    }
  };

  const btn_auction_click = async e => {

    const response = await axios.get(`${BASE_URL}/api/chk_auct_price_exists`,);

    if (response.data.message === '0') 
    {
        alert('Upload Auction Price File !');
        return;
    }

    const isConfirmed = window.confirm("Latest Auction Price File uploaded ?");

    if (!isConfirmed)
    {
      return;
    }

    setShowAuctionPopup(true);
  }

  // ***********************************************************************************************************
  // ***********************************************************************************************************
  //   Start : Auction Price Related Codes
  // ***********************************************************************************************************
  // ***********************************************************************************************************

  /// below event will be called on auction price file selection
  const onAuctPriceFileSelect = e => {
    setFiles(e.target.files);
  };

  const btn_auct_upld_click = async e => {
    e.preventDefault();
    const formData = new FormData();

    const tradefileinput = document.getElementById('auctpricefile');

    if (tradefileinput.files.length === 0) {
      alert('Please select Auction Price file to upload!');
      return;
    }


    //formData.append('files', files);
    //formData.append('files', obligfiles);

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    try {
      // 'http://localhost:3001/auct_price_upload'
      const res = await axios.post(`${BASE_URL}/api/auct_price_upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // 'http://localhost:3001/process-auct-price'
      const res_auct = await axios.post(`${BASE_URL}/api/process-auct-price`);

      //setMessage('Trade File Uploaded Successfully');
      alert('Auction Price File Uploaded and inserted Successfully');
      //setTimeout(() => setUploadPercentage(0), 10000);
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
      //setUploadPercentage(0);
    }
  };



  // ***********************************************************************************************************
  // ***********************************************************************************************************
  //   End : Auction Price Related Codes
  // ***********************************************************************************************************
  // ***********************************************************************************************************


  // ***********************************************************************************************************
  // ***********************************************************************************************************
  //   Start : Obligation Related Codes
  // ***********************************************************************************************************
  // ***********************************************************************************************************

  /// below event will be called on obligation file selection
  const onObligFileSelect = e => {
    setFiles(e.target.files);
    //setObligFiles(e.target.obligfiles);
  };

  /// below event will be called on Upload button click

  const btn_oblg_upld_click = async e => {
    e.preventDefault();
    // const fileinput = document.getElementById('btn_obligation');  //file_oblig
    // alert('fileinput => ', fileinput);

    // if (!fileinput || fileinput.files.length === 0) {
    //   alert('Please Select Obligation File !');
    //   return;
    // }
    const formData = new FormData();

    //formData.append('files', files);
    //formData.append('files', obligfiles);

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    try {
      // 'http://localhost:3001/oblig_file_upload'
      const res = await axios.post(`${BASE_URL}/api/oblig_file_upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Trade File Uploaded Successfully');
      alert('Obligation File Uploaded Successfully');
      //setTimeout(() => setUploadPercentage(0), 10000);
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
      //setUploadPercentage(0);
    }
  };

  const btn_Obligation_Click = async () => {
    try {
      // 'http://localhost:3001/process-obligation'
      const response = await axios.post(`${BASE_URL}/api/process-obligation`);
      alert(response.data.message);

    } catch (error) {
      console.error("Error loading obligation:", error);
      alert('Error loading files');
    }
  };


  // ***********************************************************************************************************
  // ***********************************************************************************************************
  //                End : Obligation Related Codes
  // ***********************************************************************************************************
  // ***********************************************************************************************************

  //--- Processing Trade File
  const handleProcessTradeFileClick = async (selectedRadioOpt, isTradeFileUploaded) => {
    try {

      const tradefileinput = document.getElementById('formFileSm');

      if (!date) {
        alert('Please enter Trade Date!');
        return;
      }

      if (!selectedRadioOpt) {
        alert('Please select File Type to upload!');
        return;
      }

      if (tradefileinput.files.length === 0) {
        alert('Please select trade file to upload!');
        return;
      }

      if (!isTradeFileUploaded) {
        alert('Please Upload the selected Trade !');
        return;
      }

      const isConfirmed = window.confirm("Sure you want to process the file ?");

      if (!isConfirmed)
      {
        return;
      }

      setIsProcessing(true);

      // `http://localhost:3001/process-trade-file
      const response = await axios.post(`${BASE_URL}/api/process-trade-file?selectedRadioOpt=` + selectedRadioOpt + `&TradeDate=` + date + `&TradeFileName=` + tradeFileName.name);
      const reply = response.data.message;
      setIsProcessing(false);
      onpageload();
console.log('reply => ', reply);
      if (reply === "0") {
        alert('Trade File Processed succussfully !');
        
      }
      else if (reply === "1") {
        alert('Trade File Process is already running. Please try processing file later!');
        
      }
      else if (reply === "18") {
        
        setIsButtonDisabled_ClntExcLink(false); 
        
      }
      else if (reply === "51") {
        
        setIsButtonDisabled_client(false);
      }
      else if (reply === "55") {
        alert('Auction Trade Found, please allocate Auction Client/Qty and re-upload the Trade file !');
        
      }
      else {
        alert('Error Processing Trade File !');
        
      }

      //setShowModal(true); /// show confirmation box 
    } catch (error) {
      setIsProcessing(false);
      console.error("Error loading file:", error);
      alert('Error loading file');
      setIsButtonDisabled_ClntExcLink(true);
      setIsButtonDisabled_client(true);
    }
  };

  // const handleConf_Process_Trade = async () => {
  //   setShowModal(false); // Hide the confirmation box
  //   try {
  //     const response = await axios.post(`http://localhost:3001/process-trade-file?selectedRadioOpt=` + selectedRadioOpt + `&TradeDate=` + date + `&TradeFileName=` + tradeFileName.name);
  //     const reply = response.data.message;
  //     if (reply === "0") {
  //       alert('Trade File Processed succussfully !');
  //     }
  //     else if (reply === "1") {
  //       alert('Trade File Process is already running. Please try processing file later!');
  //     }
  //     else {
  //       alert('Error Processing Trade File !');
  //     }
  //     //alert('CSV files processed successfully');
  //   } catch (error) {
  //     alert('Error processing trade files');
  //   }
  // };



  return (
    <div className="container-common">
      <div className="card">
        <div className="card-header-css">
          <h3>Cash - Trade File Upload </h3>
        </div>
        <div className="card-body">
          <div className='display_flex'>
            <div className="form-group d-flex ">
              <h6 className='label-color-common'>Exchange</h6>
              <select className="form-control form-control-sm select_width" value={exch_cd} onChange={(e) => setExch_cd(e.target.value)}>
                {/* <option value="">Select Exchange</option> */}
                <option value="N">NSE</option>
                <option value="B">BSE</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="form-group d-flex">
              <h6 className='label-color-common'>Segment</h6>
              <select className="form-control form-control-sm select_width" value={segment} onChange={(e) => setSegment(e.target.value)} >
                {/* <option value="">Select Segment</option> */}
                <option value="C">C</option>
                <option value="P">P</option>
                {/* Add more options as needed */}
              </select>
            </div>

            <div className="form-group d-flex">
              <h6><label className='label-color-common'>Date</label></h6>
              <input id="tran_date" type="date" className=" form-control form-control-sm  select_width " value={date} onLoad={getCurrDate} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              {/* <button className="btn btn-primary btn-sm " onClick={fetchData}>Get Files</button>&nbsp; */}
              {/* <button className="btn btn-success btn-sm " onClick={handleButtonClick}>Process Files</button> */}
            </div>

          </div>

          <div>
            &nbsp;
          </div>
          {/* Trade File upload */}
          <label className='label-color-common'><b>Trade File</b></label>
          <div style={{ border: "1px solid lightgrey", padding: "15px", borderRadius: "5px", paddingLeft: "0px" }} >
            {/* <form onSubmit={handleSubmit}> */}
            <div className="form-group d-flex align-items-center me-3">          
            <input style={{ marginLeft: "15px" }} type="radio" value="TXT" name="filetype" checked={selectedRadioOpt === "TXT"} onChange={handle_radio_change}  >
              </input> &nbsp;
              <label className='label-color-common'>Txt File (.TXT)</label>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <input type="radio" value="CSV" name="filetype" checked={selectedRadioOpt === "CSV"} onChange={handle_radio_change} >
              </input> &nbsp;
              <label className='label-color-common'>CSV File (.CSV)</label>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <input type="radio" value="FTP" name="filetype" checked={selectedRadioOpt === "FTP"} onChange={handle_radio_change} >
              </input> &nbsp;
              <label className='label-color-common'>FTP File (.CSV)</label>
              {/* <p>
                  select value {selectedRadioOpt}
                </p> */}
            </div>

            <div className='100%'>
  <div className="d-flex flex-wrap align-items-center mb-3">
    {/* File Input */}
    <div className="me-2 flex-grow-1 mt-4 ms-3">
      <input 
        className="form-control form-control-sm" 
        style={{ height: '35px', maxWidth: '600px' }} 
        id="formFileSm" 
        accept=".csv,.txt" 
        //onChange={onChange} 
        onChange={onSaudaFileSelect} 
        type="file" 
        ref={fileInputRefSB}
      />
    </div>

    {/* Upload Button */}
    <div className="me-2 mt-4">
      <button 
        onClick={btn_trade_file_upld_click} 
        className="btn btn-outline-primary btn-sm" 
        style={{ height: '35px', width: '150px' }}
      >
        Upload Trade File
      </button>
    </div>

    {/* Date Input */}
    <div className="me-2">
    <label style={{ display: "block" }} className='label-color-common'><h6>Last Uploaded Date</h6></label>
      <input 
        type="text" 
        id="sb_lastupd_date" 
        className="form-control form-control-sm" 
        style={{ height: '35px', width: '12rem' }} 
        readOnly 
        value={sb_lastupd_date} 
      />
    </div>

    {/* Status Input */}
    <div className="me-2">
    <label style={{ display: "block"}} className='label-color-common'><h6>Status</h6></label>
      <input 
        type="text" 
        id="sb_lastupd_status" 
        className="form-control form-control-sm" 
        style={{ height: '35px', width: '12rem' }} 
        readOnly 
        value={sb_lastupd_status} 
      />
    </div>

    {/* Process Button */}
    <div>
      <button 
        className="btn btn-success btn-sm mt-4" 
        style={{ height: '35px', width: '150px' }} 
        onClick={() => handleProcessTradeFileClick(selectedRadioOpt, isTradeFileUploaded)}>Process Trade File</button>
        {isProcessing && <ProcessingDialog isOpen={isProcessing} />}
    </div>
  </div>
</div>

            {/* Auction Price upload */}
            {show_auct_price && <div style={{ marginLeft: "5px" }} id="div_auct_price" >
              <label style={{ marginLeft: "15px" }} className='label-color-common'>Auction Price File</label>
              <div className="mb-3 d-flex form-control" style={{ border: "1px solid lightgrey", padding: "15px", borderRadius: "5px", paddingLeft: "0px" }}>
                <label style={{ display: "block" }}>&nbsp;&nbsp;</label>
                <input className="form-control form-control-sm me-2 select_file_upl_width" style={{ height: '35px', width: '600px' }} id="auctpricefile" accept=".csv,.txt" onChange={onAuctPriceFileSelect} type="file" />
                <button onClick={btn_auct_upld_click} className="btn btn-outline-primary btn-sm ml-1" style={{ height: '35px', width: '180px' }}>Upload Auction File</button>
                &nbsp;&nbsp;
              </div>
            </div>
            }
            {/* Trade Log files view */}
            <div>
              <button id="btn_view_log" style={{ marginLeft: "15px" }} className="btn btn-primary" onClick={() => setShowViewlogPopup(true)} >View Trade Log</button>
              {showViewlogPopup && <ErrorLogPopup onCloseClick={handleRowSelect} />}
              &nbsp;
              <button id="btn_view_log" className="btn btn-warning text-white" onClick={() => setShowClntExcLinkPopup(true)} disabled={isButtonDisabled_ClntExcLink}>Client Not Linked</button>
              {showClntExcLinkPopup && <Client_Missing_Exc_Link_Popup onCloseClick={handleClntNotLinked} />}
              &nbsp;
              {/* <button id="btn_view_log" className="btn btn-secondary" onClick={() => setShowClientPopup(true)} disabled={isButtonDisabled_client}>Client</button>
              {ClientPopup && <Client_Popup onCloseClick={handleClient}    wrongClients={wrongClients} />}
              &nbsp; */}
              <button id="btn_view_log" className="btn btn-danger" onClick={btn_auction_click} disabled={isButtonDisabled_auction}>Auction</button>
              {AuctionPopup && <AuctionTable onCloseClick={handleAuction}     />}
            </div>
            {/* </form>     */}
          </div>

          {/* Obligation upload */}
          <div>
            &nbsp;
          </div>
          <div id="div_obligation" className="100%">
  <label className='label-color-common'><b>Obligation File</b></label>
  <div className="d-flex flex-wrap align-items-center mb-3 p-3" style={{ border: "1px solid lightgrey", borderRadius: "5px" }}>
    {/* File Input */}
    <div className="me-2 flex-grow-1">
      <input 
        className="form-control form-control-sm" 
        style={{ height: '35px', maxWidth: '600px' }} 
        id="inputobligfile" 
        accept=".csv" 
        onChange={onObligFileSelect} 
        type="file" 
      />
    </div>

    {/* Upload Button */}
    <div className="me-2">
      <button 
        onClick={btn_oblg_upld_click} 
        className="btn btn-outline-primary btn-sm" 
        style={{ height: '35px', width: '150px' }}
      >
        Upload Obligation
      </button>
    </div>

    {/* Date Input */}
    <div className="me-2">
      <input 
        type="text" 
        id="oblig_upd_date" 
        className="form-control form-control-sm" 
        style={{ height: '35px', width: '12rem' }} 
        readOnly 
        value={oblig_upd_date} 
      />
    </div>

    {/* Status Input */}
    <div className="me-2">
      <input 
        type="text" 
        id="oblig_status" 
        className="form-control form-control-sm" 
        style={{ height: '35px', width: '12rem' }} 
        readOnly 
        value={oblig_status} 
      />
    </div>

    {/* Load Obligation Button */}
    <div>
      <button 
        id="btn_obligation" 
        className="btn btn-success btn-sm" 
        style={{ height: '35px', width: '150px' }} 
        onClick={btn_Obligation_Click}
      >
        Load Obligation File
      </button>
    </div>
  </div>
          </div>

        </div>
      </div>

    </div>

  );
}

export default FileUpload;
