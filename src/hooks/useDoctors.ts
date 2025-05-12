import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Doctor, UseQueryResult } from '../../types';

export const useDoctors = () => {
    const [result, setResult] = useState<UseQueryResult<Doctor[]>>({
        data: null,
        error: null,
        loading: true,
    });

    const fetchDoctors = async () => {
        try {
            setResult(prev => ({ ...prev, loading: true }));
            const { data, error } = await supabase
                .from('doctors')
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
        fetchDoctors();
    }, []);

    return { ...result, refetch: fetchDoctors };
};