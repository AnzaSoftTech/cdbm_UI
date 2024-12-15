import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PopupCss.css'; // Adjust the path as per your file structure
import { BASE_URL } from ".././constants";

function EditSegPopup({ onClose ,onRowSelect }) {
    const [searchResults, setSearchResults] = useState([]);
    const [searchBookType, setSearchBookType] = useState('');

    useEffect(() => {
        // Fetch segment data if needed
        axios.get(`${BASE_URL}/api/serach_segment`)
            .then(response => {setSearchResults(response.data);
                // Handle segment data
            })
            .catch(error => console.error('Error fetching segment:', error));

        // clearSegment();  // Initialize form
    }, []);

    // const handleSearch = async () => {

    //     try {
    //         const response = await axios.get('http://localhost:3001/api/serach_segment');
    //         setSearchResults(response.data);
    //         console.log('response.data ==> ', response.data);
    //     } catch (error) {
    //         console.error('Error searching vouchers:', error);
    //     }
    // };

    const handleSendData = (selectedRow) => {
        //console.log('Sending Selected Row:', selectedRow);
        try {
           onRowSelect(selectedRow.seg_code, selectedRow.std_val, selectedRow.seg_name, selectedRow.seg_start_date, selectedRow.seg_end_date);
    
            //onRowSelect(response.data);    
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };
    

    return (
        <div className="popup">
            <div className="popup-inner">
                <h5 className='header_color_search' style={{ textAlign: 'left', marginTop: '10px', marginLeft: '10px' }}>Edit Segment</h5>

                {/* <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex">
                        <label style={{width:'150px', marginLeft:'8px'}}>Account No:</label>
                        <input type="text" className="form-control accountName_input mb-3" value={searchAccountNo} 
                         onChange={(e) => setSearchAccountNo(e.target.value)} size="sm" />
                    </div>
                </div> */}
                <div className='table-container' style={{height: '1000px'}}>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Segment Code</th>
                                <th>Standard Value</th>
                                <th>Segment Name</th>
                                <th >Start Date</th>
                                <th >End Date</th>
                            </tr>

                        </thead>
                        <tbody>
                            {searchResults.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.seg_code}</td>
                                    <td>{result.std_val}</td>
                                    <td>{result.seg_name}</td>
                                    <td>{result.seg_start_date}</td>
                                    <td>{result.seg_end_date}</td>                       
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

               
            </div>
            <button className="btn btn-secondary close_btn" onClick={onClose} style={{float: 'left'}}>Close</button>
        </div>
    );
}

export default EditSegPopup;
