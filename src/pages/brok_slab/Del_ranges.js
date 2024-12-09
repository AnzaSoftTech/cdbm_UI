import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './gen_rings.css';
import DataTable from 'react-data-table-component';
import { format, parseISO } from 'date-fns';
import { BASE_URL } from ".././constants";


function Del_Ranges({ onRowSelect }) {
    const maxRange = 999999999.99;
    const [noDataMessage, setNoDataMessage] = useState('');
    const [newMode, setNewMode] = useState(true);
    const [selectedDelRangeRow, setSelectedDelRangeRow] = useState(null);
    const [Del_range_name, setDel_range_name] = useState('');
    const [DelRangeTableDatas, setDelRangeTableDatas] = useState([]);
    const [DelRangeNameTable, setDelRangeNameTable] = useState([]);
    const [Del_range_id, setDel_range_id] = useState('');
    const [DelRangeData, setDelRangeData] = useState([{
        del_charge_normal: '',
        del_flat_normal: '',
        del_range_to: '',
        del_range_form: '0.01',
        // del_range_code: null
    }]);
    const fetchData = async () => {
        // console.log('fetch', Del_range_id);

        try {
            const response = await axios.get(`${BASE_URL}/api/cash_bill_Delrange_slab`);
            setDelRangeTableDatas(response.data);

            if (response.data.length === 0) {
                setNoDataMessage('No data available in the Normal tab.');
            } else {
                setNoDataMessage('');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setDelRangeTableDatas([]);
                alert('No record found in the table.');
            } else {
                console.error('Error fetching data:', error);
                alert('Error fetching data. Please try again.');
            }
        }

    };

    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        const fetchDelRangeNameTable = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/slab-rangeName`);
                const data = await response.json();
                setDelRangeNameTable(data);
                console.log('categories', data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchDelRangeNameTable();
    }, []);

    // const handleRangeNameRowClick = (row) => {
    //     setSelectedDelRangeRow(row);
    //     console.log('row-----', row);
    //     setDel_range_id(row.range_id);
    //     setDel_range_name(row.range_name);
    // };

    const handleDelRangetableClear = () => {
        setDelRangeNameTable([]);
        setDel_range_name('');
        setDel_range_id('');
        setNewMode(true);
        setDelRangeData([{
            del_charge_normal: '',
            del_flat_normal: '',
            del_range_to: '',
            del_range_form: '0.01',
            // del_range_code: null
        }]);
    };

    const handleNewClick = () => {
        setNewMode(false);
    };

    // const handleDelRangeTableClear = () => {
    //     setDelRangeTableDatas([]);
    // };



    const handlesaveDelRangeSlab = async () => {
        const slabData = {
            Del_range_name: Del_range_name,
        };

        console.log('slabData', slabData);
        try {
            const response = await axios.post(`${BASE_URL}/api/CASH_BILL_DEL_RANGE_MASTER`, slabData);


            console.log('Data saved successfully:', response.data);

            alert('Data saved successfully! New Range ID: ' + response.data.newRangeId);
            setDel_range_id(response.data.newRangeId);
            // setDelRangeNameTable(response.data.data);
            // onRowSelect(Del_range_name,Del_range_id);
        } catch (error) {
            // Handle error
            console.error('Error saving data:', error);
            alert('Error saving data. Please try again.');
        }
    };

    const handleDelChange = (index, field, value) => {
        const updatedData = [...DelRangeData]; // Assuming 'data' is the state variable holding your rows
        updatedData[index][field] = value;
        setDelRangeData(updatedData); // Update your state with the new data
        console.log(DelRangeData);
    };

    // const handleDelChange = (e) => {
    //     if (e && e.target) {
    //         const { name, value, type, checked } = e.target;
    //         const finalValue = type === 'checkbox' ? checked : value;

    //         setDelRangeData((prevData) => ({
    //             ...prevData,
    //             [name]: finalValue,
    //         }));
    //     } else {
    //         console.error('Event is undefined or does not have target in ScripTab');
    //     }
    // };

    const handleAddDelRangeSlabRow = async () => {
        const length = DelRangeData.length;

        var newDelRangeArr = [];

        if (DelRangeData[length - 1].del_range_to) {
            let lastRangeTo = Number(DelRangeData[length - 1].del_range_to);

            //console.log('lastRangeTo < maxRange', lastRangeTo , maxRange);

            if (lastRangeTo < maxRange) {
                console.log(1);
                // setGenRangeData([]);
                handleAddRow();
                console.log(2);

                newDelRangeArr = [
                    ...DelRangeData,
                    {
                        del_charge_normal: '',
                        del_flat_normal: '',
                        del_range_to: `${maxRange}`,
                        del_range_form: parseFloat(Number(DelRangeData[length - 1].del_range_to)) + .01
                        // gen_range_code: null
                    }
                ];

                const len = newDelRangeArr.length;

                // Check if Max Range Row is filled
                if (handleAddRow && !newDelRangeArr[len - 1].del_flat_normal) {
                    alert("Max. Range Row added. Please fill all the fields of Max. Range Row.");
                    return;
                }

                // Check if any field in the new row is empty before saving
                const hasEmptyFields = newDelRangeArr.some(row =>
                    !row.del_charge_normal ||
                    !row.del_flat_normal ||
                    !row.del_range_form
                );

                if (hasEmptyFields) {
                    alert('Please fill all fields before saving.');
                    return;
                }

                // If all fields are filled, save to DB or handle DB operation here
                console.log('3 newDelRangeArr----', newDelRangeArr);
                // Example: Save data to the database
                // saveToDB(newGenRangeArr);
                return newDelRangeArr = [
                    ...DelRangeData,
                    {
                        del_charge_normal: '',
                        del_flat_normal: '',
                        del_range_to: `${maxRange}`,
                        del_range_form: parseFloat(Number(DelRangeData[length - 1].del_range_to)) + .01
                        // gen_range_code: null
                    }
                ];

            } else if (lastRangeTo === maxRange) {
                //console.log('lastRangeTo === maxRange ', lastRangeTo, maxRange);
                newDelRangeArr = [...DelRangeData
                    // {
                    //     gen_charge_normal: '',
                    //     gen_flat: '',
                    //     gen_flat_normal: '',
                    //     gen_range_to: `${maxRange}`,
                    //     gen_sq_up_charges: '',
                    //     gen_range_form: genRangeData[length - 1].gen_range_to + '.01'
                    //     // gen_range_code: null
                    // }
                ];
                let l = newDelRangeArr.length;

                //console.log('newGenRangeArr[l - 1].gen_flat_normal ', newGenRangeArr[l - 1].gen_flat_normal);
                // console.log('l ', l);

                if (!newDelRangeArr[l - 1].del_flat_normal) {
                    alert('Please fill all the fields of Max. Range Row.');
                    return;
                }

                // Check if any field in the new row is empty before saving
                const hasEmptyFields = newDelRangeArr.some(row =>
                    !row.del_charge_normal ||
                    !row.del_flat_normal ||
                    !row.del_range_form
                );

                if (hasEmptyFields) {
                    alert('Please fill all fields before saving.');
                    return;
                }

                // If all fields are filled, save to DB or handle DB operation here
                console.log('Max range filled, ready to save to DB:', newDelRangeArr);
                // Example: Save data to the database
                // saveToDB(newGenRangeArr);
                // return newGenRangeArr;
                //  = [...genRangeData];
            }
        }

        console.log('DelRangeData before sending:', DelRangeData);
        console.log('Del_range_id before sending:', Del_range_id);

        const data = {
            DelRangeData,
            newDelRangeArr,
            Del_range_id
        };

        console.log('data before sending:', data);

        try {
            const response = await axios.post(`${BASE_URL}/api/save_Delrange_slab`, data);
            console.log('Data added successfully:', response);
            // Update the state with the new data
            alert('Data added successfully!');
            setDelRangeTableDatas(response.data);

            // Reset the form fields
            setDelRangeData([{
                del_charge_normal: '',
                del_flat_normal: '',
                del_range_to: '',
                del_range_form: '0.01',
                del_range_code: ''
            }]);

            // Call fetchData to refresh the data
            // fetchData();

        } catch (error) {
            console.error('Error adding data:', error);
            alert('Error adding data. Please try again.');
        }
    };

    const handleAddRow = () => {
        let length = DelRangeData.length;
        setDelRangeData([...DelRangeData, {
            del_charge_normal: '',
            del_flat_normal: '',
            del_range_to: `${maxRange}`,
            del_range_form: parseFloat(Number(DelRangeData[length - 1].del_range_to)) + .01,
            // gen_range_code: null
        }]);
    };


    // const handleDelRangeRowClick = (row) => {
    //     setSelectedDelRangeRow(row);
    //     console.log('row-----', row);


    //     setDelRangeData({
    //         del_range_form: row.rg_from,
    //         del_range_to: row.rg_to,
    //         del_flat_normal: row.brok_crit,
    //         del_charge_normal: row.brok_rate,
    //         del_range_code: row.range_code
    //     });
    //     setNewMode(false);
    // };

    // const handleDelRangeRowClick = async (row) => {
    //     setSelectedDelRangeRow(row);
    //     console.log('row.status-----', row.status);
    //     if (row.status === 'I') {
    //         alert('Inactive Range Row cannot be edited!');
    //         setDelRangeData([{
    //             del_charge_normal: '',
    //             del_flat_normal: '',
    //             del_range_to: '',
    //             del_range_form: '0.01'
    //             // del_range_code: null
    //         }]);

    //         return;
    //     }
    //     try {
    //         const response = await axios.get(`${BASE_URL}/api/get_del_ranges_on_select`,
    //             { params: { Del_range_id: row.rg_id } }
    //         );

    //         setDelRangeData(response.data);
    //         console.log('DelRangeData', DelRangeData);
    //     } catch (error) {
    //         alert('Error retrieving Slab Del Ranges.');
    //     }

    //     setDel_range_name(row.rg_name);
    //     setDel_range_id(row.rg_id);
    //     setNewMode(false);
    // };

    const handleDelRangeRowClick = async (row) => {
        setSelectedDelRangeRow(row);
        console.log('row.status-----', row.status);   
        
        if (row.status === 'I') {
            alert('Inactive Range Row cannot be edited!');
            setDelRangeData([{
                del_charge_normal: '',
                del_flat_normal: '',
                del_range_to: '',
                del_range_form: '0.01'
            }]);
            return;
        }
        
        try {
            const response = await axios.get(`${BASE_URL}/api/get_del_ranges_on_select`, {
                params: { Del_range_id: row.rg_id }
            });
   
            if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
                setDelRangeData(response.data);
                console.log('DelRangeData', response.data);
            } else {
                console.error('Invalid data received:', response.data);
            }
        } catch (error) {
            alert('Error retrieving Slab Del Ranges.');
        }
   
        setDel_range_name(row.rg_name);
        setDel_range_id(row.rg_id);
        setNewMode(false);
    }
   

    // const handleDelDeleteRow = async () => {
    //     if (!selectedDelRangeRow) {
    //         alert('Please select a row to delete.');
    //         return;
    //     }

    //     try {
    //         // Make the API call to delete the row
    //         const response = await axios.delete(`${BASE_URL}/api/cash_bill_Delrange_details/${selectedDelRangeRow.range_id}`, {
    //             data: {
    //                 range_code: selectedDelRangeRow.range_code,
    //                 rg_from: selectedDelRangeRow.rg_from,
    //                 rg_to: selectedDelRangeRow.rg_to,
    //                 brok_crit: selectedDelRangeRow.brok_crit,
    //                 brok_rate: selectedDelRangeRow.brok_rate,

    //             }
    //         });

    //         // Handle success
    //         console.log('Delete successful:', response.data);
    //         // Remove the deleted item from the local state
    //         setDelRangeTableDatas(prevData => prevData.filter(row => row.range_id !== selectedDelRangeRow.range_id));
    //         alert('Row deleted successfully!');

    //         // Optionally, reset the selected row
    //         setSelectedDelRangeRow(null);
    //     } catch (error) {
    //         console.error('Error deleting row:', error);
    //         alert('Error deleting row. Please try again.');
    //     }
    // };

    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: 'purple',
                backgroundColor: '#99bcef',
                color: 'white',
                fontWeight: 'bold',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                minHeight: '40px',
                paddingLeft: '3px',
                paddingRight: '3px'
            },
        },
        headCells: {
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: 'black',
                paddingLeft: '3px',
                paddingRight: '3px',

            },
        },
        cells: {
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: 'blue',
                paddingLeft: '3px',
                paddingRight: '3px',
                borderBottom: '1px solid blue'
            },
        },
        rows: {
            style: {
                paddingLeft: '3px',
                paddingRight: '3px',

            },
        },
        actionsHeader: {
            style: {
                borderRightStyle: 'none',
            },
        },

        actionsCell: {
            style: {
                borderRightStyle: 'none',
                paddingLeft: '3px',
                paddingRight: '3px',
            },
        },
    };


    const delRangecolumns = [
        {
            name: 'Range From',
            selector: row => row.del_range_form,
            cell: (row, index) => (
                <input
                    type="number"
                    name="del_range_form"
                    value={index === 0 ? 
                    (row.del_range_form = 0.01) : 
                    (row.del_range_form = parseFloat(Number(DelRangeData[index - 1]?.del_range_to || 0)) + 0.01)
                    }
                    onChange={e => handleDelChange(index, 'del_range_form', e.target.value)}
                    className="form-control"
                    style={{ textAlign: 'right' }}
                    readOnly
                    disabled={newMode}
                />
            ),
            width: '11.6rem',
        },
        {
            name: 'Range To',
            selector: row => row.del_range_to,
            cell: (row, index) => (
                <input
                    type='number'
                    name="del_range_to"
                    className="form-control"
                    value={row.del_range_to}
                    onChange={e => handleDelChange(index, 'del_range_to', e.target.value)}
                    style={{ textAlign: 'right' }}
                    disabled={newMode}
                />
            ),
            width: '11.6rem',
        },
        {
            name: 'Normal Basis',
            selector: row => row.del_flat_normal,
            cell: (row, index) => (
                <div className='d-flex align-items-center'>
                    <input
                        type="radio"
                        name={`del_flat_normal_${index}`}
                        value="F"
                        checked={row.del_flat_normal === 'F'}
                        onChange={e => handleDelChange(index, 'del_flat_normal', e.target.value)}
                        className="form-check-input me-1"
                        id="del_flat_normal1"
                        disabled={newMode}
                    /><span style={{ fontSize: '0.9rem' }}>Flat</span>
                    {/* <label disabled={newMode} className=' ms-1 gen-label' htmlFor='del_flat_normal1'>Flat</label> */}
                    <input
                        type="radio"
                        name={`del_flat_normal_${index}`}
                        value="P"
                        checked={row.del_flat_normal === 'P'}
                        onChange={e => handleDelChange(index, 'del_flat_normal', e.target.value)}
                        className="form-check-input  ms-3  me-1"
                        id="del_flat_normal2"
                        disabled={newMode}
                    /><span style={{ fontSize: '0.9rem' }}>Perc</span>
                    {/* <label disabled={newMode} className=' ms-1 gen-label' htmlFor='del_flat_normal2'>Perc.</label> */}
                </div>
            ),
            width: '7rem',
        },
        {
            name: 'Normal Charges',
            selector: row => row.del_charge_normal,
            cell: (row, index) => (
                <input
                    type="number"
                    name="del_charge_normal"
                    value={row.del_charge_normal}
                    onChange={e => handleDelChange(index, 'del_charge_normal', e.target.value)}
                    className="form-control"
                    disabled={newMode}
                    style={{ textAlign: 'right' }}
                />
            ),
            width: '7rem',
        },
        {
            selector: row => row.Del_range_id,
            cell: (row, index) => (
                <input value={row.Del_range_id} hidden />
            ),
            width: '0rem',
        },
        {
            selector: row => row.del_range_code,
            cell: (row, index) => (
                <input value={row.del_range_code} hidden />
            ),
            width: '0rem'
        }
    ];

    return (
        <div className="popup_ring">
            <div className="popup-inner_ring">
                <div className='div_header_ring'><h4>DELIVERY RANGES</h4></div>
                <div className='inputflex'>
                    <div className="row mb-1 d-flex">
                        <div className="col-12 col-md-4 mt-2">
                            <div className="inputOnText">

                                <div className="form-control size_address2 ms-3">
                                    <div className="row mb-1">

                                        <div className="col-12 col-md-8 d-flex align-items-center">
                                            <label className='me-1 range_width' htmlFor='rangeName'>Range Name:</label>
                                            <input
                                                type="text" // Set the input type to text
                                                className="form-control" // Apply your form control class
                                                name="Del_range_name"
                                                value={Del_range_name} // Bind state to input
                                                onChange={(event) => setDel_range_name(event.target.value)} // Handle input change
                                                placeholder="Enter Range Name" // Optional placeholder
                                                disabled={newMode}
                                                id='rangeName'
                                            />

                                        </div>
                                    </div>
                                    <div className="col-12 col-md-12 d-flex align-items-center mt-3 justify-content-end">
                                            <button className="btn btn-primary "
                                                onClick={handleNewClick}
                                            >New</button>
                                            <button className="btn btn-primary ms-1 me-1"
                                                onClick={handlesaveDelRangeSlab}
                                                disabled={newMode}>Save</button>
                                            <button className="btn btn-secondary  me-1"
                                                onClick={handleDelRangetableClear}
                                                disabled={newMode}>Clear</button>
                                            <button className="btn btn-danger "
                                                onClick={() => onRowSelect(null)}>Close</button>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
                <div className='inputflex'>
                    <div className="row mb-1 d-flex">
                        <div className="col-12 col-md-12 mt-2">
                            {/* <div className="inputOnText">
                                <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Range Details:</label>
                                <div className="form-control size_address2 ms-3">
                                    <div className="row mb-1">
                                        <div className="col-12 col-md-4 d-flex align-items-center">
                                            <label className='range_width1' htmlFor='gen_range_form'>Range From:</label>
                                            <input
                                                type="text"
                                                className="form-control" // Use "form-control" for Bootstrap styling
                                                id="del_range_form" // Set the id to match the label's htmlFor
                                                name="del_range_form"
                                                value={DelRangeData.del_range_form} // Bind to state variable correctly
                                                onChange={handleDelChange} // Handle input change
                                            />


                                        </div>
                                        <div className="col-12 col-md-4 d-flex align-items-center">
                                            <label className=' range_width1'>Range To:</label>
                                            <input
                                                type="text"
                                                className="form-control "
                                                name="del_range_to"
                                                value={DelRangeData.del_range_to}
                                                onChange={handleDelChange}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div> */}
                            <DataTable className='my-3 delDataTable'
                                columns={delRangecolumns}
                                data={DelRangeData}
                                customStyles={customStyles}
                                highlightOnHover
                                responsive
                            />
                            <div className="d-flex flex-end mt-2 mb-2 me-2">
                                <button className="btn btn-success " onClick={handleAddDelRangeSlabRow} disabled={newMode} >Save Ranges</button>
                                <button className="btn btnColorAddRow ms-3" onClick={handleAddRow} disabled={newMode}  >Add Row</button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='inputflex'>
                    <div className="row mb-1 d-flex">
                        <div className="col-12 col-md-4 mt-2">
                            {/* <div className="inputOnText">
                                <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Normal Charge</label>
                                <div className="form-control size_address2 ms-3">
                                    <div className="row mb-1">
                                        <div className="col-12 col-md-4 d-flex align-items-center">

                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="del_flat_normalYes"
                                                name="del_flat_normal"
                                                value="F"
                                                checked={DelRangeData.del_flat_normal === 'F'}
                                                onChange={(e) => handleDelChange(e)}
                                            />
                                            <label className="form-check-label ms-1" htmlFor="del_flat_normalYes">Flat</label>
                                        </div>
                                        <div className="col-12 col-md-4 d-flex align-items-center">

                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="gen_percent_normalYes"
                                                name="del_flat_normal"
                                                value="P"
                                                checked={DelRangeData.del_flat_normal === 'P'}
                                                onChange={(e) => handleDelChange(e)}
                                            />
                                            <label className='form-check-label ms-1' htmlFor='gen_percent_normalYes'>Percent</label>
                                        </div>
                                        <div className="col-12 col-md-4 d-flex align-items-center">
                                            <label className='me-1'>Charges:</label>
                                            <input
                                                type="text"
                                                className="form-control "
                                                name="del_charge_normal"
                                                value={DelRangeData.del_charge_normal}
                                                onChange={handleDelChange}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div> */}

                        </div>
                    </div>

                </div>

                <div className='d-flex ms-3'>
                    <div className='table_border'>
                        <div className="table-scroll"> {/* Add scrollable container */}
                            <table className='tablering'>
                                <thead className='theadring'>
                                    <tr>
                                        <th className='thring' hidden>Range Code</th>
                                        <th className='thring' hidden>Range Id</th>
                                        <th className='thring'>Range Name</th>
                                        <th className='thring'>Range From</th>
                                        <th className='thring'>Range To</th>
                                        <th className='thring'>Normal Range</th>
                                        <th className='thring'>Normal Criteria</th>
                                        <th className='thring'>Status</th>
                                        <th className='thring'>Start Date</th>
                                        <th className='thring'>End Date</th>

                                    </tr>
                                </thead>
                                <tbody className='tbodyring'>
                                    {DelRangeTableDatas.map((row, index) => (
                                        <tr className={
                                            `trring ${selectedDelRangeRow === row ? 'selectedrowcolor' : ''}`}
                                            key={index} onClick={() => handleDelRangeRowClick(row)}>
                                            <td className='tdring' hidden>{row.range_code}</td>
                                            <td className='tdring' hidden>{row.rg_id}</td>
                                            <td className='tdring'>{row.rg_name}</td>
                                            <td className='tdring'>{row.rg_from}</td>
                                            <td className='tdring'>{row.rg_to}</td>
                                            <td className='tdring'>{row.brok_rate}</td>
                                            <td className='tdring'>{row.brok_crit}</td>
                                            <td className='tdring'>{row.status}</td>
                                            <td className='tdring'>{
                                                row.start_date ? row.start_date = format(parseISO(row.start_date), 'yyyy-MM-dd') : ''
                                            }</td>
                                            <td className='tdring'>{
                                                row.end_date ? row.end_date = format(parseISO(row.end_date), 'yyyy-MM-dd') : ''
                                            }</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='ms-2 mt-4 d-flex flex-column'> {/* Use flex column for vertical stacking */}
                        {/* <button className="btn btn-primary mb-2" onClick={handleAddDelRangeSlabRow}>Add</button> */}
                        {/* <button className="btn btn-secondary mb-2" onClick={handleDelDeleteRow}>Delete</button>
                        <button className="btn btn-danger" onClick={handleDelRangeTableClear}>Clear</button> */}
                    </div>

                </div>
            </div>


        </div>

    );
}

export default Del_Ranges;
