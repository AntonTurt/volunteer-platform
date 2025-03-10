// src/pages/OrganizationAnalyticsPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { NotificationCenter } from '../components/NotificationCenter';
import { HelpCircle, Users, Clock, BarChart2 } from 'lucide-react';
import { organizations } from '../data/organizations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const OrganizationAnalyticsPage = () => {
  const { orgId } = useParams();
  const [timeframe, setTimeframe] = useState('month');
  
  // Find organization details
  const organization = organizations.find(org => org.id === orgId) || {
    id: '',
    name: 'Unknown Organization',
    logo: ''
  };
  
  // Mock data for volunteer activity
  const activityData = [
    { week: 'Week 1', hours: 24 },
    { week: 'Week 2', hours: 18 },
    { week: 'Week 3', hours: 32 },
    { week: 'Week 4', hours: 27 }
  ];
  
  // Mock volunteer data
  const volunteers = [
    { id: '001', name: 'John Smith', hours: 12, sessions: 4 },
    { id: '002', name: 'Emily Johnson', hours: 8, sessions: 3 },
    { id: '003', name: 'Michael Davis', hours: 16, sessions: 5 },
    { id: '004', name: 'Sarah Wilson', hours: 6, sessions: 2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-soft p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Navigation />
            <img 
              src="/images/ablaze-logo.png" 
              alt="Ablaze" 
              className="h-10 object-contain" 
            />
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <NotificationCenter />
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* Organization Banner */}
      <div className="bg-white shadow-soft p-6">
        <div className="max-w-6xl mx-auto flex items-center space-x-4">
          {organization.logo ? (
            <img 
              src={organization.logo} 
              alt={organization.name} 
              className="h-12 w-12 object-contain"
            />
          ) : (
            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">{organization.name.charAt(0)}</span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-800">{organization.name} Analytics</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-soft">
            <div className="flex items-center space-x-4">
              <Users className="w-10 h-10 text-primary-600" />
              <div>
                <h2 className="text-sm text-gray-500">Active Volunteers</h2>
                <p className="text-2xl font-bold text-gray-800">{volunteers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-soft">
            <div className="flex items-center space-x-4">
              <Clock className="w-10 h-10 text-primary-600" />
              <div>
                <h2 className="text-sm text-gray-500">Total Hours</h2>
                <p className="text-2xl font-bold text-gray-800">
                  {volunteers.reduce((sum, v) => sum + v.hours, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-soft">
            <div className="flex items-center space-x-4">
              <BarChart2 className="w-10 h-10 text-primary-600" />
              <div>
                <h2 className="text-sm text-gray-500">Sessions</h2>
                <p className="text-2xl font-bold text-gray-800">
                  {volunteers.reduce((sum, v) => sum + v.sessions, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Activity Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-soft mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Volunteer Hours</h2>
          
          <div className="flex mb-4 space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                timeframe === 'week' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setTimeframe('week')}
            >
              Weekly
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                timeframe === 'month' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setTimeframe('month')}
            >
              Monthly
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                timeframe === 'quarter' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setTimeframe('quarter')}
            >
              Quarterly
            </button>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#0088FE" name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Volunteer List */}
        <div className="bg-white p-6 rounded-2xl shadow-soft">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Volunteers</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-gray-600">Name</th>
                  <th className="p-3 text-left text-gray-600">Hours</th>
                  <th className="p-3 text-left text-gray-600">Sessions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((volunteer) => (
                  <tr key={volunteer.id} className="border-t">
                    <td className="p-3 font-medium">{volunteer.name}</td>
                    <td className="p-3">{volunteer.hours}</td>
                    <td className="p-3">{volunteer.sessions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};