/* eslint-disable no-unused-vars */
import React,{useState,useEffect} from 'react'
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Contact from './components/Contact';
import ErrorPage from './components/ErrorPage';
import "./App.css";
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import JobPosting from './components/JobPosting';
import FLAppbar from './components/FLAppbar';
import UserProfile from './components/UserProfile';
import UserSettings from './components/UserSettings';
import UserNavbar from './components/UserNavbar';
import UserNavbarRes from './components/UserNavbarRes';
import Proposals from './components/Proposals.js';
import NotificationComponent from './components/Notification';
import Dashboard from './components/Dashboard';

const App = () => {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const UserCall = async () => {
    try {
      const res = await fetch('/about', {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      const data = await res.json();
      setUserData(data);
      setIsLoading(false);

      if (res.status !== 200) {
        const error = new Error(res.error);
        throw error;
      }

    } catch (error) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    UserCall();
  }, []);

  return (
    <>
    {isLoading ? null : userData.designation ? < UserNavbar/> : < Navbar/>}
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/UserSignIn" element={<UserSignIn />} />
      <Route path="/*" element={<ErrorPage />} />
      <Route path="/UserSignUp" element={<UserSignUp />} />
      <Route path="/JobPosting" element={<JobPosting />} />
      <Route path="/UserSignOut" element={<UserSignOut />} />
      <Route path="/UserProfile" element={<UserProfile />} />
      <Route path="/UserSettings" element={<UserSettings />} />
      <Route path="/Proposals" element={<Proposals />} />
      <Route path="/Notifications" element={<NotificationComponent />} />
      <Route path="/Dashboard" element={<Dashboard />} />
    </Routes>
    </>
  )
}

export default App
