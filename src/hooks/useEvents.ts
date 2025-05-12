import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Event, UseQueryResult } from '../../types';

export const useEvents = () => {
    const [result, setResult] = useState<UseQueryResult<Event[]>>({
        data: null,
        error: null,
        loading: true,
    });

    const fetchEvents = async () => {
        try {
            setResult(prev => ({ ...prev, loading: true }));
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('event_date', { ascending: true });

            if (error) throw error;

            // Format the data for display
            const formattedEvents = data.map(event => ({
                ...event,
                // Add a default image if none exists
                image: event.image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000'
            }));

            setResult({
                data: formattedEvents,
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
        fetchEvents();
    }, []);

    return { ...result, refetch: fetchEvents };
};