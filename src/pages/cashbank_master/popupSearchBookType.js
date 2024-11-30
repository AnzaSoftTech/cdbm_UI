import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from ".././constants";
// { onSelectRow }

const PopupSearchBookType = () => {
   
    const [searchBookTypeText, setSearchBookTypeText] = useState('');
    const [searchData, setSearchData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/search_bookType_frm_cash_bank_master`, {
                params: {
                    bookType: searchBookTypeText || '',
                }
            });
            setSearchData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearch = () => {
        fetchData();
    };

    const column = [
        {
            name: 'Book Type',
            selector: 'book_type',
            sortable: true,
            cell: (row) => (
                // onClick={() => handleRowClick(row)} style={{ cursor: 'pointer' }}
                <div >
                    {row.book_type}
                </div>
            ),
        }
    ];

    return (
        <div>
            <InputGroup>
                <FormControl
                    placeholder="Search Book Type"
                    value={searchBookTypeText}
                    onChange={(e) => setSearchBookTypeText(e.target.value)}
                    className='me-1'
                />
                <Button variant="primary" onClick={handleSearch}>Search</Button>
            </InputGroup>
            <DataTable columns={column} data={searchData} />
        </div>
    );
};

export default PopupSearchBookType;

