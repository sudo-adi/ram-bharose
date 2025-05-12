import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { EventFormData, DonationFormData } from '../../types';
import { uploadImage } from '../../utils/storage';

export const useFormSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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