import React from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

import favicon from './assets/favicon.jpeg';

// Simple router check for dev vs prod/landing
// If URL contains 'dashboard', show dashboard (for dev testing or if user prefers)
// Otherwise ensure LandingPage is the default entry
const App: React.FC = () => {
  React.useEffect(() => {
    // Inject favicon dynamically to ensure it's inlined in the single-file build
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = favicon;

    let appleLink = document.querySelector("link[rel~='apple-touch-icon']") as HTMLLinkElement;
    if (!appleLink) {
      appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      document.getElementsByTagName('head')[0].appendChild(appleLink);
    }
    appleLink.href = favicon;
  }, []);

  // Check if we are in "Dashboard Mode" via query param or if we are the preserved baby-os.html file
  const isDashboardArtifact = window.location.pathname.endsWith('baby-os.html') || window.location.search.includes('mode=dashboard');

  if (isDashboardArtifact) {
    return <Dashboard />;
  }

  return <LandingPage />;
};

export default App;
