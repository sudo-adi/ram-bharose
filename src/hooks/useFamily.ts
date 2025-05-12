import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

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

            // Get all profiles with the same email domain (same family)
            const emailParts = email.split('@');
            const emailDomain = emailParts[1];

            const { data: familyData, error: familyError } = await supabase
                .from('profiles')
                .select('*')
                .ilike('email', `%@${emailDomain}`);

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

// Function to update phone, address, and date of birth
export const updateProfileDetails = async (id: string, name: string, phone: string, address_line1: string, address_city: string, address_state: string, dateOfBirth: string) => {
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
            // Update the profile with the new image path (prev)
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