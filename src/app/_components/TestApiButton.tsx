"use client";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/services/api';

const TestApiButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testProfileApi = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await api.get('/profile');
      setResult({
        success: true,
        data: response.data,
        status: response.status
      });
      toast.success('API call successful!');
    } catch (error: any) {
      console.error('API Test Error:', error);
      setResult({
        success: false,
        error: error.message,
        status: error.response?.status || 'No response',
        details: error.response?.data || 'No details available'
      });
      toast.error(`API call failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-white">
      <h3 className="text-lg font-medium mb-2">Test API Integration</h3>
      <p className="text-sm text-gray-600 mb-4">This will test the connection to the profile API endpoint.</p>
      
      <button
        onClick={testProfileApi}
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Testing...
          </>
        ) : (
          'Test Profile API'
        )}
      </button>
      
      {result && (
        <div className="mt-4">
          <h4 className="font-medium mb-1">Result:</h4>
          <div className={`p-3 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="font-medium">{result.success ? 'Success' : 'Error'}</div>
            <div className="text-sm mt-1">Status: {result.status}</div>
            {result.success ? (
              <pre className="mt-2 bg-black bg-opacity-5 p-2 rounded text-xs overflow-auto max-h-64">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            ) : (
              <>
                <div className="text-sm mt-1">Message: {result.error}</div>
                {result.details && (
                  <pre className="mt-2 bg-black bg-opacity-5 p-2 rounded text-xs overflow-auto max-h-64">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestApiButton;