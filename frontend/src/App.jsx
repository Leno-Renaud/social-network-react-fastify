import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import SearchEvents from './Components/SearchEvents/SearchEvents';
import Chat from "./Pages/Chat/Chat";
import Matching from './Components/Matching/Matching';
import CreateEvent from './Components/CreateEvent/CreateEvent';
import CreateVoyage from './Components/CreateVoyage/CreateVoyage';
import { AuthContext } from './Context/AuthContext'
import MyEvents from './Pages/MyEvents/MyEvents';

import './global.scss'

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext)
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/events" element={<PrivateRoute><SearchEvents/></PrivateRoute>} />
        <Route path="/createEvent" element={<PrivateRoute><CreateEvent/></PrivateRoute>} />
        <Route path="/createVoyage" element={<PrivateRoute><CreateVoyage/></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/matching" element={<PrivateRoute><Matching/></PrivateRoute>} />
        <Route path="/my-events" element={<PrivateRoute><MyEvents/></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
