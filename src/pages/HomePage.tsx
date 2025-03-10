// src/pages/HomePage.tsx (partial update)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { NotificationCenter } from '../components/NotificationCenter';
import { MessageCenter } from '../components/MessageCenter';
import { HelpCircle, User, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const [checkInStatus, setCheckInStatus] = useState('Not Checked In');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('Volunteer');
  const [userRole, setUserRole] = useState('volunteer');
  
  useEffect(() => {
    // Get user information from session storage
    const userString = sessionStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserName(user.displayName || 'Volunteer');
        setUserRole(user.role || 'volunteer');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  
  // Mock data for the demo - now using the name from session if available
  const mockData = {
    name: userName,
    volunteerId: userRole === 'admin' ? "ADMIN123" : "VOL456",
    email: userRole === 'admin' ? "admin@example.com" : "volunteer@example.com",
    organization: userRole === 'admin' ? "Volunteer Hub Admin" : "Company A",
    hoursLogged: "32 Hours",
    upcomingSession: {
      date: "31/01/25",
      time: "11:00 - 13:00"
    }
  };

  const handleCheckInOut = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // If checking out, redirect to feedback page
      if (checkInStatus === 'Checked In') {
        setCheckInStatus('Not Checked In');
        navigate('/feedback', { 
          state: { 
            fromCheckout: true,
            sessionDate: new Date().toLocaleDateString(),
            sessionHours: 2.5, // Example hours for the session
          } 
        });
      } else {
        // Just checking in
        setCheckInStatus('Checked In');
      }
      setIsLoading(false);
    }, 1000);
  };

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
            <span>Homepage</span>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="bg-white shadow-soft p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back, {mockData.name}</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-soft p-8">
          {/* Profile Section */}
          <div className="flex items-center space-x-8 mb-8">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center shadow-soft">
              <User className="w-12 h-12 text-primary-600" />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">Name</span>
                <span className="font-medium text-gray-800">{mockData.name}</span>
                
                <span className="text-gray-600">Volunteer ID</span>
                <span className="font-medium text-gray-800">{mockData.volunteerId}</span>
                
                <span className="text-gray-600">Email Address</span>
                <span className="font-medium text-gray-800">{mockData.email}</span>
                
                <span className="text-gray-600">Organisation Name</span>
                <span className="font-medium text-gray-800">{mockData.organization}</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-primary-50 p-6 rounded-2xl shadow-soft">
              <div className="flex items-center space-x-4">
                <Clock className="w-8 h-8 text-primary-600" />
                <div>
                  <span className="text-gray-600">Hours Logged</span>
                  <div className="font-bold text-2xl text-gray-800">{mockData.hoursLogged}</div>
                </div>
              </div>
            </div>
            <div className="bg-primary-50 p-6 rounded-2xl shadow-soft">
              <div className="flex items-center space-x-4">
                <CheckCircle className={`w-8 h-8 ${checkInStatus === 'Checked In' ? 'text-green-500' : 'text-red-500'}`} />
                <div>
                  <span className="text-gray-600">Check-in Status</span>
                  <div className={`font-bold text-2xl ${checkInStatus === 'Checked In' ? 'text-green-500' : 'text-red-500'}`}>
                    {checkInStatus}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Session History */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Session History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Hours</th>
                    <th className="p-3 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sample entries - would be dynamic in real implementation */}
                  <tr className="border-t">
                    <td className="p-3">Jan 25, 2025</td>
                    <td className="p-3">2.5</td>
                    <td className="p-3">Career mentoring session</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Jan 18, 2025</td>
                    <td className="p-3">3.0</td>
                    <td className="p-3">Skills workshop</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Session */}
          <div className="bg-primary-50 p-6 rounded-2xl shadow-soft">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Upcoming Session</span>
              <span className="text-gray-600">Duration</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium text-gray-800">{mockData.upcomingSession.date}</span>
              <span className="font-medium text-gray-800">{mockData.upcomingSession.time}</span>
            </div>
            <button 
              className={`w-full ${
                checkInStatus === 'Checked In' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-600 hover:bg-primary-700'
              } text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2`}
              onClick={handleCheckInOut}
              disabled={isLoading}
            >
              <span>{isLoading 
                ? 'Processing...' 
                : checkInStatus === 'Checked In' 
                  ? 'Check-Out' 
                  : 'Check-In'
              }</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Terms */}
          <div className="text-center text-sm text-gray-500 mt-6">
            By checking in, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors underline">Terms & Conditions</a>
            {' '}and{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors underline">Privacy Policy</a>
          </div>
        </div>
      </main>
      
      <MessageCenter />
    </div>
  );
};