import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard.jsx';

import AddEmployee from './pages/AddEmployee.jsx';

import AddDepartment from './pages/AddDepartment.jsx';
import ViewDepartment from './pages/ViewDepartment.jsx';
import ViewEmployees from './pages/ViewEmployees.jsx';
import Profile from './pages/Profile.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
         
          <Route path="/viewemployees" element={<ViewEmployees/>} />
          <Route path="/addemployee" element={<AddEmployee />} />
          <Route path="/adddepartment" element={<AddDepartment />} />
          <Route path="/viewdepartment" element={<ViewDepartment />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Sidebar>
    </BrowserRouter>
  );
};

export default App;