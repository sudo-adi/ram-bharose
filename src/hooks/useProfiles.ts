import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Profile, UseQueryResult } from '../../types';

// Hooks for Profile-related queries
export const useProfiles = () => {
  const [result, setResult] = useState<UseQueryResult<Profile[]>>({
    data: null,
    error: null,
    loading: true,
  });

  const fetchProfiles = async () => {
    try {
      setResult(prev => ({ ...prev, loading: true }));
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

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

  return { ...result, refetch: fetchProfiles };
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