import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UseQueryResult } from '../../types';

export const useBirthdays = (filter: 'today' | 'month' | 'all' = 'all') => {
  const [result, setResult] = useState<UseQueryResult<any[]>>({  // Changed from Profile[] to any[]
    data: null,
    error: null,
    loading: true,
  });

  const fetchBirthdays = async () => {
    try {
      setResult(prev => ({ ...prev, loading: true }));

      const { data, error } = await supabase
        .from('profiles')
        .select('name, surname, date_of_birth, profile_pic, mobile_no1, email')
        .not('date_of_birth', 'is', null);
      if (error) throw error;
      // Transform and filter the data
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentDay = now.getDate();

      const transformedData = data
        .map(profile => {
          if (!profile.date_of_birth) return null;

          try {
            const birthDate = new Date(profile.date_of_birth);
            if (isNaN(birthDate.getTime())) return null;

            const monthIndex = birthDate.getMonth();
            const parsedDay = birthDate.getDate();
            const fullYear = birthDate.getFullYear();
            let age = now.getFullYear() - fullYear;

            if (
              now.getMonth() < monthIndex ||
              (now.getMonth() === monthIndex && now.getDate() < parsedDay)
            ) {
              age--;
            }

            return {
              id: `${profile.name}-${profile.date_of_birth}`,
              name: `${profile.name} ${profile.surname || ''}`.trim(),
              age: age.toString(),
              date: profile.date_of_birth, // Already in yyyy-mm-dd format
              image: profile.profile_pic || 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
              phone: profile.mobile_no1,
              email: profile.email,
              monthIndex,
              day: parsedDay,
            };
          } catch (e) {
            console.error('Error parsing date:', profile.date_of_birth, e);
            return null;
          }
        })
        .filter(Boolean)
        .filter(birthday => {
          if (filter === 'today') {
            return birthday.monthIndex === currentMonth && birthday.day === currentDay;
          } else if (filter === 'month') {
            return birthday.monthIndex === currentMonth;
          }
          return true;
        })
        .sort((a, b) => {
          if (a.monthIndex !== b.monthIndex) {
            return a.monthIndex - b.monthIndex;
          }
          return a.day - b.day;
        });

      console.log(`Fetched ${transformedData.length} birthdays for filter: ${filter}`);
      console.log('Birthdays data:', JSON.stringify(transformedData, null, 2));

      setResult({
        data: transformedData,
        error: null,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching birthdays:', error);
      setResult({
        data: null,
        error: error as Error,
        loading: false,
      });
    }
  };

  useEffect(() => {
    fetchBirthdays();
  }, [filter]);

  return { ...result, refetch: fetchBirthdays };
};