import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Business, UseQueryResult } from '../../types';

export const useBusiness = () => {
    const [result, setResult] = useState<UseQueryResult<Business[]>>({
        data: null,
        error: null,
        loading: true,
    });

    const fetchBusinesses = async () => {
        try {
            setResult(prev => ({ ...prev, loading: true }));
            const { data, error } = await supabase
                .from('nari_sahas')
                .select('*');

            if (error) throw error;

            // Fetch images and logo for each business
            const businessesWithImages = await Promise.all(data.map(async (business) => {
                // Get business logo
                const { data: logoData } = await supabase
                    .storage
                    .from('businesses')
                    .list(`${business.user_id}/logo`);

                const logoUrl = logoData && logoData.length > 0
                    ? (await supabase.storage.from('businesses').getPublicUrl(`${business.user_id}/logo/${logoData[0].name}`)).data.publicUrl
                    : null;

                // Get business images
                const { data: imagesData } = await supabase
                    .storage
                    .from('businesses')
                    .list(`${business.user_id}/images`);

                const imageUrls = await Promise.all(
                    (imagesData || []).map(async (image) => {
                        const { data: { publicUrl } } = await supabase
                            .storage
                            .from('businesses')
                            .getPublicUrl(`${business.user_id}/images/${image.name}`);
                        return publicUrl;
                    })
                );

                return {
                    ...business,
                    logo: logoUrl,
                    images: imageUrls
                };
            }));

            setResult({
                data: businessesWithImages,
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
        fetchBusinesses();
    }, []);

    return { ...result, refetch: fetchBusinesses };
};