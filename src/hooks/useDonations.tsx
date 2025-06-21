import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export const useDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getImageUrl = async (imageName) => {
    try {
      if (!imageName) {
        return "https://via.placeholder.com/400x200"; // Fallback image
      }

      const { data, error } = await supabase.storage
        .from('application-docs')
        .createSignedUrl(imageName, 60 * 60 * 24); // 24 hours expiry

      if (error) {
        console.error('Error getting image URL:', error);
        return "https://via.placeholder.com/400x200"; // Fallback on error
      }

      return data.signedUrl;
    } catch (err) {
      console.error('Error creating signed URL:', err);
      return "https://via.placeholder.com/400x200"; // Fallback on error
    }
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data and fetch images
      const transformedDonations = await Promise.all(
        data.map(async (donation) => {
          const imageUrl = await getImageUrl(donation.image_url);
          
          return {
            id: donation.id,
            title: donation.cause,
            description: donation.description,
            organization: "Community Support", // You might want to add this field to your schema
            impact: `₹${donation.collected_amount} raised of ₹${donation.amount} goal`,
            image: imageUrl, // Use the downloaded image URL
            additionalInfo: `Open till: ${new Date(donation.open_till).toLocaleDateString()}`,
            donationOptions: [
              {
                amount: "₹100",
                description: "Support with a small contribution"
              },
              {
                amount: "₹500",
                description: "Help make a bigger impact"
              },
              {
                amount: "₹1000",
                description: "Be a major supporter"
              },
              {
                amount: "₹2000",
                description: "Champion this cause"
              }
            ],
            // Add original fields for reference
            original: donation
          };
        })
      );

      setDonations(transformedDonations);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const refetch = () => {
    fetchDonations();
  };

  return {
    donations,
    loading,
    error,
    refetch
  };
};