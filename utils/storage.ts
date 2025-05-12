import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

export const uploadImage = async (file: any, id: number) => {
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