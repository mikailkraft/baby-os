import React from 'react';
import { Card } from './Card';
import type { FeedEvent } from '../types';
import { formatDistanceToNow, format } from 'date-fns';

interface FeedWidgetProps {
    events: FeedEvent[];
    unit?: string;
    minFeeds?: number;
    onAdd?: () => void;
}

export const FeedWidget: React.FC<FeedWidgetProps> = ({ events, unit = 'oz', minFeeds = 8, onAdd }) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const sortedEvents = [...events].sort((a, b) => {
        return (b.date + b.time).localeCompare(a.date + a.time);
    });

    const lastFeed = sortedEvents[0];
    const todayFeeds = sortedEvents.filter(e => e.date === todayStr);

    const totalAmount = todayFeeds.reduce((acc, curr) => {
        // Strip out the unit if it's already in the amount string
        const amountStr = (curr.amount || '').replace(new RegExp(`\\s*${unit}$`, 'i'), '').trim();
        const amount = parseFloat(amountStr);
        return acc + (isNaN(amount) ? 0 : amount);
    }, 0);

    let timeSinceLast = 'Unknown';
    if (lastFeed) {
        const dateTimeStr = `${lastFeed.date} ${lastFeed.time}`.replace(/\s+/g, ' ');
        const lastFeedDate = new Date(dateTimeStr);
        if (!isNaN(lastFeedDate.getTime())) {
            timeSinceLast = formatDistanceToNow(lastFeedDate, { addSuffix: true });
        }
    }

    return (
        <Card
            title="Feeds"
            icon="🍼"
            accentColor="var(--text-feed)"
            headerAction={
                <button
                    onClick={onAdd}
                    className="add-btn"
                    style={{
                        background: 'var(--color-feed)',
                        color: 'var(--text-feed)',
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

                <div style={{ background: 'var(--color-feed)', padding: '16px', borderRadius: 'var(--radius-md)', color: 'var(--text-feed)' }}>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '4px' }}>
                        Last Feed
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {timeSinceLast}
                    </div>
                    {lastFeed && (
                        <div style={{ fontSize: '0.85rem', marginTop: '4px', opacity: 0.9 }}>
                            {(lastFeed.amount || '').replace(new RegExp(`\\s*${unit}$`, 'i'), '').trim() ? `${lastFeed.amount.replace(new RegExp(`\\s*${unit}$`, 'i'), '').trim()} ${unit} (Approx)` : lastFeed.type.join(', ')}
                        </div>
                    )}
                </div>


                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Total Today
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {totalAmount > 0 ? totalAmount : todayFeeds.length}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {totalAmount > 0 ? unit : `Sessions (Target: ${minFeeds})`}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>Recent Feeds</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sortedEvents.slice(0, 3).map((event, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                            <span style={{ fontWeight: 500 }}>{event.time}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{event.amount ? `${event.amount} ${unit}` : event.type[0]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};
