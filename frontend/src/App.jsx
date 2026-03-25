import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import SearchEvents from './Components/SearchEvents/SearchEvents';
import Chat from "./Pages/Chat";
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
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/matching" element={<Matching/>} />
        </Routes>
      </BrowserRouter>
  )
}