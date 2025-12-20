import type { CraftBlock, BabyData } from '../types';

// Helper to recursively find a block by its markdown content or title
export const findBlockByName = (blocks: CraftBlock[], name: string): CraftBlock | null => {
    for (const block of blocks) {
        if (block.markdown === name || block.title === name) {
            return block;
        }
        if (block.content) {
            const found = findBlockByName(block.content, name);
            if (found) return found;
        }
    }
    return null;
};

// Helper to find specific block type inside a parent
export const findChildBlockByName = (parent: CraftBlock, name: string): CraftBlock | null => {
    if (!parent.content) return null;
    return parent.content.find(b => b.markdown === name || b.title === name) || null;
};


export const parseCraftData = (blocks: CraftBlock[]): BabyData => {
    const data: BabyData = {
        sleep: [],
        feeds: [],
        diapers: [],
        appointments: [],
        doctorNotes: [],
    };

    // 1. SLEEP
    const sleepPage = findBlockByName(blocks, "Sleep");
    if (sleepPage) {
        const sleepEventsBlock = findChildBlockByName(sleepPage, "Sleep Events");
        if (sleepEventsBlock && sleepEventsBlock.items) {
            data.sleep = sleepEventsBlock.items.map(item => {
                const props = item.properties || {};
                // Use item.type or item.title for Sleep type
                const type = (item.type === 'Nap' || item.title === 'Nap') ? 'Nap' : 'Night';
                // Use item.date if props.date is missing
                const date = props.date || (item as any).date || '';

                return {
                    id: item.id,
                    date: date,
                    startTime: props.start_time || '',
                    endTime: props.end_time || '',
                    duration: parseInt(props.duration || '0', 10),
                    notes: props.notes || '',
                    type: type as 'Nap' | 'Night',
                };
            }).filter(i => i.date);
        }
    }

    // 2. FEEDS & DIAPERS
    const feedsDiapersPage = findBlockByName(blocks, "Feeds & Diapers");
    if (feedsDiapersPage) {
        // Feeds
        const feedsBlock = findChildBlockByName(feedsDiapersPage, "Feeds");
        if (feedsBlock && feedsBlock.items) {
            data.feeds = feedsBlock.items.map(item => {
                const props = item.properties || {};
                // Real API puts date on item.date, Document JSON sometimes puts it in title
                const date = (item as any).date || item.title || item.markdown || '';
                return {
                    id: item.id,
                    date: date,
                    time: props.time || '',
                    type: Array.isArray(props.type) ? props.type : [props.type].filter(Boolean),
                    amount: props.amount || '',
                    notes: props.notes || '',
                };
            }).filter(i => i.time);
        }

        // Diapers
        const diapersBlock = findChildBlockByName(feedsDiapersPage, "Diapers");
        if (diapersBlock && diapersBlock.items) {
            data.diapers = diapersBlock.items.map(item => {
                const props = item.properties || {};
                const date = (item as any).date || item.title || item.markdown || '';
                return {
                    id: item.id,
                    date: date,
                    time: props.time || '',
                    type: Array.isArray(props.type) ? props.type : [props.type].filter(Boolean),
                    notes: props.notes || '',
                };
            }).filter(i => i.time);
        }
    }

    // 3. PEDIATRICIAN
    const pedPage = findBlockByName(blocks, "Pediatrician");
    if (pedPage && pedPage.content) {
        let section = '';
        for (const block of pedPage.content) {
            if ((block.type === 'text' || block.type === 'page') && block.markdown) {
                if (block.markdown.includes('Upcoming Appointments')) section = 'appointments';
                else if (block.markdown.includes('Notes for Doctor')) section = 'notes';
                else if (block.markdown.startsWith('#') || block.textStyle?.startsWith('h')) {
                    if (!block.markdown.includes('Upcoming Appointments') && !block.markdown.includes('Notes for Doctor')) {
                        section = '';
                    }
                }
            }

            if (section === 'appointments' && block.type === 'text' && block.markdown) {
                if (!block.markdown.includes('Upcoming Appointments') && block.markdown.length > 3 && !block.markdown.startsWith('*')) {
                    data.appointments?.push(block.markdown);
                }
            }

            if (section === 'notes' && block.type === 'text' && block.listStyle === 'bullet' && block.markdown) {
                data.doctorNotes?.push(block.markdown);
            }
        }
    }

    // 4. SETTINGS
    const settingsPage = findBlockByName(blocks, "Settings");
    if (settingsPage && settingsPage.content) {
        const allText = settingsPage.content.map(b => b.markdown || '').join('\n');

        const nameMatch = allText.match(/\*\*Baby's Name:\*\* (.*)/);
        const babyName = nameMatch ? nameMatch[1].trim() : 'Baby';

        const unitMatch = allText.match(/\*\*Measure in:\*\* (.*)/);
        const feedUnit = unitMatch ? unitMatch[1].trim() : 'oz';

        const wakeMatch = allText.match(/\*\*Wake Window Alert:\*\* (\d+) hours?/);
        const wakeWindowLimit = wakeMatch ? parseInt(wakeMatch[1], 10) * 60 : 120; // Default 2 hours

        const feedsMatch = allText.match(/\*\*Minimum Daily Feeds:\*\* (\d+)/);
        const minFeeds = feedsMatch ? parseInt(feedsMatch[1], 10) : 8;

        const diapersMatch = allText.match(/\*\*Minimum Daily Diapers:\*\* (\d+)/);
        const minDiapers = diapersMatch ? parseInt(diapersMatch[1], 10) : 6;

        data.settings = {
            babyName,
            feedUnit,
            wakeWindowLimit,
            minFeeds,
            minDiapers
        };
    }

    return data;
};
