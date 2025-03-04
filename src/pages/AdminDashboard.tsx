import { Navigation } from '../components/Navigation';
import { HelpCircle, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Volunteer {
  name: string;
  email: string;
  id: string;
  status: 'Checked In' | 'Not Checked In';
  company: string;
}

interface FeedbackEntry {
  id: string;
  volunteerName: string;
  rating: number;
  comment: string;
  date: string;
}

export const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data
  const mockVolunteers: Volunteer[] = [
    { name: 'John Doe', email: 'john@example.com', id: '001', status: 'Checked In', company: 'Company A' },
    { name: 'Jane Smith', email: 'jane@example.com', id: '002', status: 'Not Checked In', company: 'Company B' },
    { name: 'Mike Johnson', email: 'mike@example.com', id: '003', status: 'Checked In', company: 'Company A' },
  ];

  const mockFeedback: FeedbackEntry[] = [
    { id: '1', volunteerName: 'John Doe', rating: 5, comment: 'Great session!', date: '2025-01-29' },
    { id: '2', volunteerName: 'Jane Smith', rating: 4, comment: 'Very informative.', date: '2025-01-28' },
  ];

  // Calculate check-in statistics
  const checkedInCount = mockVolunteers.filter(v => v.status === 'Checked In').length;
  const pieData = [
    { name: 'Checked In', value: checkedInCount },
    { name: 'Not Checked In', value: mockVolunteers.length - checkedInCount },
  ];
  const COLORS = ['#4CAF50', '#f44336'];

  // Filter volunteers based on search and status
  const filteredVolunteers = mockVolunteers.filter(volunteer => {
    const matchesSearch = 
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      volunteer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* Title Banner */}
      <div className="bg-white shadow-soft p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Check-in Statistics and Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Check-in Statistics */}
          <div className="bg-white p-6 rounded-2xl shadow-soft">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Check-in Statistics</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                  <span>Checked In ({checkedInCount})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                  <span>Not Checked In ({mockVolunteers.length - checkedInCount})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white p-6 rounded-2xl shadow-soft">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Most Recent Feedback</h2>
            <div className="space-y-4">
              {mockFeedback.map((feedback) => (
                <div key={feedback.id} className="bg-primary-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800">{feedback.volunteerName}</span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Rating:</span>
                      <span className="font-medium text-gray-800">{feedback.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{feedback.comment}</p>
                  <p className="text-gray-400 text-xs mt-2">{feedback.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Volunteer Overview Table */}
        <div className="bg-white p-6 rounded-2xl shadow-soft">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Volunteer Overview</h2>
            <div className="flex space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search volunteers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="Checked In">Checked In</option>
                <option value="Not Checked In">Not Checked In</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary-50">
                  <th className="p-4 text-left text-gray-600">Name</th>
                  <th className="p-4 text-left text-gray-600">Email</th>
                  <th className="p-4 text-left text-gray-600">ID</th>
                  <th className="p-4 text-left text-gray-600">Check In Status</th>
                  <th className="p-4 text-left text-gray-600">Company</th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.map((volunteer) => (
                  <tr key={volunteer.id} className="border-t">
                    <td className="p-4 text-gray-800">{volunteer.name}</td>
                    <td className="p-4 text-gray-800">{volunteer.email}</td>
                    <td className="p-4 text-gray-800">{volunteer.id}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        volunteer.status === 'Checked In' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {volunteer.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-800">{volunteer.company}</td>
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