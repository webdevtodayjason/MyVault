import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LockScreen from '@/components/LockScreen';

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is already authenticated (from session)
    const authSession = sessionStorage.getItem('authenticated');
    if (authSession === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleUnlock = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('authenticated', 'true');
    
    // Set session timeout (30 minutes)
    setTimeout(() => {
      sessionStorage.removeItem('authenticated');
      setIsAuthenticated(false);
    }, 30 * 60 * 1000);
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to dashboard after authentication
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Show lock screen if not authenticated
  if (!isAuthenticated) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  // This won't be shown as we redirect to dashboard, but keeping for safety
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
        <p className="mt-4 glass-pink-glow">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default Index;