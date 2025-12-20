import React from 'react';
import { Card } from './Card';

export const LandingPage: React.FC = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'var(--font-family)', color: 'var(--text-primary)' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '8px', animation: 'float 3s ease-in-out infinite' }}>👶</div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #6366f1, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Baby OS
                </h1>
                <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '600px', margin: '0 auto' }}>
                    The sanity-saving, sleep-tracking, data-crunching dashboard for your newest family member.
                </p>
                <style>{`
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                        100% { transform: translateY(0px); }
                    }
                `}</style>
            </header>

            <div style={{ display: 'grid', gap: '48px' }}>
                <section>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', textAlign: 'center' }}>Get Set Up in Seconds</h2>
                    <div style={{ display: 'grid', mdGridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <Card title="1. The Brain" icon="🧠">
                            <p style={{ marginBottom: '20px', lineHeight: 1.6 }}>
                                You'll need a place to store all that data. Grab our free Craft template to get started.
                            </p>
                            <a href="https://docs.mikail.zip/LZf9m2MeFth7Pr" target="_blank" rel="noopener noreferrer"
                                className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', background: '#3b82f6' }}>
                                Duplicate Template
                            </a>
                        </Card>
                        <Card title="2. The Dashboard" icon="✨">
                            <p style={{ marginBottom: '20px', lineHeight: 1.6 }}>
                                The magic interface. Download it, open it, and watch your chaos turn into clarity.
                            </p>
                            <a href="baby-os.html" download="index.html"
                                className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                                Download HTML
                            </a>
                        </Card>
                    </div>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', textAlign: 'center' }}>One-Tap Logging</h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                        Because nobody has time to type when they're holding a bottle with one hand and a baby with the other.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', justifyContent: 'center' }}>
                        <ShortcutButton label="Record Nap" color="#0ea5e9" icon="🌙" /> {/* Sky Blue */}
                        <ShortcutButton label="Log Feed" color="#f97316" icon="🍼" /> {/* Orange */}
                        <ShortcutButton label="Log Diaper" color="#84cc16" icon="🧷" /> /* Lime */
                        <ShortcutButton label="Doctor Visit" color="#fbbf24" icon="🩺" /> {/* Amber */}
                        <ShortcutButton label="Handoff" color="#94a3b8" icon="🤝" /> {/* Slate */}
                        <ShortcutButton label="Weekly Review" color="#a855f7" icon="📅" /> {/* Purple */}
                    </div>
                </section>

                <section style={{ background: '#f8fafc', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', textAlign: 'center' }}>📱 Install as App</h2>
                    <p style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text-secondary)' }}>
                        Make it feel like a native app on your iPhone.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                            <span>Open the downloaded <strong>baby-os.html</strong> on your phone.</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                            <span>Tap the <strong>Share</strong> button (box with arrow up).</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                            <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                        </div>
                    </div>
                </section>

                <footer style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <p>
                        Made with <span style={{ color: '#ef4444' }}>❤️</span> and sleep deprivation by <a href="https://github.com/mikailkraft" style={{ color: 'inherit', textDecoration: 'underline' }}>Mikail</a>.
                    </p>
                    <p style={{ marginTop: '8px' }}>
                        <a href="https://github.com/mikailkraft/baby-os" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>
                            View on GitHub
                        </a>
                    </p>
                </footer>
            </div>
        </div>
    );
};

const ShortcutButton: React.FC<{ label: string; color: string; icon: string }> = ({ label, color, icon }) => (
    <a href="#" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px',
        background: color,
        color: 'white',
        borderRadius: '22px', // Apple-ish rounded corners
        textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        aspectRatio: '1 / 1',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
        overflow: 'hidden'
    }}>
        <div style={{ fontSize: '1.8rem' }}>{icon}</div>
        <div style={{
            fontSize: '1rem',
            fontWeight: 700,
            lineHeight: 1.2,
            marginTop: 'auto'
        }}>
            {label}
        </div>
        {/* Shine effect */}
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none'
        }} />
    </a>
);
