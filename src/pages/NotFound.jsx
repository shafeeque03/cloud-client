import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertCircle, 
  Search, 
  Home, 
  ArrowLeft, 
  Compass, 
  CloudOff,
  FolderOpen
} from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  
  // Optional animation on component mount
  useEffect(() => {
    // You could add any mount animations here if needed
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl mx-auto text-center">
        {/* Animated Cloud Icon */}
        <div className="mb-8 relative">
          <CloudOff className="h-32 w-32 mx-auto text-blue-400 opacity-80" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            <FolderOpen className="h-16 w-16 mt-2 text-blue-500 animate-pulse" />
          </div>
        </div>
        
        {/* Error Status */}
        <h1 className="text-9xl font-bold text-blue-600 mb-2 tracking-tighter">404</h1>
        
        {/* Error Message */}
        <div className="flex items-center justify-center mb-6">
          <AlertCircle className="h-6 w-6 text-amber-500 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
        </div>
        
        {/* Error Description */}
        <p className="text-gray-600 max-w-md mx-auto mb-10">
          Sorry, the file or folder you're looking for doesn't exist in your cloud storage. 
          It may have been moved, deleted, or never existed in the first place.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-200 flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-lg shadow-sm transition duration-200 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>

      </div>
      
      {/* Footer */}
      <div className="mt-16 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} CloudStore. All rights reserved.
      </div>
    </div>
  );
};

export default NotFound;