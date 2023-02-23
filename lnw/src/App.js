import React from 'react'
import './App.css';
import {Routes, Route} from 'react-router-dom'
import SlideShowPage from './pages/SlideShowPage';
import NotePage from './pages/NotePage';
import './styles/style.css'

export const url = process.env.REACT_APP_LNW_API || "http://localhost:8080";

function App() {
  return (
    <div>
      <img 
        id="backgroundImg"
        src="https://images.unsplash.com/photo-1511342802705-a7b79a427eb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
        alt="characters"
      />
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
