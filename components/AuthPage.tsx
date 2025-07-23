
import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
// Fix: Import AuthContextType from '../types'
import { AuthContext } from '../App'; 
import type { AuthContextType } from '../types';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { APP_NAME } from '../constants';

export const AuthPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!auth) {
    // This should ideally not happen if AuthContext is provided at the root
    return <p>Error: Auth context not available.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLoginPage) {
        auth.login(email, password); // mockDataService handles actual login
      } else {
        auth.login(email, name); // Use name for signup logic within login
      }
      // The AuthContext's login function should handle navigation on success
      // For this mock, we assume login updates currentUser which triggers redirect in App.tsx or ProtectedRoute
      // If not, navigate manually after a slight delay for state update
      setTimeout(() => navigate('/chat'), 100);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  React.useEffect(() => {
    if (auth.currentUser) {
      navigate('/chat');
    }
  }, [auth.currentUser, navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900">
            {isLoginPage ? 'Sign in to your account' : `Create an account with ${APP_NAME}`}
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600">
            Or{' '}
            {isLoginPage ? (
              <Link to="/signup" className="font-medium text-primary hover:text-blue-500">
                create a new account
              </Link>
            ) : (
              <Link to="/login" className="font-medium text-primary hover:text-blue-500">
                sign in to your existing account
              </Link>
            )}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLoginPage && (
            <Input
              id="name"
              name="name"
              type="text"
              label="Full Name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          )}
          <Input
            id="email-address"
            name="email"
            type="email"
            label="Email address"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete={isLoginPage ? "current-password" : "new-password"}
            required={isLoginPage} // Password optional for signup in this mock
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <Button type="submit" className="w-full" isLoading={isLoading || auth.isLoading} variant="primary">
              {isLoginPage ? 'Sign in' : 'Create account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};