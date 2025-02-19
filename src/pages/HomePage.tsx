import { Navigation } from '../components/Navigation';
import { HelpCircle, User, Clock, CheckCircle, ArrowRight } from 'lucide-react'; // Added ArrowRight

export const HomePage = () => {
  const mockData = {
    name: "Samuel Robberts",
    volunteerId: "20168129",
    email: "Example@gmail.com",
    organization: "Company Name",
    hoursLogged: "32 Hours",
    checkInStatus: "Not Checked In",
    upcomingSession: {
      date: "31/01/25",
      time: "11:00 - 13:00"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-soft p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Navigation />
            <span className="text-xl font-bold text-primary-600">Logo</span>
          </div>
          
          <div className="flex items-center space-x-4 text-gray-600">
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
                <CheckCircle className="w-8 h-8 text-red-500" />
                <div>
                  <span className="text-gray-600">Check-in Status</span>
                  <div className="font-bold text-2xl text-red-500">{mockData.checkInStatus}</div>
                </div>
              </div>
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
            <button className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2">
              <span>Check-In</span>
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
    </div>
  );
};