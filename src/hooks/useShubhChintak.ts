// Updated Hook - useShubhChintak.js
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { ShubhChintak, UseQueryResult } from '../../types';

export const useShubhChintak = (limit?: number) => {
    const [result, setResult] = useState<UseQueryResult<ShubhChintak[]>>({
        data: null,
        error: null,
        loading: true,
    });

    const fetchShubhChintak = async () => {
        try {
            setResult(prev => ({ ...prev, loading: true }));

            // Fetch magazine data from the table with updated schema
            let query = supabase
                .from('shubh_chintak')
                .select('*')
                .order('created_at', { ascending: false });

            if (limit) {
                query = query.limit(limit);
            }

            const { data: magazines, error: tableError } = await query;

            if (tableError) throw tableError;

            if (!magazines || magazines.length === 0) {
                setResult({
                    data: [],
                    error: null,
                    loading: false,
                });
                return;
            }

            // Map the data to match the expected format
            const formattedMagazines = magazines.map((magazine) => ({
                ...magazine,
                title: magazine.name, // Map 'name' to 'title' for component compatibility
                file_url: magazine.link, // Map 'link' to 'file_url' for component compatibility
                cover_image_url: magazine.cover_image_link // Use direct link instead of storage URL
            }));

            setResult({
                data: formattedMagazines,
                error: null,
                loading: false,
            });
        } catch (error) {
            setResult({
                data: null,
                error: error as Error,
                loading: false,
            });
        }
    };

    useEffect(() => {
        fetchShubhChintak();
    }, [limit]);

    return { ...result, refetch: fetchShubhChintak };
};
