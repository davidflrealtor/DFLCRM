import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Home, CheckSquare, DollarSign, Users } from 'lucide-react';
import { getStorageItem } from '../utils/localStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { Transaction } from '../types/Transaction';
import { Contact } from '../types/Contact';
import { Task } from '../types/Task';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC = () => {
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: () => getStorageItem('crm_transactions', []),
  });

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: () => getStorageItem('crm_contacts', []),
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => getStorageItem('crm_tasks', []),
  });

  const dashboardData = useMemo(() => {
    const activeListings = transactions.filter(t => t.status === 'Active' && t.type === 'Listing').length;
    const pendingSales = transactions.filter(t => t.status === 'Pending').length;
    const totalRevenue = transactions
      .filter(t => t.status === 'Closed')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return { activeListings, pendingSales, totalRevenue };
  }, [transactions]);

  const activeClients = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return contacts.filter(contact => {
      const lastContactDate = new Date(contact.lastContact);
      return lastContactDate >= thirtyDaysAgo;
    }).length;
  }, [contacts]);

  // Overview chart data
  const overviewData = useMemo(() => [
    { name: 'Active Listings', value: dashboardData.activeListings },
    { name: 'Pending Sales', value: dashboardData.pendingSales },
    { name: 'Active Clients', value: activeClients },
  ], [dashboardData.activeListings, dashboardData.pendingSales, activeClients]);

  // Task status data
  const taskStatusData = useMemo(() => {
    const todo = tasks.filter(t => t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'inProgress').length;
    const done = tasks.filter(t => t.status === 'done').length;

    return [
      { name: 'To Do', value: todo },
      { name: 'In Progress', value: inProgress },
      { name: 'Done', value: done },
    ];
  }, [tasks]);

  // Transaction type data
  const transactionTypeData = useMemo(() => {
    const listings = transactions.filter(t => t.type === 'Listing').length;
    const closings = transactions.filter(t => t.type === 'Closing').length;
    const rentals = transactions.filter(t => t.type === 'Rental Listing').length;
    const leases = transactions.filter(t => t.type === 'Lease').length;

    return [
      { name: 'Listings', value: listings },
      { name: 'Closings', value: closings },
      { name: 'Rentals', value: rentals },
      { name: 'Leases', value: leases },
    ];
  }, [transactions]);

  // Custom tooltip formatter
  const formatTooltipValue = (value: number) => {
    return `${value} ${value === 1 ? 'item' : 'items'}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/transactions" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <Home className="text-blue-500 mr-4" size={24} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Listings</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{dashboardData.activeListings}</p>
            </div>
          </div>
        </Link>

        <Link to="/transactions?status=Pending" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <CheckSquare className="text-green-500 mr-4" size={24} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Sales</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{dashboardData.pendingSales}</p>
            </div>
          </div>
        </Link>

        <Link to="/transactions" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <DollarSign className="text-yellow-500 mr-4" size={24} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Closed Revenue</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                ${dashboardData.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </Link>

        <Link to="/contacts" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <Users className="text-purple-500 mr-4" size={24} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Clients</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{activeClients}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip 
                formatter={formatTooltipValue}
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                  border: 'none', 
                  borderRadius: '4px', 
                  color: '#F3F4F6' 
                }} 
              />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Task Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Transaction Types</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={transactionTypeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#718096" />
            <YAxis stroke="#718096" />
            <Tooltip 
              formatter={formatTooltipValue}
              contentStyle={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                border: 'none', 
                borderRadius: '4px', 
                color: '#F3F4F6' 
              }} 
            />
            <Legend />
            <Bar dataKey="value" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;