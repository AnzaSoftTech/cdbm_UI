import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './client_link_slab.css'; // Custom CSS;
import Client_Slab_Attach from './client_slab_attach.js';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
// import { format, parseISO } from 'date-fns';
import PopupSearchClientName from './popupSearchClientName.js';
import axios from 'axios';
import { BASE_URL } from ".././constants";

const SlabForm = () => {
    const [showModalCliName, setShowModalCliName] = useState(false);
    const [showDelRangesPopup, setShowDelRangesPopup] = useState(false);
    const [noDataMessage, setNoDataMessage] = useState('');
    const [selectedRangetableRow, setSelectedRangeTableRow] = useState(null);
    const [header, setHeader] = useState({});
    const [segments, setSegments] = useState([]);
    const [activityCodes, setActivityCodes] = useState([]);
    const [exchangeDDL, setExchangeDDL] = useState([]);
    const [clientName, setClientName] = useState('');
    const [userId, setUserId] = useState(1);
    const [branchCd, setBranchCd] = useState('1');
    const [activeTab, setActiveTab] = useState('brok');
    const [clientCd, setClientCd] = useState('');
    const [segment, setSegment] = useState('');
    const [actCode, setActCode] = useState('');
    const [exchange, setExchange] = useState('');
    const [minBrokTrade, setMinBrokTrade] = useState('');
    const [minBrokSqup, setMinBrokSqup] = useState('');
    const [minBrokDel, setMinBrokDel] = useState('');
    const [norBrokTrade, setNorBrokTrade] = useState('N');
    const [scripBrokTrade, setScripBrokTrade] = useState('N');
    const [dayBrokTrade, setDayBrokTrade] = useState('N');
    const [phyDel, setPhyDel] = useState('N');
    const [dematDel, setDematDel] = useState('N');
    const [squpChecks, setSqupChecks] = useState('');
    const [servTaxExclu, setServTaxExclu] = useState('N');
    const [stampDutyExclu, setStampDutyExclu] = useState('N');
    const [transChargesExclu, setTransChargesExclu] = useState('N');
    const [sebiTurnoverExclu, setSebiTurnoverExclu] = useState('N');
    const [clearChargesExclu, setClearChargesExclu] = useState('N');
    const [otherChargesExclu, setOtherChargesExclu] = useState('N');
    const [rndOffBrok, setRndOffBrok] = useState('');
    const [rndOffLimit, setRndOffLimit] = useState('');
    const [chqReturnPen, setChqReturnPen] = useState('');
    const [lateDelPen, setLateDelPen] = useState('');
    const [delayedPayPen, setDelayedPayPen] = useState('');
    const [shortDelPen, setShortDelPen] = useState('');
    const [badDelPen, setBadDelPen] = useState('');
    const [comObjPen, setComObjPen] = useState('');
    const [netLmt, setNetLmt] = useState('');
    const [orderLmt, setOrderLmt] = useState('');
    const [grossLmt, setGrossLmt] = useState('');
    const [cliLinkTableData, setCliLinkTableData] = useState([]);
    const [addMode, setAddMode] = useState(true);
    const [emailDel, setEmailDel] = useState('N');
    const [mailDel, setMailDel] = useState('N');
    const [faxDel, setFaxDel] = useState('N');
    const [courierDel, setCourierDel] = useState('N');
    const [handDel, setHandDel] = useState('N');
    const [billY_N, setBillY_N] = useState('N');
    const [billContrWise, setBillContrWise] = useState('N');
    const [billScrWise, setBillScrWise] = useState('N');
    const [billTrans, setBillTrans] = useState('N');
    const [billNor, setBillNor] = useState('N');
    const [contrY_N, setContrY_N] = useState('N');
    const [contrNor, setContrNor] = useState('N');
    const [contrConsoli, setContrConsoli] = useState('N');
    const [contrWHConfig, setContrWHConfig] = useState('N');
    const [contrScrWise, setContrScrWise] = useState('N');
    const [contrPrint, setContrPrint] = useState('N');
    const [contrRateWise, setContrRateWise] = useState('N');
    const [contrTradeWise, setContrTradeWise] = useState('N');

    useEffect(() => {
        setUserId(1);
        setBranchCd('1');
    }, []);

    const handleSave = async () => {

        if (!clientCd) {
            alert('Please enter Client Code.');
            return;
        }
        if (!segment) {
            alert('Please select Segment.');
            return;
        }
        if (!actCode) {
            alert('Please select Activity.');
            return;
        }
        if (!exchange) {
            alert('Please select Exchange.');
            return;
        }

        const Masterdata = {
            clientCd,
            segment,
            actCode,
            exchange,
            norBrokTrade,
            scripBrokTrade,
            dayBrokTrade,
            minBrokTrade,
            minBrokSqup,
            minBrokDel,
            squpChecks,
            phyDel,
            dematDel,
            rndOffLimit,
            rndOffBrok,
            servTaxExclu,
            stampDutyExclu,
            transChargesExclu,
            sebiTurnoverExclu,
            clearChargesExclu,
            otherChargesExclu,
            chqReturnPen,
            lateDelPen,
            delayedPayPen,
            shortDelPen,
            badDelPen,
            comObjPen,
            orderLmt,
            grossLmt,
            netLmt,
            emailDel,
            mailDel,
            faxDel,
            courierDel,
            handDel,
            billY_N,
            billNor,
            billContrWise,
            billScrWise,
            billTrans,
            contrY_N,
            contrWHConfig,
            contrTradeWise,
            contrScrWise,
            contrRateWise,
            contrPrint,
            contrNor,
            contrConsoli,
            userId,
            branchCd
        };
        setHeader(Masterdata);
        console.log('Masterdata', Masterdata);
        const data = {
            header: Masterdata,
        };

        // alert(JSON.stringify(Masterdata));
        const isconfirmed = window.confirm('Are you sure you want to save this data?');
        if (!isconfirmed) {
            return;
        }
        axios.post(`${BASE_URL}/api/save_cli_link_slab`, data)
            .then(response => {
                if (response.data.message === 'This row already exists in the table!') {
                    alert(response.data.message);
                    return;
                } else {
                    alert('Client Link Slab Saved Successfully!');
                    // Reset form state after successful save
                    fetchData(clientCd);
                    clearAll();
                    // setAddMode(true);
                }
            })
            .catch(error => console.error('Error saving Client link slab:', error));
    };

    const clearAll = () => {
        setClientCd('');
        setClientName('');
        setSegment('');
        setActCode('');
        setExchange('');
        setMinBrokTrade('');
        setMinBrokSqup('');
        setMinBrokDel('');
        setNorBrokTrade('N');
        setScripBrokTrade('N');
        setDayBrokTrade('N');
        setPhyDel('N');
        setDematDel('N');
        setSqupChecks('');
        setServTaxExclu('N');
        setStampDutyExclu('N');
        setTransChargesExclu('N');
        setSebiTurnoverExclu('N');
        setClearChargesExclu('N');
        setOtherChargesExclu('N');
        setRndOffBrok('');
        setRndOffLimit('');
        setChqReturnPen('');
        setLateDelPen('');
        setDelayedPayPen('');
        setShortDelPen('');
        setBadDelPen('');
        setComObjPen('');
        setOrderLmt('');
        setNetLmt('');
        setGrossLmt('');
        setEmailDel('N');
        setMailDel('N');
        setFaxDel('N');
        setCourierDel('N');
        setHandDel('N');
        setBillTrans('N');
        setBillY_N('N');
        setBillContrWise('N');
        setBillScrWise('N');
        setBillNor('N');
        setContrY_N('N');
        setContrTradeWise('N');
        setContrNor('N');
        setContrPrint('N');
        setContrRateWise('N');
        setContrConsoli('N');
        setContrWHConfig('N');
        setContrScrWise('N');
    }

    const handleClear = () => {
        clearAll();
        setCliLinkTableData([]);
        setAddMode(true);
    }

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_segment_master`)
            .then(response => { setSegments(response.data) })
            .catch(error => console.error('Error fetching segments:', error));
    }, []);

    useEffect(() => {
        try {
            axios.get(`${BASE_URL}/api/exchange_ddl`).then(response => setExchangeDDL(response.data))
                .catch(error => console.error('Error fetching depos name:', error));
        } catch (error) {
            console.error('Error fetching depos name:', error);
        }
    }, []);


    const handleSegment = async (p_Segment) => {
        try {

            setSegment(p_Segment);

            if (p_Segment) {
                setActivityCodes([]);
                await axios.get(`${BASE_URL}/api/ddl_activity_master?p_segment_cd=` + p_Segment)
                    .then(response => setActivityCodes(response.data))
                    .catch(error => console.error('Error fetching activity:', error));
            }
            else {
                setActivityCodes([]);
            }

        }
        catch (error) {
            console.error("Error in Account Type Selection! ", error);
        }
    }

    const fetchfunc = async (code) => {
        try {
            await axios.get(`${BASE_URL}/api/get_client_name`, {
                params: {
                    p_client_cd: code,
                }
            }).then(
                res => {
                    if (res.data.length > 0) {
                        setClientName(res.data[0].name)
                    } else if (res.data.length === 0) {
                        // alert('No Client found for this Client Code.')
                        setClientName('');
                    }
                }
            );
        } catch (error) {
            console.error('Error searching client name:', error);
        }
    }

    const fetchData = async (cliCode) => {
        axios.get(`${BASE_URL}/api/get_client_link_slab/${cliCode}`).then(
            res => {
                if (res.data.length > 0) {
                    setCliLinkTableData(res.data)
                } else if (res.data.length === 0) {
                    // alert('No data available for this Client Code.');
                    setCliLinkTableData([]);
                }
            }
        );
    }

    const handleClientCd = async (clientCd) => {
        if (clientCd === '') {
            setClientCd('');
            setClientName('');
            clearAll();
            return;
        } else {
            setClientCd(clientCd);
            await fetchfunc(clientCd);
            await fetchData(clientCd);
        }
    };

    const handleRowClick = (row) => {
        console.log('row-----', row);
        setSelectedRangeTableRow(row);
        setClientCd(row.client_cd);
        setClientName(row.client_name);
        setSegment(row.segment);
        if (row.segment) {
            setActivityCodes([]);
            axios.get(`${BASE_URL}/api/ddl_activity_master?p_segment_cd=` + row.segment)
                .then(response => setActivityCodes(response.data))
                .catch(error => console.error('Error fetching activity:', error));
        }
        setActCode(row.cmp_cd);
        setExchange(row.exc_cd);
        setMinBrokTrade(row.min_brok_trans);
        setMinBrokSqup(row.min_brok_squp);
        setMinBrokDel(row.min_brok_del);
        setNorBrokTrade(row.br_normal);
        setScripBrokTrade(row.br_scrip);
        setDayBrokTrade(row.day_trader);
        setPhyDel(row.delivery_phy);
        setDematDel(row.delivery_dmt);
        setSqupChecks(row.osdsb);
        setServTaxExclu(row.service_tax_incl);
        setStampDutyExclu(row.stamp_duty_incl);
        setTransChargesExclu(row.trans_chrg_incl);
        setSebiTurnoverExclu(row.sebi_turn_over);
        setClearChargesExclu(row.clearing_chg);
        setOtherChargesExclu(row.other_chrg_incl);
        setRndOffBrok(row.rnd_off_brokerage);
        setRndOffLimit(row.rnd_off_lmt);
        // setChqReturnPen(row.);
        setLateDelPen(row.late_delivery_rate);
        // setDelayedPayPen(row.);
        setShortDelPen(row.short_del);
        setBadDelPen(row.bad_del);
        setComObjPen(row.comp_obj);
        setOrderLmt(row.ord_lmt);
        setNetLmt(row.net_exposure);
        setGrossLmt(row.trd_lmt);
        setEmailDel(row.send_mode_email);
        setMailDel(row.send_mode_mail);
        setFaxDel(row.send_mode_fax);
        setCourierDel(row.send_mode_courier);
        setHandDel(row.send_mode_hand);
        setBillY_N(row.print_bill);
        setBillNor(row.norm_bill);
        setBillTrans(row.bill_trans_wise);
        setBillScrWise(row.bill_scrip_wise);
        setBillContrWise(row.bill_contract_wise);
        setContrWHConfig(row.wh_confirm);
        setContrY_N(row.print_contract);
        setContrNor(row.nor_contract);
        setContrConsoli(row.consoli_cont);
        setContrPrint(row.print_sp_contract);
        setContrRateWise(row.sp_rate_wise);
        setContrTradeWise(row.sp_trade_wise);
        setContrScrWise(row.contract_scrip_wise);
    };


    // const populateFunction = async () => {

    //     let res = await axios.get(`${BASE_URL}/search_cash_bill_slab/${slabId}`);
    //     // console.log('upar wala main slab',res.data);
    //     if (slabId) {
    //         try {
    //             if (res.data.length > 0) {
    //                 setSlabName(res.data[0].slab_name);
    //                 setAlisName(res.data[0].alias);
    //                 if (res.data[0].date_app) {
    //                     const dateString = res.data[0].date_app;
    //                     const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
    //                     setDateApplicable(formattedDate);
    //                 }
    //                 if (res.data[0].date_to) {
    //                     const dateString = res.data[0].date_to;
    //                     const formattedDate = format(parseISO(dateString), 'yyyy-MM-dd');
    //                     setToDate(formattedDate);
    //                 }
    //             } else if (res.data.length === 0) {
    //                 alert('Slab Not Found.')
    //                 setSlabName('');
    //                 setAlisName('');
    //                 setDateApplicable('');
    //                 setToDate('');
    //                 return;
    //             }
    //         } catch (error) {
    //             alert(error);
    //         }
    //     }


    // }

    // const fetchData = async () => {
    //     if (slabId) {
    //         try {
    //             let response;
    //             switch (activeTab) {
    //                 case 'normal':
    //                     populateFunction();
    //                     response = await axios.get(`${BASE_URL}/get_cash_bill_normal_slab/${slabId}`);
    //                     setNormalTableData(response.data);
    //                     if (response.data.length === 0) {
    //                         setNoDataMessage('No data available for this Slab ID in the Normal tab.');
    //                     } else {
    //                         setNoDataMessage('');

    //                     }
    //                     break;


    //                 case 'scripwise':
    //                     populateFunction();
    //                     response = await axios.get(`${BASE_URL}/cash_bill_scrip_slab/${slabId}`);
    //                     setScripTableData(response.data);
    //                     if (response.data.length === 0) {
    //                         setNoDataMessage('No data available for this Slab ID in the Scrip tab.');
    //                     } else {
    //                         setNoDataMessage('');
    //                     }
    //                     break;

    //                 // case 'delivery':
    //                 //     response = await axios.get(`${BASE_URL}/cash_bill_delivery_slab/${slabId}`);
    //                 //     setDeliveryTableData(response.data);
    //                 //     if (response.data.length === 0) {
    //                 //         setNoDataMessage('No data available for this Slab ID in the Delivery tab.');
    //                 //     } else {
    //                 //         setNoDataMessage('');
    //                 //     }
    //                 //     break;

    //                 default:
    //                     console.error('Unknown tab');
    //             }

    //         } catch (error) {
    //             if (error.response && error.response.status === 404) {
    //                 setNormalTableData([]);
    //                 // setDeliveryTableData([]);
    //                 setScripTableData([]);
    //                 alert('No record found for this Slab Id in the table.');
    //             } else {
    //                 console.error('Error fetching data:', error);
    //                 alert('Error fetching data. Please try again.');
    //             }
    //         }
    //     }
    // };

    // useEffect(() => {
    //     fetchData();
    // }, [slabId, activeTab]);

    // useEffect(() => {
    //     axios.get(`${BASE_URL}/rangeNamesNormal`).then(res => setNorRangeNames(res.data));
    //     axios.get(`${BASE_URL}/rangeNamesDel`).then(res => setDelRangeNames(res.data));

    // }, []);


    // const handleBrokDetChange = (e) => {
    //     if (e && e.target) {
    //         const { name, value, type, checked } = e.target;
    //         const finalValue = type === 'checkbox' ? checked : value;
    //         setNormalData((prevData) => ({
    //             ...prevData,
    //             [name]: value,
    //         }));
    //         setNormalData((prevData) => ({
    //             ...prevData,
    //             [name]: finalValue,
    //         }));
    //     } else {
    //         console.error('Event is undefined or does not have target Normal tab');
    //     }
    // };

    const handleRadioChange = (e) => {
        const { value } = e.target;
        setRndOffLimit(value);
    };
    const handleRadioChange1 = (e) => {
        const { value } = e.target;
        setSqupChecks(value);
    };

    const handleSearchClientName = () => {
        setShowModalCliName(true); // Opens the modal
    };

    const handleCliRowSelect = (client_cd, name) => {
        setClientCd(client_cd);
        setClientName(name);
        fetchData(client_cd);
        setShowModalCliName(false);
    }

    const handleAddClick = () => {
        setAddMode(false);
        // setEditMode(false);
    }

    const handleRowDelRangeSelect = () => {
        setShowDelRangesPopup(false);
    };


    return (
        <div className="container mt-2">

            <div className="card main-box">
                <div className="card-header text-center color_header">
                    <h4 className='slabheader'>Client Link Slab</h4>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <div className="row mx-auto mb-3">
                            <div className="col-md-8 p-0 mb-2 d-flex justify-content-start">
                                <div className='d-flex align-items-center'>
                                    <label className='width_slab_2 ' htmlFor='slabId'>Client Cd:</label>
                                    <input
                                        type="text"
                                        placeholder="Client Cd"
                                        value={clientCd}
                                        className='form-control  me-2 width_slab_input'
                                        onChange={(e) => handleClientCd(e.target.value)}
                                        id='slabId'
                                        disabled={addMode}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Client Name"
                                        value={clientName}
                                        className='form-control width_slab_input_large'
                                        onChange={(e) => setClientName(e.target.value)}
                                        readOnly
                                        disabled={addMode}
                                    />
                                    <button className='btn ms-2 btn-sm btn-primary' disabled={addMode}
                                        onClick={() => handleSearchClientName()}>Search
                                    </button>
                                    <Modal show={showModalCliName} onHide={() => setShowModalCliName(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Search Client Name</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <PopupSearchClientName
                                                onRowSelect={handleCliRowSelect}
                                            />
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => setShowModalCliName(false)}>
                                                Close
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>

                            </div>
                            <div className="col-md-4 mb-2 d-flex align-items-center">
                                <label className='form-label me-2'>Segment:</label>
                                <select
                                    className="form-select"
                                    // style={{ marginLeft: '0rem' }}
                                    value={segment}
                                    onChange={(e) => handleSegment(e.target.value)}
                                    disabled={addMode}
                                >
                                    <option value="">Select Segment</option>
                                    {segments.map(Seg => (
                                        <option key={Seg.seg_code} value={Seg.seg_code}>{Seg.seg_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='row mt-2'>
                                <div className="col-md-3 mb-2 d-flex align-items-center">
                                    <label className='form-label me-2'>Activity:</label>
                                    <select
                                        className="form-select"
                                        // style={{ marginLeft: '0rem' }}
                                        value={actCode}
                                        onChange={(e) => setActCode(e.target.value)}
                                        disabled={addMode}
                                    >
                                        <option value="">Select Activity</option>
                                        {activityCodes.map(Act_Code => (
                                            <option key={Act_Code.activity_cd} value={Act_Code.activity_cd}>{Act_Code.act_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3 mb-2 d-flex align-items-center">
                                    <label className='form-label me-2'>Exchange:</label>
                                    <select
                                        className="form-select"
                                        // style={{ marginLeft: '0rem' }}
                                        value={exchange}
                                        onChange={(e) => setExchange(e.target.value)}
                                        disabled={addMode}
                                    >
                                        <option value="">Select Exchange</option>
                                        {exchangeDDL.map((res) =>
                                            (<option key={res.mii_id} value={res.mii_id}>{res.mii_short_name}</option>)
                                        )}
                                    </select>
                                </div>
                                <div className="col-md-6 ps-4 mb-2 d-flex justify-content-end align-items-end">
                                    <Button variant="primary" className="btn_slab me-2" onClick={handleAddClick} >
                                        Add
                                    </Button>
                                    <Button variant="success" className="btn_slab me-2"
                                        onClick={handleSave} disabled={addMode}>
                                        Save
                                    </Button>
                                    <Button variant="secondary" className="btn_slab me-2"
                                        onClick={handleClear} disabled={addMode}>
                                        Clear
                                    </Button>
                                    <Button variant="primary" className="btn_slab me-2"
                                        onClick={() => {
                                            if (!clientCd) {
                                                alert('Please fill Client Code.');
                                                return;
                                            }
                                            if (!segment) {
                                                alert('Please select Segment.');
                                                return;
                                            }
                                            if (!actCode) {
                                                alert('Please select Activity.');
                                                return;
                                            }
                                            if (!exchange) {
                                                alert('Please select Exchange.');
                                                return;
                                            }
                                            setShowDelRangesPopup(true)
                                        }} disabled={addMode}>
                                        Slab
                                    </Button>
                                    {showDelRangesPopup && <Client_Slab_Attach onRowSelect={handleRowDelRangeSelect} branch_cd={branchCd}
                                        cliCd={clientCd} cliName={clientName} seg={segment} exc={exchange} act={actCode} />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Tabs
                        id="controlled-tab-example"
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className=" nav-tabs_slab"
                    >
                        <Tab eventKey="brok" title={<span className="nav-link_slab">Brokerage Details</span>}>
                            <div className="tab-content_slab d-flex flex-wrap">
                                <div className='inputflex mb-4 mt-2  ps-4' style={{ width: '30%' }}>
                                    <div className="row " >
                                        <div className="inputOnText ">
                                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Trading</label>
                                            <div className="form-control size_address1  me-3">
                                                <div className="row mb-1">
                                                    <div className="col-6 col-md-6  py-2 d-flex-col align-items-center">
                                                        <div class="form-check d-flex justify-content-start mb-2">
                                                            <input
                                                                disabled={addMode}
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                value="Y"
                                                                checked={norBrokTrade === 'Y'}
                                                                onChange={(e) => setNorBrokTrade(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckDefault">
                                                                Normal
                                                            </label>
                                                        </div>
                                                        <div class="form-check d-flex justify-content-start ">
                                                            <input
                                                                class="form-check-input me-2"
                                                                disabled={addMode}
                                                                type="checkbox"
                                                                value="Y"
                                                                checked={scripBrokTrade === 'Y'}
                                                                onChange={(e) => setScripBrokTrade(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckChecked" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Scrip Wise
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-5 mt-2 d-flex-col align-items-center ps-2">
                                                        <label className='form-label mb-1'>Minimum</label>
                                                        <input type='number'
                                                            disabled={addMode}
                                                            value={minBrokTrade}
                                                            onChange={(e) => setMinBrokTrade(e.target.value)}
                                                            className='form-control' style={{ textAlign: 'right' }}></input>
                                                    </div>
                                                    <div className='row border-separation ms-0 mt-2 ps-2.5 pt-2' style={{ width: '100%' }}>
                                                        <div class="form-check d-flex justify-content-start ">
                                                            <input
                                                                class="form-check-input me-2"
                                                                disabled={addMode}
                                                                type="checkbox"
                                                                value="Y"
                                                                checked={dayBrokTrade === 'Y'}
                                                                onChange={(e) => setDayBrokTrade(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckChecked" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Day Trader
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='inputflex mb-4 mt-2  ps-4' style={{ width: '30%' }}>
                                    <div className="row " >
                                        <div className="inputOnText ">
                                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Square Up</label>
                                            <div className="form-control size_address1  me-3">
                                                <div className="row mb-1">
                                                    <div className="col-6 col-md-6 py-2 d-flex-col align-items-center">
                                                        <div class="form-check d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                disabled={addMode}
                                                                type="radio"
                                                                name='squpR'
                                                                value="D"
                                                                checked={squpChecks === 'D'}
                                                                onChange={handleRadioChange1}
                                                                id="flexRadioDefault1" />
                                                            <label class="form-check-label" for="flexRadioDefault1">
                                                                Daily
                                                            </label>
                                                        </div>
                                                        <div class="form-check mt-2 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                disabled={addMode}
                                                                type="radio"
                                                                name='squpR'
                                                                value="S"
                                                                checked={squpChecks === 'S'}
                                                                onChange={handleRadioChange1}
                                                                id="flexRadioDefault2" />
                                                            <label class="form-check-label" for="flexRadioDefault2">
                                                                Settlement
                                                            </label>
                                                        </div>
                                                        <div class="form-check mt-2 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                disabled={addMode}
                                                                type="radio"
                                                                name='squpR'
                                                                value="B"
                                                                checked={squpChecks === 'B'}
                                                                onChange={handleRadioChange1}
                                                                id="flexRadioDefault3" />
                                                            <label class="form-check-label" for="flexRadioDefault3">
                                                                Both Side
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-5 mt-2 d-flex-col align-items-center ps-2">
                                                        <label className='form-label mb-1'>Minimum</label>
                                                        <input type='number'
                                                            value={minBrokSqup}
                                                            disabled={addMode}
                                                            onChange={(e) => setMinBrokSqup(e.target.value)}
                                                            className='form-control ' style={{ textAlign: 'right' }}></input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='inputflex mb-4 mt-2  ps-4' style={{ width: '30%' }}>
                                    <div className="row " >
                                        <div className="inputOnText ">
                                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Delivery</label>
                                            <div className="form-control size_address1  me-3">
                                                <div className="row mb-1">
                                                    <div className="col-6 col-md-6  py-2 d-flex-col align-items-center">
                                                        <div class="form-check mb-2 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={phyDel === 'Y'}
                                                                onChange={(e) => setPhyDel(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckDefault">
                                                                Physical
                                                            </label>
                                                        </div>
                                                        <div class="form-check d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={dematDel === 'Y'}
                                                                onChange={(e) => setDematDel(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckChecked" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Demat
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-5 mt-2 d-flex-col align-items-center ps-2">
                                                        <label className='form-label mb-1 '>Minimum</label>
                                                        <input type='number'
                                                            value={minBrokDel}
                                                            disabled={addMode}
                                                            onChange={(e) => setMinBrokDel(e.target.value)}
                                                            className='form-control ' style={{ textAlign: 'right' }}></input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='inputflex mb-4 mt-2  ps-4' style={{ width: '30%' }}>
                                    <div className="row " >
                                        <div className="inputOnText ">
                                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Exclusive</label>
                                            <div className="form-control size_address1  me-3">
                                                <div className="row mb-1">
                                                    <div className="col-6 col-md-12  py-2 d-flex-col align-items-center">
                                                        <div class="form-check d-flex justify-content-start mb-1">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={servTaxExclu === 'Y'}
                                                                onChange={(e) => setServTaxExclu(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckDefault">
                                                                Service Tax
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={stampDutyExclu === 'Y'}
                                                                onChange={(e) => setStampDutyExclu(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Stamp Duty
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={transChargesExclu === 'Y'}
                                                                onChange={(e) => setTransChargesExclu(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Transaction Charges
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={sebiTurnoverExclu === 'Y'}
                                                                onChange={(e) => setSebiTurnoverExclu(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Sebi Tum Over
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={clearChargesExclu === 'Y'}
                                                                onChange={(e) => setClearChargesExclu(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Clearing Charges
                                                            </label>
                                                        </div>
                                                        <div class="form-check d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={otherChargesExclu === 'Y'}
                                                                onChange={(e) => setOtherChargesExclu(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Other Charges
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='inputflex mb-4 mt-2  ps-4' style={{ width: '30%' }}>
                                    <div className="row " >
                                        <div className="inputOnText ">
                                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Round Off</label>
                                            <div className="form-control size_address1  me-3">
                                                <div className="row mb-1">
                                                    <div className="col-6 col-md-12 d-flex mb-2">
                                                        <label className='form-label  my-2'>Brokerage:</label>
                                                        <input
                                                            type='number'
                                                            placeholder='Brok'
                                                            disabled={addMode}
                                                            className='form-control  ms-5' style={{ width: '40%', textAlign: 'right' }}
                                                            value={rndOffBrok}
                                                            onChange={(e) => setRndOffBrok(e.target.value)} ></input>
                                                    </div>
                                                    <div className="col-6 col-md-12 py-2 d-flex-col align-items-center">
                                                        <div className="form-check d-flex justify-content-start">
                                                            <input
                                                                className="form-check-input me-2"
                                                                type="radio"
                                                                disabled={addMode}
                                                                value="H"
                                                                name="rndOff"  // Same name for all radio buttons in the group
                                                                checked={rndOffLimit === 'H'}
                                                                onChange={handleRadioChange}
                                                                id="flexRadioDef1"
                                                            />
                                                            <label className="form-check-label" htmlFor="flexRadioDef1">
                                                                Higher Limit
                                                            </label>
                                                        </div>

                                                        {/* Radio button for "Near Limit" */}
                                                        <div className="form-check mt-3 d-flex justify-content-start">
                                                            <input
                                                                className="form-check-input me-2"
                                                                type="radio"
                                                                disabled={addMode}
                                                                value="N"
                                                                name="rndOff"  // Same name for all radio buttons in the group
                                                                checked={rndOffLimit === 'N'}
                                                                onChange={handleRadioChange}
                                                                id="flexRadioDef2"
                                                            />
                                                            <label className="form-check-label" htmlFor="flexRadioDef2">
                                                                Near Limit
                                                            </label>
                                                        </div>

                                                        {/* Radio button for "Lower Limit" */}
                                                        <div className="form-check mt-3 d-flex justify-content-start">
                                                            <input
                                                                className="form-check-input me-2"
                                                                type="radio"
                                                                disabled={addMode}
                                                                value="L"
                                                                name="rndOff"  // Same name for all radio buttons in the group
                                                                checked={rndOffLimit === 'L'}
                                                                onChange={handleRadioChange}
                                                                id="flexRadioDef3"
                                                            />
                                                            <label className="form-check-label" htmlFor="flexRadioDef3">
                                                                Lower Limit
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='inputflex mb-4 mt-2  ps-4' style={{ width: '37%' }}>
                                    <div className="row " >
                                        <div className="inputOnText ">
                                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Penulties</label>
                                            <div className="form-control size_address2  me-3">
                                                <div className="row mb-1">
                                                    <div className="col-6  col-md-12 d-flex mb-2 justify-content-between">
                                                        <label className='form-label  my-1'>Chq Return:</label>
                                                        <input
                                                            type='number'
                                                            disabled={addMode}
                                                            value={chqReturnPen}
                                                            onChange={(e) => setChqReturnPen(e.target.value)}
                                                            className='form-control'
                                                            style={{ width: '55%', textAlign: 'right', height: '2rem' }}></input>
                                                    </div>
                                                    <div className="col-6  col-md-12 d-flex mb-2 justify-content-between">
                                                        <label className='form-label  my-1'>Late Delivery:</label>
                                                        <input
                                                            type='number'
                                                            disabled={addMode}
                                                            value={lateDelPen}
                                                            onChange={(e) => setLateDelPen(e.target.value)}
                                                            className='form-control' style={{ width: '30%', textAlign: 'right', height: '2rem' }}></input>
                                                    </div>
                                                    <div className="col-6  col-md-12 d-flex mb-2 justify-content-between">
                                                        <label className='form-label my-1'>Delayed Payment:</label>
                                                        <input
                                                            type='number'
                                                            disabled={addMode}
                                                            value={delayedPayPen}
                                                            onChange={(e) => setDelayedPayPen(e.target.value)}
                                                            className='form-control' style={{ width: '30%', textAlign: 'right', height: '2rem' }}></input>
                                                    </div>
                                                    <div className="col-6  col-md-12 d-flex mb-2 justify-content-between">
                                                        <label className='form-label  my-1'>Short Delivery:</label>
                                                        <input
                                                            type='number'
                                                            disabled={addMode}
                                                            value={shortDelPen}
                                                            onChange={(e) => setShortDelPen(e.target.value)}
                                                            className='form-control' style={{ width: '30%', textAlign: 'right', height: '2rem' }}></input>
                                                    </div>
                                                    <div className="col-6  col-md-12 d-flex mb-2 justify-content-between">
                                                        <label className='form-label  my-1'>Bad Delivery:</label>
                                                        <input
                                                            type='number'
                                                            disabled={addMode}
                                                            value={badDelPen}
                                                            onChange={(e) => setBadDelPen(e.target.value)}
                                                            className='form-control' style={{ width: '30%', textAlign: 'right', height: '2rem' }}></input>
                                                    </div>
                                                    <div className="col-6  col-md-12 d-flex justify-content-between mb-2">
                                                        <label className='form-label  my-1'>Company Objection:</label>
                                                        <input
                                                            type='number'
                                                            disabled={addMode}
                                                            value={comObjPen}
                                                            onChange={(e) => setComObjPen(e.target.value)}
                                                            className='form-control' style={{ width: '30%', textAlign: 'right', height: '2rem' }}></input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-1 d-flex" style={{ width: '100%' }}>
                                    <div className="normal-table-container">
                                        <table className="normal-table" style={{ overflow: 'auto' }}>
                                            <thead className='theadNormal'>
                                                <tr className='tr_normal'>
                                                    <th className='th_normal p-inline' >Client Cd</th>
                                                    <th className='th_normal p-inline' >Client Name</th>
                                                    <th className='th_normal p-inline'  >Seg</th>
                                                    <th className='th_normal p-inline'  >Act</th>
                                                    <th className='th_normal p-inline'  >Exc</th>
                                                    <th className='th_normal p-inline'  >Trade Nor</th>
                                                    <th className='th_normal p-inline'  >Trade Scrip</th>
                                                    <th className='th_normal p-inline'  >Day Trader</th>
                                                    <th className='th_normal p-inline'  >Squp Type</th>
                                                    <th className='th_normal p-inline'  >Min Trade</th>
                                                    <th className='th_normal p-inline'  >Min Squp</th>
                                                    <th className='th_normal p-inline'  >Min Del</th>
                                                    <th className='th_normal p-inline'  >Del Phy</th>
                                                    <th className='th_normal p-inline'  >Del Dmt</th>
                                                    <th className='th_normal p-inline'  >Serv Tax</th>
                                                    <th className='th_normal p-inline'  >Stamp Duty</th>
                                                    <th className='th_normal p-inline'  >Trans Chrg</th>
                                                    <th className='th_normal p-inline'  >Sebi TuOv</th>
                                                    <th className='th_normal p-inline'  >CLear Chrg</th>
                                                    <th className='th_normal p-inline'  >Other Chrg</th>
                                                    <th className='th_normal p-inline'  >Rnd off Brok</th>
                                                    <th className='th_normal p-inline'  >Rnd off Lmt</th>
                                                    <th className='th_normal p-inline'  >Late Del</th>
                                                    <th className='th_normal p-inline'  >Short Del</th>
                                                    <th className='th_normal p-inline'  >Bad Del</th>
                                                    <th className='th_normal p-inline' >Com Obj</th>
                                                    <th className='th_normal p-inline' >Order Lmt</th>
                                                    <th className='th_normal p-inline' >Gross Lmt</th>
                                                    <th className='th_normal p-inline' >Net Lmt</th>
                                                    <th className='th_normal p-inline' >Email</th>
                                                    <th className='th_normal p-inline' >Mail</th>
                                                    <th className='th_normal p-inline' >Fax</th>
                                                    <th className='th_normal p-inline' >Courier</th>
                                                    <th className='th_normal p-inline' >Hand</th>
                                                    <th className='th_normal p-inline' >Bill (Y/N)</th>
                                                    <th className='th_normal p-inline' >Nor Bill</th>
                                                    <th className='th_normal p-inline' >Trans Bill</th>
                                                    <th className='th_normal p-inline' >Scrip Wise Bill</th>
                                                    <th className='th_normal p-inline' >Contr Wise Bill</th>
                                                    <th className='th_normal p-inline' >Contr (Y/N)</th>
                                                    <th className='th_normal p-inline' >Nor Contr</th>
                                                    <th className='th_normal p-inline' >Consolidated</th>
                                                    <th className='th_normal p-inline' >Print Sp Contr</th>
                                                    <th className='th_normal p-inline' >WH Config</th>
                                                    <th className='th_normal p-inline' >Contr Scrip Wise</th>
                                                    <th className='th_normal p-inline' >Trade Wise</th>
                                                    <th className='th_normal p-inline' >Rate Wise</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cliLinkTableData.map((row, index) => (
                                                    <tr key={index} className={
                                                        `tr_normal ${selectedRangetableRow === row
                                                            ? 'selectedRangetablerowcolor' : ''}`}
                                                        onClick={() => handleRowClick(row)}
                                                    >
                                                        <td className='td_normal p-inline' >{row.client_cd}</td>
                                                        <td className='td_normal p-inline' >{row.client_name}</td>
                                                        <td className='td_normal p-inline'  >{row.segment}</td>
                                                        <td className='td_normal p-inline'  >{row.cmp_cd}</td>
                                                        <td className='td_normal p-inline'  >{row.exc_cd}</td>
                                                        <td className='td_normal p-inline'  >{row.br_normal}</td>
                                                        <td className='td_normal p-inline'  >{row.br_scrip}</td>
                                                        <td className='td_normal p-inline'  >{row.day_trader}</td>
                                                        <td className='td_normal p-inline'  >{row.osdsb}</td>
                                                        <td className='td_normal p-inline'  >{row.min_brok_trans}</td>
                                                        <td className='td_normal p-inline'  >{row.min_brok_squp}</td>
                                                        <td className='td_normal p-inline'  >{row.min_brok_del}</td>
                                                        <td className='td_normal p-inline'  >{row.delivery_phy}</td>
                                                        <td className='td_normal p-inline'  >{row.delivery_dmt}</td>
                                                        <td className='td_normal p-inline'  >{row.service_tax_incl}</td>
                                                        <td className='td_normal p-inline'  >{row.stamp_duty_incl}</td>
                                                        <td className='td_normal p-inline'  >{row.trans_chrg_incl}</td>
                                                        <td className='td_normal p-inline'  >{row.sebi_turn_over}</td>
                                                        <td className='td_normal p-inline'  >{row.clearing_chg}</td>
                                                        <td className='td_normal p-inline'  >{row.other_chrg_incl}</td>
                                                        <td className='td_normal p-inline'  >{row.rnd_off_brokerage}</td>
                                                        <td className='td_normal p-inline'  >{row.rnd_off_lmt}</td>
                                                        <td className='td_normal p-inline'  >{row.late_delivery_rate}</td>
                                                        <td className='td_normal p-inline'  >{row.short_del}</td>
                                                        <td className='td_normal p-inline'  >{row.bad_del}</td>
                                                        <td className='td_normal p-inline'  >{row.comp_obj}</td>
                                                        <td className='td_normal p-inline'  >{row.ord_lmt}</td>
                                                        <td className='td_normal p-inline'  >{row.trd_lmt}</td>
                                                        <td className='td_normal p-inline'  >{row.net_exposure}</td>
                                                        <td className='td_normal p-inline'  >{row.send_mode_email}</td>
                                                        <td className='td_normal p-inline'  >{row.send_mode_mail}</td>
                                                        <td className='td_normal p-inline'  >{row.send_mode_fax}</td>
                                                        <td className='td_normal p-inline'  >{row.send_mode_courier}</td>
                                                        <td className='td_normal p-inline'  >{row.send_mode_hand}</td>
                                                        <td className='td_normal p-inline'  >{row.print_bill}</td>
                                                        <td className='td_normal p-inline'  >{row.norm_bill}</td>
                                                        <td className='td_normal p-inline'  >{row.bill_trans_wise}</td>
                                                        <td className='td_normal p-inline'  >{row.bill_scrip_wise}</td>
                                                        <td className='td_normal p-inline'  >{row.bill_contract_wise}</td>
                                                        <td className='td_normal p-inline'  >{row.print_contract}</td>
                                                        <td className='td_normal p-inline'  >{row.nor_contract}</td>
                                                        <td className='td_normal p-inline'  >{row.consoli_cont}</td>
                                                        <td className='td_normal p-inline'  >{row.print_sp_contract}</td>
                                                        <td className='td_normal p-inline'  >{row.wh_confirm}</td>
                                                        <td className='td_normal p-inline'  >{row.contract_scrip_wise}</td>
                                                        <td className='td_normal p-inline'  >{row.sp_trade_wise}</td>
                                                        <td className='td_normal p-inline'  >{row.sp_rate_wise}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {noDataMessage && <p>{noDataMessage}</p>}
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="reporting" title={<span className="nav-link_slab">Reporting Details</span>}>
                            <div className="tab-content_slab d-flex flex-wrap">
                                <div className='inputflex mb-4 mt-2  ps-4' style={{ width: '30%' }}>
                                    <div className="row " >
                                        <div className="inputOnText ">
                                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Contract Parameters</label>
                                            <div className="form-control size_address1  me-3">
                                                <div className="row mb-1">
                                                    <div className="col-6 col-md-12  py-2 d-flex-col align-items-center">
                                                        <div class="form-check mb-1 d-flex justify-content-start ">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={contrY_N === 'Y'}
                                                                onChange={(e) => setContrY_N(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckDefault">
                                                                Contract (Y/N)
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={contrNor === 'Y'}
                                                                onChange={(e) => setContrNor(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Normal Contract
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={contrConsoli === 'Y'}
                                                                onChange={(e) => setContrConsoli(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Consolidated
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={contrWHConfig === 'Y'}
                                                                onChange={(e) => setContrWHConfig(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                WH Configuration
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={contrScrWise === 'Y'}
                                                                onChange={(e) => setContrScrWise(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Contract Scrip Wise
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={contrPrint === 'Y'}
                                                                onChange={(e) => setContrPrint(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Print Special Contract
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={contrRateWise === 'Y'}
                                                                onChange={(e) => setContrRateWise(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Rate Wise
                                                            </label>
                                                        </div>
                                                        <div class="form-check d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={contrTradeWise === 'Y'}
                                                                onChange={(e) => setContrTradeWise(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Trade Wise
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='inputflex mb-4 mt-2  ps-4' style={{ width: '30%' }}>
                                    <div className="row " >
                                        <div className="inputOnText ">
                                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Bill Parameters</label>
                                            <div className="form-control size_address1  me-3">
                                                <div className="row mb-1">
                                                    <div className="col-6 col-md-12  py-2 d-flex-col align-items-center">
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={billY_N === 'Y'}
                                                                onChange={(e) => setBillY_N(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckDefault">
                                                                Bill (Y/N)
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={billNor === 'Y'}
                                                                onChange={(e) => setBillNor(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Normal Bill
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={billContrWise === 'Y'}
                                                                onChange={(e) => setBillContrWise(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Bill Contract Wise
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={billTrans === 'Y'}
                                                                onChange={(e) => setBillTrans(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Transaction
                                                            </label>
                                                        </div>
                                                        <div class="form-check d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={billScrWise === 'Y'}
                                                                onChange={(e) => setBillScrWise(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Bill Scrip Wise
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*   <div className='inputflex mb-4 mt-2  ps-4' style={{ width: '30%' }}>
                                    <div className="row " >
                                        <div className="inputOnText ">
                                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Avg. Price Contract</label>
                                            <div className="form-control size_address1  me-3">
                                                <div className="row mb-1">
                                                    <div className="col-6 col-md-12  py-2 d-flex-col align-items-center">
                                                        <div class="form-check mb-1">
                                                            <input
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={clearChargesExclu === 'Y'}
                                                                onChange={handleCheck10}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Normal
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1">
                                                            <input
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={otherChargesExclu === 'Y'}
                                                                onChange={handleCheck11}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Single Scrip
                                                            </label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={otherChargesExclu === 'Y'}
                                                                onChange={handleCheck11}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Multiple Scrip
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>*/}
                                {/* <div className='inputflex mb-4 mt-2  ps-4' style={{ width: '30%' }}>
                                    <div className="row " >
                                        <div className="inputOnText ">
                                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Delivery At</label>
                                            <div className="form-control size_address1  me-3">
                                                <div className="row mb-1">
                                                    <div className="col-6 col-md-6 py-2 d-flex-col align-items-center">
                                                        <div class="form-check">
                                                            <input
                                                                class="form-check-input"
                                                                disabled={addMode}
                                                                type="radio"
                                                                name='delAddr'
                                                                value="D"
                                                                checked={squpChecks === 'D'}
                                                                onChange={handleRadioChange1}
                                                                id="flexRadioDefault1" />
                                                            <label class="form-check-label" for="flexRadioDefault1">
                                                                Address 1
                                                            </label>
                                                        </div>
                                                        <div class="form-check mt-2">
                                                            <input
                                                                class="form-check-input"
                                                                disabled={addMode}
                                                                type="radio"
                                                                name='delAddr'
                                                                value="S"
                                                                checked={squpChecks === 'S'}
                                                                onChange={handleRadioChange1}
                                                                id="flexRadioDefault2" />
                                                            <label class="form-check-label" for="flexRadioDefault2">
                                                                Address 2
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <div className='inputflex mb-4 mt-2  ps-4' style={{ width: '30%' }}>
                                    <div className="row " >
                                        <div className="inputOnText ">
                                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Delivery Mode</label>
                                            <div className="form-control size_address1  me-3">
                                                <div className="row mb-1">
                                                    <div className="col-6 col-md-12  py-2 d-flex-col align-items-center">
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={emailDel === 'Y'}
                                                                onChange={(e) => setEmailDel(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckDefault">
                                                                Email
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={mailDel === 'Y'}
                                                                onChange={(e) => setMailDel(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Mail
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={faxDel === 'Y'}
                                                                onChange={(e) => setFaxDel(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Fax
                                                            </label>
                                                        </div>
                                                        <div class="form-check mb-1 d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={courierDel === 'Y'}
                                                                onChange={(e) => setCourierDel(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Courier
                                                            </label>
                                                        </div>
                                                        <div class="form-check d-flex justify-content-start">
                                                            <input
                                                                class="form-check-input me-2"
                                                                type="checkbox"
                                                                disabled={addMode}
                                                                value="Y"
                                                                checked={handDel === 'Y'}
                                                                onChange={(e) => setHandDel(e.target.checked ? 'Y' : 'N')}
                                                                id="flexCheckDefault" />
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Hand
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="other" title={<span className="nav-link_slab">Other Parameters</span>}>
                            <div className="tab-content_slab d-flex flex-wrap">
                                <div className='inputflex mb-4  mt-2  ps-0' style={{ width: '100%' }}>
                                    <div className="row " >
                                        <div className="inputOnText ">
                                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Limits</label>
                                            <div className="form-control size_address3  me-3">
                                                <div className="row mb-1">
                                                    <div className="col-4  col-md-4 d-flex mb-2 justify-content-evenly">
                                                        <label className='form-label  my-2'>Order Limit:</label>
                                                        <input
                                                            type='number'
                                                            disabled={addMode}
                                                            value={orderLmt}
                                                            onChange={(e) => setOrderLmt(e.target.value)}
                                                            placeholder='Order Limit'
                                                            className='form-control' style={{ width: '60%', textAlign: 'right' }}></input>
                                                    </div>
                                                    <div className="col-4  col-md-4 d-flex mb-2 justify-content-evenly">
                                                        <label className='form-label  my-2'>Gross Limit:</label>
                                                        <input
                                                            type='number'
                                                            disabled={addMode}
                                                            value={grossLmt}
                                                            onChange={(e) => setGrossLmt(e.target.value)}
                                                            placeholder='Gross Limit'
                                                            className='form-control ' style={{ width: '60%', textAlign: 'right' }}></input>
                                                    </div>
                                                    <div className="col-4  col-md-4 d-flex justify-content-evenly mb-2">
                                                        <label className='form-label  my-2'>Net Limit:</label>
                                                        <input
                                                            type='number'
                                                            disabled={addMode}
                                                            value={netLmt}
                                                            onChange={(e) => setNetLmt(e.target.value)}
                                                            placeholder='Net Limit'
                                                            className='form-control ' style={{ width: '60%', textAlign: 'right' }}></input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='inputflex mb-4  mt-2  ps-0' style={{ width: '100%' }}>
                                    <div className="row " >
                                        <div className="inputOnText ">
                                            <label className="labelAddress " style={{ top: '-18px' }} htmlFor="Textinput">Other Parameters</label>
                                            <div className="form-control size_address4  me-3">
                                                <div className="row mb-2">
                                                    <div className="col-12 col-md-12 d-flex mb-2 justify-content-start">
                                                        <label className='form-label ms-2 me-3  align-content-center'>Date Applicable:</label>
                                                        <input
                                                            type="date"
                                                            disabled={addMode}
                                                            value=''
                                                            className='form-control mt-1 width_slab_input_1'
                                                        />
                                                    </div>
                                                    <div className='row ms-0'>
                                                        <div className='col-6 col-md-6 d-flex'>
                                                            <label className='form-label my-2 me-2'>Status:</label>
                                                            <select
                                                                disabled={addMode}
                                                                className='form-select'
                                                            >
                                                                <option value=''>Select Status</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-6 col-md-6 d-flex'>
                                                            <label className='form-label my-2 text-end me-2' style={{ width: '100%' }}>Status Chg Date:</label>
                                                            <input
                                                                disabled={addMode}
                                                                type="date"
                                                                value=''
                                                                className='form-control mt-2 width_slab_input_1'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
