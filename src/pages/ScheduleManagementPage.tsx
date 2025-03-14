// src/pages/ScheduleManagementPage.tsx
import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { 
  HelpCircle, 
  Search, 
  Calendar, 
  Plus, 
  Edit, 
  Save, 
  Trash2, 
  Users, 
  X, 
  Check 
} from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  organization: string;
}

interface ScheduleSession {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description?: string;
  assignedVolunteers: string[]; // Array of volunteer IDs
}

export const ScheduleManagementPage = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [schedules, setSchedules] = useState<ScheduleSession[]>([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  
  // Form state for creating/editing schedules
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleSession | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    assignedVolunteers: [] as string[]
  });
  
  // Load data
  useEffect(() => {
    loadData();
  }, []);
  
  // Filter volunteers when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = volunteers.filter(v => 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.organization.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVolunteers(filtered);
    } else {
      setFilteredVolunteers(volunteers);
    }
  }, [searchTerm, volunteers]);
  
  const loadData = () => {
    // Load volunteers
    try {
      const storedData = localStorage.getItem('reportData');
      if (storedData) {
        const data = JSON.parse(storedData);
        if (data.volunteerHours) {
          const vols = data.volunteerHours.map((v: any) => ({
            id: v.id,
            name: v.name,
            email: v.email || 'unknown@example.com',
            organization: v.organization
          }));
          setVolunteers(vols);
          setFilteredVolunteers(vols);
        }
      }
      
      // Load schedules
      const storedSchedules = localStorage.getItem('volunteerSchedules');
      if (storedSchedules) {
        setSchedules(JSON.parse(storedSchedules));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  
  const saveSchedule = () => {
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Generate ID if new schedule
    const scheduleId = formData.id || Date.now().toString();
    const updatedSchedule = { ...formData, id: scheduleId };
    
    let updatedSchedules;
    if (editingSchedule) {
      // Update existing schedule
      updatedSchedules = schedules.map(s => 
        s.id === editingSchedule.id ? updatedSchedule : s
      );
    } else {
      // Add new schedule
      updatedSchedules = [...schedules, updatedSchedule];
    }
    
    // Save to localStorage
    setSchedules(updatedSchedules);
    localStorage.setItem('volunteerSchedules', JSON.stringify(updatedSchedules));
    
    // Reset form
    resetForm();
  };
  
  const deleteSchedule = (id: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      const updatedSchedules = schedules.filter(s => s.id !== id);
      setSchedules(updatedSchedules);
      localStorage.setItem('volunteerSchedules', JSON.stringify(updatedSchedules));
    }
  };
  
  const editSchedule = (schedule: ScheduleSession) => {
    setEditingSchedule(schedule);
    setFormData(schedule);
    setIsFormOpen(true);
  };
  
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      assignedVolunteers: []
    });
    setEditingSchedule(null);
    setIsFormOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const toggleVolunteerAssignment = (volunteerId: string) => {
    if (formData.assignedVolunteers.includes(volunteerId)) {
      // Remove volunteer
      setFormData({
        ...formData,
        assignedVolunteers: formData.assignedVolunteers.filter(id => id !== volunteerId)
      });
    } else {
      // Add volunteer
      setFormData({
        ...formData,
        assignedVolunteers: [...formData.assignedVolunteers, volunteerId]
      });
    }
  };
  
  // Export schedules to CSV
  const exportSchedules = () => {
    // Convert schedules to CSV format
    const headers = ['Title', 'Date', 'Start Time', 'End Time', 'Location', 'Description', 'Assigned Volunteers'];
    const rows = schedules.map(schedule => {
      const volunteerNames = schedule.assignedVolunteers
        .map(id => {
          const volunteer = volunteers.find(v => v.id === id);
          return volunteer ? volunteer.name : 'Unknown';
        })
        .join(', ');
      
      return [
        schedule.title,
        schedule.date,
        schedule.startTime,
        schedule.endTime,
        schedule.location,
        schedule.description || '',
        volunteerNames
      ].map(value => `"${value}"`).join(',');
    });
    
    const csv = [headers.join(','), ...rows].join('\n');
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'volunteer-schedules.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Import schedules from CSV
  const importSchedules = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        // Parse CSV rows
        const parsedSchedules: ScheduleSession[] = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',').map(v => v.replace(/^"(.*)"$/, '$1'));
          const volunteerNames = values[6].split(',').map(name => name.trim());
          
          // Find volunteer IDs by name
          const volunteerIds = volunteerNames.map(name => {
            const volunteer = volunteers.find(v => v.name === name);
            return volunteer ? volunteer.id : '';
          }).filter(Boolean);
          
          parsedSchedules.push({
            id: Date.now().toString() + i,
            title: values[0],
            date: values[1],
            startTime: values[2],
            endTime: values[3],
            location: values[4],
            description: values[5],
            assignedVolunteers: volunteerIds
          });
        }
        
        // Merge with existing schedules
        const updatedSchedules = [...schedules, ...parsedSchedules];
        setSchedules(updatedSchedules);
        localStorage.setItem('volunteerSchedules', JSON.stringify(updatedSchedules));
        
        alert(`Successfully imported ${parsedSchedules.length} schedules`);
      } catch (error) {
        console.error('Error importing schedules:', error);
        alert('Error importing schedules. Please check the file format.');
      }
    };
    
    reader.readAsText(file);
  };
  
  const getVolunteerSchedules = (volunteerId: string) => {
    return schedules.filter(s => s.assignedVolunteers.includes(volunteerId));
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
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* Title Banner */}
      <div className="bg-white shadow-soft p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Schedule Management</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Volunteers */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Volunteers</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search volunteers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full"
                  />
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredVolunteers.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {filteredVolunteers.map((volunteer) => (
                      <li 
                        key={volunteer.id}
                        className={`py-3 px-2 cursor-pointer hover:bg-gray-50 rounded transition-colors ${
                          selectedVolunteer?.id === volunteer.id ? 'bg-primary-50' : ''
                        }`}
                        onClick={() => setSelectedVolunteer(volunteer)}
                      >
                        <div className="font-medium">{volunteer.name}</div>
                        <div className="text-sm text-gray-500">{volunteer.email}</div>
                        <div className="text-xs text-gray-400">{volunteer.organization}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No volunteers found
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Schedules/Details */}
          <div className="md:col-span-2">
            {/* Schedule Controls */}
            <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary-500" />
                  Schedules
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-primary-600 text-white px-3 py-2 rounded flex items-center space-x-1 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Schedule</span>
                  </button>
                  
                  <button
                    onClick={exportSchedules}
                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm"
                  >
                    Export
                  </button>
                  
                  <label className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm cursor-pointer">
                    Import
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={importSchedules}
                    />
                  </label>
                </div>
              </div>
              
              {/* Schedule Form */}
              {isFormOpen && (
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">
                      {editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}
                    </h3>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title*
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date*
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time*
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time*
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md h-20"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign Volunteers
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                      {volunteers.length > 0 ? (
                        <ul className="divide-y divide-gray-100">
                          {volunteers.map((volunteer) => (
                            <li 
                              key={volunteer.id}
                              className="py-2 px-3 flex justify-between items-center hover:bg-gray-50"
                            >
                              <div>
                                <div className="font-medium">{volunteer.name}</div>
                                <div className="text-xs text-gray-500">{volunteer.organization}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleVolunteerAssignment(volunteer.id)}
                                className={`w-6 h-6 flex items-center justify-center rounded-full ${
                                  formData.assignedVolunteers.includes(volunteer.id)
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {formData.assignedVolunteers.includes(volunteer.id) ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          No volunteers available
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-200 rounded-md text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveSchedule}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md flex items-center space-x-1"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* All Schedules List */}
              <div>
                <h3 className="font-medium mb-2">All Schedules</h3>
                {schedules.length > 0 ? (
                  <div className="space-y-3">
                    {schedules.map((schedule) => (
                      <div 
                        key={schedule.id}
                        className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium">{schedule.title}</h4>
                          <div className="space-x-1">
                            <button
                              onClick={() => editSchedule(schedule)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteSchedule(schedule.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 text-sm mt-2">
                          <div className="text-gray-500">Date:</div>
                          <div>{schedule.date}</div>
                          <div className="text-gray-500">Time:</div>
                          <div>{schedule.startTime} - {schedule.endTime}</div>
                          <div className="text-gray-500">Location:</div>
                          <div>{schedule.location}</div>
                        </div>
                        {schedule.description && (
                          <div className="mt-2 text-sm">
                            <div className="text-gray-500">Description:</div>
                            <div className="text-gray-700">{schedule.description}</div>
                          </div>
                        )}
                        <div className="mt-2 flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">
                            {schedule.assignedVolunteers.length} volunteers assigned
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4 border border-dashed border-gray-300 rounded-lg">
                    No schedules created yet
                  </div>
                )}
              </div>
            </div>
            
            {/* Volunteer Details */}
            {selectedVolunteer && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">{selectedVolunteer.name}'s Schedule</h2>
                  <div className="text-sm text-gray-500">{selectedVolunteer.organization}</div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-sm text-gray-500 mb-2">Assigned Sessions</h3>
                  {getVolunteerSchedules(selectedVolunteer.id).length > 0 ? (
                    <div className="space-y-2">
                      {getVolunteerSchedules(selectedVolunteer.id).map((schedule) => (
                        <div 
                          key={schedule.id}
                          className="bg-primary-50 p-3 rounded-lg"
                        >
                          <div className="font-medium">{schedule.title}</div>
                          <div className="text-sm">
                            <span className="text-gray-600">Date:</span> {schedule.date}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Time:</span> {schedule.startTime} - {schedule.endTime}
                          </div>
                          {schedule.location && (
                            <div className="text-sm">
                              <span className="text-gray-600">Location:</span> {schedule.location}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4 border border-dashed border-gray-300 rounded-lg">
                      No sessions assigned yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};