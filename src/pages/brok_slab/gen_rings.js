import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './gen_rings.css';
// import deleteIcon from './image/delete.png';
// import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import DataTable from 'react-data-table-component';
import { BASE_URL } from ".././constants";

function Gen_Ranges({ onRowSelect }) {
    const maxRange = 999999999.99;
    const [noDataMessage, setNoDataMessage] = useState('');
    const [newMode, setNewMode] = useState(true);
    const [selectedRangeRow, setSelectedRangeRow] = useState(null);
    const [Gen_range_name, setGen_range_name] = useState('');
    const [GenRangeTableDatas, setGenRangeTableDatas] = useState([]);
    const [rangeNameTable, setRangeNameTable] = useState([]);
    const [Gen_range_id, setGen_range_id] = useState('');
    const [genRangeData, setGenRangeData] = useState([{
        gen_charge_normal: '',
        gen_flat: '',
        gen_flat_normal: '',
        gen_range_to: '',
        gen_sq_up_charges: '',
        gen_range_form: '0.01'
        // gen_range_code: null
    }]);


    const fetchData = async () => {
        // console.log('fetch', Gen_range_id);

        try {
            const response = await axios.get(`${BASE_URL}/api/cash_bill_Genrange_slab`);
            setGenRangeTableDatas(response.data);
            if (response.data.length === 0) {
                setNoDataMessage('No data available for this Range ID.');
            } else {
                setNoDataMessage('');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setGenRangeTableDatas([]);
                alert('No record found for this Range Name in the table.');
            } else {
                console.error('Error fetching data:', error);
                alert('Error fetching data. Please try again.');
            }
        }



    };

    // useEffect(() => {
    //     fetchData();

    // }, [Gen_range_id]);

    useEffect(() => {
        fetchData();
    }, []);



    // useEffect(() => {
    //     const fetchRangeNameTable = async () => {
    //         try {
    //             const response = await fetch('${BASE_URL}/api/slab-rangeName');
    //             const data = await response.json();
    //             setRangeNameTable(data);
    //             console.log('categories', data);
    //         } catch (error) {
    //             console.error('Error fetching categories:', error);
    //         }
    //     };

    //     fetchRangeNameTable();
    // }, []);

    // const handleRangeNameRowClick = (row) => {
    //     setSelectedRangeRow(row);
    //     console.log('row-----', row);
    //     setGen_range_id(row.range_id);
    //     setGen_range_name(row.range_name);
    // };

    const handleRangetableClear = () => {
        setRangeNameTable([]);
        setGen_range_name('');
        setGen_range_id('');
        setNewMode(true);
        setGenRangeData([{
            gen_charge_normal: '',
            gen_flat: '',
            gen_flat_normal: '',
            gen_range_to: '',
            gen_sq_up_charges: '',
            gen_range_form: '0.01'
            // gen_range_code: null
        }]);
    };

    // const handleGenRangeTableClear = () => {
    //     setGenRangeTableDatas([]);
    // };

    const handleNewClick = () => {
        setNewMode(false);
    };

    const handlesaveGenRangeSlab = async () => {
        const slabData = {
            Gen_range_name: Gen_range_name,
        };

        console.log('slabData', slabData);
        try {
            const response = await axios.post(`${BASE_URL}/api/CASH_BILL_DEL_RANGE_MASTER`, slabData);


            console.log('Data saved successfully:', response.data);
            // setNewMode(true);

            setGen_range_id(response.data.newRangeId);
            setRangeNameTable(response.data.data);

            alert('Data saved successfully! New Range ID: ' + response.data.newRangeId);
            // onRowSelect(Gen_range_name, Gen_range_id);
        } catch (error) {
            // Handle error
            console.error('Error saving data:', error);
            alert('Error saving data. Please try again.');
        }
    };


    // const handleGenChange = (e) => {
    //     if (e && e.target) {
    //         const { name, value, type, checked } = e.target;
    //         const finalValue = type === 'checkbox' ? checked : value;

    //         setGenRangeData((prevData) => ({
    //             ...prevData,
    //             [name]: finalValue,
    //         }));
    //     } else {
    //         console.error('Event is undefined or does not have target in ScripTab');
    //     }
    // };
    const handleGenChange = (index, field, value) => {
        const updatedData = [...genRangeData]; // Assuming 'data' is the state variable holding your rows
        updatedData[index][field] = value;
        setGenRangeData(updatedData); // Update your state with the new data
        console.log('index-->',index);
        // console.log('see this-->',genRangeData);
    };

    const handleSavedGenRanges = async () => {

        const length = genRangeData.length;

        var newGenRangeArr = [];

        if (genRangeData[length - 1].gen_range_to) {
            let lastRangeTo = Number(genRangeData[length - 1].gen_range_to);

            //console.log('lastRangeTo < maxRange', lastRangeTo , maxRange);

            if (lastRangeTo < maxRange) {
                console.log(1);
                // setGenRangeData([]);
                handleAddRow();
                console.log(2);

                newGenRangeArr = [
                    ...genRangeData,
                    {
                        gen_charge_normal: '',
                        gen_flat: '',
                        gen_flat_normal: '',
                        gen_range_to: `${maxRange}`,
                        gen_sq_up_charges: '',
                        gen_range_form: parseFloat(Number(genRangeData[length - 1].gen_range_to)) + .01
                        // gen_range_code: null
                    }
                ];

                const len = newGenRangeArr.length;

                // Check if Max Range Row is filled
                if (handleAddRow && !newGenRangeArr[len - 1].gen_flat_normal) {
                    alert("Max. Range Row added. Please fill all the fields of Max. Range Row.");
                    return;
                }

                // Check if any field in the new row is empty before saving
                const hasEmptyFields = newGenRangeArr.some(row =>
                    !row.gen_charge_normal ||
                    !row.gen_flat ||
                    !row.gen_flat_normal ||
                    !row.gen_sq_up_charges ||
                    !row.gen_range_form
                );

                if (hasEmptyFields) {
                    alert('Please fill all fields before saving.');
                    return;
                }

                // If all fields are filled, save to DB or handle DB operation here
                console.log('3 newGenRangeArr----', newGenRangeArr);
                // Example: Save data to the database
                // saveToDB(newGenRangeArr);
                return newGenRangeArr = [
                    ...genRangeData,
                    {
                        gen_charge_normal: '',
                        gen_flat: '',
                        gen_flat_normal: '',
                        gen_range_to: `${maxRange}`,
                        gen_sq_up_charges: '',
                        gen_range_form: parseFloat(Number(genRangeData[length - 1].gen_range_to)) + .01
                        // gen_range_code: null
                    }
                ];

            } else if (lastRangeTo === maxRange) {
                //console.log('lastRangeTo === maxRange ', lastRangeTo, maxRange);
                newGenRangeArr = [...genRangeData
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
                let l = newGenRangeArr.length;

                //console.log('newGenRangeArr[l - 1].gen_flat_normal ', newGenRangeArr[l - 1].gen_flat_normal);
                // console.log('l ', l);

                if (!newGenRangeArr[l - 1].gen_flat_normal) {
                    alert('Please fill all the fields of Max. Range Row.');
                    return;
                }

                // Check if any field in the new row is empty before saving
                const hasEmptyFields = newGenRangeArr.some(row =>
                    !row.gen_charge_normal ||
                    !row.gen_flat ||
                    !row.gen_flat_normal ||
                    !row.gen_sq_up_charges ||
                    !row.gen_range_form
                );

                if (hasEmptyFields) {
                    alert('Please fill all fields before saving.');
                    return;
                }

                // If all fields are filled, save to DB or handle DB operation here
                console.log('Max range filled, ready to save to DB:', newGenRangeArr);
                // Example: Save data to the database
                // saveToDB(newGenRangeArr);
                // return newGenRangeArr;
                //  = [...genRangeData];
            }
        }

        console.log('normalData before sending:', genRangeData);
        console.log('slabId before sending:', Gen_range_id);

        const data = {
            genRangeData,
            newGenRangeArr,
            Gen_range_id,
        };

        console.log('data before sending:', data);

        try {
            const response = await axios.post(`${BASE_URL}/api/save_genrange_slab`, data);
            console.log('Data added successfully:', response);
            alert('Data added successfully!');
            // fetchData();
            setGenRangeTableDatas(response.data);

            // setUpdArray([])

            setGenRangeData([{
                gen_charge_normal: '',
                gen_flat: '',
                gen_flat_normal: '',
                gen_range_to: '',
                gen_sq_up_charges: '',
                gen_range_form: '0.01',
                gen_range_code: ''
            }]);

        } catch (error) {
            console.error('Error adding data:', error);
            alert('Error adding data. Please try again.');
        }
    };

    // const handleGenRangeRowClick = async (row) => {
    //     setSelectedRangeRow(row);
    //     console.log('row.status-----', row.status);
    //     if (row.status === 'I') {
    //         alert('Inactive Range Row cannot be edited!');
    //         setGenRangeData([{
    //             gen_charge_normal: '',
    //             gen_flat: '',
    //             gen_flat_normal: '',
    //             gen_range_to: '',
    //             gen_sq_up_charges: '',
    //             gen_range_form: '0.01'
    //             // gen_range_code: null
    //         }]);
        
    //         return;
    //     }
    //     try {
    //         const response = await axios.get(`${BASE_URL}/api/get_gen_ranges_on_select`,
    //             { params: { Gen_range_id: row.rg_id } }
    //         );

    //         setGenRangeData(response.data);
    //         console.log('genRangeData', genRangeData);
    //     } catch (error) {
    //         alert('Error retrieving Slab Gen Ranges.');
    //     }

    //     setGen_range_name(row.rg_name);
    //     setGen_range_id(row.rg_id);
    //     setNewMode(false);

    // };


    // const handleDeleteRow = async () => {
    //     if (!selectedRangeRow) {
    //         alert('Please select a row to delete.');
    //         return;
    //     }

    //     try {
    //         // Make the API call to delete the row
    //         const response = await axios.delete(`${BASE_URL}/api/cash_bill_range_details/${selectedRangeRow.range_id}`, {
    //             data: {
    //                 range_code: selectedRangeRow.range_code,
    //                 rg_from: selectedRangeRow.rg_from,
    //                 rg_to: selectedRangeRow.rg_to,
    //                 brok_crit: selectedRangeRow.brok_crit,
    //                 brok_rate: selectedRangeRow.brok_rate,
    //                 sq_up_brok: selectedRangeRow.sq_up_brok,
    //                 sq_up_crit: selectedRangeRow.sq_up_crit
    //             }
    //         });

    //         // Handle success
    //         console.log('Delete successful:', response.data);
    //         // Remove the deleted item from the local state
    //         setGenRangeTableDatas(prevData => prevData.filter(row => row.range_id !== selectedRangeRow.range_id));
    //         alert('Row deleted successfully!');

    //         // Optionally, reset the selected row
    //         setSelectedRangeRow(null);
    //     } catch (error) {
    //         console.error('Error deleting row:', error);
    //         alert('Error deleting row. Please try again.');
    //     }
    // };

    // const handleGenDetailsDeleteRow = (index) => {
    //     setGenRangeData(genRangeData.filter((_, i) => i !== index));
    // };

    const handleGenRangeRowClick = async (row) => {
        setSelectedRangeRow(row);
        console.log('row.status-----', row.status);
        if (row.status === 'I') {
            alert('Inactive Range Row cannot be edited!');
            setGenRangeData([{
                gen_charge_normal: '',
                gen_flat: '',
                gen_flat_normal: '',
                gen_range_to: '',
                gen_sq_up_charges: '',
                gen_range_form: '0.01'
            }]);
            return;
        }
        try {
            const response = await axios.get(`${BASE_URL}/api/get_gen_ranges_on_select`, {
                params: { Gen_range_id: row.rg_id }
            });
    
            if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
                setGenRangeData(response.data);
                console.log('genRangeData', response.data);
            } else {
                console.error('Invalid data received:', response.data);
            }
        } catch (error) {
            alert('Error retrieving Slab Gen Ranges.');
        }
    
        setGen_range_name(row.rg_name);
        setGen_range_id(row.rg_id);
        setNewMode(false);
    };

    const handleAddRow = () => {
        let length = genRangeData.length;
        setGenRangeData([...genRangeData, {
            gen_charge_normal: '',
            gen_flat: '',
            gen_flat_normal: '',
            gen_range_to: `${maxRange}`,
            gen_sq_up_charges: '',
            gen_range_form: parseFloat(
                            Number(genRangeData[length - 1].gen_range_to))+.01,
            // gen_range_code: null
        }]);
    };

    // const handleAddModifiedRow = () => {
    //     setGenRangeData([...genRangeData, {
    //         gen_charge_normal: '',
    //         gen_flat: '',
    //         gen_flat_normal: '',
    //         gen_range_to: `${maxRange}`,
    //         gen_sq_up_charges: '',
    //         gen_range_form: '',
    //         gen_range_code: null
    //     }]);
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

    const genRangecolumns = [
        {
            name: 'Range From',
            selector: row => row.gen_range_form,
            cell: (row, index) => (
                <input
                    type="number"
                    name="gen_range_form"
                    // index === 0 ? row.gen_range_form = '0.01' :
                    //         row.gen_range_form = genRangeData[index - 1].gen_range_to + '.01'
                    value={index === 0 ? 0.01 : 
                    (parseFloat(Number(genRangeData[index - 1]?.gen_range_to || 0)) + 0.01)}
                    // value={index === 0 ? row.gen_range_form :
                    //     genRangeData[index - 1].gen_range_to + '.01'}
                        // row.gen_range_form = parseFloat(Number(genRangeData[index - 1].gen_range_to)) + .01}
                    onChange={e => handleGenChange(index, 'gen_range_form', e.target.value)}
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
            selector: row => row.gen_range_to,
            cell: (row, index) => (
                <input
                    type='number'
                    name="gen_range_to"
                    className="form-control"
                    value={row.gen_range_to}
                    onChange={e => handleGenChange(index, 'gen_range_to', e.target.value)}
                    style={{ textAlign: 'right' }}
                    disabled={newMode}
                />
            ),
            width: '11.6rem',
        },
        {
            name: 'Normal Basis',
            selector: row => row.gen_flat_normal,
            cell: (row, index) => (
                <div className='d-flex align-items-center'>
                    <input
                        type="radio"
                        name={`gen_flat_normal_${index}`}
                        value="F"
                        checked={row.gen_flat_normal === 'F'}
                        onChange={e => handleGenChange(index, 'gen_flat_normal', e.target.value)}
                        className="form-check-input ms-1 me-1"
                        id="norbasisf"
                        disabled={newMode}
                    /><span style={{fontSize:'0.9rem'}}>Flat</span> 
                    {/* <label disabled={newMode} className='ms-1 gen-label' htmlFor='norbasisf'>Flat</label> */}
                    <input
                        type="radio"
                        name={`gen_flat_normal_${index}`}
                        value="P"
                        checked={row.gen_flat_normal === 'P'}
                        onChange={e => handleGenChange(index, 'gen_flat_normal', e.target.value)}
                        className="form-check-input me-1  ms-2"
                        id="norbasisp"
                        disabled={newMode}
                    /><span style={{fontSize:'0.9rem'}}>Perc</span> 
                    {/* <label disabled={newMode} className='ms-1 gen-label' htmlFor='norbasisp'>Perc.</label> */}
                </div>
            ),
            width: '7rem',
        },
        {
            name: 'Normal Charges',
            selector: row => row.gen_charge_normal,
            cell: (row, index) => (
                <input
                    type="number"
                    name="gen_charge_normal"
                    value={row.gen_charge_normal}
                    onChange={e => handleGenChange(index, 'gen_charge_normal', e.target.value)}
                    className="form-control"
                    disabled={newMode}
                    style={{ textAlign: 'right' }}
                />
            ),
            width: '7rem',
        },
        {
            name: 'Square Up Basis',
            selector: row => row.gen_flat,
            cell: (row, index) => (
                <div className='d-flex align-items-center'>
                    <input
                        type="radio"
                        name={`gen_flat_${index}`} // Unique name for each checkbox
                        value='F'
                        checked={row.gen_flat === 'F'} // Assuming you have a `selected` property to manage checked state
                        onChange={e => handleGenChange(index, 'gen_flat', e.target.value)}
                        className="form-check-input me-1" style={{ marginLeft: '0.2rem' }}
                        disabled={newMode}
                        id="gen_flat1"
                    /><span style={{fontSize:'0.9rem'}}>Flat</span> 
                    {/* <label disabled={newMode} className=' ms-1 gen-label' htmlFor='gen_flat1'>Flat</label> */}
                    <input
                        type="radio"
                        name={`gen_flat_${index}`} // Unique name for each checkbox
                        value='P'
                        checked={row.gen_flat === 'P'} // Assuming you have a `selected` property to manage checked state
                        onChange={e => handleGenChange(index, 'gen_flat', e.target.value)}
                        className="form-check-input me-1 ms-2"
                        disabled={newMode}
                        id="gen_flat2"
                    /><span style={{fontSize:'0.9rem'}}>Perc</span> 
                    {/* <label disabled={newMode} className=' ms-1 gen-label' htmlFor='gen_flat2'>Perc.</label> */}
                </div>
            ),
            width: '7rem',
        },
        {
            name: 'Square Up Charges',
            selector: row => row.gen_sq_up_charges,
            cell: (row, index) => (
                <div className='d-flex'>
                    <input
                        type="number"
                        name={`gen_sq_up_charges`} // Unique name for each checkbox
                        value={row.gen_sq_up_charges} // Assuming you have a `selected` property to manage checked state
                        onChange={e => handleGenChange(index, 'gen_sq_up_charges', e.target.value)}
                        className="form-control" style={{ marginLeft: '0rem', textAlign: 'right' }}
                        disabled={newMode}
                    />
                </div>
            ),
            width: '8rem',
        },
        // {
        //     name: 'Actions',
        //     // selector: row => row.gen_sq_up_charges,
        //     cell: (row, index) => (
        //         <div className='d-flex' >
        //             <OverlayTrigger
        //                 placement="top"
        //                 overlay={
        //                     <Tooltip id={`tooltip-delete-${index}`}>
        //                         Delete
        //                     </Tooltip>
        //                 }
        //             >
        //                 <img
        //                     src={deleteIcon}
        //                     alt="Delete"
        //                     onClick={() => {
        //                         if (newMode === true) {
        //                             return;
        //                         } else {
        //                             handleGenDetailsDeleteRow(index)
        //                         }
        //                     }}
        //                     style={{
        //                         width: '20px',
        //                         height: '20px',
        //                         marginTop: '7px',
        //                         marginLeft: '7px'
        //                     }}
        //                 />
        //             </OverlayTrigger>
        //         </div>
        //     ),
        //     width: '7.4rem',
        // },
        {
            selector: row => row.Gen_range_id,
            cell: (row, index) => (
                <input value={row.Gen_range_id} hidden />
            ),
            width: '0rem',
        },
        {
            selector: row => row.gen_range_code,
            cell: (row, index) => (
                <input value={row.gen_range_code} hidden />
            ),
            width: '0rem'
        }
    ];

    return (
        <div className="popup_ring">
            <div className="popup-inner_ring">
                <div className='div_header_ring'><h4>GENERAL RANGES</h4></div>
                <div className='inputflex'>
                    <div className="row mb-1 d-flex">
                        <div className="col-12 col-md-4 mt-2">
                            <div className="inputOnText ">

                                <div className="form-control size_address2 ms-3">
                                    <div className="row mb-1">

                                        <div className="col-12 col-md-12 d-flex align-items-center">
                                            <label className='me-1 range_width' htmlFor='rangeName'>Range Name:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="Gen_range_name"
                                                value={Gen_range_name}
                                                onChange={(event) => setGen_range_name(event.target.value)}
                                                placeholder="Enter Range Name"
                                                disabled={newMode}
                                                id='rangeName'
                                            />

                                        </div>
                                    </div>
                                    <div className="col-12 col-md-12  d-flex mt-3 align-items-center justify-content-end">
                                        
                                            <button className="btn btn-primary "
                                                onClick={handleNewClick}>New</button>
                                            <button className="btn btn-primary ms-1 me-1"
                                                disabled={newMode} onClick={handlesaveGenRangeSlab}>Save</button>
                                            <button className="btn btn-secondary  me-1"
                                                disabled={newMode} onClick={handleRangetableClear}>Clear</button>
                                            <button className="btn btn-danger "
                                                onClick={() => {
                                                    onRowSelect(null);
                                                }}>Close</button>
                                        
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
                {/* <div className='inputflex'>
                    <div className="row mb-1 d-flex">
                        <div className="col-12 col-md-4 mt-2">
                            <div className="inputOnText">
                                <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Range Details:</label>
                                <div className="form-control size_address2 ms-3">
                                    <div className="row mb-1">
                                        <div className="col-12 col-md-4 d-flex align-items-center">
                                            <label className='range_width1' htmlFor='gen_range_form'>Range From:</label>
                                            <input
                                                type="text"
                                                className="form-control" // Use "form-control" for Bootstrap styling
                                                id="gen_range_form" // Set the id to match the label's htmlFor
                                                name="gen_range_form"
                                                value={genRangeData.gen_range_form} // Bind to state variable correctly
                                                onChange={handleGenChange} // Handle input change
                                            />


                                        </div>
                                        <div className="col-12 col-md-4 d-flex align-items-center">
                                            <label className=' range_width1'>Range To:</label>
                                            <input
                                                type="text"
                                                className="form-control "
                                                name="gen_range_to"
                                                value={genRangeData.gen_range_to}
                                                onChange={handleGenChange}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                </div> */}
                {/* <div className='inputflex'>
                    <div className="row mb-1 d-flex">
                        <div className="col-12 col-md-4 mt-2">
                            <div className="inputOnText">
                                <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Normal Charge</label>
                                <div className="form-control size_address2 ms-3">
                                    <div className="row mb-1">
                                        <div className="col-12 col-md-4 d-flex align-items-center">

                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="gen_flat_normalYes"
                                                name="gen_flat_normal"
                                                value="F"
                                                checked={genRangeData.gen_flat_normal === 'F'}
                                                onChange={(e) => handleGenChange(e)}
                                            />
                                            <label className="form-check-label ms-1" htmlFor="gen_flat_normalYes">Flat</label>
                                        </div>
                                        <div className="col-12 col-md-4 d-flex align-items-center">

                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="gen_percent_normalYes"
                                                name="gen_flat_normal"
                                                value="P"
                                                checked={genRangeData.gen_flat_normal === 'P'}
                                                onChange={(e) => handleGenChange(e)}
                                            />
                                            <label className='form-check-label ms-1' htmlFor='gen_percent_normalYes'>Percent</label>
                                        </div>
                                        <div className="col-12 col-md-4 d-flex align-items-center">
                                            <label className='me-1'>Charges:</label>
                                            <input
                                                type="text"
                                                className="form-control "
                                                name="gen_charge_normal"
                                                value={genRangeData.gen_charge_normal}
                                                onChange={handleGenChange}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                </div> */}
                {/* <div className="row mb-1 d-flex">
                    <div className="col-12 col-md-4 mt-2">
                        <div className="inputOnText">
                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Square Up Charge</label>
                            <div className="form-control size_address2 ms-3 ">
                                <div className="row mb-1">
                                    <div className="col-12 col-md-4 d-flex align-items-center">
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="gen_flatYes"
                                                name="gen_flat"
                                                value="F"
                                                checked={genRangeData.gen_flat === 'F'}
                                                onChange={(e) => handleGenChange(e)}
                                            />
                                            <label className="form-check-label ms-1" htmlFor="gen_flatYes">Flat</label>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-4 d-flex align-items-center">

                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="gen_percentYes"
                                            name="gen_flat"
                                            value="P"
                                            checked={genRangeData.gen_flat === 'P'}
                                            onChange={(e) => handleGenChange(e)}
                                        />
                                        <label className='form-check-label ms-1' htmlFor="gen_percentYes">Percent</label>
                                    </div>
                                    <div className="col-12 col-md-4 d-flex align-items-center">
                                        <label className='me-1'>Charges:</label>
                                        <input
                                            type="text"
                                            className="form-control "
                                            name="gen_sq_up_charges"
                                            value={genRangeData.gen_sq_up_charges}
                                            onChange={handleGenChange}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div> */}
                <div>
                    {/* <h5 className='mt-2 text-center '>Bank Details</h5> */}
                    <DataTable className='my-3'
                        columns={genRangecolumns}
                        data={genRangeData}
                        customStyles={customStyles}
                        highlightOnHover
                        responsive />
                    <div className="d-flex flex-end mt-2 mb-2 me-2">
                        <button className="btn btn-success " onClick={handleSavedGenRanges} disabled={newMode} >Save Ranges</button>
                        <button className="btn btnColorAddRow ms-3" onClick={handleAddRow} disabled={newMode}  >Add Row</button>
                    </div>
                </div>
                <div className='d-flex mx-0'>
                    <div className='table_border'>
                        <div className="table-scroll"> {/* Add scrollable container */}
                            <table className='tablering '>
                                <thead className='theadring'>
                                    <tr className='b'>
                                        <th className='tdringCen' hidden>Range code</th>
                                        <th className='tdringCen' hidden>Range Id</th>
                                        <th className='tdringCen'>Range Name</th>
                                        <th className='tdringCen'>Range From</th>
                                        <th className='tdringCen'>Range To</th>
                                        <th className='tdringCen'>Nor. Rate</th>
                                        <th className='tdringCen'>Nor. Crit.</th>
                                        <th className='tdringCen'>Sq. Up Rate</th>
                                        <th className='tdringCen'>Sq. Up Crit.</th>
                                        <th className='tdringCen'>Status</th>
                                        <th className='tdringCen'>Start Date</th>
                                        <th className='tdringCen'>End Date</th>
                                    </tr>
                                </thead>
                                <tbody className='tbodyring'>
                                    {GenRangeTableDatas.map((row, index) => (
                                        <tr className={`trring ${selectedRangeRow === row ? 'selectedrowcolor' : ''}`}
                                            key={index}
                                            onClick={() => {
                                                handleGenRangeRowClick(row)
                                            }}>
                                            <td className='tdringCen' hidden>{row.range_code}</td>
                                            <td className='tdringCen' hidden>{row.rg_id}</td>
                                            <td className='tdringCen range-width-rgName'>{row.rg_name}</td>
                                            <td className='tdringNew range-width'>{row.rg_from}</td>
                                            <td className='tdringNew range-width'>{row.rg_to}</td>
                                            <td className='tdringNew range-width-sm'>{row.brok_rate}</td>
                                            <td className='tdringCen range-width-sm'>{row.brok_crit}</td>
                                            <td className='tdringNew range-width-sm'>{row.sq_up_brok}</td>
                                            <td className='tdringCen range-width-sm'>{row.sq_up_crit}</td>
                                            <td className='tdringCen'>{row.status}</td>
                                            <td className='tdringCen range-width-dates'>{
                                            row.start_date?row.start_date = format(parseISO(row.start_date), 'yyyy-MM-dd'):''}</td>
                                            <td className='tdringCen range-width-dates'>{
                                            row.end_date?row.end_date = format(parseISO(row.end_date), 'yyyy-MM-dd'):''}</td>
                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='ms-2 mt-4 d-flex flex-column'> {/* Use flex column for vertical stacking */}
                        {/* <button className="btn btn-primary mb-2" onClick={handleAddGenRangeSlabRow}>Add</button> */}
                        {/* <button className="btn btn-secondary mb-2" onClick={handleDeleteRow}>Delete</button> */}
                        {/* <button className="btn btn-danger" onClick={handleGenRangeTableClear}>Clear</button> */}
                    </div>

                </div>
            </div>


        </div>

    );
}

export default Gen_Ranges;
