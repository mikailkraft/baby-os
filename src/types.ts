export interface CraftBlock {
    id: string;
    type: string;
    content?: CraftBlock[];
    items?: CraftBlock[]; // For collections
    properties?: any;
    title?: string;
    markdown?: string;
    listStyle?: string;
    textStyle?: string;
}

export interface SleepEvent {
    id: string;
    date: string;       // YYYY-MM-DD
    startTime: string;  // e.g. "7:13 PM"
    endTime?: string;
    duration?: number;  // minutes
    notes?: string;
    type: 'Nap' | 'Night';
}

export interface FeedEvent {
    id: string;
    date: string;
    time: string;
    type: string[]; // e.g. ["Bottle", "Breast - Right"]
    amount: string;
    notes?: string;
}

export interface DiaperEvent {
    id: string;
    date: string;
    time: string;
    type: string[]; // e.g. ["Dirty"]
    notes?: string;
}

export interface BabySettings {
    babyName: string;
    feedUnit: string; // 'oz' or 'ml'
    wakeWindowLimit?: number; // minutes
    minFeeds?: number;
    minDiapers?: number;
}

export interface BabyData {
    sleep: SleepEvent[];
    feeds: FeedEvent[];
    diapers: DiaperEvent[];
    appointments: string[];
    doctorNotes: string[];
    settings?: BabySettings;
}
