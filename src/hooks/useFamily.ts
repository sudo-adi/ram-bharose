import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

interface FamilyMember {
    id: string;
    name: string;
    profile_pic: string | null; // Changed to allow null
    relationship: string;
    occupation: string;
    gender: string;
    date_of_birth: string;
    mobile_no1: string;
    age?: number; // Added age for placeholder logic
}

interface HeadOfFamily {
    name: string;
    profile_pic: string | null; // Changed to allow null
    occupation: string;
    gender: string;
    age?: number; // Added age for placeholder logic
}

interface FamilyData {
    family_no: string;
    family_cover_pic: string;
    surname: string;
    address: string;
    head_of_family: HeadOfFamily | null;
    familyMembers: FamilyMember[];
}

// Function to calculate age from date of birth
const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const useFamily = () => {
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<FamilyData>({
        family_no: '',
        family_cover_pic: 'https://kmxrfddgzveqlmsvmsub.supabase.co/storage/v1/object/public/application-images//family-placeholder.jpeg',
        surname: '',
        address: '',
        head_of_family: null,
        familyMembers: []
    });

    const fetchFamily = async (userPhone: string | undefined) => {
        if (!userPhone) return;

        try {
            // First, get the user's profile using their phone number
            const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('*')
                .eq('mobile_no1', userPhone)
                .single();

            if (userError || !userData) {
                throw userError || new Error('User not found');
            }

            // Get all family members using the same family_no
            const { data: familyData, error: familyError } = await supabase
                .from('profiles')
                .select('*')
                .eq('family_no', userData.family_no);

            if (familyError || !familyData) {
                throw familyError || new Error('Family data not found');
            }

            // Find head of family - look for relationships that indicate head of family
            // In Indian families, typically father is head, or if no father, then mother
            let headOfFamily = familyData.find(member =>
                member.relationship?.toLowerCase() === 'self' ||
                (member.gender?.toLowerCase() === 'male' &&
                 (member.relationship?.toLowerCase().includes('father') ||
                  member.relationship?.toLowerCase() === 'head'))
            );

            // If no clear head found, use the first male member, then first member
            if (!headOfFamily) {
                headOfFamily = familyData.find(member => member.gender?.toLowerCase() === 'male') || familyData[0];
            }

            // Build address from residential address fields
            const address = [
                userData.residential_address_line1,
                userData.residential_address_city,
                userData.residential_address_state
            ].filter(Boolean).join(', ');

            // Get the family cover image URL from Supabase storage
            let coverImageUrl = 'https://kmxrfddgzveqlmsvmsub.supabase.co/storage/v1/object/public/application-images//family-placeholder.jpeg';
            if (userData.family_cover_pic) {
                const { data: coverImageData } = await supabase
                    .storage
                    .from('family-cover-images')
                    .getPublicUrl(userData.family_cover_pic);
                if (coverImageData?.publicUrl) {
                    coverImageUrl = coverImageData.publicUrl;
                }
            }

            // Get profile picture URL for head of family (or null if not available)
            let headProfileUrl: string | null = null;
            if (headOfFamily?.profile_pic) {
                const { data: headProfileData } = await supabase
                    .storage
                    .from('profile-pictures')
                    .getPublicUrl(headOfFamily.profile_pic);
                if (headProfileData?.publicUrl) {
                    headProfileUrl = headProfileData.publicUrl;
                }
            }

            // Transform family data to include public URLs for profile pictures (or null)
            const transformedFamilyData = await Promise.all(familyData.map(async (member) => {
                let profileUrl: string | null = null;
                if (member.profile_pic) {
                    const { data: profileData } = await supabase
                        .storage
                        .from('profile-pictures')
                        .getPublicUrl(member.profile_pic);
                    if (profileData?.publicUrl) {
                        profileUrl = profileData.publicUrl;
                    }
                }

                const age = calculateAge(member.date_of_birth);

                return {
                    id: member.id,
                    name: member.name || 'Unknown',
                    profile_pic: profileUrl, // Now can be null
                    relationship: member.relationship || 'Family Member',
                    occupation: member.occupation || 'Not specified',
                    gender: member.gender || 'Not specified',
                    date_of_birth: member.date_of_birth || '',
                    mobile_no1: member.mobile_no1 || '',
                    age: age
                };
            }));

            const headAge = calculateAge(headOfFamily?.date_of_birth || '');

            setResult({
                family_no: userData.family_no || '',
                family_cover_pic: coverImageUrl,
                surname: userData.surname || '',
                address: address,
                head_of_family: headOfFamily ? {
                    name: headOfFamily.name || 'Unknown',
                    profile_pic: headProfileUrl, // Now can be null
                    occupation: headOfFamily.occupation || 'Not specified',
                    gender: headOfFamily.gender || 'Not specified',
                    age: headAge
                } : null,
                familyMembers: transformedFamilyData
            });
        } catch (error) {
            console.error('Error fetching family data:', error);
            setResult({
                family_no: '',
                family_cover_pic: 'https://kmxrfddgzveqlmsvmsub.supabase.co/storage/v1/object/public/application-images//family-placeholder.jpeg',
                surname: '',
                address: '',
                head_of_family: null,
                familyMembers: []
            });
            setError(error as string);
        }
    };

    useEffect(() => {
        // Don't fetch with empty string by default
    }, []);

    return { result, fetchFamily, error };
};

// Function to update phone, address, and date of birth
export const updateProfileDetails = async (
    id: string,
    name: string,
    phone: string,
    address_line1: string,
    address_city: string,
    address_state: string,
    dateOfBirth: string
) => {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({
                name: name,
                mobile_no1: phone,
                residential_address_line1: address_line1,
                residential_address_city: address_city,
                residential_address_state: address_state,
                date_of_birth: dateOfBirth
            })
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error updating profile details:', error);
        return { success: false, error };
    }
};

// Function to upload cover image and update profile
export const uploadCoverImage = async (userId: string, imageUri: string, bucket: string) => {
    try {
        // Generate a unique filename using userId and timestamp
        const filename = `cover_${userId}_${Date.now()}`;

        // Convert image to base64
        const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });

        // Get file extension from URI
        const fileExtension = imageUri.split('.').pop();
        const filePath = `${filename}.${fileExtension}`;
        const contentType = `image/${fileExtension}`;

        // Upload image to Supabase storage
        const { data, error: uploadError } = await supabase
            .storage
            .from(bucket)
            .upload(filePath, decode(base64), { contentType });

        if (uploadError) throw uploadError;

        if (bucket === 'profile-pictures') {
            // Update the profile with the new image path
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ profile_pic: data.path })
                .eq('id', userId);

            if (updateError) throw updateError;
        } else {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ family_cover_pic: data.path })
                .eq('id', userId);
            if (updateError) throw updateError;
        }

        // Get public URL for the uploaded image
        const { data: publicUrlData } = await supabase
            .storage
            .from(bucket)
            .getPublicUrl(data.path);

        return {
            success: true,
            path: data.path,
            publicUrl: publicUrlData.publicUrl
        };
    } catch (error) {
        console.error('Error uploading cover image:', error);
        return { success: false, error };
    }
};