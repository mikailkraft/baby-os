import { useState, useEffect, useCallback } from 'react';
import type { BabyData, CraftBlock } from '../types';
import { parseCraftData } from '../utils/craftParser';

interface UseBabyDataResult {
    data: BabyData | null;
    loading: boolean;
    error: string | null;
    refresh: () => void;
}

const IDS = {
    sleep: '9d143133-d2b6-5a9e-5086-a41d671ac305',
    feeds: '99DD0613-F80F-4CA2-887C-08429B271ADE',
    diapers: '91D6167F-E8AE-428A-AA94-68483354D32F',
    pediatrician: 'DF63E846-60F0-41FD-92CF-A6914F192A44',
    settings: '5CE8B8CC-7823-4D12-8057-76A424676918',
};

export const useBabyData = (url: string, password?: string): UseBabyDataResult => {
    const [data, setData] = useState<BabyData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!url) return;

        setLoading(true);
        setError(null);

        try {
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };

            if (password) {
                headers['Authorization'] = `Bearer ${password}`;
            }

            const getFetchUrl = (path: string) => {
                let base = url;
                // Use proxy in dev if targeting craft.do
                if (import.meta.env.DEV && url.includes('connect.craft.do')) {
                    base = url.replace('https://connect.craft.do', '/api/craft');
                }
                // Ensure no trailing slash
                base = base.replace(/\/$/, '');
                return `${base}${path}`;
            };

            // Fetch all concurrently
            const [sleepRes, feedsRes, diapersRes, pedRes, settingsRes] = await Promise.all([
                fetch(getFetchUrl(`/collections/${IDS.sleep}/items`), { headers }),
                fetch(getFetchUrl(`/collections/${IDS.feeds}/items`), { headers }),
                fetch(getFetchUrl(`/collections/${IDS.diapers}/items`), { headers }),
                fetch(getFetchUrl(`/blocks?id=${IDS.pediatrician}`), { headers }),
                fetch(getFetchUrl(`/blocks?id=${IDS.settings}`), { headers }),
            ]);

            // Check for failures
            const responses = [sleepRes, feedsRes, diapersRes, pedRes, settingsRes];
            for (const res of responses) {
                if (!res.ok) {
                    throw new Error(`Failed to fetch ${res.url}: ${res.status} ${res.statusText}`);
                }
            }

            const [sleepJson, feedsJson, diapersJson, pedJson, settingsJson] = await Promise.all(
                responses.map(res => res.json())
            );

            // Construct mock blocks structure for the parser to reuse existing logic
            // or just build the data object directly if easier.
            // Let's build a structure that parseCraftData can understand.
            const mockBlocks: CraftBlock[] = [
                {
                    id: 'sleep-page', type: 'page', markdown: 'Sleep', content: [
                        { id: IDS.sleep, type: 'collection', markdown: 'Sleep Events', items: sleepJson.items }
                    ]
                },
                {
                    id: 'feeds-page', type: 'page', markdown: 'Feeds & Diapers', content: [
                        { id: IDS.feeds, type: 'collection', markdown: 'Feeds', items: feedsJson.items },
                        { id: IDS.diapers, type: 'collection', markdown: 'Diapers', items: diapersJson.items }
                    ]
                },
                {
                    ...pedJson, markdown: 'Pediatrician' // The page itself
                },
                {
                    ...settingsJson, markdown: 'Settings'
                }
            ];

            const parsed = parseCraftData(mockBlocks);
            setData(parsed);
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError(err.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [url, password]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refresh: fetchData };
};
