import React, { useState } from 'react';
import axios from 'axios';
import './PopupCss.css'; // Adjust the path as per your file structure
import { BASE_URL } from ".././constants";

function EditPopup({ onClose ,onRowSelect }) {

    const [searchFamGrp, setSearchFamGrp] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    

    const handleSearch = async () => {

        try {
            const response = await axios.get(`${BASE_URL}/api/search_family_grp`, {
                params: {
                    p_fam_grp: searchFamGrp || '', 
                }
            });
            setSearchResults(response.data);
            // console.log('response.data ==> ', response.data);
           // console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error searching family group:', error);
        }
    };

    const handleSendData = async(selectedRow) => {
        //console.log('Sending Selected Row:', selectedRow);
    
        try {
            const response = await axios.get(`${BASE_URL}/api/search_family_grp_ById`, {
                params: {
                    p_fam_grp_cd:selectedRow.fam_grp_cd || ''
                }
            });

            //console.log('API response data:', response.data);
            // Pass the selected row to the main component
            onRowSelect(response.data);
            // console.log('response.data',response.data);
    
        } catch (error) {
            console.error('Error searching family group:', error);
        }
    };
    

    return (
        <div className="popup">
            <div className="popup-inner">
                <h4 className='header_color_search'>Edit Family Group</h4>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex ">
                        <label style={{width:'150px', marginLeft:'8px'}} >Fam Grp Name</label>
                            <input type="text" className="form-control me-1 mb-3" value={searchFamGrp} 
                             onChange={(e) => setSearchFamGrp(e.target.value)} size="sm" />
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button style={{width:'150px', height:'40px'}} className="btn btn-primary me-3 btn-sm"
                         onClick={handleSearch} >Search</button>
                    </div>
                </div>
               
                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Family Group Name</th>
                                {/* <th>Add Date</th> */}
                                {/* <th >Update Date</th> */}
                                <th hidden>fam_grp_cd</th>
                            </tr>

                        </thead>
                        <tbody>
                            {searchResults.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.fam_grp_name}</td>
                                    {/* <td>{result.add_date}</td> */}
                                    {/* <td>{result.upd_date}</td> */}
                                    <td hidden>{result.fam_grp_cd}</td>
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
