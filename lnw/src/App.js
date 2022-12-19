import React from 'react'
import './App.css';
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import SlideShow from './pages/SlideShow';

export const url = process.env.REACT_APP_LNW_API || "http://localhost:8080";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/:language" element={<Home/>}/>
        <Route path="/slideshow" element={<SlideShow/>}/>
        <Route path="/slideshow/:language" element={<SlideShow/>}/>
      </Routes>
    </div>
  );
}

export default App;
