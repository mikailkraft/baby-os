import React from 'react';
import { Card } from './Card';

interface PediatricianWidgetProps {
    appointments?: string[];
    notes?: string[];
}

export const PediatricianWidget: React.FC<PediatricianWidgetProps> = ({ appointments = [], notes = [] }) => {
    return (
        <Card title="Pediatrician" icon="🩺" accentColor="var(--text-doctor)">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {appointments.length > 0 && (
                    <div style={{ background: 'var(--color-doctor)', padding: '16px', borderRadius: 'var(--radius-md)', color: 'var(--text-doctor)' }}>
                        <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '8px' }}>
                            Upcoming Appointments
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.95rem' }}>
                            {appointments.map((appt, i) => <li key={i}>{appt}</li>)}
                        </ul>
                    </div>
                )}

                {notes.length > 0 && (
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Notes for Doctor
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.95rem' }}>
                            {notes.map((note, i) => <li key={i}>{note}</li>)}
                        </ul>
                    </div>
                )}

                {appointments.length === 0 && notes.length === 0 && (
                    <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                        No upcoming appointments or notes.
                    </div>
                )}
            </div>
        </Card>
    );
};
