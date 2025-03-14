// src/pages/ReportsPage.tsx
import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { NotificationCenter } from '../components/NotificationCenter';
import { HelpCircle, Download, Calendar, Filter, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

interface Organization {
  name: string;
  hours: number;
  volunteers: number;
}

interface Volunteer {
  id: string;
  name: string;
  organization: string;
  hours: number;
}

interface DailyActivity {
  date: string;
  volunteers: number;
  hours: number;
}

export const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('month');
  const [organization, setOrganization] = useState('all');
  const [expandedSections, setExpandedSections] = useState({
    hoursByOrg: true,
    hoursByVolunteer: true,
    checkInActivity: false
  });
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [checkInActivity, setCheckInActivity] = useState<DailyActivity[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Load data from localStorage
  useEffect(() => {
    loadReportData();
    
    // Listen for report data updates
    window.addEventListener('reportDataUpdated', loadReportData);
    
    return () => {
      window.removeEventListener('reportDataUpdated', loadReportData);
    };
  }, []);
  
  const loadReportData = () => {
    try {
      const storedReportData = localStorage.getItem('reportData');
      if (storedReportData) {
        const reportData = JSON.parse(storedReportData);
        
        // Process organization data
        if (reportData.volunteerHours && reportData.volunteerHours.length > 0) {
          // Group by organization
          const orgMap = new Map<string, Organization>();
          
          for (const volunteer of reportData.volunteerHours) {
            const orgName = volunteer.organization || 'Unknown Organization';
            
            if (!orgMap.has(orgName)) {
              orgMap.set(orgName, {
                name: orgName,
                hours: 0,
                volunteers: 0
              });
            }
            
            const org = orgMap.get(orgName)!;
            org.hours += volunteer.hours || 0;
            org.volunteers += 1;
          }
          
          // Convert Map to Array
          const orgArray = Array.from(orgMap.values());
          setOrganizations(orgArray);
        } else {
          // Set default organization data if none exists
          setOrganizations([
            { name: 'Company A', hours: 156, volunteers: 8 },
            { name: 'Company B', hours: 84, volunteers: 5 },
            { name: 'Company C', hours: 112, volunteers: 6 }
          ]);
        }
        
        // Process volunteer data
        if (reportData.volunteerHours && reportData.volunteerHours.length > 0) {
          const volunteerData = reportData.volunteerHours.map((v: any) => ({
            id: v.id || Math.random().toString(36).substring(2, 10),
            name: v.name || 'Unnamed Volunteer',
            organization: v.organization || 'Unknown Organization',
            hours: v.hours || 0
          }));
          
          setVolunteers(volunteerData);
        } else {
          // Set default volunteer data if none exists
          setVolunteers([
            { id: '001', name: 'John Doe', organization: 'Company A', hours: 32 },
            { id: '002', name: 'Jane Smith', organization: 'Company B', hours: 28 },
            { id: '003', name: 'Mike Johnson', organization: 'Company A', hours: 24 }
          ]);
        }
        
        // Process daily activity
        if (reportData.dailyActivity && reportData.dailyActivity.length > 0) {
          const activityData = reportData.dailyActivity.map((day: any) => ({
            date: day.date || new Date().toISOString().split('T')[0],
            volunteers: day.volunteers || 0,
            hours: day.hours || 0
          }));
          
          // Sort by date descending
          activityData.sort((a: any, b: any) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          setCheckInActivity(activityData);
        } else {
          // Set default activity data if none exists
          setCheckInActivity([
            { date: '2025-01-29', volunteers: 12, hours: 36 },
            { date: '2025-01-28', volunteers: 8, hours: 24 },
            { date: '2025-01-27', volunteers: 10, hours: 30 }
          ]);
        }
      }
    } catch (error) {
      console.error('Error loading report data:', error);
      
      // Set default data on error
      setOrganizations([
        { name: 'Company A', hours: 156, volunteers: 8 },
        { name: 'Company B', hours: 84, volunteers: 5 },
        { name: 'Company C', hours: 112, volunteers: 6 }
      ]);
      
      setVolunteers([
        { id: '001', name: 'John Doe', organization: 'Company A', hours: 32 },
        { id: '002', name: 'Jane Smith', organization: 'Company B', hours: 28 },
        { id: '003', name: 'Mike Johnson', organization: 'Company A', hours: 24 }
      ]);
      
      setCheckInActivity([
        { date: '2025-01-29', volunteers: 12, hours: 36 },
        { date: '2025-01-28', volunteers: 8, hours: 24 },
        { date: '2025-01-27', volunteers: 10, hours: 30 }
      ]);
    }
  };

  const refreshData = () => {
    setIsRefreshing(true);
    loadReportData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Helper function to convert data to CSV format
  const convertToCSV = (objArray: any[], headers: string[]) => {
    // Create header row
    const headerRow = headers.join(',');
    
    // Create data rows
    const rows = objArray.map(item => {
      return headers.map(header => {
        // Handle case where property might contain commas
        const value = typeof item[header] === 'string' && item[header].includes(',') 
          ? `"${item[header]}"` 
          : item[header];
        return value;
      }).join(',');
    });
    
    // Combine header row and data rows
    return [headerRow, ...rows].join('\n');
  };

  // Function to download CSV file
  const downloadCSV = (reportType: string) => {
    let csvData = '';
    let filename = '';
    
    switch(reportType) {
      case 'organization-hours':
        // Prepare data for organizations export
        const orgHeaders = ['name', 'hours', 'volunteers', 'avgHoursPerVolunteer'];
        const orgData = organizations.map(org => ({
          ...org,
          avgHoursPerVolunteer: (org.hours / org.volunteers).toFixed(1)
        }));
        csvData = convertToCSV(orgData, orgHeaders);
        filename = 'organization-hours.csv';
        break;
        
      case 'volunteer-hours':
        // Prepare data for volunteers export
        const volunteerHeaders = ['id', 'name', 'organization', 'hours'];
        csvData = convertToCSV(
          organization === 'all' ? volunteers : volunteers.filter(v => v.organization === organization), 
          volunteerHeaders
        );
        filename = 'volunteer-hours.csv';
        break;
        
      case 'daily-activity':
        // Prepare data for daily activity export
        const activityHeaders = ['date', 'volunteers', 'hours'];
        const activityData = checkInActivity.map(day => ({
          ...day,
          date: day.date // Keep ISO format for easy sorting in spreadsheets
        }));
        csvData = convertToCSV(activityData, activityHeaders);
        filename = 'daily-activity.csv';
        break;
        
      default:
        console.error('Unknown report type');
        return;
    }
    
    // Create file for download
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    // Add to document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Apply organization filter to volunteers
  const filteredVolunteers = organization === 'all' 
    ? volunteers 
    : volunteers.filter(v => v.organization === organization);

  // Calculate totals for summary section
  const totalHours = filteredVolunteers.reduce((sum, v) => sum + v.hours, 0);
  const totalVolunteers = filteredVolunteers.length;

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
            <button 
              onClick={refreshData} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* Title Banner */}
      <div className="bg-white shadow-soft p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Volunteer Reports</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Report Filters</h2>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="text-gray-500 w-5 h-5" />
                <select 
                  className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-500 w-5 h-5" />
                <select 
                  className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                >
                  <option value="all">All Organizations</option>
                  {organizations.map(org => (
                    <option key={org.name} value={org.name}>{org.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Report Summary */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-50 p-4 rounded-xl text-center">
              <h3 className="text-sm text-gray-600 mb-1">Total Hours</h3>
              <p className="text-3xl font-bold text-primary-600">{totalHours}</p>
            </div>
            <div className="bg-primary-50 p-4 rounded-xl text-center">
              <h3 className="text-sm text-gray-600 mb-1">Total Volunteers</h3>
              <p className="text-3xl font-bold text-primary-600">{totalVolunteers}</p>
            </div>
            <div className="bg-primary-50 p-4 rounded-xl text-center">
              <h3 className="text-sm text-gray-600 mb-1">Average Hours/Volunteer</h3>
              <p className="text-3xl font-bold text-primary-600">
                {totalVolunteers ? (totalHours / totalVolunteers).toFixed(1) : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Hours by Organization */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => toggleSection('hoursByOrg')}>
              {expandedSections.hoursByOrg ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              <h2 className="text-lg font-semibold text-gray-800">Hours by Organization</h2>
            </div>
            <button 
              className="flex items-center space-x-1 bg-primary-50 hover:bg-primary-100 text-primary-600 px-3 py-1 rounded-md transition-colors"
              onClick={() => downloadCSV('organization-hours')}
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>

          {expandedSections.hoursByOrg && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left text-gray-600">Organization</th>
                    <th className="p-3 text-left text-gray-600">Total Hours</th>
                    <th className="p-3 text-left text-gray-600">Volunteers</th>
                    <th className="p-3 text-left text-gray-600">Avg. Hours/Volunteer</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.map((org, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3 font-medium">{org.name}</td>
                      <td className="p-3">{org.hours}</td>
                      <td className="p-3">{org.volunteers}</td>
                      <td className="p-3">{(org.hours / org.volunteers).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Hours by Volunteer */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => toggleSection('hoursByVolunteer')}>
              {expandedSections.hoursByVolunteer ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              <h2 className="text-lg font-semibold text-gray-800">Hours by Volunteer</h2>
            </div>
            <button 
              className="flex items-center space-x-1 bg-primary-50 hover:bg-primary-100 text-primary-600 px-3 py-1 rounded-md transition-colors"
              onClick={() => downloadCSV('volunteer-hours')}
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>

          {expandedSections.hoursByVolunteer && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left text-gray-600">Volunteer ID</th>
                    <th className="p-3 text-left text-gray-600">Name</th>
                    <th className="p-3 text-left text-gray-600">Organization</th>
                    <th className="p-3 text-left text-gray-600">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVolunteers.length > 0 ? (
                    filteredVolunteers.map((volunteer) => (
                      <tr key={volunteer.id} className="border-t">
                        <td className="p-3">{volunteer.id}</td>
                        <td className="p-3 font-medium">{volunteer.name}</td>
                        <td className="p-3">{volunteer.organization}</td>
                        <td className="p-3">{volunteer.hours}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-3 text-center text-gray-500">
                        No volunteers found for the selected filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Check-in Activity */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => toggleSection('checkInActivity')}>
              {expandedSections.checkInActivity ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              <h2 className="text-lg font-semibold text-gray-800">Daily Check-in Activity</h2>
            </div>
            <button 
              className="flex items-center space-x-1 bg-primary-50 hover:bg-primary-100 text-primary-600 px-3 py-1 rounded-md transition-colors"
              onClick={() => downloadCSV('daily-activity')}
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>

          {expandedSections.checkInActivity && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left text-gray-600">Date</th>
                    <th className="p-3 text-left text-gray-600">Volunteers Present</th>
                    <th className="p-3 text-left text-gray-600">Total Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {checkInActivity.length > 0 ? (
                    checkInActivity.map((day, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{new Date(day.date).toLocaleDateString()}</td>
                        <td className="p-3">{day.volunteers}</td>
                        <td className="p-3">{day.hours}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-3 text-center text-gray-500">
                        No activity data available for the selected filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};