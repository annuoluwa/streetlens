import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Add more routes here, e.g. home, profile, feed, etc. */}
        <Route path="/" element={<div>Welcome to StreetLens!</div>} />
      </Routes>
    </Router>
  );
}

export default App;
