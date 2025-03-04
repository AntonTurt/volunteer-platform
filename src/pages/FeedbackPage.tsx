import { Navigation } from '../components/Navigation';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

export const FeedbackPage = () => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');

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
          <h2 className="text-2xl font-bold mb-6 text-center">Feedback Form</h2>
          
          <div className="text-center mb-8 text-gray-600">
            We'd love to know how your experience was during your last session. 
            Filling out this form will help us create a better environment and 
            experience for your future sessions!
          </div>

          <form className="space-y-6">
            {/* Rating Section */}
            <div className="space-y-4">
              <label className="block text-center text-gray-600">
                Overall, how satisfied were you with your last session?
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
                placeholder="Share your thoughts..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Submit
              </button>
            </div>

            {/* Terms */}
            <div className="text-center text-sm text-gray-500">
              By giving feedback, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors underline">Terms & Conditions</a>
              {' '}and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors underline">Privacy Policy</a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};