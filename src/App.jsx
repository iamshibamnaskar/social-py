import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie library
import './App.css';
import NavbarComponent from './components/navbar';
import PostCardComponent from './components/postcard';
import NewPostCard from './components/newpost';
import FriendsList from './components/friends';
import MakerCard from './components/webmaster';
import UserProfile from './pages/profile';
import SignupPage from './pages/Signup';
import LoginPage from './pages/login';
import authService from './api-helpers/api';
import { useNavigate } from "react-router-dom";
import HomePageComponent from './pages/homepage';

function App() {
  const [count, setCount] = useState(0);

  const ConditionalNavbar = () => {
    const location = useLocation();
    const noNavbarRoutes = ['/signup', '/login'];
    return !noNavbarRoutes.includes(location.pathname) && <NavbarComponent />;
  };

  const getJWT = () => {
    return Cookies.get('socialpiloginjwt');
  };

  return (
    <Router>
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(to right, #2F065E, #010C1E)',
        }}
      >
        {/* Conditionally render Navbar */}
        <ConditionalNavbar />
        <div style={{ height: 10 }}></div>

        {/* Define Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <HomePageComponent/>
            }
          />
          <Route
            path="/profile/:username"
            element={<div style={{ padding: '20px' }}><UserProfile /></div>}
          />
          <Route
            path="/signup"
            element={<div style={{ padding: '20px' }}><SignupPage /></div>}
          />
          <Route
            path="/login"
            element={<div style={{ padding: '20px' }}><LoginPage /></div>}
          />
        </Routes>

        {/* Place navigation logic here */}
        
      </div>
    </Router>
  );
}



export default App;


