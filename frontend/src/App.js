import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import ImageUpload from './components/ImageUpload';
import Navbar from './components/Navbar';
// import './styles.css';

function App() {
    return (
        <Router>
        <Navbar />
        <div className="container">
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/imageupload" element={<ImageUpload />} />
            </Routes>
        </div>
        </Router>
    );
}

export default App;
