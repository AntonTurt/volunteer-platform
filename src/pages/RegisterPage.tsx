// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Building, Search, ArrowRight, AlertCircle } from 'lucide-react';
import { organizations } from '../data/organizations';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [organizationSearch, setOrganizationSearch] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  
  // Registration code with organization code instead of search
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password || !organization) {
        throw new Error('Please enter all required fields');
      }

      // In a real implementation, this would call a registration API
      // For now, simulate a successful registration
      setTimeout(() => {
        // Create a mock user object
        const userData = {
          uid: Math.random().toString(36).substring(2, 10),
          email,
          displayName: name || email.split('@')[0],
          role: 'volunteer',
          organization
        };
        
        // Store in session storage for demo
        sessionStorage.setItem('user', JSON.stringify(userData));
        
        navigate('/home');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter organizations based on search term or organization code
  const filteredOrganizations = organizations.filter(org => {
    const searchTerm = organizationSearch.toLowerCase();
    return org.id.toLowerCase().includes(searchTerm) || 
           org.name.toLowerCase().includes(searchTerm);
  }).slice(0, 5); // Limit to first 5 results

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-soft w-full max-w-md p-8">
        <div className="w-32 h-32 mx-auto mb-6">
          <img 
            src="/images/ablaze-logo.png" 
            alt="Ablaze - Sparking Potential" 
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Your Account</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                disabled={isLoading}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                disabled={isLoading}
                required
              />
            </div>

            {/* Organization Search */}
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter company code or search"
                value={organizationSearch}
                onChange={(e) => {
                  setOrganizationSearch(e.target.value);
                  setShowOrgDropdown(true);
                }}
                onFocus={() => setShowOrgDropdown(true)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
              
              {/* Organization Dropdown */}
              {showOrgDropdown && organizationSearch.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {filteredOrganizations.length > 0 ? (
                    <ul>
                      {filteredOrganizations.map(org => (
                        <li 
                          key={org.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setOrganization(org.id);
                            setOrganizationSearch(org.name);
                            setShowOrgDropdown(false);
                          }}
                        >
                          {org.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      No matching companies found
                    </div>
                  )}
                </div>
              )}
              
              {/* Hidden organization field to store the selected ID */}
              <input
                type="hidden"
                value={organization}
                required
              />
            </div>
            
            {/* Display selected organization */}
            {organization && (
              <div className="bg-primary-50 py-2 px-3 rounded-lg text-sm">
                <span className="font-medium">Selected organization: </span>
                {organizations.find(org => org.id === organization)?.name || organization}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm rounded-lg p-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !organization}
          >
            <span>{isLoading ? 'Creating Account...' : 'Register'}</span>
            {!isLoading && (
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              Already have an account? Login
            </button>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-4">
            <p>Please contact your organization's coordinator if you don't know your company code.</p>
          </div>
        </form>
      </div>
    </div>
  );
};