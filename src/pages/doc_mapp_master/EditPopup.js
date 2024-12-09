import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PopupCss.css'; // Adjust the path as per your file structure
import { BASE_URL } from ".././constants";

function EditPopup({ onClose ,onRowSelect }) {
    
    const [searchResults, setSearchResults] = useState([]);
    const [searchDocName, setSearchDocName] = useState('');   
    // const [selectedRangetableRow, setSelectedRangeTableRow] = useState(null); 
  

    const handleSearch = async () => {

        try {
            const response = await axios.get(`${BASE_URL}/api/search_doc_mapp_master`, {
                params: {
                    p_doc_name: searchDocName || '', 
                }
            });
            setSearchResults(response.data);
            // console.log('response.data ==> ', response.data);
           // console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error searching doc names:', error);
        }
    };

    const handleSendData = async(selectedRow) => {

        // setSelectedRangeTableRow(selectedRow);
        // console.log('Sending Selected Row:', selectedRow);
        // onRowSelect(selectedRow);
    
        try {
            const response = await axios.get(`${BASE_URL}/api/search_doc_mapp_Master_ById`, {
                params: {
                    p_doc_code:selectedRow.doc_code,
                }
            });

    //         console.log('API response data:', response.data[0].doc_name);
    // //         // Pass the selected row to the main component
            onRowSelect(response.data);
    
        } catch (error) {
            console.error('Error searching docs:', error);
        }
    };
    

    return (
        <div className="popup">
            <div className="popup-inner">
                <h4 className='header_color_search'>Edit Doc Mapping Master</h4>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex ">
                        <label style={{width:'150px', marginLeft:'8px'}} >Doc Name</label>
                            <input type="text" className="form-control me-1 mb-3" value={searchDocName} 
                             onChange={(e) => setSearchDocName(e.target.value.toUpperCase())} size="sm" />
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
                                <th>Doc Name</th>
                                <th hidden>doc_code</th>
                            </tr>

                        </thead>
                        <tbody>
                            {searchResults.map((row, index) => (
                                <tr key={index} onClick={() => handleSendData(row)} style={{ cursor: 'pointer' }}>
                                    <td>{row.desc}</td>
                                    <td hidden>{row.doc_code}</td>
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
