import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './brok_slab.css'; // Custom CSS
import { Tabs, Tab, Button } from 'react-bootstrap';
import Gen_Ranges from './gen_rings';
import Del_Ranges from './Del_ranges';
import { format, parseISO } from 'date-fns';
import ScripSearchPop from './scripSearch';
import axios from 'axios';
import { BASE_URL } from ".././constants";

const SlabForm = () => {
    // const [selectedGenRangeName, setSelectedGenRangeName] = useState('');
    // const [selectedGenRangeId, setSelectedGenRangeId] = useState('');
    // const [selectedDelRangeName, setSelectedDelRangeName] = useState('');
    // const [selectedDelRangeId, setSelectedDelRangeId] = useState('');
    const [showScripPopup, setshowScripPopup] = useState(false);
    const [noDataMessage, setNoDataMessage] = useState('');
    const [norInp, setNorInp] = useState('');
    const [squpInp, setSqupInp] = useState('');
    const [delivInp, setDelivInp] = useState('');
    const [slabId, setSlabId] = useState('');
    const [selectedRangetableRow, setSelectedRangeTableRow] = useState(null);
    const [settlementTypes, setSettlementTypes] = useState([]);
    const [slabName, setSlabName] = useState('');
    const [alisName, setAlisName] = useState('');
    const [dateApplicable, setDateApplicable] = useState('');
    const [toDate, setToDate] = useState('');
    const [activeTab, setActiveTab] = useState('normal');
    const [showGenRangesPopup, setShowGenRangesPopup] = useState(false);
    const [showDelRangesPopup, setShowDelRangesPopup] = useState(false);
    const [NormaltableData, setNormalTableData] = useState([]);
    const [scriptableData, setScripTableData] = useState([]);
    const [norRangeNames, setNorRangeNames] = useState([]);
    const [delRangeNames, setDelRangeNames] = useState([]);
    const [deliveryTableData, setDeliveryTableData] = useState([]);
    const [normalData, setNormalData] = useState({
        settlementType_normal: '',
        range_applicable: 'N',
        range: '',
        rate_normal: '',
        sq_up_rate: '',
        sq_up_crit: 'P',
        app_to_normal_slab: '',
        app_form_normal_slab: '',
        brok_crit: 'P',
        nor_sl_code: null,
        delivery_range_applicable: 'N',
        delivery_brok_crit: 'P',
        delivery_rate: '',
        delivery_range: ''
    });
    const [scripData, setScripData] = useState({
        scrip_app_form: '',
        scrip_app_to: '',
        scrip_brok_crit: 'P',
        scrip_rate: '',
        scrip_range_applicable: 'N',
        scrip_range: '',
        scrip_Sq_Up_rate: '',
        scrip_sq_up_crit: 'P',
        scrip_cd: '',
        scrip_value: '',
        ss_sl_code: null
    })
    // const [deliveryData, setDeliveryData] = useState({
    //     delivery_app_from: '',
    //     delivery_app_to: '',
    //     delivery_brok_crit: '',
    //     delivery_range: '',
    //     delivery_range_applicable: '',
    //     delivery_rate: '',
    //     delivery_settlementType_normal: '',
    //     dl_sl_code: null
    // })

    const handlesaveMasterSlab = async () => {
        if (!slabId) {
            alert("Please enter Slab Id.");
            return;
        };

        if (!slabName) {
            alert("Please enter Slab Name.");
            return;
        };

        if (!alisName) {
            alert("Please enter Alias Name.");
            return;
        };

        // if(!dateApplicable){
        //     alert("Please enter the Date Applicable!");
        // return;
        // };
        // if(!toDate){
        //     alert("Please enter the To Date!");
        // return;
        // };

        const slabData = {
            slab_id: slabId,
            slab_name: slabName,
            alias: alisName,
            date_applicable: dateApplicable,
            to_date: toDate,
        };
        console.log('slabData', slabData);
        try {
            const response = await axios.post(`${BASE_URL}/api/cash_bill_slab_master`, slabData);

            // Handle success (e.g., show a success message, reset form, etc.)
            console.log('Data saved successfully:', response.data);
            alert('Data saved successfully!');
            clearFunc();
        } catch (error) {
            // Handle error (e.g., show an error message)
            console.error('Error saving data:', error);
            alert('Error saving data. Please try again.');
        }
    };

    const clearFunc = () => {
        setSlabId('');
        setSlabName('');
        setAlisName('');
        setDateApplicable('');
        setToDate('');
    }

    const handleRowClick = (row) => {
        console.log('row-----', row);
        setSelectedRangeTableRow(row);
        const appFromDate = row.date_app ? new Date(row.date_app).toLocaleDateString('en-CA') : ''; // Format as YYYY-MM-DD
        if(row.date_to){
            alert('This row slab is inactive!');
            return;
        }
        setNormalData({
            settlementType_normal: `${row.int_mkt_type}`, // or whichever field you want to map
            range_applicable: row.rs === 'Y' ? 'Y' : 'N', // Adjust as needed
            range: row.range_id,
            brok_crit: row.brok_crit,
            rate_normal: row.brok_rate,
            sq_up_crit: row.sq_up_crit,
            sq_up_rate: row.sq_up_brok,
            app_form_normal_slab: appFromDate,
            app_to_normal_slab: '',
            nor_sl_code: row.nor_sl_code,
            delivery_range_applicable: row.deliv_rs === 'Y' ? 'Y' : 'N',
            delivery_brok_crit: row.deliv_brok_crit,
            delivery_rate: row.deliv_brok_rate,
            delivery_range: row.deliv_range_id
        });
    };

    const handleScripRowClick = (row) => {
        console.log('row-----', row);
        setSelectedRangeTableRow(row);
        if (row.date_app) {
            var FromDate = format(parseISO(row.date_app), 'yyyy-MM-dd')
        }
        // row.date_app ? new Date(row.date_app).toLocaleDateString('en-CA') : ''; // Format as YYYY-MM-DD
        if (row.date_to) {
            alert('This row slab is inactive!');
            return;
            // var ToDate = format(parseISO(row.date_to), 'yyyy-MM-dd')
        }

        // row.date_to ? new Date(row.date_to).toLocaleDateString('en-CA') : '';
        setScripData({
            scrip_cd: row.series,
            scrip_value: row.scrip_cd,
            scrip_range_applicable: row.rs === 'Y' ? 'Y' : 'N',
            scrip_range: row.range_id,
            scrip_brok_crit: row.brok_crit,
            scrip_rate: row.brok_rate,
            scrip_sq_up_crit: row.sq_up_crit,
            scrip_Sq_Up_rate: row.sq_up_brok,
            scrip_app_form: FromDate,
            scrip_app_to: '',
            ss_sl_code: row.ss_sl_code
        });
    };

    // const handleDeliveryRowClick = (row) => {
    //     setSelectedRangeTableRow(row);
    //     console.log('row-----', row);
    //     const appFromDate = row.date_app ? new Date(row.date_app).toLocaleDateString('en-CA') : ''; // Format as YYYY-MM-DD
    //     const appToDate = row.date_to ? new Date(row.date_to).toLocaleDateString('en-CA') : '';
    //     // setDeliveryData({

    //     //     delivery_range_applicable: row.rs === 'Y' ? 'Y' : 'N', // Adjust as needed
    //     //     delivery_range: row.range_id,
    //     //     delivery_brok_crit: row.brok_crit,
    //     //     delivery_rate: row.brok_rate,
    //     //     delivery_settlementType_normal: row.int_mkt_type,
    //     //     delivery_app_from: appFromDate,
    //     //     delivery_app_to: appToDate,
    //     //     dl_sl_code: row.dl_sl_code
    //     // });
    // };

    const populateFunction = async () => {

        let res = await axios.get(`${BASE_URL}/api/search_cash_bill_slab/${slabId}`);
        // console.log('upar wala main slab',res.data);
        if (slabId) {
            try {
                if (res.data.length > 0) {
                    setSlabName(res.data[0].slab_name);
                    setAlisName(res.data[0].alias);
                    if (res.data[0].date_app) {
                        const dateString = res.data[0].date_app;
                        const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
                        setDateApplicable(formattedDate);
                    }
                    if (res.data[0].date_to) {
                        const dateString = res.data[0].date_to;
                        const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
                        setToDate(formattedDate);
                    }
                } else if (res.data.length === 0) {
                    alert('Slab Not Found.')
                    setSlabName('');
                    setAlisName('');
                    setDateApplicable('');
                    setToDate('');
                    return;
                }
            } catch (error) {
                alert(error);
            }
        }


    }

    const fetchData = async () => {
        if (slabId) {
            try {
                let response;
                switch (activeTab) {
                    case 'normal':
                        populateFunction();
                        response = await axios.get(`${BASE_URL}/api/get_cash_bill_normal_slab/${slabId}`);
                        setNormalTableData(response.data);
                        if (response.data.length === 0) {
                            setNoDataMessage('No data available for this Slab ID in the Normal tab.');
                        } else {
                            setNoDataMessage('');

                        }
                        break;


                    case 'scripwise':
                        populateFunction();
                        response = await axios.get(`${BASE_URL}/api/cash_bill_scrip_slab/${slabId}`);
                        setScripTableData(response.data);
                        if (response.data.length === 0) {
                            setNoDataMessage('No data available for this Slab ID in the Scrip tab.');
                        } else {
                            setNoDataMessage('');
                        }
                        break;

                    // case 'delivery':
                    //     response = await axios.get(`${BASE_URL}/api/cash_bill_delivery_slab/${slabId}`);
                    //     setDeliveryTableData(response.data);
                    //     if (response.data.length === 0) {
                    //         setNoDataMessage('No data available for this Slab ID in the Delivery tab.');
                    //     } else {
                    //         setNoDataMessage('');
                    //     }
                    //     break;

                    default:
                        console.error('Unknown tab');
                }

            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setNormalTableData([]);
                    // setDeliveryTableData([]);
                    setScripTableData([]);
                    alert('No record found for this Slab Id in the table.');
                } else {
                    console.error('Error fetching data:', error);
                    alert('Error fetching data. Please try again.');
                }
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [slabId, activeTab]);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/rangeNamesNormal`).then(res => setNorRangeNames(res.data));
        axios.get(`${BASE_URL}/api/rangeNamesDel`).then(res => setDelRangeNames(res.data));

    }, []);


    useEffect(() => {
        const fetchSettlementTpyes = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/slab-settlementTye`);
                const data = await response.json();
                setSettlementTypes(data);
                console.log('categories', data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchSettlementTpyes();
    }, []);

    const handleRowRingdSelect = (Gen_range_name, Gen_range_id) => {
        // setSelectedGenRangeName(Gen_range_name);
        // setSelectedGenRangeId(Gen_range_id);
        setNormalData({ ...normalData, range: Gen_range_id }); // Set the dropdown value
        setShowGenRangesPopup(false); // Close the popup or any other action
    };

    const handleRowDelRangeSelect = (Del_range_name, Del_range_id) => {
        // setSelectedDelRangeName(Del_range_name);
        // setSelectedDelRangeId(Del_range_id);
        // setDeliveryData({ ...deliveryData, delivery_range: Del_range_id });
        setShowDelRangesPopup(false);
    };

    const handleNormalChange = (e) => {
        if (e && e.target) {
            const { name, value, type, checked } = e.target;
            const finalValue = type === 'checkbox' ? checked : value;
            setNormalData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
            setNormalData((prevData) => ({
                ...prevData,
                [name]: finalValue,
            }));
        } else {
            console.error('Event is undefined or does not have target Normal tab');
        }
    };

    const handleScripChange = (e) => {
        if (e && e.target) {
            const { name, value, type, checked } = e.target;
            const finalValue = type === 'checkbox' ? checked : value;
            setScripData((prevData) => ({
                ...prevData,
                [name]: finalValue,
            }));
        } else {
            console.error('Event is undefined or does not have target in ScripTab');
        }
    };

    // const handleDeliveryData = (e) => {

    //     if (e && e.target) {
    //         const { name, value, type, checked } = e.target;
    //         const finalValue = type === 'checkbox' ? checked : value;
    //         setDeliveryData((prevData) => ({
    //             ...prevData,
    //             [name]: value,
    //         }));
    //         setDeliveryData((prevData) => ({
    //             ...prevData,
    //             [name]: finalValue,
    //         }));
    //     } else {
    //         console.error('Event is undefined or does not have target in ScripTab');
    //     }
    // };

    // const handleAddDeliverySlabRow = async () => {
    //     if (!slabId) {
    //         alert("Please Save the Slab ID and other Details!");
    //         return;
    //     }

    // // Validation checks for deliveryData
    // if (!deliveryData.delivery_app_from) {
    //     alert("Please enter the Delivery Application Form details!");
    //     return;
    // }

    // if (!deliveryData.delivery_app_to) {
    //     alert("Please enter the Delivery Application To details!");
    //     return;
    // }

    // if (!deliveryData.delivery_brok_crit) {
    //     alert("Please enter the Delivery Basis!");
    //     return;
    // }

    // if (!deliveryData.delivery_range) {
    //     alert("Please enter the Delivery Range!");
    //     return;
    // }

    // if (!deliveryData.delivery_range_applicable) {
    //     alert("Please specify if the Delivery Range is applicable!");
    //     return;
    // }

    // if (!deliveryData.delivery_rate) {
    //     alert("Please enter the Delivery Rate!");
    //     return;
    // }

    // if (!deliveryData.delivery_settlementType_normal) {
    //     alert("Please select the Delivery Settlement Type!");
    //     return;
    // }



    // console.log('deliveryData before sending:', deliveryData);
    // console.log('slabId before sending:', slabId);
    // const data = {
    //     deliveryData,
    //     slabId,
    //     sett_type_del: normalData.settlementType_normal
    // };
    // console.log('data before sending:', data);

    // try {
    //     const response = await axios.post('${BASE_URL}/api/save_delivery_slab', data);
    //     console.log('Data added successfully:', response.data);
    // setDeliveryTableData(response.data);
    // alert('Data added successfully!');

    // Resetting deliveryData
    // setDeliveryData({
    //     delivery_app_from: '',
    //     delivery_app_to: '',
    //     delivery_brok_crit: '',
    //     delivery_range: '',
    //     delivery_range_applicable: '',
    //     delivery_rate: '',
    //     delivery_settlementType_normal: '',
    //     dl_sl_code: null,
    // });
    //         fetchData();
    //     } catch (error) {
    //         console.error('Error adding data:', error);
    //         alert('Error adding data. Please try again.');
    //     }
    // };

    const handleAddNormalSlabRow = async () => {
        if (!slabId) {
            alert("Please Save the Slab id and other Details !!")
            return;
        }

        if (!normalData.settlementType_normal) {
            alert("Please select the Settlement Type!");
            return;
        }

        if (!normalData.range_applicable) {
            alert("Please select the Normal Range!");
            return;
        }

        if (!normalData.rate_normal) {
            alert("Please enter Normal Rate!");
            return;
        }

        if (!normalData.sq_up_rate) {
            alert("Please enter Sq. Up Rate!");
            return;
        }

        if (!normalData.sq_up_crit) {
            alert("Please enter Sq. Up Basis!");
            return;
        }

        // if (!normalData.flat_Normal && !normalData.percent_normal && !normalData.rate_normal) {
        //     alert("Please enter all details for Normal!");
        //     return;
        // }

        // if (!normalData.flat_sq_up_normal && !normalData.percent_sq_up_normal && !normalData.sq_up_rate) {
        //     alert("Please enter all details for Square Up!");
        //     return;
        // }

        if (!normalData.app_form_normal_slab && !normalData.app_to_normal_slab) {
            alert("Please Enter the Period Details!");
            return;
        }
        // console.log('normalData before sending:', normalData);
        console.log('slabId before sending:', slabId);
        const data = {
            normalData,
            slabId
        };
        console.log('data before sending:', data);


        try {
            const response = await axios.post(`${BASE_URL}/api/save_normal_slab`, data);
            console.log('Data added successfully:', response.data);
            setNormalTableData(response.data);
            alert('Data added successfully!');


            setNormalData({
                settlementType_normal: '',
                range_applicable: 'N',
                range: '',
                rate_normal: '',
                sq_up_rate: '',
                sq_up_crit: 'P',
                app_to_normal_slab: '',
                app_form_normal_slab: '',
                brok_crit: 'P',
                nor_sl_code: null,
                delivery_range_applicable: 'N',
                delivery_brok_crit: 'P',
                delivery_rate: '',
                delivery_range: ''
            });
            fetchData();
        } catch (error) {
            console.error('Error adding data:', error);
            alert('Error adding data. Please try again.');
        }
    };

    const handleAdd = () => {
        handleAddNormalSlabRow();
        // handleAddDeliverySlabRow();
    }

    const handleAddScripSlabRow = async () => {
        if (!slabId) {
            alert("Please Save the Slab ID and other Details!");
            return;
        }

        // Validation checks for scripData
        if (!scripData.scrip_app_form) {
            alert("Please enter the Scrip Application Form details!");
            return;
        }

        // if (!scripData.scrip_app_to) {
        //     alert("Please enter the Scrip Application To details!");
        //     return;
        // }

        if (!scripData.scrip_brok_crit) {
            alert("Please enter the Scrip Broker Criteria!");
            return;
        }

        if (!scripData.scrip_rate) {
            alert("Please enter the Scrip Rate!");
            return;
        }

        if (!scripData.scrip_range_applicable) {
            alert("Please specify if the Scrip Range is applicable!");
            return;
        }

        // if (!scripData.scrip_range) {
        //     alert("Please enter the Scrip Range!");
        //     return;
        // }

        if (!scripData.scrip_Sq_Up_rate) {
            alert("Please enter the Scrip Square Up Rate!");
            return;
        }

        if (!scripData.scrip_sq_up_crit) {
            alert("Please enter the Scrip Square Up Criteria!");
            return;
        }

        if (!scripData.scrip_cd) {
            alert("Please enter the Scrip Code!");
            return;
        }

        if (!scripData.scrip_value) {
            alert("Please enter the Scrip Value!");
            return;
        }



        console.log('scripData before sending:', scripData);
        console.log('slabId before sending:', slabId);
        const data = {
            scripData,
            slabId,
        };

        try {
            const response = await axios.post(`${BASE_URL}/api/save_scrip_slab`, data);
            console.log('Data added successfully:', response.data);
            alert('Data added successfully!');
            setScripTableData(response.data);

            // Resetting scripData
            setScripData({
                scrip_app_form: '',
                scrip_app_to: '',
                scrip_brok_crit: 'P',
                scrip_rate: '',
                scrip_range_applicable: 'N',
                scrip_range: '',
                scrip_Sq_Up_rate: '',
                scrip_sq_up_crit: 'P',
                scrip_cd: '',
                scrip_value: '',
                ss_sl_code: ''
            });
            // fetchData();
        } catch (error) {
            console.error('Error adding data:', error);
            alert('Error adding data. Please try again.');
        }
    };



    const handleRowScripSelect = (name, code) => {
        setScripData({
            scrip_app_form: '',
            scrip_app_to: '',
            scrip_brok_crit: 'P',
            scrip_rate: '',
            scrip_range_applicable: 'N',
            scrip_range: '',
            scrip_Sq_Up_rate: '',
            scrip_sq_up_crit: 'P',
            scrip_cd: name,
            scrip_value: code,
            ss_sl_code: ''
        });
        setshowScripPopup(false);
    };

    // const handleNormalTableDataDelete = async () => {
    //     if (!selectedRangetableRow) {
    //         alert('Please select a row to delete.');
    //         return;
    //     }

    //     try {
    //         // Make the API call to delete the row
    //         const response = await axios.delete(`${BASE_URL}/api/cash_bill_Delete_NormalTable/${selectedRangetableRow.slab_id}`, {
    //             data: {
    //                 nor_sl_code: selectedRangetableRow.nor_sl_code,
    //                 int_mkt_type: selectedRangetableRow.int_mkt_type,
    //                 brok_crit: selectedRangetableRow.brok_crit,
    //                 brok_rate: selectedRangetableRow.brok_rate,
    //                 sq_up_brok: selectedRangetableRow.sq_up_brok,
    //                 sq_up_crit: selectedRangetableRow.sq_up_crit
    //             }
    //         });

    //         // Handle success
    //         console.log('Delete successful:', response.data);
    //         // Remove the deleted item from the local state
    //         setNormalTableData(prevData => prevData.filter(row => row.slab_id !== selectedRangetableRow.slab_id));
    //         alert('Row deleted successfully!');

    //         // Optionally, reset the selected row
    //         setSelectedRangeTableRow(null);
    //     } catch (error) {
    //         console.error('Error deleting row:', error);
    //         alert('Error deleting row. Please try again.');
    //     }
    // };
    // const handleScripTableDataDelete = async () => {
    //     if (!selectedRangetableRow) {
    //         alert('Please select a row to delete.');
    //         return;
    //     }
    //     const appFromDate = selectedRangetableRow.date_app ?
    //         new Date(selectedRangetableRow.date_app).toLocaleDateString('en-CA') : ''; // Format as YYYY-MM-DD

    //     const appToDate = selectedRangetableRow.date_to ?
    //         new Date(selectedRangetableRow.date_to).toLocaleDateString('en-CA') : '';

    //     try {
    //         // Make the API call to delete the row
    //         const response = await axios.delete(`${BASE_URL}/api/cash_bill_Delete_ScripTable/${selectedRangetableRow.slab_id}`, {
    //             data: {
    //                 ss_sl_code: selectedRangetableRow.ss_sl_code,
    //                 scrip_cd: selectedRangetableRow.scrip_cd,
    //                 brok_crit: selectedRangetableRow.brok_crit,
    //                 brok_rate: selectedRangetableRow.brok_rate,
    //                 sq_up_brok: selectedRangetableRow.sq_up_brok,
    //                 sq_up_crit: selectedRangetableRow.sq_up_crit,

    //                 date_app: appFromDate,
    //                 date_to: appToDate
    //             }
    //         });

    //         // Handle success
    //         console.log('Delete successful:', response.data);
    //         // Remove the deleted item from the local state
    //         setScripTableData(prevData => prevData.filter(row => row.slab_id !== selectedRangetableRow.slab_id));
    //         alert('Row deleted successfully!');

    //         // Optionally, reset the selected row
    //         setSelectedRangeTableRow(null);
    //     } catch (error) {
    //         console.error('Error deleting row:', error);
    //         alert('Error deleting row. Please try again.');
    //     }
    // };
    // const handleDeliveryTableDataDelete = async () => {
    //     if (!selectedRangetableRow) {
    //         alert('Please select a row to delete.');
    //         return;
    //     }

    //     const appFromDate = selectedRangetableRow.date_app ?
    //         new Date(selectedRangetableRow.date_app).toLocaleDateString('en-CA') : ''; // Format as YYYY-MM-DD

    //     const appToDate = selectedRangetableRow.date_to ?
    //         new Date(selectedRangetableRow.date_to).toLocaleDateString('en-CA') : '';


    //     try {
    //         // Make the API call to delete the row
    //         const response = await axios.delete(`${BASE_URL}/api/cash_bill_Delete_DeliveryTable/${selectedRangetableRow.slab_id}`, {
    //             data: {
    //                 dl_sl_code: selectedRangetableRow.dl_sl_code,
    //                 int_mkt_type: selectedRangetableRow.int_mkt_type,
    //                 brok_crit: selectedRangetableRow.brok_crit,
    //                 brok_rate: selectedRangetableRow.brok_rate,
    //                 rs: selectedRangetableRow.rs,
    //                 // range_id: selectedRangetableRow.range_id,
    //                 date_app: appFromDate,
    //                 date_to: appToDate
    //             }
    //         });

    //         // Handle success
    //         console.log('Delete successful:', response.data);
    //         // Remove the deleted item from the local state
    //         setDeliveryTableData(prevData => prevData.filter(row => row.slab_id !== selectedRangetableRow.slab_id));
    //         alert('Row deleted successfully!');

    //         // Optionally, reset the selected row
    //         setSelectedRangeTableRow(null);
    //     } catch (error) {
    //         console.error('Error deleting row:', error);
    //         alert('Error deleting row. Please try again.');
    //     }
    // };

    return (
        <div className="container  mt-2">

            <div className="card main-box">
                <div className="card-header text-center color_header">
                    <h4 className='slabheader'>Brokerage Slab Master</h4>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <div className="row mb-3">
                            <div className="col-md-6 mb-2 d-flex">
                                <div className='d-flex align-items-center'>
                                    <label className='width_slab_2 ' htmlFor='slabId'>Slab ID:</label>
                                    <input
                                        type="number"
                                        placeholder="ID"
                                        value={slabId}
                                        className='form-control  me-2 width_slab_input'
                                        onChange={(e) => setSlabId(e.target.value)}
                                        id='slabId'
                                    />
                                    <input
                                        type="text"
                                        placeholder="Enter value"
                                        value={slabName}
                                        className='form-control '
                                        onChange={(e) => setSlabName(e.target.value)}
                                    />
                                </div>

                            </div>
                            <div className="col-md-6 mb-2 d-flex align-items-center">
                                <label className='me-2'>Alias:</label>
                                <input
                                    type="text"
                                    placeholder="Enter Alias"
                                    className='form-control'
                                    value={alisName}
                                    onChange={(e) => setAlisName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6 mb-2 d-flex align-items-center">
                                <label className=' width_slab_3'>Date Applicable:</label>
                                <input
                                    type="date"
                                    value={dateApplicable}
                                    className='form-control width_slab_input_1'
                                    onChange={(e) => setDateApplicable(e.target.value)}
                                />
                                <div className=" d-flex align-items-center">
                                    <label className=' width_slab_4'>To Date:</label>
                                    <input
                                        type="date"
                                        value={toDate}
                                        className='form-control width_slab_input_1'
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-4 mb-2 d-flex align-items-end">
                                <Button variant="success" className="btn_slab me-2" onClick={handlesaveMasterSlab}>
                                    Save
                                </Button>
                                <Button variant="primary" onClick={() => setShowGenRangesPopup(true)} className="btn_slab me-2">
                                    Gen. Range
                                </Button>
                                {showGenRangesPopup && <Gen_Ranges onRowSelect={handleRowRingdSelect} />}
                                <Button variant="warning" onClick={() => setShowDelRangesPopup(true)} className="btn_slab">
                                    Deliv. Range
                                </Button>
                                {showDelRangesPopup && <Del_Ranges onRowSelect={handleRowDelRangeSelect} />}
                            </div>

                        </div>



                    </div>

                    <Tabs
                        id="controlled-tab-example"
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className=" nav-tabs_slab"
                    >
                        <Tab eventKey="normal" title={<span className="nav-link_slab">Normal</span>}>
                            <div className="tab-content_slab">
                                <div className='inputflex mb-4'>
                                    <div className="row">
                                        {/* <div className="inputOnText"> */}
                                        {/* <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Settlement</label> */}
                                        {/* <div className="form-control size_address1 me-3"> */}
                                        <div className="row mb-1">
                                            <div className="col-12 col-md-12 d-flex align-items-center">
                                                <label className='width_sett px-2'>Settlement type:</label>
                                                <select
                                                    name="settlementType_normal"
                                                    className="form-select"
                                                    style={{ marginLeft: '0rem' }}
                                                    value={normalData.settlementType_normal}
                                                    onChange={handleNormalChange}
                                                >
                                                    <option value="">Select Settlement</option>
                                                    {settlementTypes.map(settlementType => (
                                                        <option key={settlementType.int_mkt_type} value={settlementType.int_mkt_type}>
                                                            {settlementType.description}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {/* </div> */}
                                        {/* </div> */}
                                    </div>
                                </div>
                                <div className=" div-des mt-4 mb-1 px-2">
                                    <div className='col'>
                                        <div className=" mb-1 col-width-nor">
                                            <div className="flexDirection width-nor">
                                                <label className='width_slab_1 mb-3 text-center label'>Normal</label>
                                                <div className='row width_slab_1 m-0 p-0 '>
                                                    <div className='col px-1 '>
                                                        <label className='width_slab_nor mb-3 text-center sub-label'>Range (Y/N)</label>
                                                        <select
                                                            name="range_applicable"
                                                            className="form-select width_slab_short_rannor margin mb-2"
                                                            // style={{ marginLeft: '0.2rem' }}
                                                            value={normalData.range_applicable}
                                                            onChange={handleNormalChange}
                                                        >
                                                            <option value="Y">Yes</option>
                                                            <option value="N">No</option>
                                                        </select>
                                                    </div>
                                                    <div className='col px-1'>
                                                        <label className=' width_slab_short mb-3 text-center sub-label'>Basis</label>
                                                        <div className='flexCol width_slab_short' style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                            <div className='flexRow me-2'>
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    id="flat_NormalYes"
                                                                    name="brok_crit"
                                                                    value="F"
                                                                    checked={normalData.brok_crit === 'F'}
                                                                    onChange={(e) => handleNormalChange(e)}
                                                                />
                                                                <label className="form-check-label ms-1" htmlFor="flat_NormalYes">Flat</label>
                                                            </div>
                                                            <div className='flexRow'>
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    id="flat_NormalYes"
                                                                    name="brok_crit"
                                                                    value="P"
                                                                    checked={normalData.brok_crit === 'P'}
                                                                    onChange={(e) => handleNormalChange(e)}
                                                                />
                                                                <label className="form-check-label ms-1" htmlFor="flat_NormalYes">Perc.</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col px-1'>
                                                        <label className='width_slab_short  mb-3 text-center sub-label'>Rate</label>
                                                        <input
                                                            type="number"
                                                            className="form-control width_slab_short mb-2"
                                                            name="rate_normal"
                                                            placeholder='Rate'
                                                            value={normalData.rate_normal}
                                                            onChange={handleNormalChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className=" mb-1 margin col-width-sq">
                                            <div className="flexDirection ">
                                                <label className='width_slab_1  mb-3 text-center label'>Square Up</label>
                                                <div className='row width_slab_1 m-0 p-0 '>
                                                    <div className='col px-1'>
                                                        <label className='width_slab_1  mb-3 text-center sub-label'>Basis</label>
                                                        <div className='flexCol' style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                            <div className='flexRow me-2'>
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    id="flat_NormalYes"
                                                                    name="sq_up_crit"
                                                                    value="F"
                                                                    checked={normalData.sq_up_crit === 'F'}
                                                                    onChange={(e) => handleNormalChange(e)}
                                                                />
                                                                <label className="form-check-label ms-1" htmlFor="flat_NormalYes">Flat</label>
                                                            </div>
                                                            <div className='flexRow'>
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    id="flat_NormalYes"
                                                                    name="sq_up_crit"
                                                                    value="P"
                                                                    checked={normalData.sq_up_crit === 'P'}
                                                                    onChange={(e) => handleNormalChange(e)}
                                                                />
                                                                <label className="form-check-label ms-1" htmlFor="flat_NormalYes">Perc.</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col px-1'>
                                                        <label className='width_slab_1  mb-3 text-center sub-label'>Rate</label>
                                                        <input
                                                            type="number"
                                                            className="form-control shortWidth mb-2"
                                                            name="sq_up_rate"
                                                            placeholder='Rate'
                                                            value={normalData.sq_up_rate}
                                                            onChange={handleNormalChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className=" mb-1 margin-left ">
                                            <div className=" flexDirection ">
                                                <label className='width_slab_1  mb-3 text-center label'>Delivery</label>
                                                <div className='row width_slab_1 m-0 p-0 '>
                                                    <div className='col px-1 '>
                                                        <label className='width_slab_nor  mb-3 text-center sub-label'>Range (Y/N)</label>
                                                        <select
                                                            name="delivery_range_applicable"
                                                            className="form-select width_slab_short_rannor margin mb-2"
                                                            // style={{ marginLeft: '0.2rem' }}
                                                            value={normalData.delivery_range_applicable}
                                                            onChange={handleNormalChange}
                                                        >
                                                            <option value="Y">Yes</option>
                                                            <option value="N">No</option>
                                                        </select>
                                                    </div>
                                                    <div className='col px-1'>
                                                        <label className='width_slab_short  mb-3 text-center sub-label'>Basis</label>
                                                        <div className='flexCol width_slab_short' style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                            <div className='flexRow me-2'>
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    id="flat_NormalYes"
                                                                    name="delivery_brok_crit"
                                                                    value="F"
                                                                    checked={normalData.delivery_brok_crit === 'F'}
                                                                    onChange={(e) => handleNormalChange(e)}
                                                                />
                                                                <label className="form-check-label ms-1" htmlFor="flat_NormalYes">Flat</label>
                                                            </div>
                                                            <div className='flexRow'>
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    id="flat_NormalYes"
                                                                    name="delivery_brok_crit"
                                                                    value="P"
                                                                    checked={normalData.delivery_brok_crit === 'P'}
                                                                    onChange={(e) => handleNormalChange(e)}
                                                                />
                                                                <label className="form-check-label ms-1" htmlFor="flat_NormalYes">Perc.</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col px-1'>
                                                        <label className='width_slab_short  mb-3 text-center sub-label'>Rate</label>
                                                        <input
                                                            type="number"
                                                            className="form-control width_slab_short mb-2"
                                                            name="delivery_rate"
                                                            placeholder='Rate'
                                                            value={normalData.delivery_rate}
                                                            onChange={handleNormalChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className=" mb-1 col-width-nor marLeftRange">
                                            <div className="flexDirection width-nor">
                                                <label className='width_slab_1 mb-3 text-center label'>Range</label>
                                                <div className='row width_slab_1 m-0 p-0 '>
                                                    <div className='col px-1 '>
                                                        <label className='width_slab_1 mb-3 text-center sub-label'>Normal</label>
                                                        <select
                                                            name="range"
                                                            className="form-select width_slab_1 mb-2"
                                                            // style={{ marginLeft: '0.2rem' }}
                                                            value={normalData.range}
                                                            onChange={handleNormalChange}
                                                        >
                                                            <option value='0'>Nor. Range</option>
                                                            {norRangeNames.length > 0 ? (
                                                                norRangeNames.map((row, index) => (
                                                                    <option key={index} value={row.range_id}>
                                                                        {row.range_name}
                                                                    </option>
                                                                ))
                                                            ) : (
                                                                <option disabled>No ranges available</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                    <div className='col px-1'>
                                                        <label className='width_slab_1 mb-3 text-center sub-label'>Delivery</label>
                                                        <select
                                                            name="delivery_range"
                                                            className="form-select width_slab_1 mb-2"
                                                            // style={{ marginLeft: '0.2rem' }}
                                                            value={normalData.delivery_range}
                                                            onChange={handleNormalChange}
                                                        >
                                                            <option value='0'>Del. Range</option>
                                                            {delRangeNames.length > 0 ? (
                                                                delRangeNames.map((row, index) => (
                                                                    <option key={index} value={row.range_id}>
                                                                        {row.range_name}
                                                                    </option>
                                                                ))
                                                            ) : (
                                                                <option disabled>No ranges available</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row my-3 px-2'>
                                    <div className='col-2 text-left'>
                                        <label>From Date</label>
                                        <input
                                            type="date"
                                            className="form-control width_slab_1 mb-2"
                                            name="app_form_normal_slab"
                                            value={normalData.app_form_normal_slab}
                                            onChange={handleNormalChange}
                                        />
                                    </div>
                                    <div className='col-2 text-left'>
                                        <label>To Date</label>
                                        <input
                                            type="date"
                                            className="form-control width_slab_1 mb-2"
                                            name="app_to_normal_slab"
                                            value={normalData.app_to_normal_slab}
                                            onChange={handleNormalChange}
                                        />
                                    </div>
                                    <div className=' col-2 ms-2 margin_noraml_btn'>
                                        <Button className='btn btn-success ms-4 mb-1' 
                                        onClick={handleAdd}
                                        style={{width:'50%'}}
                                        >Save</Button>
                                    </div>
                                </div>
                                <div className="mt-4 d-flex">
                                    <div className="normal-table-container">
                                        <table className="normal-table">
                                            <thead className='theadNormal'>
                                                <tr>
                                                    <th hidden className='th_normal table-width'>nor_sl_code</th>
                                                    <th hidden className='th_normal table-width'>Int. Mkt Type</th>
                                                    <th className='th_normal range-col-width'>Settlement</th>
                                                    <th className='th_normal table-width'>Nor. Rate</th>
                                                    <th className='th_normal table-width'>Nor. Basis</th>
                                                    <th className='th_normal table-width'>Sq Up Rate</th>
                                                    <th className='th_normal table-width'>Sq Up Basis</th>
                                                    <th className='th_normal table-width'>Range (Y/N)</th>
                                                    <th className='th_normal table-width'>Range</th>
                                                    <th className='th_normal table-width'>Del. Rate</th>
                                                    <th className='th_normal table-width'>Del. Basis</th>
                                                    <th className='th_normal table-width'>Del. Range (Y/N)</th>
                                                    <th className='th_normal table-width'>Del. Range</th>
                                                    <th className='th_normal table-width'>Date from</th>
                                                    <th className='th_normal table-width'>Date to</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {NormaltableData.map((row, index) => (
                                                    <tr key={index}
                                                        className={
                                                            `tr_normal ${selectedRangetableRow === row ? 'selectedRangetablerowcolor' : ''}`}
                                                        onClick={() => handleRowClick(row)}>
                                                        <td hidden className='td_normal'>{row.nor_sl_code}</td>
                                                        <td hidden className='td_normal'>{row.int_mkt_type}</td>
                                                        <td className='td_normal'>{row.desc}</td>
                                                        <td className='td_normal right-align'>{row.brok_rate}</td>
                                                        <td className='td_normal'>{row.brok_crit}</td>
                                                        <td className='td_normal right-align'>{row.sq_up_brok}</td>
                                                        <td className='td_normal'>{row.sq_up_crit}</td>
                                                        <td className='td_normal'>{row.rs}</td>
                                                        <td className='td_normal'>{row.range_id}</td>
                                                        <td className='td_normal right-align'>{row.deliv_brok_rate}</td>
                                                        <td className='td_normal'>{row.deliv_brok_crit}</td>
                                                        <td className='td_normal'>{row.deliv_rs}</td>
                                                        <td className='td_normal'>{row.deliv_range_id}</td>
                                                        <td className='td_normal'>{    
                                                        row.date_app?row.date_app=format(
                                                        parseISO( row.date_app), 'yyyy-MM-dd'):''}</td>
                                                        <td className='td_normal'>{
                                                        row.date_to?row.date_to=format(
                                                        parseISO( row.date_to), 'yyyy-MM-dd'):''}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {noDataMessage && <p>{noDataMessage}</p>}
                                    </div>

                                    {/* <div className='ms-2 margin_noraml_btn'>
                                        <Button className='btn btn-success mb-1' onClick={handleAdd}>Save</Button>
                                        <Button variant="danger" onClick={handleNormalTableDataDelete}>Delete</Button>
                                    </div> */}

                                </div>

                            </div>
                        </Tab>
                        <Tab eventKey="scripwise" title={<span className="nav-link_slab">Scripwise</span>}>
                            <div className="tab-content_slab">
                                <div className='inputflex mb-4'>
                                    <div className="row">
                                        <div className="row mb-1">
                                            <div className="col-12 col-md-10 d-flex align-items-center">
                                                <label style={{ width: '12%', padding: '0' }}>Scrip:</label>

                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    name="scrip_value"
                                                    style={{ marginLeft: '0.5rem', marginRight: '0.5rem', width: '54%' }}
                                                    value={scripData.scrip_value}
                                                    onChange={handleScripChange}
                                                />

                                                <input
                                                    type="text"
                                                    className="form-control width_slab_input"
                                                    name="scrip_cd"
                                                    style={{ marginRight: '0.5rem', width: '16%' }}
                                                    value={scripData.scrip_cd}
                                                    onChange={handleScripChange}
                                                    placeholder='series'
                                                />

                                                <button className="btn btn-primary search_scripmaster_btn" style={{ marginLeft: '0.5rem' }} onClick={() => setshowScripPopup(true)}>
                                                    Search Scrip
                                                </button>
                                                {showScripPopup && <ScripSearchPop onRowSelect={handleRowScripSelect} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className=" div-des mt-4 mb-4 px-2">
                                    <div className='col-md-5 px-1'>
                                        <div className=" mb-1 ">
                                            <div className="flexDirection ">
                                                <label className=' mb-3 text-center label-scrip' style={{ width: '100%' }}>Normal</label>
                                                <div className='row  m-0 p-0 '>
                                                    <div className='col px-1 '>
                                                        <label className=' mb-3 text-center sub-label' style={{ width: '100%' }}>Range (Y/N)</label>
                                                        <select
                                                            name="scrip_range_applicable"
                                                            className="form-select margin mb-2"
                                                            // style={{ marginLeft: '0.2rem' }}
                                                            value={scripData.scrip_range_applicable}
                                                            onChange={handleScripChange}
                                                        >
                                                            <option value="Y">Yes</option>
                                                            <option value="N">No</option>
                                                        </select>
                                                    </div>
                                                    <div className='col px-1 '>
                                                        <label className=' mb-2 text-center sub-label' style={{ width: '100%' }}>Basis</label>
                                                        <div className='flexCol' style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                                            <div className='flexRow me-2'>
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    id="flat_NormalYes"
                                                                    name="scrip_brok_crit"
                                                                    value="F"
                                                                    checked={scripData.scrip_brok_crit === 'F'}
                                                                    onChange={(e) => handleScripChange(e)}
                                                                />
                                                                <label className="form-check-label ms-1" htmlFor="flat_NormalYes">Flat</label>
                                                            </div>
                                                            <div className='flexRow'>
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    id="flat_NormalYes"
                                                                    name="scrip_brok_crit"
                                                                    value="P"
                                                                    checked={scripData.scrip_brok_crit === 'P'}
                                                                    onChange={(e) => handleScripChange(e)}
                                                                />
                                                                <label className="form-check-label ms-1" htmlFor="flat_NormalYes">Perc.</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col px-1'>
                                                        <label className='  mb-3 text-center sub-label' style={{ width: '100%' }}>Rate</label>
                                                        <input
                                                            type="number"
                                                            className="form-control  mb-2"
                                                            name="scrip_rate"
                                                            placeholder='Rate'
                                                            value={scripData.scrip_rate}
                                                            onChange={handleScripChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 px-1">
                                        <div className=" mb-1 ">
                                            <div className="flexDirection ">
                                                <label className=' mb-3 text-center label-scrip' style={{ width: '100%' }}>Square Up</label>
                                                <div className='row m-0 p-0 '>
                                                    <div className='col-md-6 px-1 '>
                                                        <label className=' mb-2 text-center sub-label ' style={{ width: '100%' }}>Basis</label>
                                                        <div className='flexCol '>
                                                            <div className='flexRow me-2'>
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    id="flat_NormalYes"
                                                                    name="scrip_sq_up_crit"
                                                                    value="F"
                                                                    checked={scripData.scrip_sq_up_crit === 'F'}
                                                                    onChange={(e) => handleScripChange(e)}
                                                                />
                                                                <label className="form-check-label ms-1" htmlFor="flat_NormalYes">Flat</label>
                                                            </div>
                                                            <div className='flexRow'>
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    id="flat_NormalYes"
                                                                    name="scrip_sq_up_crit"
                                                                    value="P"
                                                                    checked={scripData.scrip_sq_up_crit === 'P'}
                                                                    onChange={(e) => handleScripChange(e)}
                                                                />
                                                                <label className="form-check-label ms-1" htmlFor="flat_NormalYes">Perc.</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-6  px-1 '>
                                                        <label className='  mb-3 text-center sub-label' style={{ width: '100%' }}>Rate</label>
                                                        <input
                                                            type="number"
                                                            className="form-control mb-2"
                                                            name="scrip_Sq_Up_rate"
                                                            placeholder='Rate'
                                                            value={scripData.scrip_Sq_Up_rate}
                                                            onChange={handleScripChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-4 px-1'>
                                        <div className=" mb-1 ">
                                            <div className="flexDirection">
                                                <label className=' mb-3 text-center label-scrip' style={{ width: '100%' }}>Range</label>
                                                <div className=' m-0 p-0 '>
                                                    <div className='col px-1 '>
                                                        <label className='mb-3 text-center sub-label' style={{ width: '100%' }}>Normal</label>
                                                        <select
                                                            name="scrip_range"
                                                            className="form-select mb-2"
                                                            // style={{ marginLeft: '0.2rem' }}
                                                            value={scripData.scrip_range}
                                                            onChange={handleScripChange}
                                                        >
                                                            <option value='0'>Nor. Range</option>
                                                            {norRangeNames.length > 0 ? (
                                                                norRangeNames.map((row, index) => (
                                                                    <option key={index} value={row.range_id}>
                                                                        {row.range_name}
                                                                    </option>
                                                                ))
                                                            ) : (
                                                                <option disabled>No ranges available</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-1 d-flex">
                                    <div className="col-12 col-md-4 mt-2">
                                        <div className="row mb-1 " style={{ width: '160%' }}>
                                            <div className="col-12  col-md-6 d-flex align-items-center">
                                                <label className='p-0 me-2'>From:</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="scrip_app_form"
                                                    value={scripData.scrip_app_form}
                                                    onChange={handleScripChange}
                                                />
                                            </div>
                                            <div className="col-12  col-md-6 d-flex align-items-center">
                                                <label className=' p-0 me-2'>To:</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="scrip_app_to"
                                                    value={scripData.scrip_app_to}
                                                    onChange={handleScripChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-1 d-flex">
                                    <div className="normal-table-container">
                                        <table className="normal-table">
                                            <thead className='theadNormal'>
                                                <tr className='tr_normal'  >
                                                    <th className='th_normal' hidden >ScripSlCode</th>
                                                    <th className='th_normal'  >Scrip</th>
                                                    <th className='th_normal'  >Series</th>
                                                    <th className='th_normal'  >Brok Rate</th>
                                                    <th className='th_normal'  >Brok Crit.</th>
                                                    <th className='th_normal'  >Sq Up Brok</th>
                                                    <th className='th_normal'  >Sq Up Brok Crit.</th>
                                                    <th className='th_normal'  >Range (Y/N)</th>
                                                    <th className='th_normal'  >Range</th>
                                                    <th className='th_normal' >Date from</th>
                                                    <th className='th_normal' >Date to</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {scriptableData.map((row, index) => (
                                                    <tr key={index} className={
                                                        `tr_normal ${selectedRangetableRow === row
                                                            ? 'selectedRangetablerowcolor' : ''}`}
                                                        onClick={() => handleScripRowClick(row)}>
                                                        <td className='td_normal' hidden >{row.ss_sl_code}</td>
                                                        <td className='td_normal'  >{row.scrip_cd}</td>
                                                        <td className='td_normal'  >{row.series}</td>
                                                        <td className='td_normal'  >{row.brok_rate}</td>
                                                        <td className='td_normal'  >{row.brok_crit}</td>
                                                        <td className='td_normal'  >{row.sq_up_brok}</td>
                                                        <td className='td_normal'  >{row.sq_up_crit}</td>
                                                        <td className='td_normal'  >{row.rs}</td>
                                                        <td className='td_normal'  >{row.range_id}</td>
                                                        <td className='td_normal' >{
                                                        row.date_app?row.date_app=format(
                                                        parseISO( row.date_app), 'yyyy-MM-dd'):''}</td>
                                                        <td className='td_normal' >{
                                                        row.date_to?row.date_to=format(
                                                        parseISO( row.date_to), 'yyyy-MM-dd'):''}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {noDataMessage && <p>{noDataMessage}</p>}
                                    </div>
                                    <div className='ms-2 margin_noraml_btn'>
                                        <Button variant="primary" className='d-block mb-1' onClick={handleAddScripSlabRow}>Add</Button>
                                        {/* <Button variant="danger" onClick={handleScripTableDataDelete}>Delete</Button> */}
                                    </div>
                                </div>

                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default SlabForm;
