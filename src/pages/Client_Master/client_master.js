import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './client_master.css'; // Import your custom CSS for additional styles
import deleteIcon from './image/delete.png';
import searchIcon from './image/search.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios'
import { BASE_URL } from ".././constants";

const Client_Master = () => {
    const [userId, setUserId] = useState(1);
    const [isMinor, setIsMinor] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [details, setDetails] = useState([]);
    const [docTypes, setDocTypes] = useState([]);
    const [docNames, setDocNames] = useState([]);
    const [miiNames, setMiiNames] = useState([]);
    const [segments, setSegments] = useState([]);
    const [dealerGrp, setDealerGrp] = useState([]);
    const [subDealerGrp, setSubDealerGrp] = useState([]);
    const [famGrpResults, setFamGrpResults] = useState([]);
    const [cliGrpResults, setCliGrpResults] = useState([]);
    const [nationalities, setNationalities] = useState([]);
    const [miiDetSubCatg, setMiiDetSubCatg] = useState([]);
    const [states, setStates] = useState([]);
    const [depoResults, setDepoResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [occupations, setOccupations] = useState([]);
    const [marital_statuss, setMarital_statuss] = useState([]);
    const [genders, setGenders] = useState([]);
    const [prefixs, setPrefixs] = useState([]);
    const [entityData, setEntityData] = useState([]);
    const [proof_types, setProof_types] = useState([]);
    const [Politic_exposeds, setPolitic_exposed] = useState([]);
    const [bank_ac_types, setBank_ac_types] = useState([]);
    const [designations, setdesignations] = useState([]);
    const [docs, setDocs] = useState([]);
    const [catgs, setCatgs] = useState([]);
    const [subCatgs, setSubCatgs] = useState([]);
    const [Bankdetails, setBankDetails] = useState([{
        bank_name: '', bank_address: '',
        bank_acc_no: '', bank_acc_type: '', start_date: '', end_date: '', micr: '', ifsc: '',
        upi_id: '', poa_funds: '', date_of_reg: '', nsdl: '', ac_status: '', primary_account: ''
    }]);
    const [DepositData, setDeposit] = useState([{
        depository_name: '', depository_id: '',
        deposit_client_id: '', deposit_start_date: '', deposit_end_date: '', deposit_primary: ''
    }]);
    const [Nomineedetails, setNomineeDetails] = useState([{
        Nomine_Guardian: '',
        Nomine_Guardian_name: '', perc_share: '', minor_nominee: '', minor_nominees_guardian_name: '',
        minor_nominees_dob: '', nominee_guardianUid_pan: ''
    }]);

    const [miidetails, setmiidetails] = useState([{
        mii_name: '', mii_code: '', segment: '', sub_catg: '', poi: '',
        poa: '', dealer_grp: '', sub_dealer_grp: '', cust_part_code: '', cust_part_id: '', mii_det_cd: ''
    }]);

    const [activeTab, setActiveTab] = useState('personal');
    const [namedata, setNameData] = useState([
        { relation: '', prefix: '', firstName: '', middleName: '', lastName: '' },
    ]);
    const [addrData, setAddrData] = useState([
        {
            type: 'CLIENT_CORR', addr_1: '', addr_2: '', addr_3: '', city: '',
            state: '', state_other: '', country: '', pin: '', addr_id: ''
        },
        {
            type: 'CLIENT_PERM', addr_1: '', addr_2: '', addr_3: '', city: '',
            state: '', state_other: '', country: '', pin: '', addr_id: ''
        },
        {
            type: 'CLIENT_OFF', addr_1: '', addr_2: '', addr_3: '', city: '',
            state: '', state_other: '', country: '', pin: '', addr_id: ''
        }
    ]);
    const [poaPoiDetails, setPoaPoiDetails] = useState([{
        doc_code: '', doc_type: '', addr_type: '', doc_name: '', id_no: '',
        place_of_issue: '', issue_date: '', expiry_date: '',
        id_no_yesno: '', place_of_issue_yesno: '', issue_date_yesno: '', expiry_date_yesno: ''
    }]);
    const [editMode, setEditMode] = useState(false);
    const [addMode, setAddMode] = useState(true);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_catg_doc_mapp`)
            .then(response => { setCatgs(response.data) })
            .catch(error => console.error('Error fetching categories:', error));
        axios.get(`${BASE_URL}/api/ddl_sub_catg_doc_mapp`)
            .then(response => { setSubCatgs(response.data) })
            .catch(error => console.error('Error fetching sub-categories:', error));
        axios.get(`${BASE_URL}/api/ddl_doc_names`)
            .then(response => { setDocs(response.data) })
            .catch(error => console.error('Error fetching categories:', error));

    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/mii_names_ddl`)
            .then(response => { setMiiNames(response.data) })
            .catch(error => console.error('Error fetching MII NAMES:', error));
        axios.get(`${BASE_URL}/api/segments_ddl`)
            .then(response => { setSegments(response.data) })
            .catch(error => console.error('Error fetching segments:', error));
        axios.get(`${BASE_URL}/api/dealer_ddl`)
            .then(response => { setDealerGrp(response.data) })
            .catch(error => console.error('Error fetching dealer grp:', error));
        setUserId(1);
    }, []);

    useEffect(() => {
        try {
            axios.get(`${BASE_URL}/api/nationality_list_comm_mas`).then(response => setNationalities(response.data))
                .catch(error => console.error('Error fetching nationalities:', error));
            // console.log('response.data ==> ', response.data);
            // console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error fetching nationalities:', error);
        }

        try {
            axios.get(`${BASE_URL}/api/state_list_comm_mas`).then(response => setStates(response.data))
                .catch(error => console.error('Error fetching states:', error));
            // console.log('response.data ==> ', response.data);
            // console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    }, []);

    const [formData, setFormData] = useState({
        clientName: null,
        client_short_name: null,
        category: null,
        sub_category: null,
        crn: null,
        NSECode: null,
        applDate: null,
        account_opening_date: null,
        status: null,
        namePrefix: null,
        firstName: null,
        middleName: null,
        lastName: null,
        pan: null,
        gender: null,
        maritalStatus: null,
        nationality: null,
        nationality_other: null,
        dob: null,
        birth_country: null,
        gst: null,
        gst_state: null,
        isdcode_mobile_1: null,
        mobile_1: null,
        relation_flag: null,
        isdcode_mobile_2: null,
        mobile_2: null,
        email_id_1: null,
        email_id_2: null,
        res_tel_no: null,
        Office_tel_no: null,
        whatsapp: null,
        telegram_app: null,
        cin: null,
        cust_part_code: null,
        registration_no: null,
        registration_auth: null,
        place_of_registration: null,
        registration_date: null,
        client_agrm_date: null,
        unique_client_code: null,
        upd_flag: null,
        relationship: null,
        type_of_facility: null,
        proof_type: null,
        proof_no: null,
        place_issue_proof: null,
        date_issue_proof: null,
    });

    const [occupationData, setOccupationData] = useState({
        occupation_id: null,
        occupation_details: null,
        office_name: null,
        // officeaddress1: null,
        // officeaddress2: null,
        // officeaddress3: null,
        // office_state: null,
        office_tele: null,
        designation: null,
        start_relation: null,
        general_group: null,
        family_group: null,
        inperson_verification: null,
        person_doing_verif: null,
        organisation: null,
        code: null,
        place: null,
        date: null,
        vid_rec_file_name: null
        // trade_group: null,
        // dealer_group: null,
        // sub_dealer_group: null,
        // ddpi_poa: null,
    });

    const handleAddClick = () => {
        setAddMode(false);
        setEditMode(false);
    }

    const handleClearClick = () => {
        // reset form after clear click.
        setAddMode(true);
        setEditMode(true);
    }

    // const [communicationData, setCommunicationData] = useState({
    //     // address_line_1: null,
    //     // address_line_2: null,
    //     // address_line_3: null,
    //     // city: null,
    //     // state: null,
    //     // state_other: null,
    //     // country: null,
    //     // pin_code: null,
    //     // permanentAddress: null,
    //     // permanentaddress_line_1: null,
    //     // permanentaddress_line_2: null,
    //     // permanentaddress_line_3: null,
    //     // permanentcity: null,
    //     // permanentstate: null,
    //     // permanentstate_other: null,
    //     // permanentcountry: null,
    //     // permanentpin_code: null,
    //     // res_tel_no: null, 
    //     // Office_tel_no: null, 
    //     // mobile_1: null, 
    //     // mobile_2: null, 
    //     // email_id_1: null, 
    //     // email_id_2: null, 
    //     // whatsapp: null, 
    //     // telegram_app: null,
    //     // relation_flag: null,
    //     // isdcode_mobile_2:null,
    //     // isdcode_mobile_1:null

    // });

    // const handleAddrDetSave = async () => {
    //     console.log('addrData----', addrData);

    //     const addrdata = {
    //         userId,
    //         parent_id:formData.NSECode,
    //         addrData
    //     };

    //     alert(JSON.stringify(addrdata));

    //     try {
    //         const response = await fetch('${BASE_URL}/api/client_addr_data_save', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(addrdata),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const result = await response.json();
    //         console.log('Success:', result);

    //         // Display a success message
    //         alert('Address saved successfully!'); // or use a more user-friendly notification

    //         // Reset all form states to initial state

    //     } catch (error) {
    //         console.error('Error:', error);
    //         alert('Error saving data. Please try again.'); // Display error message
    //     }
    // };

    //////////////Entity Table  Start code////////////////////////////////////////

    useState(() => {

        if (entityData.length === 0) {
            setEntityData([{ cin: '', type_registering_authority: '', registering_authority: '', place_of_registration: '', date_of_registration: '', registration_no: '', expiry_date: '', sub_category_entity: '' }]);
        }
    });

    const handleEntityAddRow = () => {
        setEntityData([...entityData, { cin: '', type_registering_authority: '', registering_authority: '', place_of_registration: '', date_of_registration: '', registration_no: '', expiry_date: '', sub_category_entity: '' }]);
    };

    const handleEntityDeleteRow = (index) => {
        setEntityData(entityData.filter((_, i) => i !== index));
    };

    const handleEntityInputChange = (index, fieldName, value) => {
        const updatedData = [...entityData]; // Assuming 'data' is the state variable holding your rows
        updatedData[index][fieldName] = value;
        setEntityData(updatedData); // Update your state with the new data
    };

    const handleDocChange = (index, fieldName, value) => {
        const updData = [...poaPoiDetails]; // Assuming 'data' is the state variable holding your rows
        updData[index][fieldName] = value;
        setPoaPoiDetails(updData); // Update your state with the new data
        console.log('poaPoiDetails---->', poaPoiDetails);
    }

    const entitycolumns = [
        {
            name: 'Sub Category',
            selector: row => row.sub_category_entity,
            cell: (row, index) => (
                <select
                    className="form-select"
                    value={row.sub_category_entity}
                    onChange={e => handleEntityInputChange(index, 'sub_category_entity', e.target.value)} // Use the correct field name here
                    disabled={addMode}
                >
                    <option value="">Select</option>
                    <option value="Register">Registered</option>
                    <option value="Unregister">Unregistered</option>
                </select>
            ),
            width: '10rem',
        },
        {
            name: 'CIN',
            selector: row => row.cin,
            cell: (row, index) => (
                <input
                    className="form-control"
                    value={row.cin}
                    onChange={e => handleEntityInputChange(index, 'cin', e.target.value)} // Use the correct field name here
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },
        {
            name: 'Registering Authority',
            selector: row => row.registering_authority,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.registering_authority}
                    onChange={e => handleEntityInputChange(index, 'registering_authority', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '15rem',
        },
        {
            name: 'Type of Business',
            selector: row => row.type_registering_authority,
            cell: (row, index) => (
                <input
                    type="text"
                    className="form-control"
                    name={`type_registering_authority`}
                    value={row.type_registering_authority}
                    onChange={e => handleEntityInputChange(index, 'type_registering_authority', e.target.value)}
                    disabled={addMode}
                />
            ),
            width: '15rem',
        },

        {
            name: 'Place of Registration',
            selector: row => row.place_of_registration,
            cell: (row, index) => (
                <input
                    type="text"
                    className="form-control"
                    value={row.place_of_registration}
                    onChange={e => handleEntityInputChange(index, 'place_of_registration', e.target.value)}
                    disabled={addMode}
                />
            ),
            width: '12rem',
        },
        {
            name: 'Registration No.',
            selector: row => row.registration_no,
            cell: (row, index) => (
                <input
                    type="text"
                    className="form-control"
                    value={row.registration_no}
                    onChange={e => handleEntityInputChange(index, 'registration_no', e.target.value)}
                    disabled={addMode}
                />
            ),
            width: '12rem',
        },
        {
            name: 'Date of Registration',
            selector: row => row.date_of_registration,
            cell: (row, index) => (
                <input
                    type="date"
                    className="form-control"
                    value={row.date_of_registration}
                    onChange={e => handleEntityInputChange(index, 'date_of_registration', e.target.value)}
                    disabled={addMode}
                />
            ),
            width: '12rem',
        },

        {
            name: 'Expiry Date',
            selector: row => row.expiry_date,
            cell: (row, index) => (
                <input
                    type="date"
                    className="form-control"
                    value={row.expiry_date}
                    onChange={e => handleEntityInputChange(index, 'expiry_date', e.target.value)}
                    disabled={addMode}
                />
            ),
            width: '12rem',
        },
        {
            name: 'Actions',
            cell: (row, index) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-delete-${index}`}>Delete</Tooltip>}
                >
                    <img
                        src={deleteIcon}
                        alt="Delete"
                        onClick={() => handleEntityDeleteRow(index)}
                        style={{
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                        }}
                    />
                </OverlayTrigger>
            ),
            width: '5rem',
        },
    ];


    ///////save the data start///////////////////////////////////////////////////
    const handleSave = async () => {
        console.log('formdata----', formData);

        // Authentication before final save
        if (!formData.clientName) {
            alert('Please enter Client Name');
            return;
        }
        if (!formData.client_short_name) {
            alert('Please enter Client Short Name');
            return;
        }
        if (!formData.category) {
            alert('Please select Category');
            return;
        }
        if (!formData.crn) {
            alert('Please enter CRN.');
            return;
        }
        if (!formData.NSECode) {
            alert('Please enter NSE Code.');
            return;
        }
        if (!formData.pan) {
            alert('Please enter Pan No.');
            return;
        }

        // poaPoiDetails.some((item, index) => {
        //     if (item.doc_id_no === 'Y' && !item.id_no) {
        //         alert(`In POA/POI the Id Number of ${index + 1} row is mandatory!`);
        //     }
        //     if (item.doc_place_of_issue === 'Y' && !item.place_of_issue) {
        //         alert(`In POA/POI the Place of Issue of ${index + 1} row is mandatory!`);
        //     }
        //     if (item.doc_issue_date === 'Y' && !item.issue_date) {
        //         alert(`In POA/POI the Issue Date of ${index + 1} row is mandatory!`);
        //     }
        //     if (item.doc_expiry_date === 'Y' && !item.expiry_date) {
        //         alert(`In POA/POI the Expiry Date of ${index + 1} row is mandatory!`);
        //     }
        // }
        // );

        const isconfirmed = window.confirm('Sure you want to save this record ?');
        if (!isconfirmed) {
            return;
        }

        const Masterdata = {
            userId,
            formData,
            occupationData,
            addrData,
            // communicationData,
            entityData,
            namedata,
            Bankdetails,
            DepositData,
            Nomineedetails,
            //communicationTableData,
            details,
            poaPoiDetails,
            miidetails
        };

        // alert(JSON.stringify(Masterdata));

        try {
            const response = await fetch(`${BASE_URL}/api/ClientAllDATA`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Masterdata),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);

            // Display a success message
            alert(result.message); // or use a more user-friendly notification

            // Reset all form states to initial state
            resetForm();
            setNameData([{ relation: '', prefix: '', firstName: '', middleName: '', lastName: '' }]);
            setBankDetails([{ bank_name: '', bank_address_1: '', bank_address_2: '', bank_address_3: '', bank_acc_no: '', bank_acc_type: '', start_date: '', end_date: '', micr: '', ifsc: '', upi_id: '', poa_funds: '', date_of_reg: '', nsdl: '', ac_status: '', primary_account: '' }]);
            setDeposit([{ depository_name: '', depository_id: '', deposit_client_id: '', deposit_start_date: '', deposit_end_date: '', deposit_primary: '' }]);
            setNomineeDetails([{ Nomine_Guardian: '', Nomine_Guardian_name: '', perc_share: '', minor_nominee: '', minor_nominees_guardian_name: '', minor_nominees_dob: '', nominee_guardianUid_pan: '' }]);
            setEntityData([{ cin: '', type_registering_authority: '', registering_authority: '', place_of_registration: '', date_of_registration: '', registration_no: '', expiry_date: '', sub_category_entity: '' }]);
            setDetails([{ arn: '', name: '', type: '', designation: '', address: '', pan: '', mobile_no: '', uid: '', email_id: '', from_date: '', to_date: '', remarks: '' }]);

        } catch (error) {
            console.error('Error:', error);
            alert('Error saving data. Please try again.'); // Display error message
        }
    };

    // Function to reset all form states
    const resetForm = () => {
        setFormData({
            clientName: null,
            client_short_name: null,
            category: null,
            sub_category: null,
            crn: null,
            NSECode: null,
            applDate: null,
            account_opening_date: null,
            status: null,
            namePrefix: null,
            firstName: null,
            middleName: null,
            lastName: null,
            pan: null,
            gender: null,
            maritalStatus: null,
            nationality: null,
            nationality_other: null,
            dob: null,
            birth_country: null,
            gst: null,
            gst_state: null,
            isdcode_mobile_1: null,
            mobile_1: null,
            relation_flag: null,
            isdcode_mobile_2: null,
            mobile_2: null,
            email_id_1: null,
            email_id_2: null,
            res_tel_no: null,
            Office_tel_no: null,
            whatsapp: null,
            telegram_app: null,
            cin: null,
            cust_part_code: null,
            registration_no: null,
            registration_auth: null,
            place_of_registration: null,
            registration_date: null,
            inperson_verification: null,
            client_agrm_date: null,
            unique_client_code: null,
            upd_flag: null,
            relationship: null,
            type_of_facility: null,
            proof_type: null,
            proof_no: null,
            place_issue_proof: null,
            date_issue_proof: null,
        });

        setOccupationData({
            occupation_id: null,
            occupation_details: null,
            office_name: null,
            // officeaddress1: null,
            // officeaddress2: null,
            // officeaddress3: null,
            // office_state: null,
            office_tele: null,
            designation: null,
            start_relation: null,
            general_group: null,
            family_group: null,
            inperson_verification: null,
            person_doing_verif: null,
            organisation: null,
            code: null,
            place: null,
            date: null,
            vid_rec_file_name: null
            // trade_group: null,
            // dealer_group: null,
            // sub_dealer_group: null,
            // ddpi_poa: null,
        });

        // setCommunicationData({
        // address_line_1: null,
        // address_line_2: null,
        // address_line_3: null,
        // city: null,
        // state: null,
        // state_other: null,
        // country: null,
        // pin_code: null,
        // permanentAddress: null,
        // permanentaddress_line_1: null,
        // permanentaddress_line_2: null,
        // permanentaddress_line_3: null,
        // permanentcity: null,
        // permanentstate: null,
        // permanentstate_other: null,
        // permanentcountry: null,
        // permanentpin_code: null,
        //     res_tel_no: null, 
        //     Office_tel_no: null, 
        //     mobile_1: null, 
        //     mobile_2: null, 
        //     email_id_1: null, 
        //     email_id_2: null, 
        //     whatsapp: null, 
        //     telegram_app: null,
        //     relation_flag: null,
        //     isdcode_mobile_2:null,
        //     isdcode_mobile_1:null
        // });

    };

    ///////save DataEnd///////////////////////////////////////////


    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const checkIfMinor = (dob) => {
        const dobDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();

        // Check if the date indicates less than 18 years
        setIsMinor(age < 18 || (age === 18 && monthDiff < 0));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // setFormData((prevData) => {
        //     const formData = { ...prevData, [name]: value };

        //     // Check if the permanent address is the same as the correspondence address
        //     if (name === 'permanentAddress') {
        //         if (value === 'yes') {
        //             return {
        //                 ...formData,
        //                 permanentaddress_line_1: prevData.address_line_1,
        //                 permanentaddress_line_2: prevData.address_line_2,
        //                 permanentaddress_line_3: prevData.address_line_3,
        //                 permanentcity: prevData.city,
        //                 permanentstate: prevData.state,
        //                 permanentstate_other: prevData.state_other,
        //                 permanentcountry: prevData.country,
        //                 permanentpin_code: prevData.pin_code,
        //             };
        //         } else if (value === 'no') {
        //             return {
        //                 ...formData,
        //                 permanentaddress_line_1: '',
        //                 permanentaddress_line_2: '',
        //                 permanentaddress_line_3: '',
        //                 permanentcity: '',
        //                 permanentstate: '',
        //                 permanentcountry: '',
        //                 permanentpin_code: '',
        //             };
        //         }
        //     }

        //     return formData;
        // });



        if (name === 'dob') {
            checkIfMinor(value);
        }

        if (name === "category" && value === "IND") {
            setActiveTab('personal');
            handleCatg(value);
        } else if (name === "category" && value === "NIND") {
            setActiveTab('entity');
            handleCatg(value);
        }
        if (name === "sub_category" && value !== '') {
            handleSubCatg(value);
        }

    };

    const isValidPAN = (pan) => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/; // PAN format: 5 letters, 4 digits, 1 letter
        return panRegex.test(pan);
    };

    const handlePanSearch = async (Pan) => {
        console.log('pan', Pan);
        if (!isValidPAN(Pan)) {
            alert('Invalid PAN format. Please enter a valid PAN.');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/searchPAN`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pan: Pan }),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get the error message
                throw new Error(`Network response was not ok: ${errorText}`);
            }

            const data = await response.json();
            if (data.found) {
                alert('Your PAN is already registered.');
            } else {
                alert('Your PAN is not registered.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert(`An error occurred while checking the PAN: ${error.message}`);
        }
    };

    const handleBrokCodeSearch = async (code) => {
        // alert('Brok Code to search---->' + code);
        try {
            await axios.get(`${BASE_URL}/api/searchBrokCode?p_brok_code=` + code).then(res => alert(res.data.message));
        } catch (error) {
            console.error('Error fetching brok code:', error);
            alert(`An error occurred while checking the brok code`);
        }
    };


    const handleOccupationChange = (e) => {
        console.log("hii", e);
        const { name, value } = e.target;
        setOccupationData({
            ...occupationData,
            [name]: value,
        });
        if (name === 'occupation_id') {
            if (value === '43' || value === '44' || value === '45') {
                setHidden(true);
            }
            else {
                setHidden(false);
            }
        }
    };




    // const handleCommunicationChange = (event) => {
    //     const { name, value } = event.target;
    //     setCommunicationData((prevData) => {
    //         const communicationData = { ...prevData, [name]: value };

    //         // Check if the permanent address is the same as the correspondence address
    //         if (name === 'permanentAddress') {
    //             if (value === 'yes') {
    //                 return {
    //                     ...communicationData,
    //                     permanentaddress_line_1: prevData.address_line_1,
    //                     permanentaddress_line_2: prevData.address_line_2,
    //                     permanentaddress_line_3: prevData.address_line_3,
    //                     permanentcity: prevData.city,
    //                     permanentstate: prevData.state,
    //                     permanentstate_other: prevData.state_other,
    //                     permanentcountry: prevData.country,
    //                     permanentpin_code: prevData.pin_code,

    //                 };
    //             } else if (value === 'no') {
    //                 return {
    //                     ...communicationData,
    //                     permanentaddress_line_1: '',
    //                     permanentaddress_line_2: '',
    //                     permanentaddress_line_3: '',
    //                     permanentcity: '',
    //                     permanentstate: '',
    //                     permanentcountry: '',
    //                     permanentpin_code: '',

    //                 };
    //             }
    //         }

    //         return communicationData;
    //     });
    // };


    const handleEdit = () => {
        console.log('Edit Mode:', formData);
    };
    ////////////////Perosnal Tab client Relation Start//////////////////

    const getDynamicLabel = () => {
        switch (occupationData.occupation_id) {
            case '37':
            case '38':
            case '39':
                return 'Service ';
            case '43':
                return 'Ex-Service ';
            case '42':
            case '40':
            case '41':
                return 'Business ';
            case '44':
            case '45':
                return 'Home ';

            default:
                return 'Office ';
        }
    };

    const getLabel = () => {
        switch (occupationData.occupation_id) {
            case '37':
            case '38':
            case '39':
                return 'Employee ';
            case '43':
                return 'Ex-Service ';
            case '42':
            case '40':
            case '41':
                return 'Business ';
            case '44':
            case '45':
                return 'Home ';

            default:
                return 'Office ';
        }
    };
    const handleInputNameChange = (index, field, value) => {
        const updatedData = [...namedata];
        updatedData[index][field] = value;
        setNameData(updatedData);
    };

    const handleDeleteNameRow = (index) => {
        const updatedData = namedata.filter((_, i) => i !== index);
        setNameData(updatedData);
    };

    const handleAddNameRow = () => {
        setNameData([...namedata, { relation: '', prefix: '', firstName: '', middleName: '', lastName: '' }]);
    };

    const Namecolumns = [
        {
            name: 'Relation',
            selector: row => row.relation,
            cell: (row, index) => (
                <select
                    value={row.relation}
                    onChange={e => handleInputNameChange(index, 'relation', e.target.value)}
                    className="form-select common_select"
                    disabled={addMode}
                >
                    <option value="">Select Relation</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Maiden">Maiden</option>
                </select>
            ),
            width: '15%', // Adjusted width for responsiveness
        },
        {
            name: 'Prefix',
            selector: row => row.prefix,
            cell: (row, index) => (
                <select
                    name={`prefix_${index}`}
                    value={row.prefix}
                    onChange={e => handleInputNameChange(index, 'prefix', e.target.value)}
                    className="form-select common_select"
                    disabled={addMode}
                >
                    <option value="">Prefix</option>
                    {prefixs.map(prefix => (
                        <option key={prefix.comm_id} value={prefix.comm_id}>
                            {prefix.description}
                        </option>
                    ))}
                </select>
            ),
            width: '15%', // Adjusted width for responsiveness
        },
        {
            name: 'First Name',
            selector: row => row.firstName,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.firstName ? row.firstName.toUpperCase() : ''}
                    onChange={e => handleInputNameChange(index, 'firstName', e.target.value)}
                    className="form-control"
                    disabled={addMode}
                />
            ),
            width: '25%', // Adjusted width for responsiveness
        },
        {
            name: 'Middle Name',
            selector: row => row.middleName,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.middleName ? row.middleName.toUpperCase() : ''}
                    onChange={e => handleInputNameChange(index, 'middleName', e.target.value)}
                    className="form-control"
                    disabled={addMode}
                />
            ),
            width: '20%', // Adjusted width for responsiveness
        },
        {
            name: 'Last Name',
            selector: row => row.lastName,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.lastName ? row.lastName.toUpperCase() : ''}
                    onChange={e => handleInputNameChange(index, 'lastName', e.target.value)}
                    className="form-control"
                    disabled={addMode}
                />
            ),
            width: '20%', // Adjusted width for responsiveness
        },
        {
            name: 'Actions',
            cell: (row, index) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-delete-${index}`}>Delete</Tooltip>}
                >
                    <img
                        src={deleteIcon}
                        alt="Delete"
                        onClick={() => handleDeleteNameRow(index)}
                        style={{
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                        }}
                    />
                </OverlayTrigger>
            ),
            width: '5%', // Adjusted width for responsiveness
            allowoverflow: true,
        },
    ];


    ////////////////Personal Tab client Relation End//////////////////
    ///////////general details tab ddl fetching start////////////////////

    useEffect(() => {
        try {
            axios.get(`${BASE_URL}/api/search_client_grp`).then(response => setCliGrpResults(response.data))
                .catch(error => console.error('Error fetching cli grp:', error));
            // console.log('response.data ==> ', response.data);
            // console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error fetching cli group:', error);
        }
        try {
            axios.get(`${BASE_URL}/api/search_family_grp`).then(response => setFamGrpResults(response.data))
                .catch(error => console.error('Error fetching fam grp:', error));
            // console.log('response.data ==> ', response.data);
            // console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error fetching family group:', error);
        }
    }, []);

    ///////////general details tab ddl fetching end////////////////////
    ///////////financial tab ddl fetching end////////////////////

    useEffect(() => {
        try {
            axios.get(`${BASE_URL}/api/search_depos_name`).then(response => setDepoResults(response.data))
                .catch(error => console.error('Error fetching depos name:', error));
            // console.log('response.data ==> ', response.data);
            // console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error fetching depos name:', error);
        }
    }, []);

    ///////////financial tab ddl fetching end////////////////////
    ///////////categories start////////////////////

    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try {
    //             const response = await fetch('${BASE_URL}/api/client-categories');
    //             const data = await response.json();
    //             setCategories(data);
    //             console.log('categories', data);
    //         } catch (error) {
    //             console.error('Error fetching categories:', error);
    //         }
    //     };

    //     fetchCategories();
    // }, []);

    const handleCatg = async (p_catg) => {
        try {
            if (p_catg === 'IND') {
                setCategories([]);
                await axios.get(`${BASE_URL}/api/ddl_subcatg?p_catg=` + 'IND')
                    .then(response => setCategories(response.data))
                    .catch(error => console.error('Error fetching SUB CATEGORIES:', error));
            }
            else if (p_catg === 'NIND') {
                setCategories([]);
                await axios.get(`${BASE_URL}/api/ddl_subcatg?p_catg=` + '')
                    .then(response => setCategories(response.data))
                    .catch(error => console.error('Error fetching SUB CATEGORIES:', error));
            }
            else {
                setCategories([]);
            }

        }
        catch (error) {
            console.error("Error in Account Type Selection! ", error);
        }
    }

    const handleSubCatg = async (p_subcatg) => {
        try {
            // setPoaPoiDetails([]);
            await axios.get(`${BASE_URL}/api/get_doc_types?p_sub_catg=` + p_subcatg)
                .then(response => setDocTypes(response.data))
                .catch(error => console.error('Error fetching doc_types:', error));
            await axios.get(`${BASE_URL}/api/get_doc_names?p_sub_catg=` + p_subcatg)
                .then(response => setDocNames(response.data))
                .catch(error => console.error('Error fetching doc_names:', error));
            await axios.get(`${BASE_URL}/api/get_sub_catg_mii_dets?p_sub_catg=` + p_subcatg)
                .then(response => setMiiDetSubCatg(response.data))
                .catch(error => console.error('Error fetching MiiDetSubCatg:', error));
        }
        catch (error) {
            console.error("Error in SubCatg Selection! ", error);
        }
    }

    ///////////categories end////////////////////
    ///////////Occupation start////////////////////
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/client-Occupation`);
                const data = await response.json();
                setOccupations(data);
                console.log('Occupation', data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    ///////////Occupation end////////////////////
    ///////////Designation start////////////////////
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/client-designation`);
                const data = await response.json();
                setdesignations(data);
                console.log('Designation', data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    ///////////Designation end////////////////////
    ///////////prefix start////////////////////
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/client-prefix`);
                const data = await response.json();
                setPrefixs(data);
                console.log('prefix', data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    ///////////prefix end////////////////////
    ///////////gender start////////////////////
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/client-gender`);
                const data = await response.json();
                setGenders(data);
                console.log('gender', data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    ///////////gender end////////////////////
    ///////////marital_status start////////////////////
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/client-marital_status`);
                const data = await response.json();
                setMarital_statuss(data);
                console.log('marital_status', data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    ///////////marital_status end////////////////////
    ///////////BANK_AC_TYPE start////////////////////
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/client-bank_ac_type`);
                const data = await response.json();
                setBank_ac_types(data);
                console.log('bank_ac_type', data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    ///////////BANK_AC_TYPE end////////////////////
    ///////////PROOF_TYPE start////////////////////
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/client-proof_type`);
                const data = await response.json();
                setProof_types(data);
                console.log('PROOF_TYPE', data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    ///////////PROOF_TYPE end////////////////////
    ///////////POLITIC_EXPOSED start////////////////////
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/client-politic_exposed`);
                const data = await response.json();
                setPolitic_exposed(data);
                console.log('POLITIC_EXPOSED', data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    ///////////POLITIC_EXPOSED end////////////////////


    ///////// Nominee tab Start///////////
    useState(() => {
        console.log('Nomineedetails', Nomineedetails);
        if (Nomineedetails.length === 0) {
            setNomineeDetails([{ Nomine_Guardian: '', Nomine_Guardian_name: '', perc_share: '', minor_nominee: '', minor_nominees_guardian_name: '', minor_nominees_dob: '', nominee_guardianUid_pan: '' }]);
        }
    });

    const handleNomineeAddRow = () => {
        setNomineeDetails([...Nomineedetails, { Nomine_Guardian: '', Nomine_Guardian_name: '', perc_share: '', minor_nominee: '', minor_nominees_guardian_name: '', minor_nominees_dob: '', nominee_guardianUid_pan: '' }]);
    };

    const handleMiiDetAddRow = () => {
        setmiidetails([...miidetails, {
            mii_name: '', mii_code: '', segment: '', sub_catg: '', poi: '',
            poa: '', dealer_grp: '', sub_dealer_grp: '', cust_part_code: '', cust_part_id: '', mii_det_cd: ''
        }]);
    };

    const handleMiiDetDeleteRow = (index) => {
        setmiidetails(miidetails.filter((_, i) => i !== index));
    };

    const handleNomineeDeleteRow = (index) => {
        setNomineeDetails(Nomineedetails.filter((_, i) => i !== index));
    };

    const handleNomineeInputChange = (index, fieldName, value) => {
        const updatedData = [...Nomineedetails]; // Assuming 'data' is the state variable holding your rows
        updatedData[index][fieldName] = value;
        setNomineeDetails(updatedData); // Update your state with the new data
    };

    const handleDealerChange = async (code) => {
        try {
            await axios.get(`${BASE_URL}/api/get_subdealer_ddl?p_dealer_cd=` + code)
                .then(response => setSubDealerGrp(response.data))
                .catch(error => console.error('Error fetching sub-dealer grp:', error));
        }
        catch (error) {
            console.error("Error in Dealer Selection! ", error);
        }
    }

    const handleMiiDetInputChange = (index, fieldName, value) => {
        const updatedArr = [...miidetails]; // Assuming 'data' is the state variable holding your rows
        updatedArr[index][fieldName] = value;
        setmiidetails(updatedArr); // Update your state with the new data
        if (fieldName === 'dealer_grp' && value !== '') {
            handleDealerChange(value)
        }
    };



    const Nomineecolumns = [
        {
            name: 'Nominee/Guardian',
            selector: row => row.Nomine_Guardian,
            cell: (row, index) => (
                <input
                    type="checkbox"
                    name={`Nomine_Guardian_${index}`} // Unique name for each checkbox
                    checked={row.Nomine_Guardian}
                    onChange={e => handleNomineeInputChange(index, 'Nomine_Guardian', e.target.checked)}
                    className="form-check-input large-checkbox" style={{ marginLeft: '2rem' }}
                    disabled={addMode}
                />
            ),
            width: '7.4rem',
        },
        {
            name: 'Nominee/Guardian Name',
            selector: row => row.Nomine_Guardian_name,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.Nomine_Guardian_name ? row.Nomine_Guardian_name.toUpperCase() : ''}
                    onChange={e => handleNomineeInputChange(index, 'Nomine_Guardian_name', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '18rem',
        },
        {
            name: 'Percentage Share',
            selector: row => row.perc_share,
            cell: (row, index) => (
                <input
                    type="number"
                    value={row.perc_share}
                    onChange={e => handleNomineeInputChange(index, 'perc_share', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '7rem',
        },
        {
            name: 'Minor Nominee',
            selector: row => row.minor_nominee,
            cell: (row, index) => (
                <input
                    type="checkbox"
                    name={`minor_nominee_${index}`} // Unique name for each checkbox
                    checked={row.minor_nominee}
                    onChange={e => handleNomineeInputChange(index, 'minor_nominee', e.target.checked)}
                    className="form-check-input large-checkbox " style={{ marginLeft: '2rem' }}
                    disabled={addMode}
                />
            ),
            width: '7rem',
        },
        {
            name: "Minor Nominee's Guardian Name ",
            selector: row => row.minor_nominees_guardian_name,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.minor_nominees_guardian_name ? row.minor_nominees_guardian_name.toUpperCase() : ''}
                    onChange={e => handleNomineeInputChange(index, 'minor_nominees_guardian_name', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: 'auto',
        },
        {
            name: "Minor Nominee's DOB",
            selector: row => row.minor_nominees_dob,
            cell: (row, index) => (
                <input
                    type="date"
                    value={row.minor_nominees_dob}
                    onChange={e => handleNomineeInputChange(index, 'minor_nominees_dob', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },
        {
            name: 'Nominee/Guardian UID/Pan',
            selector: row => row.nominee_guardianUid_pan,
            cell: (row, index) => (
                <div className='d-flex'>
                    <input
                        type="text"
                        value={row.nominee_guardianUid_pan}
                        onChange={e => handleNomineeInputChange(index, 'nominee_guardianUid_pan', e.target.value)}
                        className="form-control textareacontact"
                        disabled={addMode}
                    />
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-delete-${index}`}>
                                Delete
                            </Tooltip>
                        }
                    >
                        <img
                            src={deleteIcon}
                            alt="Delete"
                            onClick={() => handleNomineeDeleteRow(index)}
                            style={{
                                width: '20px',
                                height: '20px',
                                marginTop: '7px'
                            }}
                        />
                    </OverlayTrigger>
                </div>
            ),
            allowoverflow: true,
            width: '15rem',
        },
    ];

    ///////// Nominee Tab End///////////

    //////////Mii Details Start////////////

    const miiDetColumns = [
        {
            name: 'Mii Name',
            selector: row => row.mii_name,
            cell: (row, index) => (
                <select
                    value={row.mii_name}
                    onChange={e => handleMiiDetInputChange(index, 'mii_name', e.target.value)}
                    className="form-select"
                    disabled={addMode}
                >
                    <option value=''>Select</option>
                    {miiNames.map((name) => (
                        <option key={name.mii_id} value={name.mii_name}>{name.mii_name}</option>
                    ))}
                </select>
            ),
            width: '8.2rem',
        },
        {
            name: 'Mii Code',
            selector: row => row.mii_code,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.mii_code}
                    onChange={e => handleMiiDetInputChange(index, 'mii_code', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },
        {
            name: 'Segment',
            selector: row => row.segment,
            cell: (row, index) => (
                <select
                    value={row.segment}
                    onChange={e => handleMiiDetInputChange(index, 'segment', e.target.value)}
                    className="form-select "
                    disabled={addMode}
                >
                    <option value=''>Select</option>
                    {segments.map((seg) => (
                        <option key={index} value={seg.std_val}>{seg.seg_name}</option>
                    ))}
                </select>
            ),
            width: '12rem',
        },
        {
            name: 'Sub Category',
            selector: row => row.sub_catg,
            cell: (row, index) => (
                <select
                    value={row.sub_catg}
                    onChange={e => handleMiiDetInputChange(index, 'sub_catg', e.target.value)}
                    className="form-select "
                    disabled={addMode}
                >
                    <option value=''>Select</option>
                    {miiDetSubCatg.map((miiDet) => (
                        <option key={miiDet.comm_id} value={miiDet.comm_id}>{miiDet.description}</option>
                    ))}
                </select>
            ),
            width: '7rem',
        },
        {
            name: 'POI',
            selector: row => row.poi,
            cell: (row, index) => (
                <select
                    value={row.poi}
                    onChange={e => handleMiiDetInputChange(index, 'poi', e.target.value)}
                    className="form-select "
                    disabled={addMode}
                >
                    <option value=''>Select</option>
                    {docNames.map((doc, index) => (
                        <option key={index} value={doc.doc_id}>{doc.document}</option>
                    ))}
                </select>
            ),
            width: '7rem',
        },
        {
            name: 'POA',
            selector: row => row.poa,
            cell: (row, index) => (
                <select
                    value={row.poa}
                    onChange={e => handleMiiDetInputChange(index, 'poa', e.target.value)}
                    className="form-select"
                    disabled={addMode}
                >
                    <option value=''>Select</option>
                    {docNames.map((doc, index) => (
                        <option key={index} value={doc.doc_id}>{doc.document}</option>
                    ))}
                </select>
            ),
            width: '7rem',
        },
        {
            name: 'Dealer',
            selector: row => row.dealer_grp,
            cell: (row, index) => (
                <select
                    className="form-select"
                    value={row.dealer_grp}
                    onChange={e => handleMiiDetInputChange(index, 'dealer_grp', e.target.value)}
                    disabled={addMode}
                >
                    <option value=''>select</option>
                    {dealerGrp.map((dealer) => (
                        <option key={dealer.dealer_cd} value={dealer.dealer_cd}>
                            {dealer.dealer_name}</option>
                    ))}
                </select>
            ),
            width: '7rem',
        },
        {
            name: 'Sub Dealer',
            selector: row => row.sub_dealer_grp,
            cell: (row, index) => (
                <select
                    className="form-select"
                    value={row.sub_dealer_grp}
                    onChange={e => handleMiiDetInputChange(index, 'sub_dealer_grp', e.target.value)}
                    disabled={addMode}
                >
                    <option value=''>select</option>
                    {subDealerGrp.map((subdealer) => (
                        <option key={subdealer.sub_dealer_cd} value={subdealer.sub_dealer_cd}>
                            {subdealer.sub_dealer_name}</option>
                    ))}
                </select>
            ),
            width: '7rem',
        },
        {
            name: 'Cust. Part Code',
            selector: row => row.cust_part_code,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.cust_part_code}
                    onChange={e => handleMiiDetInputChange(index, 'cust_part_code', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },
        {
            name: 'Cust. Part Id',
            selector: row => row.cust_part_id,
            cell: (row, index) => (
                <div className='d-flex'><input
                    type="text"
                    value={row.cust_part_id}
                    onChange={e => handleMiiDetInputChange(index, 'cust_part_id', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-delete-${index}`}>
                                Delete
                            </Tooltip>
                        }
                    >
                        <img
                            src={deleteIcon}
                            alt="Delete"
                            onClick={() => handleNomineeDeleteRow(index)}
                            style={{
                                width: '20px',
                                height: '20px',
                                marginTop: '7px'
                            }}
                        />
                    </OverlayTrigger></div>
            ),
            width: '10rem',
        },
        {
            selector: row => row.mii_det_cd,
            cell: (row, index) => (
                <input
                    type="number"
                    value={row.mii_det_cd}
                    hidden
                />
            ),
            width: '0rem',
        }
    ];

    //////////Mii Details End////////////

    ///////// Deposit Tab start///////////

    useState(() => {
        console.log('DepositData', DepositData);
        if (DepositData.length === 0) {
            setDeposit([{ depository_name: '', depository_id: '', deposit_client_id: '', deposit_start_date: '', deposit_end_date: '', deposit_primary: '' }]);
        }
    });

    const handleDepositAddRow = () => {
        setDeposit([...DepositData, { depository_name: '', depository_id: '', deposit_client_id: '', deposit_start_date: '', deposit_end_date: '', deposit_primary: '' }]);
    };

    const handleDepositDeleteRow = (index) => {

        setDeposit(DepositData.filter((_, i) => i !== index));


    };
    const handleDepositInputChange = (index, field, value) => {
        const updatedDepositData = [...DepositData];

        // Update the selected depository name
        if (field === 'depository_name') {
            updatedDepositData[index][field] = value;

            // Reset Depository ID and Client ID if NSDL is selected
            if (value === 'CDSL') { // Assuming 'business' is the value for CDSL
                updatedDepositData[index].depository_id = ''; // Set Depository ID to null
                updatedDepositData[index].deposit_client_id = ''; // Reset Client ID

            }
        } else if (field === 'depository_id') {
            // If CDSL is selected, ensure Depository ID is null
            if (updatedDepositData[index].depository_name === 'CDSL') {
                alert("Depository ID must be null when CDSL is selected.");
                return; // Prevent update
            } else {
                updatedDepositData[index][field] = value.length <= 8 ? value : updatedDepositData[index][field];
            }
        } else if (field === 'deposit_client_id') {
            // Validation for Client ID based on selected depository
            if (updatedDepositData[index].depository_name === 'CDSL') {
                if (value.length > 16) {
                    alert("Client ID must be a maximum of 16 Numbers.");
                    return; // Prevent update
                }
                updatedDepositData[index][field] = value;
            } else {
                if (value.length > 8) {
                    alert("Client ID must be a maximum of 8 Numbers.");
                    return; // Prevent update
                }
                updatedDepositData[index][field] = value;
            }
        }
        updatedDepositData[index][field] = value;
        // Update the state
        setDeposit(updatedDepositData);
    };

    const depositcolumns = [
        {
            name: 'Sr. No.',
            selector: (row, index) => index + 1, // Using index to display serial number
            width: '5rem',
        },
        {
            name: 'Depository Name',
            selector: row => row.depository_name,
            cell: (row, index) => (
                <select
                    name={`depository_name`}
                    className="form-select common_select allselectmargin"
                    value={row.depository_name}
                    onChange={e => handleDepositInputChange(index, 'depository_name', e.target.value)}
                    disabled={addMode}
                >
                    <option value="">Select Depository Name</option>
                    {depoResults.map((res) => (<option key={res.mii_id} value={res.mii_id}>{res.mii_short_name}</option>)
                    )}
                </select>
            ),
            width: '15rem',
        },
        {
            name: 'DP ID',
            selector: row => row.depository_id,
            cell: (row, index) => (
                <input
                    type="text"
                    className="form-control "
                    name={`depository_id`}
                    value={row.depository_id}
                    onChange={e => handleDepositInputChange(index, 'depository_id', e.target.value)}
                    // disabled={row.depository_name === 'CDSL'}
                    disabled={addMode}
                />
            ),
            width: '15rem',
        },
        {
            name: 'Client ID',
            selector: row => row.deposit_client_id,
            cell: (row, index) => (
                <input
                    type="number"
                    className="form-control "
                    name={`deposit_client_id`}
                    value={row.deposit_client_id}
                    onChange={e => handleDepositInputChange(index, 'deposit_client_id', e.target.value)}
                    required
                    disabled={addMode}
                />
            ),
            width: '16.2rem',
        },
        {
            name: 'Start Date',
            selector: row => row.deposit_start_date,
            cell: (row, index) => (
                <input
                    type="date"
                    value={row.deposit_start_date}
                    onChange={e => handleDepositInputChange(index, 'deposit_start_date', e.target.value)}
                    className="form-control"
                    disabled={addMode}
                />
            ),
            width: '12rem',
        },
        {
            name: 'End Date',
            selector: row => row.deposit_end_date,
            cell: (row, index) => (
                <input
                    type="date"
                    value={row.deposit_end_date}
                    onChange={e => handleDepositInputChange(index, 'deposit_end_date', e.target.value)}
                    className="form-control"
                    disabled={addMode}
                />
            ),
            width: '12rem',
        },
        {
            name: 'Primary',
            selector: row => row.deposit_primary,
            cell: (row, index) => (
                <div>
                    <input
                        type="checkbox"
                        name={`deposit_primary_${index}`} // Unique name for each checkbox
                        checked={row.deposit_primary} // Use the `primary` property to manage checked state
                        onChange={e => handleDepositInputChange(index, 'deposit_primary', e.target.checked)}
                        className="form-check-input large-checkbox"
                        style={{ marginLeft: '1rem' }}
                        disabled={addMode}
                    />

                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-delete-${index}`}>
                                Delete
                            </Tooltip>
                        }
                    >
                        <img
                            src={deleteIcon}
                            alt="Delete"
                            onClick={() => handleDepositDeleteRow(index)}
                            style={{
                                width: '20px',
                                height: '20px',
                                marginLeft: '1px'
                            }}
                        />
                    </OverlayTrigger>

                </div>
            ),
            width: '5rem',
        }
    ];

    ///////// Deposit Tab end///////////

    ///////// Bank Details tab Start///////////
    useState(() => {
        console.log('Bankdetails', Bankdetails);
        if (Bankdetails.length === 0) {
            setBankDetails([{ bank_name: '', bank_address_1: '', bank_address_2: '', bank_address_3: '', bank_acc_no: '', bank_acc_type: '', start_date: '', end_date: '', micr: '', ifsc: '', upi_id: '', poa_funds: '', date_of_reg: '', nsdl: '', ac_status: '', primary_account: '' }]);
        }
    });

    useState(() => {
        if (poaPoiDetails.length === 0) {
            setPoaPoiDetails([{
                doc_code: '', doc_type: '', addr_type: '', doc_name: '', id_no: '',
                place_of_issue: '', issue_date: '', expiry_date: '',
                id_no_yesno: '', place_of_issue_yesno: '', issue_date_yesno: '', expiry_date_yesno: ''
            }]);
        }
    });

    const handleBankDetailsAddRow = () => {
        setBankDetails([...Bankdetails, { bank_name: '', bank_address_1: '', bank_address_2: '', bank_address_3: '', bank_acc_no: '', bank_acc_type: '', start_date: '', end_date: '', micr: '', ifsc: '', upi_id: '', poa_funds: '', date_of_reg: '', nsdl: '', ac_status: '', primary_account: '' }]);
    };

    const handlePoaPoiDetailsAddRow = () => {
        setPoaPoiDetails([...poaPoiDetails, {
            doc_code: '', doc_type: '', addr_type: '', doc_name: '', id_no: '',
            place_of_issue: '', issue_date: '', expiry_date: '',
            id_no_yesno: '', place_of_issue_yesno: '', issue_date_yesno: '', expiry_date_yesno: ''
        }]);
    };

    const handleBankDetailsDeleteRow = (index) => {
        setBankDetails(Bankdetails.filter((_, i) => i !== index));
    };

    const handlePoaPoiDetailsDeleteRow = (index) => {
        setPoaPoiDetails(poaPoiDetails.filter((_, i) => i !== index));
        console.log('what');
    };

    const handleBankDetailsInputChange = (index, field, value) => {
        const updatedData = [...Bankdetails]; // Assuming 'data' is the state variable holding your rows
        updatedData[index][field] = value;
        setBankDetails(updatedData); // Update your state with the new data
    };

    const handleAddrDetailsInputChange = (index, field, value) => {
        const updatedAddrData = [...addrData]; // Assuming 'data' is the state variable holding your rows
        updatedAddrData[index][field] = value;
        setAddrData(updatedAddrData); // Update your state with the new data
    };

    const Bankcolumns = [
        {
            name: 'Bank Name',
            selector: row => row.bank_name,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.bank_name ? row.bank_name.toUpperCase() : ''}
                    onChange={e => handleBankDetailsInputChange(index, 'bank_name', e.target.value)}
                    className="form-control"
                    disabled={addMode}
                />
            ),
            width: '8rem',
        },
        {
            name: 'Bank Acc Type',
            selector: row => row.bank_acc_type,
            cell: (row, index) => (
                <select
                    name="bank_acc_type"
                    className="form-select"
                    value={row.bank_acc_type} // Ensure this is the comm_id
                    onChange={e => handleBankDetailsInputChange(index, 'bank_acc_type', e.target.value)} // Sends comm_id
                    disabled={addMode}
                >
                    <option value="">Select Bank Type</option>
                    {bank_ac_types.map(bank_ac_typess => (
                        <option key={bank_ac_typess.comm_id} value={bank_ac_typess.comm_id}>
                            {bank_ac_typess.description}
                        </option>
                    ))}
                </select>
            ),
            width: '8.7rem',
        },
        {
            name: 'Bank Acc No.',
            selector: row => row.bank_acc_no,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.bank_acc_no}
                    onChange={e => handleBankDetailsInputChange(index, 'bank_acc_no', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '12rem',
        },
        {
            name: 'UPI Id',
            selector: row => row.upi_id,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.upi_id}
                    onChange={e => handleBankDetailsInputChange(index, 'upi_id', e.target.value)}
                    className="form-control"
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },
        {
            name: 'NSDL',
            selector: row => row.nsdl,
            cell: (row, index) => (
                <div>
                    <input
                        type="checkbox"
                        name={`nsdl_${index}`} // Unique name for each checkbox
                        disabled={addMode}
                        checked={row.nsdl} // Assuming you have a `selected` property to manage checked state
                        onChange={e => handleBankDetailsInputChange(index, 'nsdl', e.target.checked)}
                        className="form-check-input large-checkbox" style={{ marginLeft: '0.2rem' }}
                    />
                </div>
            ),
            width: '3rem',
        },
        {
            name: 'Primary Account',
            selector: row => row.primary_account,
            cell: (row, index) => (
                <input
                    type="checkbox"
                    name={`primary_account_${index}`} // Unique name for each checkbox
                    checked={row.primary_account} // Assuming you have a `selected` property to manage checked state
                    onChange={e => handleBankDetailsInputChange(index, 'primary_account', e.target.checked)}
                    className="form-check-input large-checkbox" style={{ marginLeft: '1.8rem' }}
                    disabled={addMode}
                />
            ),
            width: '6.5rem',
        },
        {
            name: 'POA Funds',
            selector: row => row.poa_funds,
            cell: (row, index) => (

                <input
                    type="checkbox"
                    name={`poa_funds_${index}`} // Unique name for each checkbox
                    checked={row.poa_funds} // Assuming you have a `selected` property to manage checked state
                    onChange={e => handleBankDetailsInputChange(index, 'poa_funds', e.target.checked)}
                    className="form-check-input large-checkbox" style={{ marginLeft: '1.2rem' }}
                    disabled={addMode}
                />
            ),
            width: '5rem',
        },
        {
            name: 'Start Date',
            selector: row => row.start_date,
            cell: (row, index) => (
                <input
                    type="date"
                    value={row.start_date}
                    onChange={e => handleBankDetailsInputChange(index, 'start_date', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },
        {
            name: 'End Date',
            selector: row => row.end_date,
            cell: (row, index) => (
                <input
                    type="date"
                    value={row.end_date}
                    onChange={e => handleBankDetailsInputChange(index, 'end_date', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },
        {
            name: 'MICR',
            selector: row => row.micr,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.micr}
                    onChange={e => handleBankDetailsInputChange(index, 'micr', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },
        {
            name: 'IFSC',
            selector: row => row.ifsc,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.ifsc}
                    onChange={e => handleBankDetailsInputChange(index, 'ifsc', e.target.value)}
                    className="form-control"
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },
        {
            name: 'Bank Addres 1',
            selector: row => row.bank_address_1,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.bank_address_1}
                    onChange={e => handleBankDetailsInputChange(index, 'bank_address_1', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '15rem',
        },
        {
            name: 'Bank Addres 2',
            selector: row => row.bank_address_2,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.bank_address_2}
                    onChange={e => handleBankDetailsInputChange(index, 'bank_address_2', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '15rem',
        },
        {
            name: 'Bank Addres 3',
            selector: row => row.bank_address_3,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.bank_address_3}
                    onChange={e => handleBankDetailsInputChange(index, 'bank_address_3', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '15rem',
        },
        {
            name: 'Date of Reg.',
            selector: row => row.date_of_reg,
            cell: (row, index) => (
                <input
                    type="date"
                    value={row.date_of_reg}
                    onChange={e => handleBankDetailsInputChange(index, 'date_of_reg', e.target.value)}
                    className="form-control"
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },

        {
            name: 'Status',
            selector: row => row.ac_status,
            cell: (row, index) => (
                <div className='d-flex'>
                    <select
                        value={row.ac_status}
                        onChange={e => handleBankDetailsInputChange(index, 'ac_status', e.target.value)}
                        className="form-select"
                        disabled={addMode}
                    >
                        <option value="">Status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-delete-${index}`}>
                                Delete
                            </Tooltip>
                        }
                    >
                        <img
                            src={deleteIcon}
                            alt="Delete"
                            onClick={() => handleBankDetailsDeleteRow(index)}
                            style={{
                                width: '20px',
                                height: '20px',
                                marginTop: '7px'
                            }}
                        />
                    </OverlayTrigger>
                </div>
            ),
            allowoverflow: true,
            width: '8rem',
        }

    ];

    ///////// Bank Details Tab End///////////

    const addrColumns = [
        {
            name: 'Address Type',
            selector: row => row.type,
            cell: (row, index) => (
                <>{(index === 0 && <label className='form-label addr-label'>Correspondence</label>)
                    || (index === 1 && <label className='form-label addr-label'>Permanent</label>)
                    || (index === 2 && <label className='form-label addr-label'>Office</label>)}
                    <input
                        type="text"
                        value={row.type}
                        // onChange={e => handleAddrDetailsInputChange(index, 'type', e.target.value)}
                        className="form-control"
                        readOnly
                        disabled={addMode}
                        hidden
                    /></>
            ),
            width: '10rem',
        },
        {
            name: 'Address Line 1',
            selector: row => row.addr_1,
            cell: (row, index) => (
                <input
                    type="text"
                    className="form-control common_input"
                    value={row.addr_1}
                    onChange={e => handleAddrDetailsInputChange(index, 'addr_1', e.target.value)}
                    disabled={addMode}
                />
            ),
            width: '12rem',
        },
        {
            name: 'Address Line 2',
            selector: row => row.addr_2,
            cell: (row, index) => (
                <input
                    type="text"
                    className="form-control common_input"
                    value={row.addr_2}
                    onChange={e => handleAddrDetailsInputChange(index, 'addr_2', e.target.value)}
                    disabled={addMode}
                />

            ),
            width: '12rem',
        },
        {
            name: 'Address Line 3',
            selector: row => row.addr_3,
            cell: (row, index) => (
                <input
                    type="text"
                    className="form-control common_input"
                    value={row.addr_3}
                    onChange={e => handleAddrDetailsInputChange(index, 'addr_3', e.target.value)}
                    disabled={addMode}
                />
            ),
            width: '12rem',
        },
        {
            name: 'City',
            selector: row => row.city,
            cell: (row, index) => (
                <input
                    type="text"
                    className="form-control common_input"
                    value={row.city}
                    onChange={e => handleAddrDetailsInputChange(index, 'city', e.target.value)}
                    disabled={addMode}
                />
            ),
            width: '8rem',
        },
        {
            name: 'State',
            selector: row => row.state,
            cell: (row, index) => (
                <select
                    className="form-select common_select "
                    style={{ marginLeft: '0.4rem' }}
                    value={row.state}
                    onChange={e => handleAddrDetailsInputChange(index, 'state', e.target.value)}
                    disabled={addMode}
                >
                    <option value="">Select State</option>
                    {states.map((state) => (
                        <option key={state.comm_id} value={state.nse_val}>
                            {state.description}
                        </option>
                    ))}
                </select>
            ),
            width: '11.4rem',
        },
        {
            name: 'State(Other)',
            selector: row => row.state_other,
            cell: (row, index) => (
                <input
                    type="text"
                    className="form-control common_input"
                    value={row.state_other}
                    onChange={e => handleAddrDetailsInputChange(index, 'state', e.target.value)}
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },
        {
            name: 'Country',
            selector: row => row.country,
            cell: (row, index) => (
                <select
                    type="number"
                    className="form-select common_input "
                    value={row.country}
                    onChange={e => handleAddrDetailsInputChange(index, 'country', e.target.value)}
                    disabled={addMode}
                >
                    <option value=''>Select Country</option>
                    {nationalities.map((nation) => (
                        <option key={nation.comm_id} value={nation.nse_val}>
                            {nation.description}
                        </option>
                    ))}
                </select>
            ),
            width: '10rem',
        },
        {
            name: 'Pin',
            selector: row => row.pin,
            cell: (row, index) => (
                <input
                    type="text"
                    className="form-control common_input"
                    value={row.pin}
                    onChange={e => handleAddrDetailsInputChange(index, 'pin', e.target.value)}
                    disabled={addMode}
                />
            ),
            width: '7rem',
        },
        {
            selector: row => row.addr_id,
            cell: (row, index) => (
                <input
                    type="text"
                    className="form-control common_input"
                    value={row.addr_id}
                    onChange={e => handleAddrDetailsInputChange(index, 'addr_id', e.target.value)}
                    hidden
                />
            ),
            width: '0rem',
        }
    ];

    //////// Contact Person Tab Start /////////
    useState(() => {
        console.log('details', details);
        if (details.length === 0) {
            setDetails([{ arn: '', name: '', type: '', designation: '', address: '', pan: '', mobile_no: '', uid: '', email_id: '', from_date: '', to_date: '', remarks: '' }]);
        }
    });

    const handleAddRow = () => {
        setDetails([...details, { arn: '', name: '', type: '', designation: '', address: '', mobile_no: '', pan: '', uid: '', email_id: '', from_date: '', to_date: '', remarks: '' }]);
    };

    const handleDeleteRow = (index) => {

        setDetails(details.filter((_, i) => i !== index));


    };
    const handleInputChange = (index, fieldName, value) => {
        console.log('data', fieldName, value);
        const updatedData = [...details]; // Assuming 'data' is the state variable holding your rows
        updatedData[index][fieldName] = value;
        setDetails(updatedData); // Update your state with the new data
    };


    const columns = [
        {
            name: 'ARN',
            selector: row => row.arn,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.arn}
                    onChange={e => handleInputChange(index, 'arn', e.target.value)}
                    className="form-control"
                    disabled={addMode}
                />
            ),
            width: '5rem',
        },
        {
            name: 'Type',
            selector: row => row.type,
            cell: (row, index) => (
                <select
                    value={row.type}
                    onChange={e => handleInputChange(index, 'type', e.target.value)}
                    className="form-select"
                    disabled={addMode}
                >
                    <option value="">Select Type</option>
                    <option value="Authorizer">Authorizer</option>
                    <option value="Other Contact Person">Other Contact Person</option>
                </select>
            ),
            width: '8rem',
        },
        {
            name: 'Name',
            selector: row => row.name,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.name ? row.name.toUpperCase() : ''}
                    onChange={e => handleInputChange(index, 'name', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '9rem',
        },
        {
            name: 'Designation',
            selector: row => row.designation,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.designation}
                    onChange={e => handleInputChange(index, 'designation', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '9rem',
        },
        {
            name: 'PAN',
            selector: row => row.pan,
            cell: (row, index) => (
                (row.type === 'Authorizer' && (
                    <div className='d-flex'>
                        <input
                            type="text"
                            value={row.pan}
                            onChange={e => handleInputChange(index, 'pan', e.target.value)}
                            className="form-control "

                            required
                        />

                        <OverlayTrigger
                            placement="top" // Position the tooltip above the button
                            overlay={
                                <Tooltip id={`tooltip-search-${index}`}>
                                    Search Pan
                                </Tooltip>
                            }
                        >
                            <img
                                src={searchIcon}
                                alt="Search"
                                onClick={() => handlePanSearch(row.pan)}
                                style={{
                                    width: '20px', // Adjust size as needed
                                    height: '20px',
                                    marginTop: '7px'
                                }}
                            />
                        </OverlayTrigger>
                    </div>
                ))
            ),
            width: '10rem',
        },
        {
            name: 'UID',
            selector: row => row.uid,
            cell: (row, index) => (
                (row.type === 'Authorizer'
                    && (
                        <input
                            type="text"
                            value={row.uid}
                            onChange={e => handleInputChange(index, 'uid', e.target.value)}
                            className="form-control "

                        />
                    ))
            ),
            width: '10rem',
        },
        {
            name: 'Email Id',
            selector: row => row.email_id,
            cell: (row, index) => (
                <input
                    type="email"
                    value={row.email_id}
                    onChange={e => handleInputChange(index, 'email_id', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '15rem',
        },
        {
            name: 'Mobile No.',
            selector: row => row.mobile_no,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.mobile_no}
                    onChange={e => handleInputChange(index, 'mobile_no', e.target.value)}
                    className="form-control "
                    required
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },
        {
            name: 'From Date',
            selector: row => row.from_date,
            cell: (row, index) => (
                <input
                    type="date"
                    value={row.from_date}
                    onChange={e => handleInputChange(index, 'from_date', e.target.value)}
                    className="form-control"
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },
        {
            name: 'To Date',
            selector: row => row.to_date,
            cell: (row, index) => (
                <input
                    type="date"
                    value={row.to_date}
                    onChange={e => handleInputChange(index, 'to_date', e.target.value)}
                    className="form-control"
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },
        {
            name: 'Address',
            selector: row => row.address,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.address}
                    onChange={e => handleInputChange(index, 'address', e.target.value)}
                    className="form-control "
                    disabled={addMode}
                />
            ),
            width: '10rem',
        },
        {
            name: 'Remarks',
            selector: row => row.remarks,
            cell: (row, index) => (
                <div className='d-flex'>
                    <textarea
                        value={row.remarks}
                        onChange={e => handleInputChange(index, 'remarks', e.target.value)}
                        className="form-control textareacontact"
                        disabled={addMode}
                    />
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-delete-${index}`}>
                                Delete
                            </Tooltip>
                        }
                    >
                        <img
                            src={deleteIcon}
                            alt="Delete"
                            onClick={() => handleDeleteRow(index)}
                            style={{
                                width: '20px',
                                height: '20px',
                                marginTop: '7px'
                            }}
                        />
                    </OverlayTrigger>
                </div>
            ),
            allowoverflow: true,
            width: 'auto',
        },
    ];

    //////// Contact Person Tab End  /////////

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
                paddingRight: '3px',
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

    const docColumns = [
        {
            name: 'Document Type',
            selector: row => row.doc_type,
            cell: (row, index) => (
                <select
                    type="text"
                    value={row.doc_type}
                    onChange={e => handleDocChange(index, 'doc_type', e.target.value)}
                    className="form-select me-3 select_color"
                >
                    <option value=''>Select Doc Type</option>
                    {docTypes.map((docT, index) => (
                        <option key={index} value={docT.doc_type}>{docT.doc_type}</option>
                    ))}
                </select>
            ),
            width: '170px',
        },
        {
            name: 'Address Type',
            selector: row => row.addr_type,
            cell: (row, index) => (
                <select
                    type="text"
                    value={row.addr_type}
                    onChange={e => handleDocChange(index, 'addr_type', e.target.value)}
                    className="form-select me-3 select_color"
                >
                    <option value=''>Select</option>
                    <option value='CORR'>Correspondence</option>
                    <option value='PERM'>Permanent</option>
                    <option value='BOTH'>Both</option></select>
            ),
            width: '170px',
        },
        {
            name: 'Document Name',
            selector: row => row.doc_name,
            cell: (row, index) => (
                <select
                    type="text"
                    value={row.doc_name}
                    onChange={e => handleDocChange(index, 'doc_name', e.target.value.toUpperCase())}
                    className="form-select  me-3 select_color"
                >
                    <option value=''>Select Document</option>
                    {docNames.map((doc, index) => (
                        <option key={index} value={doc.doc_id}>{doc.document}</option>
                    ))}
                </select>
            ),
            width: '250px',
        },
        {
            name: 'Id No.',
            selector: row => row.id_no,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.id_no}
                    onChange={e => handleDocChange(index, 'id_no', e.target.value)}
                    className="form-control me-3 select_color"
                    disabled={addMode}
                />
            ),
            width: '170px',
        },
        {
            name: 'Place of Issue',
            selector: row => row.place_of_issue,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.place_of_issue}
                    onChange={e => handleDocChange(index, 'place_of_issue', e.target.value)}
                    className="form-control me-3 select_color"
                    disabled={addMode}
                />
            ),
            width: '190px',
        },
        {
            name: 'Issue Date',
            selector: row => row.issue_date,
            cell: (row, index) => (
                <input
                    type="date"
                    value={row.issue_date}
                    onChange={e => handleDocChange(index, 'issue_date', e.target.value)}
                    className="form-control me-3 select_color"
                    disabled={addMode}
                />
            ),
            width: '170px',
        },
        {
            name: 'Expiry Date',
            selector: row => row.expiry_date,
            cell: (row, index) => (
                <div className='d-flex'>
                    <input
                        type="date"
                        value={row.expiry_date}
                        onChange={e => handleDocChange(index, 'expiry_date', e.target.value)}
                        className="form-control me-3 select_color"
                        disabled={addMode}
                    />

                </div>
            ),
            width: '170px',
        },
        {
            name: 'Action',
            cell: (row, index) => (
                <div className='d-flex'>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-delete-${index}`}>
                                Delete
                            </Tooltip>
                        }
                    >
                        <img
                            src={deleteIcon}
                            alt="Delete"
                            onClick={() => handlePoaPoiDetailsDeleteRow(index)}
                            style={{
                                width: '20px',
                                height: '20px',
                                marginTop: '7px'
                            }}
                        />
                    </OverlayTrigger>

                </div>
            ),
            width: '50px',
        },

        // {
        //     name: 'DOC Id No.',
        //     selector: row => row.doc_id_no,
        //     cell: (row, index) => (
        //         <input
        //             type="text"
        //             value={row.doc_id_no}
        //             onChange={e => handleDocChange(index, 'id_no', e.target.value)}
        //             className="form-control me-3 select_color"
        //             disabled={addMode}
        //             hidden
        //         />
        //     ),
        //     width: '0px',
        // },
        // {
        //     name: 'DOC Place of Issue',
        //     selector: row => row.doc_place_of_issue,
        //     cell: (row, index) => (
        //         <input
        //             type="text"
        //             value={row.doc_place_of_issue}
        //             onChange={e => handleDocChange(index, 'place_of_issue', e.target.value)}
        //             className="form-control me-3 select_color"
        //             disabled={addMode}
        //             hidden
        //         />
        //     ),
        //     width: '0px',
        // },
        // {
        //     name: 'DOC Issue Date',
        //     selector: row => row.doc_issue_date,
        //     cell: (row, index) => (
        //         <input
        //             type="text"
        //             value={row.doc_issue_date}
        //             onChange={e => handleDocChange(index, 'issue_date', e.target.value)}
        //             className="form-control me-3 select_color"
        //             disabled={addMode}
        //             hidden
        //         />
        //     ),
        //     width: '0px',
        // },
        // {
        //     name: 'DOC Expiry Date',
        //     selector: row => row.doc_expiry_date,
        //     cell: (row, index) => (
        //         <input
        //             type="text"
        //             value={row.doc_expiry_date}
        //             onChange={e => handleDocChange(index, 'doc_expiry_date', e.target.value)}
        //             className="form-control me-3 select_color"
        //             disabled={addMode}
        //             hidden
        //         />
        //     ),
        //     width: '0px',
        // },
        {
            selector: row => row.doc_code,
            cell: (row, index) => (
                <input value={row.doc_code} readOnly hidden />
            ),
        },
    ];

    const customStylesDoc = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: '#ccc',
                backgroundColor: '#99bcef',
                color: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                minHeight: '30px',
                paddingLeft: '1px',
                paddingRight: '1px',
            },
        },
        headCells: {
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: '#ccc',
                paddingLeft: '1px',
                paddingRight: '1px',
            },
        },
        cells: {
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: '#ccc',
                paddingLeft: '1px',
                paddingRight: '1px',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
                borderBottomColor: '#ccc',
                borderLeft: '1px solid #ccc'
            },
        },
        rows: {
            style: {
                paddingTop: '1px',
                paddingBottom: '1px',
                paddingLeft: '1px',
                paddingRight: '1px',
            },
        },
    };

    return (
        <div className="tabs-containerclient mt-2 main-box ">
            <div className="card-header text-center color_header py-2 mb-3" style={{ width: '110%', marginLeft: '-4rem', marginTop: '-1rem' }}>
                <h4 className='slabheader'>Client Master</h4>
            </div>
            <div className="form-containerclient mb-3">
                <div className="row mb-1">
                    <div className="col-12 col-md-7 d-flex align-items-center">
                        <label className='common_width8 me-0 '>Client Name</label>
                        <input
                            type="text"
                            className="form-control common_input"
                            name="clientName"
                            placeholder="Client Full Name"
                            value={formData.clientName ? formData.clientName.toUpperCase() : ''}
                            onChange={handleChange}
                            disabled={addMode}
                        />
                    </div>

                    <div className="col-12 col-md-5 d-flex align-items-center">
                        <label className=' common_width me-0 '>Short Name</label>
                        <input
                            type="text"
                            className="form-control common_input"
                            name="client_short_name"
                            placeholder="Client Short Name"
                            value={formData.client_short_name ? formData.client_short_name.toUpperCase() : ''}
                            onChange={handleChange}
                            disabled={addMode}
                        />
                    </div>

                    <div className='row mb-1 mt-1'>
                        <div className="col-12 col-md-3 d-flex align-items-center">
                            <label className='common_width me-0 '>Category</label>
                            <select
                                name="category"
                                className="form-select common_select common_size_input1"
                                value={formData.category}
                                onChange={handleChange}
                                disabled={addMode}
                            >
                                <option value="">Select Category</option>
                                <option value="IND">Individual</option>
                                <option value="NIND">Non-Individual</option>
                            </select>
                        </div>

                        <div className='col-12 col-md-3 d-flex align-items-center'>
                            <label className='ms-0 me-0 common_width'>Sub Catg</label>
                            <select
                                name="sub_category"
                                className="form-select common_select"
                                value={formData.sub_category}
                                onChange={handleChange}
                                disabled={addMode}
                            >
                                <option value="">Select Sub Category</option>
                                {categories.map(category => (
                                    <option key={category.comm_id} value={category.comm_id}>
                                        {category.description}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-3 d-flex align-items-center">
                            <label className=' pe-3 common_width text-end' style={{ boxSizing: 'border-box' }}>CRN</label>
                            <input
                                type="text"
                                className="form-control common_input ms-0"
                                name="crn"
                                placeholder="Client CRN Code"
                                value={formData.crn}
                                onChange={handleChange}
                                disabled={addMode}
                            />
                        </div>
                        <div className="col-12 col-md-3 d-flex align-items-center">
                            <label className=' me-0 ' style={{ width: '8rem' }}>Brok Code</label>
                            <input
                                type="text"
                                className="form-control common_input ms-1 me-2"
                                name="NSECode"
                                placeholder="Broking Code"
                                value={formData.NSECode}
                                onChange={handleChange}
                                disabled={addMode}
                            />
                            <OverlayTrigger
                                placement="top" // Position the tooltip above the button
                                overlay={
                                    <Tooltip id={`tooltip-search`}>
                                        Search Brok Code
                                    </Tooltip>
                                }
                            >
                                <img
                                    src={searchIcon}
                                    alt="Search"
                                    onClick={() => handleBrokCodeSearch(formData.NSECode)}
                                    style={{
                                        width: '20px', // Adjust size as needed
                                        height: '20px',
                                        marginTop: '7px'
                                    }}
                                />
                            </OverlayTrigger>
                        </div>


                    </div>
                    <div className='row mb-1 mt-0' >
                        <div className='col-12 col-md-3 d-flex align-items-center'>
                            <label className=' me-0  common_width'>Country Status</label>
                            <input
                                type="text"
                                className="form-control common_input "
                                name="country_status"
                                value={formData.country_status}
                                onChange={handleChange}
                                disabled={addMode}
                                style={{width:'9rem'}}
                            />
                        </div>

                        <div className='col-12 col-md-4 d-flex align-items-center' style={{ marginRight: '12rem' }}>
                            <label className='' style={{width:'3.2rem'}} >PAN</label>
                            <input
                                type="text"
                                className="form-control common_input common_size_input1 me-2"
                                name="pan"
                                value={formData.pan}
                                onChange={handleChange}
                                disabled={addMode}
                            />
                            <div className='me-4'>
                                <button className="btn btn-sm btn-primary common_button"
                                    disabled={addMode} onClick={() => handlePanSearch(formData.pan)}>Search</button>
                            </div>
                        </div>
                        <div className="col-12 col-md-12 d-flex align-items-end ms-2 mt-3">
                            <button className="btn btn-primary me-1" onClick={handleAddClick}>Add</button>
                            <button className="btn btn-primary me-1"
                                disabled={addMode} onClick={handleClearClick}>Clear</button>
                            <button className="btn btn-success me-1 common_button"
                                disabled={addMode} onClick={handleSave}>Save</button>
                            <button className="btn btn-warning" onClick={handleEdit}>Search</button>
                        </div>

                    </div>
                </div>
            </div>

            <ul className="tabs1 nav nav-tabs mb-1 " >
                {['personal', 'entity', 'GeneralDetails', 'contactDetails', 'contactPerson', 'financial', 'nominee', 'miiDetails', 'risk', 'Fatca'].map((tab1) => (
                    <li
                        key={tab1}
                        className={`nav-item`}
                    >
                        <span
                            className={`nav-link ${activeTab === tab1 ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab1)}
                        >
                            {tab1.charAt(0).toUpperCase() + tab1.slice(1).replace(/([A-Z])/g, ' $1')}
                        </span>
                    </li>
                ))}
            </ul>
            {/* *************************************************Personal Tab Start ***************************************************************/}

            <div className="tab-content1">
                <div className={`tab-pane1 ${activeTab === 'personal' ? 'show active' : ''}`}>
                    <div className="row mb-1">
                        <div className="col-12 col-md-3 common_flex">
                            <label className='common_width3'>Name Prefix</label>
                            <select
                                name="namePrefix"
                                className="form-select common_select common_size_input"
                                value={formData.namePrefix}
                                onChange={handleChange}
                                disabled={addMode}
                            >
                                <option value="Prefix">Prefix</option>
                                {prefixs.map(prefixes => (
                                    <option key={prefixes.comm_id} value={prefixes.comm_id}>
                                        {prefixes.nse_val}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 col-md-3 common_flex">
                            <label className='common_width1'>First Name</label>
                            <input
                                type="text"
                                className="form-control common_input2"
                                name="firstName"
                                value={formData.firstName ? formData.firstName.toUpperCase() : ''}
                                onChange={handleChange}
                                disabled={addMode}
                            />
                        </div>
                        <div className="col-12 col-md-3 common_flex">
                            <label className='common_width1'>Middle Name</label>
                            <input
                                type="text"
                                className="form-control common_input2"
                                name="middleName"
                                value={formData.middleName ? formData.middleName.toUpperCase() : ''}
                                onChange={handleChange}
                                disabled={addMode}
                            />
                        </div>
                        <div className="col-12 col-md-3 common_flex">
                            <label className='common_width1'>Last Name</label>
                            <input
                                type="text"
                                className="form-control common_input2"
                                name="lastName"
                                value={formData.lastName ? formData.lastName.toUpperCase() : ''}
                                onChange={handleChange}
                                disabled={addMode}
                            />
                        </div>
                    </div>
                    <div className="row mb-1">
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width3'>Appl. Date</label>
                            <input
                                type="date"
                                className="form-control common_input common_size_input1"
                                name="applDate"
                                value={formData.applDate}
                                onChange={handleChange}
                                disabled={addMode}
                            />
                        </div>
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width'>A/C Open Date</label>
                            <input
                                type="date"
                                className="form-control common_input common_size_input1"
                                name="account_opening_date"
                                value={formData.account_opening_date}
                                onChange={handleChange}
                                disabled={addMode}
                            />
                        </div>
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width'>Status</label>
                            <select
                                name="status"
                                className="form-select common_select"
                                value={formData.status}
                                onChange={handleChange}
                                disabled={addMode}
                            >
                                <option value="">Select Status</option>
                                <option value="1">Captured</option>
                                <option value="0">Verified</option>
                            </select>
                        </div>
                    </div>

                    <div className="row mb-1">
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width3'>Gender</label>
                            <select
                                name="gender"
                                className="form-select common_select common_size_input1"
                                value={formData.gender}
                                onChange={handleChange}
                                disabled={addMode}
                            >
                                <option value="">Select Gender</option>
                                {genders.map(genderes => (
                                    <option key={genderes.comm_id} value={genderes.comm_id}>
                                        {genderes.description}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width2'>Marital Status</label>
                            <select
                                name="maritalStatus"
                                className="form-select common_select"
                                value={formData.maritalStatus}
                                onChange={handleChange}
                                style={{ width: '24.5rem' }}
                                disabled={addMode}
                            >
                                <option value="">Select Status</option>
                                {marital_statuss.map(marital_statusses => (
                                    <option key={marital_statusses.comm_id} value={marital_statusses.comm_id}>
                                        {marital_statusses.description}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width2'>Birth Country</label>

                            <select
                                name="birth_country"
                                className="form-select common_input "
                                value={formData.birth_country}
                                style={{ width: '24.5rem' }}
                                onChange={handleChange}
                                disabled={addMode}
                            >
                                <option value="">Select Country</option>
                                {nationalities.map(nation => (
                                    <option key={nation.comm_id} value={nation.nse_val}>
                                        {nation.description}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>
                    <div className="row mb-1">
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width3'>Nationality</label>
                            <select
                                name="nationality"
                                className="form-select common_select common_size_input1"
                                value={formData.nationality}
                                onChange={handleChange}
                                disabled={addMode}
                            >
                                <option value="">Select Nationality</option>
                                {nationalities.map(nation => (
                                    <option key={nation.comm_id} value={nation.nse_val}>
                                        {nation.description}
                                    </option>
                                ))}

                            </select>

                        </div>
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width2'>Nationality(other)</label>
                            <input
                                type="text"
                                name="nationality_other"
                                className="form-control common_input"
                                value={formData.nationality_other}
                                onChange={handleChange}
                                disabled={addMode}
                            />
                        </div>
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width2'>DOB</label>
                            <input
                                type="date"
                                className="form-control common_input me-2"
                                name="dob"
                                style={{ width: '69%' }}
                                value={formData.dob}
                                onChange={handleChange}
                                disabled={addMode}
                            />
                            <div className='d-flex align-items-center'>
                                <input
                                    type="radio"
                                    name="minor"
                                    checked={isMinor}
                                    readOnly
                                    className="me-2"
                                    disabled={addMode}
                                />
                                <span>Minor</span>
                            </div>

                        </div>

                    </div>
                    <div className="row mb-1">
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width3'>Occupation </label>

                            <select
                                name="occupation_id"
                                className="form-select common_select common_size_input1"
                                value={occupationData.occupation_id}
                                onChange={handleOccupationChange}
                                disabled={addMode}
                            >
                                <option value="">Select Occupation</option>
                                {occupations.map(occupationes => (
                                    <option key={occupationes.comm_id} value={occupationes.comm_id}>
                                        {occupationes.description}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 col-md-4 common_flex" hidden={hidden}>
                            <label className='common_width2'>Occupation (Other)</label>
                            <input
                                type="text"
                                className="form-control common_input "
                                name="occupation_details"
                                value={occupationData.occupation_details}
                                onChange={handleOccupationChange}
                                disabled={addMode}
                            />
                        </div>
                        <div className="col-12 col-md-4 common_flex" hidden={hidden}>
                            <label className='common_width2'>{getLabel()} Name</label>
                            <input
                                name="office_name"
                                type='text'
                                className="form-control  common_input"
                                disabled={addMode}
                                value={occupationData.office_name}
                                onChange={handleOccupationChange}
                            />
                        </div>

                    </div>
                    <div className="row mb-1" hidden={hidden}>
                        {/* <div className="col-12 col-md-4 common_flex">
                            <label className='common_width3'>{getDynamicLabel()} Address 1</label>
                            <input
                                type="text"
                                className="form-control common_input common_size_input1"
                                name="officeaddress1"
                                value={occupationData.officeaddress1}
                                onChange={handleOccupationChange}
                            />
                        </div>
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width2'>{getDynamicLabel()} Address 2</label>
                            <input
                                type="text"
                                className="form-control common_input"
                                name="officeaddress2"
                                value={occupationData.officeaddress2}
                                onChange={handleOccupationChange}
                            />
                        </div>
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width2'>{getDynamicLabel()} Address 3</label>
                            <input
                                type="text"
                                className="form-control common_input"
                                name="officeaddress3"
                                value={occupationData.officeaddress3}
                                onChange={handleOccupationChange}
                            />
                        </div> */}
                    </div>
                    <div className="row mb-1" hidden={hidden}>
                        {/* <div className="col-12 col-md-4 common_flex">
                            <label className='common_width3'>{getDynamicLabel()} State</label>
                            <input
                                type="text"
                                className="form-control common_input common_size_input1"
                                name="office_state"
                                value={occupationData.office_state}
                                onChange={handleOccupationChange}
                            />
                        </div> */}
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width2'>{getDynamicLabel()} Tele No.</label>
                            <input
                                type="text"
                                className="form-control common_input"
                                name="office_tele"
                                value={occupationData.office_tele}
                                onChange={handleOccupationChange}
                                disabled={addMode}
                            />
                        </div>
                        <div className="col-12 col-md-4 common_flex" >
                            <label className='common_width2'>Designation</label>
                            <input
                                type="text"
                                className="form-control common_input"
                                name="designation"
                                value={occupationData.designation}
                                onChange={handleOccupationChange}
                                disabled={addMode}
                            />
                        </div>
                    </div>
                    <div className='d-flex align-items-end' style={{ height: '100%' }}>
                        <div className='me-2'>
                            <DataTable columns={Namecolumns} data={namedata} customStyles={customStyles} responsive />
                        </div>
                        <div className="d-flex align-items-end">
                            <button className="btn btn-primary" style={{ height: '38px' }}
                                disabled={addMode} onClick={handleAddNameRow}>Add</button>
                        </div>
                    </div>

                </div>
                {/* *************************************************Personal Tab End ***************************************************************/}

                {/* *************************************************Entity Tab Start ***************************************************************/}
                <div className={`tab-pane1 ${activeTab === 'entity' && formData.category === "NIND" ? 'show active' : ''}`}>
                    <div>
                        <DataTable
                            columns={entitycolumns}
                            customStyles={customStyles}
                            data={entityData} // Make sure entityData is an array
                            responsive
                        />
                        <div className="d-flex">
                            <button className="btn btn-success" disabled={addMode} onClick={handleEntityAddRow}>Add</button>
                        </div>
                    </div>
                </div>
                {/* *************************************************Entity Tab End ***************************************************************/}
                {/* *************************************************Occupation Tab Start ***************************************************************/}
                <div className={`tab-pane1 ${activeTab === 'GeneralDetails' ? 'show active' : ''}`}>
                    <div>
                        <div className="row mb-1">
                            {/* <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Start of Relation</label>
                                <input
                                    type="date"
                                    className="form-control common_input"
                                    name="start_relation"
                                    value={occupationData.start_relation}
                                    onChange={handleOccupationChange}
                                />
                            </div> */}
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>General Group</label>
                                <select
                                    className="form-select common_input"
                                    name="general_group"
                                    value={occupationData.general_group}
                                    onChange={handleOccupationChange}
                                    disabled={addMode}
                                >
                                    <option value=''>Select General Group</option>
                                    {cliGrpResults.map((result) => (
                                        <option key={result.cli_grp_cd} value={result.cli_grp_cd}>
                                            {result.cli_grp_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>Family Group</label>
                                <select
                                    className="form-select common_input"
                                    name="family_group"
                                    value={occupationData.family_group}
                                    onChange={handleOccupationChange}
                                    disabled={addMode}
                                >
                                    <option value=''>Select Family Group</option>
                                    {famGrpResults.map((result) => (
                                        <option key={result.fam_grp_cd} value={result.fam_grp_cd}>
                                            {result.fam_grp_name}
                                        </option>
                                    ))}
                                </select>

                            </div>
                            <div className="col-12 col-md-4 common_flex mt-1">
                                <label className='common_width2'>Inperson Verif.</label>
                                <select
                                    className="form-select"
                                    name="inperson_verification"
                                    value={occupationData.inperson_verification}
                                    onChange={handleOccupationChange}
                                    disabled={addMode}
                                >
                                    <option value=''>Select</option>
                                    <option value='PHYSICAL'>Physical</option>
                                    <option value='VIDEO'>Video</option>
                                </select>
                            </div>

                            {/* <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Trade Group</label>
                                <select
                                    className="form-control form-select common_input"
                                    name="trade_group"
                                    value={occupationData.trade_group}
                                    onChange={handleOccupationChange}
                                    disabled={addMode}
                                >
                                    <option value=''>select</option>
                                </select>
                            </div> */}
                        </div>
                        <div className="row mb-1">

                            <div className="col-12 col-md-4 common_flex" >
                                <label className='common_width2'>Person Doing Verif.</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="person_doing_verif"
                                    value={occupationData.person_doing_verif}
                                    onChange={handleOccupationChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex" >
                                <label className='common_width2'>Name Of Orgn.</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="organisation"
                                    value={occupationData.organisation}
                                    onChange={handleOccupationChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex" >
                                <label className='common_width2'>Code</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="code"
                                    value={occupationData.code}
                                    onChange={handleOccupationChange}
                                    disabled={addMode}
                                />
                            </div>

                            {/* <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Dealer  Group</label>
                                <select
                                    className="form-control form-select common_input"
                                    name="dealer_group"
                                    value={occupationData.dealer_group}
                                    onChange={handleOccupationChange}
                                    disabled={addMode}
                                >
                                    <option value=''>select</option>
                                </select>
                            </div> */}
                            {/* <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>Sub Dealer Group</label>
                                <select
                                    className="form-control form-select common_input"
                                    name="sub_dealer_group"
                                    value={occupationData.sub_dealer_group}
                                    onChange={handleOccupationChange}
                                    disabled={addMode}
                                >
                                    <option value=''>select</option>
                                </select>
                            </div> */}
                            {/*<div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>DDPI/POA</label>
                                <select
                                    className="form-control form-select common_input"
                                    name="ddpi_poa"
                                    value={occupationData.ddpi_poa}
                                    onChange={handleOccupationChange}
                                    disabled={addMode}
                                >
                                    <option value='DDPI'>DDPI</option>
                                    <option value='POA'>POA</option>
                                    <option value='Client'>Client</option>
                                </select>
                            </div>*/}
                        </div>
                        <div className='row mb-1'>
                            <div className="col-12 col-md-4 common_flex" >
                                <label className='common_width2'>Place</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="place"
                                    value={occupationData.place}
                                    onChange={handleOccupationChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width3'>Date</label>
                                <input
                                    type="date"
                                    className="form-control common_input common_size_input1"
                                    name="date"
                                    value={occupationData.date}
                                    onChange={handleOccupationChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex ">
                                <label className='common_width3'>Video Rec. File Name</label>
                                <input
                                    type="text"
                                    className="form-control common_input common_size_input1"
                                    name="vid_rec_file_name"
                                    value={occupationData.vid_rec_file_name}
                                    onChange={handleOccupationChange}
                                    disabled={addMode}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* *************************************************Occupation Tab End ***************************************************************/}

                {/* *************************************************Communication Tab Start ***************************************************************/}
                <div className={`tab-pane1 ${activeTab === 'contactDetails' ? 'show active' : ''}`}>
                    <div className='mb-4'>
                        <h5 className='mt-2 text-center table-heading'>Address Details</h5>
                        <DataTable columns={addrColumns} data={addrData} customStyles={customStyles} responsive />
                        {/* <div className="d-flex   mt-1">
                            <button className="btn btn-success " onClick={handleAddrDetSave}>Save</button>
                        </div> */}
                    </div>

                    <div className='table-container mb-5'>
                        <h5 className='mt-2 text-center table-heading '>Proof of Address / Proof of Identity</h5>
                        <DataTable
                            columns={docColumns}
                            data={poaPoiDetails}
                            responsive
                            highlightOnHover
                            customStyles={customStylesDoc}
                        // noDataComponent={<div>No data available</div>}
                        />
                        <div className="d-flex   mt-1">
                            <button className="btn btn-success "
                                disabled={addMode}
                                onClick={handlePoaPoiDetailsAddRow}
                            >Add</button>
                        </div>
                    </div>

                    <div className='mt-2 ms-2'>
                        <div className=" mb-1">
                            <div className="row mb-1">
                                <div className="col-12 col-md-4 common_flex">
                                    <label className='common_width6'>ISD Code Mobile 1</label>
                                    <input
                                        type="text"
                                        name="isdcode_mobile_1"
                                        className="form-control common_input"
                                        value={formData.isdcode_mobile_1}
                                        onChange={handleChange}
                                        disabled={addMode}
                                    />
                                </div>
                                <div className="col-12 col-md-4 common_flex">
                                    <label className='common_width5'>Mobile No. 1</label>
                                    <input
                                        type="text"
                                        className="form-control common_input"
                                        value={formData.mobile_1}
                                        disabled={addMode}
                                        onChange={e => {
                                            const inputValue = e.target.value.replace(/[^\d]/g, ''); // Remove non-numeric characters

                                            // Check if the length is 10
                                            if (inputValue.length <= 10) {
                                                handleChange({
                                                    target: { name: 'mobile_1', value: inputValue }
                                                });
                                            }
                                        }}
                                        placeholder="Enter 10-digit mobile number"
                                    />
                                    {formData.mobile_1 && formData.mobile_1.length !== 10 && (
                                        <div className="text-danger">Mobile number must be 10 digits.</div>
                                    )}
                                </div>

                                {/* Relation Flag */}
                                <div className="col-12 col-md-4 common_flex">
                                    <label className='common_width2'>Relation Flag</label>
                                    <input
                                        type="text"
                                        name='relation_flag'
                                        className="form-control common_input"
                                        value={formData.relation_flag}
                                        onChange={handleChange}
                                        disabled={addMode}
                                    />
                                </div>

                            </div>

                            <div className="row mb-1">
                                {/* Mobile No. 2 */}
                                <div className="col-12 col-md-4 common_flex">
                                    <label className='common_width6'>ISD Code Mobile 2</label>
                                    <input
                                        type="text"
                                        name='isdcode_mobile_2'
                                        className="form-control common_input"
                                        value={formData.isdcode_mobile_2}
                                        onChange={handleChange}
                                        disabled={addMode}
                                    />
                                </div>
                                <div className="col-12 col-md-4 common_flex">
                                    <label className='common_width5'>Mobile No. 2</label>
                                    <input
                                        type="text"
                                        className="form-control common_input"
                                        value={formData.mobile_2}
                                        disabled={addMode}
                                        onChange={e => {
                                            const inputValue = e.target.value.replace(/[^\d]/g, ''); // Remove non-numeric characters

                                            // Check if the length is 10
                                            if (inputValue.length <= 10) {
                                                handleChange({
                                                    target: { name: 'mobile_2', value: inputValue }
                                                });
                                            }
                                        }}
                                        placeholder="Enter 10-digit mobile number"
                                    />
                                    {formData.mobile_2 && formData.mobile_2.length !== 10 && (
                                        <div className="text-danger">Mobile number must be 10 digits.</div>
                                    )}
                                </div>

                                {/* Office Email ID */}
                                <div className="col-12 col-md-4 common_flex">
                                    <label className='common_width2'>Office Email</label>
                                    <input
                                        type="text"
                                        name='email_id_1'
                                        className="form-control common_input"
                                        value={formData.email_id_1}
                                        onChange={handleChange}
                                        disabled={addMode}
                                    />
                                </div>
                            </div>

                            <div className="row mb-1">
                                {/* Resident Email ID */}
                                <div className="col-12 col-md-4 common_flex">
                                    <label className='common_width6'>Resident Email</label>
                                    <input
                                        type="text"
                                        name='email_id_2'
                                        className="form-control common_input"
                                        value={formData.email_id_2}
                                        onChange={handleChange}
                                        disabled={addMode}
                                    />
                                </div>
                                <div className="col-12 col-md-4 common_flex">
                                    <label className='common_width5'>Resident Tel No.</label>
                                    <input
                                        type="text"
                                        name='res_tel_no'
                                        className="form-control common_input"
                                        value={formData.res_tel_no}
                                        onChange={handleChange}
                                        disabled={addMode}
                                        placeholder="+[ISDCode]123-456-7890"
                                        pattern="^\+\d{1,3}\d{3}-\d{3}-\d{4}$"
                                        title="Format: +[ISD Code] 123-456-7890"
                                    />
                                </div>

                                {/* Office Tel No. */}
                                <div className="col-12 col-md-4 common_flex">
                                    <label className='common_width2'>Office Tel No.</label>
                                    <input
                                        type="text"
                                        name='Office_tel_no'
                                        className="form-control common_input"
                                        value={formData.Office_tel_no}
                                        onChange={handleChange}
                                        disabled={addMode}
                                        placeholder="+[ISDCode]123-456-7890"
                                        pattern="^\+\d{1,3}\d{3}-\d{3}-\d{4}$"
                                        title="Format: +[ISD Code] 123-456-7890"
                                    />
                                </div>

                            </div>
                            <div className="row mb-1">
                                {/* Whatsapp No. */}
                                <div className="col-12 col-md-4 common_flex">
                                    <label className='common_width6'>Whatsapp No.</label>
                                    <input
                                        type="text"
                                        name='whatsapp'
                                        className="form-control common_input"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        disabled={addMode}
                                    />
                                </div>

                                {/* Telegram No. */}
                                <div className="col-12 col-md-4 common_flex">
                                    <label className='common_width5'>Telegram No.</label>
                                    <input
                                        type="text"
                                        name='telegram_app'
                                        className="form-control common_input"
                                        value={formData.telegram_app}
                                        onChange={handleChange}
                                        disabled={addMode}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {/* *************************************************Communication Tab End ***************************************************************/}

                {/* *************************************************ContactPerson Tab Start ***************************************************************/}
                <div className={`tab-pane1 ${activeTab === 'contactPerson' ? 'show active' : ''}`}>
                    <DataTable columns={columns} data={details} customStyles={customStyles} responsive />
                    <div className="d-flex   ">
                        <button className="btn btn-success " disabled={addMode} onClick={handleAddRow}>Add</button>
                    </div>
                </div>
                {/* *************************************************ContactPerson Tab End ***************************************************************/}

                {/* *************************************************BankDetails Tab Start ***************************************************************/}
                <div className={`tab-pane1 ${activeTab === 'financial' ? 'show active' : ''}`}>
                    <div className="row mb-1">
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width'>GST NO</label>
                            <input
                                type="text"
                                className="form-control common_input common_size_input1"
                                name="gst"
                                value={formData.gst}
                                onChange={handleChange}
                                disabled={addMode}
                            />

                        </div>
                        <div className="col-12 col-md-4 common_flex">
                            <label className='common_width'>GST State</label>
                            <select
                                name="gst_state"
                                className="form-select common_select"
                                value={formData.gst_state}
                                onChange={handleChange}
                                disabled={addMode}
                            >
                                <option value="">Select GST State</option>
                                <option value="USA">United State</option>
                                <option value="UK">New York</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <h5 className='mt-2 text-center table-heading'>Bank Details</h5>
                        <DataTable columns={Bankcolumns} data={Bankdetails} customStyles={customStyles} responsive />
                        <div className="d-flex   mt-1">
                            <button className="btn btn-success "
                                disabled={addMode} onClick={handleBankDetailsAddRow}>Add</button>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <h5 className='mt-2 text-center table-heading'>Depository Details</h5>
                        <DataTable columns={depositcolumns} data={DepositData} customStyles={customStyles} responsive />
                        <div className="d-flex  mt-1 ">
                            <button className="btn btn-success "
                                disabled={addMode} onClick={handleDepositAddRow}>Add</button>
                        </div>
                    </div>
                </div>
                {/* *************************************************BankDetails Tab End ***************************************************************/}

                {/* *************************************************Nominee Tab Start ***************************************************************/}
                <div className={`tab-pane1 ${activeTab === 'nominee' ? 'show active' : ''}`}>
                    <div>
                        <DataTable columns={Nomineecolumns} data={Nomineedetails} customStyles={customStyles} responsive />
                        <div className="d-flex   ">
                            <button className="btn btn-success "
                                disabled={addMode} onClick={handleNomineeAddRow}>Add</button>
                        </div>
                    </div>
                </div>
                {/* *************************************************Nominee Tab End ***************************************************************/}

                {/* *************************************************MiiDetails Tab Start ***************************************************************/}
                <div className={`tab-pane1 ${activeTab === 'miiDetails' ? 'show active' : ''}`}>
                    <div>
                        <DataTable
                            columns={miiDetColumns} data={miidetails}
                            customStyles={customStyles} responsive />
                        <div className="d-flex   ">
                            <button className="btn btn-success "
                                disabled={addMode} onClick={handleMiiDetAddRow}
                            >Add</button>
                        </div>
                    </div>
                </div>
                {/* *************************************************MiiDetails Tab End ***************************************************************/}

                {/* *************************************************Risk Tab Start ***************************************************************/}
                <div className={`tab-pane1 ${activeTab === 'risk' ? 'show active' : ''}`}>
                    <div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Outsourced/Self</label>
                                <select
                                    name="outsourced_self"
                                    className="form-select common_select allselectmargin"
                                    disabled={addMode}
                                    value={formData.outsourced_self}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Assessment Souce </option>
                                    <option value="Assessment 1">Assessment 1</option>
                                    <option value="Assessment 2">Assessment 2</option>
                                    <option value="Assessment 3">Assessment 3</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Employee Id</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="employee_id"
                                    value={formData.employee_id}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>Employee Name</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="employee_name"
                                    value={formData.employee_name}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Agency Name</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="agency_name"
                                    value={formData.agency_name}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Agency Person</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="Agency_person"
                                    value={formData.Agency_person}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>Designation</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Date Time Assesme</label>
                                <input
                                    type="date"
                                    className="form-control common_input"
                                    name="date_time_assesme"
                                    value={formData.date_time_assesme}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Place Assesment</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="place_assesment"
                                    value={formData.place_assesment}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>Evidence Provided</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="evidence_provided"
                                    value={formData.evidence_provided}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Next KYC Due</label>
                                <input
                                    type="date"
                                    className="form-control common_input"
                                    name="next_kyc_due"
                                    value={formData.next_kyc_due}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>A/c Open Appr By</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="Ac_open_appr_by"
                                    value={formData.Ac_open_appr_by}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>PEP</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="pep"
                                    value={formData.pep}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />

                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>PEP Name</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="pep_name"
                                    value={formData.pep_name}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Relation With PEP</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="relation_with_pep"
                                    value={formData.relation_with_pep}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>PEP Post Held</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="pep_post_held"
                                    value={formData.pep_post_held}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Ann.Income Year 1</label>
                                <input
                                    type="number"
                                    className="form-control common_input"
                                    name="Ann_income_year_1"
                                    value={formData.Ann_income_year_1}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Ann.Income Year 2</label>
                                <input
                                    type="number"
                                    className="form-control common_input"
                                    name="Ann_income_year_2"
                                    value={formData.Ann_income_year_2}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>Gross Income Ann Range</label>
                                <select
                                    name="gross_income_ann_range"
                                    className="form-select common_select "
                                    style={{ marginLeft: '0.6rem' }}
                                    value={formData.gross_income_ann_range}
                                    onChange={handleChange}
                                    disabled={addMode}
                                >
                                    <option value="">Select Gross income Ann </option>
                                    <option value="Gross income 1">Gross income 1</option>
                                    <option value="Gross income 2">Gross income 2</option>
                                    <option value="Gross income 3">Gross income 3</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Net Worth INR</label>
                                <input
                                    type="number"
                                    className="form-control common_input"
                                    name="net_worth_inr"
                                    value={formData.net_worth_inr}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Net Worth As On</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="net_worth_as_on"
                                    value={formData.net_worth_as_on}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>Gross Income On Date</label>
                                <input
                                    type="date"
                                    className="form-control common_input"
                                    name="gross_income_as_on_date"
                                    value={formData.gross_income_as_on_date}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Client Special Catg
                                </label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="client_special_catg"
                                    value={formData.client_special_catg}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Special Catg Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="special_catg_name"
                                    value={formData.special_catg_name}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>Req  Enhanced Due Delg</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="req_enhanced_due_delg"
                                    value={formData.req_enhanced_due_delg}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                        </div>

                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Risk Category</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="risk_category"
                                    value={formData.risk_category}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Acc Open Appr By</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="acc_open_appr_by"
                                    value={formData.org_name}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>Country Place Residence
                                </label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="country_place_residence"
                                    value={formData.country_place_residence}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                        </div>

                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Residence Type</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="residence_type"
                                    value={formData.residence_type}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Client Income</label>
                                <input
                                    type="number"
                                    className="form-control common_input"
                                    name="client_income"
                                    value={formData.client_income}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>Buisness Nature </label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="buisness_nature"
                                    value={formData.buisness_nature}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                        </div>

                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Trading Turnover</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="trading_turnover"
                                    value={formData.trading_turnover}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Overall Risk Index</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="overall_risk_index"
                                    value={formData.overall_risk_index}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>Dubs Crim Politic Rep</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="dubs_crim_politic_rep"
                                    value={formData.dubs_crim_politic_rep}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Client Regis No.</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="client_regis_no"
                                    value={formData.client_regis_no}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Registration  Auth</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="registration_auth"
                                    value={formData.registration_auth}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>

                        </div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Registration Place </label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="registration_place"
                                    value={formData.registration_place}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Registration Date</label>
                                <input
                                    type="date"
                                    className="form-control common_input"
                                    name="registration_date"
                                    value={formData.registration_date}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>Registration Valid Till</label>
                                <input
                                    type="date"
                                    className="form-control common_input"
                                    name="registration_vaild_till"
                                    value={formData.registration_vaild_till}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Ben. RBI Ref No.</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="ben_rbi_ref_no"
                                    value={formData.ben_rbi_ref_no}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Ben.  RBI Appr Date</label>
                                <input
                                    type="date"
                                    className="form-control common_input"
                                    name="ben_rbi_ref_date"
                                    value={formData.ben_rbi_ref_date}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>

                        </div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Ben. SEBI Reg No.</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="ben_sebi_reg_no"
                                    value={formData.ben_sebi_reg_no}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Ben. Task  DED Status </label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="ben_task_ded_status"
                                    value={formData.ben_task_ded_status}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>

                        </div>

                    </div>
                </div>
                {/* *************************************************Risk Tab End ***************************************************************/}

                {/* *************************************************Fatca Tab Start ***************************************************************/}
                <div className={`tab-pane1 ${activeTab === 'fatca' ? 'show active' : ''}`}>
                    <div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className=' common_width6'>TIN/GSTIN</label>
                                <input
                                    type="text"
                                    className="form-control  common_input"
                                    name="tin_gstin"
                                    value={formData.tin_gstin}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />

                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>TIN Issuing Country</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="tin_issuing_country"
                                    value={formData.tin_issuing_country}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />

                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Agency Name</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="agency_name"
                                    value={formData.agency_name}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Agency Person</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="Agency_person"
                                    value={formData.Agency_person}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>Designation</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width6'>Date Time Assesme</label>
                                <input
                                    type="date"
                                    className="form-control common_input"
                                    name="date_time_assesme"
                                    value={formData.date_time_assesme}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width5'>Place Assesment</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="place_assesment"
                                    value={formData.place_assesment}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                            <div className="col-12 col-md-4 common_flex">
                                <label className='common_width2'>Evidence Provided</label>
                                <input
                                    type="text"
                                    className="form-control common_input"
                                    name="evidence_provided"
                                    value={formData.evidence_provided}
                                    onChange={handleChange}
                                    disabled={addMode}
                                />
                            </div>
                        </div>




                    </div>
                </div>
                {/* *************************************************Fatca Tab End ***************************************************************/}
            </div>

        </div>

    );
};

export default Client_Master;
