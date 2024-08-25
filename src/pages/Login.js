import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import axios from 'axios';
import { BASE_URL } from "./constants";


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  

  const handleLogin = () => {
    // Add your login logic here
    // if (username === 'admin' && password === 'admin') {
    //   navigate('/dashboard');
    // } else {
    //     setError('Invalid credentials');
    // }

    try {
      //const res = axios.post('http://localhost:3001/api/login', { username, password });
      //`
      const res = axios.post(`${BASE_URL}/api/login`, { username, password });
      //console.log('handleLogin res -----> ', res.status);
      //setUser(res);
      //alert('res='+ res);
      if (res) {
      navigate('/dashboard');
     } else {
         setError('Invalid credentials');
     }
     // setUserName(username);
    } catch (error) {
      alert(error);
      setError('Login failed');
    }

  };

  return (
    <div className='page'>
      <div className='header-container'>
        <img src='logo.png' width="55" height="55" alt="Logo" className='logo' />
        <h3 className='title'>SODHANI SECURITIES LTD</h3>
      </div>
      <div className="centered-page">
        <div className="custom-container">
          <div className="login-container">
            <div className='floating-container'>
              <h3 className="heading">User Login</h3>
            </div>
            <Form>
              <FormGroup className='mt-4'>
                <Label for="username">Login ID</Label>
                <Input
                  type="text"
                  placeholder="Enter your ID"
                  className="form-control input-field"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormGroup>
              <FormGroup className='mb-4'>
                <Label for="password">Login Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="form-control input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormGroup>
              <Button color="primary" className="login_btn1" onClick={handleLogin}>
                Login
              </Button>
              {error && <p className="text-danger">{error}</p>}
            </Form>
          </div>
          <div className='bottom mt-2'>
            by ANZA Software Technologies
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className='footer'>
        <Container>
          <p className='footer-text'>© 2024 SODHANI SECURITIES LTD.</p>
        </Container>
      </footer>
    </div> 
  );
};

export default Login;
