import React, { useState } from 'react';
import axios from 'axios';
import './PopupCss.css'; // Adjust the path as per your file structure

function EditPopup({ onClose ,onRowSelect }) {

    const [searchCliGrp, setSearchCliGrp] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    

    const handleSearch = async () => {

        try {
            const response = await axios.get('http://localhost:3001/api/search_client_grp', {
                params: {
                    p_cli_grp: searchCliGrp || '', 
                }
            });
            setSearchResults(response.data);
            // console.log('response.data ==> ', response.data);
           // console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error searching client group:', error);
        }
    };

    const handleSendData = async(selectedRow) => {
        //console.log('Sending Selected Row:', selectedRow);
    
        try {
            const response = await axios.get('http://localhost:3001/api/search_cli_grp_ById', {
                params: {
                    p_cli_grp_cd:selectedRow.cli_grp_cd || ''
                }
            });

            //console.log('API response data:', response.data);
            // Pass the selected row to the main component
            onRowSelect(response.data);
            // console.log('response.data',response.data);
    
        } catch (error) {
            console.error('Error searching client group:', error);
        }
    };
    

    return (
        <div className="popup">
            <div className="popup-inner">
                <h4 className='header_color_search'>Edit Client Group</h4>
                <div className='d-flex b justify-content-between'>
                    <div className="form-group d-flex-row">
                        <label className='b' style={{width:'102px', marginLeft:'8px'}} >Cli Grp</label>
                            <input type="text" className="form-control me-1 mb-3" value={searchCliGrp} 
                             onChange={(e) => setSearchCliGrp(e.target.value)} size="sm" />
                    </div>
                    <div className='d-flex justify-content-end align-self-end'>
                        <button style={{width:'150px', height:'40px'}} className="btn btn-primary me-3 btn-sm"
                         onClick={handleSearch} >Search</button>
                    </div>
                </div>
               
                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Client Group Name</th>
                                {/* <th>Add Date</th> */}
                                {/* <th >Update Date</th> */}
                                <th hidden>cli_grp_cd</th>
                            </tr>

                        </thead>
                        <tbody>
                            {searchResults.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.cli_grp_name}</td>
                                    {/* <td>{result.add_date}</td> */}
                                    {/* <td>{result.upd_date}</td> */}
                                    <td hidden>{result.cli_grp_cd}</td>
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
