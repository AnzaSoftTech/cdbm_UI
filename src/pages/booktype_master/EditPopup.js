import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PopupCss.css'; // Adjust the path as per your file structure
import { BASE_URL } from ".././constants";

function EditPopup({ onClose ,onRowSelect }) {
    
    const [searchResults, setSearchResults] = useState([]);
    const [searchBookType, setSearchBookType] = useState('');

    const handleSearch = async () => {

        try {
            const response = await axios.get(`${BASE_URL}/api/search_BookType`, {
                params: {
                    p_book_type: searchBookType || '', 
                }
            });
            setSearchResults(response.data);
            console.log('response.data ==> ', response.data);
           // console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };

    const handleSendData = (selectedRow) => {
        //console.log('Sending Selected Row:', selectedRow);
        try {
           onRowSelect(selectedRow.fin_year, selectedRow.book_type, selectedRow.book_type_desc,
            selectedRow.seg_code, selectedRow.jv_no, selectedRow.end_date, selectedRow.activity_code);
    
            //onRowSelect(response.data);
    
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };
    

    return (
        <div className="popup">
            <div className="popup-inner">
                <h4 className='header_color_search'>Edit Book Type</h4>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex ">
                        <label style={{width:'150px', marginLeft:'8px'}} >Book Type</label>
                            <input type="text" className="form-control me-1 mb-3" value={searchBookType} 
                             onChange={(e) => setSearchBookType(e.target.value)} size="sm" />
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button style={{width:'150px', height:'40px'}} className="btn btn-primary me-3 btn-sm"
                         onClick={handleSearch} >Search</button>
                    </div>
                </div>
                {/* <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex">
                        <label style={{width:'150px', marginLeft:'8px'}}>Account No:</label>
                        <input type="text" className="form-control accountName_input mb-3" value={searchAccountNo} 
                         onChange={(e) => setSearchAccountNo(e.target.value)} size="sm" />
                    </div>
                </div> */}
                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Fin Year</th>
                                <th>Book Type</th>
                                <th>Book Type Desc</th>
                                <th >Segment Code</th>
                                <th >Activity</th>
                                <th >JV No.</th>
                                <th hidden>End Date</th>
                                <th hidden>Act_Code</th>
                               
                            </tr>

                        </thead>
                        <tbody>
                            {searchResults.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.fin_year}</td>
                                    <td>{result.book_type}</td>
                                    <td>{result.book_type_desc}</td>
                                    <td>{result.seg_code}</td>
                                    <td>{result.actvity}</td>
                                    <td>{result.jv_no}</td>
                                    <td hidden>{result.end_date}</td>
                                    <td hidden>{result.activity_code}</td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

               
            </div>
            <button className="btn btn-secondary close_btn" onClick={onClose}>Close</button>
        </div>
    );
}

export default EditPopup;
