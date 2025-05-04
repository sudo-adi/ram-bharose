import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

// Form Types
interface EventFormData {
    userId: string;
    name: string;
    description: string;
    startTime: string;
    duration: string;
    organizers: string[];  // Changed to string array
    image?: File;
}

interface DonationFormData {
    userId: string;
    amount: number;
    description: string;
    cause: string;
    openTill: string;
    image?: File;
}

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

type ShubhChintak = {
    id: number;
    created_at: string;
    cover_image: string;
    file_url: string;
    title: string;
};

type UseQueryResult<T> = {
    data: T | null;
    error: Error | null;
    loading: boolean;
};

type Committee = {
    id: number;
    created_at: string;
    name: string;
    phone: string;
    location: string;
    member_name: string;
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

// New hook for ShubhChintak table
export const useShubhChintak = (limit?: number) => {
    const [result, setResult] = useState<UseQueryResult<ShubhChintak[]>>({
        data: null,
        error: null,
        loading: true,
    });

    const fetchShubhChintak = async () => {
        try {
            setResult(prev => ({ ...prev, loading: true }));

            let query = supabase
                .from('shubh_chintak')
                .select('*')
                .order('created_at', { ascending: false });

            if (limit) {
                query = query.limit(limit);
            }

            const { data, error } = await query;

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
        fetchShubhChintak();
    }, [limit]);

    return { ...result, refetch: fetchShubhChintak };
};

// Form submission hooks
export const useFormSubmission = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (file: any, id: number) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' });
            const fileExtension = file.mimeType.split('/')[1];
            const filePath = `${id}.${fileExtension}`;
            const contentType = file.mimeType;
            const { data, error } = await supabase
                .storage
                .from('application-pictures')
                .upload(filePath, decode(base64), { contentType })
            if (error) {
                console.error(error);
                throw error;
            }
            return data.path;
        } catch (error: any) {
            throw new Error(error);

        }
    };

    const submitEvent = async (formData: EventFormData) => {
        setLoading(true);
        setError(null);

        try {
            // Convert organizers array to PostgreSQL array format
            const organizersArray = `{${formData.organizers.join(',')}}`;

            // First submit the event data without image
            const { data: eventData, error: insertError } = await supabase
                .from('event_applications')
                .insert([
                    {
                        user_id: formData.userId,
                        name: formData.name,
                        description: formData.description,
                        start_at: formData.startTime,
                        duration: formData.duration,
                        organizers: organizersArray,
                    }
                ])
                .select();

            if (insertError) throw insertError;

            // Then upload image if exists using the event ID
            let imagePath = null;
            if (formData.image && eventData?.[0]?.id) {

                imagePath = await uploadImage(formData.image, eventData[0].id);

                // Update the event with image path
                const { error: updateError } = await supabase
                    .from('event_applications')
                    .update({ image_url: imagePath })
                    .eq('id', eventData[0].id);

                if (updateError) throw updateError;
            }

            return true;
        } catch (error: any) {
            setError(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const submitDonation = async (formData: DonationFormData) => {
        setLoading(true);
        setError(null);

        try {
            // First submit the donation data without image
            const { data: donationData, error: insertError } = await supabase
                .from('donation_applications')
                .insert([
                    {
                        user_id: formData.userId,
                        amount: formData.amount,
                        description: formData.description,
                        cause: formData.cause,
                        open_till: formData.openTill,
                    }
                ])
                .select();

            if (insertError) throw insertError;

            // Then upload image if exists using the donation ID
            let imagePath = null;
            if (formData.image && donationData?.[0]?.id) {
                imagePath = await uploadImage(formData.image, donationData[0].id);

                // Update the donation with image path
                const { error: updateError } = await supabase
                    .from('donation_applications')
                    .update({ image_url: imagePath })
                    .eq('id', donationData[0].id);

                if (updateError) throw updateError;
            }

            return true;
        } catch (error: any) {
            setError(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        submitEvent,
        submitDonation
    };
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

export const useCommittees = () => {
    const [result, setResult] = useState<UseQueryResult<Committee[]>>({
        data: null,
        error: null,
        loading: true,
    });

    const fetchCommittees = async () => {
        try {
            setResult(prev => ({ ...prev, loading: true }));
            const { data, error } = await supabase
                .from('committee')  // Make sure this matches your table name exactly
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
        fetchCommittees();
    }, []);

    return { ...result, refetch: fetchCommittees };
};



// Add this type to your existing types
type CommitteeImage = {
    name: string;
    url: string;
    created_at: string;
    size: number;
    contentType: string;
};

// Add this hook to your existing hooks
export const useCommitteeImages = () => {
    const [result, setResult] = useState<UseQueryResult<CommitteeImage[]>>({
        data: null,
        error: null,
        loading: true,
    });

    const fetchCommitteeImages = async () => {
        try {
            setResult(prev => ({ ...prev, loading: true }));

            // List all files in the committee_pictures bucket
            const { data: files, error } = await supabase
                .storage
                .from('committee-pictures')
                .list();

            if (error) throw error;

            // Get public URLs for each image
            const images = await Promise.all(
                files.map(async (file) => {
                    const { data: { publicUrl } } = supabase
                        .storage
                        .from('committee-pictures')
                        .getPublicUrl(file.name);

                    return {
                        name: file.name,
                        url: publicUrl,
                        created_at: file.created_at,
                        size: file.metadata?.size || 0,
                        contentType: file.metadata?.mimetype || 'image/jpeg',
                    };
                })
            );

            setResult({
                data: images,
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
        fetchCommitteeImages();
    }, []);

    return { ...result, refetch: fetchCommitteeImages };
};