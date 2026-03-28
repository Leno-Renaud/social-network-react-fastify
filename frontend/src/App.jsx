import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import RegisterPage from './Pages/Auth/RegisterPage';
import LoginPage from './Pages/Auth/LoginPage';
import SearchEvents from './Components/SearchEvents/SearchEvents';
import Chat from "./Pages/Chat/Chat";
import Matching from './Components/Matching/Matching';
import CreateEvent from './Components/CreateEvent/CreateEvent';
import CreateVoyage from './Components/CreateVoyage/CreateVoyage';

import './global.scss'

export default function App() {
  return (
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/events" element={<SearchEvents/>} />
          <Route path="/createEvent" element={<CreateEvent/>} />
          <Route path="/createVoyage" element={<CreateVoyage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/matching" element={<Matching/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/profile/:username" element={<Profile/>} />
        </Routes>
      </BrowserRouter>
  )
}