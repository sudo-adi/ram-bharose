import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Committee, CommitteeImage, UseQueryResult } from '../../types';

export const useCommittees = () => {
    const [result, setResult] = useState<UseQueryResult<Committee[]>>({
        data: null,
        error: null,
        loading: true,
    });

    const fetchCommittees = async () => {
        try {
            setResult(prev => ({ ...prev, loading: true }));
            const { data, error } = await supabase
                .from('committee')  // Make sure this matches your table name exactly
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setResult({
                data,
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
        fetchCommittees();
    }, []);

    return { ...result, refetch: fetchCommittees };
};

export const useCommitteeImages = () => {
    const [result, setResult] = useState<UseQueryResult<CommitteeImage[]>>({
        data: null,
        error: null,
        loading: true,
    });

    const fetchCommitteeImages = async () => {
        try {
            setResult(prev => ({ ...prev, loading: true }));

            // List all files in the committee_pictures bucket
            const { data: files, error } = await supabase
                .storage
                .from('committee-pictures')
                .list();

            if (error) throw error;

            // Get public URLs for each image
            const images = await Promise.all(
                files.map(async (file) => {
                    const { data: { publicUrl } } = supabase
                        .storage
                        .from('committee-pictures')
                        .getPublicUrl(file.name);

                    return {
                        name: file.name,
                        url: publicUrl,
                        created_at: file.created_at,
                        size: file.metadata?.size || 0,
                        contentType: file.metadata?.mimetype || 'image/jpeg',
                    };
                })
            );

            setResult({
                data: images,
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
        fetchCommitteeImages();
    }, []);

    return { ...result, refetch: fetchCommitteeImages };
};