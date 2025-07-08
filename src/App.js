import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import AdminConsole from './pages/AdminConsole';
import AuthUI from './pages/Login';
import MCQList from './components/learner/MCQ-List';
import Generatequiz from './pages/generatequiz';
import { ProfileProvider } from './components/ProfileContext';


const API_BASE = 'https://your-mock-api.com'; // Use a working public or mock endpoint


function App() {
  <ProfileProvider>
    <div className="container mx-auto p-4">
      <Dashboard />
      <MCQList />
    </div>
  </ProfileProvider>
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminConsole />} />
        <Route path="/login" element={<AuthUI />} />
        <Route path="/generate-mcq" element={<MCQList />} />
        <Route path='/generate-quiz' element ={<Generatequiz/>}/>
      </Routes>
    </Router>
  );
}

export default App;
