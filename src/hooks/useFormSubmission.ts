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

  const submitBusinessLoanApplication = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      const { userId, ...applicationData } = formData;
      const dataToInsert: Record<string, any> = { user_id: userId }; // Ensure userId is correctly passed and named
      const imageFilesToUpload: { fieldName: string; file: File }[] = [];

      const imageFieldKeys = [
        'bank_statements_url', 'itr_documents_url', 'pan_card_url', 'aadhaar_card_url',
        'gst_certificate_url', 'audited_financial_statements_url', 'udyam_registration_url',
        'business_address_proof_url', 'collateral_documents_url', 'applicant_photo_url',
        'co_applicant_photo_url', 'applicant_signature_url', 'co_applicant_signature_url'
      ];

      const numericFieldKeys = [
        'cibil_score', 'annual_turnover', 'net_profit', 'monthly_revenue',
        'current_liabilities', 'annual_turnover_year1', 'annual_turnover_year2',
        'annual_turnover_year3', 'net_profit_year1', 'net_profit_year2', 'net_profit_year3',
        'loan_amount', 'loan_tenure', 'preferred_emi', 'co_applicant_annual_income',
        'co_applicant_cibil_score', 'collateral_asset_value'
      ];

      const booleanFieldKeys = ['has_collateral', 'declaration_accepted'];

      for (const key in applicationData) {
        if (Object.prototype.hasOwnProperty.call(applicationData, key)) {
          const value = applicationData[key];
          if (imageFieldKeys.includes(key) && value instanceof File) {
            imageFilesToUpload.push({ fieldName: key, file: value });
          } else if (numericFieldKeys.includes(key) && value !== null && value !== undefined && value !== '') {
            const numValue = parseFloat(value);
            dataToInsert[key] = isNaN(numValue) ? null : numValue;
          } else if (key === 'monthly_revenue_6months' && typeof value === 'string' && value.trim() !== '') {
            dataToInsert[key] = value.split(',').map((s: string) => parseFloat(s.trim())).filter((n: number) => !isNaN(n));
          } else if (booleanFieldKeys.includes(key) && value !== undefined) {
            dataToInsert[key] = ['true', '1', 1, true, 'on'].includes(String(value).toLowerCase());
          } else if (value !== undefined) { // Ensure not to insert undefined values
            dataToInsert[key] = value;
          }
        }
      }

      // Remove properties that are null or empty strings if the DB expects them to be absent or has defaults
      Object.keys(dataToInsert).forEach(key => {
        if (dataToInsert[key] === '') {
          // Based on schema, let's assume null is acceptable for optional empty fields.
          dataToInsert[key] = null;
        }
      });

      const { data: insertedApp, error: insertError } = await supabase
        .from('business_loan_applications') // Make sure this table name is correct
        .insert([dataToInsert])
        .select()
        .single();

      if (insertError) throw insertError;
      if (!insertedApp) throw new Error("Failed to insert business loan application data.");

      const applicationId = insertedApp.id;
      const uploadedImagePaths: Record<string, string | null> = {};

      for (const { fieldName, file } of imageFilesToUpload) {
        // Assumes uploadImage(file: File, recordId: string, subfolderNameForField?: string)
        const path = await uploadImage(file, applicationId.toString(), fieldName);
        uploadedImagePaths[fieldName] = path;
      }

      if (Object.keys(uploadedImagePaths).length > 0 && Object.values(uploadedImagePaths).some(p => p !== null)) {
        const { error: updateError } = await supabase
          .from('business_loan_applications')
          .update(uploadedImagePaths)
          .eq('id', applicationId);

        if (updateError) throw updateError;
      }

      return true;
    } catch (err: any) {
      console.error("Error in submitBusinessLoanApplication:", err);
      setError(err.message);
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
          if (imageFieldKeys.includes(key) && value instanceof File) {
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

      if (Object.keys(uploadedImagePaths).length > 0 && Object.values(uploadedImagePaths).some(p => p !== null)) {
        const { error: updateError } = await supabase
          .from('mulund_hostel_form')
          .update(uploadedImagePaths)
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

  return {
    loading,
    error,
    submitEvent,
    submitDonation,
    submitBusinessLoanApplication,
    submitMulundHostelApplication
  };
};