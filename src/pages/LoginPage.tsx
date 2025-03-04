import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

// Demo credentials
const USERS = [
  { email: "admin@example.com", password: "password123", role: "admin", name: "Admin User" },
  { email: "volunteer@example.com", password: "volunteer123", role: "volunteer", name: "John Volunteer" }
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(USERS[0].email); // Pre-filled for demo
  const [password, setPassword] = useState(USERS[0].password); // Pre-filled for demo
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      // Find the user with matching credentials
      const user = USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Create a user session with role information
        const userData = {
          uid: email.split('@')[0] + "123",
          email: email,
          displayName: user.name,
          role: user.role
        };
        
        // Store user in sessionStorage for persistence
        sessionStorage.setItem('user', JSON.stringify(userData));
        
        // Wait to simulate network request
        setTimeout(() => {
          setIsLoading(false);
          navigate('/home');
        }, 800);
      } else {
        // Invalid credentials
        setTimeout(() => {
          setError('Invalid email or password');
          setIsLoading(false);
        }, 800);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    // Same as before
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setSuccessMessage('');
    setIsResetting(true);

    // Simulate password reset
    setTimeout(() => {
      setSuccessMessage('Password reset email sent! Please check your inbox.');
      setIsResetting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-soft w-full max-w-md p-8">
      <div className="w-32 h-32 mx-auto mb-8">
        <img 
          src="/images/ablaze-logo.png" 
          alt="Ablaze - Sparking Potential" 
          className="w-full h-full object-contain"
        />
      </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Welcome Back</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rest of the form remains the same */}
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                disabled={isLoading || isResetting}
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
                disabled={isLoading || isResetting}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm rounded-lg p-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 text-green-500 text-sm rounded-lg p-3">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || isResetting}
          >
            <span>{isLoading ? 'Logging in...' : 'Login'}</span>
            {!isLoading && (
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            )}
          </button>

          <div className="flex justify-between items-center text-sm">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || isResetting}
            >
              {isResetting ? 'Sending...' : 'Forgot Password?'}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            <p className="font-medium">Demo credentials:</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold">Admin</p>
                <p>admin@example.com</p>
                <p>password123</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold">Volunteer</p>
                <p>volunteer@example.com</p>
                <p>volunteer123</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};