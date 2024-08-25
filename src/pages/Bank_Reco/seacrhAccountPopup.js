import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import './seacrhAccountPopup.css'; 


const PopupSearch = ({ onSelectRow, exchange, segment }) => {
  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3004/api/searchAccount', {
        params: { name: searchText, exchange: exchange, segment: segment },
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
    onSelectRow({
      act_name: row.act_name,
      act_cd: row.act_cd,
      branch_cd: row.branch_cd,
      cmp_cd: row.cmp_cd,
      type_cd: row.type_cd,
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
