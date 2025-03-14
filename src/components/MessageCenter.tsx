import { useState } from 'react';
import { MessageCircle, X, Mail } from 'lucide-react';

export const MessageCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const contactEmail = "Gilly.Samuddin@ablazebristol.org";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        aria-label="Contact Information"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Need Help?</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <p className="text-gray-600">
              If you need any assistance or have questions about your volunteering, please contact us via email:
            </p>
            
            <div className="flex items-center p-3 bg-primary-50 rounded-lg">
              <Mail className="text-primary-600 w-5 h-5 mr-2 flex-shrink-0" />
              <a 
                href={`mailto:${contactEmail}`}
                className="text-primary-600 hover:text-primary-800 font-medium truncate"
              >
                {contactEmail}
              </a>
            </div>
            
            <p className="text-sm text-gray-500">
              Our team will respond to your inquiry as soon as possible.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};