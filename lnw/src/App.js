import React from 'react'
import './App.css';
import {Routes, Route} from 'react-router-dom'
import SlideShowPage from './pages/SlideShowPage';
import NotePage from './pages/NotePage';

export const url = process.env.REACT_APP_LNW_API || "http://localhost:8080";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<NotePage/>}/>
        <Route path="/:language" element={<NotePage/>}/>
        <Route path="/slideshow" element={<SlideShowPage/>}/>
        <Route path="/slideshow/:language" element={<SlideShowPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
