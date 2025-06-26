
import { useState } from 'react';
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';
import { Dashboard } from '@/components/Dashboard';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [showRegister, setShowRegister] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {showRegister ? (
            <Register 
              onSwitchToLogin={() => setShowRegister(false)}
            />
          ) : (
            <Login 
              onSwitchToRegister={() => setShowRegister(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
