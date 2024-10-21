import React, { useState, useEffect,useMemo } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './tab.css';
import { FormGroup, Label, Input } from 'reactstrap';
import ClientSearchPop from './ClientSearchPop';
import ScripSearchPop from './ScripSearchPop.js'
import { BASE_URL } from ".././constants";

function App() {
  const [activeSection, setActiveSection] = useState(null);
  const [showScripPopup, setshowScripPopup] = useState(false);

  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleToggle = (section) => {
    setActiveSection(section === activeSection ? null : section);
  };
  const [clientcd, setClientCd] = useState('');
  const [scripcd, setScripCd] = useState('');
  const [sec_name, setScripname] = useState('');
  const [clientname, setClientName] = useState('');
  const [branches, setBranches] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [clientInfo, setClientInfo] = useState({});
  const [participantInfo, setParticipantInfo] = useState({});
  const [tradeInfo, setTradeInfo] = useState({});
  const [Setletypes, setSetleTypes] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [settleno, setSettleNo] = useState('');
  
  

  const [filters, setFilters] = useState({
    clientcd: '',
    scripcd: '',
    fromdt: '',
    todt: '',
    branchcd: '',
    Settle_tp: '',
    SetleNo: '',
    tradeNo: '',
    orderNo: '',
  });


  useEffect(() => {
    // http://localhost:3001/api/branches
    axios.get(`${BASE_URL}/api/branches`)
      .then(response => setBranches(response.data))
      .catch(error => console.error('Error fetching branches:', error));
  }, []);

  const handleSearch = async () => {
    //alert('Start');
    const params = new URLSearchParams();
    //alert(JSON.stringify(filters));
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
        //alert( filters[key]);
      }
    });
    console.log('Filters:', filters);
    //alert('Filters:', filters);
    console.log('Params:', params.toString());
    //alert('Params:' + params.toString());
    //alert(params.toString());
    try {
      //`http://localhost:3001/api/sauda_book
      const res = await axios.get(`${BASE_URL}/api/sauda_book?${params.toString()}`);
      setSettlements(res.data);
      setSettleNo(res.data[0].trd_settle_no);
      //console.log('res.data ---->', );
      //alert(JSON.stringify(res.data));
    }
    catch (error) {
      console.error("Error fetching settlements:", error);


    }

  };

  const downloadCSV = () => {
    const table = document.getElementById('my-table');
    const rows = Array.from(table.rows);
    
    const csvContent = rows.map(row => {
      const cols = Array.from(row.cells);
      return cols.map(col => col.innerText).join(',');
    }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Sauda_Report_' + settleno + '.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      // If already sorting by this column, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Otherwise, sort by the new column in ascending order
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Sort settlements data based on current sortBy and sortDirection
  const sortedSettlements = useMemo(() => {
    if (!sortBy) return settlements;

    return settlements.slice().sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      }
    });
  }, [settlements, sortBy, sortDirection]);


  const handleScripChange = async (e) => {
    const newScripCd = e.target.value;

    setScripCd(newScripCd);
    filters.scripcd = newScripCd;
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });

    if (newScripCd) {
      try {
        // `http://localhost:3001/api/scrip
        const response = await axios.get(`${BASE_URL}/api/scrip/${newScripCd}`);
        setScripname(response.data.sec_name);


      } catch (err) {
        setScripname(''); // Clear name if there's an error
        console.error(err);
      }
    } else {
      setScripname(''); // Clear name if ClientCd is empty
    }
  };

  const handleRowScripSelect = (name, code, e) => {
    const trimmedCode = code ? code.trim() : '';
    setScripname(name);
    setScripCd(trimmedCode);


    const updatedFilters = {
      ...filters,
      scripcd: trimmedCode
    };

    if (e && e.target) {
      updatedFilters['scripcd'] = e.target.value.trim();

    }

    setFilters(updatedFilters);
    setshowScripPopup(false);
  };

  const handleClientCdChange = async (e) => {
    const newClientCd = e.target.value;


    setClientCd(newClientCd);
    filters.clientcd = newClientCd;
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });

    if (newClientCd) {
      try {
        // `http://localhost:3001/api/client/${newClientCd}
        const response = await axios.get(`${BASE_URL}/api/client/${newClientCd}`);
        setClientName(response.data.name);
      } catch (err) {
        setClientName(''); // Clear name if there's an error
        console.error(err);
      }
    }


    else {
      setClientName(''); // Clear name if ClientCd is empty
    }
  };

  useEffect(() => {
    // 'http://localhost:3001/api/Settlement_type
    axios.get(`${BASE_URL}/api/Settlement_type`)
      .then(response => {
        setSetleTypes(response.data);
        //alert(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  },
    []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchClientRowSelect = (name, code, e) => {
    setClientName(name);
    setClientCd(code)

    // Update filters object with scripname and scripCd
    const updatedFilters = {
      ...filters,

      clientcd: code
    };

    if (e && e.target) {
      updatedFilters['clientcd'] = e.target.code;

    }

    setFilters(updatedFilters);
    setShowPopup(false);
  };



  const handleRowClick = (row) => {
    //alert('company:'+row.cmp_cd);
    setClientInfo({
      clientNumber: row.cmp_cd,
      company: row.comp_name,
      exc_name: row.exc_name,
      branch_name: row.branch_name,
      trd_client_cd: row.trd_client_cd,
      trd_no: row.trd_no,
      ord_no: row.ord_no,
      trd_date: row.trd_date,
      trd_time: row.trd_time,
      settle_tp: row.settle_tp,
      trd_settle_no: row.trd_settle_no,
      trd_sec_cd: row.trd_sec_cd,
      trd_series: row.trd_series,
      trd_qty: row.trd_qty,
      trd_buy_sell: row.trd_buy_sell,
      trd_price: row.trd_price,
      net_rate: row.net_rate,
      brokerage: row.brokerage,
      tran_chrg: row.tran_chrg,
      sebi_to: row.sebi_to,
      stamp_duty: row.stamp_duty,
      clearing_chrg: row.clearing_chrg,
      other_chrg: row.other_chrg,
      stt: row.stt
    });
    setTradeInfo({
      trd_no: row.trd_no,
      trd_sec_cd: row.trd_sec_cd,
      trd_series: row.trd_series,
      trd_client_cd: row.trd_client_cd,
      trd_qty: row.trd_qty,
    });
    setParticipantInfo({
      trd_user_id: row.trd_user_id,
      Prop_Client: row.Prop_Client, // Assuming this is a valid field in your data
      trd_part_cd: row.trd_part_cd,
      Custodian: row.Custodian,
      client_remark: row.client_remark,
      trd_client_cd: row.trd_client_cd,
      contract_no: row.contract_no,
      bill_no: row.bill_no,
      sq_up_qty: row.sq_up_qty,
      sq_trans_no: row.sq_trans_no,
    });


  };


  return (
    
    <div className="container-common">
      <div className="card">
      <div className="card-header-css">
        <h3>Sauda Book Report</h3>
        </div>
        <div className='mt-3'>
    <Row className="">
      <Col>
        <Button variant="primary" onClick={() => handleToggle('section1')}>
          Search Parameter
        </Button>
      </Col>
      <Col>
        <Button variant="primary" onClick={() => handleToggle('section2')}>
          General Info
        </Button>
      </Col>
      <Col>
        <Button variant="primary" onClick={() => handleToggle('section3')}>
          Other Info
        </Button>
      </Col>
      <Col>
        <Button variant="primary" onClick={() => handleToggle('section4')}>
          Change or Split
        </Button>
      </Col>
    </Row>
    </div>
    {activeSection === 'section1' && (
  <div>
    {/* <Row className="mt-3">
      <Col>
        <div className="col-md-4-sr">
          <div className="textOnInput-sr">
            <label className='label label1-sr label_text-sr mb-2' htmlFor="branchSelect">Branch:</label>
            <div className="form-control form_control1-sr">
              <Col xs={12} md={3} className='column_display-sr padding_branch-sr'>
                <FormGroup className="formgroup_flex-sr" controlId="branchSelect">
                  <Label for="branchSelect" className='label_width-sr'>Branch:</Label>
                  <Form.Select
                    aria-label="Default select example"
                    className='margin_before_select-sr margin_left-sr'
                    name="branchcd"
                    value={filters.branchcd}
                    onChange={handleChange}
                    size="sm"
                  >
                    <option value="Select Branch">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.branch_cd} value={branch.branch_cd}>
                        {branch.branch_name}
                      </option>
                    ))}
                  </Form.Select>
                </FormGroup>
              </Col>
            </div>
          </div>
        </div>
      </Col>
    </Row>
     */}
    <Row>
      <Col>
        <div className="col-md-4-sr mt-3">
          <div className="textOnInput-sr">
            <label className='label label1-sr' htmlFor="settlementSelect">Settlement Info:</label>
            <div className="form-control form_control1-sr">
              <Col xs={12} md={6} className='column_display-sr padding_top-sr'>
                <div className="mb-2 mb-md-0" controlId="Setletype">
                  <Form.Label className="me-md-2 label_btn_margin-sr align-middle-sr">Settlement Type:</Form.Label>
                </div>
                <div>
                  <Form.Select
                    aria-label="Default select example"
                    className='setle_width-sr'
                    name='Settle_tp'
                    value={filters.settle_tp}
                    onChange={handleChange}
                    size="sm">
                    <option value="">Select Settle Type</option>
                    {Setletypes.map(Setletype => (
                      <option key={Setletype.settle_tp} value={Setletype.settle_tp}>
                        {Setletype.description}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-md-center-sr">
                  <div className="mb-2 mb-md-0 me-md-2" controlId="Setle_No">
                    <Form.Label className='label_btn_margin-sr align-middle-sr to_margin-sr'>Settlement No.:</Form.Label>
                  </div>
                  <div>
                    <Form.Control
                      type="number"
                      className='width_before_select-sr'
                      name='SetleNo'
                      value={filters.SetleNo}
                      onChange={handleChange}
                      size="sm"
                    />
                  </div>
                  <div>
                    <Button
                      variant="primary"
                      className="mr-2 custom-header-sr report-button-sr btn width_before_select-sr"
                      size='sm'
                    >
                      Search Settle No.
                    </Button>
                  </div>
                </div>
              </Col>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    <Row>
      <Col>
        <div className="col-md-4-sr mt-3">
          <div className="textOnInput-sr">
            <label className='label label1-sr' htmlFor="dateSelect">Date:</label>
            <div className="form-control form_control1-sr">
              <Col xs={12} md={12}>
                <div className="d-flex flex-column flex-md-row align-items-md-center">
                  <div className="mb-2 mt-1 mb-md-0" controlId="fromdt">
                    <Form.Label>Form Date:</Form.Label>
                  </div>
                  <div>
                    <Form.Control
                      type="date"
                      className='width_before_select-sr margin_formdt-sr'
                      name="fromdt"
                      value={filters.fromdt}
                      onChange={handleChange}
                      size="sm"
                    />
                  </div>
                  <div className="mb-2 mb-md-0 ms-md-2" controlId="todt">
                    <Form.Label className='to_margin2-sr'>To:</Form.Label>
                  </div>
                  <div>
                    <Form.Control
                      type="date"
                      className='width_before_select-sr'
                      name="todt"
                      value={filters.todt}
                      onChange={handleChange}
                      size="sm"
                    />
                  </div>
                </div>
              </Col>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    <Row>
      <Col>
        <div className="col-md-4-sr mt-3">
          <div className="textOnInput-sr">
            <label className='label label1-sr' htmlFor="transactionSelect">Transaction info:</label>
            <div className="form-control form_control1-sr">
              <Col xs={12} md={6} className='column_display-sr padding_top-sr'>
                <div className="mb-2 mb-md-0 me-md-2">
                  <Form.Label className='mb-0 align-middle-sr margin_client-sr'>Client:</Form.Label>
                </div>
                <div>
                  <Form.Control
                    type="text"
                    name="clientcd"
                    value={clientcd}
                    onChange={handleClientCdChange}
                    size="sm"
                    className='number_width-sr'
                  />
                </div>
                <div>
                  <Form.Control
                    type="text"
                    className='text_width-sr'
                    value={clientname}
                    size="sm"
                    readOnly
                  />
                </div>
                <div>
                  <Button
                    variant="primary"
                    className="mr-2 custom-header-sr report-button-sr btn"
                    size='sm'
                    onClick={() => setShowPopup(true)}
                  >
                    Search Client
                  </Button>
                  {showPopup && <ClientSearchPop onRowSelect={handleSearchClientRowSelect} />}
                </div>
              </Col>
              <Col xs={12} md={6} className='column_display-sr  padding_top-sr'>
                <div className="mb-2 mb-md-0 me-md-2 align-middle-sr">
                  <Form.Label>Scrip:</Form.Label>
                </div>
                <div>
                  <Form.Control
                    type="text"
                    name="scripcd"
                    value={scripcd}
                    onChange={handleScripChange}
                    size="sm"
                    className='scrip_width-sr'
                  />
                </div>
                <div>
                  <Form.Control
                    type="text"
                    value={sec_name}
                    size="sm"
                    className='width_scrip-sr'
                    readOnly
                  />
                </div>
                <div>
                  <Button
                    variant="primary"
                    className="ml-3 custom-header-sr report-button-sr btn"
                    size='sm'
                    onClick={() => setshowScripPopup(true)}
                  >
                    Search Scrip
                  </Button>
                  {showScripPopup && <ScripSearchPop onRowSelect={handleRowScripSelect} />}
                </div>
              </Col>
              <Col xs={12} md={3} className='column_display-sr margin_trd-sr'>
                <FormGroup className="formgroup_flex-sr">
                  <Label for="trd_No" className='width_trade_no-sr label_text-sr'>Trade No.:</Label>
                  <Input
                    type="number"
                    className='width_before_select-sr'
                    id="tradeNo"
                    name="tradeNo"
                    value={filters.tradeNo}
                    onChange={handleChange}
                    bsSize="sm"
                  />
                </FormGroup>
                <FormGroup className="formgroup_flex-sr">
                  <Label for="ord_no" className='label_width-sr label_text-sr margin_order-sr'>Order No.:</Label>
                  <Input
                    type="number"
                    className='width_order-sr'
                    id="orderNo"
                    name="orderNo"
                    defaultValue={filters.orderNo}
                    onChange={handleChange}
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
              <Col xs={12} md={3} className='column_display-sr'>
                <div className='radio_btn2-sr'>
                  <Button
                    variant="success"
                    onClick={handleSearch}
                    style={{ marginLeft: '10px', width: '150px' }}
                    className="btn-success-sr"
                    size='sm'
                  >
                    Run Report
                  </Button>
                  <button onClick={downloadCSV}>Download CSV</button>
                </div>
              </Col>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  </div>
)}

{activeSection === 'section2' && (
  <Row className="mt-3">
    <Col xs={12} md={4} className='column_display-sr padding_top-sr header_gereral-sr'>
      <FormGroup className="formgroup_flex-sr" controlId="company">
        <Label for="company" className='label_width-sr label_text-sr'>Company:</Label>
        <Input type="text" id="company" className='input_margin-1-sr' value={clientInfo.company || ''} bsSize="sm" readOnly />
      </FormGroup>
      <FormGroup className="formgroup_flex-sr" controlId="exchange">
        <Label for="exchange" className='label_width-sr label_text-sr'>Exchange:</Label>
        <Input type="text" id="exchange" className='input_margin-sr' value={clientInfo.exc_name || ''} bsSize="sm" readOnly />
      </FormGroup>
      <FormGroup className="formgroup_flex-sr" controlId="branch">
        <Label for="branch" className='label_width-sr label_text-sr'>Branch:</Label>
        <Input type="text" id="branch" className='input_margin-sr' value={clientInfo.branch_name || ''} bsSize="sm" readOnly />
      </FormGroup>
    </Col>
    <Col xs={12} md={3} className='column_display-sr header_gereral-sr'>
      <FormGroup className="formgroup_flex-sr" controlId="client">
        <Label for="client" className='label_width-sr label_text-sr'>Client:</Label>
        <Input type="text" id="client" className='width_client-sr' value={clientInfo.trd_client_cd || ''} bsSize="sm" style={{ width: '80px' }} readOnly />
      </FormGroup>
      <FormGroup className="formgroup_flex-sr" controlId="trd_No">
        <Label for="trd_No" className='label_width-sr label_text-sr'>Trade No:</Label>
        <Input type="number" id="trd_No" value={clientInfo.trd_no} bsSize="sm" readOnly />
      </FormGroup>
      <FormGroup className="formgroup_flex-sr" controlId="ord_no">
        <Label for="ord_no" className='label_width-sr label_text-sr'>Order No:</Label>
        <Input type="number" id="ord_no" value={clientInfo.ord_no || ''} bsSize="sm" readOnly />
      </FormGroup>
      <FormGroup className="formgroup_flex-sr" controlId="trd_date">
        <Label for="date" className='label_width_date-sr label_text-sr'>Date:</Label>
        <Input type="text" id="date" className='width_date-sr' value={clientInfo.trd_date || ''} bsSize="sm" style={{ width: '100px' }} readOnly />
      </FormGroup>
      <FormGroup className="formgroup_flex-sr" controlId="trd_time">
        <Label for="date" className='label_width_date-sr label_text-sr'>Time:</Label>
        <Input type="text" id="date" className='width_date-sr' value={clientInfo.trd_time || ''} bsSize="sm" style={{ width: '90px' }} readOnly />
      </FormGroup>
    </Col>
    <Col xs={12} md={3} className='column_display-sr header_gereral-sr'>
      <FormGroup className="formgroup_flex-sr" controlId="setle_no">
        <div><Label for="setle_no" className='label_width5-sr label_text-sr'>Settle No:</Label></div>
        <div><Input type="text" id="setle_no" className='input_width-sr' value={clientInfo.settle_tp || ''} bsSize="sm" readOnly /></div>
        <div><Input type="number" id="setle_no" className='input_Settle-sr' value={clientInfo.trd_settle_no || ''} bsSize="sm" readOnly /></div>
      </FormGroup>
      <FormGroup className="formgroup_flex-sr" controlId="dsetle_no">
        <div><Label for="dsetle_no" className='label_width4-sr label_text-sr'>DSettle No:</Label></div>
        <div><Input type="text" id="dsetle_no" className='input_width-sr' value={clientInfo.settle_tp || ''} bsSize="sm" readOnly /></div>
        <div><Input type="number" id="dsetle_no" className='input_Settle-sr' value={clientInfo.trd_settle_no || ''} bsSize="sm" readOnly /></div>
      </FormGroup>
      <FormGroup className="formgroup_flex-sr" controlId="scrip">
        <div><Label for="scrip" className='label_width-sr label_text-sr'>Scrip:</Label></div>
        <div><Input type="text" id="scrip" value={clientInfo.trd_sec_cd || ''} className='input_Settle-sr' bsSize="sm" readOnly /></div>
      </FormGroup>
      <FormGroup className="formgroup_flex-sr" controlId="series">
        <Label for="series" className='label_width-sr label_text-sr'>Series:</Label>
        <Input type="text" id="series" value={clientInfo.trd_series || ''} bsSize="sm" />
      </FormGroup>
    </Col>
    <Col xs={12} md={2} className='column_display-sr header_gereral-sr'>
      <FormGroup className="formgroup_flex-sr" controlId="buy_sell">
        <Label for="buy_sell" className='label_width-sr label_text-sr'>Buy/Sell:</Label>
        <Input type="text" id="buy_sell" className='inputbuy_margin-sr' value={clientInfo.trd_buy_sell || ''} bsSize="sm" readOnly />
      </FormGroup>
      <FormGroup className="formgroup_flex-sr" controlId="qty">
        <Label for="qty" className='label_width-sr label_text-sr'>Qty:</Label>
        <Input type="number" className='general-input-sr' id="qty" value={clientInfo.trd_qty || ''} bsSize="sm" readOnly />
      </FormGroup>
      <FormGroup className="formgroup_flex-sr" controlId="market_prices">
        <Label for="market_prices" className='label_width3-sr label_text-sr'>Market Prices:</Label>
        <Input type="number" id="market_prices" value={clientInfo.trd_price || ''} bsSize="sm" readOnly />
      </FormGroup>
      <FormGroup className="formgroup_flex-sr" controlId="net_rate">
        <Label for="net_rate" className='label_width2-sr label_text-sr'>Net Rate:</Label>
        <Input type="number" id="net_rate" value={clientInfo.net_rate || ''} bsSize="sm" readOnly />
      </FormGroup>
      <FormGroup className="formgroup_flex-sr" controlId="brokerage">
        <Label for="brokerage" className='label_width-sr label_text-sr'>Brokerage:</Label>
        <Input type="number" className='' id="brokerage" value={clientInfo.brokerage || ''} bsSize="sm" readOnly />
      </FormGroup>
    </Col>
  </Row>
)}


        {activeSection === 'section3' && (
  <div>
    <Row className="mt-3">
      <div>
        <div>
          <div className="textOnInput-sr">
            <label className='label-sr label1-sr' htmlFor="inputText">Other info:</label>
            <div className="form-control-sr form_control1-sr">
              <Col xs={12} md={3} className='column_display-sr padding_top-sr'>
                <FormGroup className="formgroup_flex-sr" controlId="trade_user_id">
                  <Label for="trade_user_id" className='margin_user_id-sr'>Trade User ID:</Label>
                  <Input type="number" className='input_trade_prop-sr' id="trade_user_id" value={participantInfo.trd_user_id || ''} bsSize="sm" readOnly />
                </FormGroup>
                <FormGroup className="formgroup_flex-sr" controlId="prop_client">
                  <Label for="prop_client" className='margin_prop-sr'>Prop/Client:</Label>
                  <Input type="text" id="prop_client" className='input_trade_prop-sr' value={participantInfo.Prop_Client || ''} bsSize="sm" readOnly />
                </FormGroup>
                <FormGroup className="formgroup_flex-sr" controlId="participent_cd">
                  <Label for="participent_cd" className='label_width6-sr'>Participent Cd:</Label>
                  <Input type="number" id="participent_cd" value={participantInfo.trd_part_cd || ''} bsSize="sm" readOnly />
                </FormGroup>
                <FormGroup className="formgroup_flex-sr" controlId="custodian">
                  <Label for="custodian" className='label_width-sr'>Custodian:</Label>
                  <Input type="text" id="custodian" value={participantInfo.Custodian || ''} bsSize="sm" readOnly />
                </FormGroup>
              </Col>
              <Col xs={12} md={6} className='column_display-sr'>
                <FormGroup className="formgroup_flex-sr" controlId="remarks">
                  <Label for="remarks" className='label_text-sr'>Remarks:</Label>
                  <Input type="text" id="remarks" className='inputRemark_margin-sr' value={participantInfo.client_remark || ''} bsSize="sm" readOnly />
                </FormGroup>
                <FormGroup className="formgroup_flex-sr" controlId="original_client">
                  <Label for="original_client" className='labelOriginal_width-sr label_text-sr'>Original Client:</Label>
                  <Input type="text" id="original_client" className='inputOriginal-sr' value={participantInfo.trd_client_cd || ''} bsSize="sm" readOnly />
                </FormGroup>
              </Col>
            </div>
          </div>
        </div>
      </div>
    </Row>
    <Row>
      <div>
        <div className="col-md-12 mt-3">
          <div className="textOnInput-sr">
            <label className='label label1-sr' htmlFor="inputText">Back Office Specific:</label>
            <div className="form-control-sr form_control1-sr">
              <Col xs={12} md={6} className='column_display-sr padding_top-sr'>
                <FormGroup className="formgroup_flex-sr" controlId="contract_No">
                  <Label for="contract_No" className='width_contract-sr label_text-sr'>Contract No.:</Label>
                  <Input type="number" id="contract_No" className='inputOriginal-sr' value={participantInfo.contract_no || ''} bsSize="sm" readOnly />
                </FormGroup>
                <FormGroup className="formgroup_flex-sr" controlId="bill_No">
                  <Label for="bill_No" className='labelbill_width-sr label_text-sr'>Bill No.:</Label>
                  <Input type="number" id="bill_No" className='inputBill_margin-sr inputOriginal-sr' value={participantInfo.bill_no || ''} bsSize="sm" readOnly />
                </FormGroup>
              </Col>
              <Col xs={12} md={6} className='column_display-sr'>
                <FormGroup className="formgroup_flex-sr" controlId="sq_up_qty">
                  <Label for="sq_up_qty" className='width_sq_Up_Qty-sr label_text-sr'>Sq Up Qty:</Label>
                  <Input type="number" id="sq_up_qty" className='inputSqupQty_margin-sr inputOriginal-sr' value={participantInfo.sq_up_qty || ''} bsSize="sm" readOnly />
                </FormGroup>
                <FormGroup className="formgroup_flex-sr" controlId="sq_trans_no">
                  <Label for="sq_trans_no" className='labelSqTrans_width-sr label_text-sr'>Sq Trans No.:</Label>
                  <Input type="number" id="sq_trans_no" className='inputOriginal-sr' value={participantInfo.sq_trans_no || ''} bsSize="sm" readOnly />
                </FormGroup>
              </Col>
            </div>
          </div>
        </div>
      </div>
    </Row>
  </div>
)}


        {activeSection === 'section4' && (
          <div className='display_flex'>
            <Row className="mt-3">

              <div >
              <div className="col-md-12">
  <div className="textOnInput-sr">
    <label className='label-sr label1-sr' htmlFor="inputText">Original Data:</label>
    <div className="form-control-sr form_control2-sr">
      <Col xs={12} md={3} className='padding_top-sr width_div-sr'>
        <FormGroup className="formgroup_flex-sr" controlId="tradeNumber">
          <Label for="trd_No" className='label_text-sr'>Trade No.:</Label>
          <Input type="number" className='input_width2-sr margin_trd_no-sr mb-3' id="trd_No" value={tradeInfo.trd_no || ''} bsSize="sm" readOnly />
        </FormGroup>
        <FormGroup className="formgroup_flex-sr" controlId="trd_sec_cd">
          <Label for="scrip" className='label_text-sr'>Scrip:</Label>
          <Input type="text" className='input_width2-sr margin_scrip-sr mb-3' id="scrip" value={tradeInfo.trd_sec_cd || ''} bsSize="sm" readOnly />
        </FormGroup>
        <FormGroup className="formgroup_flex-sr" controlId="trd_series">
          <Label for="series" className='label_text-sr'>Series:</Label>
          <Input type="text" id="series" className='input_width2-sr margin_client_series-sr mb-3' value={tradeInfo.trd_series || ''} bsSize="sm" readOnly />
        </FormGroup>
        <FormGroup className="formgroup_flex-sr" controlId="trd_client_cd">
          <Label for="client" className='label_text-sr'>Client:</Label>
          <Input type="text" id="client" className='input_width2-sr margin_client_series-sr mb-3' value={tradeInfo.trd_client_cd || ''} bsSize="sm" readOnly />
        </FormGroup>
        <FormGroup className="formgroup_flex-sr" controlId="qty">
          <Label for="qty" className='label_text-sr'>Qty:</Label>
          <Input type="text" id="qty" className='input_width2-sr margin_Qty-sr' value={tradeInfo.trd_qty || ''} bsSize="sm" readOnly />
        </FormGroup>
      </Col>
    </div>
  </div>
</div>
              </div>


            </Row>
            {/* <Row >
							<div >
								<div className="col-md-4 mt-3">
									<div className="textOnInput">

										<div className="form-control form_control2 form_control_height">
											<Col xs={12} md={4} className=' padding_top '>
												<div className='radio_btn'>
													<Form.Check
														type="radio"
														label="Change"
														name="reportType"
														defaultValue="change"
														id="changeRadio"
														checked={reportType === 'change'}
														onChange={(e) => setReportType(e.target.defaultValue)}
														className="mr-3"
														defaultChecked
													/>
													<Form.Check
														type="radio"
														label="Split"
														name="reportType"
														defaultValue="split"
														id="splitRadio"
														style={{ marginLeft: '5%' }}
														checked={reportType === 'split'}
														onChange={(e) => setReportType(e.target.defaultValue)}
													/>
												</div>


												<FormGroup className="formgroup_flex" controlId="Client">
													<Label for="client" className='labelbill_width2 label_text'>Client:</Label>
													<Select
														defaultValue={selectedRows.map(row => row.Client}
														onChange={handleClientChange}
														options={clientOptions}
														placeholder="Select client..."
														className='inputClient'
														isSearchable={true} // Enable search
														size='sm'
													/>
												</FormGroup>
												<FormGroup className="formgroup_flex" controlId="qty">
													<Label for="qty" className='labelbill_width2 label_text'>Qty:</Label>
													<Input type="number" id="qty" className='inputClient' defaultValue={selectedRows.map(row => row.Qty} onChange={(e) => setQty(e.target.defaultValue)} bsSize="sm" />
												</FormGroup>

												<div className='radio_btn2'>
													<Button variant="" onClick={'#'} className="mr-2 custom-header2 " disabled>
														Add
													</Button>
													<Button variant="" onClick={'#'} style={{ marginLeft: '10px' }} className="custom-header2" disabled>
														Remove
													</Button >
													<Button variant="" onClick={'#'} style={{ marginLeft: '10px' }} className="custom-header2">
														Confirm
													</Button>
												</div>

											</Col>
											<Col xs={12} md={4} className='div6 '>
												<div >
													<div className='div2 '>
														<div className='div3'>
															<Button variant="" onClick={'#'} className="mr-2 ">
																Client
															</Button>
														</div>
														<div>
															<Button variant="" onClick={'#'} style={{ marginLeft: '10px' }} className="">
																Qty
															</Button>
														</div>

													</div>

												</div>
											</Col>

										</div>

									</div>
								</div>
							</div>




						</Row> */}
          </div>
        )}
        {settlements.length > 0 && (
  <Row className="my-3">
    <div className="table-responsive-sr scrollX-sr" style={{
      maxHeight: '300px',
      overflowY: "scroll"
    }}>
      <table id="my-table" className="table custom-table-sr table-bordered-sr table-sm-sr" style={{ width: "1300px" }}>
        <thead className='table-primary-sr' style={{
          position: "sticky",
          top: "0", zIndex: 3
        }}>
          <tr className='bg-primary-sr'>
            <th onClick={() => handleSort('trd_no')}>
              Trade No {sortBy === 'trd_no' && (
                <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            {/* <th>Symbol</th> */}
            <th onClick={() => handleSort('trd_sec_cd')}>
              Symbol {sortBy === 'trd_sec_cd' && (
                <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th>Series</th>
            <th>Buy Sell</th>
            <th>Trade Qty</th>
            <th>Trade Price</th>
            <th>Client Code</th>
            <th>Part code</th>
            <th>Trade Date Time</th>
            {/* <th>Trade Time</th> */}
            <th>Order No</th>
            <th>Contract No</th>
            <th>Bill No</th>
            <th>D Settle No</th>
            <th>Settle Type</th>
            <th>Net Rate</th>
            <th>Brokerage</th>
            <th>Sq Up Qty</th>
            <th>Sq Tran No.</th>
            <th>Orig Client Code</th>
            <th>Tran Charges</th>
            <th>SEBI TO</th>
            <th>Stamp Duty</th>
            <th>Clearing Charges</th>
            <th>Other Charges</th>
            <th>STT</th>
            <th>Company</th>
            <th>Exchange</th>
            <th>Branch</th>
            <th>Record No</th>
            <th>Trade Status</th>
            <th>Pro/Client</th>
            <th>User Id</th>
          </tr>
        </thead>
        <tbody>
          {sortedSettlements.map((row, index) => (
            <tr key={index} onClick={() => handleRowClick(row)}>
              <td>{row.trd_no}</td>
              <td>{row.trd_sec_cd}</td>
              <td>{row.trd_series}</td>
              <td>{row.trd_buy_sell}</td>
              <td>{row.trd_qty}</td>
              <td>{row.trd_price}</td>
              <td>{row.trd_client_cd}</td>
              <td>{row.trd_part_cd}</td>
              {/* <td>{row.trd_enter_date_time}</td> */}
              <td>{row.trd_date} {row.trd_time}</td>
              {/* <td>{row.trd_time}</td> */}
              <td>{row.ord_no}</td>
              <td>{row.contract_no}</td>
              <td>{row.bill_no}</td>
              <td>{row.trd_settle_no}</td>
              <td>{row.settle_tp}</td>
              <td>{row.net_rate}</td>
              <td>{row.brokerage}</td>
              <td>{row.sq_up_qty}</td>
              <td>{row.sq_trans_no}</td>
              <td>{row.org_client_cd}</td>
              <td>{row.tran_chrg}</td>
              <td>{row.sebi_to}</td>
              <td>{row.stamp_duty}</td>
              <td>{row.clearing_chrg}</td>
              <td>{row.other_chrg}</td>
              <td>{row.stt}</td>
              <td>{row.comp_name}</td>
              <td>{row.exc_name}</td>
              <td>{row.branch_name}</td>
              <td>{row.record_no}</td>
              <td>{row.trd_status}</td>
              <td>{row.trd_pro_cl_wh}</td>
              <td>{row.trd_user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Row>
        )}
    </div>
    </div>
  );
};

export default App;
