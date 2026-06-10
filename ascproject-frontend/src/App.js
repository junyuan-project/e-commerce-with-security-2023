import React, { useState } from 'react';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar';
import ThankYou from './components/ThankYou';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(!!localStorage.getItem('accessToken'));

  const handleLoginChange = (loggedIn) => {
    setLoggedIn(loggedIn);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLoginChange={handleLoginChange} />
      <Container style={{ marginTop: '5%' }}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login onLoginChange={handleLoginChange} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/thankyou" element={<ThankYou />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;