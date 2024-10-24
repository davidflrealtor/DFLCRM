import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, CheckSquare, DollarSign, FileText, Mail, Zap, Calendar, Image, BarChart2, Settings, ChevronDown, ChevronUp, Menu, Sun, Moon, GitPullRequest } from 'lucide-react';

const Sidebar = ({ darkMode, setDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const navLinkClasses = `block py-2.5 px-4 rounded transition duration-200 ${darkMode ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-200 text-gray-700 hover:text-gray-900'}`;
  const activeClasses = `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`;

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        aria-label="Toggle Sidebar"
      >
        <Menu size={24} />
      </button>

      <div 
        className={`bg-white dark:bg-gray-800 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
      >
        <nav className="space-y-3" role="navigation" aria-label="Main Sidebar Navigation">
          <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : ''}`}>
            <Home className="inline-block mr-2" size={20} /> Dashboard
          </NavLink>
          <NavLink to="/contacts" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : ''}`}>
            <Users className="inline-block mr-2" size={20} /> Contacts
          </NavLink>
          <NavLink to="/pipeline" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : ''}`}>
            <GitPullRequest className="inline-block mr-2" size={20} /> Pipeline
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : ''}`}>
            <CheckSquare className="inline-block mr-2" size={20} /> Tasks
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : ''}`}>
            <DollarSign className="inline-block mr-2" size={20} /> Transactions
          </NavLink>
          <NavLink to="/notes" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : ''}`}>
            <FileText className="inline-block mr-2" size={20} /> Notes
          </NavLink>
          <NavLink to="/newsletter" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : ''}`}>
            <Mail className="inline-block mr-2" size={20} /> Newsletter
          </NavLink>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`${navLinkClasses} w-full text-left flex items-center justify-between`}
          >
            <span>Advanced</span>
            {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {showAdvanced && (
            <div className="pl-4 space-y-2">
              <NavLink to="/automation" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : ''}`}>
                <Zap className="inline-block mr-2" size={20} /> Automation
              </NavLink>
              <NavLink to="/email-campaigns" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : ''}`}>
                <Calendar className="inline-block mr-2" size={20} /> Email Campaigns
              </NavLink>
              <NavLink to="/google-integration" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : ''}`}>
                <Image className="inline-block mr-2" size={20} /> Google Integration
              </NavLink>
              <NavLink to="/canva-integration" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : ''}`}>
                <Image className="inline-block mr-2" size={20} /> Canva Integration
              </NavLink>
            </div>
          )}
          <NavLink to="/reports" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : ''}`}>
            <BarChart2 className="inline-block mr-2" size={20} /> Reports
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : ''}`}>
            <Settings className="inline-block mr-2" size={20} /> Settings
          </NavLink>
        </nav>
        <div className="px-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`${navLinkClasses} w-full text-left flex items-center justify-between`}
          >
            <span>Theme</span>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;