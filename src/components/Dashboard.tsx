import React from 'react';
import { useBabyData } from '../hooks/useBabyData';
import { SleepWidget } from './SleepWidget';
import { FeedWidget } from './FeedWidget';
import { DiaperWidget } from './DiaperWidget';
import { PediatricianWidget } from './PediatricianWidget';

export const Dashboard: React.FC = () => {
    const url = localStorage.getItem('baby_os_url') || '';
    const password = localStorage.getItem('baby_os_password') || undefined;

    const { data, loading, error, refresh } = useBabyData(url, password);

    if (loading) {
        return (
            <div className="full-screen-center">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="spinner" style={{
                        width: '40px', height: '40px',
                        border: '4px solid rgba(255,255,255,0.1)',
                        borderLeftColor: '#6366f1',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ marginTop: '16px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Syncing Baby OS...</div>
                </div>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="full-screen-center" style={{ flexDirection: 'column', gap: '20px' }}>
                <div style={{ color: 'var(--error-color)', fontSize: '1.1rem' }}>Error: {error}</div>
                <button onClick={refresh} className="btn-primary">Retry</button>
                <button
                    onClick={() => {
                        localStorage.removeItem('baby_os_url');
                        window.location.reload();
                    }}
                    style={{ background: 'transparent', color: 'var(--text-secondary)', textDecoration: 'underline' }}
                >
                    Reset Configuration
                </button>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '80px' }}>
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>{data?.settings?.babyName ? `${data.settings.babyName}'s Dashboard` : 'Baby Dashboard'}</h1>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
                        Overview for {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <button
                    onClick={refresh}
                    className="glass-panel"
                    style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    }}
                >
                    Refresh Data
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                <SleepWidget events={data.sleep} wakeWindowLimit={data.settings?.wakeWindowLimit} />
                <FeedWidget events={data.feeds} unit={data.settings?.feedUnit} minFeeds={data.settings?.minFeeds} />
                <DiaperWidget events={data.diapers} minDiapers={data.settings?.minDiapers} />
                <PediatricianWidget appointments={data.appointments} notes={data.doctorNotes} />
            </div>
        </div>
    );
};
