import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';

const PopupSearchClientName = ({ onRowSelect, onCheckBoxRowSelect, p_client_id, getClients, close }) => {
    const [searchCliNameText, setSearchCliNameText] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [checkedRows, setCheckedRows] = useState(new Set()); // Track checked rows
    const [cliNameResults, setCliNameResults] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/search_cliName_frm_client_master', {
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

    const handleSaveAll = () => {
        console.log('cliNameResults------', cliNameResults);

        const data = {
            header: { cliNameRes: cliNameResults },
            params: { p_client_id }
        };

        if (cliNameResults.length === 0) {
            alert('Please select Client(s) to add to Client Group.');
            return;
        }

        const isConfirmed = window.confirm("Sure you want to save the record ?");
        if (!isConfirmed) {
            return;
        }

        axios.post('http://localhost:3001/api/upd_client_links', data)
            .then(response => {
                alert('Clients saved successfully!');
                close(null);
                getClients();
            })
            .catch(error => {
                console.error('Error saving clients:', error);
                alert('Error saving clients. Please try again.');
            });
    };

    const handleCheckBoxClick = (row, index) => {
        const updatedCheckedRows = new Set(checkedRows);
        if (updatedCheckedRows.has(row.client_cd)) {
            updatedCheckedRows.delete(row.client_cd); // Remove if already checked
        } else {
            updatedCheckedRows.add(row.client_cd); // Add if not checked
            // onCheckBoxRowSelect({ cli_cd: row.client_cd, cli_name: row.name }, index);
        }
        setCheckedRows(updatedCheckedRows);
    };

    const handleCheckBoxRow = (rowData, index) => {
        // const { cli_cd, cli_name } = rowData;
        handleCheckBoxClick(rowData, index)
        let newCliNameRes = [...cliNameResults];
        newCliNameRes[index] = rowData;
        newCliNameRes = [...cliNameResults, rowData];
        setCliNameResults(newCliNameRes);

    }

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
                    <input
                        className='cb'
                        type='checkbox'
                        checked={checkedRows.has(row.client_cd)} // Check if the row is checked
                        onChange={() => { handleCheckBoxRow(row, index) }}
                    />
                </>
            ),
        }
    ];

    return (
        <div>
            <InputGroup>
                <FormControl
                    placeholder="Search Client Name"
                    value={searchCliNameText}
                    onChange={(e) => setSearchCliNameText(e.target.value)}
                    className='me-1'
                />
                <Button variant="primary me-1" onClick={handleSearch}>Search</Button>
                <Button variant="primary"
                    onClick={handleSaveAll}>Add</Button>
            </InputGroup>
            <DataTable columns={columns} data={searchData} />
        </div>
    );
};

export default PopupSearchClientName;

