import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from ".././constants";

const PopupSearchClientName = ({ onRowSelect }) => {
    const [searchCliNameText, setSearchCliNameText] = useState('');
    const [searchData, setSearchData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/search_cliName_frm_client_master`, {
                params: {
                    p_cli_name: searchCliNameText || '',
                },
            });
            setSearchData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleRowClick = (data) => {
        onRowSelect(data.client_cd, data.name);
    };

    const columns = [
        {
            name: 'Client Codes And Names',
            selector: row => row.client_cd,
            sortable: true,
            cell: (row, index) => (
                <>
                    <div
                        style={{ display: 'flex', cursor: 'pointer', width: '100%', justifyContent: 'flex-start' }}
                        onClick={() => handleRowClick(row)}
                    >
                        <div style={{ width: '20%' }}>{row.client_cd}</div>
                        <div style={{ width: '80%', paddingLeft: '2rem' }}>{row.name}</div>
                    </div>

                </>
            ),
        }
    ];

    return (
        <div style={{ maxHeight:'25rem', overflow:'auto' }}>
            <InputGroup> 
                <FormControl
                    placeholder="Search Client Name"
                    value={searchCliNameText}
                    onChange={(e) => setSearchCliNameText(e.target.value)}
                    className='me-1'
                />
                <Button variant="primary me-1" onClick={handleSearch}>Search</Button>
            </InputGroup>
            <DataTable columns={columns} data={searchData} />
        </div>
    );
};

export default PopupSearchClientName;

