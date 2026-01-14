import './App.css';
import Footer from './components/Footer/Footer';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

import AddReport from './pages/AddReport';
import HomeFeed from './pages/HomeFeed';
import AreaOverview from './pages/AreaOverview';
import NavBar from './components/NavBar';
import ReportDetailsPage from './pages/ReportDetailsPage';

import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <NavBar />
      <div style={{ paddingTop: '4.5rem', minHeight: '80vh' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-report" element={<AddReport />} />
          <Route path="/area-overview" element={<AreaOverview />} />
          <Route path="/" element={<HomeFeed />} />
          <Route path="/report/:id" element={<ReportDetailsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
