import { useState, useEffect } from 'react';
import { ConfigScreen } from './components/ConfigScreen';
import { Dashboard } from './components/Dashboard';

function App() {
  const [config, setConfig] = useState<{ url: string; password?: string } | null>(null);

  useEffect(() => {
    const storedUrl = localStorage.getItem('baby_os_url');
    const storedPassword = localStorage.getItem('baby_os_password');
    if (storedUrl) {
      setConfig({ url: storedUrl, password: storedPassword || undefined });
    }
  }, []);

  const handleSaveConfig = (url: string, password?: string) => {
    localStorage.setItem('baby_os_url', url);
    if (password) {
      localStorage.setItem('baby_os_password', password);
    } else {
      localStorage.removeItem('baby_os_password');
    }
    setConfig({ url, password });
  };

  if (!config) {
    return (
      <ConfigScreen
        onSave={handleSaveConfig}
        initialUrl="https://connect.craft.do/links/GGOK4suYOHT/api/v1"
      />
    );
  }

  return <Dashboard />;
}

export default App;
