import React from 'react';
import { AlertCircle } from 'lucide-react';

const CalendarInstructions: React.FC = () => {
  return (
    <div className="mt-6 space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-start">
          <AlertCircle className="text-yellow-400 mt-0.5 mr-3" size={20} />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              Development Environment Notice
            </h3>
            <p className="mt-1 text-sm text-yellow-700">
              Google Calendar integration is not available in the development environment. 
              To use this feature, please deploy the application to a production environment 
              with proper OAuth credentials and domain configuration.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-xl font-semibold mb-4">Integration Setup Instructions</h2>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            To enable Google Calendar integration in your production environment:
          </p>
          
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Set up a Google Cloud Project</li>
            <li>Configure OAuth 2.0 credentials</li>
            <li>Add your production domain to authorized origins</li>
            <li>Update environment variables with your credentials</li>
          </ol>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Required Environment Variables:</h3>
            <pre className="bg-gray-50 p-4 rounded-md text-sm">
              <code>
                VITE_GOOGLE_CLIENT_ID=your_client_id{'\n'}
                VITE_GOOGLE_CLIENT_SECRET=your_client_secret{'\n'}
                VITE_GOOGLE_REDIRECT_URI=https://your-domain.com/google-callback
              </code>
            </pre>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Features Available in Production:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Calendar synchronization</li>
              <li>Event creation and management</li>
              <li>Automated scheduling</li>
              <li>Calendar availability checks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarInstructions;