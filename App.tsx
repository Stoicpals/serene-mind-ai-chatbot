
import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AuthPage } from './components/AuthPage';
import { ChatPage } from './components/ChatPage';
import { DashboardPage } from './components/DashboardPage';
import { JournalPage } from './components/JournalPage';
import { User, AuthContextType } from './types';
import { getCurrentUser, mockLogin, mockSignup, mockLogout } from './services/mockDataService';
import { LoadingSpinner } from './components/common/LoadingSpinner';

export const AuthContext = createContext<AuthContextType | null>(null);

// ProtectedRoute component
const ProtectedRoute: React.FC<{ user: User | null; isLoading: boolean }> = ({ user, isLoading }) => {
  const location = useLocation();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner text="Loading user..."/></div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};


function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoadingAuth(false);
  }, []);

  const handleLogin = (email: string, identifier?: string) => { // identifier can be password for login, or name for signup
    setIsLoadingAuth(true);
    // For signup, identifier is name; for login, it's password.
    // This is a simplified mock logic.
    let user: User | null = null;
    if (location.pathname === '/login') { // Crude check, better to pass type
        user = mockLogin(email, identifier); // identifier is password
    } else {
        user = mockSignup(email, identifier); // identifier is name (password can be added to mockSignup if needed)
    }
    
    if (user) {
      setCurrentUser(user);
    } else {
      // Handle login/signup failure (e.g., show error message)
      // For now, AuthPage handles its own errors.
      console.error("Login/Signup failed");
    }
    setIsLoadingAuth(false);
  };

  const handleLogout = () => {
    mockLogout();
    setCurrentUser(null);
  };

  const authContextValue: AuthContextType = {
    currentUser,
    login: handleLogin,
    logout: handleLogout,
    isLoading: isLoadingAuth,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="min-h-screen flex flex-col bg-neutral-100">
        <Navbar currentUser={currentUser} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={currentUser && !isLoadingAuth ? <Navigate to="/chat" /> : <AuthPage />} />
            <Route path="/signup" element={currentUser && !isLoadingAuth ? <Navigate to="/chat" /> : <AuthPage />} />
            
            <Route element={<ProtectedRoute user={currentUser} isLoading={isLoadingAuth} />}>
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:sessionId" element={<ChatPage />} /> {/* Optional: for specific session loading */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/journal" element={<JournalPage />} />
            </Route>
            
            <Route path="/" element={
              isLoadingAuth ? <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div> : 
              currentUser ? <Navigate to="/chat" /> : <Navigate to="/login" />
            } />
            <Route path="*" element={<Navigate to="/" />} /> {/* Fallback for unknown routes */}
          </Routes>
        </main>
        <footer className="py-4 text-center text-sm text-neutral-500 bg-neutral-200">
          SereneMind AI &copy; {new Date().getFullYear()}. For informational purposes only.
        </footer>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
    