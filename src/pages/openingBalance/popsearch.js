import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import './journal.css';
import { BASE_URL } from "../constants";

const PopupSearch = ({ onSelectRow, exchange, segment, AccountType, activity }) => {
  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/searchOpenBalAccount`, {
        params: { name: searchText, exchange: exchange, segment: segment, AccountType, activity },
      });
      setSearchData(response.data); 
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleSearch = () => {
    fetchData();
  };

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleRowClick = (row) => {
    // Pass all necessary data fields to onSelectRow function
    // console.log('row ', row)
    onSelectRow({
      act_name: row.act_name,
      act_cd: AccountType === 'account' ? row.act_cd : row.cb_act_cd,
      account_type: AccountType === 'account' ? 'account' : 'cb_account'
    });
  };

  const columns = [
    {
      name: 'Account Name',
      selector: 'act_name',
      sortable: true,
      cell: (row) => (
        <div onClick={() => handleRowClick(row)} style={{ cursor: 'pointer' }}>
          {row.act_name}
        </div>
      ),
    },
  ];

  return (
    <div>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search Account Name"
          value={searchText}
          onChange={handleInputChange}
        />
        <Button variant="primary" onClick={handleSearch}>Search</Button>
      </InputGroup>
      <DataTable columns={columns} data={searchData} />
    </div>
  );
};

export default PopupSearch;
