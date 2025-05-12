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

            // 1. Fetch magazine data from the table
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

            // 2. Get cover image URLs from storage
            const magazinesWithImages = await Promise.all(
                magazines.map(async (magazine) => {
                    if (magazine.cover_image_name) {
                        const { data: { publicUrl } } = supabase
                            .storage
                            .from('shubh-chintak')
                            .getPublicUrl(`magzine-cover/${magazine.cover_image_name}.png`);

                        return {
                            ...magazine,
                            cover_image_url: publicUrl
                        };
                    }
                    return magazine;
                })
            );

            setResult({
                data: magazinesWithImages,
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