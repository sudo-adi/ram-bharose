// hooks.ts (or wherever your hooks are defined)
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Profile, UseQueryResult } from '../../types';

// Utility for debouncing
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Hooks for Profile-related queries
export const useProfiles = (
  searchQuery: string = '',
  filters: any = {},
  page: number = 0, // Start page from 0 for Supabase .range()
  pageSize: number = 10,
  debounceTime: number = 500
) => {
  const [result, setResult] = useState<UseQueryResult<Profile[]>>({
    data: null,
    error: null,
    loading: true,
  });

  const [totalCount, setTotalCount] = useState<number | null>(null); // To store the total number of matching profiles

  const fetchProfiles = async (
    currentSearchQuery: string,
    currentFilters: any,
    currentPage: number,
    currentPageSize: number
  ) => {
    try {
      setResult(prev => ({ ...prev, loading: true }));

      let query = supabase.from('profiles').select('*', { count: 'exact' }); // Request exact count

      // Apply search query
      if (currentSearchQuery) {
        query = query.or(
          `name.ilike.%${currentSearchQuery}%,surname.ilike.%${currentSearchQuery}%,residential_address_city.ilike.%${currentSearchQuery}%,occupation.ilike.%${currentSearchQuery}%`
        );
      }

      // Apply gender filters
      if (currentFilters.gender && currentFilters.gender.length > 0) {
        query = query.in('gender', currentFilters.gender);
      }

      // Apply profession filter
      if (currentFilters.profession) {
        query = query.ilike('occupation', `%${currentFilters.profession}%`);
      }

      // --- Pagination ---
      const start = currentPage * currentPageSize;
      const end = start + currentPageSize - 1;
      query = query.range(start, end);

      const { data, error, count } = await query;

      if (error) throw error;

      setResult({
        data,
        error: null,
        loading: false,
      });
      setTotalCount(count); // Set the total count
    } catch (error) {
      setResult({
        data: null,
        error: error as Error,
        loading: false,
      });
      setTotalCount(0); // Reset count on error
    }
  };

  // Debounced version of fetchProfiles
  const debouncedFetchProfiles = debounce(fetchProfiles, debounceTime);

  useEffect(() => {
    debouncedFetchProfiles(searchQuery, filters, page, pageSize);
  }, [searchQuery, filters, page, pageSize, debounceTime]); // Re-run effect when search query, filters, page, or page size change

  // This refetch can be used for explicit refreshes without debouncing
  const refetch = () => fetchProfiles(searchQuery, filters, page, pageSize);

  return { ...result, totalCount, refetch }; // Return totalCount
};

export const useMemberCounts = () => {
  const [result, setResult] = useState<UseQueryResult<{total: number, male: number, female: number}>>({
    data: { total: 0, male: 0, female: 0 },
    error: null,
    loading: true,
  });

  const fetchMemberCounts = async () => {
    try {
      setResult(prev => ({ ...prev, loading: true }));

      // Get total count
      const { count: total, error: totalError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      if (totalError) throw totalError;

      // Get male count
      const { count: male, error: maleError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('gender', 'Male');

      if (maleError) throw maleError;

      // Get female count
      const { count: female, error: femaleError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('gender', 'Female');

      if (femaleError) throw femaleError;

      setResult({
        data: { total: total || 0, male: male || 0, female: female || 0 },
        error: null,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching member counts:', error);
      setResult({
        data: { total: 0, male: 0, female: 0 },
        error: error as Error,
        loading: false,
      });
    }
  };

  useEffect(() => {
    fetchMemberCounts();
  }, []);

  return { ...result, refetch: fetchMemberCounts };
};

export const useProfile = (id: number) => {
  const [result, setResult] = useState<UseQueryResult<Profile>>({
    data: null,
    error: null,
    loading: true,
  });

  const fetchProfile = async () => {
    try {
      setResult(prev => ({ ...prev, loading: true }));
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

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
    fetchProfile();
  }, [id]);

  return { ...result, refetch: fetchProfile };
};

export const useFamilyVerification = (email: string) => {
  const [result, setResult] = useState<UseQueryResult<Profile[]>>({
    data: null,
    error: null,
    loading: true,
  });

  const verifyUserEmail = async () => {
    try {
      setResult(prev => ({ ...prev, loading: true }));
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email);

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
    if (email) {
      verifyUserEmail();
    }
  }, [email]);

  return { ...result, refetch: verifyUserEmail };
};