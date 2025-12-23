import React from 'react';
import { Card } from './Card';
import type { DiaperEvent } from '../types';
import { formatDistanceToNow, format } from 'date-fns';

interface DiaperWidgetProps {
    events: DiaperEvent[];
    minDiapers?: number;
    onAdd?: () => void;
}

export const DiaperWidget: React.FC<DiaperWidgetProps> = ({ events, minDiapers = 6, onAdd }) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const sortedEvents = [...events].sort((a, b) => {
        return (b.date + b.time).localeCompare(a.date + a.time);
    });

    const lastEvent = sortedEvents[0];
    const todayEvents = sortedEvents.filter(e => e.date === todayStr);

    let timeSinceLast = 'Unknown';
    if (lastEvent) {
        const dateTimeStr = `${lastEvent.date} ${lastEvent.time}`.replace(/\s+/g, ' ');
        const lastDate = new Date(dateTimeStr);
        if (!isNaN(lastDate.getTime())) {
            timeSinceLast = formatDistanceToNow(lastDate, { addSuffix: true });
        }
    }

    return (
        <Card
            title="Diapers"
            icon="👶"
            accentColor="var(--text-diaper)"
            headerAction={
                <button
                    onClick={onAdd}
                    className="add-btn"
                    style={{
                        background: 'var(--color-diaper)',
                        color: 'var(--text-diaper)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    +
                </button>
            }
        >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                <div style={{ background: 'var(--color-diaper)', padding: '16px', borderRadius: 'var(--radius-md)', color: 'var(--text-diaper)' }}>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '4px' }}>
                        Last Change
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {timeSinceLast}
                    </div>
                    {lastEvent && (
                        <div style={{ fontSize: '0.85rem', marginTop: '4px', opacity: 0.9 }}>
                            {lastEvent.type.join(', ')}
                        </div>
                    )}
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Total Today
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {todayEvents.length}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Changes (Target: {minDiapers})
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>Recent Changes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sortedEvents.slice(0, 3).map((event, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                            <span style={{ fontWeight: 500 }}>{event.time}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{event.type.join(', ')}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};
