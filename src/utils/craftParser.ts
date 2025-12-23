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


// Helper to normalize date strings to YYYY-MM-DD
const normalizeDate = (dateStr: string): string => {
    if (!dateStr) return '';
    // If already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch {
        return dateStr;
    }
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
                const type = (item.type === 'Nap' || item.title === 'Nap') ? 'Nap' : 'Night';
                const date = normalizeDate(props.date || (item as any).date || '');

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
                const rawDate = (item as any).date || item.title || item.markdown || '';
                const date = normalizeDate(rawDate);
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
                const rawDate = (item as any).date || item.title || item.markdown || '';
                const date = normalizeDate(rawDate);
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
    const pedPage = findBlockByName(blocks, "Pediatrician") || findBlockByName(blocks, "Appointments");
    if (pedPage) {
        // Handle Appointments Collection if it exists (either as the block itself or a child)
        if (pedPage.type === 'collection' && pedPage.items) {
            data.appointments = pedPage.items
                .map(item => item.title || item.markdown || '')
                .filter(Boolean);
        } else {
            const apptsCollection = findChildBlockByName(pedPage, "Appointments");
            if (apptsCollection && apptsCollection.items) {
                data.appointments = apptsCollection.items
                    .map(item => item.title || item.markdown || '')
                    .filter(Boolean);
            }
        }

        if (pedPage.content) {
            let section = '';
            for (const block of pedPage.content) {
                if ((block.type === 'text' || block.type === 'page') && block.markdown) {
                    if (block.markdown.includes('Upcoming Appointments') || block.markdown === 'Appointments') {
                        section = 'appointments';
                    } else if (block.markdown.includes('Notes for Doctor')) {
                        section = 'notes';
                    } else if (block.markdown.startsWith('#') || block.textStyle?.startsWith('h')) {
                        // Reset section if it's a new heading that doesn't match
                        if (!block.markdown.includes('Upcoming Appointments') &&
                            block.markdown !== 'Appointments' &&
                            !block.markdown.includes('Notes for Doctor')) {
                            section = '';
                        }
                    }
                }

                // If we didn't get appointments from a collection, try text parsing
                if (data.appointments.length === 0 && section === 'appointments' && block.type === 'text' && block.markdown) {
                    if (!block.markdown.includes('Appointments') && block.markdown.length > 3 && !block.markdown.startsWith('*')) {
                        data.appointments?.push(block.markdown);
                    }
                }

                if (section === 'notes' && block.type === 'text' && block.listStyle === 'bullet' && block.markdown) {
                    data.doctorNotes?.push(block.markdown);
                }
            }
        }

        // Filter out past appointments
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        data.appointments = data.appointments.filter(appt => {
            // Normalize the string for parsing: remove ' at ' and non-breaking spaces
            const normalizedAppt = appt.replace(/\s+at\s+/i, ' ').replace(/\s+/g, ' ').trim();

            // 1. Extract Date
            // Looking for Month DD, YYYY or other standard formats
            const dateMatch = normalizedAppt.match(/(\w{3,9}\s\d{1,2},?\s\d{4})|(\d{1,2}\/\d{1,2})|(\w{3,9}\s\d{1,2})|(\d{4}-\d{2}-\d{2})/);
            if (!dateMatch) return true;

            try {
                // Remove the "at" if it exists in the specific captured string too
                const dateStr = dateMatch[0].replace(/,/g, '');
                const apptDate = new Date(dateStr);

                if (isNaN(apptDate.getTime())) return true; // Keep if parsing fails

                if (apptDate.getFullYear() < 2000) {
                    apptDate.setFullYear(now.getFullYear());
                }

                const apptDateStart = new Date(apptDate);
                apptDateStart.setHours(0, 0, 0, 0);

                if (apptDateStart < todayStart) return false;
                if (apptDateStart > todayStart) return true;

                // 2. If it's TODAY, check Time
                // Look for time in the normalized string
                const timeMatch = normalizedAppt.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/);
                if (!timeMatch) return true;

                let hours = parseInt(timeMatch[1], 10);
                const minutes = parseInt(timeMatch[2], 10);
                const ampm = timeMatch[3]?.toUpperCase();

                if (ampm === 'PM' && hours < 12) hours += 12;
                if (ampm === 'AM' && hours === 12) hours = 0;

                const apptDateTime = new Date(apptDate);
                apptDateTime.setHours(hours, minutes, 0, 0);

                const graceTime = new Date(now.getTime() - 30 * 60000);
                return apptDateTime >= graceTime;
            } catch {
                return true;
            }
        });
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
