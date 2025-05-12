import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface FamilyTreeItem {
    name: string;
    link: string;
    image_link: string;
}

export const useFamilyTree = () => {
    const [result, setResult] = useState<FamilyTreeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchFamilyTree = async () => {
            try {
                const { data, error } = await supabase
                    .from('family_tree')
                    .select('name, link, image_link');

                if (error) throw error;

                setResult(data || []);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchFamilyTree();
    }, []);

    return { result, loading, error };
};