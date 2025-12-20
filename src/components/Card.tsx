import React from 'react';

interface CardProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    accentColor?: string;
}

export const Card: React.FC<CardProps> = ({ title, icon, children, className = '', accentColor }) => {
    return (
        <div className={`glass-panel ${className}`} style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            {accentColor && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px', // Slightly thicker for visibility
                    background: accentColor,
                }} />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                {icon && <div style={{ fontSize: '1.5rem' }}>{icon}</div>}
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{title}</h2>
            </div>
            <div>
                {children}
            </div>
        </div>
    );
};
