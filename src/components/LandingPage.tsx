import React from 'react';
import { Card } from './Card';

export const LandingPage: React.FC = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'var(--font-family)', color: 'var(--text-primary)' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👶</div>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 16px 0', background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Baby OS
                </h1>
                <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    The Operating System for your Newborn.
                </p>
            </header>

            <div style={{ display: 'grid', gap: '32px' }}>
                <Card title="Get Started" icon="🚀">
                    <p style={{ marginBottom: '24px', lineHeight: 1.6 }}>
                        Baby OS is a single-file dashboard that lives in your browser and connects to your private Craft document. No servers. No subscriptions. Just you and your data.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <a href="https://docs.mikail.zip/LZf9m2MeFth7Pr" target="_blank" rel="noopener noreferrer"
                            className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', background: '#3b82f6' }}>
                            1. Get the Craft Template
                        </a>
                        <a href="/baby-os.html" download="index.html"
                            className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                            2. Download Dashboard
                        </a>
                    </div>
                </Card>

                <Card title="Shortcuts" icon="⚡️">
                    <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
                        Add these to your iPhone for one-tap logging.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                        <ShortcutButton label="Log Nap" color="#818cf8" icon="🌙" />
                        <ShortcutButton label="Log Feed" color="#f472b6" icon="🍼" />
                        <ShortcutButton label="Log Diaper" color="#4ade80" icon="👶" />
                        <ShortcutButton label="Log Appt" color="#fbbf24" icon="🩺" />
                        <ShortcutButton label="Handoff" color="#94a3b8" icon="🤝" />
                        <ShortcutButton label="Review" color="#a78bfa" icon="📊" />
                    </div>
                </Card>

                <Card title="Resources" icon="📚">
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <a href="https://github.com/mikailkraft/baby-os" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-btn)', textDecoration: 'none', fontWeight: 500 }}>
                            View on GitHub →
                        </a>
                    </div>
                </Card>

                <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <p>
                        Created by <a href="https://github.com/mikailkraft" style={{ color: 'inherit', textDecoration: 'underline' }}>Mikail</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

const ShortcutButton: React.FC<{ label: string; color: string; icon: string }> = ({ label, color, icon }) => (
    <a href="#" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: color,
        color: 'white',
        borderRadius: '24px',
        textDecoration: 'none',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'transform 0.2s',
        fontWeight: 600
    }}>
        <span style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</span>
        <span style={{ fontSize: '0.9rem' }}>{label}</span>
    </a>
);
