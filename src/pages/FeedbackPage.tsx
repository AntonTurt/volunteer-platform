import { Navigation } from '../components/Navigation';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  fromCheckout?: boolean;
  sessionDate?: string;
  sessionHours?: number;
}

export const FeedbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isFromCheckout, setIsFromCheckout] = useState(false);
  const [sessionDate, setSessionDate] = useState('');
  const [sessionHours, setSessionHours] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Check if coming from check-out flow
    const state = location.state as LocationState;
    if (state?.fromCheckout) {
      setIsFromCheckout(true);
      setSessionDate(state.sessionDate || new Date().toLocaleDateString());
      setSessionHours(state.sessionHours || 0);
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate saving the feedback
    setTimeout(() => {
      setSubmitSuccess(true);
      
      // If coming from checkout, return to home after successful submission
      if (isFromCheckout) {
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      }
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
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* Title Banner */}
      <div className="bg-white shadow-soft p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Feedback</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-soft p-8">
          {isFromCheckout && (
            <div className="bg-primary-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-2">Session Complete!</h3>
              <p className="text-gray-700">
                You've checked out of your session on {sessionDate} ({sessionHours} hours).
                Please take a moment to share your feedback below.
              </p>
            </div>
          )}
          
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isFromCheckout ? 'Session Feedback' : 'Feedback Form'}
          </h2>
          
          <div className="text-center mb-8 text-gray-600">
            We'd love to know how your experience was during your {isFromCheckout ? 'recent' : 'last'} session. 
            Filling out this form will help us create a better environment and 
            experience for your future sessions!
          </div>

          {submitSuccess ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your feedback has been submitted successfully.</p>
              
              {isFromCheckout && (
                <p className="text-sm text-gray-500 mt-4">Returning to home page...</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Section */}
              <div className="space-y-4">
                <label className="block text-center text-gray-600">
                  Overall, how satisfied were you with your {isFromCheckout ? 'recent' : 'last'} session?
                </label>
                <div className="flex justify-center space-x-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        rating === value
                          ? 'bg-primary-600 text-white'
                          : 'bg-primary-100 text-gray-600 hover:bg-primary-200'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Very Dissatisfied</span>
                  <span>Very Satisfied</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-2">
                <label className="block text-center text-gray-600 mb-2">
                  Additional Comments
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Share your thoughts about today's session..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Submit Feedback
                </button>
              </div>

              {/* Back Button (only for checkout flow) */}
              {isFromCheckout && (
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/home')}
                    className="flex items-center text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Skip and return to home
                  </button>
                </div>
              )}

              {/* Terms */}
              <div className="text-center text-sm text-gray-500">
                By giving feedback, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors underline">Terms & Conditions</a>
                {' '}and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors underline">Privacy Policy</a>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};