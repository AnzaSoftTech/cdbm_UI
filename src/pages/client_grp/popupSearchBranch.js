import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';

const PopupSearchBranch = ({ onSelectRow }) => {
    const [searchBranchText, setSearchBranchText] = useState('');
    const [searchBankNameText, setSearchBankNameText] = useState('');
    const [searchAddr1Text, setSearchAddr1Text] = useState('');
    const [searchData, setSearchData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/search_BankBranches', {
                params: {
                    branchname: searchBranchText,
                    bankname: searchBankNameText,
                    addr1: searchAddr1Text
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

    const handleRowClick = (row) => {
      // Pass all necessary data fields to onSelectRow function
      onSelectRow({
        branch_name: row.branch_name,
        branch_cd: row.addr_id,
      });

    };

    const columns = [
        {
            name: 'Branch Name',
            selector: 'branch_name',
            sortable: true,
            cell: (row) => (
                <div onClick={() => handleRowClick(row)} style={{ cursor: 'pointer' }}>
                    {row.branch_name}
                </div>
            ),
        },
        {
          name: 'Bank Name',
          selector: 'bank_name',
          sortable: true,
          cell: (row) => (
              <div onClick={() => onSelectRow(row)} style={{ cursor: 'pointer' }}>
                  {row.bank_name}
              </div>
          ),
        },
        {
            name: 'Address Line 1',
            selector: 'addr_line1',
            sortable: true,
            cell: (row) => (
                <div onClick={() => onSelectRow(row)} style={{ cursor: 'pointer' }}>
                    {row.addr_line1}
                </div>
            ),
        },
    ];

    return (
        <div>
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search Branch Name"
                    value={searchBranchText}
                    onChange={(e) => setSearchBranchText(e.target.value)}
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search Bank Name"
                    value={searchBankNameText}
                    onChange={(e) => setSearchBankNameText(e.target.value)}
                />
            </InputGroup>
            <InputGroup>
                <FormControl
                    placeholder="Search Address 1"
                    value={searchAddr1Text}
                    onChange={(e) => setSearchAddr1Text(e.target.value)}
                    className='me-1'
                />
                <Button variant="primary" onClick={handleSearch}>Search</Button>
            </InputGroup>
            <DataTable columns={columns} data={searchData} />
        </div>
    );
};

export default PopupSearchBranch;

