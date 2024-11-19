// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { ProgressBar, Form, Button, Alert } from 'react-bootstrap';
import './MasterFileUpload.css'; // Import custom styles
//import Table from 'react-bootstrap/Table';
import { BASE_URL } from ".././constants";
import ProcessingDialog from './ProcessingDialog';

function MasterFileUpload() {
  const [exch_cd, setExch_cd] = useState('N');
  const [segment, setSegment] = useState('C');
  const [date, setDate] = useState('');
  const [data, setData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(Array(data.length).fill(false));
  const [isProcessing, setIsProcessing] = useState(false);

  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  
  const onChangeMasterInput = (e, index) => {
    setFiles(e.target.files);

  };

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 10);
    setDate(formattedDate);
  }, []);

  const fetchMasterFileData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/sauda_metadata`, {
        params: { exch_cd, segment },
      });
      setData(response.data);
    } catch (err) {
      console.error(err);
    }
  };



  const onSubmitMasterFile = async (index,filecd) => {
    //e.preventDefault();
    
    const fileInput = document.getElementById(`formFileSm_${index}`);
    if (fileInput.files.length === 0) {
      alert('File not selected !'); // Set error state if no file selected
      return;
    }
    
    
    //filename.target.value = fileInput.target.files[0];
    var file_name = '';
    const formData = new FormData();
    //alert("files cd----",filecd)
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
      file_name = files[i].name;
     //console.log('files[i] ', files[i].name);
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/MasterFileupload?filecd=`+filecd+`&filename=`+file_name, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }

      });
      //console.log(`File ${files[i].name} uploaded successfully`);
      setMessage('Files Uploaded Successfully');
      alert('Files Uploaded Successfully');
      setFiles([]);
      const newUploadStatus = [...uploadStatus];

      newUploadStatus[index] = true; // Set upload status to true for the clicked row
      setUploadStatus(newUploadStatus);
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
  // //---settlement_master csv file 
  const handleMasterFileButtonClick = async () => {

    const isConfirmed = window.confirm("Sure you want to process the Master file ?");

      if (!isConfirmed)
      {
        return;
      }

    setIsProcessing(true);

    const filecd = 'SETTLE'; 
    try {
      const  response= await Promise.all([
        //alert('hiii'),
        axios.post(`${BASE_URL}/api/insert-settlement-master-stag?filecd=${filecd}`),
        axios.post(`${BASE_URL}/api/insert-bhav-copy-stag`),
        axios.post(`${BASE_URL}/api/insert-var-file-stag`),
        axios.post(`${BASE_URL}/api/insert-corp_action-stag`),
        axios.post(`${BASE_URL}/api/insert-scrip_master-stag`),
      ]);
     // console.log('before calling exec_db_proc')
      const status = await axios.post(`${BASE_URL}/api/exec_db_Procedure`);
      setIsProcessing(false);

     // console.log('status ===> ', status);
      if (status.data.message === "0")
      {
        alert('Master file(s) processed successfully');
      }
      else
      {
        alert('DB Error processing Master file(s) ');
      }

      fetchMasterFileData();

      
      // if (response.data[0].message === 0)
      //   {
      //      alert('Incorrect Settlement Master');
      //      const status = await axios.post(`http://localhost:3001/exec_error_log_DB?file_cd='SETTLE'`);
      //   }
      setUploadStatus(false);
    } catch (error) {
      setIsProcessing(false);
      console.error("Error loading files:", error);
      alert('Error loading files');
    }
  };

  return (
    <div className="container-common">
      <div className="card">
        <div className="card-header-css">
          <h3 className="text-center">Master File Upload</h3>
        </div>
        <div className="card-body">
          <div className='d-flex flex-wrap align-items-center mb-3'>
            <div className="form-group d-flex align-items-center me-3">
              <label htmlFor="exchangeSelect" className="form-label label-color-common mb-0 me-2">Exchange:</label>
              <select id="exchangeSelect"
                className="form-control form-control-sm"
                value={exch_cd} onChange={(e) => setExch_cd(e.target.value)}>
                <option value="N">NSE</option>
                <option value="B">BSE</option>
              </select>
            </div>
            <div className="form-group d-flex align-items-center me-3">
              <label htmlFor="segmentSelect" className="form-label label-color-common mb-0 me-2">Segment:</label>
              <select id="segmentSelect"
                className="form-control form-control-sm"
                value={segment}
                onChange={(e) => setSegment(e.target.value)}>
                <option value="C">C</option>
                <option value="P">P</option>
              </select>
            </div>
            <div className="form-group d-flex align-items-center me-3">
              <label htmlFor="dateInput" className="form-label label-color-common mb-0 me-2">Date:</label>
              <input
                id="dateInput"
                type="date" 
                className="form-control form-control-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="d-flex align-items-center">
              <button className="btn btn-primary me-2 master-btn"
                onClick={fetchMasterFileData}>
                Get Files
              </button>
              <button className="btn btn-success master-btn" onClick={handleMasterFileButtonClick}>
                Process Files
              </button>
              {isProcessing && <ProcessingDialog isOpen={isProcessing} />}
            </div>
          </div>

           <div className="table-responsive mt-3">
          <table className="table table-striped table-bordered table-sm" style={{ width: "100%", height: "auto", verticalAlign: 'middle' }}>
              <thead className='table-info'>
              <tr>
                  <th style={{"width":'5rem'}}>Exc</th>
                  <th style={{"width":'5rem'}}>Seg</th>
                  <th style={{"width":'6rem'}}>File Name</th>
                  <th style={{"width":'6rem'}}>Interval</th>
                  <th hidden>Nomenclature</th>
                  <th hidden>File Type</th>
                  <th hidden>File Code</th>
                  <th style={{"width":'10rem'}}> Last Upd Date Time</th>
                  <th hidden>Folder</th>
                  <th style={{"width":'10rem'}}> Status</th>
                  <th style={{ textAlign: "left", width: "22rem" }}>Upload</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="fs-9" >
                    <td>{item.exch_cd}</td>
                    <td>{item.segment}</td>
                    <td>{item.file_name}</td>
                    <td>{item.file_interval}</td>
                    <td hidden>{item.file_nomenclature}</td>
                    <td hidden>{item.file_type}</td>
                    <td hidden>{item.file_cd}</td>
                    <td>{item.upd_date_time}</td>
                    <td hidden>{item.folder}</td>
                    <td> {item.last_status}</td>

                    <td><div className={'mb-3 d-flex'}>
                      <input className="form-control form-control-sm me-2" id={`formFileSm_${index}`} accept=".csv,.txt" 
                      onChange={(e) => onChangeMasterInput (e, index)} type="file" multiple />
                      <button onClick={() => onSubmitMasterFile(index,item.file_cd)}
                         className={`btn btn-outline-primary btn-sm ml-1 ${uploadStatus[index] ? 'btn-uploaded' : ''} `} style={{
                        backgroundColor: uploadStatus[index] ? '#28a745' : '', color: uploadStatus[index] ? '#ffffff' : ''
                      }}> {uploadStatus[index] ? 'Uploaded' : 'Upload'}</button>
                    </div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> 
        </div>
      </div>
    </div>
  );
}

export default MasterFileUpload;
