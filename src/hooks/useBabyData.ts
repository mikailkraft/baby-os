import { useState, useEffect, useCallback } from 'react';
import type { BabyData, CraftBlock } from '../types';
import { parseCraftData } from '../utils/craftParser';

interface UseBabyDataResult {
    data: BabyData | null;
    loading: boolean;
    error: string | null;
    refresh: () => void;
    addItem: (collectionId: string, item: any) => Promise<void>;
    updateItem: (collectionId: string, itemId: string, properties: any) => Promise<void>;
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

    const getBaseUrl = useCallback(() => {
        let base = url;
        // Use proxy in dev if targeting craft.do
        if (import.meta.env.DEV && url.includes('connect.craft.do')) {
            base = url.replace('https://connect.craft.do', '/api/craft');
        }
        // Ensure no trailing slash
        base = base.replace(/\/$/, '');
        return base;
    }, [url]);

    const getHeaders = useCallback(() => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (password) {
            headers['Authorization'] = `Bearer ${password}`;
        }
        return headers;
    }, [password]);

    const fetchData = useCallback(async () => {
        if (!url) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const headers = getHeaders();
            const base = getBaseUrl();
            const getFetchUrl = (path: string) => `${base}${path}`;

            // Fetch all concurrently
            const [sleepRes, feedsRes, diapersRes, pedRes, pedItemsRes, settingsRes] = await Promise.all([
                fetch(getFetchUrl(`/collections/${IDS.sleep}/items`), { headers }),
                fetch(getFetchUrl(`/collections/${IDS.feeds}/items`), { headers }),
                fetch(getFetchUrl(`/collections/${IDS.diapers}/items`), { headers }),
                fetch(getFetchUrl(`/blocks?id=${IDS.pediatrician}`), { headers }),
                // Try to fetch items in case it's a collection, but don't fail if it's just a page
                fetch(getFetchUrl(`/collections/${IDS.pediatrician}/items`), { headers }).catch(() => null),
                fetch(getFetchUrl(`/blocks?id=${IDS.settings}`), { headers }),
            ]);

            // Check for failures of critical blocks
            const criticalResponses = [sleepRes, feedsRes, diapersRes, pedRes, settingsRes];
            for (const res of criticalResponses) {
                if (!res.ok) {
                    throw new Error(`Failed to fetch ${res.url}: ${res.status} ${res.statusText}`);
                }
            }

            const [sleepJson, feedsJson, diapersJson, pedJson, pedItemsRaw, settingsJson] = await Promise.all([
                ...criticalResponses.map(res => res.json()),
                pedItemsRes && pedItemsRes.ok ? pedItemsRes.json() : Promise.resolve({ items: [] })
            ]);

            // Construct mock blocks structure for the parser to reuse existing logic
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
                    ...pedJson,
                    markdown: pedJson.markdown || 'Pediatrician',
                    items: pedItemsRaw.items // Add items if we found any
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
    }, [url, getBaseUrl, getHeaders]);

    const addItem = async (collectionId: string, item: any) => {
        try {
            const headers = getHeaders();
            const base = getBaseUrl();
            const res = await fetch(`${base}/collections/${collectionId}/items`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ items: [item] })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to add item: ${res.status} ${errorText}`);
            }

            // Refresh data after adding
            await fetchData();
        } catch (err: any) {
            console.error('Add item error:', err);
            throw err;
        }
    };

    const updateItem = async (collectionId: string, itemId: string, properties: any) => {
        try {
            const headers = getHeaders();
            const base = getBaseUrl();
            const res = await fetch(`${base}/collections/${collectionId}/items`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    itemsToUpdate: [{
                        id: itemId,
                        properties
                    }]
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to update item: ${res.status} ${errorText}`);
            }

            // Refresh data after updating
            await fetchData();
        } catch (err: any) {
            console.error('Update item error:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refresh: fetchData, addItem, updateItem };
};

