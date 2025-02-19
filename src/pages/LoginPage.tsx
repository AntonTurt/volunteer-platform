import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Invalid email or password');
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-soft w-full max-w-md p-8">
        {/* Logo Circle */}
        <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-8 shadow-soft">
          <span className="text-2xl text-primary-600 font-bold">Logo</span>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Welcome Back</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Username/email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 group"
          >
            <span>Login</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="text-center">
            <a href="#" className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
              Forgot Password?
            </a>
          </div>

          <div className="text-center text-sm text-gray-500">
            By logging in, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors">Terms & Conditions</a>
            {' '}and{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors">Privacy Policy</a>
          </div>
        </form>
      </div>
    </div>
  );
};