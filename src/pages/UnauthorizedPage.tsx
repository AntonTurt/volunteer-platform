// src/pages/UnauthorizedPage.tsx
import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-soft w-full max-w-md p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-red-500">!</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
        
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. 
          Please contact an administrator if you believe this is an error.
        </p>
        
        <button
          onClick={() => navigate('/home')}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};