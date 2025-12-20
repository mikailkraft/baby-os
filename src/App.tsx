import React from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

// Simple router check for dev vs prod/landing
// If URL contains 'dashboard', show dashboard (for dev testing or if user prefers)
// Otherwise ensure LandingPage is the default entry
const App: React.FC = () => {
  // Check if we are in "Dashboard Mode" via query param or if we are the preserved baby-os.html file
  const isDashboardArtifact = window.location.pathname.endsWith('baby-os.html') || window.location.search.includes('mode=dashboard');

  if (isDashboardArtifact) {
    return <Dashboard />;
  }

  return <LandingPage />;
};

export default App;
