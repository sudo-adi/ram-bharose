import { useState } from 'react';
import { supabase } from '@/lib/supabase';// Assuming BusinessLoanApplicationData is defined in types.ts
import { uploadImage } from '../../utils/storage';

export const useFormSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitEvent = async (formData: any) => {
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

  const submitDonation = async (formData: any) => {
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

  const submitMulundHostelApplication = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      const { userId, ...applicationData } = formData;
      const dataToInsert: Record<string, any> = { user_id: userId };
      const imageFilesToUpload: { fieldName: string; file: File }[] = [];

      const imageFieldKeys = [
        'photograph',
        'aadhaar_card',
        'pan_card',
        'id_proof',
        'guardian_id_proof'
      ];

      const numericFieldKeys = [
        'year_of_study',
        'pincode',
        'permanent_pincode',
        'current_pincode'
      ];

      const booleanFieldKeys = ['declaration_signed'];

      for (const key in applicationData) {
        if (Object.prototype.hasOwnProperty.call(applicationData, key)) {
          const value = applicationData[key];
          if (imageFieldKeys.includes(key)) {
            imageFilesToUpload.push({ fieldName: key, file: value });
          } else if (numericFieldKeys.includes(key) && value !== null && value !== undefined && value !== '') {
            const numValue = parseFloat(value);
            dataToInsert[key] = isNaN(numValue) ? null : numValue;
          } else if (booleanFieldKeys.includes(key) && value !== undefined) {
            dataToInsert[key] = ['true', '1', 1, true, 'on'].includes(String(value).toLowerCase());
          } else if (value !== undefined) {
            dataToInsert[key] = value;
          }
        }
      }

      Object.keys(dataToInsert).forEach(key => {
        if (dataToInsert[key] === '') {
          dataToInsert[key] = null;
        }
      });
      const { data: insertedApp, error: insertError } = await supabase
        .from('mulund_hostel_form')
        .insert([dataToInsert])
        .select()
        .single();
      if (insertError) throw insertError;
      if (!insertedApp) throw new Error("Failed to insert hostel application data.");

      const applicationId = insertedApp.id;
      const uploadedImagePaths: Record<string, string | null> = {};
      for (const { fieldName, file } of imageFilesToUpload) {
        const path = await uploadImage(file, applicationId.toString(), fieldName);
        uploadedImagePaths[fieldName] = path;
      }

      const publicImageUrls: Record<string, string | null> = {};
      for (const [fieldName, path] of Object.entries(uploadedImagePaths)) {
        if (path) {
          const { data: publicUrl } = await supabase.storage
            .from('application-docs')
            .getPublicUrl(path);
          publicImageUrls[fieldName] = publicUrl?.publicUrl || null;
        }
      }

      if (Object.keys(publicImageUrls).length > 0 && Object.values(publicImageUrls).some(p => p !== null)) {
        const { error: updateError } = await supabase
          .from('mulund_hostel_form')
          .update(publicImageUrls)
          .eq('id', applicationId);

        if (updateError) throw updateError;
      }

      return true;
    } catch (err: any) {
      console.error("Error in submitMulundHostelApplication:", err);
      // Provide more detailed error message
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitGirlsHostelApplication = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      const { userId, ...applicationData } = formData;
      const dataToInsert: Record<string, any> = { user_id: userId };
      const imageFilesToUpload: { fieldName: string; file: File }[] = [];

      const imageFieldKeys = [
        'photograph',
        'aadhaar_card',
        'pan_card',
        'id_proof',
        'guardian_id_proof'
      ];

      const numericFieldKeys = [
        'year_of_study',
        'pincode',
        'permanent_pincode',
        'current_pincode'
      ];

      const booleanFieldKeys = ['declaration_signed'];

      for (const key in applicationData) {
        if (Object.prototype.hasOwnProperty.call(applicationData, key)) {
          const value = applicationData[key];
          if (imageFieldKeys.includes(key)) {
            imageFilesToUpload.push({ fieldName: key, file: value });
          } else if (numericFieldKeys.includes(key) && value !== null && value !== undefined && value !== '') {
            const numValue = parseFloat(value);
            dataToInsert[key] = isNaN(numValue) ? null : numValue;
          } else if (booleanFieldKeys.includes(key) && value !== undefined) {
            dataToInsert[key] = ['true', '1', 1, true, 'on'].includes(String(value).toLowerCase());
          } else if (value !== undefined) {
            dataToInsert[key] = value;
          }
        }
      }

      Object.keys(dataToInsert).forEach(key => {
        if (dataToInsert[key] === '') {
          dataToInsert[key] = null;
        }
      }); // Add this line to check the dataToInsert value
      const { data: insertedApp, error: insertError } = await supabase
        .from('girls_hostel_form')
        .insert([dataToInsert])
        .select()
        .single();
      if (insertError) throw insertError;
      if (!insertedApp) throw new Error("Failed to insert hostel application data.");
      const applicationId = insertedApp.id;
      const uploadedImagePaths: Record<string, string | null> = {};
      for (const { fieldName, file } of imageFilesToUpload) {
        const path = await uploadImage(file, applicationId.toString(), fieldName);
        uploadedImagePaths[fieldName] = path;
      }

      const publicImageUrls: Record<string, string | null> = {};
      for (const [fieldName, path] of Object.entries(uploadedImagePaths)) {
        if (path) {
          const { data: publicUrl } = await supabase.storage
            .from('application-docs')
            .getPublicUrl(path);
          publicImageUrls[fieldName] = publicUrl?.publicUrl || null;
        }
      }

      if (Object.keys(publicImageUrls).length > 0 && Object.values(publicImageUrls).some(p => p !== null)) {
        const { error: updateError } = await supabase
          .from('girls_hostel_form')
          .update(publicImageUrls)
          .eq('id', applicationId);

        if (updateError) throw updateError;
      }

      return true;
    } catch (err: any) {
      console.error("Error in submitGirlsHostelApplication:", err);
      // Provide more detailed error message
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submitEvent,
    submitDonation,
    submitGirlsHostelApplication,
    submitMulundHostelApplication
  };
};