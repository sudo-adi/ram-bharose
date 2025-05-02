import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

// Types
type Profile = {
    id: number;
    family_no: string;
    surname: string;
    name: string;
    fathers_or_husbands_name: string;
    father_in_laws_name: string;
    gender: string;
    relationship: string;
    marital_status: string;
    marriage_date: string;
    date_of_birth: string;
    education: string;
    stream: string;
    qualification: string;
    occupation: string;
    email: string;
    profile_pic: string;
    family_cover_pic: string;
    blood_group: string;
    native_place: string;
    residential_address_line1: string;
    residential_address_state: string;
    residential_address_city: string;
    pin_code: string;
    residential_landline: string;
    office_address: string;
    office_address_state: string;
    office_address_city: string;
    office_address_pin: string;
    landline_office: string;
    mobile_no1: string;
    mobile_no2: string;
    date_of_demise: string;
};

type UseQueryResult<T> = {
    data: T | null;
    error: Error | null;
    loading: boolean;
};

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

export const useBirthdays = (filter: 'today' | 'month' | 'all' = 'all') => {
    const [result, setResult] = useState<UseQueryResult<Profile[]>>({
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

            const monthAbbreviations = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];

            const transformedData = data
                .map(profile => {
                    if (!profile.date_of_birth) return null;

                    const [day, monthAbbr, yearPart] = profile.date_of_birth.split('/');
                    const monthIndex = monthAbbreviations.findIndex(
                        m => m.toLowerCase() === monthAbbr.toLowerCase()
                    );

                    if (monthIndex === -1) return null;

                    const parsedDay = parseInt(day);
                    let fullYear = parseInt(yearPart);
                    if (yearPart.length === 2) {
                        fullYear = fullYear < 50 ? 2000 + fullYear : 1900 + fullYear;
                    }

                    const birthDate = new Date(fullYear, monthIndex, parsedDay);
                    let age = now.getFullYear() - birthDate.getFullYear();

                    if (
                        now.getMonth() < monthIndex ||
                        (now.getMonth() === monthIndex && now.getDate() < parsedDay)
                    ) {
                        age--;
                    }

                    const displayDate = new Date(
                        now.getFullYear(),
                        monthIndex,
                        parsedDay
                    ).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                    });

                    return {
                        id: `${profile.name}-${profile.date_of_birth}`,
                        name: `${profile.name} ${profile.surname || ''}`.trim(),
                        age: age.toString(),
                        date: displayDate,
                        image: profile.profile_pic || 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
                        phone: profile.mobile_no1,
                        email: profile.email,
                        monthIndex,
                        day: parsedDay,
                    };
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

            setResult({
                data: transformedData as unknown as Profile[],
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
        fetchBirthdays();
    }, [filter]);

    return { ...result, refetch: fetchBirthdays };
};

export const useFamilyVerification = (familyCode: string) => {
    const [result, setResult] = useState<UseQueryResult<Profile[]>>({
        data: null,
        error: null,
        loading: true,
    });

    const verifyFamilyCode = async () => {
        try {
            setResult(prev => ({ ...prev, loading: true }));
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('family_no', familyCode);

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
        if (familyCode) {
            verifyFamilyCode();
        }
    }, [familyCode]);

    return { ...result, refetch: verifyFamilyCode };
};