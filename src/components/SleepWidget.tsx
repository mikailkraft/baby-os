import React from 'react';
import { Card } from './Card';
import type { SleepEvent } from '../types';
import { formatDistanceToNow, format } from 'date-fns';

interface SleepWidgetProps {
    events: SleepEvent[];
    wakeWindowLimit?: number;
    onAdd?: () => void;
}

export const SleepWidget: React.FC<SleepWidgetProps> = ({ events, wakeWindowLimit = 120, onAdd }) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const sortedEvents = [...events].sort((a, b) => {
        return (b.date + b.startTime).localeCompare(a.date + a.startTime);
    });

    const lastSleep = sortedEvents[0];
    const isSleeping = lastSleep && !lastSleep.endTime && !lastSleep.duration;

    const todaySleeps = sortedEvents.filter(e => e.date === todayStr);
    const totalSleepMinutes = todaySleeps.reduce((acc, curr) => acc + (curr.duration || 0), 0);

    const hours = Math.floor(totalSleepMinutes / 60);
    const minutes = totalSleepMinutes % 60;


    let wakeWindowStr = 'Unknown';
    let isWindowExceeded = false;
    let wakeMinutes = 0;

    if (lastSleep && !isSleeping && lastSleep.endTime) {
        const dateTimeStr = `${lastSleep.date} ${lastSleep.endTime}`.replace(/\s+/g, ' ');
        const lastSleepEnd = new Date(dateTimeStr);
        if (!isNaN(lastSleepEnd.getTime())) {
            wakeWindowStr = formatDistanceToNow(lastSleepEnd, { addSuffix: false });
            const diffMs = new Date().getTime() - lastSleepEnd.getTime();
            wakeMinutes = Math.floor(diffMs / (1000 * 60));
            isWindowExceeded = wakeMinutes > wakeWindowLimit;
        }
    }

    return (
        <Card
            title="Sleep Tracking"
            icon="🌙"
            accentColor="var(--color-sleep)"
            headerAction={
                <button
                    onClick={onAdd}
                    className="add-btn"
                    style={{
                        background: 'var(--color-sleep)',
                        color: 'var(--text-sleep)',
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

                <div style={{ background: 'var(--color-sleep)', padding: '16px', borderRadius: 'var(--radius-md)', color: 'var(--text-sleep)' }}>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '4px' }}>
                        Current Status
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {isSleeping ? 'Sleeping' : 'Awake'}
                    </div>
                    {!isSleeping && (
                        <div style={{ fontSize: '0.85rem', marginTop: '4px', opacity: 0.9, color: isWindowExceeded ? '#b91c1c' : 'inherit', fontWeight: isWindowExceeded ? 'bold' : 'normal' }}>
                            Window: {wakeWindowStr} {isWindowExceeded && '⚠️'}
                        </div>
                    )}
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Total Today
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {hours}h {minutes}m
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {todaySleeps.length} naps
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>Recent History</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sortedEvents.slice(0, 3).map((event, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                            <span style={{ fontWeight: 500 }}>{event.type} ({event.date})</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{event.duration ? `${event.duration}m` : 'Active'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};
