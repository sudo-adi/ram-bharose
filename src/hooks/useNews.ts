

  // hooks/useNews.ts - Simplified hook matching your schema
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
                  .select('*')
                  .order('created_at', { ascending: false }); // Optional: order by newest first

              if (articlesError) throw articlesError;

              if (!articles || articles.length === 0) {
                  setResult({
                      data: [],
                      error: null,
                      loading: false,
                  });
                  return;
              }

              setResult({
                  data: articles,
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