import React from 'react';

// Mock pour BrowserRouter
export const BrowserRouter = ({ children }) => <div data-testid="browser-router">{children}</div>;

// Mock pour Routes
export const Routes = ({ children }) => <div data-testid="routes">{children}</div>;

// Mock pour Route
export const Route = ({ element, path }) => <div data-testid={`route-${path}`}>{element}</div>;

// Mock pour useNavigate
export const useNavigate = () => jest.fn();

// Mock pour useParams
export const useParams = () => ({ id: '1' });

// Mock pour useLocation
export const useLocation = () => ({ pathname: '/', search: '', hash: '', state: null });

// Mock pour Link
export const Link = ({ to, children, ...props }) => (
  <a href={to} {...props} data-testid="link">
    {children}
  </a>
);

// Mock pour NavLink
export const NavLink = ({ to, children, ...props }) => (
  <a href={to} {...props} data-testid="nav-link">
    {children}
  </a>
);

// Mock pour Navigate
export const Navigate = ({ to }) => <div data-testid="navigate" data-to={to} />;

// Mock pour Outlet
export const Outlet = () => <div data-testid="outlet" />; 