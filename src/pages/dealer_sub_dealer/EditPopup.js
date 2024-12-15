import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PopupCss.css'; // Adjust the path as per your file structure
import { BASE_URL } from "../constants";


function EditPopup({ onClose ,onRowSelect }) {
    const [branchNamecd, setBranchName] = useState('');
    const [voucherNo, setVoucherNo] = useState('');
    const [accountName, setAccountName] = useState('');
    // const [accountNames, setAccountNames] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [bookTypes, setBookTypes] = useState([]);
    const [bookType, setBookType] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [branches, setBranches] = useState([]);

    const [searchActTitle, setSearchAcctTitle] = useState('');
    const [searchBankName, setSearchBankName] = useState('');
    const [searchAccountNo, setSearchAccountNo] = useState('');

    const [dealerName, setDealerName] = useState();
    const [alias, setAlias] = useState();
    
    // Dropdown options (you can fetch these dynamically if needed)

    // useEffect(() => {
    //     axios.get(`${BASE_URL}/api/bookType')
    //         .then(response => setBookTypes(response.data))
    //         .catch(error => console.error('Error fetching accounts:', error));
    // }, []);

    // useEffect(() => {
    //     axios.get(`${BASE_URL}/api/Account')
    //         .then(response => setAccountNames(response.data))
    //         .catch(error => console.error('Error fetching accounts:', error));
    // }, []);
    // useEffect(() => {
    //     axios.get(`${BASE_URL}/api/branches')
    //         .then(response => {
    //             setBranches(response.data);
    //             // alert(response.data);
    //         })
    //         .catch(error => {
    //             console.error("There was an error fetching the data!", error);
    //         });
    // },
    //     []);

    useEffect(() => {
        searchDealer();
    }, []);

    const searchDealer = () => {
        axios.get(`${BASE_URL}/api/get_dealer_master`, { params: { dealerName, alias } })
            .then(response => {
                setSearchResults(response.data);
                console.log('response.data -> ', response.data);
            })
            .catch(error => {
                console.log('Error while fetching Dealer!', error);
            });
    }


    const handleSearch = async () => {
        searchDealer();
    };

    const handleSendData = async(selectedRow) => {
        //console.log('Sending Selected Row:', selectedRow);
    
        try {
            const response = await axios.get(`${BASE_URL}/api/get_dealer_master_by_id`, {
                params: {
                    dealerCode: selectedRow.dealer_cd || ''
                }
            });

            //console.log('API response data:', response.data);
            // Pass the selected row to the main component
            onRowSelect(response.data);
    
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };
    

    return (
        <div className="popup">
            <div className="popup-inner">
                <h4 className='header_color_search'>Edit Dealer/Sub-Dealer</h4>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex">
                        {/* <label className='form-label' style={{width:'100px'}} >Dealer Name</label> */}
                            <input type="text" className="form-control" value={dealerName} style={{width: '287px', marginLeft: '10px'}}
                            placeholder='Dealer Name' onChange={(e) => setDealerName(e.target.value)} size="sm" />
                    </div>
                    <div className="form-group d-flex">
                        {/* <label className='form-label' style={{width:'100px'}} >Alias</label> */}
                        <input type="text" className="form-control" value={alias} style={{width: '287px'}}
                            placeholder='Alias' onChange={(e) => setAlias(e.target.value)} size="sm" />
                    </div>
                </div>
                <div className='d-flex justify-content-between' style={{float: 'right', marginBottom: '20px'}}>
                    <div className='d-flex justify-content-end'>
                        <button style={{width:'150px', height:'40px', marginLeft: '5px'}} className="btn btn-primary me-3 btn-sm"
                         onClick={handleSearch} >Search</button>
                    </div>

                </div>
                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Dealer Name</th>
                                <th>Alias</th>
                                <th>Status</th>
                                <th hidden>Dealer Code</th>
                            </tr>

                        </thead>
                        <tbody>
                            {searchResults.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.dealer_name}</td>
                                    <td>{result.dealer_alias}</td>
                                    <td>{result.status}</td>
                                    <td hidden>{result.dealer_cd}</td>
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

export default EditPopup;
