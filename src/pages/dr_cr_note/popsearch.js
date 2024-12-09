import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import './popsearch.css';
import { BASE_URL } from "../constants";


const PopupSearch = ({ onSelectRow, activity, segment }) => {
  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState([]);

  const fetchData = async () => {
    try {
      console.log('activity ', activity);
      const response = await axios.get(`${BASE_URL}/api/searchAccountDrCr`, {
        params: { name: searchText, activity: activity, segment: segment },
      });
      console.log('response.data ', response.data);
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
    onSelectRow({
      act_name: row.account_name,
      act_cd: row.act_cd,
    });
  };

  const columns = [
    {
      name: 'Account Name',
      selector: 'act_name',
      sortable: true,
      cell: (row) => (
        <div onClick={() => handleRowClick(row)} style={{ cursor: 'pointer' }}>
          {row.account_name}
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
