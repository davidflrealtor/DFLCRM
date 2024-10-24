import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import Tasks from './pages/Tasks';
import Transactions from './pages/Transactions';
import Notes from './pages/Notes';
import Newsletter from './pages/Newsletter';
import Automation from './pages/Automation';
import EmailCampaigns from './pages/EmailCampaigns';
import GoogleIntegration from './pages/GoogleIntegration';
import CanvaIntegration from './pages/CanvaIntegration';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Pipeline from './pages/Pipeline';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/contacts/:id" element={<ContactDetail />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/automation" element={<Automation />} />
              <Route path="/email-campaigns" element={<EmailCampaigns />} />
              <Route path="/google-integration" element={<GoogleIntegration />} />
              <Route path="/canva-integration" element={<CanvaIntegration />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/pipeline" element={<Pipeline />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;