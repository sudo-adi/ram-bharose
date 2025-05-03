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

type UseQueryResult<T> = {
    data: T | null;
    error: Error | null;
    loading: boolean;
};

interface FamilyMember {
    id: string;
    name: string;
    profile_pic: string;
    relationship: string;
    occupation: string;
}

interface HeadOfFamily {
    name: string;
    profile_pic: string;
    occupation: string;
}

interface FamilyData {
    family_no: string;
    family_cover_pic: string;
    surname: string;
    address: string;
    head_of_family: HeadOfFamily;
    familyMembers: FamilyMember[];
}

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

export const useFamily = () => {
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<FamilyData>({
        family_no: '',
        family_cover_pic: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1000',
        surname: '',
        address: '',
        head_of_family: {
            name: '',
            profile_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
            occupation: ''
        },
        familyMembers: []
    });

    const fetchFamily = async (email: string | undefined) => {
        if (!email) return;

        try {
            const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', email)
                .single();

            if (userError || !userData) {
                throw userError || new Error('User not found');
            }

            const { data: familyData, error: familyError } = await supabase
                .from('profiles')
                .select('*')
                .eq('family_no', userData.family_no);

            if (familyError || !familyData) {
                throw familyError || new Error('Family data not found');
            }

            const headOfFamily = familyData.find(member => member.relationship?.toLowerCase() === 'self') || userData;
            const address = [
                userData.residential_address_line1,
                userData.residential_address_city,
                userData.residential_address_state
            ].filter(Boolean).join(', ');

            // Get the family cover image URL from Supabase storage
            const coverImagePath = userData.family_cover_pic;
            const { data: coverImageUrl } = await supabase
                .storage
                .from('family-cover-images')
                .getPublicUrl(coverImagePath || '');

            // Get profile picture URLs for head of family and all family members
            const { data: headProfileUrl } = await supabase
                .storage
                .from('profile-pictures')
                .getPublicUrl(headOfFamily.profile_pic || '');

            // Transform family data to include public URLs for profile pictures
            const transformedFamilyData = await Promise.all(familyData.map(async (member) => {
                const { data: profileUrl } = await supabase
                    .storage
                    .from('profile-pictures')
                    .getPublicUrl(member.profile_pic || '');
                return {
                    ...member,
                    profile_pic: profileUrl?.publicUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
                };
            }));

            setResult({
                family_no: userData.family_no,
                family_cover_pic: coverImageUrl?.publicUrl || 'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1000',
                surname: userData.surname,
                address: address,
                head_of_family: {
                    name: headOfFamily.name,
                    profile_pic: headProfileUrl?.publicUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
                    occupation: headOfFamily.occupation || 'Not specified'
                },
                familyMembers: transformedFamilyData
            });
        } catch (error) {
            setResult({
                family_no: '',
                family_cover_pic: '',
                surname: '',
                address: '',
                head_of_family: null,
                familyMembers: []
            });
            setError(error);
        }
    };

    useEffect(() => {
        fetchFamily('');
    }, []);

    return { result, fetchFamily, error };
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

