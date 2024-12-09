// src/components/Header.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  Button, Container, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BASE_URL } from "../constants";

const Header = () => {
  const [bookType, setBookType] = useState([]);
  const [bookTypes, setBookTypes] = useState([]);
  const [voucherDate, setVoucherDate] = useState('');
  const [voucherNo, setVoucherNo] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [narration, setNarration] = useState('');
  

  useEffect(() => {
    axios.get(`${BASE_URL}/bookType`)
      .then(response => setBookTypes(response.data))
      .catch(error => console.error('Error fetching accounts:', error));
  }, []);

  // const handleSave = () => {
  //   onSave({ cashBankAccount, voucherDate, amount, narration });
  // };

  return (
    <Container className="align-items-center">
      <Row className="mb-3">
        <Col xs={6} md={4}>
          <Form.Group controlId="bookTypeSelect">
            <Form.Label>Book Type</Form.Label>
            <Form.Select aria-label="Default select example" value={bookType} onChange={(e) => setBookType(e.target.value)} size="sm">
              <option value="">Select Book type</option>
              {bookTypes.map( BookTypes=> (
          <option key={BookTypes.id} value={BookTypes.id}>{BookTypes.bookType}</option>
        ))}
              {/* <option value="DDL">DDL</option>
              <option value="Branch2">Branch 2</option>
              <option value="Branch3">Branch 3</option> */}
            </Form.Select>
           
          </Form.Group>
        </Col>
        <Col xs={6} md={4}>
          <Form.Group controlId="vouchardate">
            <Form.Label>Voucher Date</Form.Label>
            <Form.Control type="date" value={voucherDate} onChange={(e) => setVoucherDate(e.target.value)} size="sm" />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={6} md={4}>
          <Form.Group controlId="vouchar_no">
            <Form.Label>Voucher No</Form.Label>
            <Form.Control type="text" value={voucherNo} onChange={(e) => setVoucherNo(e.target.value)} size="sm" />
           
          </Form.Group>
        </Col>
        <Col xs={6} md={4}>
          <Form.Group controlId="effectiveDate">
            <Form.Label>Effective Date</Form.Label>
            <Form.Control type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} size="sm" />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={6} md={4}>
          <Form.Group controlId="narration">
            <Form.Label>Narration</Form.Label>
            <Form.Control type="text" value={narration} onChange={(e) => setNarration(e.target.value)} size="sm" />
           
          </Form.Group>
        </Col>
        
      </Row>
      
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={'#'} className="mr-2 custom-header">
           Edit Voucher
          </Button>
          <Button variant="primary" onClick={"#"} style={{ marginLeft: '10px' }} className="custom-header">
            ADD
          </Button>
        </Col>
      </Row>
      
      
    </Container>
  );
};

export default Header;



{/* <div>
      <label>Cash/Bank Account</label>
      <select value={cashBankAccount} onChange={e => setCashBankAccount(e.target.value)}>
        <option value="">Select Account</option>
        {accounts.map(account => (
          <option key={account.id} value={account.id}>{account.account_name}</option>
        ))}
      </select>

      <label>Voucher Date</label>
      <input type="date" value={voucherDate} onChange={e => setVoucherDate(e.target.value)} />

      <label>Amount</label>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />

      <label>Narration</label>
      <input type="text" value={narration} onChange={e => setNarration(e.target.value)} />

       <button onClick={handleSave}>Save</button> 
    </div> */}