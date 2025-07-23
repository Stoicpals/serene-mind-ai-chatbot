
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../constants';
import { User } from '../types';
import { Button } from './common/Button';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
}

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 transition-colors">
    {children}
  </Link>
);

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">{APP_NAME}</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {currentUser ? (
                <>
                  <NavLink to="/chat">Chat</NavLink>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                  <NavLink to="/journal">Journal</NavLink>
                  <Button onClick={handleLogout} variant="ghost" size="sm">Logout</Button>
                </>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/signup">Sign Up</NavLink>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center"> {/* Mobile menu button can be added here */}
            {currentUser ? (
                <Button onClick={handleLogout} variant="ghost" size="sm">Logout</Button>
            ) : (
                <NavLink to="/login">Login</NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
    