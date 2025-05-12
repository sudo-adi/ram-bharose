import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Article, UseQueryResult } from '../../types';

export const useNews = () => {
    const [result, setResult] = useState<UseQueryResult<Article[]>>({
        data: null,
        error: null,
        loading: true,
    });

    const fetchNews = async () => {
        try {
            setResult(prev => ({ ...prev, loading: true }));
            const { data: articles, error: articlesError } = await supabase
                .from('articles')
                .select('*');

            if (articlesError) throw articlesError;

            const articlesWithUserNames = await Promise.all(articles.map(async (article) => {
                const { data: userProfile, error: profileError } = await supabase
                    .from('profiles')
                    .select('name')
                    .eq('id', article.user_id)
                    .single();

                if (profileError) throw profileError;

                return {
                    ...article,
                    userName: userProfile.name
                };
            }));

            const articlesWithImages = await Promise.all(articlesWithUserNames.map(async (article) => {
                const { data: imageData } = await supabase
                    .storage
                    .from('articles')
                    .getPublicUrl(article.user_id);


                return {
                    ...article,
                    image: imageData.publicUrl + ".jpg",
                };
            }));

            if (!articlesWithImages) throw new Error('No articles found')

            setResult({
                data: articlesWithImages,
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
        fetchNews();
    }, []);

    return { ...result, refetch: fetchNews };
};