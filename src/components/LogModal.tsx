import React, { useState } from 'react';
import { Modal } from './Modal';
import { format, differenceInMinutes, parse, isValid } from 'date-fns';

interface LogModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'sleep' | 'feed' | 'diaper';
    onSubmit: (collectionId: string, item: any) => Promise<void>;
    onUpdate?: (collectionId: string, itemId: string, properties: any) => Promise<void>;
    activeSleep?: any;
    parentName?: string;
}

const IDS = {
    sleep: '9d143133-d2b6-5a9e-5086-a41d671ac305',
    feeds: '99DD0613-F80F-4CA2-887C-08429B271ADE',
    diapers: '91D6167F-E8AE-428A-AA94-68483354D32F',
};

export const LogModal: React.FC<LogModalProps> = ({ isOpen, onClose, type, onSubmit, onUpdate, activeSleep, parentName }) => {
    const [loading, setLoading] = useState(false);
    const [sleepAction, setSleepAction] = useState<'start' | 'end'>('start');
    const [formData, setFormData] = useState<any>({
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'h:mm a'),
        amount: '',
        notes: '',
        sleepType: 'Nap',
        feedType: 'Bottle',
        diaperType: ['Wet', 'Dirty'],
    });

    // Reset/Sync state when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setFormData((prev: any) => ({
                ...prev,
                date: format(new Date(), 'yyyy-MM-dd'),
                time: format(new Date(), 'h:mm a'),
                notes: ''
            }));
            if (type === 'sleep') {
                setSleepAction(activeSleep ? 'end' : 'start');
            }
        }
    }, [isOpen, type, activeSleep]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let collectionId = '';
            let item: any = null;

            const sanitizedTime = formData.time.replace(/\s+/g, ' ');

            if (type === 'sleep') {
                collectionId = IDS.sleep;

                if (sleepAction === 'start') {
                    // Start a new sleep entry
                    item = {
                        type: formData.sleepType,
                        properties: {
                            date: formData.date,
                            start_time: sanitizedTime,
                            end_time: '',
                            duration: '',
                            notes: formData.notes || 'In progress',
                            ...(parentName ? { parent: parentName } : {})
                        }
                    };
                } else {
                    // End the active sleep entry
                    if (!activeSleep || !onUpdate) {
                        throw new Error("No active sleep event found to end.");
                    }

                    // Robust helper to parse date + time string
                    const parseDateTime = (dateStr: string, timeStr: string) => {
                        const cleanTime = timeStr.replace(/\s+/g, ' ').trim();
                        // Handle potential NNBSP or other whitespace issues
                        const combined = `${dateStr} ${cleanTime}`;
                        const referenceDate = new Date();

                        // Try typical formats
                        // 1. "yyyy-MM-dd h:mm a" (e.g. 2025-12-22 7:54 PM)
                        let d = parse(combined, 'yyyy-MM-dd h:mm a', referenceDate);
                        if (isValid(d)) return d;

                        // 2. "yyyy-MM-dd HH:mm" (e.g. 2025-12-22 19:54)
                        d = parse(combined, 'yyyy-MM-dd HH:mm', referenceDate);
                        if (isValid(d)) return d;

                        // 3. Fallback to native (browser dependent)
                        d = new Date(combined);
                        if (isValid(d)) return d;

                        return null;
                    };

                    const startDate = parseDateTime(activeSleep.date, activeSleep.startTime);
                    const endDate = parseDateTime(formData.date, sanitizedTime);

                    if (!startDate || !endDate) {
                        throw new Error(`Could not parse dates. Start: ${activeSleep.date} ${activeSleep.startTime}, End: ${formData.date} ${sanitizedTime}`);
                    }

                    const durationMinutes = differenceInMinutes(endDate, startDate);

                    if (isNaN(durationMinutes)) {
                        throw new Error("Could not calculate duration between " + activeSleep.startTime + " and " + sanitizedTime);
                    }

                    await onUpdate(collectionId, activeSleep.id, {
                        end_time: sanitizedTime,
                        duration: durationMinutes.toString(),
                        notes: formData.notes,
                        ...(parentName ? { parent: parentName } : {})
                    });
                    onClose();
                    return; // Exit early for update
                }
            } else if (type === 'feed') {
                collectionId = IDS.feeds;
                const [y, m, d] = formData.date.split('-').map(Number);
                const titleDate = new Date(y, m - 1, d);
                item = {
                    type: format(titleDate, 'MMM d, yyyy'),
                    properties: {
                        time: sanitizedTime,
                        type: [formData.feedType],
                        amount: formData.amount,
                        notes: formData.notes,
                        ...(parentName ? { parent: parentName } : {})
                    }
                };
            } else if (type === 'diaper') {
                collectionId = IDS.diapers;
                const [y, m, d] = formData.date.split('-').map(Number);
                const titleDate = new Date(y, m - 1, d);
                item = {
                    type: format(titleDate, 'MMM d, yyyy'),
                    properties: {
                        time: sanitizedTime,
                        type: formData.diaperType,
                        notes: formData.notes,
                        ...(parentName ? { parent: parentName } : {})
                    }
                };
            }

            if (item) {
                await onSubmit(collectionId, item);
                onClose();
            }
        } catch (err: any) {
            console.error('Submit error:', err);
            alert(`Failed to save log: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDiaperToggle = (t: string) => {
        setFormData((prev: any) => ({
            ...prev,
            diaperType: prev.diaperType.includes(t)
                ? prev.diaperType.filter((i: string) => i !== t)
                : [...prev.diaperType, t]
        }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Log ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Time</label>
                    <input
                        type="text"
                        placeholder="e.g. 2:30 PM"
                        value={formData.time}
                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                        required
                    />
                </div>

                {type === 'sleep' && (
                    <>
                        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px', marginBottom: '16px' }}>
                            <button
                                type="button"
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: sleepAction === 'start' ? 'white' : 'transparent',
                                    boxShadow: sleepAction === 'start' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                                onClick={() => setSleepAction('start')}
                            >
                                Start Sleep
                            </button>
                            <button
                                type="button"
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: sleepAction === 'end' ? 'white' : 'transparent',
                                    boxShadow: sleepAction === 'end' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    opacity: !activeSleep ? 0.5 : 1
                                }}
                                onClick={() => activeSleep && setSleepAction('end')}
                                disabled={!activeSleep}
                            >
                                End Sleep
                            </button>
                        </div>

                        {sleepAction === 'start' ? (
                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    value={formData.sleepType}
                                    onChange={e => setFormData({ ...formData, sleepType: e.target.value })}
                                >
                                    <option value="Nap">Nap</option>
                                    <option value="Night">Night Sleep</option>
                                </select>
                            </div>
                        ) : (
                            <div className="form-group" style={{
                                padding: '12px',
                                background: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: 'var(--radius-md)',
                                color: '#166534',
                                fontSize: '0.9rem'
                            }}>
                                Ending sleep started at <strong>{activeSleep.startTime}</strong>
                            </div>
                        )}
                    </>
                )}

                {type === 'feed' && (
                    <>
                        <div className="form-group">
                            <label>Amount (oz/ml)</label>
                            <input
                                type="text"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="e.g. 4.5"
                            />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select
                                value={formData.feedType}
                                onChange={e => setFormData({ ...formData, feedType: e.target.value })}
                            >
                                <option value="Bottle">Bottle</option>
                                <option value="Breast – Left">Breast – Left</option>
                                <option value="Breast – Right">Breast – Right</option>
                                <option value="Solid Food">Solid Food</option>
                            </select>
                        </div>
                    </>
                )}

                {type === 'diaper' && (
                    <div className="form-group">
                        <label>Type</label>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                            {['Wet', 'Dirty'].map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => handleDiaperToggle(t)}
                                    className={`toggle-btn ${formData.diaperType.includes(t) ? 'active' : ''}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label>Notes</label>
                    <textarea
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        rows={2}
                    />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Log'}
                    </button>
                </div>
            </form>
            <style>{`
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .form-group label {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                }
                .form-group input, .form-group select, .form-group textarea {
                    padding: 10px;
                    border-radius: var(--radius-md);
                    border: 1px solid #e2e8f0;
                    background: white;
                    font-size: 1rem;
                }
                .toggle-btn {
                    padding: 8px 16px;
                    border-radius: var(--radius-md);
                    border: 1px solid #e2e8f0;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .toggle-btn.active {
                    background: var(--primary-btn);
                    color: white;
                    border-color: var(--primary-btn);
                }
                .btn-secondary {
                    padding: 12px;
                    border-radius: var(--radius-md);
                    border: 1px solid #e2e8f0;
                    background: transparent;
                    cursor: pointer;
                }
                .btn-primary {
                    padding: 12px;
                    border-radius: var(--radius-md);
                    border: none;
                    background: var(--primary-btn);
                    color: white;
                    cursor: pointer;
                    font-weight: 600;
                }
                .btn-primary:disabled {
                    opacity: 0.7;
                }
            `}</style>
        </Modal>
    );
};
