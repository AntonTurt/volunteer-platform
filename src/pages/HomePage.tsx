// src/pages/HomePage.tsx
import { useState, useEffect, useRef } from 'react';
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
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const checkoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
  
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
    
    // Check if there's an active session in storage
    const activeSessionString = sessionStorage.getItem('activeSession');
    if (activeSessionString) {
      try {
        const activeSession = JSON.parse(activeSessionString);
        if (activeSession.active) {
          const startTime = new Date(activeSession.startTime);
          setSessionStartTime(startTime);
          setCheckInStatus('Checked In');
          
          // Calculate how much time is left in the session
          const elapsedTime = Date.now() - startTime.getTime();
          const timeLeft = Math.max(0, SESSION_DURATION - elapsedTime);
          
          if (timeLeft > 0) {
            // Still has time left - set up the auto-checkout
            setRemainingTime(Math.floor(timeLeft / 1000));
            startCheckoutTimer(timeLeft);
          } else {
            // Session already expired - perform auto-checkout
            handleAutoCheckout();
          }
        }
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    }
    
    // Cleanup timer on component unmount
    return () => {
      if (checkoutTimerRef.current) {
        clearTimeout(checkoutTimerRef.current);
      }
    };
  }, []);
  
  // Update the remaining time countdown every second
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | null = null;
    
    if (checkInStatus === 'Checked In' && remainingTime !== null && remainingTime > 0) {
      countdownInterval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [checkInStatus, remainingTime]);
  
  // Start the auto-checkout timer
  const startCheckoutTimer = (timeLeft: number) => {
    // Clear any existing timer
    if (checkoutTimerRef.current) {
      clearTimeout(checkoutTimerRef.current);
    }
    
    // Set up new timer
    checkoutTimerRef.current = setTimeout(() => {
      handleAutoCheckout();
    }, timeLeft);
  };
  
  // Handle automatic checkout after 30 minutes
  const handleAutoCheckout = () => {
    console.log('Auto checkout triggered');
    setCheckInStatus('Not Checked In');
    setSessionStartTime(null);
    setRemainingTime(null);
    
    // Update report data with the fixed 30-minute duration
    updateReportData(0.5);
    
    // Clear the active session
    sessionStorage.removeItem('activeSession');
    
    // Navigate to feedback
    navigate('/feedback', { 
      state: { 
        fromCheckout: true,
        sessionDate: new Date().toLocaleDateString(),
        sessionHours: 0.5, // Fixed 30-minute duration
        isAutoCheckout: true
      } 
    });
  };
  
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
      if (checkInStatus === 'Checked In') {
        // Manual checkout - always use a fixed 30 minute duration
        const sessionDuration = 0.5; // 30 minutes in hours
        
        // Clear any existing timer
        if (checkoutTimerRef.current) {
          clearTimeout(checkoutTimerRef.current);
          checkoutTimerRef.current = null;
        }
        
        // Clear the active session
        sessionStorage.removeItem('activeSession');
        
        // Update UI
        setCheckInStatus('Not Checked In');
        setSessionStartTime(null);
        setRemainingTime(null);
        
        // Update report data with the fixed 30-minute duration
        updateReportData(sessionDuration);
        
        // Navigate to feedback with fixed duration
        navigate('/feedback', { 
          state: { 
            fromCheckout: true,
            sessionDate: new Date().toLocaleDateString(),
            sessionHours: sessionDuration, // Fixed 30 minute duration
            isAutoCheckout: false
          } 
        });
      } else {
        // Checking in - record start time
        const now = new Date();
        setSessionStartTime(now);
        setRemainingTime(SESSION_DURATION / 1000); // Set countdown in seconds
        
        // Start the auto-checkout timer
        startCheckoutTimer(SESSION_DURATION);
        
        // Store the session info
        const sessionInfo = {
          active: true,
          startTime: now.toISOString(),
        };
        sessionStorage.setItem('activeSession', JSON.stringify(sessionInfo));
        
        // Update UI
        setCheckInStatus('Checked In');
      }
      setIsLoading(false);
    }, 1000);
  };

  // Format the remaining time for display
  const formatRemainingTime = () => {
    if (remainingTime === null) return "";
    
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Update report data
  const updateReportData = (duration: number) => {
    try {
      // Get existing report data or initialize if not present
      const storedReportData = localStorage.getItem('reportData');
      let reportData = storedReportData ? JSON.parse(storedReportData) : {
        dailyActivity: [],
        volunteerHours: [],
        sessions: [],
        feedback: []
      };
      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      
      // 1. Update daily activity report
      const existingDayIndex = reportData.dailyActivity.findIndex(day => day.date === today);
      if (existingDayIndex >= 0) {
        // Update existing day
        reportData.dailyActivity[existingDayIndex].volunteers += 1;
        reportData.dailyActivity[existingDayIndex].hours += duration;
      } else {
        // Add new day
        reportData.dailyActivity.push({
          date: today,
          volunteers: 1,
          hours: duration
        });
      }
      
      // Sort by date (newest first)
      reportData.dailyActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // 2. Update volunteer hours report
      const existingVolunteerIndex = reportData.volunteerHours.findIndex(v => 
        v.id === user.uid || v.email === user.email
      );
      
      if (existingVolunteerIndex >= 0) {
        // Update existing volunteer
        reportData.volunteerHours[existingVolunteerIndex].hours += duration;
        reportData.volunteerHours[existingVolunteerIndex].sessions += 1;
      } else {
        // Add new volunteer
        reportData.volunteerHours.push({
          id: user.uid || Math.random().toString(36).substring(2, 10),
          name: user.displayName || 'Volunteer',
          email: user.email || 'unknown@example.com',
          organization: user.organization || 'Unknown Organization',
          hours: duration,
          sessions: 1
        });
      }
      
      // 3. Add detailed session information
      const sessionId = Math.random().toString(36).substring(2, 10);
      reportData.sessions.push({
        id: sessionId,
        volunteerId: user.uid,
        volunteerName: user.displayName || 'Volunteer',
        volunteerEmail: user.email,
        organization: user.organization,
        date: today,
        time: new Date().toLocaleTimeString(),
        duration: duration,
        checkInTime: sessionStartTime ? sessionStartTime.toISOString() : new Date().toISOString(),
        checkOutTime: new Date().toISOString()
      });
      
      // Store updated report data
      localStorage.setItem('reportData', JSON.stringify(reportData));
      
      // Store the session ID in session storage for feedback linkage
      sessionStorage.setItem('lastSessionId', sessionId);
      
      // Dispatch an event to notify the Reports page if it's open
      const reportUpdateEvent = new CustomEvent('reportDataUpdated');
      window.dispatchEvent(reportUpdateEvent);
      
    } catch (error) {
      console.error('Error updating report data:', error);
    }
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
                  {checkInStatus === 'Checked In' && remainingTime !== null && (
                    <div className="text-sm text-gray-600 mt-1">
                      Auto-checkout in: <span className="font-medium">{formatRemainingTime()}</span>
                    </div>
                  )}
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
                    <td className="p-3">0.5</td>
                    <td className="p-3">Career mentoring session</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Jan 18, 2025</td>
                    <td className="p-3">0.5</td>
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