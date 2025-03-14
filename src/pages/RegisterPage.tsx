// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Building, KeySquare, AlertCircle, ArrowRight } from 'lucide-react';

// Company codes mapping - in production this would be in a secure database
const COMPANY_CODES: Record<string, string> = {
  "ABLAZE2025": "Ablaze Bristol",
  "ACME1234": "ACME Corporation",
  "GLOBE567": "Global Solutions Ltd",
  "TECH789": "Tech Innovations Inc",
  "METRO012": "Metro Partners"
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  
  // Verify company code
  const verifyCompanyCode = () => {
    // Reset any previous results
    setError('');
    setCompanyName('');
    setCodeVerified(false);
    
    // Check if code exists in our mapping
    if (companyCode && COMPANY_CODES[companyCode]) {
      setCompanyName(COMPANY_CODES[companyCode]);
      setCodeVerified(true);
    } else {
      setError('Invalid company code. Please check with your coordinator.');
    }
  };
  
  // Handle code input change
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase for consistency
    const value = e.target.value.toUpperCase();
    setCompanyCode(value);
    
    // Clear verification if code changes
    if (codeVerified) {
      setCodeVerified(false);
      setCompanyName('');
    }
  };
  
  // Registration handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validation
      if (!email || !password || !name) {
        throw new Error('Please fill in all required fields');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (!codeVerified) {
        throw new Error('Please verify your company code first');
      }

      // In a real implementation, this would call a registration API
      // For now, simulate a successful registration
      setTimeout(() => {
        // Create a mock user object
        const userData = {
          uid: Math.random().toString(36).substring(2, 10),
          email,
          displayName: name,
          role: 'volunteer',
          organization: companyName,
          companyCode: companyCode  // Store for future reference
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
            {/* Full Name */}
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

            {/* Email */}
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

            {/* Password */}
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
            
            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                disabled={isLoading}
                required
              />
            </div>

            {/* Company Code with Verification */}
            <div>
              <div className="relative flex">
                <div className="relative flex-grow">
                  <KeySquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Company Code"
                    value={companyCode}
                    onChange={handleCodeChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    disabled={isLoading || codeVerified}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={verifyCompanyCode}
                  className="px-4 py-3 bg-gray-100 text-gray-700 border border-gray-200 rounded-r-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !companyCode || codeVerified}
                >
                  Verify
                </button>
              </div>
              
              {/* Company name display when verified */}
              {codeVerified && (
                <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-lg flex items-center">
                  <Building className="text-green-500 w-4 h-4 mr-2" />
                  <span className="text-sm text-green-700">
                    Registered with: <span className="font-medium">{companyName}</span>
                  </span>
                </div>
              )}
              
              <p className="mt-1 text-xs text-gray-500">
                Enter the company code provided by your volunteer coordinator
              </p>
            </div>
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
            disabled={isLoading || !codeVerified}
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
            <p>Need a company code? Please contact Gilly.Samuddin@ablazebristol.org</p>
          </div>
        </form>
      </div>
    </div>
  );
};