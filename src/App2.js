import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink , Navigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiMenu } from 'react-icons/bi';
import './App.css';
import reports from './pages/Reports';
import uploads from './pages/Uploads';


const App2 = () => {
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [uname, setUserName] = useState('');
  

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:3001/api/menu', {
        headers: { Authorization: `Bearer ${user.token}` }
      }).then(res => setMenuItems(res.data));
    }
  }, [user]);

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:3001/api/login', { username, password });
      setUser(res.data);
      setUserName(username);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = () => setUser(null);

  return (
    <Router>
      <div className="d-flex">
        <div className={`bg-light border-right ${collapsed ? 'collapsed' : ''}`} id="sidebar-wrapper">
          <div className="sidebar-heading">
            <button onClick={() => setCollapsed(!collapsed)}><BiMenu /></button>
          </div>
          <div className="list-group list-group-flush">
            {menuItems.map(item => (
              <NavLink key={item.id} to={item.name.toLowerCase()} className="list-group-item list-group-item-action bg-light">
                <i className={item.icon}></i> {!collapsed && item.name}
              </NavLink >
            ))}
          </div>
        </div>
        <div id="page-content-wrapper">
          <div className="container-fluid">
            <Routes>
              <Route path="/login" element={
                <>
                {user ? <Navigate to="/" /> : <Login onLogin={login} />}
                </>
              }>
              </Route>
              <Route path="/logout" element={
                <>
                <Logout onLogout={logout} />
                </>
              }>
              </Route>
              <Route path="/reports" element={
                <>
                {user ? <reports /> : <Navigate to="/login" />}
                </>}>
              </Route>
              <Route path="/uploads" element={
                <>
                {user && user.role === 'admin' ? <uploads /> : <Navigate to="/login" />}
                </>
              }>
              </Route>
              <Route path="/" element={
                <>
                {user ? <Dashboard user={user} /> : <Navigate to="/login" />}
                </>}>
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};
var uuname = "";
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  uuname = username;
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
<div className="d-flex justify-content-center align-items-center min-vh-100">
<div className="card shadow-sm p-4" style={{ width: '350px' }}>
  <h3 className="card-title text-center mb-4">CDBM Login</h3>
  <form onSubmit={handleSubmit}>
    <div className="form-group mb-3">
      <label htmlFor="text">User Name</label>
      <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter user name" />
    </div>
    <div className="form-group mb-3">
      <label htmlFor="password">Password</label>
      <input type="password" className="form-control"  value={password} onChange={e => setPassword(e.target.value)} id="password" placeholder="Enter password" />
    </div>
    <button type="submit" className="btn btn-primary btn-block">Login</button>
  </form>
</div>
</div>
  );
};

const Logout = ({ onLogout }) => {
  useEffect(() => {
    onLogout();
  }, [onLogout]);

  return <Navigate to="/login" />;
};

const Dashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3001/api/projects', {
      headers: { Authorization: `Bearer ${user.token}` }     
    }).then(res => setProjects(res.data));
  }, [user]);

  return (
    <div>      
      <nav className="navbar navbar-expand-lg navbar-light bg-light">  
  <h6>Welcome, {uuname}</h6>space(10)
  <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
    <ul className="navbar-nav mr-auto mt-2 mt-lg-0 justify-content-end">
      <form className="form-inline my-2 my-lg-0">
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Logout</button>
    </form>
    </ul>       
  </div>
</nav>
      <div className="card" style={{"width": "18rem"}}>
      <div className="card-header">
    Recent Projects
  </div>
  <ul className="list-group list-group-flush">
  {projects.map(project => (
          <li className="list-group-item" key={project.id}>{project.projectname}</li>
        ))}     
  </ul>
</div>
      
    </div>
  );
};

//const Reports = () => <h2>Reports</h2>;
//const Settings = () => <h2>Settings</h2>;

export default App2;
